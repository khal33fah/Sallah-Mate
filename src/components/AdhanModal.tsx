import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Volume1,
  VolumeX,
  Play,
  Square,
  X,
  Check,
  Radio,
  Sparkles,
  Clock,
  Compass,
  Heart,
  Sliders,
  Bell,
  BellOff,
  Timer,
  RotateCcw,
} from 'lucide-react';
import {
  AdhanSettings,
  PrayerName,
} from '../types';
import {
  getStoredAdhanSettings,
  saveAdhanSettings,
  playAdhan,
  stopAdhan,
  isAdhanPlaying,
  getActiveAdhanPrayer,
  subscribeToAdhanState,
  setAdhanVolume,
  toggleAdhanMute,
  snoozeAdhan,
  cancelSnooze,
  isAdhanSnoozed,
  MUEZZIN_OPTIONS,
  DUA_AFTER_ADHAN,
  ADHAN_WORDS,
} from '../services/adhanService';

interface AdhanModalProps {
  onClose: () => void;
  initialPrayer?: PrayerName;
}

export const AdhanModal: React.FC<AdhanModalProps> = ({ onClose, initialPrayer }) => {
  const [settings, setSettings] = useState<AdhanSettings>(getStoredAdhanSettings());
  const [isPlaying, setIsPlaying] = useState<boolean>(isAdhanPlaying());
  const [currentPrayer, setCurrentPrayer] = useState<PrayerName>(
    getActiveAdhanPrayer() || initialPrayer || 'Dhuhr'
  );
  const [activeTab, setActiveTab] = useState<'player' | 'settings' | 'dua'>('player');
  const [snoozeStatus, setSnoozeStatus] = useState(isAdhanSnoozed());
  const [selectedSnoozeMinutes, setSelectedSnoozeMinutes] = useState<number>(settings.snoozeMinutes || 10);
  const [snoozeNotification, setSnoozeNotification] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToAdhanState((playing, prayer) => {
      setIsPlaying(playing);
      if (prayer) setCurrentPrayer(prayer);
    });

    const interval = setInterval(() => {
      setSnoozeStatus(isAdhanSnoozed());
    }, 1000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const handleToggleAdhan = () => {
    if (isPlaying) {
      stopAdhan();
    } else {
      // Cancel any active snooze when manually playing
      if (snoozeStatus.snoozed) {
        cancelSnooze();
        setSnoozeStatus({ snoozed: false, remainingMinutes: 0 });
      }
      playAdhan(currentPrayer || 'Dhuhr', settings.selectedMuezzin);
    }
  };

  const handleMuezzinSelect = (muezzinId: 'makkah' | 'madinah' | 'alafasy' | 'fajr_special') => {
    const updated = { ...settings, selectedMuezzin: muezzinId };
    setSettings(updated);
    saveAdhanSettings(updated);
    if (isPlaying) {
      playAdhan(currentPrayer, muezzinId);
    }
  };

  const handlePrayerToggle = (prayer: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha') => {
    const updated = {
      ...settings,
      playFor: {
        ...settings.playFor,
        [prayer]: !settings.playFor[prayer],
      },
    };
    setSettings(updated);
    saveAdhanSettings(updated);
  };

  const handleSelectAllPrayers = (enableAll: boolean) => {
    const updated = {
      ...settings,
      playFor: {
        Fajr: enableAll,
        Dhuhr: enableAll,
        Asr: enableAll,
        Maghrib: enableAll,
        Isha: enableAll,
      },
    };
    setSettings(updated);
    saveAdhanSettings(updated);
  };

  const handleVolumeChange = (vol: number) => {
    setAdhanVolume(vol);
    setSettings(getStoredAdhanSettings());
  };

  const handleToggleMute = () => {
    toggleAdhanMute();
    setSettings(getStoredAdhanSettings());
  };

  const handleGlobalToggle = () => {
    const updated = { ...settings, enabled: !settings.enabled };
    setSettings(updated);
    saveAdhanSettings(updated);
  };

  const handleSnooze = (mins: number) => {
    setSelectedSnoozeMinutes(mins);
    snoozeAdhan(mins, currentPrayer);
    setSnoozeStatus({ snoozed: true, remainingMinutes: mins });
    setSnoozeNotification(`Adhan snoozed for ${mins} minutes. It will resume automatically.`);
    setTimeout(() => setSnoozeNotification(null), 4000);
  };

  const handleCancelSnooze = () => {
    cancelSnooze();
    setSnoozeStatus({ snoozed: false, remainingMinutes: 0 });
    setSnoozeNotification('Adhan snooze cancelled.');
    setTimeout(() => setSnoozeNotification(null), 3000);
  };

  return (
    <div
      id="adhan-modal-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="adhan-modal-container"
        className="bg-stone-900 border border-emerald-500/30 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 px-6 py-5 border-b border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Radio className={`w-5 h-5 ${isPlaying ? 'animate-pulse text-emerald-300' : ''}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                Call to Prayer (Adhan • الأذان)
                {isPlaying && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono animate-pulse">
                    Live Playing
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-400">
                {settings.enabled ? 'Automatic Call to Prayer enabled' : 'Adhan is currently muted'}
              </p>
            </div>
          </div>

          <button
            id="close-adhan-modal-btn"
            onClick={() => {
              if (isPlaying) stopAdhan();
              onClose();
            }}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 px-6 bg-stone-950/60">
          <button
            onClick={() => setActiveTab('player')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'player'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Adhan Recitation & Words
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Adhan Settings & Mu’adhins
          </button>

          <button
            onClick={() => setActiveTab('dua')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'dua'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Dua After Adhan
          </button>
        </div>

        {/* Tab 1: PLAYER & LIVE ADHAN WORDS */}
        {activeTab === 'player' && (
          <div className="p-6 space-y-6">
            {/* Snooze Active Alert Banner */}
            {snoozeStatus.snoozed && (
              <div className="p-3.5 rounded-2xl bg-amber-950/50 border border-amber-500/40 flex items-center justify-between gap-3 text-amber-200 text-xs">
                <div className="flex items-center gap-2.5">
                  <Timer className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                  <div>
                    <span className="font-bold">Call to Prayer Snoozed</span>: Resumes in{' '}
                    <span className="font-mono font-bold text-amber-300">
                      {snoozeStatus.remainingMinutes} min
                    </span>{' '}
                    ({currentPrayer})
                  </div>
                </div>
                <button
                  onClick={handleCancelSnooze}
                  className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            )}

            {/* Temporary Toast notification */}
            {snoozeNotification && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs text-center animate-in fade-in">
                {snoozeNotification}
              </div>
            )}

            {/* Live Visualizer Card */}
            <div className="bg-stone-950 border border-emerald-950 rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-emerald-900/10 to-transparent pointer-events-none" />

              {/* Prayer Quick Selector for manual playback */}
              <div className="flex items-center justify-center gap-1.5 mb-3 flex-wrap">
                {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).map((pr) => (
                  <button
                    key={pr}
                    onClick={() => {
                      setCurrentPrayer(pr);
                      if (isPlaying) {
                        playAdhan(pr, settings.selectedMuezzin);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
                      currentPrayer === pr
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>

              <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                {currentPrayer ? `${currentPrayer} Sallah Call` : 'Call to Prayer'}
              </div>

              <div className="text-2xl sm:text-3xl font-bold font-arabic text-emerald-300 my-2" dir="rtl">
                اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ
              </div>

              {/* Transliteration directly below Arabic text */}
              <div className="text-xs sm:text-sm font-semibold text-emerald-200 tracking-wide">
                Allāhu Akbar, Allāhu Akbar
              </div>

              <p className="text-xs text-stone-400 italic mt-1">
                “Allah is the Greatest, Allah is the Greatest”
              </p>

              {/* Animated Equalizer Waves */}
              <div className="flex items-center justify-center gap-1.5 my-5 h-8">
                {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      isPlaying && !settings.isMuted
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-stone-800'
                    }`}
                    style={{
                      height:
                        isPlaying && !settings.isMuted
                          ? `${Math.max(15, h * (settings.volume || 0.8))}%`
                          : '20%',
                      animationDelay: `${i * 70}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Play / Stop / Snooze Control Buttons */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  id="toggle-adhan-play-btn"
                  onClick={handleToggleAdhan}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition shadow-lg ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-4 h-4 fill-current" />
                      Stop Adhan Audio
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      Play Adhan ({settings.selectedMuezzin.toUpperCase()})
                    </>
                  )}
                </button>

                {/* Snooze Control Button */}
                {snoozeStatus.snoozed ? (
                  <button
                    id="cancel-adhan-snooze-btn"
                    onClick={handleCancelSnooze}
                    className="px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Cancel Snooze ({snoozeStatus.remainingMinutes}m)
                  </button>
                ) : (
                  <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-2xl p-1">
                    <span className="text-[11px] text-stone-400 font-medium px-2 flex items-center gap-1">
                      <Timer className="w-3 h-3 text-stone-400" />
                      Snooze:
                    </span>
                    {[5, 10, 15].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => handleSnooze(mins)}
                        title={`Snooze for ${mins} minutes`}
                        className={`px-2.5 py-1 text-xs rounded-xl font-semibold transition ${
                          selectedSnoozeMinutes === mins
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Mute Toggle */}
                <button
                  onClick={handleToggleMute}
                  title={settings.isMuted ? 'Unmute Adhan' : 'Mute Adhan'}
                  className={`p-2.5 rounded-2xl border transition ${
                    settings.isMuted
                      ? 'bg-red-950/40 border-red-500/40 text-red-400'
                      : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
                  }`}
                >
                  {settings.isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Volume Slider in Player */}
              <div className="mt-5 pt-4 border-t border-stone-900 max-w-sm mx-auto flex items-center gap-3 text-xs">
                <button
                  onClick={handleToggleMute}
                  className="text-stone-400 hover:text-white transition"
                >
                  {settings.isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.isMuted ? 0 : settings.volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="font-mono text-stone-400 w-10 text-right">
                  {settings.isMuted ? '0%' : `${Math.round(settings.volume * 100)}%`}
                </span>
              </div>
            </div>

            {/* Step-by-Step Adhan Phrases */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Phrases of the Call to Prayer (Listen & Repeat)
              </h3>
              <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
                {ADHAN_WORDS.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1.5"
                  >
                    {/* Arabic text on top */}
                    <div className="text-right font-arabic text-emerald-300 text-lg leading-relaxed" dir="rtl">
                      {w.arabic}
                    </div>

                    {/* Transliteration directly below Arabic text */}
                    <div className="pt-1 border-t border-stone-800/80">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Transliteration
                      </div>
                      <div className="text-xs font-semibold text-stone-100 mt-0.5">
                        {w.transliteration}
                      </div>
                      <div className="text-[11px] text-stone-400 italic mt-0.5">{w.translation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SETTINGS & MU'ADHIN SELECTION */}
        {activeTab === 'settings' && (
          <div className="p-6 space-y-6">
            {/* Global Master Switch */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-stone-100">
                  Enable Automatic Call to Prayer
                </div>
                <div className="text-xs text-stone-400">
                  Automatically plays the Adhan when each prayer time arrives
                </div>
              </div>
              <button
                id="toggle-master-adhan-btn"
                onClick={handleGlobalToggle}
                className={`w-14 h-7 rounded-full transition-colors relative p-1 ${
                  settings.enabled ? 'bg-emerald-600' : 'bg-stone-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.enabled ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Select Muezzin Voice */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Select Sacred Mu’adhin Voice
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MUEZZIN_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleMuezzinSelect(opt.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-start justify-between gap-2 ${
                      settings.selectedMuezzin === opt.id
                        ? 'bg-emerald-950/60 border-emerald-500 text-white'
                        : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-800/40'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{opt.name}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{opt.description}</div>
                    </div>
                    {settings.selectedMuezzin === opt.id && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Per Prayer Audio Toggles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Automatic Call to Prayer Schedule
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSelectAllPrayers(true)}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition"
                  >
                    Select All
                  </button>
                  <span className="text-stone-600 text-xs">•</span>
                  <button
                    onClick={() => handleSelectAllPrayers(false)}
                    className="text-[11px] font-semibold text-stone-400 hover:text-stone-300 transition"
                  >
                    Mute All
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-stone-400">
                Select which prayer times should trigger the automatic Adhan sound:
              </p>
              <div className="grid grid-cols-5 gap-2">
                {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).map((pr) => {
                  const isActive = settings.playFor[pr];
                  return (
                    <button
                      key={pr}
                      onClick={() => handlePrayerToggle(pr)}
                      className={`py-2.5 px-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                        isActive
                          ? 'bg-emerald-900/40 border-emerald-500/60 text-emerald-200'
                          : 'bg-stone-950/50 border-stone-800 text-stone-500 hover:border-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{pr}</div>
                      <div className="text-[10px] mt-1 flex items-center gap-1">
                        {isActive ? (
                          <>
                            <Bell className="w-3 h-3 text-emerald-400" />
                            <span>ON</span>
                          </>
                        ) : (
                          <>
                            <BellOff className="w-3 h-3 text-stone-600" />
                            <span>Muted</span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume and Mute Controls */}
            <div className="space-y-3 bg-stone-950 p-4 rounded-xl border border-stone-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-300 font-semibold flex items-center gap-1.5">
                  {settings.isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                  Adhan Volume Control
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleMute}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition border ${
                      settings.isMuted
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                    }`}
                  >
                    {settings.isMuted ? 'Muted' : 'Active'}
                  </button>
                  <span className="text-emerald-400 font-mono">
                    {settings.isMuted ? '0%' : `${Math.round(settings.volume * 100)}%`}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.isMuted ? 0 : settings.volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Snooze Settings & Quick Snooze Action */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-300">
                  <Timer className="w-4 h-4 text-amber-400" />
                  Adhan Snooze Control
                </div>
                {snoozeStatus.snoozed && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                    Snoozed: {snoozeStatus.remainingMinutes} min left
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                Temporarily pause the call to prayer if in a meeting or prayer preparation. It will automatically re-sound once the snooze period completes:
              </p>
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {[5, 10, 15, 20].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSnooze(mins)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                      selectedSnoozeMinutes === mins && snoozeStatus.snoozed
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    Snooze {mins} min
                  </button>
                ))}
                {snoozeStatus.snoozed && (
                  <button
                    onClick={handleCancelSnooze}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    Cancel Snooze
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: DUA AFTER THE ADHAN */}
        {activeTab === 'dua' && (
          <div className="p-6 space-y-5">
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Authentic Sunnah Supplication
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-900/80 text-emerald-200">
                  Sahih al-Bukhari
                </span>
              </div>

              {/* Arabic text */}
              <div
                className="font-arabic text-xl sm:text-2xl text-right text-emerald-200 leading-loose p-4 rounded-xl bg-stone-950/70 border border-emerald-500/20"
                dir="rtl"
              >
                {DUA_AFTER_ADHAN.arabic}
              </div>

              {/* Transliteration directly below Arabic text */}
              <div className="p-3.5 rounded-xl bg-stone-950/80 border border-emerald-500/30 text-left space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Transliteration
                </div>
                <div className="text-xs sm:text-sm text-stone-100 font-semibold leading-relaxed">
                  {DUA_AFTER_ADHAN.transliteration}
                </div>
              </div>

              {/* English Translation */}
              <div className="text-xs sm:text-sm text-stone-200 leading-relaxed p-3.5 bg-stone-950/40 rounded-xl border border-stone-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Translation & Meaning
                </span>
                {DUA_AFTER_ADHAN.translation}
              </div>

              {/* Hadith citation */}
              <div className="text-[11px] text-emerald-300/80 border-t border-emerald-900/50 pt-2">
                {DUA_AFTER_ADHAN.hadithRef}
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="bg-stone-950 px-6 py-4 border-t border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            {isPlaying ? 'Adhan is currently playing in your speaker' : 'Ready to call for prayer'}
          </span>
          <button
            onClick={() => {
              if (isPlaying) stopAdhan();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
