import { SolarTimes } from '../types';

// Coordinates of the Holy Kaaba in Makkah
const MAKKAH_LAT = 21.4225;
const MAKKAH_LNG = 39.8262;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function toDeg(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

/**
 * Calculates Qibla direction in degrees from true North
 */
export function calculateQibla(lat: number, lng: number): number {
  const phiK = toRad(MAKKAH_LAT);
  const lambdaK = toRad(MAKKAH_LNG);
  const phi = toRad(lat);
  const lambda = toRad(lng);

  const y = Math.sin(lambdaK - lambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

  let qibla = toDeg(Math.atan2(y, x));
  qibla = (qibla + 360) % 360;
  return Math.round(qibla);
}

/**
 * Standard astronomical solar calculation for sunrise, sunset, and prayer times
 */
export function calculateSolarTimes(
  lat: number,
  lng: number,
  date: Date = new Date(),
  fajrAngle: number = 18.0,
  ishaAngle: number = 18.0
): SolarTimes {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Approximate solar declination and equation of time
  const B = (360 / 365) * (dayOfYear - 81);
  const B_rad = toRad(B);
  const eot = 9.87 * Math.sin(2 * B_rad) - 7.53 * Math.cos(B_rad) - 1.5 * Math.sin(B_rad); // in minutes
  const declination = 23.45 * Math.sin(toRad((360 / 365) * (dayOfYear - 81))); // in degrees
  const decl_rad = toRad(declination);
  const lat_rad = toRad(lat);

  // Timezone offset in hours
  const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

  // Solar noon in hours
  const solarNoon = 12 + timezoneOffsetHours - lng / 15 - eot / 60;

  function hourAngle(altitudeDeg: number): number | null {
    const alt_rad = toRad(altitudeDeg);
    const cosH =
      (Math.sin(alt_rad) - Math.sin(lat_rad) * Math.sin(decl_rad)) /
      (Math.cos(lat_rad) * Math.cos(decl_rad));
    if (cosH > 1 || cosH < -1) return null;
    return toDeg(Math.acos(cosH));
  }

  // Sunrise / Sunset (sun center 50 arcminutes below horizon due to refraction: -0.833°)
  const sunAngle = -0.833;
  const H_sun = hourAngle(sunAngle) ?? 90;

  const sunriseHour = solarNoon - H_sun / 15;
  const sunsetHour = solarNoon + H_sun / 15;

  // Fajr (sun 18° below horizon)
  const H_fajr = hourAngle(-fajrAngle) ?? 108;
  const fajrHour = solarNoon - H_fajr / 15;

  // Isha (sun 18° or 17.5° below horizon)
  const H_isha = hourAngle(-ishaAngle) ?? 108;
  const ishaHour = solarNoon + H_isha / 15;

  // Asr (Shafi/Hanbali/Maliki: shadow = object length + noon shadow)
  const noonAltitude = 90 - Math.abs(lat - declination);
  const noonShadow = 1 / Math.tan(toRad(noonAltitude));
  const asrAltitude = toDeg(Math.atan(1 / (1 + noonShadow)));
  const H_asr = hourAngle(asrAltitude) ?? 45;
  const asrHour = solarNoon + H_asr / 15;

  function formatTime(h: number): string {
    const normalized = (h + 24) % 24;
    let hours = Math.floor(normalized);
    let minutes = Math.floor((normalized - hours) * 60);
    if (minutes === 60) {
      minutes = 0;
      hours = (hours + 1) % 24;
    }
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${paddedMinutes} ${period}`;
  }

  return {
    fajr: formatTime(fajrHour),
    sunrise: formatTime(sunriseHour),
    dhuhr: formatTime(solarNoon),
    asr: formatTime(asrHour),
    sunset: formatTime(sunsetHour),
    maghrib: formatTime(sunsetHour + 0.05), // ~3 mins after sunset
    isha: formatTime(ishaHour),
    qiblaDirection: calculateQibla(lat, lng),
  };
}

export interface NextPrayerInfo {
  name: string;
  arabicName: string;
  timeString: string;
  remainingText: string;
  secondsRemaining: number;
}

export function parseTimeToDate(timeStr: string, baseDate: Date = new Date()): Date {
  const parts = timeStr.trim().split(/[:\s]/);
  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const period = parts[2]?.toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export function getNextPrayer(solarTimes: SolarTimes): NextPrayerInfo {
  const now = new Date();
  const schedule = [
    { name: 'Fajr', arabicName: 'الفجر', time: solarTimes.fajr },
    { name: 'Sunrise (Shuruq)', arabicName: 'الشروق', time: solarTimes.sunrise },
    { name: 'Dhuhr', arabicName: 'الظهر', time: solarTimes.dhuhr },
    { name: 'Asr', arabicName: 'العصر', time: solarTimes.asr },
    { name: 'Maghrib (Sunset)', arabicName: 'المغرب', time: solarTimes.maghrib },
    { name: 'Isha', arabicName: 'العشاء', time: solarTimes.isha },
  ];

  for (const item of schedule) {
    const prayerDate = parseTimeToDate(item.time, now);
    if (prayerDate.getTime() > now.getTime()) {
      const diffSec = Math.floor((prayerDate.getTime() - now.getTime()) / 1000);
      const hours = Math.floor(diffSec / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      const remainingText = hours > 0 ? `in ${hours}h ${minutes}m` : `in ${minutes}m`;
      return {
        name: item.name,
        arabicName: item.arabicName,
        timeString: item.time,
        remainingText,
        secondsRemaining: diffSec,
      };
    }
  }

  // If after Isha, next is tomorrow's Fajr
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFajr = parseTimeToDate(solarTimes.fajr, tomorrow);
  const diffSec = Math.floor((tomorrowFajr.getTime() - now.getTime()) / 1000);
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);

  return {
    name: 'Fajr',
    arabicName: 'الفجر',
    timeString: solarTimes.fajr,
    remainingText: `in ${hours}h ${minutes}m`,
    secondsRemaining: diffSec,
  };
}
