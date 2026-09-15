import React from 'react';
import { User } from 'firebase/auth';
import { MapPin, Clock, LogOut, Search, Settings, Bell, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PWAInstallButton } from './PWAInstallButton';
import { useTheme } from '../contexts/ThemeContext';

interface UserProfileProps {
  user: User;
  userRole: string;
  userZikrCount: number;
  userSearchHistory: any[];
  onSignOut: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  userRole,
  userZikrCount,
  userSearchHistory,
  onSignOut,
}) => {
  const { theme, toggleTheme } = useTheme();

  
  
  

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-bg-surface border border-border-primary rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#1a202c] to-bg-inset relative border-b border-border-primary">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
        </div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-bg-surface shadow-xl bg-bg-inset flex items-center justify-center shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-[#c6a55e]">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="flex-1 text-center sm:text-left mb-2">
              <h1 className="text-2xl font-black text-text-primary">{user.displayName || 'Anonymous User'}</h1>
              <p className="text-sm text-text-secondary">{user.email}</p>
            </div>
            
            <div className="mb-2 shrink-0">
              <span className="inline-block px-3 py-1 bg-[#c6a55e]/10 border border-[#c6a55e]/30 text-[#c6a55e] text-xs font-bold uppercase tracking-wider rounded-lg">
                Role: {userRole}
              </span>
            </div>
          </div>

          {/* Quick Install App Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-bg-inset to-bg-surface border border-border-primary flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-text-primary">Install Noor App on your phone</h4>
              <p className="text-xs text-text-secondary mt-0.5">Faster prayer alarms, full screen view, and offline prayer times.</p>
            </div>
            <PWAInstallButton className="w-full sm:w-auto" label="Install on Device" />
          </div>

          <div className="grid grid-cols-1 mb-8">
            <div className="bg-bg-inset border border-border-primary rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-bg-surface border border-border-primary flex items-center justify-center">
                  <span className="text-[#c6a55e] font-black text-2xl">∞</span>
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Lifetime Zikr Completed</p>
                  <p className="text-2xl font-bold text-text-primary">{userZikrCount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search History */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-primary pb-2">
              <Search className="w-4 h-4 text-[#c6a55e]" />
              Recent Mosque Views
            </h3>
            
            {userSearchHistory.length === 0 ? (
              <p className="text-sm text-text-secondary italic text-center py-4">No recent search history.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {userSearchHistory.map((sh, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-bg-inset border border-border-primary hover:border-[#c6a55e]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-text-secondary" />
                      <div>
                        <p className="text-sm font-bold text-text-primary">{sh.name}</p>
                        <p className="text-[10px] text-text-secondary">{sh.city}</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-text-secondary flex items-center gap-1 bg-bg-surface px-2 py-1 rounded-lg">
                      <Clock className="w-3 h-3" />
                      {new Date(sh.timestamp).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
