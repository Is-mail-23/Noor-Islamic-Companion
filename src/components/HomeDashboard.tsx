import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Sparkles, Sun, BookOpen, UserCircle, Bot } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface HomeDashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  user: any;
  nextPrayer: any;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ setActiveTab, user, nextPrayer }) => {
  const tiles = [
    { id: 'prayer_times', title: 'Prayer Times', icon: Sun },
    { id: 'map', title: 'Mosque Finder', icon: Building2 },
    { id: 'quran', title: 'Holy Quran', icon: BookOpen },
    { id: 'tasbeeh', title: 'Zikr Counter', icon: Sparkles },
    { id: 'duas', title: 'Daily Duas', icon: BookOpen },
    { id: 'profile', title: 'My Profile', icon: UserCircle },
    { id: 'ai_companion', title: 'About Companion', icon: Bot },
  ] as const;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 sm:py-8 flex flex-col items-center min-h-[80vh]">
      {/* Top Title */}
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-text-primary mb-8"
      >
        Noor Islamic Companion
      </motion.h1>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 sm:gap-5 w-full px-2"
      >
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <motion.button
              key={tile.id}
              variants={item}
              onClick={() => setActiveTab(tile.id as ActiveTab)}
              className="bg-[#1a1f26] dark:bg-[#1a1f26] bg-slate-100 rounded-3xl aspect-square flex flex-col items-center justify-center gap-6 p-4 hover:bg-[#222831] transition-colors shadow-lg shadow-black/10"
            >
              <motion.div layoutId={`nav-icon-${tile.id}`}>
                <Icon strokeWidth={1.5} className="w-16 h-16 sm:w-20 sm:h-20 text-[#dfb867] drop-shadow-[0_2px_12px_rgba(223,184,103,0.25)]" />
              </motion.div>
              <h3 className="text-[15px] sm:text-base font-bold text-text-primary tracking-wide text-center leading-tight">
                {tile.title}
              </h3>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
