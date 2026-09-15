import React from 'react';
import {
  X,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  ExternalLink,
  Volume2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Mosque } from '../types';

interface MasjidProfileModalProps {
  mosque: Mosque | null;
  onClose: () => void;
  onOpenAdmin: (mosque: Mosque) => void;
}

export const MasjidProfileModal: React.FC<MasjidProfileModalProps> = ({
  mosque,
  onClose,
  onOpenAdmin,
}) => {
  if (!mosque) return null;

  const prayerList = [
    { name: 'Fajr', arabic: 'الفجر', ...mosque.prayerTimes.fajr },
    { name: 'Dhuhr', arabic: 'الظهر', ...mosque.prayerTimes.dhuhr },
    { name: 'Asr', arabic: 'العصر', ...mosque.prayerTimes.asr },
    { name: 'Maghrib', arabic: 'المغرب', ...mosque.prayerTimes.maghrib },
    { name: 'Isha', arabic: 'العشاء', ...mosque.prayerTimes.isha },
  ];

  const jummah = mosque.prayerTimes.jummah;

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

        {/* Cover Picture Header */}
        <div className="relative h-64 sm:h-72 w-full bg-bg-inset">
          <img
            src={mosque.coverImage}
            alt={mosque.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-bg-surface/50 to-transparent" />

          {/* Mosque Title Overlay */}
          <div className="absolute bottom-4 left-5 right-5 space-y-1">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-[#c6a55e] text-bg-primary px-2.5 py-0.5 rounded-full mb-1 font-serif-title">
              Verified Masjid Profile
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary leading-tight drop-shadow-md font-serif-title">
              {mosque.name}
            </h2>
            {mosque.arabicName && (
              <p className="font-arabic text-xl text-[#c6a55e] dir-rtl drop-shadow">
                {mosque.arabicName}
              </p>
            )}
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <MapPin className="w-4 h-4 text-[#c6a55e] shrink-0" />
              <span>{mosque.address}, {mosque.city}</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mosque.lat},${mosque.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#c6a55e] hover:text-[#d6b772] underline inline-flex items-center gap-0.5 ml-2"
              >
                Directions <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Announcement banner if any */}
          {mosque.announcement && (
            <div className="bg-bg-inset border border-[#c6a55e]/30 rounded-2xl p-3.5 flex gap-3 items-start text-xs text-[#c6a55e]">
              <AlertCircle className="w-4 h-4 text-[#c6a55e] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#c6a55e] block font-serif-title">Masjid Notice / Announcement</span>
                <p className="text-text-secondary mt-0.5">{mosque.announcement}</p>
              </div>
            </div>
          )}

          {/* 5 Waqt Prayer Times Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5 font-serif-title">
                <Clock className="w-4 h-4 text-[#c6a55e]" />
                5 Waqt Namaj & Iqamah Times
              </h3>
              <span className="text-[11px] text-text-secondary">
                Last updated: <strong className="text-text-primary">{mosque.lastUpdated}</strong>
              </span>
            </div>

            <div className="overflow-hidden border border-border-primary rounded-2xl bg-bg-inset shadow-inner">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#12161b] text-text-secondary uppercase text-[10px] sm:text-xs font-semibold tracking-wider border-b border-border-primary">
                  <tr>
                    <th className="px-4 py-3 font-serif-title">Prayer (Salah)</th>
                    <th className="px-4 py-3 text-center font-serif-title">Adhan Time</th>
                    <th className="px-4 py-3 text-right font-serif-title">Iqamah (Jamah)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary font-medium">
                  {prayerList.map((p) => (
                    <tr key={p.name} className="hover:bg-bg-surface transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-text-primary">{p.name}</div>
                        <div className="font-arabic text-[#c6a55e] text-xs">{p.arabic}</div>
                      </td>
                      <td className="px-4 py-3 text-center text-text-secondary font-mono">
                        {p.adhan}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#c6a55e] text-sm sm:text-base">
                        {p.iqamah}
                      </td>
                    </tr>
                  ))}
                  {jummah && (
                    <tr className="bg-[#12161b] hover:bg-bg-surface transition-colors border-t border-[#c6a55e]/30">
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#c6a55e]">Jummah (Friday)</div>
                        <div className="font-arabic text-[#c6a55e] text-xs">صلاة الجمعة</div>
                      </td>
                      <td className="px-4 py-3 text-center text-text-secondary font-mono">
                        Khutbah: {jummah.khutbah}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#c6a55e] text-sm sm:text-base">
                        {jummah.iqamah}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Muazzin and Mosque Admin Information Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5 font-serif-title">
              <Users className="w-4 h-4 text-[#c6a55e]" />
              Masjid Administration & Contacts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Muazzin Profile */}
              <div className="p-4 rounded-2xl bg-bg-inset border border-border-primary space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c6a55e] bg-[#c6a55e]/10 px-2 py-0.5 rounded-md border border-[#c6a55e]/20 font-serif-title">
                    Muazzin
                  </span>
                  <Volume2 className="w-4 h-4 text-[#c6a55e]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-text-primary">{mosque.muazzinName}</div>
                  <div className="text-xs text-text-secondary mt-0.5 font-mono">{mosque.muazzinPhone}</div>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`tel:${mosque.muazzinPhone}`}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-[#c6a55e] hover:bg-[#d6b772] text-bg-primary text-xs font-bold text-center flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Muazzin
                  </a>
                </div>
              </div>

              {/* Admin Profile */}
              <div className="p-4 rounded-2xl bg-bg-inset border border-border-primary space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c6a55e] bg-[#c6a55e]/10 px-2 py-0.5 rounded-md border border-[#c6a55e]/20 font-serif-title">
                    Mosque Admin / Trustee
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#c6a55e]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-text-primary">{mosque.adminName}</div>
                  <div className="text-xs text-text-secondary mt-0.5 font-mono">{mosque.adminPhone}</div>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`tel:${mosque.adminPhone}`}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-bg-surface hover:bg-[#1c222a] text-text-primary border border-border-primary text-xs font-semibold text-center flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Admin
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mosque Facilities & Capacity */}
          {mosque.facilities && mosque.facilities.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block font-serif-title">
                Facilities & Amenities
              </span>
              <div className="flex flex-wrap gap-2">
                {mosque.facilities.map((fac) => (
                  <span
                    key={fac}
                    className="px-3 py-1 rounded-lg text-xs bg-bg-inset border border-border-primary text-text-primary flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c6a55e]" />
                    {fac}
                  </span>
                ))}
                {mosque.capacity && (
                  <span className="px-3 py-1 rounded-lg text-xs bg-bg-inset border border-border-primary text-text-secondary flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#c6a55e]" />
                    Capacity: {mosque.capacity.toLocaleString()} worshippers
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Footer Action: Dedicated Mosque Admin Portal Launch */}
          <div className="pt-4 border-t border-border-primary flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-text-secondary text-center sm:text-left">
              Are you the authorized Imam, Muazzin, or Mosque Admin?
            </div>

            <button
              id="open-admin-portal-btn"
              onClick={() => {
                onClose();
                onOpenAdmin(mosque);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#c6a55e] hover:bg-[#d6b772] text-bg-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-bg-primary" />
              Update 5 Waqt Times (Admin Portal)
            </button>
          </div>
      </div>
    </div>
  </div>
</div>
  );
};
