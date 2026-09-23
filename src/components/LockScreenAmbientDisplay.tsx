import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Download,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Maximize2,
  Check,
  Smartphone,
  Share2
} from 'lucide-react';
import { LOCK_SCREEN_AYAHS, LockScreenAyah } from '../data/lockScreenAyahs';
import {
  generateLockscreenWallpaper,
  sendLockScreenAyahNotification,
  setLockScreenMediaSession,
} from '../services/lockScreenNotificationService';
import { getHijriDate } from '../utils/calendarUtils';

interface LockScreenAmbientDisplayProps {
  onClose: () => void;
  initialAyahId?: string;
  nextPrayerName?: string;
  nextPrayerTime?: string;
}

export const LockScreenAmbientDisplay: React.FC<LockScreenAmbientDisplayProps> = ({
  onClose,
  initialAyahId,
  nextPrayerName = 'Next Prayer',
  nextPrayerTime = 'Soon',
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (initialAyahId) {
      const found = LOCK_SCREEN_AYAHS.findIndex((a) => a.id === initialAyahId);
      if (found !== -1) return found;
    }
    return 0;
  });

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const [notificationSent, setNotificationSent] = useState<boolean>(false);
  const [downloadingWallpaper, setDownloadingWallpaper] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<'emerald' | 'obsidian' | 'midnight'>('emerald');

  const currentAyah = LOCK_SCREEN_AYAHS[currentIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Keep clock ticking every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update MediaSession whenever current Ayah changes
  useEffect(() => {
    setLockScreenMediaSession(currentAyah);
  }, [currentAyah]);

  // Request Wake Lock for ambient bedside/desk lock screen display
  useEffect(() => {
    let active = true;
    const requestWake = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          if (active) setWakeLockActive(true);
          wakeLockRef.current.addEventListener('release', () => {
            if (active) setWakeLockActive(false);
          });
        }
      } catch (err) {
        console.warn('Wake lock unavailable:', err);
      }
    };
    requestWake();

    return () => {
      active = false;
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, []);

  // Handle Audio playback
  const toggleAudio = () => {
    if (!currentAyah.audioUrl) return;

    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlayingAudio(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(currentAyah.audioUrl);
      audioRef.current = audio;
      audio.play().then(() => {
        setIsPlayingAudio(true);
        setLockScreenMediaSession(currentAyah);
      }).catch((e) => {
        console.error('Audio play error:', e);
        setIsPlayingAudio(false);
      });
      audio.onended = () => setIsPlayingAudio(false);
    }
  };

  // Stop audio on unmount or slide change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % LOCK_SCREEN_AYAHS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + LOCK_SCREEN_AYAHS.length) % LOCK_SCREEN_AYAHS.length);
  };

  const handleShuffle = () => {
    let nextIdx = Math.floor(Math.random() * LOCK_SCREEN_AYAHS.length);
    if (nextIdx === currentIndex && LOCK_SCREEN_AYAHS.length > 1) {
      nextIdx = (nextIdx + 1) % LOCK_SCREEN_AYAHS.length;
    }
    setCurrentIndex(nextIdx);
  };

  // Send to Real Device Lock Screen (System notification)
  const handleSendToLockScreen = async () => {
    const success = await sendLockScreenAyahNotification(currentAyah, '📱 Lock Screen Reminder');
    if (success) {
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 3000);
    } else {
      alert('Please allow notification permissions in your browser or device settings to show Ayahs on your lock screen.');
    }
  };

  // Export 9:16 Lock Screen Wallpaper
  const handleDownloadWallpaper = () => {
    setDownloadingWallpaper(true);
    try {
      const dataUrl = generateLockscreenWallpaper(currentAyah);
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `sallah-lockscreen-${currentAyah.surahName.toLowerCase()}-${currentAyah.verseRef.replace(':', '-')}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Wallpaper generation error:', err);
    } finally {
      setTimeout(() => setDownloadingWallpaper(false), 1200);
    }
  };

  // Format Clock display
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const dateFormatted = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const getThemeClasses = () => {
    switch (themeMode) {
      case 'obsidian':
        return 'bg-black text-stone-100';
      case 'midnight':
        return 'bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 text-slate-100';
      case 'emerald':
      default:
        return 'bg-gradient-to-b from-stone-950 via-emerald-950/30 to-stone-950 text-stone-100';
    }
  };

  return (
    <div
      id="ambient-lock-screen-display-container"
      className={`fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-8 select-none transition-colors duration-700 overflow-y-auto ${getThemeClasses()}`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto z-10 pt-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium uppercase tracking-widest text-emerald-400">
            Lock Screen Display Mode
          </span>
          {wakeLockActive && (
            <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300">
              Screen Awake
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-2">
          {/* Theme switcher */}
          <button
            onClick={() => {
              const modes: ('emerald' | 'obsidian' | 'midnight')[] = ['emerald', 'obsidian', 'midnight'];
              const next = modes[(modes.indexOf(themeMode) + 1) % modes.length];
              setThemeMode(next);
            }}
            className="p-2 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-300 hover:text-white transition"
            title="Toggle Lock Screen Theme"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>

          {/* Send to real phone lock screen button */}
          <button
            id="send-current-ayah-lockscreen-btn"
            onClick={handleSendToLockScreen}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
              notificationSent
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-stone-900/90 hover:bg-stone-800 border-emerald-500/40 text-emerald-300'
            }`}
            title="Send this Ayah writeup to your phone's real lock screen as a notification"
          >
            {notificationSent ? <Check className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {notificationSent ? 'Sent to Lock Screen!' : 'Send to Phone Lock Screen'}
            </span>
          </button>

          {/* Download wallpaper button */}
          <button
            id="download-wallpaper-lockscreen-btn"
            onClick={handleDownloadWallpaper}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold transition"
            title="Download this Ayah as a 9:16 mobile phone lock screen wallpaper"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">
              {downloadingWallpaper ? 'Generating...' : 'Save Wallpaper'}
            </span>
          </button>

          {/* Close mode */}
          <button
            id="close-ambient-lockscreen-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Lock Screen Clock & Quranic Ayah Container */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full my-6 text-center space-y-6 sm:space-y-8 z-10 px-2">
        {/* Subtle Lock Screen Time & Date Display */}
        <div className="space-y-1">
          <div className="text-5xl sm:text-7xl font-extralight tracking-tight font-sans text-stone-100 drop-shadow-md">
            {hours}:{minutes}
          </div>
          <div className="text-xs sm:text-sm font-medium tracking-wide text-stone-400 flex items-center justify-center gap-2 flex-wrap">
            <span>{dateFormatted}</span>
            <span className="text-stone-600">•</span>
            <span className="text-emerald-300 font-semibold">{getHijriDate(currentTime).formattedEn}</span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-300">{nextPrayerName} at {nextPrayerTime}</span>
          </div>
        </div>

        {/* The Ayah Writeup Card */}
        <div className="w-full bg-stone-950/80 backdrop-blur-md border border-emerald-700/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden group">
          {/* Subtle Islamic corner motifs */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent pointer-events-none rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none rounded-tr-full" />

          {/* Theme & Surah Badge */}
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wider uppercase">
              {currentAyah.surahName} • {currentAyah.verseRef}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-400 text-xs font-medium">
              {currentAyah.themeLabel}
            </span>
          </div>

          {/* Arabic Ayah Calligraphy */}
          <div
            lang="ar"
            dir="rtl"
            className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-loose sm:leading-relaxed text-stone-100 font-serif px-2 drop-shadow"
            style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
          >
            {currentAyah.arabic}
          </div>

          {/* Transliteration directly below Arabic Ayah */}
          {currentAyah.transliteration && (
            <div className="p-3 bg-stone-900/80 border border-emerald-500/30 rounded-2xl max-w-2xl mx-auto text-left space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Transliteration</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-100/90 tracking-wide leading-relaxed font-sans">
                {currentAyah.transliteration}
              </p>
            </div>
          )}

          {/* Gold separator */}
          <div className="w-32 h-0.5 mx-auto bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          {/* English Translation */}
          <p className="text-base sm:text-xl font-medium text-stone-200 leading-relaxed max-w-2xl mx-auto italic">
            {currentAyah.translation}
          </p>

          {/* Writeup: Purpose in Dunya & Iman Reflection */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-left space-y-1.5 max-w-2xl mx-auto">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reminder of Allah, Purpose & Iman</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {currentAyah.writeup}
            </p>
          </div>

          {/* Audio Recitation control if available */}
          {currentAyah.audioUrl && (
            <div className="flex items-center justify-center pt-2">
              <button
                id="toggle-ayah-audio-btn"
                onClick={toggleAudio}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition border ${
                  isPlayingAudio
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-950'
                    : 'bg-stone-900/90 hover:bg-stone-800 border-stone-700 text-stone-300'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span>{isPlayingAudio ? 'Stop Recitation' : 'Listen to Recitation (Alafasy)'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Navigation Bar */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-between z-10 pb-4">
        <button
          id="prev-ayah-ambient-btn"
          onClick={handlePrev}
          className="p-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition flex items-center space-x-1 text-xs font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            id="shuffle-ayah-ambient-btn"
            onClick={handleShuffle}
            className="p-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-emerald-400 hover:text-emerald-300 transition"
            title="Random Ayah of Purpose & Iman"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <span className="text-xs text-stone-500 font-mono">
            {currentIndex + 1} / {LOCK_SCREEN_AYAHS.length}
          </span>
        </div>

        <button
          id="next-ayah-ambient-btn"
          onClick={handleNext}
          className="p-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition flex items-center space-x-1 text-xs font-medium"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
