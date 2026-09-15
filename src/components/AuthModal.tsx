import React, { useState } from 'react';
import { X, User, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (role: 'user' | 'admin', adminCode?: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSignIn }) => {
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (role === 'admin' && !secretCode) {
      setError('Please enter the Admin Secret Code.');
      return;
    }
    
    setIsLoading(true);
    try {
      await onSignIn(role, secretCode);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-bg-surface border border-border-primary rounded-3xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all backdrop-blur-md shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#c6a55e]/10 border border-[#c6a55e]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-[#c6a55e]" />
                </div>
                <h2 className="text-2xl font-black text-text-primary font-serif-title">Sign In / Register</h2>
                <p className="text-sm text-text-secondary mt-2">Select your account type to continue.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label 
                    className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${
                      role === 'user' 
                        ? 'border-[#c6a55e] bg-[#c6a55e]/5' 
                        : 'border-border-primary bg-bg-inset hover:border-border-hover'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={role === 'user'}
                      onChange={() => setRole('user')}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      role === 'user' ? 'border-[#c6a55e]' : 'border-text-secondary'
                    }`}>
                      {role === 'user' && <div className="w-2.5 h-2.5 bg-[#c6a55e] rounded-full" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary">Regular User</h4>
                      <p className="text-xs text-text-secondary">Explore mosques, prayer times, and features.</p>
                    </div>
                  </label>

                  <label 
                    className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${
                      role === 'admin' 
                        ? 'border-[#c6a55e] bg-[#c6a55e]/5' 
                        : 'border-border-primary bg-bg-inset hover:border-border-hover'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={() => setRole('admin')}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      role === 'admin' ? 'border-[#c6a55e]' : 'border-text-secondary'
                    }`}>
                      {role === 'admin' && <div className="w-2.5 h-2.5 bg-[#c6a55e] rounded-full" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary">Mosque Admin</h4>
                      <p className="text-xs text-text-secondary">Manage mosque details and prayer times.</p>
                    </div>
                  </label>
                </div>

                <AnimatePresence>
                  {role === 'admin' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2">
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                          Admin Secret Code
                        </label>
                        <div className="relative">
                          <ShieldCheck className="w-5 h-5 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            placeholder="Enter 786786 to test..."
                            value={secretCode}
                            onChange={(e) => setSecretCode(e.target.value)}
                            className="w-full bg-bg-inset border border-border-primary text-text-primary text-sm rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-[#c6a55e] transition-colors"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#c6a55e] hover:bg-[#d6b772] text-bg-primary font-bold rounded-xl shadow-lg shadow-black/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Authenticating...' : 'Continue with Google'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
