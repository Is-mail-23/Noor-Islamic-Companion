import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Mosque } from '../types';
import { Check, X, Building2, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminDashboardProps {
  userRole: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ userRole }) => {
  const [pendingMosques, setPendingMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'mosques'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbMosques: Mosque[] = [];
      snapshot.forEach((doc) => {
        dbMosques.push({ id: doc.id, ...doc.data() } as Mosque);
      });
      setPendingMosques(dbMosques);
      setLoading(false);
    });

    
  if (userRole !== 'admin') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-text-primary font-serif-title text-center mb-2">Access Denied</h2>
        <p className="text-text-secondary text-center max-w-md mb-6">
          You must be an App Administrator to view the Global Dashboard. Regular users can still manage their local mosques using the Mosque Pins on the map.
        </p>
        <p className="text-sm text-text-secondary text-center max-w-md">
          To switch to Admin Mode, go to your <b>Profile</b> page and tap the red "Make Me Admin" button next to your role.
        </p>
      </div>
    );
  }

  return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, 'mosques', id), { status: 'approved' });
      alert("Mosque approved and is now live on the map.");
    } catch (error) {
      console.error("Error approving mosque:", error);
      alert("Failed to approve mosque.");
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm("Are you sure you want to reject and delete this mosque request?")) {
      try {
        await deleteDoc(doc(db, 'mosques', id));
        alert("Mosque request rejected.");
      } catch (error) {
        console.error("Error rejecting mosque:", error);
        alert("Failed to reject mosque.");
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-4 border-[#c6a55e] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-black text-text-primary font-serif-title mb-2">Admin Dashboard</h1>
        <p className="text-sm text-text-secondary">Review and manage community mosque submissions.</p>
      </div>

      {pendingMosques.length === 0 ? (
        <div className="bg-bg-surface border border-border-primary rounded-2xl p-12 text-center">
          <Building2 className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-text-primary mb-2">No Pending Submissions</h3>
          <p className="text-sm text-text-secondary">All mosque requests have been processed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingMosques.map((mosque) => (
            <motion.div
              key={mosque.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg-surface border border-border-primary rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
            >
              <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0 border border-border-primary">
                <img src={mosque.coverImage} alt={mosque.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-xl font-bold text-[#c6a55e]">{mosque.name}</h3>
                  {mosque.arabicName && <p className="text-sm text-text-secondary font-arabic">{mosque.arabicName}</p>}
                </div>
                
                <div className="flex items-start gap-1.5 text-xs text-text-secondary">
                  <MapPin className="w-4 h-4 shrink-0 text-[#c6a55e]/70" />
                  <span>{mosque.address}, {mosque.city} <br /> (Lat: {mosque.lat.toFixed(4)}, Lng: {mosque.lng.toFixed(4)})</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Clock className="w-4 h-4 shrink-0 text-[#c6a55e]/70" />
                  <span>Requested: {new Date(mosque.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex w-full sm:w-auto flex-row sm:flex-col gap-2 shrink-0 border-t border-border-primary sm:border-t-0 pt-4 sm:pt-0">
                <button
                  onClick={() => handleApprove(mosque.id)}
                  className="flex-1 px-4 py-2 bg-[#1b4332] hover:bg-[#2d6a4f] border border-[#40916c] text-[#d8f3dc] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => handleReject(mosque.id)}
                  className="flex-1 px-4 py-2 bg-[#4c1d24] hover:bg-[#590d22] border border-[#800f2f] text-[#ffb3c6] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
