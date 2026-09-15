import React, { useState, useEffect } from 'react';
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Clock,
  Compass,
  MapPin,
  RefreshCw,
  Sparkles,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { SolarTimes, NextPrayerInfo } from '../types';
import { calculateSolarTimes, getNextPrayer } from '../utils/prayerTimes';

interface PrayerTimesSectionProps {
  userCoords: { lat: number; lng: number } | null;
  cityName: string;
  onRefreshLocation: () => void;
}

const POPULAR_CITIES = [
  { name: 'Makkah, Saudi Arabia', lat: 21.4225, lng: 39.8262 },
  { name: 'Medina, Saudi Arabia', lat: 24.4672, lng: 39.6111 },
  { name: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125 },
  { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'New York, USA', lat: 40.7128, lng: -74.006 },
  { name: 'Kuala Lumpur, Malaysia', lat: 3.139, lng: 101.6869 },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
];

export const PrayerTimesSection: React.FC<PrayerTimesSectionProps> = ({
  userCoords,
  cityName,
  onRefreshLocation,
}) => {
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lng: number }>(() => {
    return userCoords || { lat: 23.8103, lng: 90.4125 };
  });
  const [activeCityName, setActiveCityName] = useState<string>(cityName || 'Current Location');
  const [solarTimes, setSolarTimes] = useState<SolarTimes>(() =>
    calculateSolarTimes(activeCoords.lat, activeCoords.lng)
  );
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo>(() =>
    getNextPrayer(calculateSolarTimes(activeCoords.lat, activeCoords.lng))
  );

  // Sync coords if userCoords change
  useEffect(() => {
    if (userCoords) {
      setActiveCoords(userCoords);
      setActiveCityName('Your GPS Location');
    }
  }, [userCoords]);

  // Recalculate times when coords change
  useEffect(() => {
    const times = calculateSolarTimes(activeCoords.lat, activeCoords.lng);
    setSolarTimes(times);
    setNextPrayer(getNextPrayer(times));
  }, [activeCoords]);

  // Real-time clock interval to update countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNextPrayer(getNextPrayer(solarTimes));
    }, 1000);
    return () => clearInterval(interval);
  }, [solarTimes]);

  const handleSelectCity = (city: (typeof POPULAR_CITIES)[0]) => {
    setActiveCoords({ lat: city.lat, lng: city.lng });
    setActiveCityName(city.name);
  };

  const prayers = [
    {
      id: 'fajr',
      name: 'Fajr',
      arabic: 'الفجر',
      time: solarTimes.fajr,
      icon: Moon,
      color: 'text-text-secondary',
      bg: 'bg-[#1c222a] border-border-primary',
      description: 'Dawn prayer before sunrise',
    },
    {
      id: 'sunrise',
      name: 'Sunrise (Shuruq)',
      arabic: 'الشروق',
      time: solarTimes.sunrise,
      icon: Sunrise,
      color: 'text-[#c6a55e]',
      bg: 'bg-[#c6a55e]/10 border-[#c6a55e]/20',
      description: 'Solar sunrise / End of Fajr waqt',
      isSolar: true,
    },
    {
      id: 'dhuhr',
      name: 'Dhuhr',
      arabic: 'الظهر',
      time: solarTimes.dhuhr,
      icon: Sun,
      color: 'text-[#c6a55e]',
      bg: 'bg-[#c6a55e]/10 border-[#c6a55e]/20',
      description: 'Noon prayer after sun passes zenith',
    },
    {
      id: 'asr',
      name: 'Asr',
      arabic: 'العصر',
      time: solarTimes.asr,
      icon: Sun,
      color: 'text-[#c6a55e]',
      bg: 'bg-[#c6a55e]/10 border-[#c6a55e]/20',
      description: 'Late afternoon prayer',
    },
    {
      id: 'sunset',
      name: 'Sunset (Ghurub)',
      arabic: 'الغروب',
      time: solarTimes.sunset,
      icon: Sunset,
      color: 'text-[#e0a96d]',
      bg: 'bg-[#e0a96d]/10 border-[#e0a96d]/20',
      description: 'Sun disappears below horizon',
      isSolar: true,
    },
    {
      id: 'maghrib',
      name: 'Maghrib',
      arabic: 'المغرب',
      time: solarTimes.maghrib,
      icon: Sunset,
      color: 'text-[#c6a55e]',
      bg: 'bg-[#c6a55e]/10 border-[#c6a55e]/20',
      description: 'Immediately after sunset / Iftar time',
    },
    {
      id: 'isha',
      name: 'Isha',
      arabic: 'العشاء',
      time: solarTimes.isha,
      icon: Moon,
      color: 'text-text-secondary',
      bg: 'bg-[#1c222a] border-border-primary',
      description: 'Night prayer until middle of the night',
    },
  ];

  return (
    <div id="prayer-times-section" className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner: Next Prayer & Solar Status */}
      <div className="bg-bg-surface border border-border-primary rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#c6a55e]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#c6a55e]/10 text-[#c6a55e] border border-[#c6a55e]/20">
                Next Salah
              </span>
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#c6a55e]" />
                {activeCityName}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary font-serif-title tracking-wide">
                {nextPrayer.name}
              </h2>
              <span className="font-arabic text-2xl text-[#c6a55e]">
                {nextPrayer.arabicName}
              </span>
            </div>

            <p className="text-text-secondary text-sm">
              Expected at <strong className="text-text-primary font-mono text-base ml-1">{nextPrayer.timeString}</strong>
            </p>
          </div>

          {/* Countdown & Qibla Card */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Countdown Badge */}
            <div className="p-4 rounded-2xl bg-bg-inset border border-border-primary shadow-inner text-center min-w-[150px]">
              <span className="text-[11px] font-semibold text-text-secondary block uppercase tracking-wider">
                Time Remaining
              </span>
              <span className="text-2xl font-bold text-[#c6a55e] font-mono">
                {nextPrayer.remainingText}
              </span>
            </div>

            {/* Qibla Direction */}
            <div className="p-4 rounded-2xl bg-bg-inset border border-border-primary shadow-inner text-center min-w-[140px]">
              <span className="text-[11px] font-semibold text-text-secondary block uppercase tracking-wider flex items-center justify-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#c6a55e]" /> Qibla Angle
              </span>
              <span className="text-2xl font-bold text-text-primary font-mono">
                {solarTimes.qiblaDirection}° N
              </span>
            </div>
          </div>
        </div>

        {/* Location selector dropdown pill */}
        <div className="mt-6 pt-5 border-t border-border-primary flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">Select City:</span>
            <select
              value={activeCityName}
              onChange={(e) => {
                const found = POPULAR_CITIES.find((c) => c.name === e.target.value);
                if (found) handleSelectCity(found);
              }}
              className="bg-bg-inset border border-border-primary rounded-lg px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:border-[#c6a55e]"
            >
              <option value="Current Location">{activeCityName}</option>
              {POPULAR_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onRefreshLocation}
            className="text-[#c6a55e] hover:text-[#d6b772] flex items-center gap-1 font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Detect My Exact GPS Coordinates
          </button>
        </div>
      </div>

      {/* Sunrise & Sunset Spotlight Cards (Directly requested feature) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sunrise Card */}
        <div className="bg-bg-surface border border-border-primary rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#c6a55e] flex items-center gap-1">
              <Sunrise className="w-4 h-4" /> Sunrise Time (Shuruq)
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-text-primary font-mono">
              {solarTimes.sunrise}
            </div>
            <p className="text-xs text-text-secondary">
              End of Fajr prayer. Ishraq prayer starts 15 mins after.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#c6a55e]/10 border border-[#c6a55e]/20 flex items-center justify-center text-[#c6a55e]">
            <Sunrise className="w-8 h-8" />
          </div>
        </div>

        {/* Sunset Card */}
        <div className="bg-bg-surface border border-border-primary rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#e0a96d] flex items-center gap-1">
              <Sunset className="w-4 h-4" /> Sunset Time (Ghurub)
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-text-primary font-mono">
              {solarTimes.sunset}
            </div>
            <p className="text-xs text-text-secondary">
              Marks beginning of Islamic date & Maghrib / Iftar prayer.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#e0a96d]/10 border border-[#e0a96d]/20 flex items-center justify-center text-[#e0a96d]">
            <Sunset className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* 5 Waqt Detailed Schedule Table */}
      <div className="bg-bg-surface border border-border-primary rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 font-serif-title">
            <Clock className="w-4 h-4 text-[#c6a55e]" />
            Complete Daily Solar & Salah Timetable
          </h3>
          <span className="text-xs text-text-secondary font-mono">Standard Calculation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {prayers.map((prayer) => {
            const Icon = prayer.icon;
            const isNext = nextPrayer.name.toLowerCase().includes(prayer.id);

            return (
              <div
                key={prayer.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isNext
                    ? 'bg-[#1c222a] border-[#c6a55e] text-text-primary ring-1 ring-[#c6a55e]/40 shadow-lg shadow-black/60'
                    : 'bg-bg-inset border-border-primary text-text-primary hover:border-border-hover'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl border ${prayer.bg}`}>
                      <Icon className={`w-4 h-4 ${prayer.color}`} />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-text-primary flex items-center gap-1.5 font-serif-title">
                        {prayer.name}
                        {isNext && (
                          <span className="text-[10px] bg-[#c6a55e] text-bg-primary font-black px-1.5 py-0.2 rounded">
                            UPCOMING
                          </span>
                        )}
                      </div>
                      <div className="font-arabic text-xs text-[#c6a55e]">
                        {prayer.arabic}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-border-primary">
                  <span className="text-2xl font-bold font-mono text-[#c6a55e] tracking-tight">
                    {prayer.time}
                  </span>
                  <span className="text-[11px] text-text-secondary truncate max-w-[140px]">
                    {prayer.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
