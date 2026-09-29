import { PrayerName, PrayerTimeItem, LocationConfig, PrayerAdjustments } from '../types';

export const DEFAULT_PRAYER_ADJUSTMENTS: PrayerAdjustments = {
  Fajr: 0,
  Sunrise: 0,
  Dhuhr: 0,
  Asr: 0,
  Maghrib: 0,
  Isha: 0,
};

export function getStoredPrayerAdjustments(): PrayerAdjustments {
  try {
    const saved = localStorage.getItem('sallah_prayer_adjustments');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        Fajr: typeof parsed.Fajr === 'number' ? parsed.Fajr : 0,
        Sunrise: typeof parsed.Sunrise === 'number' ? parsed.Sunrise : 0,
        Dhuhr: typeof parsed.Dhuhr === 'number' ? parsed.Dhuhr : 0,
        Asr: typeof parsed.Asr === 'number' ? parsed.Asr : 0,
        Maghrib: typeof parsed.Maghrib === 'number' ? parsed.Maghrib : 0,
        Isha: typeof parsed.Isha === 'number' ? parsed.Isha : 0,
      };
    }
  } catch {}
  return { ...DEFAULT_PRAYER_ADJUSTMENTS };
}

export function savePrayerAdjustments(adjustments: PrayerAdjustments): void {
  try {
    localStorage.setItem('sallah_prayer_adjustments', JSON.stringify(adjustments));
    window.dispatchEvent(new CustomEvent('sallah_prayer_adjustments_changed', { detail: adjustments }));
  } catch {}
}

// Preset locations (Nigeria primary defaults and international holy sites)
export const DEFAULT_NIGERIA_LOCATION: LocationConfig = {
  city: 'Abuja',
  country: 'Nigeria',
  latitude: 9.0765,
  longitude: 7.3986,
  calculationMethod: 'MWL',
  asrMethod: 'standard',
};

export const POPULAR_LOCATIONS: LocationConfig[] = [
  DEFAULT_NIGERIA_LOCATION,
  { city: 'Lagos', country: 'Nigeria', latitude: 6.5244, longitude: 3.3792, calculationMethod: 'MWL', asrMethod: 'standard' },
  { city: 'Kano', country: 'Nigeria', latitude: 12.0022, longitude: 8.592, calculationMethod: 'MWL', asrMethod: 'standard' },
  { city: 'Ibadan', country: 'Nigeria', latitude: 7.3775, longitude: 3.947, calculationMethod: 'MWL', asrMethod: 'standard' },
  { city: 'Kaduna', country: 'Nigeria', latitude: 10.5105, longitude: 7.4165, calculationMethod: 'MWL', asrMethod: 'standard' },
  { city: 'Port Harcourt', country: 'Nigeria', latitude: 4.8156, longitude: 7.0498, calculationMethod: 'MWL', asrMethod: 'standard' },
  { city: 'Ilorin', country: 'Nigeria', latitude: 8.4966, longitude: 4.5421, calculationMethod: 'MWL', asrMethod: 'standard' },
  { city: 'Sokoto', country: 'Nigeria', latitude: 13.0609, longitude: 5.2348, calculationMethod: 'MWL', asrMethod: 'standard' },
  { city: 'Maiduguri', country: 'Nigeria', latitude: 11.8333, longitude: 13.15, calculationMethod: 'MWL', asrMethod: 'standard' },
  { city: 'Mecca', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262, calculationMethod: 'Makkah', asrMethod: 'standard' },
  { city: 'Medina', country: 'Saudi Arabia', latitude: 24.4672, longitude: 39.6111, calculationMethod: 'Makkah', asrMethod: 'standard' },
  { city: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, calculationMethod: 'Egypt', asrMethod: 'standard' },
  { city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, calculationMethod: 'MWL', asrMethod: 'standard' },
  { city: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006, calculationMethod: 'ISNA', asrMethod: 'standard' },
  { city: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708, calculationMethod: 'Gulf', asrMethod: 'standard' },
  { city: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011, calculationMethod: 'Karachi', asrMethod: 'hanafi' },
  { city: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, calculationMethod: 'Diyanet', asrMethod: 'standard' },
  { city: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, calculationMethod: 'UOIF', asrMethod: 'standard' },
  { city: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, calculationMethod: 'MUIS', asrMethod: 'standard' },
];

