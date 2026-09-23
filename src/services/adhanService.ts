import { AdhanSettings, PrayerName } from '../types';

const ADHAN_SETTINGS_KEY = 'sallah_adhan_settings';

export const DEFAULT_ADHAN_SETTINGS: AdhanSettings = {
  enabled: true,
  selectedMuezzin: 'makkah',
  volume: 0.9,
  isMuted: false,
  snoozeMinutes: 10,
  snoozedUntil: null,
  playFor: {
    Fajr: true,
    Dhuhr: true,
    Asr: true,
    Maghrib: true,
    Isha: true,
  },
  duaAfterAdhanAutoShow: true,
};

export interface MuezzinOption {
  id: 'makkah' | 'madinah' | 'alafasy' | 'fajr_special';
  name: string;
  description: string;
  audioUrl: string;
}

export const MUEZZIN_OPTIONS: MuezzinOption[] = [
  {
    id: 'makkah',
    name: 'Masjid al-Haram, Makkah',
    description: 'Resonant, soul-stirring live Adhan from the Grand Mosque of Mecca',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/makkah.mp3',
  },
  {
    id: 'madinah',
    name: 'Al-Masjid an-Nabawi, Madinah',
    description: 'Serene, melodious Adhan from the Prophet’s Mosque in Medina',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/madina.mp3',
  },
  {
    id: 'alafasy',
    name: 'Sheikh Mishary Rashid Alafasy',
    description: 'Clear, poignant, and world-renowned recitation style',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/alafasy.mp3',
  },
  {
    id: 'fajr_special',
    name: 'Special Fajr Adhan (Dawn)',
    description: 'Includes "As-Salatu khayrun minan-nawm" (Prayer is better than sleep)',
    audioUrl: 'https://cdn.aladhan.com/audio/adhans/fajr.mp3',
  },
];

export const DUA_AFTER_ADHAN = {
  arabic:
    'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ، إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ.',
  transliteration:
    'Allāhumma Rabba hādhihid-daʿwatit-tāmmah, waṣ-ṣalātil-qā’imah, āti Muḥammadanil-wasīlata wal-faḍīlah, wabʿath-hu maqāmam-maḥmūdanil-ladhī waʿadtah, innaka lā tukhliful-mīʿād.',
  translation:
    'O Allah, Lord of this perfect call and established prayer, grant Muhammad the status of intercession and virtue, and resurrect him to the praised station which You have promised him. Indeed, You never break Your promise.',
  hadithRef:
    'The Prophet (ﷺ) said: "Whoever says this after hearing the call to prayer, my intercession becomes guaranteed for him on the Day of Resurrection." (Sahih al-Bukhari 614)',
};

export const ADHAN_WORDS = [
  {
    arabic: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar, Allāhu Akbar',
    translation: 'Allah is the Greatest, Allah is the Greatest',
  },
  {
    arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'Ash-hadu allā ilāha illallāh',
    translation: 'I bear witness that there is no deity worthy of worship except Allah',
  },
  {
    arabic: 'أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
    transliteration: 'Ash-hadu anna Muḥammadan Rasūlullāh',
    translation: 'I bear witness that Muhammad is the Messenger of Allah',
  },
  {
    arabic: 'حَيَّ عَلَى الصَّلَاةِ',
    transliteration: 'Ḥayya ʿalaṣ-ṣalāh',
    translation: 'Hasten to the prayer',
  },
  {
    arabic: 'حَيَّ عَلَى الْفَلَاحِ',
    transliteration: 'Ḥayya ʿalal-falāḥ',
    translation: 'Hasten to real success',
  },
  {
    arabic: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar, Allāhu Akbar',
    translation: 'Allah is the Greatest, Allah is the Greatest',
  },
  {
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'Lā ilāha illallāh',
    translation: 'There is no deity worthy of worship except Allah',
  },
];

