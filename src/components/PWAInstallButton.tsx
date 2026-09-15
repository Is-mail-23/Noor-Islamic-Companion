import React, { useState } from 'react';
import { usePWAInstall } from '../lib/usePWAInstall';
import { Download, X, Smartphone, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PWAInstallButton: React.FC<{ className?: string; label?: string }> = ({ 
  className = '', 
  label = 'Install on Android' 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
        <Check className="w-4 h-4" /> App already installed on this device
      </div>
    );
  }

  const handleAndroidClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  const copyAppUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <button
        id="pwa-install-app-btn"
        onClick={isIOS ? () => setShowGuide(true) : handleAndroidClick}
        className={`flex items-center justify-center gap-2 rounded-xl bg-[#c6a55e] hover:bg-[#d4b46c] text-bg-primary px-4 py-2.5 text-sm font-bold shadow-lg shadow-black/20 transition-all active:scale-95 ${className}`}
      >
        <Download className="w-4 h-4" />
        {isIOS ? 'Install on iOS' : label}
      </button>

      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-3xl bg-bg-surface border border-border-primary p-6 sm:p-7 shadow-2xl"
            >
              <button
                onClick={() => setShowGuide(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-bg-inset hover:bg-bg-primary text-text-secondary hover:text-text-primary transition-colors border border-border-primary"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#c6a55e]/15 border border-[#c6a55e]/30 flex items-center justify-center text-[#c6a55e]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary font-serif-title">
                    {isIOS ? 'Install on iPhone / iPad' : 'Install on Android Home Screen'}
                  </h3>
                  <p className="text-xs text-text-secondary">Runs standalone like a native Play Store app</p>
                </div>
              </div>

              {isIOS ? (
                <div className="space-y-3 text-sm text-text-secondary bg-bg-inset p-4 rounded-2xl border border-border-primary">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1f2631] shrink-0 flex items-center justify-center text-[#c6a55e] font-bold text-xs mt-0.5">1</span>
                    <p>Open this page in <strong>Safari</strong> on your iPhone/iPad.</p>
                  </div>
                  <div className="h-px w-full bg-border-primary"></div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1f2631] shrink-0 flex items-center justify-center text-[#c6a55e] font-bold text-xs mt-0.5">2</span>
                    <p>Tap the <strong>Share</strong> button (box with an arrow pointing up) at the bottom.</p>
                  </div>
                  <div className="h-px w-full bg-border-primary"></div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1f2631] shrink-0 flex items-center justify-center text-[#c6a55e] font-bold text-xs mt-0.5">3</span>
                    <p>Scroll down and tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-text-secondary bg-bg-inset p-4 rounded-2xl border border-border-primary">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1f2631] shrink-0 flex items-center justify-center text-[#c6a55e] font-bold text-xs mt-0.5">1</span>
                    <p>Open the app in <strong>Google Chrome</strong> on your Android device.</p>
                  </div>
                  <div className="h-px w-full bg-border-primary"></div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1f2631] shrink-0 flex items-center justify-center text-[#c6a55e] font-bold text-xs mt-0.5">2</span>
                    <p>Tap the <strong>three dots menu (⋮)</strong> in Chrome’s top-right corner.</p>
                  </div>
                  <div className="h-px w-full bg-border-primary"></div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1f2631] shrink-0 flex items-center justify-center text-[#c6a55e] font-bold text-xs mt-0.5">3</span>
                    <p>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                  </div>
                  <div className="h-px w-full bg-border-primary"></div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1f2631] shrink-0 flex items-center justify-center text-[#c6a55e] font-bold text-xs mt-0.5">4</span>
                    <p>Tap <strong>Install</strong> to confirm. The Noor app will appear on your home screen and app launcher!</p>
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={copyAppUrl}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-bg-inset hover:bg-bg-primary border border-border-primary text-text-primary text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#c6a55e]" />}
                  {copied ? 'Link Copied!' : 'Copy App URL to Phone'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowGuide(false)}
                  className="py-2.5 px-5 rounded-xl bg-[#c6a55e] text-bg-primary text-xs font-bold hover:bg-[#d4b46c] transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
