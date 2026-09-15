export interface PrayerTimeEntry {
  adhan: string;
  iqamah: string;
}

export interface MosquePrayerTimes {
  fajr: PrayerTimeEntry;
  dhuhr: PrayerTimeEntry;
  asr: PrayerTimeEntry;
  maghrib: PrayerTimeEntry;
  isha: PrayerTimeEntry;
  jummah?: {
    khutbah: string;
    iqamah: string;
  };
}

export interface Mosque {
  id: string;
  name: string;
  arabicName?: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  coverImage: string;
  adminName: string;
  adminPhone: string;
  adminPosition?: string;
  adminUsername?: string;
  adminPassword?: string;
  adminPin: string; // PIN code for admin verification
  muazzinName: string;
  muazzinPhone: string;
  prayerTimes: MosquePrayerTimes;
  facilities?: string[];
  capacity?: number;
  announcement?: string;
  lastUpdated: string;
  status?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface ZikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  meaning: string;
  virtue?: string;
  defaultTarget: number;
}

export interface DuaItem {
  id: string;
  title: string;
  category: 'daily' | 'salah' | 'morning_evening' | 'masjid' | 'forgiveness' | 'travel' | 'protection';
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  whenToRecite?: string;
}

export interface QuranVerse {
  number: number;
  arabic: string;
  translation: string;
  transliteration?: string;
}

export interface QuranSurah {
  number: number;
  name: string;
  arabicName: string;
  englishTranslation: string;
  versesCount: number;
  revelationType: 'Meccan' | 'Medinan';
  verses: QuranVerse[];
}

export interface SolarTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset: string;
  maghrib: string;
  isha: string;
  qiblaDirection: number; // degrees from North
}

export interface NextPrayerInfo {
  name: string;
  arabicName: string;
  timeString: string;
  remainingText: string;
  secondsRemaining: number;
}

