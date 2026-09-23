export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerTimeItem {
  id: PrayerName;
  name: PrayerName;
  arabicName: string;
  time: string; // "05:12 AM"
  rawTime: Date;
  rakahs: number;
  sunnahBefore: number;
  sunnahAfter: number;
  description: string;
  status: 'upcoming' | 'current' | 'completed' | 'missed';
  isVerified?: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  posture?: string;
  witnessCertificate?: string;
}

export interface VerificationRecord {
  id: string;
  prayerName: PrayerName;
  date: string; // YYYY-MM-DD
  timestamp: string;
  mateName: string;
  verified: boolean;
  posture: string;
  confidence: number;
  witnessStatement: string;
  spiritualReflection: string;
  postureDetails: string;
  mode: 'mate' | 'self';
  photoSnapshot?: string;
}

export interface QuranAyah {
  numberInSurah: number;
  arabic: string;
  transliteration?: string;
  translation: string;
  audioUrl?: string;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  theme: string;
  audioUrl?: string;
  ayahs: QuranAyah[];
}

export interface AdhanSettings {
  enabled: boolean;
  selectedMuezzin: 'makkah' | 'madinah' | 'alafasy' | 'fajr_special';
  volume: number; // 0 to 1
  isMuted?: boolean;
  snoozeMinutes?: number; // 5, 10, 15
  snoozedUntil?: number | null; // timestamp ms
  playFor: {
    Fajr: boolean;
    Dhuhr: boolean;
    Asr: boolean;
    Maghrib: boolean;
    Isha: boolean;
  };
  duaAfterAdhanAutoShow: boolean;
}

export interface HadithItem {
  id: string;
  collection: string; // e.g., "Sahih al-Bukhari" or "Sahih Muslim"
  bookName: string;
  hadithNumber: string;
  narrator: string;
  arabicText: string;
  englishText: string;
  topic: string;
  grade: string;
}

export interface IslamicBookChapter {
  id: string;
  title: string;
  arabicTitle?: string;
  content: string;
  arabicDuas?: {
    arabic: string;
    transliteration: string;
    translation: string;
    reference: string;
    repetitions?: number;
  }[];
}

export interface IslamicBook {
  id: string;
  title: string;
  arabicTitle: string;
  author: string;
  category: 'Dua & Adhkar' | 'Fiqh' | 'Seerah' | 'Foundations';
  description: string;
  chapters: IslamicBookChapter[];
}

export interface LocationConfig {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  calculationMethod: string;
  asrMethod: 'standard' | 'hanafi';
}

export interface TravelerSettings {
  isTraveler: boolean;
  destination?: string;
  shortenPrayers: boolean; // Qasr: Dhuhr (2), Asr (2), Isha (2)
  combinePrayers: boolean; // Jam': Dhuhr+Asr, Maghrib+Isha
  allowAppUsageWhileTraveling: boolean; // Option to continue using the app freely during travel
  temporarySuspensionTimerMinutes: number; // e.g. 5 minutes then release all suspended apps
}

export interface DhikrItem {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  recommendedCount: number;
  category: 'Daily Essentials' | 'Morning & Evening' | 'Post-Prayer' | 'Virtues & Forgiveness';
  spiritualBenefit: string;
  hadithSource: string;
  badge?: string;
  timeOfDay?: 'anytime' | 'morning_evening' | 'post_prayer';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  references?: string[];
  suggestedFollowUps?: string[];
  timestamp: string;
}

export interface PostSallahAzkarStep {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  targetCount: number;
  virtue: string;
  hadithReference: string;
}

export type AppCategory = 'social' | 'messaging' | 'video' | 'gaming' | 'browsing' | 'work';

export interface SuspendableApp {
  id: string;
  name: string;
  category: AppCategory;
  packageId?: string;
  iconName: string;
  isSuspended: boolean;
  isCustom?: boolean;
}

export interface AppSuspensionSettings {
  enabled: boolean; // Suspend apps as soon as call to prayer commences
  strictAntiBypass: boolean; // Anti-bypass mode: cannot exit or dismiss without praying
  requireCameraProofToBypass: boolean; // Requires camera sujud or mate witness
  requireVoiceRecordingToBypass: boolean; // Requires voice recording of Iqamah & prayer details
  autoLockOnAdhan: boolean; // Automatically engage full-screen prayer lock when Adhan starts
  suspensionMinutes: number; // e.g. 20 minutes (or until prayer ends)
  apps: SuspendableApp[];
  emergencyPin?: string; // Optional 4-digit PIN for emergency exit
}

export interface VoicePrayerVerificationRecord {
  prayerName: PrayerName;
  iqamahRecorded: boolean;
  iqamahDurationSeconds: number;
  prayerRecorded: boolean;
  prayerDurationSeconds: number;
  totalAudioDuration: number;
  completedAt: string;
  stepsRecorded: string[];
}

export interface DailyPrayerRecord {
  date: string; // YYYY-MM-DD
  prayers: Record<
    PrayerName,
    {
      observed: boolean;
      onTime: boolean;
      timestamp?: string;
      verifiedWithCamera?: boolean;
      azkarCompleted?: boolean;
    }
  >;
  totalObserved: number; // 0-5
  closenessScore: number; // 0-100
  dhikrCount: number;
  reflectionNote?: string;
}

export interface SpiritualStreakStats {
  currentStreakDays: number;
  longestStreakDays: number;
  todayCompletedCount: number;
  weeklyConsistencyPercent: number;
  monthlyConsistencyPercent: number;
  closenessLevel: {
    level: string; // e.g., "Al-Qanit (The Devout)", "Al-Musalli", "Al-Awwab"
    arabicTitle: string;
    score: number; // 0-100
    description: string;
    nextMilestone: string;
  };
  weeklyBreakdown: {
    day: string; // "Mon", "Tue"
    date: string;
    count: number;
    score: number;
    prayers: Record<PrayerName, boolean>;
  }[];
  monthlyBreakdown: {
    weekLabel: string;
    completedPrayers: number;
    totalPossible: number;
    percent: number;
  }[];
}

export type DuaPhase = 'pre' | 'during' | 'post' | 'all';

export interface DuaItem {
  id: string;
  title: string;
  prayerTiming: PrayerName | 'Tahajjud' | 'Jummah' | 'Any';
  phase: 'pre' | 'during' | 'post';
  arabic: string;
  transliteration: string;
  translation: string;
  source: string; // e.g. "Sahih Muslim 591"
  virtue: string; // e.g. "Sins forgiven even if like foam of sea"
  recommendedCount?: number; // e.g. 1, 3, 7, 33, 100
  occasion: string; // e.g. "Between Adhan and Iqamah", "In Sujud", "After Taslim"
  tags: string[];
}
