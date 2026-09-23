import { LOCK_SCREEN_AYAHS, LockScreenAyah } from '../data/lockScreenAyahs';

export interface LockScreenSettings {
  enabled: boolean;
  frequency: '1h' | '2h' | '4h' | 'prayer_times' | 'manual';
  preferredTheme: 'all' | 'purpose' | 'dunya' | 'iman' | 'allah';
  soundEnabled: boolean;
  autoDisplayOnLock: boolean; // Auto-dispatch when user locks screen with power button
  liveMediaWidgetEnabled: boolean; // Keep active media player widget on phone lock screen
  lastSentTimestamp?: number;
  lastAyahId?: string;
}

const STORAGE_KEY = 'sallah_lockscreen_settings';

export const DEFAULT_LOCKSCREEN_SETTINGS: LockScreenSettings = {
  enabled: true,
  frequency: '2h',
  preferredTheme: 'all',
  soundEnabled: true,
  autoDisplayOnLock: true,
  liveMediaWidgetEnabled: false,
};

export function getStoredLockScreenSettings(): LockScreenSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return { ...DEFAULT_LOCKSCREEN_SETTINGS, ...JSON.parse(data) };
  } catch (err) {
    console.error('Error reading lock screen settings:', err);
  }
  return DEFAULT_LOCKSCREEN_SETTINGS;
}

export function saveLockScreenSettings(settings: LockScreenSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving lock screen settings:', err);
  }
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Dispatches an Ayah notification formatted specifically to display legibly on phone lock screens.
 */
export async function sendLockScreenAyahNotification(
  ayah?: LockScreenAyah,
  customTitlePrefix?: string
): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  let permission = Notification.permission;
  if (permission !== 'granted') {
    permission = await requestNotificationPermission();
    if (permission !== 'granted') return false;
  }

  const selectedAyah =
    ayah ||
    LOCK_SCREEN_AYAHS[Math.floor(Math.random() * LOCK_SCREEN_AYAHS.length)];

  const titlePrefix = customTitlePrefix || '📖 Lock Screen Reminder';
  const title = `${titlePrefix}: ${selectedAyah.surahName} (${selectedAyah.verseRef})`;
  const body = `${selectedAyah.arabic}\n\n${selectedAyah.translation}\n\nPurpose & Iman: ${selectedAyah.writeup}`;

  const options: NotificationOptions & { vibrate?: number[] } = {
    body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'sallah-lockscreen-reminder',
    requireInteraction: true, // Key property to keep the notification persistent on lock screen
    silent: false,
    vibrate: [200, 100, 200, 100, 200],
    data: {
      url: window.location.href,
      ayahId: selectedAyah.id,
      timestamp: Date.now(),
    },
  };

  try {
    // Prefer Service Worker showNotification if active (better OS lock screen integration in PWAs)
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, options);
        updateLastSent(selectedAyah.id);
        return true;
      }
    }

    // Direct Notification fallback
    new Notification(title, options);
    updateLastSent(selectedAyah.id);
    return true;
  } catch (err) {
    console.warn('Fallback standard notification execution:', err);
    try {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png',
        tag: 'sallah-lockscreen-reminder',
      });
      updateLastSent(selectedAyah.id);
      return true;
    } catch (e) {
      console.error('Failed to trigger notification:', e);
      return false;
    }
  }
}

function updateLastSent(ayahId: string) {
  const current = getStoredLockScreenSettings();
  saveLockScreenSettings({
    ...current,
    lastSentTimestamp: Date.now(),
    lastAyahId: ayahId,
  });
}

/**
 * Sets up the MediaSession API so that when mobile users lock their screen,
 * the active Ayah displays with calligraphy and reflection directly in the OS lock-screen media player!
 */