export const CALCULATION_METHODS = [
  { id: 'MWL', name: 'Muslim World League', fajrAngle: 18, ishaAngle: 17, region: 'Europe, Far East, Global' },
  { id: 'ISNA', name: 'Islamic Society of North America (ISNA)', fajrAngle: 15, ishaAngle: 15, region: 'North America (US & Canada)' },
  { id: 'Egypt', name: 'Egyptian General Authority of Survey', fajrAngle: 19.5, ishaAngle: 17.5, region: 'Africa, Middle East' },
  { id: 'Makkah', name: 'Umm Al-Qura University, Makkah', fajrAngle: 18.5, ishaInterval: 90, region: 'Arabian Peninsula' },
  { id: 'Karachi', name: 'University of Islamic Sciences, Karachi', fajrAngle: 18, ishaAngle: 18, region: 'Pakistan, India, Bangladesh' },
  { id: 'Gulf', name: 'Gulf Region (UAE, Qatar, Kuwait)', fajrAngle: 19.5, ishaInterval: 90, region: 'Gulf States' },
  { id: 'Diyanet', name: 'Diyanet İşleri Başkanlığı (Turkey)', fajrAngle: 18, ishaAngle: 17, region: 'Turkey & Balkans' },
  { id: 'UOIF', name: 'Union des Organisations Islamiques de France (UOIF)', fajrAngle: 12, ishaAngle: 12, region: 'France & Western Europe' },
  { id: 'MUIS', name: 'Majlis Ugama Islam Singapura (MUIS)', fajrAngle: 20, ishaAngle: 18, region: 'Singapore & Southeast Asia' },
];

