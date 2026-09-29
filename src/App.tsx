import React, { useState, useEffect } from 'react';
import {
  Camera,
  Shield,
  BookOpen,
  Award,
  CheckCircle2,
  Moon,
  Sparkles,
  Volume2,
  Info,
  Plane,
  Clock,
  Unlock,
  Smartphone,
  Download,
  Calendar as CalendarIcon,
  Bot,
  Lock,
  Flame,
  ShieldAlert,
  Compass,
} from 'lucide-react';
import {
  PrayerName,
  VerificationRecord,
  TravelerSettings,
  SuspendableApp,
  LocationConfig,
} from './types';
import {
  DEFAULT_NIGERIA_LOCATION,
  calculatePrayerTimes,
  getNextPrayer,
  playSpiritualChime,
} from './utils/prayerTimes';
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
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { MobileTopBar } from './components/MobileTopBar';
import { MobileToolsHub } from './components/MobileToolsHub';
import { MobileQuickActionSheet } from './components/MobileQuickActionSheet';
import { LocationPickerModal } from './components/LocationPickerModal';
import { InstallModal } from './components/InstallModal';
import { PrayerTimeAdjustmentModal } from './components/PrayerTimeAdjustmentModal';
import { DeviceFrameWrapper } from './components/DeviceFrameWrapper';
import { usePWAInstall } from './hooks/usePWAInstall';
import {
  getStoredLockScreenSettings,
  sendLockScreenAyahNotification,
  setupAutomaticLockDetection,
} from './services/lockScreenNotificationService';
import { subscribeToAdhanState, isAdhanPlaying } from './services/adhanService';
import { getStoredAppSuspensionSettings } from './services/appSuspensionService';
import { recordPrayerStreak, getSpiritualStreakStats } from './services/spiritualStreakService';

