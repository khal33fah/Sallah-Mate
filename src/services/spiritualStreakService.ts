import { DailyPrayerRecord, PrayerName, SpiritualStreakStats } from '../types';

const STREAK_STORAGE_KEY = 'sallah_spiritual_daily_records';

const PRAYERS: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getPastDateKey(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export function getStoredDailyRecords(): Record<string, DailyPrayerRecord> {
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse streak records', err);
  }

  // Seed realistic historical data for the past 14 days so weekly and monthly streaks show meaningful analytics immediately
  const seeded = generateInitialSeedRecords();
  saveDailyRecords(seeded);
  return seeded;
}

export function saveDailyRecords(records: Record<string, DailyPrayerRecord>): void {
  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Failed to save streak records', err);
  }
}

function generateEmptyDayRecord(dateStr: string): DailyPrayerRecord {
  const prayers: Record<PrayerName, any> = {
    Fajr: { observed: false, onTime: false },
    Sunrise: { observed: false, onTime: false },
    Dhuhr: { observed: false, onTime: false },
    Asr: { observed: false, onTime: false },
    Maghrib: { observed: false, onTime: false },
    Isha: { observed: false, onTime: false },
  };

  return {
    date: dateStr,
    prayers,
    totalObserved: 0,
    closenessScore: 0,
    dhikrCount: 0,
  };
}

function generateInitialSeedRecords(): Record<string, DailyPrayerRecord> {
  const records: Record<string, DailyPrayerRecord> = {};

  // Seed past 14 days
  for (let i = 14; i >= 1; i--) {
    const dStr = getPastDateKey(i);
    const dayOfWeek = new Date(dStr).getDay(); // 0 is Sunday, 5 is Friday
    const isJumuah = dayOfWeek === 5;

    // Realistic patterns: Fajr and Isha high, Jumuah 5/5
    const observedCount = isJumuah ? 5 : i % 4 === 0 ? 4 : 5;
    const prayers: Record<PrayerName, any> = {
      Fajr: { observed: true, onTime: true, verifiedWithCamera: i % 2 === 0, azkarCompleted: true },
      Sunrise: { observed: false, onTime: false },
      Dhuhr: { observed: true, onTime: true, verifiedWithCamera: false, azkarCompleted: true },
      Asr: { observed: observedCount >= 4, onTime: true, verifiedWithCamera: false, azkarCompleted: true },
      Maghrib: { observed: true, onTime: true, verifiedWithCamera: i % 3 === 0, azkarCompleted: true },
      Isha: { observed: true, onTime: true, verifiedWithCamera: false, azkarCompleted: true },
    };

    const totalObserved = Object.values(prayers).filter((p) => p.observed).length;
    const closenessScore = Math.min(100, Math.round((totalObserved / 5) * 85 + (i % 2 === 0 ? 15 : 10)));

    records[dStr] = {
      date: dStr,
      prayers,
      totalObserved,
      closenessScore,
      dhikrCount: 99 + (i * 33),
      reflectionNote: isJumuah ? 'Blessed Friday congregational prayer and Surah Al-Kahf recitation.' : undefined,
    };
  }

  // Today
  const todayStr = getTodayKey();
  const todayRecord = generateEmptyDayRecord(todayStr);
  todayRecord.prayers.Fajr = { observed: true, onTime: true, verifiedWithCamera: true, azkarCompleted: true };
  todayRecord.totalObserved = 1;
  todayRecord.closenessScore = 20;
  todayRecord.dhikrCount = 33;
  records[todayStr] = todayRecord;

  return records;
}

/**
 * Record a prayer completion in today's streak ledger
 */
export function recordPrayerStreak(
  prayerName: PrayerName,
  isCompleted: boolean,
  verifiedWithCamera: boolean = false,
  azkarCompleted: boolean = false
): SpiritualStreakStats {
  const records = getStoredDailyRecords();
  const todayKey = getTodayKey();

  if (!records[todayKey]) {
    records[todayKey] = generateEmptyDayRecord(todayKey);
  }

  const day = records[todayKey];
  day.prayers[prayerName] = {
    observed: isCompleted,
    onTime: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    verifiedWithCamera: verifiedWithCamera || day.prayers[prayerName]?.verifiedWithCamera,
    azkarCompleted: azkarCompleted || day.prayers[prayerName]?.azkarCompleted,
  };

  // Recalculate totals
  const totalObserved = PRAYERS.filter((p) => day.prayers[p]?.observed).length;
  day.totalObserved = totalObserved;

  // Closeness score: 5 prayers = 70 pts, Azkar = 15 pts, Camera proof = 15 pts
  let score = totalObserved * 14;
  const azkarCount = PRAYERS.filter((p) => day.prayers[p]?.azkarCompleted).length;
  score += azkarCount * 3;
  const verifiedCount = PRAYERS.filter((p) => day.prayers[p]?.verifiedWithCamera).length;
  score += verifiedCount * 3;
  day.closenessScore = Math.min(100, score);

  records[todayKey] = day;
  saveDailyRecords(records);

  return calculateSpiritualStreakStats(records);
}

/**
 * Calculate streaks and statistics for display
 */
