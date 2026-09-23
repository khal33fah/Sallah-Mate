export interface HijriDateInfo {
  day: number;
  month: number;
  monthNameEn: string;
  monthNameAr: string;
  year: number;
  designation: string;
  formattedEn: string; // e.g., "10 Rabi' al-Awwal 1448 AH"
  formattedAr: string; // e.g., "١٠ ربيع الأول ١٤٤٨ هـ"
  specialEvent?: string; // e.g., "Jummah (Friday)", "White Days Fasting (Ayyam al-Beed)", "Laylat al-Qadr"
}

export interface GregorianDateInfo {
  day: number;
  dayName: string; // "Tuesday"
  dayNameShort: string; // "Tue"
  month: number;
  monthName: string; // "September"
  monthNameShort: string; // "Sep"
  year: number;
  formatted: string; // "Tuesday, 22 September 2026"
  isFriday: boolean;
}

export const HIJRI_MONTHS = [
  { id: 1, nameEn: 'Muharram', nameAr: 'المحرم', sacred: true },
  { id: 2, nameEn: 'Safar', nameAr: 'صفر', sacred: false },
  { id: 3, nameEn: "Rabi' al-Awwal", nameAr: 'ربيع الأول', sacred: false },
  { id: 4, nameEn: "Rabi' al-Thani", nameAr: 'ربيع الثاني', sacred: false },
  { id: 5, nameEn: 'Jumada al-Ula', nameAr: 'جمادى الأولى', sacred: false },
  { id: 6, nameEn: 'Jumada al-Akhirah', nameAr: 'جمادى الآخرة', sacred: false },
  { id: 7, nameEn: 'Rajab', nameAr: 'رجب', sacred: true },
  { id: 8, nameEn: "Sha'ban", nameAr: 'شعبان', sacred: false },
  { id: 9, nameEn: 'Ramadan', nameAr: 'رمضان', sacred: false, monthOfFasting: true },
  { id: 10, nameEn: 'Shawwal', nameAr: 'شوال', sacred: false },
  { id: 11, nameEn: "Dhu al-Qi'dah", nameAr: 'ذو القعدة', sacred: true },
  { id: 12, nameEn: 'Dhu al-Hijjah', nameAr: 'ذو الحجة', sacred: true, monthOfHajj: true },
];

/**
 * Converts a Gregorian Date to an estimated astronomical Umm al-Qura / Kuwaiti Hijri date.
 * Supports manual adjustment days (e.g. +1 / -1 for moon sighting variations).
 */
export function getHijriDate(date: Date = new Date(), dayAdjustment: number = 0): HijriDateInfo {
  // Try native Intl first if supported for islamic-umalqura
  let hijriDay = 0;
  let hijriMonth = 0;
  let hijriYear = 1448;
  let hijriMonthNameEn = '';
  let hijriMonthNameAr = '';

  const adjustedDate = new Date(date.getTime() + dayAdjustment * 86400000);

  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(adjustedDate);
    const dayPart = parts.find((p) => p.type === 'day');
    const monthPart = parts.find((p) => p.type === 'month');
    const yearPart = parts.find((p) => p.type === 'year');

    if (dayPart && monthPart && yearPart) {
      hijriDay = parseInt(dayPart.value, 10);
      hijriMonth = parseInt(monthPart.value, 10);
      hijriYear = parseInt(yearPart.value, 10);
    }
  } catch {
    // fallback algorithm below
  }

  // Fallback Julian-Day based Kuwaitee algorithm if Intl was unavailable or returned unexpected
  if (!hijriDay || !hijriMonth || isNaN(hijriDay)) {
    const jd = getJulianDate(adjustedDate);
    const l = Math.floor(jd - 1948440 + 10632);
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) + (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
    const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    hijriMonth = Math.floor((24 * l3) / 709);
    hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
    hijriYear = 30 * n + j - 30;
  }

  // Safe clamping
  const monthIdx = Math.max(1, Math.min(12, hijriMonth)) - 1;
  const monthMeta = HIJRI_MONTHS[monthIdx] || HIJRI_MONTHS[0];
  hijriMonthNameEn = monthMeta.nameEn;
  hijriMonthNameAr = monthMeta.nameAr;

  // Convert day and year to Eastern Arabic Numerals
  const toArabicNumerals = (num: number): string => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map((d) => arabicDigits[parseInt(d, 10)] || d).join('');
  };

  // Detect special Islamic dates
  let specialEvent: string | undefined;
  if (adjustedDate.getDay() === 5) {
    specialEvent = 'Sayyid al-Ayyam (Mubarak Friday)';
  }
  if (hijriDay >= 13 && hijriDay <= 15) {
    specialEvent = `Ayyam al-Beed (White Days Sunnah Fasting)`;
  }
  if (hijriMonth === 9) {
    specialEvent = `Blessed Ramadan (Day ${hijriDay})`;
  } else if (hijriMonth === 10 && hijriDay === 1) {
    specialEvent = 'Eid al-Fitr Mubarak';
  } else if (hijriMonth === 12 && hijriDay === 9) {
    specialEvent = 'Day of Arafah';
  } else if (hijriMonth === 12 && hijriDay === 10) {
    specialEvent = 'Eid al-Adha Mubarak';
  } else if (hijriMonth === 1 && hijriDay === 10) {
    specialEvent = 'Day of Ashura';
  }

  return {
    day: hijriDay,
    month: hijriMonth,
    monthNameEn: hijriMonthNameEn,
    monthNameAr: hijriMonthNameAr,
    year: hijriYear,
    designation: 'AH',
    formattedEn: `${hijriDay} ${hijriMonthNameEn} ${hijriYear} AH`,
    formattedAr: `${toArabicNumerals(hijriDay)} ${hijriMonthNameAr} ${toArabicNumerals(hijriYear)} هـ`,
    specialEvent,
  };
}