let globalAudio: HTMLAudioElement | null = null;
let activePrayerName: PrayerName | null = null;
const listeners = new Set<(isPlaying: boolean, prayer: PrayerName | null) => void>();

function notifyListeners(isPlaying: boolean, prayer: PrayerName | null) {
  listeners.forEach((cb) => cb(isPlaying, prayer));
}

export function subscribeToAdhanState(
  callback: (isPlaying: boolean, prayer: PrayerName | null) => void
): () => void {
  listeners.add(callback);
  if (globalAudio) {
    callback(!globalAudio.paused, activePrayerName);
  } else {
    callback(false, null);
  }
  return () => {
    listeners.delete(callback);
  };
}

export function getStoredAdhanSettings(): AdhanSettings {
  try {
    const raw = localStorage.getItem(ADHAN_SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_ADHAN_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('Failed to parse adhan settings', err);
  }
  return DEFAULT_ADHAN_SETTINGS;
}

export function saveAdhanSettings(settings: AdhanSettings): void {
  try {
    localStorage.setItem(ADHAN_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save adhan settings', err);
  }
}

/**
 * Play the Call to Prayer (Adhan)
 */
export async function playAdhan(
  prayerName: PrayerName = 'Dhuhr',
  forceMuezzin?: 'makkah' | 'madinah' | 'alafasy' | 'fajr_special'
): Promise<boolean> {
  stopAdhan();

  const settings = getStoredAdhanSettings();
  const muezzinId =
    forceMuezzin ||
    (prayerName === 'Fajr' && settings.selectedMuezzin === 'makkah'
      ? 'fajr_special'
      : settings.selectedMuezzin);

  const option = MUEZZIN_OPTIONS.find((m) => m.id === muezzinId) || MUEZZIN_OPTIONS[0];

  try {
    const audio = new Audio(option.audioUrl);
    audio.volume = settings.isMuted ? 0 : (settings.volume ?? 0.9);
    globalAudio = audio;
    activePrayerName = prayerName;

    audio.onended = () => {
      notifyListeners(false, null);
      activePrayerName = null;
    };

    audio.onerror = () => {
      console.warn('Audio URL failed to load, trying backup harmonic call', option.audioUrl);
      playFallbackHarmonicAdhan();
      notifyListeners(false, null);
    };

    await audio.play();
    notifyListeners(true, prayerName);

    // Also update lock screen MediaSession if supported
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `Call to Prayer (Adhan) — ${prayerName}`,
        artist: option.name,
        album: 'Sallah Mate • Time for Prayer',
        artwork: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      });
      navigator.mediaSession.playbackState = 'playing';
      navigator.mediaSession.setActionHandler('pause', () => stopAdhan());
      navigator.mediaSession.setActionHandler('stop', () => stopAdhan());
    }

    return true;
  } catch (err) {
    console.warn('Autoplay restricted or error starting Adhan audio', err);
    // Trigger harmonic synthesizer fallback
    playFallbackHarmonicAdhan();
    return false;
  }
}

export function stopAdhan(): void {
  if (globalAudio) {
    try {
      globalAudio.pause();
      globalAudio.currentTime = 0;
    } catch {
      // ignore
    }
    globalAudio = null;
  }
  activePrayerName = null;
  notifyListeners(false, null);
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'none';
  }
}

export function setAdhanVolume(vol: number): void {
  const settings = getStoredAdhanSettings();
  const clamped = Math.max(0, Math.min(1, vol));
  settings.volume = clamped;
  if (settings.isMuted && clamped > 0) {
    settings.isMuted = false;
  }
  saveAdhanSettings(settings);

  if (globalAudio) {
    globalAudio.volume = settings.isMuted ? 0 : clamped;
  }
}

export function toggleAdhanMute(): boolean {
  const settings = getStoredAdhanSettings();
  const newMuted = !settings.isMuted;
  settings.isMuted = newMuted;
  saveAdhanSettings(settings);

  if (globalAudio) {
    globalAudio.volume = newMuted ? 0 : (settings.volume ?? 0.9);
  }
  return newMuted;
}

