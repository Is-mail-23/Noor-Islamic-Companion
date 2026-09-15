import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mosque, SolarTimes, NextPrayerInfo } from './types';
import { loadStoredMosques, saveMosques } from './data/defaultMosques';
import { calculateSolarTimes, getNextPrayer } from './utils/prayerTimes';
import { Navbar } from './components/Navbar';
import { MasjidMap } from './components/MasjidMap';
import { MasjidProfileModal } from './components/MasjidProfileModal';
import { MasjidAdminModal } from './components/MasjidAdminModal';
import { AllocateMasjidModal } from './components/AllocateMasjidModal';
import { TasbeehCounter } from './components/TasbeehCounter';
import { PrayerTimesSection } from './components/PrayerTimesSection';
import { DuasSection } from './components/DuasSection';
import { QuranSection } from './components/QuranSection';
import { AdminDashboard } from './components/AdminDashboard';
import { AICompanion } from './components/AICompanion';
import { UserProfile } from './components/UserProfile';
import { SplashScreen } from './components/SplashScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { auth, db, signInWithGoogle, logout } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, collection, onSnapshot, query, where, addDoc, updateDoc } from 'firebase/firestore';

export default function App() {
  const [mosques, setMosques] = useState<Mosque[]>(() => loadStoredMosques());
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'tasbeeh' | 'prayer_times' | 'duas' | 'quran' | 'profile' | 'admin' | 'settings'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [userZikrCount, setUserZikrCount] = useState<number>(0);
  const [userSearchHistory, setUserSearchHistory] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Selected modals
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [adminMosque, setAdminMosque] = useState<Mosque | null>(null);
  const [isAllocateOpen, setIsAllocateOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [allocateCoords, setAllocateCoords] = useState<{ lat: number; lng: number } | null>(null);

  // User location & prayer calculations
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [cityName, setCityName] = useState<string>('Local Area');
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(null);

  // Auto-detect user geolocation
  const detectLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(coords);
          setCityName('Current Location');
          const solar = calculateSolarTimes(coords.lat, coords.lng);
          setNextPrayer(getNextPrayer(solar));
        },
        () => {
          // If denied, fallback to initial mosque coords
          if (mosques.length > 0) {
            const defaultCoords = { lat: mosques[0].lat, lng: mosques[0].lng };
            const solar = calculateSolarTimes(defaultCoords.lat, defaultCoords.lng);
            setNextPrayer(getNextPrayer(solar));
          }
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    }
  };

  useEffect(() => {
    detectLocation();

    // Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        
        // Listen to user doc changes to keep search history and zikr count in sync
        const unsubscribeUser = onSnapshot(userRef, (userSnap) => {
          if (userSnap.exists()) {
            setUserRole(userSnap.data().role || 'user');
            setUserZikrCount(userSnap.data().zikrCount || 0);
            setUserSearchHistory(userSnap.data().searchHistory || []);
          }
        });
        
        return () => unsubscribeUser();
      } else {
        setUserRole('user');
        setUserZikrCount(0);
        setUserSearchHistory([]);
      }
    });

    // Fetch approved mosques from Firestore
    const q = query(collection(db, 'mosques'), where('status', '==', 'approved'));
    const unsubscribeMosques = onSnapshot(q, (snapshot) => {
      const dbMosques: Mosque[] = [];
      snapshot.forEach((doc) => {
        dbMosques.push({ id: doc.id, ...doc.data() } as Mosque);
      });
      // Merge with default local mosques
      setMosques((prev) => {
        const local = loadStoredMosques();
        const merged = [...local];
        dbMosques.forEach((dbM) => {
          if (!merged.find(m => m.id === dbM.id)) {
            merged.push(dbM);
          }
        });
        return merged;
      });
    });

    // Minimum splash screen duration
    const splashTimer = setTimeout(() => {
      setInitialLoading(false);
    }, 2800);

    return () => {
      unsubscribe();
      unsubscribeMosques();
      clearTimeout(splashTimer);
    };
  }, []);

  // Update next prayer on clock tick
  useEffect(() => {
    const lat = userCoords?.lat || (mosques[0]?.lat ?? 23.8103);
    const lng = userCoords?.lng || (mosques[0]?.lng ?? 90.4125);
    const solar = calculateSolarTimes(lat, lng);
    setNextPrayer(getNextPrayer(solar));

    const interval = setInterval(() => {
      setNextPrayer(getNextPrayer(solar));
    }, 5000);
    return () => clearInterval(interval);
  }, [userCoords, mosques]);

  // Handle saving mosque updates from admin
  const handleSaveMosque = async (updated: Mosque) => {
    // Also save to Firebase if it exists there
    if (user && userRole === 'admin') {
      try {
        const mosqueRef = doc(db, 'mosques', updated.id);
        const sanitizedData = Object.fromEntries(Object.entries(updated).filter(([_, v]) => v !== undefined));
        await updateDoc(mosqueRef, sanitizedData as any);
      } catch (e) {
        console.error("Error updating in Firebase", e);
      }
    }

    setMosques((prev) => {
      const next = prev.map((m) => (m.id === updated.id ? updated : m));
      saveMosques(next);
      return next;
    });

    if (selectedMosque && selectedMosque.id === updated.id) {
      setSelectedMosque(updated);
    }
  };

  const recordMosqueView = async (mosque: Mosque) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        let history = userSnap.data().searchHistory || [];
        // Remove if already exists
        history = history.filter((m: any) => m.id !== mosque.id);
        // Add to front
        history.unshift({ id: mosque.id, name: mosque.name, city: mosque.city, timestamp: new Date().toISOString() });
        // Keep only last 10
        if (history.length > 10) history = history.slice(0, 10);
        
        await updateDoc(userRef, { searchHistory: history });
      }
    } catch (e) {
      console.error("Error saving search history", e);
    }
  };

  const handleSelectMosque = (m: Mosque) => {
    setSelectedMosque(m);
    recordMosqueView(m);
  };

  const handleAddMosque = async (newMosque: Mosque) => {
    if (!user) return;
    try {
      const status = userRole === 'admin' ? 'approved' : 'pending';
      const mosqueData = { ...newMosque, status, createdBy: user.uid, createdAt: new Date().toISOString() };
      const sanitizedData = Object.fromEntries(Object.entries(mosqueData).filter(([_, v]) => v !== undefined));
      
      await addDoc(collection(db, 'mosques'), sanitizedData);
      
      if (status === 'approved') {
        alert("Mosque added successfully!");
        setSelectedMosque(newMosque);
      } else {
        alert("Mosque allocation request submitted! It will appear on the map after admin review.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to submit request");
    }
  };

  const handleStartAllocate = (coords?: { lat: number; lng: number }) => {
    if (!user) {
      if (window.confirm("Please sign in with Google to request a mosque allocation.")) {
        signInWithGoogle();
      }
      return;
    }
    setAllocateCoords(coords || userCoords || { lat: mosques[0]?.lat || 23.8103, lng: mosques[0]?.lng || 90.4125 });
    setIsAllocateOpen(true);
  };

  if (initialLoading) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAllocateClick={() => handleStartAllocate()}
        nextPrayer={nextPrayer}
        mosquesCount={mosques.length}
        user={user}
        userRole={userRole}
        onSignIn={() => setIsAuthOpen(true)}
        onSignOut={logout}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <HomeDashboard 
                setActiveTab={setActiveTab}
                user={user}
                nextPrayer={nextPrayer}
              />
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <MasjidMap
                mosques={mosques}
                onSelectMosque={handleSelectMosque}
                onOpenAdmin={(m) => setAdminMosque(m)}
                onAllocateMosqueClick={(coords) => handleStartAllocate(coords)}
                userCoords={userCoords}
                onLocationFound={(coords) => {
                  setUserCoords(coords);
                  setCityName('Current Location');
                }}
                searchHistory={userSearchHistory}
              />
            </motion.div>
          )}

          {activeTab === 'tasbeeh' && (
            <motion.div
              key="tasbeeh-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <TasbeehCounter user={user} initialTotalCount={userZikrCount} />
            </motion.div>
          )}

          {activeTab === 'prayer_times' && (
            <motion.div
              key="prayer-times-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <PrayerTimesSection
                userCoords={userCoords}
                cityName={cityName}
                onRefreshLocation={detectLocation}
              />
            </motion.div>
          )}

          {activeTab === 'duas' && (
            <motion.div
              key="duas-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <DuasSection />
            </motion.div>
          )}

          {activeTab === 'quran' && (
            <motion.div
              key="quran-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <QuranSection />
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <AdminDashboard userRole={userRole} />
            </motion.div>
          )}

          {activeTab === 'profile' && user && (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <UserProfile
                user={user}
                userRole={userRole}
                userZikrCount={userZikrCount}
                userSearchHistory={userSearchHistory}
                onSignOut={() => {
                  logout();
                  setActiveTab('map');
                }}
              />
            </motion.div>
          )}

          {activeTab === 'ai_companion' && (
            <motion.div
              key="ai-companion-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <AICompanion />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-primary bg-[#0e1115] py-6 text-center text-xs text-text-secondary">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#c6a55e] font-serif-title tracking-wider">Noor App</span>
            <span className="text-border-primary">•</span>
            <span>Masjid Allocation & 5 Waqt Namaj Network</span>
          </div>
          <div className="text-text-secondary">
            Swipe Tasbeeh • Solar Sunrise & Sunset • Authentic Duas & Quran
          </div>
        </div>
      </footer>

      {/* Modals */}
      
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSignIn={async (role, code) => {
          await signInWithGoogle(role, code);
          setIsAuthOpen(false);
        }}
      />
<SettingsModal 
        isOpen={activeTab === 'settings'} 
        onClose={() => setActiveTab('map')} 
      />

      {selectedMosque && (
        <MasjidProfileModal
          mosque={selectedMosque}
          onClose={() => setSelectedMosque(null)}
          onOpenAdmin={(m) => {
            setSelectedMosque(null);
            setAdminMosque(m);
          }}
        />
      )}

      {adminMosque && (
        <MasjidAdminModal
          mosque={adminMosque}
          onClose={() => setAdminMosque(null)}
          onSaveMosque={handleSaveMosque}
          userRole={userRole}
        />
      )}

      {isAllocateOpen && (
        <AllocateMasjidModal
          initialCoords={allocateCoords}
          onClose={() => {
            setIsAllocateOpen(false);
            setAllocateCoords(null);
          }}
          onAddMosque={handleAddMosque}
        />
      )}
    </div>
  );
}
