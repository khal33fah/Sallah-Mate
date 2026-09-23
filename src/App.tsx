import React, { useState, useEffect } from 'react';
import { Camera, Shield, BookOpen, Award, CheckCircle2, Moon, Sparkles, Volume2, Info, Plane, Clock, Unlock, Smartphone, Download, Calendar as CalendarIcon, Bot, Lock, Flame, ShieldAlert, Compass } from 'lucide-react';
import { PrayerName, VerificationRecord, TravelerSettings, SuspendableApp, VoicePrayerVerificationRecord } from './types';
import { PrayerTimesCard } from './components/PrayerTimesCard';
import { CameraMateScanner } from './components/CameraMateScanner';
import { PrayerLockdownMode } from './components/PrayerLockdownMode';
import { IslamicLibrary } from './components/IslamicLibrary';
import { VerificationLedgerModal } from './components/VerificationLedgerModal';
import { TravelerJourneyModal } from './components/TravelerJourneyModal';
import { LockScreenAmbientDisplay } from './components/LockScreenAmbientDisplay';
import { LockScreenSettingsModal } from './components/LockScreenSettingsModal';
import { AppInstalledWelcomeModal } from './components/AppInstalledWelcomeModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AdhanModal } from './components/AdhanModal';
import { DualCalendarModal } from './components/DualCalendarModal';
import { DailyDhikrModule } from './components/DailyDhikrModule';
import { IslamicAIAssistantModal } from './components/IslamicAIAssistantModal';
import { PostSallahAzkarLockModal } from './components/PostSallahAzkarLockModal';
import { AppSuspensionSettingsModal } from './components/AppSuspensionSettingsModal';
import { SpiritualStreaksModal } from './components/SpiritualStreaksModal';
import { AppBlockerInterceptorModal } from './components/AppBlockerInterceptorModal';
import { ContextAwareDuaModal } from './components/ContextAwareDuaModal';
import { QiblaCompassModal } from './components/QiblaCompassModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import {
  getStoredLockScreenSettings,
  sendLockScreenAyahNotification,
  setupAutomaticLockDetection,
} from './services/lockScreenNotificationService';
import { subscribeToAdhanState, isAdhanPlaying } from './services/adhanService';
import { getStoredAppSuspensionSettings } from './services/appSuspensionService';
import { recordPrayerStreak, getSpiritualStreakStats } from './services/spiritualStreakService';
import { playSpiritualChime } from './utils/prayerTimes';