let snoozeTimer: any = null;

export function snoozeAdhan(minutes?: number, prayer?: PrayerName): number {
  stopAdhan();

  const settings = getStoredAdhanSettings();
  const mins = minutes || settings.snoozeMinutes || 10;
  const targetPrayer = prayer || activePrayerName || 'Dhuhr';
  const snoozedUntil = Date.now() + mins * 60 * 1000;

  settings.snoozeMinutes = mins;
  settings.snoozedUntil = snoozedUntil;
  saveAdhanSettings(settings);

  if (snoozeTimer) clearTimeout(snoozeTimer);
  snoozeTimer = setTimeout(() => {
    settings.snoozedUntil = null;
    saveAdhanSettings(settings);
    // Play after snooze expires if auto-adhan is enabled and prayer is enabled
    const freshSettings = getStoredAdhanSettings();
    if (
      targetPrayer !== 'Sunrise' &&
      freshSettings.enabled &&
      freshSettings.playFor[targetPrayer as keyof typeof freshSettings.playFor]
    ) {
      playAdhan(targetPrayer);
    }
  }, mins * 60 * 1000);

  return snoozedUntil;
}

export function cancelSnooze(): void {
  if (snoozeTimer) {
    clearTimeout(snoozeTimer);
    snoozeTimer = null;
  }
  const settings = getStoredAdhanSettings();
  settings.snoozedUntil = null;
  saveAdhanSettings(settings);
}

export function isAdhanSnoozed(): { snoozed: boolean; remainingMinutes: number } {
  const settings = getStoredAdhanSettings();
  if (settings.snoozedUntil && settings.snoozedUntil > Date.now()) {
    const diffMs = settings.snoozedUntil - Date.now();
    return {
      snoozed: true,
      remainingMinutes: Math.ceil(diffMs / (60 * 1000)),
    };
  }
  return { snoozed: false, remainingMinutes: 0 };
}

export function isAdhanPlaying(): boolean {
  return !!globalAudio && !globalAudio.paused;
}

// Keeps track of which prayers have already triggered the automatic Adhan today so we don't repeat
const triggeredPrayersToday = new Set<string>();

export function checkAndTriggerAutomaticAdhan(prayerName: PrayerName): boolean {
  const todayKey = `${new Date().toISOString().split('T')[0]}_${prayerName}`;
  if (triggeredPrayersToday.has(todayKey)) {
    return false;
  }

  const settings = getStoredAdhanSettings();
  if (!settings.enabled) return false;
  if (prayerName === 'Sunrise') return false;
  if (!settings.playFor[prayerName as keyof typeof settings.playFor]) return false;

  // Check if currently snoozed
  const snoozeInfo = isAdhanSnoozed();
  if (snoozeInfo.snoozed) {
    return false;
  }

  triggeredPrayersToday.add(todayKey);
  playAdhan(prayerName);
  return true;
}

export function getActiveAdhanPrayer(): PrayerName | null {
  return activePrayerName;
}

/**
 * Fallback Web Audio harmonic chime in case network MP3 is blocked by browser
 */
function playFallbackHarmonicAdhan() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Harmonic peaceful spiritual chords
    const notes = [
      { freq: 220, delay: 0 },
      { freq: 277.18, delay: 0.4 },
      { freq: 329.63, delay: 0.8 },
      { freq: 440, delay: 1.2 },
      { freq: 554.37, delay: 1.8 },
      { freq: 659.25, delay: 2.4 },
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.delay);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + n.delay);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + n.delay + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + n.delay + 2.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + n.delay);
      osc.stop(ctx.currentTime + n.delay + 2.6);
    });
  } catch (e) {
    console.error('Harmonic chime fallback error', e);
  }
}