export function calculateSpiritualStreakStats(
  records: Record<string, DailyPrayerRecord> = getStoredDailyRecords()
): SpiritualStreakStats {
  const todayStr = getTodayKey();
  const todayRecord = records[todayStr] || generateEmptyDayRecord(todayStr);
  const todayCompletedCount = todayRecord.totalObserved;

  // Calculate current unbroken streak
  let currentStreakDays = 0;
  // If today has at least 1 prayer observed, count today, otherwise check from yesterday
  let checkOffset = todayCompletedCount > 0 ? 0 : 1;

  for (let i = checkOffset; i < 365; i++) {
    const dStr = getPastDateKey(i);
    const rec = records[dStr];
    if (rec && rec.totalObserved >= 1) {
      currentStreakDays++;
    } else {
      break;
    }
  }

  // Longest streak
  const dates = Object.keys(records).sort();
  let longestStreak = currentStreakDays;
  let tempStreak = 0;
  for (const d of dates) {
    if (records[d] && records[d].totalObserved >= 1) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  // Weekly breakdown (past 7 days)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyBreakdown = [];
  let weeklyTotalObserved = 0;
  const weeklyPossible = 7 * 5; // 35 prayers

  for (let i = 6; i >= 0; i--) {
    const dStr = getPastDateKey(i);
    const dObj = new Date(dStr + 'T00:00:00');
    const dayName = daysOfWeek[dObj.getDay()];
    const rec = records[dStr] || generateEmptyDayRecord(dStr);

    const prayersMap: Record<PrayerName, boolean> = {
      Fajr: !!rec.prayers.Fajr?.observed,
      Sunrise: false,
      Dhuhr: !!rec.prayers.Dhuhr?.observed,
      Asr: !!rec.prayers.Asr?.observed,
      Maghrib: !!rec.prayers.Maghrib?.observed,
      Isha: !!rec.prayers.Isha?.observed,
    };

    weeklyTotalObserved += rec.totalObserved;

    weeklyBreakdown.push({
      day: dayName,
      date: dStr,
      count: rec.totalObserved,
      score: rec.closenessScore,
      prayers: prayersMap,
    });
  }

  const weeklyConsistencyPercent = Math.round((weeklyTotalObserved / weeklyPossible) * 100);

  // Monthly breakdown (last 4 weeks = 28 days)
  let monthlyTotalObserved = 0;
  const monthlyBreakdown = [];

  for (let w = 3; w >= 0; w--) {
    const weekStart = w * 7;
    let weekObserved = 0;
    for (let day = 0; day < 7; day++) {
      const dStr = getPastDateKey(weekStart + day);
      const rec = records[dStr];
      if (rec) {
        weekObserved += rec.totalObserved;
        monthlyTotalObserved += rec.totalObserved;
      }
    }
    const weekLabel = w === 0 ? 'This Week' : `${w} wk ago`;
    monthlyBreakdown.push({
      weekLabel,
      completedPrayers: weekObserved,
      totalPossible: 35,
      percent: Math.min(100, Math.round((weekObserved / 35) * 100)),
    });
  }

  const monthlyConsistencyPercent = Math.min(100, Math.round((monthlyTotalObserved / 140) * 100));

  // Determine Closeness Level based on monthly and weekly consistency
  const closenessScore = Math.round(weeklyConsistencyPercent * 0.6 + monthlyConsistencyPercent * 0.4);

  let closenessLevel = {
    level: 'Al-Qānit (The Devoutly Sincere)',
    arabicTitle: 'القَانِت',
    score: closenessScore,
    description: 'You maintain steadfast devotion, observing the five daily prayers on time with Khushu and Sunnah Azkar.',
    nextMilestone: 'Maintain 30 consecutive days of unmissed Fajr in congregation or on time.',
  };

  if (closenessScore < 50) {
    closenessLevel = {
      level: 'Al-Murābit (The Faithful Guard)',
      arabicTitle: 'المُرَابِط',
      score: closenessScore,
      description: 'You are establishing the pillar of Sallah. Keep holding the rope of Allah and guard each prayer time.',
      nextMilestone: 'Reach 70% weekly consistency by securing Fajr and Asr every day.',
    };
  } else if (closenessScore < 75) {
    closenessLevel = {
      level: 'As-Sābiq (The Striving Believer)',
      arabicTitle: 'السَّابِق',
      score: closenessScore,
      description: 'Your heart is firmly attached to the masjid and prayer rug. You are racing toward Allah’s forgiveness.',
      nextMilestone: 'Seal all 5 daily prayers with the complete 33x Post-Sallah Azkar.',
    };
  } else if (closenessScore < 90) {
    closenessLevel = {
      level: 'Al-Musallī (The Constant in Prayer)',
      arabicTitle: 'المُصَلِّي',
      score: closenessScore,
      description: '“Those who are constant in their prayer.” (Al-Ma‘ārij: 23). A luminous beacon of discipline and Taqwa.',
      nextMilestone: 'Reach 14 days of unbroken 5/5 daily prayers to attain the rank of Al-Qānit.',
    };
  }

  return {
    currentStreakDays,
    longestStreakDays: Math.max(longestStreak, currentStreakDays),
    todayCompletedCount,
    weeklyConsistencyPercent,
    monthlyConsistencyPercent,
    closenessLevel,
    weeklyBreakdown,
    monthlyBreakdown,
  };
}

export const getSpiritualStreakStats = calculateSpiritualStreakStats;
