import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Bell, Moon, Sun, ShieldCheck, Download, Check, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PrayerType = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

interface PrayerAlerts {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  
  const [alerts, setAlerts] = useState<PrayerAlerts>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('noor_prayer_alerts');
      if (stored) return JSON.parse(stored);
    }
    return { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const saveAlerts = (newAlerts: PrayerAlerts) => {
    setAlerts(newAlerts);
    localStorage.setItem('noor_prayer_alerts', JSON.stringify(newAlerts));
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support desktop notification");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        new Notification("Noor Islamic Companion", {
          body: "Prayer alerts have been enabled successfully.",
          icon: "/icon.png"
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission", error);
    }
  };

  const toggleAlert = (prayer: PrayerType) => {
    if (notificationPermission !== 'granted') {
      requestNotificationPermission().then(() => {
        if (Notification.permission === 'granted') {
          saveAlerts({ ...alerts, [prayer]: !alerts[prayer] });
        }
      });
      return;
    }
    
    saveAlerts({ ...alerts, [prayer]: !alerts[prayer] });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-border-primary overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-primary bg-bg-inset">
            <h2 className="text-xl font-bold font-serif-title flex items-center gap-2 text-text-primary">
              <Settings className="w-5 h-5 text-[#c6a55e]" />
              App Settings
            </h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-5 space-y-6  no-scrollbar">
            
            {/* Display / Appearance */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" /> Appearance
              </h3>
              <div className="bg-bg-inset border border-border-primary rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-[#c6a55e]" /> : <Sun className="w-4 h-4 text-[#c6a55e]" />}
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <button 
                    onClick={toggleTheme}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#c6a55e]"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-bg-primary transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}></span>
                  </button>
                </div>
              </div>
            </section>

            {/* Prayer Alerts */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Prayer Alerts (Push)
              </h3>
              
              {notificationPermission === 'denied' && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-300">
                    Notifications are blocked in your browser settings. Please enable them for this site to receive prayer alerts.
                  </p>
                </div>
              )}
              
              <div className="bg-bg-inset border border-border-primary rounded-xl divide-y divide-border-primary">
                {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as PrayerType[]).map((prayer) => (
                  <div key={prayer} className="flex items-center justify-between p-3.5">
                    <span className="text-sm font-semibold text-text-primary capitalize">{prayer}</span>
                    <button 
                      onClick={() => toggleAlert(prayer)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        alerts[prayer] ? 'bg-[#c6a55e]' : 'bg-border-hover'
                      }`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-bg-primary transition-transform ${
                        alerts[prayer] ? 'translate-x-5' : 'translate-x-1'
                      }`}></span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* App Installation */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> App Install
              </h3>
              <div className="bg-bg-inset border border-border-primary rounded-xl p-4">
                <PWAInstallButton />
              </div>
            </section>

          </div>
        </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