export function getGregorianDate(date: Date = new Date()): GregorianDateInfo {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const dayOfWeek = date.getDay();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return {
    day,
    dayName: dayNames[dayOfWeek],
    dayNameShort: dayNamesShort[dayOfWeek],
    month,
    monthName: monthNames[date.getMonth()],
    monthNameShort: monthNamesShort[date.getMonth()],
    year,
    formatted: `${dayNames[dayOfWeek]}, ${day} ${monthNames[date.getMonth()]} ${year}`,
    isFriday: dayOfWeek === 5,
  };
}

function getJulianDate(date: Date): number {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

/**
 * Generates an interactive month calendar matrix that aligns both Gregorian days and Hijri days
 */
export interface CombinedCalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  gregorianDay: number;
  gregorianMonth: number;
  hijriDay: number;
  hijriMonthName: string;
  isFriday: boolean;
  isWhiteDay: boolean; // 13, 14, 15
  isFastingDay: boolean; // Monday or Thursday
  specialBadge?: string;
}

export function generateDualMonthCalendar(
  year: number,
  month: number, // 0-indexed (0 = Jan)
  hijriAdjustment: number = 0
): CombinedCalendarDay[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const today = new Date();

  const days: CombinedCalendarDay[] = [];

  // Start from the beginning Sunday
  const startDate = new Date(year, month, 1 - startDayOfWeek);

  for (let i = 0; i < 35; i++) {
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
    const isCurrentMonth = current.getMonth() === month;
    const isToday =
      current.getDate() === today.getDate() &&
      current.getMonth() === today.getMonth() &&
      current.getFullYear() === today.getFullYear();

    const hijri = getHijriDate(current, hijriAdjustment);
    const dayOfWeek = current.getDay();
    const isFriday = dayOfWeek === 5;
    const isWhiteDay = hijri.day >= 13 && hijri.day <= 15;
    const isFastingDay = dayOfWeek === 1 || dayOfWeek === 4; // Mon / Thu Sunnah fasting

    let badge: string | undefined;
    if (isFriday) badge = 'Jummah';
    else if (isWhiteDay) badge = 'Ayyam al-Beed';
    else if (isFastingDay) badge = 'Sunnah Fast';

    days.push({
      date: current,
      isCurrentMonth,
      isToday,
      gregorianDay: current.getDate(),
      gregorianMonth: current.getMonth() + 1,
      hijriDay: hijri.day,
      hijriMonthName: hijri.monthNameEn,
      isFriday,
      isWhiteDay,
      isFastingDay,
      specialBadge: badge,
    });
  }

  return days;
}