export default function App() {
  const [activeScannerPrayer, setActiveScannerPrayer] = useState<PrayerName | null>(null);
  const [activeLockdownPrayer, setActiveLockdownPrayer] = useState<{ prayer: PrayerName; rakahs: number } | null>(null);
  const [isLedgerOpen, setIsLedgerOpen] = useState<boolean>(false);
  const [isTravelerModalOpen, setIsTravelerModalOpen] = useState<boolean>(false);
  const [isLockScreenModalOpen, setIsLockScreenModalOpen] = useState<boolean>(false);
  const [isAmbientDisplayOpen, setIsAmbientDisplayOpen] = useState<boolean>(false);
  const [ambientInitialAyahId, setAmbientInitialAyahId] = useState<string | undefined>(undefined);
  const [isAdhanModalOpen, setIsAdhanModalOpen] = useState<boolean>(false);
  const [adhanModalInitialPrayer, setAdhanModalInitialPrayer] = useState<PrayerName | undefined>(undefined);
  const [isAdhanPlayingState, setIsAdhanPlayingState] = useState<boolean>(isAdhanPlaying());
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState<boolean>(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [activeAzkarLockPrayer, setActiveAzkarLockPrayer] = useState<PrayerName | null>(null);

  // App Suspension & Anti-Bypass Blocker Modal
  const [isSuspensionSettingsOpen, setIsSuspensionSettingsOpen] = useState<boolean>(false);
  // Spiritual Streaks Modal
  const [isStreaksModalOpen, setIsStreaksModalOpen] = useState<boolean>(false);
  // Context-Aware Prayer Duas Modal
  const [isDuaModalOpen, setIsDuaModalOpen] = useState<boolean>(false);
  const [activeDuaPrayer, setActiveDuaPrayer] = useState<PrayerName | 'Tahajjud' | 'Jummah' | undefined>(undefined);
  // Qibla Direction Navigator Modal
  const [isQiblaModalOpen, setIsQiblaModalOpen] = useState<boolean>(false);
  // Intercepted App for Blocker simulation
  const [interceptedApp, setInterceptedApp] = useState<SuspendableApp | null>(null);
  const [streakStats, setStreakStats] = useState(() => getSpiritualStreakStats());

  // PWA Install detection and event handling
  const { isInstallable, isInstalled, isIOS, justInstalled, setJustInstalled, install } = usePWAInstall();

  // Traveler journey settings persisted in localStorage
  const [travelerSettings, setTravelerSettings] = useState<TravelerSettings>(() => {
    try {
      const saved = localStorage.getItem('sallah_traveler_settings');
      if (saved) return JSON.parse(saved);
      return {
        isTraveler: false,
        shortenPrayers: true,
        combinePrayers: true,
        allowAppUsageWhileTraveling: true,
        temporarySuspensionTimerMinutes: 5,
      };
    } catch {
      return {
        isTraveler: false,
        shortenPrayers: true,
        combinePrayers: true,
        allowAppUsageWhileTraveling: true,
        temporarySuspensionTimerMinutes: 5,
      };
    }
  });

  // Global 5-minute timer countdown in seconds (300s)
  const [fiveMinReleaseTimer, setFiveMinReleaseTimer] = useState<number | null>(null);
  const [releaseNotification, setReleaseNotification] = useState<string | null>(null);
  const [completedPrayers, setCompletedPrayers] = useState<PrayerName[]>(() => {
    try {
      const saved = localStorage.getItem('sallah_completed_prayers');
      return saved ? JSON.parse(saved) : ['Fajr'];
    } catch {
      return ['Fajr'];
    }
  });

  const [verificationRecords, setVerificationRecords] = useState<VerificationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sallah_witness_records');
      if (saved) return JSON.parse(saved);
      // Provide an initial sample verified certificate
      return [
        {
          id: 'initial-sample',
          prayerName: 'Fajr',
          date: new Date().toISOString().split('T')[0],
          timestamp: '05:24 AM',
          mateName: 'Brother Bilal',
          verified: true,
          posture: 'Sujud (Prostration observed)',
          confidence: 94,
          witnessStatement:
            "Witnessed with praise to Allah: Brother Bilal observed Fajr prayer in reverence and stillness on the prayer rug.",
          spiritualReflection:
            "The Prophet ﷺ said: 'The two Sunnah Rakahs before Fajr are better than the entire world and whatever is in it.' (Sahih Muslim 725)",
          postureDetails: 'Detected companion in full prostration facing the Qibla.',
          mode: 'mate',
        },
      ];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('sallah_completed_prayers', JSON.stringify(completedPrayers));
  }, [completedPrayers]);

  useEffect(() => {
    localStorage.setItem('sallah_witness_records', JSON.stringify(verificationRecords));
  }, [verificationRecords]);

  useEffect(() => {
    localStorage.setItem('sallah_traveler_settings', JSON.stringify(travelerSettings));
  }, [travelerSettings]);

  // 5-minute release timer interval: when it hits 0, releases all suspended apps
  useEffect(() => {
    if (fiveMinReleaseTimer === null) return;
    if (fiveMinReleaseTimer <= 0) {
      setFiveMinReleaseTimer(null);
      // Release lockdown if currently active
      if (activeLockdownPrayer) {
        setActiveLockdownPrayer(null);
      }
      playSpiritualChime('takbeer');
      setReleaseNotification('5-minute timer expired: All suspended apps, phone calls, and notifications have been released!');
      setTimeout(() => {
        setReleaseNotification(null);
      }, 7000);
      return;
    }

    const interval = setInterval(() => {
      setFiveMinReleaseTimer((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [fiveMinReleaseTimer, activeLockdownPrayer]);

  const handleStart5MinTimer = () => {
    setFiveMinReleaseTimer(300); // 5 minutes
  };

  const handleCancel5MinTimer = () => {
    setFiveMinReleaseTimer(null);
  };

  // Handle camera verification complete
  const handleVerificationComplete = (record: VerificationRecord) => {
    setVerificationRecords((prev) => [record, ...prev]);
    if (!completedPrayers.includes(record.prayerName)) {
      setCompletedPrayers((prev) => [...prev, record.prayerName]);
    }
    playSpiritualChime('takbeer');
    // Lock app until authentic post-Sallah Azkar is recited
    setActiveAzkarLockPrayer(record.prayerName);
  };

  // Toggle manual prayer completion
  const handleToggleManualStatus = (prayer: PrayerName) => {
    const isNowObserving = !completedPrayers.includes(prayer);
    setCompletedPrayers((prev) =>
      isNowObserving ? [...prev, prayer] : prev.filter((p) => p !== prayer)
    );
    if (isNowObserving) {
      playSpiritualChime('gentle');
      // Lock app for post-Sallah Azkar recitation
      setActiveAzkarLockPrayer(prayer);
    }
  };

  const handleClearRecords = () => {
    if (confirm('Clear all prayer witness certificates?')) {
      setVerificationRecords([]);
      localStorage.removeItem('sallah_witness_records');
    }
  };

  // Background scheduler for Lock Screen Ayah reminders
  useEffect(() => {
    const checkAndDispatch = () => {
      const lockSettings = getStoredLockScreenSettings();
      if (!lockSettings.enabled || lockSettings.frequency === 'manual') return;

      const now = Date.now();
      const last = lockSettings.lastSentTimestamp || 0;

      let intervalMs = 2 * 60 * 60 * 1000; // default 2h
      if (lockSettings.frequency === '1h') intervalMs = 1 * 60 * 60 * 1000;
      if (lockSettings.frequency === '2h') intervalMs = 2 * 60 * 60 * 1000;
      if (lockSettings.frequency === '4h') intervalMs = 4 * 60 * 60 * 1000;
      if (lockSettings.frequency === 'prayer_times') intervalMs = 3 * 60 * 60 * 1000;

      if (now - last >= intervalMs) {
        sendLockScreenAyahNotification();
      }
    };

    // Check shortly after load and then every 5 minutes
    const initialTimer = setTimeout(checkAndDispatch, 4000);
    const interval = setInterval(checkAndDispatch, 5 * 60 * 1000);

    // Initialize phone power button / lock detection
    const cleanupLockDetector = setupAutomaticLockDetection();

    // Subscribe to Adhan player state and auto-engage lockdown if enabled
    const unsubAdhan = subscribeToAdhanState((playing) => {
      setIsAdhanPlayingState(playing);
      if (playing) {
        const suspensionConfig = getStoredAppSuspensionSettings();
        if (suspensionConfig.enabled && suspensionConfig.autoLockOnAdhan) {
          setActiveLockdownPrayer((current) => {
            if (!current) {
              return { prayer: 'Dhuhr', rakahs: 4 };
            }
            return current;
          });
        }
      }
    });

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      cleanupLockDetector();
      unsubAdhan();
    };
  }, []);

  const currentHijriEstimate = "Rabi' al-Awwal 1448 AH";

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans-custom pb-16">
      {/* Khushu Distraction-Free Lockdown Mode (Fullscreen overlay) */}
      {activeLockdownPrayer && (
        <PrayerLockdownMode
          prayerName={activeLockdownPrayer.prayer}
          rakahs={activeLockdownPrayer.rakahs}
          onComplete={() => {
            const finishedPrayer = activeLockdownPrayer.prayer;
            if (!completedPrayers.includes(finishedPrayer)) {
              setCompletedPrayers((prev) => [...prev, finishedPrayer]);
            }
            setActiveLockdownPrayer(null);
            // Record prayer streak
            recordPrayerStreak(finishedPrayer, true, true, false);
            setStreakStats(getSpiritualStreakStats());
            // Lock app until user recites their post-Sallah Azkar
            setActiveAzkarLockPrayer(finishedPrayer);
          }}
          onExit={() => setActiveLockdownPrayer(null)}
          travelerSettings={travelerSettings}
          onOpenTravelerSettings={() => setIsTravelerModalOpen(true)}
          activeReleaseTimerRemaining={fiveMinReleaseTimer}
          onStartFiveMinTimer={handleStart5MinTimer}
          onCancelFiveMinTimer={handleCancel5MinTimer}
          onOpenSuspensionSettings={() => setIsSuspensionSettingsOpen(true)}
          onVoiceVerificationComplete={(record: VoicePrayerVerificationRecord) => {
            recordPrayerStreak(record.prayerName, true, true, false);
            setStreakStats(getSpiritualStreakStats());
          }}
        />
      )}

      {/* Post-Sallah Azkar Gate: App only accessible after reciting Azkar after finishing Sallah */}
      {activeAzkarLockPrayer && (
        <PostSallahAzkarLockModal
          prayerName={activeAzkarLockPrayer}
          onUnlocked={() => {
            if (activeAzkarLockPrayer) {
              recordPrayerStreak(activeAzkarLockPrayer, true, true, true);
              setStreakStats(getSpiritualStreakStats());
            }
            setActiveAzkarLockPrayer(null);
            playSpiritualChime('takbeer');
          }}
          onEmergencyBypass={() => {
            setActiveAzkarLockPrayer(null);
          }}
        />
      )}

      {/* Top Navigation Bar */}
      <header className="border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Sallah<span className="text-emerald-400">Mate</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-semibold uppercase tracking-wider">
                  Prayer & Witness
                </span>
                {travelerSettings.isTraveler && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-medium">
                    <Plane className="w-3 h-3" />
                    Journey Mode
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-400">
                Daily Sallah Tracker • Camera Mate Verification • Khushu Lockdown • Journey Concessions
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Install on Device button if installable */}
            {(isInstallable || isIOS) && !isInstalled && (
              <button
                id="header-install-pwa-btn"
                onClick={async () => {
                  if (isInstallable) {
                    await install();
                  } else {
                    setIsLockScreenModalOpen(true);
                  }
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-xs font-semibold transition"
                title="Install Sallah Mate on your device for lock screen Ayahs"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            {/* Ask Islamic AI Assistant Trigger */}
            <button
              id="header-ai-assistant-btn"
              onClick={() => setIsAIAssistantOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 hover:text-white text-xs font-semibold transition shadow-sm"
              title="Ask Islamic AI Scholar about prayer fiqh, Hadith, Sunnah, and Azkar"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Spiritual Streaks Trigger */}
            <button
              id="header-streaks-btn"
              onClick={() => setIsStreaksModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 hover:text-white text-xs font-semibold transition shadow-sm"
              title="Daily, Weekly & Monthly Spiritual Streaks & Closeness to Allah"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Streaks</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-900 text-amber-200 text-[10px] font-bold border border-amber-500/40">
                {streakStats.currentStreakDays}d
              </span>
            </button>

            {/* App Suspension & Anti-Bypass Header Trigger */}
            <button
              id="header-suspension-settings-btn"
              onClick={() => setIsSuspensionSettingsOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 hover:text-white text-xs font-semibold transition shadow-sm"
              title="Configure Apps Suspended on Adhan & Strict Anti-Bypass Security"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">App Blocker</span>
            </button>

            {/* Post-Sallah Azkar Lock Trigger */}
            <button
              id="header-azkar-lock-btn"
              onClick={() => setActiveAzkarLockPrayer('Fajr')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-emerald-500/40 text-stone-200 hover:text-white text-xs font-semibold transition"
              title="Lock app for authentic Post-Sallah Sunnah Azkar recitation"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Azkar Lock</span>
            </button>

            {/* Dual Calendar Header Trigger */}
            <button
              id="header-calendar-toggle-btn"
              onClick={() => setIsCalendarModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-emerald-500/40 text-stone-200 hover:text-white text-xs font-semibold transition"
              title="Islamic Hijri & Western Gregorian Dual Calendar"
            >
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Calendar</span>
            </button>

            {/* Daily Dhikr Header Trigger */}
            <button
              id="header-dhikr-toggle-btn"
              onClick={() => {
                document.getElementById('daily-dhikr-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold transition"
              title="Daily Dhikr: Count recommended daily remembrances & learn spiritual benefits"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Daily Dhikr</span>
            </button>

            {/* Call to Prayer (Adhan) Header Trigger */}
            <button
              id="header-adhan-toggle-btn"
              onClick={() => {
                setAdhanModalInitialPrayer(undefined);
                setIsAdhanModalOpen(true);
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                isAdhanPlayingState
                  ? 'bg-emerald-600 border-emerald-400 text-white animate-pulse shadow-lg shadow-emerald-950'
                  : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300'
              }`}
              title="Call to Prayer (Adhan) settings, Muezzin reciters, and audio controls"
            >
              <Volume2 className={`w-4 h-4 ${isAdhanPlayingState ? 'text-white animate-bounce' : 'text-emerald-400'}`} />
              <span className="hidden sm:inline">Call to Prayer</span>
              {isAdhanPlayingState && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-bold uppercase tracking-wider">
                  Live
                </span>
              )}
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Lock Screen Display Header Trigger */}
            <button
              id="header-lockscreen-toggle-btn"
              onClick={() => setIsLockScreenModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold transition relative"
              title="Display Ayahs on lock screen: reminding of Allah, Dunya & Iman"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Lock Screen Ayahs</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
            </button>

            {/* Context-Aware Prayer Duas Header Trigger */}
            <button
              id="header-prayer-duas-btn"
              onClick={() => {
                setActiveDuaPrayer(undefined);
                setIsDuaModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-teal-950/70 hover:bg-teal-900/80 border border-teal-500/50 text-xs font-semibold text-teal-200 transition shadow-sm"
              title="Context-aware Pre-Sallah, During Sallah and Post-Sallah Supplications"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span className="hidden sm:inline">Prayer Duas</span>
            </button>

            {/* Qibla Direction Navigator Header Button */}
            <button
              id="header-qibla-finder-btn"
              onClick={() => setIsQiblaModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/50 text-xs font-semibold text-emerald-200 transition shadow-sm"
              title="Navigate towards the Holy Kaaba in Mecca with live GPS & Compass"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Qibla Finder</span>
            </button>

            {/* Traveler Journey Mode Header Trigger */}
            <button
              id="header-traveler-toggle-btn"
              onClick={() => setIsTravelerModalOpen(true)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                travelerSettings.isTraveler
                  ? 'bg-emerald-900/60 border-emerald-500/60 text-emerald-200 shadow-sm'
                  : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300'
              }`}
              title="Journey Options: tap to continue using app or put 5-minute timer to release suspended apps"
            >
              <Plane className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Journey Mode</span>
              {travelerSettings.isTraveler && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>

            <button
              id="view-witness-ledger-btn"
              onClick={() => setIsLedgerOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-medium text-stone-200 transition"
              title="View Witness Certificates"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Witness Records</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                {verificationRecords.length}
              </span>
            </button>

            <button
              id="open-scanner-quick-btn"
              onClick={() => setActiveScannerPrayer('Asr')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Scan Praying Mate</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating 5-Minute Release Timer Banner if Active */}
      {fiveMinReleaseTimer !== null && (
        <div className="bg-amber-950/90 border-b border-amber-500/50 text-amber-200 px-4 py-2.5 backdrop-blur-md sticky top-[61px] z-30 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2 text-xs">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <span>
              <strong>Journey Release Timer Running:</strong> All suspended phone apps and notifications will be released in{' '}
              <strong className="font-mono text-white text-sm">
                {Math.floor(fiveMinReleaseTimer / 60)}:{(fiveMinReleaseTimer % 60).toString().padStart(2, '0')}
              </strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="cancel-active-timer-btn"
              onClick={handleCancel5MinTimer}
              className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded text-xs transition"
            >
              Cancel
            </button>
            <button
              id="release-now-early-btn"
              onClick={() => {
                setFiveMinReleaseTimer(0);
              }}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold transition flex items-center gap-1"
            >
              <Unlock className="w-3.5 h-3.5" />
              Release Now
            </button>
          </div>
        </div>
      )}

      {/* Release Notification Flash */}
      {releaseNotification && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="p-3.5 bg-emerald-950 border border-emerald-500/50 text-emerald-200 rounded-2xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{releaseNotification}</span>
            </div>
            <button
              onClick={() => setReleaseNotification(null)}
              className="text-stone-400 hover:text-white text-xs px-2 py-0.5 rounded bg-stone-900"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* PWA Install Banner for Lock Screen Display */}
        <PWAInstallBanner onOpenLockScreenSettings={() => setIsLockScreenModalOpen(true)} />

        {/* Quick Informational Notice on Features */}
        <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-stone-300">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-emerald-300">Islamic Mutual Sallah Witnessing & Journey Concessions:</span>
              <span className="text-stone-400 ml-1">
                Scan your companion with camera to verify Sallah. If on a journey, tap Journey Mode to continue using the app freely or set a 5-minute timer to release all suspended apps.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-stone-400 font-mono">
              Completed Today: <strong className="text-emerald-300">{completedPrayers.length}/5</strong>
            </span>
          </div>
        </div>

        {/* Modal: Camera Prayer Mate Scanner */}
        {activeScannerPrayer && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-3xl w-full my-8">
              <CameraMateScanner
                prayerName={activeScannerPrayer}
                onVerificationComplete={handleVerificationComplete}
                onClose={() => setActiveScannerPrayer(null)}
              />
            </div>
          </div>
        )}

        {/* Section 1: Prayer Times Dashboard Card */}
        <section id="prayer-times-section">
          <PrayerTimesCard
            onStartScanner={(prayer) => setActiveScannerPrayer(prayer)}
            onStartLockdown={(prayer, rakahs) => {
              // If traveler and shortens prayers, 4-rakah prayers become 2
              const adjustedRakahs =
                travelerSettings.isTraveler && travelerSettings.shortenPrayers && rakahs === 4
                  ? 2
                  : rakahs;
              setActiveLockdownPrayer({ prayer, rakahs: adjustedRakahs });
            }}
            verificationRecords={verificationRecords}
            onToggleManualStatus={handleToggleManualStatus}
            completedPrayers={completedPrayers}
            travelerSettings={travelerSettings}
            onOpenTravelerSettings={() => setIsTravelerModalOpen(true)}
            onOpenLockScreenModal={() => setIsLockScreenModalOpen(true)}
            onOpenAdhanModal={(prayer) => {
              setAdhanModalInitialPrayer(prayer);
              setIsAdhanModalOpen(true);
            }}
            onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
            onTriggerAzkarLock={(prayer) => setActiveAzkarLockPrayer(prayer)}
            onOpenSuspensionSettings={() => setIsSuspensionSettingsOpen(true)}
            onOpenStreaksModal={() => setIsStreaksModalOpen(true)}
            onOpenDuaModal={(prayer) => {
              setActiveDuaPrayer(prayer);
              setIsDuaModalOpen(true);
            }}
            onOpenQiblaCompass={() => setIsQiblaModalOpen(true)}
          />
        </section>

        {/* Section 2: Daily Dhikr & Remembrances Counter */}
        <section id="daily-dhikr-section">
          <DailyDhikrModule />
        </section>

        {/* Section 3: Islamic Wisdom Library (Quran, Hadith, Books, AI Scholar) */}
        <section id="islamic-library-section">
          <IslamicLibrary />
        </section>
      </main>

      {/* App Suspension & Anti-Bypass Settings Modal */}
      {isSuspensionSettingsOpen && (
        <AppSuspensionSettingsModal
          onClose={() => setIsSuspensionSettingsOpen(false)}
          onSimulateAppBlock={(app) => setInterceptedApp(app)}
        />
      )}

      {/* Spiritual Streaks & Closeness to Allah Modal */}
      {isStreaksModalOpen && (
        <SpiritualStreaksModal
          onClose={() => {
            setIsStreaksModalOpen(false);
            setStreakStats(getSpiritualStreakStats());
          }}
          onOpenAzkarLock={(prayer) => setActiveAzkarLockPrayer(prayer)}
          onOpenScanner={(prayer) => setActiveScannerPrayer(prayer)}
        />
      )}

      {/* Context-Aware Prayer Duas & Supplications Modal */}
      <ContextAwareDuaModal
        isOpen={isDuaModalOpen}
        onClose={() => setIsDuaModalOpen(false)}
        initialPrayer={activeDuaPrayer}
      />

      {/* Qibla Direction Navigator Modal */}
      <QiblaCompassModal
        isOpen={isQiblaModalOpen}
        onClose={() => setIsQiblaModalOpen(false)}
      />

      {/* App Blocker Interceptor Modal (Shown when opening a suspended app during prayer) */}
      {interceptedApp && (
        <AppBlockerInterceptorModal
          app={interceptedApp}
          onGoPray={() => {
            setInterceptedApp(null);
            setActiveLockdownPrayer({ prayer: 'Dhuhr', rakahs: 4 });
          }}
          onClose={() => setInterceptedApp(null)}
        />
      )}

      {/* Call to Prayer (Adhan) Modal */}
      {isAdhanModalOpen && (
        <AdhanModal
          initialPrayer={adhanModalInitialPrayer}
          onClose={() => setIsAdhanModalOpen(false)}
        />
      )}

      {/* Verification Certificates Modal */}
      {isLedgerOpen && (
        <VerificationLedgerModal
          records={verificationRecords}
          onClose={() => setIsLedgerOpen(false)}
          onClearRecords={handleClearRecords}
        />
      )}

      {/* Traveler Journey Concessions Modal */}
      {isTravelerModalOpen && (
        <TravelerJourneyModal
          settings={travelerSettings}
          onUpdateSettings={(newSettings) => setTravelerSettings(newSettings)}
          onClose={() => setIsTravelerModalOpen(false)}
          onTriggerFiveMinTimer={handleStart5MinTimer}
          onOpenQiblaNavigator={() => setIsQiblaModalOpen(true)}
        />
      )}

      {/* Lock Screen Settings & Ayah Gallery Modal */}
      {isLockScreenModalOpen && (
        <LockScreenSettingsModal
          onClose={() => setIsLockScreenModalOpen(false)}
          onOpenAmbientDisplay={(ayahId) => {
            setAmbientInitialAyahId(ayahId);
            setIsAmbientDisplayOpen(true);
          }}
        />
      )}

      {/* Ambient Fullscreen Standby Bedside Lock Screen Mode */}
      {isAmbientDisplayOpen && (
        <LockScreenAmbientDisplay
          onClose={() => setIsAmbientDisplayOpen(false)}
          initialAyahId={ambientInitialAyahId}
        />
      )}

      {/* App Installed Welcome Modal */}
      {justInstalled && (
        <AppInstalledWelcomeModal
          onClose={() => setJustInstalled(false)}
          onOpenAmbientDisplay={() => {
            setJustInstalled(false);
            setIsAmbientDisplayOpen(true);
          }}
          onOpenSettings={() => {
            setJustInstalled(false);
            setIsLockScreenModalOpen(true);
          }}
        />
      )}

      {/* Dual Islamic Hijri & Western Calendar Modal */}
      <DualCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />

      {/* Islamic AI Scholar Assistant Modal */}
      <IslamicAIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />

      {/* Floating Islamic AI Assistant Widget Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          id="floating-ai-assistant-btn"
          onClick={() => setIsAIAssistantOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-2xl shadow-emerald-950 border border-emerald-400/50 transition-all duration-200 active:scale-95 hover:scale-105"
          title="Ask Islamic AI Scholar about prayer fiqh, Hadith, Sunnah, and Azkar"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-bold tracking-wide">Ask AI Scholar</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
        </button>
      </div>

      {/* Offline connectivity indicator */}
      <OfflineIndicator />

      {/* Clean, respectful footer */}
      <footer className="mt-16 text-center text-xs text-stone-500 py-6 border-t border-stone-900 max-w-7xl mx-auto px-4">
        <p className="font-serif italic text-stone-400">
          "Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater."
        </p>
        <p className="mt-1 text-[11px] text-stone-500">
          Surah Al-Ankabut (29:45) • Sallah Mate Prayer Verification & Distraction Shield
        </p>
      </footer>
    </div>
  );
}
