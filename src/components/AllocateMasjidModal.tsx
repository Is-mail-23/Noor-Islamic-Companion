import React, { useState } from 'react';
import {
  X,
  MapPin,
  Building2,
  Clock,
  Phone,
  User,
  ShieldCheck,
  PlusCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { Mosque, MosquePrayerTimes } from '../types';

interface AllocateMasjidModalProps {
  initialCoords?: { lat: number; lng: number } | null;
  onClose: () => void;
  onAddMosque: (mosque: Mosque) => void;
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
];

export const AllocateMasjidModal: React.FC<AllocateMasjidModalProps> = ({
  initialCoords,
  onClose,
  onAddMosque,
}) => {
  const [name, setName] = useState<string>('');
  const [arabicName, setArabicName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Local Area');
  const [lat, setLat] = useState<number>(initialCoords?.lat ?? 23.8103);
  const [lng, setLng] = useState<number>(initialCoords?.lng ?? 90.4125);
  const [coverImage, setCoverImage] = useState<string>(PRESET_COVERS[0]);

  const [adminName, setAdminName] = useState<string>('');
  const [adminPhone, setAdminPhone] = useState<string>('');
  const [adminPosition, setAdminPosition] = useState<string>('');
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminPin, setAdminPin] = useState<string>('1234');

  const [muazzinName, setMuazzinName] = useState<string>('');
  const [muazzinPhone, setMuazzinPhone] = useState<string>('');

  const [prayerTimes, setPrayerTimes] = useState<MosquePrayerTimes>({
    fajr: { adhan: '04:50 AM', iqamah: '05:20 AM' },
    dhuhr: { adhan: '01:05 PM', iqamah: '01:30 PM' },
    asr: { adhan: '04:45 PM', iqamah: '05:05 PM' },
    maghrib: { adhan: '06:22 PM', iqamah: '06:27 PM' },
    isha: { adhan: '07:45 PM', iqamah: '08:15 PM' },
    jummah: { khutbah: '01:15 PM', iqamah: '01:45 PM' },
  });

  const handleTimeChange = (
    waqt: keyof MosquePrayerTimes,
    field: 'adhan' | 'iqamah' | 'khutbah',
    val: string
  ) => {
    setPrayerTimes((prev) => {
      const current = prev[waqt] || { adhan: '', iqamah: '' };
      return {
        ...prev,
        [waqt]: {
          ...current,
          [field]: val,
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    const newMosque: Mosque = {
      id: `mosque-${Date.now()}`,
      name: name.trim(),
      arabicName: arabicName.trim() || "",
      address: address.trim(),
      city: city.trim() || 'Local Area',
      lat: Number(lat),
      lng: Number(lng),
      coverImage: coverImage.trim() || PRESET_COVERS[0],
      adminName: adminName.trim() || 'Mosque Committee',
      adminPhone: adminPhone.trim() || '+1 (555) 000-0000',
      adminPosition: adminPosition.trim() || 'Admin',
      adminUsername: adminUsername.trim(),
      adminPassword: adminPassword.trim(),
      adminPin: adminPin.trim() || '1234',
      muazzinName: muazzinName.trim() || 'Muazzin Office',
      muazzinPhone: muazzinPhone.trim() || '+1 (555) 000-0000',
      prayerTimes,
      facilities: ['Wudu Area', 'Prayer Hall', 'Air Conditioned'],
      capacity: 1000,
      lastUpdated: 'Just now (Allocated)',
    };

    onAddMosque(newMosque);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-2xl bg-bg-surface border border-border-primary rounded-3xl overflow-hidden shadow-2xl">
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
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#c6a55e] font-serif-title">
                Mosque Registration
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-text-primary font-serif-title">
                Allocate & Add Mosque to Map
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Pin the mosque location, assign admin & muazzin, and configure 5 waqt prayer times.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 ">
          {/* Mosque Name & Arabic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1 font-serif-title">
                Masjid Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Al-Farooq Jamia Mosque"
                className="w-full bg-bg-inset border border-border-primary rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:border-[#c6a55e] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1 font-serif-title">
                Arabic Name (Optional)
              </label>
              <input
                type="text"
                value={arabicName}
                onChange={(e) => setArabicName(e.target.value)}
                placeholder="e.g. جامع الفاروق"
                className="w-full bg-bg-inset border border-border-primary rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:border-[#c6a55e] focus:outline-none font-arabic text-right"
              />
            </div>
          </div>

          {/* Location & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1 font-serif-title">
                Street Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 74 Peace Ave, Downtown"
                className="w-full bg-bg-inset border border-border-primary rounded-xl px-3.5 py-2 text-xs sm:text-sm text-text-primary focus:border-[#c6a55e] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1 font-serif-title">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Central City"
                className="w-full bg-bg-inset border border-border-primary rounded-xl px-3.5 py-2 text-xs sm:text-sm text-text-primary focus:border-[#c6a55e] focus:outline-none"
              />
            </div>
          </div>

          {/* Lat / Lng Coordinates */}
          <div className="grid grid-cols-2 gap-3 bg-bg-inset p-3 rounded-xl border border-border-primary">
            <div>
              <label className="text-[10px] uppercase font-bold text-text-secondary block mb-1">
                Latitude (Allocated)
              </label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                className="w-full bg-bg-surface border border-border-primary rounded-lg px-2.5 py-1.5 text-xs text-text-primary font-mono focus:border-[#c6a55e] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-text-secondary block mb-1">
                Longitude (Allocated)
              </label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                className="w-full bg-bg-surface border border-border-primary rounded-lg px-2.5 py-1.5 text-xs text-text-primary font-mono focus:border-[#c6a55e] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Cover Picture Preset Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block font-serif-title">
              Masjid Cover Picture
            </label>
            <div className="flex gap-2">
              {PRESET_COVERS.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setCoverImage(img)}
                  className={`flex-1 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    coverImage === img
                      ? 'border-[#c6a55e] ring-2 ring-[#c6a55e]/40'
                      : 'border-border-primary opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 5 Waqt Prayer Times Configuration */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#c6a55e] block font-serif-title">
              Initial 5 Waqt Namaj & Iqamah Times
            </label>
            <div className="bg-bg-inset border border-border-primary rounded-2xl p-3.5 space-y-2.5 text-xs">
              {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as (keyof MosquePrayerTimes)[]).map(
                (waqt) => (
                  <div key={waqt} className="flex items-center justify-between gap-3 pb-2 border-b border-border-primary last:border-0 last:pb-0">
                    <span className="font-bold uppercase text-text-primary w-20">{waqt}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-[10px] text-text-secondary">Adhan:</span>
                      <input
                        type="text"
                        value={prayerTimes[waqt].adhan}
                        onChange={(e) => handleTimeChange(waqt, 'adhan', e.target.value)}
                        className="w-24 bg-bg-surface border border-border-primary rounded px-2 py-1 text-xs text-text-primary font-mono text-center focus:border-[#c6a55e] focus:outline-none"
                      />
                      <span className="text-[10px] text-[#c6a55e] font-semibold ml-2">Iqamah:</span>
                      <input
                        type="text"
                        value={prayerTimes[waqt].iqamah}
                        onChange={(e) => handleTimeChange(waqt, 'iqamah', e.target.value)}
                        className="w-24 bg-bg-surface border border-[#c6a55e]/50 rounded px-2 py-1 text-xs text-[#c6a55e] font-bold font-mono text-center focus:border-[#c6a55e] focus:outline-none"
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Muazzin and Mosque Admin Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-bg-inset border border-border-primary space-y-2">
              <span className="text-[11px] font-bold text-[#c6a55e] uppercase tracking-wider block font-serif-title">
                Muazzin Details (Optional)
              </span>
              <input
                type="text"
                placeholder="Muazzin Name"
                value={muazzinName}
                onChange={(e) => setMuazzinName(e.target.value)}
                className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Muazzin Phone Number"
                value={muazzinPhone}
                onChange={(e) => setMuazzinPhone(e.target.value)}
                className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none font-mono"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-bg-inset border border-border-primary space-y-2">
              <span className="text-[11px] font-bold text-[#c6a55e] uppercase tracking-wider block font-serif-title">
                Mosque Admin / Contact (Optional)
              </span>
              <input
                type="text"
                placeholder="Admin / Trustee Name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Position in Mosque (e.g., Imam, Chairman)"
                value={adminPosition}
                onChange={(e) => setAdminPosition(e.target.value)}
                className="w-full bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="flex-1 bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="flex-1 bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Admin Phone"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="flex-1 bg-bg-surface border border-border-primary rounded-lg px-3 py-1.5 text-xs text-text-primary focus:border-[#c6a55e] focus:outline-none font-mono"
                />
                <input
                  type="text"
                  placeholder="PIN (1234)"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  maxLength={6}
                  title="Admin PIN for future time updates"
                  className="w-20 bg-bg-surface border border-[#c6a55e]/50 rounded-lg px-2 py-1.5 text-xs text-[#c6a55e] font-mono text-center focus:border-[#c6a55e] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
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
              id="confirm-allocate-mosque-btn"
              className="px-6 py-2.5 rounded-xl bg-[#c6a55e] hover:bg-[#d6b772] text-bg-primary font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Allocate Mosque to Map
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};