export function setLockScreenMediaSession(ayah: LockScreenAyah): void {
  if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${ayah.arabic} — ${ayah.verseRef}`,
      artist: `${ayah.surahName} • Purpose in Dunya & Iman`,
      album: ayah.translation,
      artwork: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    });
  } catch (err) {
    console.error('Error setting mediaSession metadata:', err);
  }
}

/**
 * Generates an ultra-high resolution 1080 x 1920 (9:16) Lock Screen Phone Wallpaper
 * featuring the Ayah on Allah, our purpose in Dunya, and our Iman.
 */
export function generateLockscreenWallpaper(ayah: LockScreenAyah): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Background gradient (Deep Islamic Emerald & Obsidian)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920);
  bgGrad.addColorStop(0, '#041711');
  bgGrad.addColorStop(0.3, '#06261c');
  bgGrad.addColorStop(0.7, '#071510');
  bgGrad.addColorStop(1, '#020705');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // 2. Subtle geometric arch & Islamic ornamental stars
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, 1000, 1840);
  ctx.strokeRect(55, 55, 970, 1810);

  // Mihrab arch curve in background
  ctx.beginPath();
  ctx.moveTo(120, 750);
  ctx.bezierCurveTo(120, 450, 540, 360, 540, 360);
  ctx.bezierCurveTo(540, 360, 960, 450, 960, 750);
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.2)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Subtle starburst center
  ctx.fillStyle = 'rgba(52, 211, 153, 0.04)';
  ctx.beginPath();
  ctx.arc(540, 960, 380, 0, Math.PI * 2);
  ctx.fill();

  // 3. Top Section: Room for mobile lock screen clock (leave 0 - 380px safe zone)
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('REMEMBER ALLAH • PURPOSE OF DUNYA', 540, 440);

  // Surah Badge
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  const badgeW = 420;
  const badgeH = 46;
  ctx.roundRect ? ctx.roundRect(540 - badgeW / 2, 470, badgeW, badgeH, 23) : ctx.rect(540 - badgeW / 2, 470, badgeW, badgeH);
  ctx.fill();
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
  ctx.stroke();

  ctx.fillStyle = '#6ee7b7';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(`${ayah.surahName} (${ayah.verseRef}) • ${ayah.themeLabel.toUpperCase()}`, 540, 502);

  // 4. Arabic Ayah (Big, Majestic Typography)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px "Amiri", "Scheherazade New", serif';
  wrapText(ctx, ayah.arabic, 540, 670, 880, 85);

  // Gold divider
  const dividerGrad = ctx.createLinearGradient(300, 0, 780, 0);
  dividerGrad.addColorStop(0, 'rgba(217, 119, 6, 0)');
  dividerGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.7)');
  dividerGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');
  ctx.fillStyle = dividerGrad;
  ctx.fillRect(340, 950, 400, 3);

  // 5. English Translation
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 500 34px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, ayah.translation, 540, 1020, 860, 54);

  // 6. Reflection / Writeup on Purpose & Iman
  ctx.fillStyle = '#94a3b8';
  ctx.font = '300 27px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, `“${ayah.writeup}”`, 540, 1330, 840, 44);

  // 7. Bottom Branding / Safe Zone
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('SALLAH MATE • KEEP REMINDING OF ALLAH', 540, 1750);

  return canvas.toDataURL('image/png');
}

let activeLiveMediaAudio: HTMLAudioElement | null = null;
let currentLiveAyahIndex = 0;

/**
 * Starts an active MediaSession audio player so the OS lock screen
 * immediately displays the Ayah reminder card when the power button is pressed!
 */
export function startLockScreenMediaWidget(initialAyah?: LockScreenAyah): boolean {
  if (typeof window === 'undefined') return false;

  stopLockScreenMediaWidget();

  const selectedAyah =
    initialAyah || LOCK_SCREEN_AYAHS[currentLiveAyahIndex % LOCK_SCREEN_AYAHS.length];

  try {
    // Generate or use a quiet spiritual audio loop (calm soothing tone or recitation)
    const audio = new Audio(selectedAyah.audioUrl || 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    activeLiveMediaAudio = audio;

    audio.play().catch((err) => {
      console.warn('MediaSession background audio play deferred pending user gesture', err);
    });

    setLockScreenMediaSession(selectedAyah);

    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'playing';

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        currentLiveAyahIndex = (currentLiveAyahIndex + 1) % LOCK_SCREEN_AYAHS.length;
        const nextAyah = LOCK_SCREEN_AYAHS[currentLiveAyahIndex];
        setLockScreenMediaSession(nextAyah);
        sendLockScreenAyahNotification(nextAyah, '✨ Next Lock Screen Ayah');
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        currentLiveAyahIndex =
          (currentLiveAyahIndex - 1 + LOCK_SCREEN_AYAHS.length) % LOCK_SCREEN_AYAHS.length;
        const prevAyah = LOCK_SCREEN_AYAHS[currentLiveAyahIndex];
        setLockScreenMediaSession(prevAyah);
        sendLockScreenAyahNotification(prevAyah, '✨ Previous Lock Screen Ayah');
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        stopLockScreenMediaWidget();
      });

      navigator.mediaSession.setActionHandler('stop', () => {
        stopLockScreenMediaWidget();
      });
    }

    return true;
  } catch (err) {
    console.error('Failed to start Lock Screen Media Widget', err);
    return false;
  }
}

export function stopLockScreenMediaWidget(): void {
  if (activeLiveMediaAudio) {
    try {
      activeLiveMediaAudio.pause();
    } catch {
      // ignore
    }
    activeLiveMediaAudio = null;
  }
  if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
    navigator.mediaSession.playbackState = 'none';
  }
}

export function isLockScreenMediaWidgetActive(): boolean {
  return !!activeLiveMediaAudio && !activeLiveMediaAudio.paused;
}

/**
 * Sets up global auto-detector for screen locks.
 * Whenever the user presses the phone's physical power button (putting phone to sleep/lock),
 * visibilityState becomes 'hidden'. We immediately dispatch an Ayah lock screen notification!
 * When the user touches or presses the power button before unlocking, the Ayah is there!
 */
let lockDetectionInitialized = false;
let lastLockDispatchTime = 0;

export function setupAutomaticLockDetection(): () => void {
  if (typeof window === 'undefined' || lockDetectionInitialized) {
    return () => {};
  }
  lockDetectionInitialized = true;

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      const settings = getStoredLockScreenSettings();
      if (!settings.enabled || !settings.autoDisplayOnLock) return;

      // Throttle to at most once every 60 seconds to avoid spamming
      const now = Date.now();
      if (now - lastLockDispatchTime < 60_000) return;
      lastLockDispatchTime = now;

      // Pick a random inspirational Ayah on Allah, Dunya, or Iman
      const randomAyah =
        LOCK_SCREEN_AYAHS[Math.floor(Math.random() * LOCK_SCREEN_AYAHS.length)];

      sendLockScreenAyahNotification(
        randomAyah,
        '🔒 Lock Screen Reminder'
      );
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('pagehide', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('pagehide', handleVisibilityChange);
    lockDetectionInitialized = false;
  };
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
