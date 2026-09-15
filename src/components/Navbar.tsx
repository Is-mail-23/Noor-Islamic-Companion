import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Sparkles,
  BookOpen,
  Sun,
  Building2,
  PlusCircle,
  Calendar,
  Clock,
  UserCircle,
  LogOut,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NextPrayerInfo } from '../types';
import { User } from 'firebase/auth';

export type ActiveTab = 'home' | 'map' | 'tasbeeh' | 'prayer_times' | 'duas' | 'quran' | 'profile' | 'admin' | 'settings' | 'ai_companion';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onAllocateClick: () => void;
  nextPrayer: NextPrayerInfo | null;
  mosquesCount: number;
  user: User | null;
  userRole: string;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onAllocateClick,
  nextPrayer,
  mosquesCount,
  user,
  userRole,
  onSignIn,
  onSignOut
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const today = new Date();
  const gregorianDateStr = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 bg-[#0e1115]/95 backdrop-blur-xl border-b border-border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-[#c6a55e] shadow-lg shadow-black/60 flex items-center justify-center text-bg-primary group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2L10 5H14L12 2Z" />
                <path d="M12 5C8.5 5 7 8 7 10V21H17V10C17 8 15.5 5 12 5ZM12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18Z"/>
                <path d="M4 11V21H6V11H4ZM18 11V21H20V11H18Z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-text-primary tracking-wide">
                  Noor <span className="font-arabic text-[#c6a55e] font-normal text-lg ml-0.5">نور</span>
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c6a55e] bg-[#c6a55e]/10 px-2 py-0.5 rounded-md border border-[#c6a55e]/25 hidden sm:inline-block">
                  Islamic App
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Action: Allocate Mosque Button & User Profile */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('settings' as ActiveTab)}
              className="w-9 h-9 rounded-full bg-bg-surface border border-border-primary text-text-secondary hover:text-text-primary hover:border-[#c6a55e] flex items-center justify-center transition-all"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            
            {activeTab === 'map' && (
              <button
                id="header-allocate-btn"
                onClick={onAllocateClick}
                className="px-3.5 py-2 rounded-xl bg-[#c6a55e] hover:bg-[#d6b772] text-bg-primary font-bold text-xs sm:text-sm shadow-md shadow-black/40 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Allocate Mosque</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}

            <div className="relative">
              {user ? (
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-border-primary hover:border-[#c6a55e] transition-colors"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-bg-surface flex items-center justify-center text-[#c6a55e] font-bold text-sm">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={onSignIn}
                  className="px-3.5 py-2 rounded-xl bg-bg-surface hover:bg-[#1c222a] border border-border-primary text-text-primary font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <UserCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Profile Dropdown */}
              {user && profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-bg-surface border border-border-primary rounded-xl shadow-2xl py-2 z-[9999] animate-fadeIn">
                  <div className="px-4 py-2 border-b border-border-primary mb-1">
                    <p className="text-sm font-bold text-text-primary truncate">{user.displayName || 'User'}</p>
                    <p className="text-xs text-text-secondary truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[9px] uppercase tracking-widest font-bold bg-[#c6a55e]/20 text-[#c6a55e] px-2 py-0.5 rounded border border-[#c6a55e]/30">
                      {userRole}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-[#1f2631] hover:text-text-primary transition-colors flex items-center gap-2"
                  >
                    <UserCircle className="w-4 h-4" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#c6a55e] hover:bg-[#1f2631] hover:text-[#d6b772] transition-colors flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {userRole === 'admin' ? 'Admin Dashboard' : 'Admin Sign In'}
                  </button>

                  <button
                    onClick={() => {
                      onSignOut();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-[#1f2631] hover:text-text-primary transition-colors flex items-center gap-2 border-t border-border-primary mt-1 pt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Hidden on Home) */}
        <AnimatePresence>
          {activeTab !== 'home' && (
            <motion.nav 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-1.5 overflow-x-auto pb-3 pt-1 border-t border-border-primary/80 no-scrollbar"
            >
              {userRole === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'admin'
                      ? 'bg-[#c6a55e] text-bg-primary shadow-md'
                      : 'bg-[#401f1f] border border-[#803f3f] text-[#ffb3c6] hover:bg-[#592b2b]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Dashboard
                </button>
              )}

              <button
                id="nav-tab-map"
                onClick={() => setActiveTab('map')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'map'
                    ? 'bg-[#c6a55e] text-bg-primary shadow-md'
                    : 'bg-bg-surface border border-border-primary text-text-secondary hover:text-text-primary hover:border-border-hover'
                }`}
              >
                <motion.div layoutId="nav-icon-map"><Building2 className="w-3.5 h-3.5" /></motion.div>
                Masjid Locator
              </button>

              <button
                id="nav-tab-prayer-times"
                onClick={() => setActiveTab('prayer_times')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'prayer_times'
                    ? 'bg-[#c6a55e] text-bg-primary shadow-md'
                    : 'bg-bg-surface border border-border-primary text-text-secondary hover:text-text-primary hover:border-border-hover'
                }`}
              >
                <motion.div layoutId="nav-icon-prayer_times"><Sun className="w-3.5 h-3.5" /></motion.div>
                Prayer Times
              </button>

              <button
                id="nav-tab-quran"
                onClick={() => setActiveTab('quran')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'quran'
                    ? 'bg-[#c6a55e] text-bg-primary shadow-md'
                    : 'bg-bg-surface border border-border-primary text-text-secondary hover:text-text-primary hover:border-border-hover'
                }`}
              >
                <motion.div layoutId="nav-icon-quran"><BookOpen className="w-3.5 h-3.5" /></motion.div>
                Quran
              </button>

              <button
                id="nav-tab-tasbeeh"
                onClick={() => setActiveTab('tasbeeh')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'tasbeeh'
                    ? 'bg-[#c6a55e] text-bg-primary shadow-md'
                    : 'bg-bg-surface border border-border-primary text-text-secondary hover:text-text-primary hover:border-border-hover'
                }`}
              >
                <motion.div layoutId="nav-icon-tasbeeh"><Sparkles className="w-3.5 h-3.5" /></motion.div>
                Tasbeeh
              </button>

              <button
                id="nav-tab-duas"
                onClick={() => setActiveTab('duas')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'duas'
                    ? 'bg-[#c6a55e] text-bg-primary shadow-md'
                    : 'bg-bg-surface border border-border-primary text-text-secondary hover:text-text-primary hover:border-border-hover'
                }`}
              >
                <motion.div layoutId="nav-icon-duas"><BookOpen className="w-3.5 h-3.5" /></motion.div>
                Duas
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
