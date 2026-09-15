import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  KeyRound,
  Save,
  Clock,
  Phone,
  User,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { Mosque, MosquePrayerTimes } from '../types';

interface MasjidAdminModalProps {
  mosque: Mosque | null;
  onClose: () => void;
  onSaveMosque: (updated: Mosque) => void;
  userRole?: string;
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
];

export const MasjidAdminModal: React.FC<MasjidAdminModalProps> = ({
  mosque,
  onClose,
  onSaveMosque,
  userRole,
}) => {
  if (!mosque) return null;

  const [enteredPin, setEnteredPin] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(userRole === 'admin');
  const [pinError, setPinError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState<string>(mosque.name);
  const [arabicName, setArabicName] = useState<string>(mosque.arabicName || '');
  const [address, setAddress] = useState<string>(mosque.address);
  const [coverImage, setCoverImage] = useState<string>(mosque.coverImage);
  const [adminName, setAdminName] = useState<string>(mosque.adminName);
  const [adminPhone, setAdminPhone] = useState<string>(mosque.adminPhone);
  const [adminPosition, setAdminPosition] = useState<string>(mosque.adminPosition || '');
  const [adminUsername, setAdminUsername] = useState<string>(mosque.adminUsername || '');
  const [adminPassword, setAdminPassword] = useState<string>(mosque.adminPassword || '');
  const [muazzinName, setMuazzinName] = useState<string>(mosque.muazzinName);
  const [muazzinPhone, setMuazzinPhone] = useState<string>(mosque.muazzinPhone);
  const [newPin, setNewPin] = useState<string>(mosque.adminPin);
  const [announcement, setAnnouncement] = useState<string>(mosque.announcement || '');

  const [prayerTimes, setPrayerTimes] = useState<MosquePrayerTimes>({
    ...mosque.prayerTimes,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      enteredPin === mosque.adminPin ||
      enteredPin === '1234' ||
      (mosque.adminPassword && enteredPin === mosque.adminPassword) ||
      (mosque.adminUsername && enteredPin === mosque.adminUsername)
    ) {
      setIsAuthenticated(true);
      setPinError(null);
    } else {
      setPinError('Invalid Admin Credentials. Try PIN or Password.');
    }
  };

  const handleTimeChange = (
    waqt: keyof MosquePrayerTimes,
    field: 'adhan' | 'iqamah' | 'khutbah',
    value: string
  ) => {
    setPrayerTimes((prev) => {
      const current = prev[waqt] || { adhan: '', iqamah: '' };
      return {
        ...prev,
        [waqt]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Mosque = {
      ...mosque,
      name,
      arabicName,
      address,
      coverImage,
      adminName,
      adminPhone,
      adminPosition,
      adminUsername,
      adminPassword,
      adminPin: newPin || mosque.adminPin,
      muazzinName,
      muazzinPhone,
      announcement,
      prayerTimes,
      lastUpdated: 'Just now (by Admin)',
    };

    onSaveMosque(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-2xl bg-bg-surface border border-border-primary rounded-3xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all backdrop-blur-md shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-[#12161b] p-6 border-b border-border-primary">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#c6a55e]/15 text-[#c6a55e] border border-[#c6a55e]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#c6a55e] font-serif-title">
                Mosque Admin Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-text-primary font-serif-title">{mosque.name}</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Update 5 waqt prayer & Iqamah times, muazzin contact, and announcements.
              </p>
            </div>
          </div>
        </div>

        {/* Conditional View: Login vs Admin Dashboard */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#c6a55e]/10 border border-[#c6a55e]/30 flex items-center justify-center mx-auto text-[#c6a55e]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary font-serif-title">Enter Admin Security PIN</h3>
              <p className="text-xs text-text-secondary">
                Authorized mosque committee members and muazzins only.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 font-serif-title">
                  Admin PIN Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    id="admin-pin-input"
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="Enter PIN (e.g. 1234)"
                    maxLength={8}
                    className="w-full bg-bg-inset border border-border-primary rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary focus:outline-none focus:border-[#c6a55e] font-mono tracking-widest text-center"
                    autoFocus
                    required
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {pinError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  id="admin-login-submit"
                  className="w-full py-3 bg-[#c6a55e] hover:bg-[#d6b772] text-bg-primary font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Verify & Access Portal
                </button>

                {/* Demo helper */}
                <button
                  type="button"
                  onClick={() => {
                    setEnteredPin('1234');
                    setIsAuthenticated(true);
                  }}
                  className="w-full py-2 bg-bg-inset border border-border-primary hover:border-border-hover text-xs text-text-secondary hover:text-text-primary rounded-xl transition-all"
                >
                  Quick Fill Demo PIN (1234)
                </button>
              </div>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-6 ">
            {saveSuccess && (
              <div className="p-3.5 rounded-2xl bg-bg-inset border border-[#c6a55e]/60 text-[#c6a55e] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c6a55e]" />
                <span>Mosque details and 5 waqt prayer times updated successfully!</span>
              </div>
            )}

            {/* 5 Waqt Prayer Times Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#c6a55e] flex items-center gap-1.5 font-serif-title">
                  <Clock className="w-4 h-4" />
                  Update 5 Waqt Namaj Times (Adhan & Iqamah)
                </h3>
                <span className="text-[11px] text-text-secondary">Time format: hh:mm AM/PM</span>
              </div>

              <div className="bg-bg-inset border border-border-primary rounded-2xl p-4 space-y-3">
                {/* Fajr */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pb-3 border-b border-border-primary">
                  <div className="font-bold text-text-primary text-sm">
                    Fajr <span className="font-arabic text-[#c6a55e] text-xs">(الفجر)</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-text-secondary block mb-1">Adhan Time</label>
                    <input
                      type="text"
                      value={prayerTimes.fajr.adhan}
                      onChange={(e) => handleTimeChange('fajr', 'adhan', e.target.value)}
                      placeholder="04:45 AM"
                      className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary font-mono focus:border-[#c6a55e] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#c6a55e] block mb-1 font-semibold">
                      Iqamah (Jamah)
                    </label>
                    <input
                      type="text"
                      value={prayerTimes.fajr.iqamah}
                      onChange={(e) => handleTimeChange('fajr', 'iqamah', e.target.value)}
                      placeholder="05:15 AM"
                      className="w-full bg-bg-surface border border-[#c6a55e]/50 rounded-lg px-3 py-1.5 text-xs text-[#c6a55e] font-bold font-mono focus:border-[#c6a55e] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dhuhr */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pb-3 border-b border-border-primary">
                  <div className="font-bold text-text-primary text-sm">
                    Dhuhr <span className="font-arabic text-[#c6a55e] text-xs">(الظهر)</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-text-secondary block mb-1">Adhan Time</label>
                    <input
                      type="text"
                      value={prayerTimes.dhuhr.adhan}
                      onChange={(e) => handleTimeChange('dhuhr', 'adhan', e.target.value)}
                      placeholder="01:00 PM"
                      className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary font-mono focus:border-[#c6a55e] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#c6a55e] block mb-1 font-semibold">
                      Iqamah (Jamah)
                    </label>
                    <input
                      type="text"
                      value={prayerTimes.dhuhr.iqamah}
                      onChange={(e) => handleTimeChange('dhuhr', 'iqamah', e.target.value)}
                      placeholder="01:30 PM"
                      className="w-full bg-bg-surface border border-[#c6a55e]/50 rounded-lg px-3 py-1.5 text-xs text-[#c6a55e] font-bold font-mono focus:border-[#c6a55e] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Asr */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pb-3 border-b border-border-primary">
                  <div className="font-bold text-text-primary text-sm">
                    Asr <span className="font-arabic text-[#c6a55e] text-xs">(العصر)</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-text-secondary block mb-1">Adhan Time</label>
                    <input
                      type="text"
                      value={prayerTimes.asr.adhan}
                      onChange={(e) => handleTimeChange('asr', 'adhan', e.target.value)}
                      placeholder="04:45 PM"
                      className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary font-mono focus:border-[#c6a55e] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#c6a55e] block mb-1 font-semibold">
                      Iqamah (Jamah)
                    </label>
                    <input
                      type="text"
                      value={prayerTimes.asr.iqamah}
                      onChange={(e) => handleTimeChange('asr', 'iqamah', e.target.value)}
                      placeholder="05:00 PM"
                      className="w-full bg-bg-surface border border-[#c6a55e]/50 rounded-lg px-3 py-1.5 text-xs text-[#c6a55e] font-bold font-mono focus:border-[#c6a55e] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Maghrib */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pb-3 border-b border-border-primary">
                  <div className="font-bold text-text-primary text-sm">
                    Maghrib <span className="font-arabic text-[#c6a55e] text-xs">(المغرب)</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-text-secondary block mb-1">Adhan Time</label>
                    <input
                      type="text"
                      value={prayerTimes.maghrib.adhan}
                      onChange={(e) => handleTimeChange('maghrib', 'adhan', e.target.value)}
                      placeholder="06:22 PM"
                      className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary font-mono focus:border-[#c6a55e] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#c6a55e] block mb-1 font-semibold">
                      Iqamah (Jamah)
                    </label>
                    <input
                      type="text"
                      value={prayerTimes.maghrib.iqamah}
                      onChange={(e) => handleTimeChange('maghrib', 'iqamah', e.target.value)}
                      placeholder="06:27 PM"
                      className="w-full bg-bg-surface border border-[#c6a55e]/50 rounded-lg px-3 py-1.5 text-xs text-[#c6a55e] font-bold font-mono focus:border-[#c6a55e] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Isha */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pb-3 border-b border-border-primary">
                  <div className="font-bold text-text-primary text-sm">
                    Isha <span className="font-arabic text-[#c6a55e] text-xs">(العشاء)</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-text-secondary block mb-1">Adhan Time</label>
                    <input
                      type="text"
                      value={prayerTimes.isha.adhan}
                      onChange={(e) => handleTimeChange('isha', 'adhan', e.target.value)}
                      placeholder="07:45 PM"
                      className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary font-mono focus:border-[#c6a55e] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#c6a55e] block mb-1 font-semibold">
                      Iqamah (Jamah)
                    </label>
                    <input
                      type="text"
                      value={prayerTimes.isha.iqamah}
                      onChange={(e) => handleTimeChange('isha', 'iqamah', e.target.value)}
                      placeholder="08:15 PM"
                      className="w-full bg-bg-surface border border-[#c6a55e]/50 rounded-lg px-3 py-1.5 text-xs text-[#c6a55e] font-bold font-mono focus:border-[#c6a55e] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Jummah */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="font-bold text-[#c6a55e] text-sm">
                    Jummah <span className="font-arabic text-xs">(الجمعة)</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-text-secondary block mb-1">Khutbah Time</label>
                    <input
                      type="text"
                      value={prayerTimes.jummah?.khutbah || '01:15 PM'}
                      onChange={(e) => handleTimeChange('jummah', 'khutbah', e.target.value)}
                      placeholder="01:15 PM"
                      className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary font-mono focus:border-[#c6a55e] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#c6a55e] block mb-1 font-semibold">
                      Iqamah (Jamah)
                    </label>
                    <input
                      type="text"
                      value={prayerTimes.jummah?.iqamah || '01:45 PM'}
                      onChange={(e) => handleTimeChange('jummah', 'iqamah', e.target.value)}
                      placeholder="01:45 PM"
                      className="w-full bg-bg-surface border border-[#c6a55e]/50 rounded-lg px-3 py-1.5 text-xs text-[#c6a55e] font-bold font-mono focus:border-[#c6a55e] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Muazzin & Admin Contact Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#c6a55e] flex items-center gap-1.5 font-serif-title">
                <Phone className="w-4 h-4" />
                Muazzin & Admin Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Muazzin */}
                <div className="bg-bg-inset border border-border-primary rounded-2xl p-4 space-y-3">
                  <div className="text-xs font-bold text-[#c6a55e] uppercase tracking-wider font-serif-title">
                    Muazzin Info
                  </div>
                  <div>
                    <label className="text-[11px] text-text-secondary block mb-1">Muazzin Name</label>
                    <input
                      type="text"
                      value={muazzinName}
                      onChange={(e) => setMuazzinName(e.target.value)}
                      className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-text-secondary block mb-1">Muazzin Phone</label>
                    <input
                      type="text"
                      value={muazzinPhone}
                      onChange={(e) => setMuazzinPhone(e.target.value)}
                      className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary font-mono focus:border-[#c6a55e] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Admin */}
                <div className="bg-bg-inset border border-border-primary rounded-2xl p-4 space-y-3">
                  <div className="text-xs font-bold text-[#c6a55e] uppercase tracking-wider font-serif-title">
                    Mosque Admin / Trustee Info
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-text-secondary block mb-1">Admin Name</label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-secondary block mb-1">Position</label>
                      <input
                        type="text"
                        value={adminPosition}
                        onChange={(e) => setAdminPosition(e.target.value)}
                        placeholder="e.g. Imam, Manager"
                        className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-secondary block mb-1">Phone</label>
                      <input
                        type="text"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary font-mono focus:border-[#c6a55e] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-secondary block mb-1">New PIN</label>
                      <input
                        type="text"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary font-mono focus:border-[#c6a55e] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-secondary block mb-1">Username</label>
                      <input
                        type="text"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-secondary block mb-1">Password</label>
                      <input
                        type="text"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-2 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Masjid Notice / Announcement */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block font-serif-title">
                Mosque Notice Board / Announcements
              </label>
              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="e.g. Ramadan Taraweeh starting at 8:30 PM, Weekly Tafseer every Saturday."
                rows={2}
                className="w-full bg-bg-inset border border-border-primary rounded-xl p-3 text-xs text-text-primary placeholder-text-secondary focus:border-[#c6a55e] focus:outline-none"
              />
            </div>

            {/* Cover Picture selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block font-serif-title">
                Cover Picture URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="flex-1 bg-bg-inset border border-border-primary rounded-xl px-3 py-2 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2 pt-1">
                {PRESET_COVERS.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setCoverImage(img)}
                    className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                      coverImage === img ? 'border-[#c6a55e] ring-2 ring-[#c6a55e]/40' : 'border-border-primary opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Change Admin PIN */}
            <div className="bg-bg-inset border border-border-primary rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-text-primary block">Admin PIN Code</span>
                <span className="text-[11px] text-text-secondary">Keep this secure to protect updates</span>
              </div>
              <input
                type="text"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                maxLength={8}
                className="w-28 bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary font-mono text-center focus:border-[#c6a55e] focus:outline-none"
              />
            </div>

            {/* Save Action */}
            <div className="pt-4 border-t border-border-primary flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-border-primary text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                id="save-mosque-admin-btn"
                className="px-6 py-2.5 rounded-xl bg-[#c6a55e] hover:bg-[#d6b772] text-bg-primary font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save & Update Live Times
              </button>
            </div>
          </form>
        )}
      </div>
      </div>
    </div>
  );
};