// Helper: astronomical calculations for solar positions
function toRadians(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function toDegrees(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

function julianDay(date: Date): number {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  let y = year;
  let m = month;
  if (month <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
}

function sunCoordinates(d: number): { declination: number; equationOfTime: number } {
  const D = d - 2451545.0;
  const g = (357.529 + 0.98560028 * D) % 360;
  const q = (280.459 + 0.98564736 * D) % 360;
  const L = (q + 1.915 * Math.sin(toRadians(g)) + 0.02 * Math.sin(toRadians(2 * g))) % 360;
  const e = 23.439 - 0.00000036 * D;

  const ra = toDegrees(Math.atan2(Math.cos(toRadians(e)) * Math.sin(toRadians(L)), Math.cos(toRadians(L)))) / 15;
  const dRa = q / 15 - ra;
  const eqTime = (dRa - Math.round(dRa / 24) * 24) * 60; // in minutes
  const decl = toDegrees(Math.asin(Math.sin(toRadians(e)) * Math.sin(toRadians(L))));

  return { declination: decl, equationOfTime: eqTime };
}

export function calculatePrayerTimes(
  date: Date = new Date(),
  config: LocationConfig = POPULAR_LOCATIONS[0],
  customAdjustments?: Partial<PrayerAdjustments>
): PrayerTimeItem[] {
  const jd = julianDay(date);
  const { declination, equationOfTime } = sunCoordinates(jd);

  // Active adjustments from storage or passed arguments
  const activeAdjustments: PrayerAdjustments = {
    ...getStoredPrayerAdjustments(),
    ...(customAdjustments || {}),
  };

  // Timezone offset in hours
  const timezone = -date.getTimezoneOffset() / 60;
  // Solar noon
  const noon = 12 + timezone - config.longitude / 15 - equationOfTime / 60;

  // Selected method parameters
  const method = CALCULATION_METHODS.find((m) => m.id === config.calculationMethod) || CALCULATION_METHODS[0];

  // Helper to compute hour angle for sun altitude
  function hourAngle(altitudeAngle: number): number {
    const latRad = toRadians(config.latitude);
    const declRad = toRadians(declination);
    const altRad = toRadians(altitudeAngle);

    const cosH = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(declRad)) / (Math.cos(latRad) * Math.cos(declRad));
    if (cosH > 1) return 0;
    if (cosH < -1) return Math.PI;
    return toDegrees(Math.acos(cosH)) / 15; // in hours
  }

  // Sunrise / Sunset altitude: -0.8333 degrees
  const sunriseHourAngle = hourAngle(-0.8333);
  const sunriseTime = noon - sunriseHourAngle;
  const sunsetTime = noon + sunriseHourAngle;

  // Fajr: based on method angle below horizon (-angle)
  const fajrHourAngle = hourAngle(-method.fajrAngle);
  const fajrTime = noon - fajrHourAngle;

  // Asr: shadow length ratio
  const shadowMultiplier = config.asrMethod === 'hanafi' ? 2 : 1;
  const asrAlt = toDegrees(
    Math.atan(1 / (shadowMultiplier + Math.tan(toRadians(Math.abs(config.latitude - declination)))))
  );
  const asrHourAngle = hourAngle(asrAlt);
  const asrTime = noon + asrHourAngle;

  // Maghrib: sunset + 1-2 mins
  const maghribTime = sunsetTime + 2 / 60;

  // Isha
  let ishaTime: number;
  if (method.ishaInterval) {
    ishaTime = maghribTime + method.ishaInterval / 60;
  } else {
    const ishaAngle = method.ishaAngle || 17;
    const ishaHourAngle = hourAngle(-ishaAngle);
    ishaTime = noon + ishaHourAngle;
  }

  function formatTime(hours: number, offsetMinutes: number = 0): { timeString: string; rawDate: Date } {
    let totalMinutes = Math.round(hours * 60) + offsetMinutes;
    // Normalize into 24-hour day (1440 minutes)
    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;

    const wholeHours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const d = new Date(date);
    d.setHours(wholeHours, minutes, 0, 0);

    const period = wholeHours >= 12 ? 'PM' : 'AM';
    const displayHours = wholeHours % 12 === 0 ? 12 : wholeHours % 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return {
      timeString: `${displayHours}:${displayMinutes} ${period}`,
      rawDate: d,
    };
  }

  const fajr = formatTime(fajrTime, activeAdjustments.Fajr);
  const sunrise = formatTime(sunriseTime, activeAdjustments.Sunrise);
  const dhuhr = formatTime(noon, activeAdjustments.Dhuhr);
  const asr = formatTime(asrTime, activeAdjustments.Asr);
  const maghrib = formatTime(maghribTime, activeAdjustments.Maghrib);
  const isha = formatTime(ishaTime, activeAdjustments.Isha);

  const now = new Date();

  const items: PrayerTimeItem[] = [
    {
      id: 'Fajr',
      name: 'Fajr',
      arabicName: 'الفَجْر',
      time: fajr.timeString,
      rawTime: fajr.rawDate,
      rakahs: 2,
      sunnahBefore: 2,
      sunnahAfter: 0,
      description: 'Dawn prayer before sunrise. High spiritual rewards and protection throughout the day.',
      status: now > fajr.rawDate ? (now > sunrise.rawDate ? 'completed' : 'current') : 'upcoming',
    },
    {
      id: 'Sunrise',
      name: 'Sunrise',
      arabicName: 'الشُّرُوق',
      time: sunrise.timeString,
      rawTime: sunrise.rawDate,
      rakahs: 0,
      sunnahBefore: 0,
      sunnahAfter: 0,
      description: 'End of Fajr prayer window. Recommended time for Duha (Ishraq) prayer shortly after.',
      status: now > sunrise.rawDate ? 'completed' : 'upcoming',
    },
    {
      id: 'Dhuhr',
      name: 'Dhuhr',
      arabicName: 'الظُّهْر',
      time: dhuhr.timeString,
      rawTime: dhuhr.rawDate,
      rakahs: 4,
      sunnahBefore: 4,
      sunnahAfter: 2,
      description: 'Midday prayer when the sun passes the meridian.',
      status: now > dhuhr.rawDate ? (now > asr.rawDate ? 'completed' : 'current') : 'upcoming',
    },
    {
      id: 'Asr',
      name: 'Asr',
      arabicName: 'العَصْر',
      time: asr.timeString,
      rawTime: asr.rawDate,
      rakahs: 4,
      sunnahBefore: 0,
      sunnahAfter: 0,
      description: 'The middle prayer (Al-Salat Al-Wusta) emphasized in Surah Al-Baqarah.',
      status: now > asr.rawDate ? (now > maghrib.rawDate ? 'completed' : 'current') : 'upcoming',
    },
    {
      id: 'Maghrib',
      name: 'Maghrib',
      arabicName: 'المَغْرِب',
      time: maghrib.timeString,
      rawTime: maghrib.rawDate,
      rakahs: 3,
      sunnahBefore: 0,
      sunnahAfter: 2,
      description: 'Sunset prayer. Time of breaking the fast and evening dhikr.',
      status: now > maghrib.rawDate ? (now > isha.rawDate ? 'completed' : 'current') : 'upcoming',
    },
    {
      id: 'Isha',
      name: 'Isha',
      arabicName: 'العِشَاء',
      time: isha.timeString,
      rawTime: isha.rawDate,
      rakahs: 4,
      sunnahBefore: 0,
      sunnahAfter: 2,
      description: 'Night prayer followed by Witr. Safeguards the believer throughout the night.',
      status: now > isha.rawDate ? 'current' : 'upcoming',
    },
  ];

  return items;
}

export function getNextPrayer(prayers: PrayerTimeItem[]): { current: PrayerTimeItem; next: PrayerTimeItem; timeRemaining: string; progressPercent: number } {
  const now = new Date();
  const obligatory = prayers.filter((p) => p.id !== 'Sunrise');

  let nextIndex = obligatory.findIndex((p) => p.rawTime > now);
  if (nextIndex === -1) {
    // Past Isha, next is tomorrow's Fajr
    const nextFajr = obligatory[0];
    const diffMs = (nextFajr.rawTime.getTime() + 24 * 3600 * 1000) - now.getTime();
    return {
      current: obligatory[obligatory.length - 1],
      next: nextFajr,
      timeRemaining: formatRemaining(diffMs),
      progressPercent: 90,
    };
  }

  const next = obligatory[nextIndex];
  const current = nextIndex === 0 ? obligatory[obligatory.length - 1] : obligatory[nextIndex - 1];

  const diffMs = next.rawTime.getTime() - now.getTime();
  const totalWindow = Math.max(1, next.rawTime.getTime() - current.rawTime.getTime());
  const elapsed = Math.max(0, now.getTime() - current.rawTime.getTime());
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalWindow) * 100)));

  return {
    current,
    next,
    timeRemaining: formatRemaining(diffMs),
    progressPercent,
  };
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return 'Now';
  const totalSecs = Math.floor(ms / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m ${secs}s`;
  }
  return `${mins}m ${secs}s`;
}

// Calculate Qibla angle from any lat/long towards the Kaaba in Mecca
export function calculateQiblaDirection(lat: number, lng: number): number {
  const meccaLat = toRadians(21.4225);
  const meccaLng = toRadians(39.8262);
  const userLat = toRadians(lat);
  const userLng = toRadians(lng);

  const deltaLng = meccaLng - userLng;
  const y = Math.sin(deltaLng);
  const x = Math.cos(userLat) * Math.tan(meccaLat) - Math.sin(userLat) * Math.cos(deltaLng);

  let qibla = toDegrees(Math.atan2(y, x));
  return (qibla + 360) % 360;
}

// Calculate distance to the Holy Kaaba in kilometers and miles using Haversine formula
export function calculateKaabaDistance(lat: number, lng: number): { km: number; miles: number } {
  const meccaLat = 21.4225;
  const meccaLng = 39.8262;
  const R = 6371; // Earth radius in km
  const dLat = ((meccaLat - lat) * Math.PI) / 180;
  const dLng = ((meccaLng - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((meccaLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const km = Math.round(R * c);
  const miles = Math.round(km * 0.621371);
  return { km, miles };
}

// Audio synthesizer for Adhan notification / Takbeer chime
export function playSpiritualChime(type: 'takbeer' | 'gentle' = 'gentle') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'takbeer') {
      // Harmonic peaceful triad (A major / D)
      const freqs = [220, 277.18, 329.63, 440];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + i * 0.15 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.15 + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 2);
      });
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz calm tone
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.25);
    }
  } catch {
    // audio context muted or restricted
  }
}
