import React, { useState, useEffect } from 'react';
import {
  Moon,
  Volume2,
  Flame,
  Grid,
  MapPin,
  Clock,
  Wifi,
  Battery,
  Signal,
  CheckCircle2,
  Unlock,
  AlertCircle,
  Play,
  Pause,
  Plane,
  ShieldAlert,
} from 'lucide-react';
import { LocationConfig, PrayerName } from '../types';

interface MobileTopBarProps {
  currentLocation: LocationConfig;
  onOpenLocationPicker: () => void;
  nextPrayerName?: string;
  nextPrayerTime?: string;
  timeRemaining?: string;
  isAdhanPlaying: boolean;
  onOpenAdhanModal: () => void;
  streakDays: number;
  onOpenStreaksModal: () => void;
  onOpenQuickMenu: () => void;
  journeyTimerSeconds?: number | null;
  onCancelJourneyTimer?: () => void;
  onReleaseJourneyTimerNow?: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  currentLocation,
  onOpenLocationPicker,
  nextPrayerName,
  nextPrayerTime,
  timeRemaining,
  isAdhanPlaying,
  onOpenAdhanModal,
  streakDays,
  onOpenStreaksModal,
  onOpenQuickMenu,
  journeyTimerSeconds,
  onCancelJourneyTimer,
  onReleaseJourneyTimerNow,
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-xl border-b border-stone-800/70 select-none">
      {/* iOS / Android Native Status Bar */}
      <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[11px] font-medium text-stone-400 max-w-md mx-auto">
        <span className="font-semibold tracking-tight text-stone-200">
          {currentTimeStr || '12:00'}
        </span>

        {/* Dynamic Island / Mobile Status Pill in center */}
        <div className="flex-1 flex justify-center px-2">
          {isAdhanPlaying ? (
            <button
              onClick={onOpenAdhanModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-400/60 text-emerald-300 text-[10px] font-bold shadow-md shadow-emerald-950/60 animate-pulse touch-press"
              title="Adhan is playing. Tap to open audio player"
            >
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-emerald-400 rounded-full animate-wave-1" />
                <span className="w-0.5 bg-emerald-400 rounded-full animate-wave-2" />
                <span className="w-0.5 bg-emerald-400 rounded-full animate-wave-3" />
              </div>
              <span>Adhan Playing</span>
            </button>
          ) : journeyTimerSeconds !== null && journeyTimerSeconds !== undefined && journeyTimerSeconds > 0 ? (
            <button
              onClick={onReleaseJourneyTimerNow}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 border border-amber-500/60 text-amber-300 text-[10px] font-bold shadow-md animate-pulse touch-press"
              title="Journey Release Timer Active. Tap to release now."
            >
              <Clock className="w-3 h-3 text-amber-400 animate-spin" />
              <span>
                Timer {Math.floor(journeyTimerSeconds / 60)}:{(journeyTimerSeconds % 60).toString().padStart(2, '0')}
              </span>
            </button>
          ) : nextPrayerName ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900/90 border border-stone-800 text-[10px] text-stone-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">{nextPrayerName}</span>
              {timeRemaining && <span className="text-stone-400">in {timeRemaining}</span>}
            </div>
          ) : (
            <div className="h-4" />
          )}
        </div>

        {/* Status icons: Signal, WiFi, Battery */}
        <div className="flex items-center gap-1.5 text-stone-400">
          <Signal className="w-3.5 h-3.5 text-stone-300" />
          <Wifi className="w-3.5 h-3.5 text-stone-300" />
          <Battery className="w-4 h-4 text-stone-200" />
        </div>
      </div>

      {/* Main App Navigation Header */}
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand & Location Trigger */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-500 border border-emerald-400/40 flex items-center justify-center text-white shadow-md shadow-emerald-950/50">
            <Moon className="w-5 h-5 fill-white/10" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                Sallah<span className="text-emerald-400">Mate</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-semibold uppercase">
                App
              </span>
            </div>
            {/* Location selector button */}
            <button
              id="topbar-location-btn"
              onClick={onOpenLocationPicker}
              className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-emerald-300 transition-colors touch-press"
              title="Change prayer location"
            >
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[130px] font-medium">
                {currentLocation.city}, {currentLocation.country}
              </span>
            </button>
          </div>
        </div>

        {/* Action Controls: Adhan Sound, Streaks Pill, Quick Actions Drawer */}
        <div className="flex items-center gap-1.5">
          {/* Adhan Sound Toggle Button */}
          <button
            id="topbar-adhan-btn"
            onClick={onOpenAdhanModal}
            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all touch-press ${
              isAdhanPlaying
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-950 animate-pulse'
                : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300'
            }`}
            title="Adhan Reciters and Sound Settings"
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Streaks Pill */}
          <button
            id="topbar-streaks-btn"
            onClick={onOpenStreaksModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 text-xs font-bold transition shadow-sm touch-press"
            title="Spiritual Prayer Streaks"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>{streakDays}d</span>
          </button>

          {/* Quick Menu / All Tools Sheet */}
          <button
            id="topbar-quick-menu-btn"
            onClick={onOpenQuickMenu}
            className="w-8 h-8 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white transition touch-press"
            title="Open Quick Tools & Shortcuts"
          >
            <Grid className="w-4 h-4 text-stone-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
