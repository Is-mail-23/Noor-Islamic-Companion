import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-primary text-text-primary">
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-[#c6a55e]/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-bg-surface to-bg-inset border border-border-primary flex items-center justify-center shadow-2xl mb-6 relative overflow-hidden"
        >
          {/* Subtle inner highlight */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5" />
          
          <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-[#c6a55e] transform -rotate-45 relative z-10" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl font-black tracking-tight font-serif-title mb-2 text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-tertiary"
        >
          Noor
        </motion.h1>

        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="text-sm sm:text-base font-semibold text-[#c6a55e] uppercase tracking-[0.2em]"
        >
          Islamic Companion
        </motion.p>
      </motion.div>

      {/* Loading Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-16 w-48 h-1 bg-bg-surface rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut', delay: 1.2 }}
          className="h-full bg-gradient-to-r from-[#c6a55e] to-[#f0d696] rounded-full"
        />
      </motion.div>
    </div>
  );
};
