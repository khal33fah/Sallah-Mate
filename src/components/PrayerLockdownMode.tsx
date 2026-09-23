import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  Moon,
  BellOff,
  PhoneOff,
  VolumeX,
  CheckCircle,
  Sparkles,
  AlertTriangle,
  Play,
  Pause,
  ChevronRight,
  Plane,
  Clock,
  Unlock,
  Mic,
  Lock,
  Eye,
  CheckCircle2,
  X,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { PrayerName, TravelerSettings, VoicePrayerVerificationRecord, SuspendableApp } from '../types';
import { playSpiritualChime } from '../utils/prayerTimes';
import { PrayerVoiceRecorder } from './PrayerVoiceRecorder';
import {
  getStoredAppSuspensionSettings,
  getActiveSuspendedApps,
} from '../services/appSuspensionService';

interface PrayerLockdownModeProps {
  prayerName: PrayerName;
  rakahs: number;
  onComplete: () => void;
  onExit: () => void;
  travelerSettings?: TravelerSettings;
  onOpenTravelerSettings?: () => void;
  activeReleaseTimerRemaining?: number | null; // seconds remaining if 5-min timer is running
  onStartFiveMinTimer?: () => void;
  onCancelFiveMinTimer?: () => void;
  onOpenSuspensionSettings?: () => void;
  onVoiceVerificationComplete?: (record: VoicePrayerVerificationRecord) => void;
}