export default function App() {
  // Mobile Tab Navigation State
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('prayers');
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState<boolean>(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isPrayerAdjustmentsOpen, setIsPrayerAdjustmentsOpen] = useState<boolean>(false);

  // Selected Location (persisted)
  const [selectedLocation, setSelectedLocation] = useState<LocationConfig>(() => {
    try {
      const saved = localStorage.getItem('sallah_selected_location');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_NIGERIA_LOCATION;
  });

  const handleSelectLocation = (loc: LocationConfig) => {
    setSelectedLocation(loc);
    try {
      localStorage.setItem('sallah_selected_location', JSON.stringify(loc));
    } catch {}
  };

  // Modals & Active Overlays
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

  // Next prayer computation for mobile dynamic status pill
  const [nextPrayerData, setNextPrayerData] = useState<{
    name: string;
    time: string;
    timeRemaining: string;
  } | null>(null);

  useEffect(() => {
    const updateNextPrayer = () => {
      const times = calculatePrayerTimes(new Date(), selectedLocation);
      const nextInfo = getNextPrayer(times);
      if (nextInfo) {
        setNextPrayerData({
          name: nextInfo.next.name,
          time: nextInfo.next.time,
          timeRemaining: nextInfo.timeRemaining,
        });
      }
    };
    updateNextPrayer();
    const interval = setInterval(updateNextPrayer, 30000);
    window.addEventListener('sallah_prayer_adjustments_changed', updateNextPrayer);
    return () => {
      clearInterval(interval);
      window.removeEventListener('sallah_prayer_adjustments_changed', updateNextPrayer);
    };
  }, [selectedLocation]);

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
            'Witnessed with praise to Allah: Brother Bilal observed Fajr prayer in reverence and stillness on the prayer rug.',
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

    const initialTimer = setTimeout(checkAndDispatch, 4000);
    const interval = setInterval(checkAndDispatch, 5 * 60 * 1000);
    const cleanupLockDetector = setupAutomaticLockDetection();

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
      cleanupLockDetector?.();
      unsubAdhan();
    };
  }, []);

  // Quick action shortcut dispatcher from MobileQuickActionSheet
  const handleQuickAction = (key: string) => {
    switch (key) {
      case 'scan':
        setActiveScannerPrayer('Asr');
        break;
      case 'lockdown':
        setActiveLockdownPrayer({ prayer: 'Dhuhr', rakahs: 4 });
        break;
      case 'qibla':
        setActiveMobileTab('qibla');
        setIsQiblaModalOpen(true);
        break;
      case 'dhikr':
        setActiveMobileTab('dhikr');
        break;
      case 'azkar_lock':
        setActiveAzkarLockPrayer('Fajr');
        break;
      case 'journey':
        setIsTravelerModalOpen(true);
        break;
      case 'lockscreen':
        setIsLockScreenModalOpen(true);
        break;
      case 'duas':
        setActiveDuaPrayer(undefined);
        setIsDuaModalOpen(true);
        break;
      case 'ai_scholar':
        setIsAIAssistantOpen(true);
        break;
      case 'calendar':
        setIsCalendarModalOpen(true);
        break;
      case 'adjustments':
        setIsPrayerAdjustmentsOpen(true);
        break;
      case 'install':
        if (isInstallable) {
          install().then((success) => {
            if (!success) setIsInstallModalOpen(true);
          });
        } else {
          setIsInstallModalOpen(true);
        }
        break;
      default:
        break;
    }
  };

  return (
    <DeviceFrameWrapper>
      <div className="flex-1 flex flex-col w-full pb-safe-nav">
        {/* Native Mobile Top Bar with Status and Dynamic Island */}
        <MobileTopBar
          currentLocation={selectedLocation}
          onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
          nextPrayerName={nextPrayerData?.name}
          nextPrayerTime={nextPrayerData?.time}
          timeRemaining={nextPrayerData?.timeRemaining}
          isAdhanPlaying={isAdhanPlayingState}
          onOpenAdhanModal={() => {
            setAdhanModalInitialPrayer(undefined);
            setIsAdhanModalOpen(true);
          }}
          streakDays={streakStats.currentStreakDays}
          onOpenStreaksModal={() => setIsStreaksModalOpen(true)}
          onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
          journeyTimerSeconds={fiveMinReleaseTimer}
          onCancelJourneyTimer={handleCancel5MinTimer}
          onReleaseJourneyTimerNow={() => setFiveMinReleaseTimer(0)}
        />

        {/* Release Notification Flash */}
        {releaseNotification && (
          <div className="px-4 mt-3">
            <div className="p-3 bg-emerald-950 border border-emerald-500/50 text-emerald-200 rounded-2xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{releaseNotification}</span>
              </div>
              <button
                onClick={() => setReleaseNotification(null)}
                className="text-stone-400 hover:text-white text-xs px-2 py-0.5 rounded-lg bg-stone-900 ml-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area switching smoothly based on activeMobileTab */}
        <main className="flex-1 px-4 pt-4">
          {/* TAB 1: Prayers Dashboard */}
          {activeMobileTab === 'prayers' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <PrayerTimesCard
                onStartScanner={(prayer) => setActiveScannerPrayer(prayer)}
                onStartLockdown={(prayer, rakahs) => {
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
                selectedLocation={selectedLocation}
                onSelectLocation={handleSelectLocation}
                onOpenPrayerAdjustments={() => setIsPrayerAdjustmentsOpen(true)}
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

              {/* Install PWA Banner */}
              <PWAInstallBanner onOpenLockScreenSettings={() => setIsLockScreenModalOpen(true)} />
            </div>
          )}

          {/* TAB 2: Daily Dhikr & Remembrances */}
          {activeMobileTab === 'dhikr' && (
            <div className="animate-in fade-in duration-200">
              <DailyDhikrModule />
            </div>
          )}

          {/* TAB 3: Qibla Kaaba Navigator */}
          {activeMobileTab === 'qibla' && (
            <div className="animate-in fade-in duration-200">
              <div className="p-4 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
                  <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Qibla Direction Navigator</h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Live GPS compass pointing straight to the Holy Kaaba in Mecca
                  </p>
                </div>
                <button
                  id="tab-open-qibla-fullscreen-btn"
                  onClick={() => setIsQiblaModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition touch-press shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Open Fullscreen Interactive Compass</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Islamic Library (114 Surahs, Hadith, Books) */}
          {activeMobileTab === 'library' && (
            <div className="animate-in fade-in duration-200">
              <IslamicLibrary />
            </div>
          )}

          {/* TAB 5: Protection & Tools Hub */}
          {activeMobileTab === 'tools' && (
            <div className="animate-in fade-in duration-200">
              <MobileToolsHub
                onOpenPrayerAdjustments={() => setIsPrayerAdjustmentsOpen(true)}
                onOpenSuspensionSettings={() => setIsSuspensionSettingsOpen(true)}
                onOpenAzkarLock={() => setActiveAzkarLockPrayer('Fajr')}
                onOpenTravelerSettings={() => setIsTravelerModalOpen(true)}
                onOpenLockScreenModal={() => setIsLockScreenModalOpen(true)}
                onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
                onOpenLedger={() => setIsLedgerOpen(true)}
                onOpenDuaModal={() => {
                  setActiveDuaPrayer(undefined);
                  setIsDuaModalOpen(true);
                }}
                onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                onInstallApp={async () => {
                  if (isInstallable) {
                    const success = await install();
                    if (!success) setIsInstallModalOpen(true);
                  } else {
                    setIsInstallModalOpen(true);
                  }
                }}
                isInstallable={isInstallable}
                isInstalled={isInstalled}
                travelerSettings={travelerSettings}
                verificationRecordsCount={verificationRecords.length}
                streakDays={streakStats.currentStreakDays}
              />
            </div>
          )}
        </main>

        {/* Mobile Native Bottom Navigation Bar */}
        <MobileBottomNav
          activeTab={activeMobileTab}
          onTabChange={(tab) => setActiveMobileTab(tab)}
          completedPrayersCount={completedPrayers.length}
          isBlockerActive={true}
          isTravelerActive={travelerSettings.isTraveler}
        />

        {/* Mobile Quick Action Sheet Modal */}
        <MobileQuickActionSheet
          isOpen={isQuickMenuOpen}
          onClose={() => setIsQuickMenuOpen(false)}
          onAction={handleQuickAction}
        />

        {/* Location Picker Sheet Modal */}
        <LocationPickerModal
          isOpen={isLocationPickerOpen}
          onClose={() => setIsLocationPickerOpen(false)}
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
        />

        {/* Modal: Camera Prayer Mate Scanner */}
        {activeScannerPrayer && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
            <div className="w-full max-w-lg bg-stone-950 border border-stone-800 rounded-t-[32px] sm:rounded-3xl p-4 shadow-2xl animate-sheet-up">
              <div className="w-12 h-1.5 rounded-full bg-stone-700 mx-auto mb-3" />
              <CameraMateScanner
                prayerName={activeScannerPrayer}
                onVerificationComplete={handleVerificationComplete}
                onClose={() => setActiveScannerPrayer(null)}
              />
            </div>
          </div>
        )}

        {/* Fullscreen Prayer Lockdown Mode */}
        {activeLockdownPrayer && (
          <PrayerLockdownMode
            prayerName={activeLockdownPrayer.prayer}
            rakahs={activeLockdownPrayer.rakahs}
            onComplete={() => {
              if (!completedPrayers.includes(activeLockdownPrayer.prayer)) {
                setCompletedPrayers((prev) => [...prev, activeLockdownPrayer.prayer]);
                recordPrayerStreak(activeLockdownPrayer.prayer, true, false, false);
                setStreakStats(getSpiritualStreakStats());
              }
              const p = activeLockdownPrayer.prayer;
              setActiveLockdownPrayer(null);
              playSpiritualChime('takbeer');
              setActiveAzkarLockPrayer(p);
            }}
            onExit={() => {
              setActiveLockdownPrayer(null);
            }}
          />
        )}

        {/* Post-Sallah Authentic Sunnah Azkar Lock Modal */}
        {activeAzkarLockPrayer && (
          <PostSallahAzkarLockModal
            prayerName={activeAzkarLockPrayer}
            onUnlocked={() => {
              if (!completedPrayers.includes(activeAzkarLockPrayer)) {
                setCompletedPrayers((prev) => [...prev, activeAzkarLockPrayer]);
                recordPrayerStreak(activeAzkarLockPrayer, true, false, true);
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
          currentLocation={selectedLocation}
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

        {/* Dedicated Android & iOS Install Modal */}
        <InstallModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />

        {/* Dedicated Prayer Times Adjustment Modal */}
        <PrayerTimeAdjustmentModal
          isOpen={isPrayerAdjustmentsOpen}
          onClose={() => setIsPrayerAdjustmentsOpen(false)}
          locationConfig={selectedLocation}
          onUpdateLocationConfig={handleSelectLocation}
          onAdjustmentsChange={() => {
            const times = calculatePrayerTimes(new Date(), selectedLocation);
            const nextInfo = getNextPrayer(times);
            if (nextInfo) {
              setNextPrayerData({
                name: nextInfo.next.name,
                time: nextInfo.next.time,
                timeRemaining: nextInfo.timeRemaining,
              });
            }
          }}
        />

        {/* Offline connectivity indicator */}
        <OfflineIndicator />
      </div>
    </DeviceFrameWrapper>
  );
}