export const PrayerLockdownMode: React.FC<PrayerLockdownModeProps> = ({
  prayerName,
  rakahs,
  onComplete,
  onExit,
  travelerSettings,
  onOpenTravelerSettings,
  activeReleaseTimerRemaining,
  onStartFiveMinTimer,
  onCancelFiveMinTimer,
  onOpenSuspensionSettings,
  onVoiceVerificationComplete,
}) => {
  const [suspensionSettings, setSuspensionSettings] = useState(() => getStoredAppSuspensionSettings());
  const [suspendedApps, setSuspendedApps] = useState<SuspendableApp[]>(() => getActiveSuspendedApps());

  // Mode: 'guided' (step-by-step posture & dhikr) vs 'voice' (voice recording Iqamah & details)
  const [activeView, setActiveView] = useState<'guided' | 'voice' | 'apps'>(
    suspensionSettings.requireVoiceRecordingToBypass ? 'voice' : 'guided'
  );

  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [currentRakah, setCurrentRakah] = useState<number>(1);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isDhikrMode, setIsDhikrMode] = useState<boolean>(false);
  const [tasbihCount, setTasbihCount] = useState<number>(0);
  const [tasbihPhase, setTasbihPhase] = useState<'subhanallah' | 'alhamdulillah' | 'allahuakbar'>('subhanallah');
  const [isAzkarFullyFinished, setIsAzkarFullyFinished] = useState<boolean>(false);
  const [blockedNotifications, setBlockedNotifications] = useState<number>(5);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);

  // Strict anti-bypass emergency states
  const [showStrictEmergencyModal, setShowStrictEmergencyModal] = useState<boolean>(false);
  const [strictEmergencyCountdown, setStrictEmergencyCountdown] = useState<number>(10);
  const [emergencyCodeInput, setEmergencyCodeInput] = useState<string>('');
  const [emergencyError, setEmergencyError] = useState<string | null>(null);

  // General exit confirm (for non-strict mode)
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [showSuspendedAppsList, setShowSuspendedAppsList] = useState<boolean>(false);
  const [voiceVerificationRecord, setVoiceVerificationRecord] = useState<VoicePrayerVerificationRecord | null>(null);

  // Local 5-minute countdown fallback if not managed globally
  const [localReleaseSeconds, setLocalReleaseSeconds] = useState<number | null>(null);

  const wakeLockRef = useRef<any>(null);

  // If traveler shortens prayer (Qasr), calculate adjusted rakahs
  const effectiveRakahs =
    travelerSettings?.isTraveler && travelerSettings?.shortenPrayers && rakahs === 4
      ? 2
      : rakahs;

  const PRAYER_STEPS = [
    { title: 'Takbirat al-Ihram', arabic: 'اللهُ أَكْبَر', desc: 'Raise hands to shoulders/ears and proclaim the greatness of Allah.' },
    { title: 'Qiyam (Recitation)', arabic: 'قِيَام وَقِرَاءَة الفَاتِحَة', desc: 'Stand with hands folded, recite Surah Al-Fatiha with sincere focus.' },
    { title: 'Ruku (Bowing)', arabic: 'الرُّكُوع: سُبْحَانَ رَبِّيَ العَظِيم', desc: 'Bow forward with flat back, hands on knees, glorifying Allah the Great.' },
    { title: "I'tidal (Rising)", arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ', desc: 'Stand completely upright praising Allah for hearing the praises.' },
    { title: 'First Sujud (Prostration)', arabic: 'السُّجُود: سُبْحَانَ رَبِّيَ الأَعْلَى', desc: 'Prostrate on seven points: forehead, nose, palms, knees, and toes.' },
    { title: 'Jalsah (Sitting between Sujud)', arabic: 'الجِلْسَة: رَبِّ اغْفِرْ لِي', desc: 'Sit upright calmly asking for forgiveness before the second prostration.' },
    { title: 'Second Sujud', arabic: 'السَّجْدَة الثَّانِيَة', desc: 'Nearest the servant is to his Lord is while in prostration.' },
  ];

  // Prevent casual navigation / window closing when strict lock is active
  useEffect(() => {
    if (!suspensionSettings.strictAntiBypass) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Prayer time has commenced! Strict prayer security is active. Do not abandon your Sallah.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [suspensionSettings.strictAntiBypass]);

  // Request Wake Lock to prevent screen sleep during Sallah
  useEffect(() => {
    let lock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          lock = await (navigator as any).wakeLock.request('screen');
          wakeLockRef.current = lock;
          setWakeLockActive(true);
        }
      } catch (err) {
        console.warn('Wake Lock not available or denied:', err);
      }
    };
    requestWakeLock();

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, []);

  // Timer loop & simulated notification shield
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);

      // Distraction block counter
      if (Math.random() < 0.12) {
        setBlockedNotifications((c) => c + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Strict emergency countdown timer
  useEffect(() => {
    let countTimer: any = null;
    if (showStrictEmergencyModal && strictEmergencyCountdown > 0) {
      countTimer = setInterval(() => {
        setStrictEmergencyCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(countTimer);
  }, [showStrictEmergencyModal, strictEmergencyCountdown]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextStep = () => {
    playSpiritualChime('gentle');
    if (currentStepIndex < PRAYER_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed a rakah
      if (currentRakah < effectiveRakahs) {
        setCurrentRakah((prev) => prev + 1);
        setCurrentStepIndex(0);
        playSpiritualChime('takbeer');
      } else {
        // All rakahs finished! Move to post-prayer dhikr
        setIsDhikrMode(true);
        playSpiritualChime('takbeer');
      }
    }
  };

  const handleTasbihTap = () => {
    playSpiritualChime('gentle');
    const nextCount = tasbihCount + 1;
    setTasbihCount(nextCount);

    if (nextCount === 33) {
      if (tasbihPhase === 'subhanallah') {
        setTasbihPhase('alhamdulillah');
        setTasbihCount(0);
        playSpiritualChime('takbeer');
      } else if (tasbihPhase === 'alhamdulillah') {
        setTasbihPhase('allahuakbar');
        setTasbihCount(0);
        playSpiritualChime('takbeer');
      } else if (tasbihPhase === 'allahuakbar') {
        setIsAzkarFullyFinished(true);
        playSpiritualChime('takbeer');
      }
    }
  };

  const handleVoiceComplete = (record: VoicePrayerVerificationRecord) => {
    setVoiceVerificationRecord(record);
    if (onVoiceVerificationComplete) {
      onVoiceVerificationComplete(record);
    }
    onComplete();
  };

  const handleOpenEmergencyOverride = () => {
    setStrictEmergencyCountdown(10);
    setEmergencyCodeInput('');
    setEmergencyError(null);
    setShowStrictEmergencyModal(true);
  };

  const handleConfirmEmergencyOverride = () => {
    const targetCode = suspensionSettings.emergencyPin || 'EMERGENCY';
    if (emergencyCodeInput.trim().toUpperCase() !== targetCode.toUpperCase()) {
      setEmergencyError(`Incorrect confirmation. Type "${targetCode}" to authorize emergency exit.`);
      return;
    }
    setShowStrictEmergencyModal(false);
    onExit();
  };

  const currentStep = PRAYER_STEPS[currentStepIndex];

  return (
    <div
      id="prayer-lockdown-container"
      className="fixed inset-0 z-50 bg-stone-950 flex flex-col justify-between overflow-y-auto select-none animate-in fade-in duration-300"
    >
      {/* Top Status Bar: Live Shield & Suspended Apps Indicator */}
      <div className="w-full bg-stone-950/90 border-b border-emerald-950/70 p-3 sm:p-4 flex items-center justify-between text-xs backdrop-blur-md">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-xs sm:text-sm tracking-tight">
                {prayerName} Khushu Shield
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold uppercase">
                {suspensionSettings.strictAntiBypass ? 'Strict Anti-Bypass' : 'Active'}
              </span>
            </div>
            <div className="text-[11px] text-stone-400 flex items-center gap-2">
              <span>{effectiveRakahs} Rakahs</span>
              <span>•</span>
              <span className="font-mono text-emerald-400">{formatTime(secondsElapsed)}</span>
            </div>
          </div>
        </div>

        {/* View Switchers (Guided vs Voice Verification vs Suspended Apps) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={() => setActiveView('voice')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeView === 'voice'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Iqamah & Prayer</span>
            <span className="sm:hidden">Voice</span>
          </button>

          <button
            onClick={() => setActiveView('guided')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeView === 'guided'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guided Postures</span>
            <span className="sm:hidden">Postures</span>
          </button>

          <button
            onClick={() => setShowSuspendedAppsList(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
            title="View suspended apps"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{suspendedApps.length} Apps Suspended</span>
          </button>
        </div>
      </div>

      {/* Suspended Apps Alert Banner */}
      <div className="px-4 py-2 bg-gradient-to-r from-rose-950/70 via-stone-950 to-rose-950/70 border-b border-rose-500/30 flex items-center justify-between text-xs text-rose-200">
        <div className="flex items-center gap-2 truncate">
          <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate">
            <strong>Adhan Suspension Active:</strong> {suspendedApps.slice(0, 5).map(a => a.name).join(', ')}
            {suspendedApps.length > 5 ? ` +${suspendedApps.length - 5} more` : ''} are locked.
          </span>
        </div>

        <button
          onClick={() => setShowSuspendedAppsList(true)}
          className="text-[11px] text-rose-300 hover:text-white underline shrink-0 ml-2 font-semibold"
        >
          View All Suspended
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto w-full">
        {/* VIEW 1: VOICE RECORDER FOR IQAMAH & PRAYER DETAILS */}
        {activeView === 'voice' && (
          <div className="w-full">
            <PrayerVoiceRecorder
              prayerName={prayerName}
              rakahs={effectiveRakahs}
              onVoiceVerificationComplete={handleVoiceComplete}
              isStrictAntiBypass={suspensionSettings.strictAntiBypass}
              onCancel={onExit}
            />
          </div>
        )}

        {/* VIEW 2: GUIDED PRAYER POSTURES */}
        {activeView === 'guided' && (
          <div className="w-full space-y-6">
            {!isDhikrMode ? (
              <div className="space-y-6 text-center">
                {/* Rakah badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <span>Rakah {currentRakah} of {effectiveRakahs}</span>
                  <span>•</span>
                  <span>Step {currentStepIndex + 1} of {PRAYER_STEPS.length}</span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 tracking-tight">
                    {currentStep.title}
                  </h2>
                </div>

                {/* Arabic Posture Display */}
                <div className="bg-stone-900/80 border border-emerald-800/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="text-3xl sm:text-4xl text-emerald-300 font-arabic mb-4 tracking-wide leading-loose" dir="rtl">
                    {currentStep.arabic}
                  </div>
                  <p className="text-sm sm:text-base text-stone-300 max-w-lg mx-auto leading-relaxed">
                    {currentStep.desc}
                  </p>

                  {/* Step dots */}
                  <div className="flex justify-center items-center gap-1.5 mt-6">
                    {PRAYER_STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === currentStepIndex
                            ? 'w-6 bg-emerald-400'
                            : i < currentStepIndex
                            ? 'w-2 bg-emerald-600'
                            : 'w-2 bg-stone-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Step Action Button */}
                <div className="flex justify-center gap-3">
                  <button
                    id="next-posture-step-btn"
                    onClick={nextStep}
                    className="w-full max-w-md py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50"
                  >
                    <span>
                      {currentStepIndex < PRAYER_STEPS.length - 1
                        ? 'Next Prayer Posture'
                        : currentRakah < effectiveRakahs
                        ? `Complete Rakah ${currentRakah} & Begin Next`
                        : 'Conclude Sallah & Start Post-Prayer Dhikr'}
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Post-Prayer Dhikr & Tasbih Mode */
              <div className="space-y-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Sallah Completed • Post-Prayer Adhkar
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-stone-100">
                    {tasbihPhase === 'subhanallah' && 'Glorifying Allah (SubhanAllah)'}
                    {tasbihPhase === 'alhamdulillah' && 'Praising Allah (Alhamdulillah)'}
                    {tasbihPhase === 'allahuakbar' && 'Exalting Allah (Allahu Akbar)'}
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Tap anywhere on the counter below to count 33 times
                  </p>
                </div>

                {/* Big Interactive Tasbih Pad */}
                <div
                  id="dhikr-counter-tap-area"
                  onClick={handleTasbihTap}
                  className="w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-full bg-stone-900/90 border-4 border-emerald-500/40 hover:border-emerald-400 flex flex-col items-center justify-center cursor-pointer shadow-2xl transition active:scale-95 group relative overflow-hidden"
                >
                  <div className="text-5xl sm:text-6xl font-black text-emerald-400 group-hover:text-emerald-300">
                    {tasbihCount}
                    <span className="text-base text-stone-500 font-normal">/33</span>
                  </div>
                  <div className="text-xs text-stone-400 mt-2 font-arabic text-xl">
                    {tasbihPhase === 'subhanallah' && 'سُبْحَانَ اللَّه'}
                    {tasbihPhase === 'alhamdulillah' && 'الْحَمْدُ لِلَّه'}
                    {tasbihPhase === 'allahuakbar' && 'اللَّهُ أَكْبَر'}
                  </div>
                </div>

                {isAzkarFullyFinished ? (
                  <button
                    id="finish-prayer-lockdown-btn"
                    onClick={onComplete}
                    className="w-full max-w-md mx-auto py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 transition"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Finish Sallah & Unlock Suspended Apps</span>
                  </button>
                ) : (
                  <p className="text-xs text-stone-500">
                    Seal your prayer with authentic Prophetic Azkar before unlocking suspended apps.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Security Footer */}
      <div className="w-full bg-stone-950/90 border-t border-stone-800/80 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-stone-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Suspension Active ({formatTime(secondsElapsed)})</span>
          </div>

          {/* Traveler 5m Release Button */}
          {activeReleaseTimerRemaining !== undefined && activeReleaseTimerRemaining !== null && activeReleaseTimerRemaining > 0 ? (
            <span className="text-amber-400 font-mono font-semibold bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-500/40">
              Releasing apps in {formatTime(activeReleaseTimerRemaining)}
            </span>
          ) : (
            onStartFiveMinTimer && (
              <button
                onClick={onStartFiveMinTimer}
                className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 border border-emerald-500/40 text-emerald-300 font-medium transition flex items-center gap-1.5"
              >
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>5-Min Release Timer</span>
              </button>
            )
          )}

          {/* Non-strict mode: Continue using app button */}
          {!suspensionSettings.strictAntiBypass && (
            <button
              onClick={onExit}
              className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-medium transition flex items-center gap-1"
            >
              <Unlock className="w-3 h-3" />
              <span>Continue Using App</span>
            </button>
          )}
        </div>

        {/* Emergency Exit Handler */}
        <div>
          {suspensionSettings.strictAntiBypass ? (
            <button
              onClick={handleOpenEmergencyOverride}
              className="text-stone-500 hover:text-rose-400 transition text-[11px] flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Emergency Override</span>
            </button>
          ) : !showExitConfirm ? (
            <button
              onClick={() => setShowExitConfirm(true)}
              className="text-stone-400 hover:text-stone-200 underline decoration-stone-600 transition"
            >
              Emergency Exit Lockdown
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-xs">End session now?</span>
              <button
                onClick={onExit}
                className="px-2.5 py-1 bg-rose-900/80 hover:bg-rose-800 text-rose-100 rounded text-xs font-semibold"
              >
                Yes, Exit
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STRICT EMERGENCY OVERRIDE COVENANT MODAL */}
      {showStrictEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-stone-900 border-2 border-rose-500/50 rounded-2xl w-full max-w-md shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-rose-400">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="font-bold text-base text-white">Strict Anti-Bypass Emergency Override</h3>
              </div>
              <button
                onClick={() => setShowStrictEmergencyModal(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5 text-xs text-stone-300">
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Prophetic Hadith on Abandoning Prayer
              </div>
              <p className="italic">
                “The covenant between us and them is prayer; whoever abandons it has committed disbelief.” (Sunan an-Nasa'i 463)
              </p>
            </div>

            <p className="text-xs text-stone-300">
              Suspended apps are locked to ensure you perform your prayer on time. If you have an authentic medical or safety emergency, wait for the spiritual reflection countdown and type <strong>{suspensionSettings.emergencyPin || 'EMERGENCY'}</strong>.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">Spiritual Reflection Delay:</span>
                <span className="font-mono font-bold text-rose-400">
                  {strictEmergencyCountdown > 0 ? `${strictEmergencyCountdown}s remaining` : 'Unlocked for Input'}
                </span>
              </div>

              <input
                type="text"
                value={emergencyCodeInput}
                onChange={(e) => setEmergencyCodeInput(e.target.value)}
                disabled={strictEmergencyCountdown > 0}
                placeholder={`Type "${suspensionSettings.emergencyPin || 'EMERGENCY'}" to confirm`}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-rose-500 uppercase disabled:opacity-40"
              />

              {emergencyError && (
                <div className="text-[11px] text-rose-400 font-semibold">{emergencyError}</div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowStrictEmergencyModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold"
              >
                Return to Prayer
              </button>
              <button
                onClick={handleConfirmEmergencyOverride}
                disabled={strictEmergencyCountdown > 0 || !emergencyCodeInput.trim()}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg"
              >
                Override & Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUSPENDED APPS INSPECTION MODAL */}
      {showSuspendedAppsList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-stone-900 border border-emerald-500/40 rounded-2xl w-full max-w-lg shadow-2xl p-5 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Apps Suspended for Sallah</h3>
                  <p className="text-[11px] text-stone-400">
                    {suspendedApps.length} apps locked until {prayerName} is completed
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSuspendedAppsList(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {suspendedApps.map((app) => (
                <div
                  key={app.id}
                  className="p-2.5 rounded-xl bg-stone-950 border border-rose-500/30 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-rose-950 border border-rose-500/40 flex items-center justify-center text-rose-300">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-white truncate">{app.name}</div>
                      <div className="text-[10px] text-stone-500 truncate font-mono">{app.packageId || app.category}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-bold border border-rose-500/30 uppercase">
                    Suspended
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
              {onOpenSuspensionSettings && (
                <button
                  onClick={() => {
                    setShowSuspendedAppsList(false);
                    onOpenSuspensionSettings();
                  }}
                  className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure Suspended Apps</span>
                </button>
              )}

              <button
                onClick={() => setShowSuspendedAppsList(false)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold ml-auto"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
