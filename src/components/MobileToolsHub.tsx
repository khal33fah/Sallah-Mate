import React from 'react';
import {
  Shield,
  ShieldAlert,
  Lock,
  Plane,
  Smartphone,
  Calendar as CalendarIcon,
  Award,
  BookOpen,
  Bot,
  Download,
  ChevronRight,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sliders,
} from 'lucide-react';
import { TravelerSettings } from '../types';

interface MobileToolsHubProps {
  onOpenPrayerAdjustments?: () => void;
  onOpenSuspensionSettings: () => void;
  onOpenAzkarLock: () => void;
  onOpenTravelerSettings: () => void;
  onOpenLockScreenModal: () => void;
  onOpenCalendarModal: () => void;
  onOpenLedger: () => void;
  onOpenDuaModal: () => void;
  onOpenAIAssistant: () => void;
  onInstallApp: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  travelerSettings: TravelerSettings;
  verificationRecordsCount: number;
  streakDays: number;
}

export const MobileToolsHub: React.FC<MobileToolsHubProps> = ({
  onOpenPrayerAdjustments,
  onOpenSuspensionSettings,
  onOpenAzkarLock,
  onOpenTravelerSettings,
  onOpenLockScreenModal,
  onOpenCalendarModal,
  onOpenLedger,
  onOpenDuaModal,
  onOpenAIAssistant,
  onInstallApp,
  isInstallable,
  isInstalled,
  travelerSettings,
  verificationRecordsCount,
  streakDays,
}) => {
  return (
    <div className="space-y-6 pb-6 select-none">
      {/* Header Profile / Shield Overview Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/60 border border-stone-800 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Spiritual Protection Hub</h2>
              <p className="text-xs text-stone-400">Khushu Guardian & Islamic Tools</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
            Active
          </span>
        </div>

        <div className="mt-4 pt-3.5 border-t border-stone-800/80 grid grid-cols-3 gap-2 text-center">
          <div className="bg-stone-950/60 rounded-2xl p-2.5 border border-stone-800/60">
            <div className="text-[10px] text-stone-400 uppercase font-semibold">Streak</div>
            <div className="text-sm font-extrabold text-amber-400 mt-0.5">{streakDays} Days</div>
          </div>
          <div className="bg-stone-950/60 rounded-2xl p-2.5 border border-stone-800/60">
            <div className="text-[10px] text-stone-400 uppercase font-semibold">Witnesses</div>
            <div className="text-sm font-extrabold text-emerald-400 mt-0.5">{verificationRecordsCount} Cards</div>
          </div>
          <div className="bg-stone-950/60 rounded-2xl p-2.5 border border-stone-800/60">
            <div className="text-[10px] text-stone-400 uppercase font-semibold">Journey</div>
            <div className="text-sm font-extrabold text-stone-300 mt-0.5">
              {travelerSettings.isTraveler ? 'Active' : 'Home'}
            </div>
          </div>
        </div>
      </div>

      {/* Group: Prayer Times & Accuracy Settings */}
      <div className="space-y-2">
        <div className="px-2 text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Prayer Times & Calculations</span>
        </div>

        <div className="rounded-2xl bg-stone-900/80 border border-stone-800/90 overflow-hidden divide-y divide-stone-800/70 shadow-md">
          {/* Prayer Time Adjustments & Method */}
          <button
            onClick={onOpenPrayerAdjustments}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-800/50 transition touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Adjust Prayer Times & Calculation</div>
                <div className="text-xs text-stone-400">Fine-tune +/- minutes for each prayer, calculation authority & Asr madhab</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
          </button>
        </div>
      </div>

      {/* Group 1: Protection & Focus Controls */}
      <div className="space-y-2">
        <div className="px-2 text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Distraction Blockers & Khushu</span>
        </div>

        <div className="rounded-2xl bg-stone-900/80 border border-stone-800/90 overflow-hidden divide-y divide-stone-800/70 shadow-md">
          {/* App Suspension & Anti-Bypass Blocker */}
          <button
            onClick={onOpenSuspensionSettings}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-800/50 transition touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">App Blocker & Anti-Bypass</div>
                <div className="text-xs text-stone-400">Suspends phone apps on Adhan until prayer is verified</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
          </button>

          {/* Post-Sallah Sunnah Azkar Lock */}
          <button
            onClick={onOpenAzkarLock}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-800/50 transition touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Post-Sallah Azkar Lock</div>
                <div className="text-xs text-stone-400">Lock device until authentic Sunnah Azkar are recited</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
          </button>

          {/* Traveler Journey Concessions */}
          <button
            onClick={onOpenTravelerSettings}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-800/50 transition touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
                <Plane className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Traveler Journey Concessions</div>
                <div className="text-xs text-stone-400">
                  {travelerSettings.isTraveler
                    ? 'Active: 4-rakahs shortened to 2 • 5-min release timer'
                    : 'Configure travel mode & 5-minute emergency release'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
          </button>
        </div>
      </div>

      {/* Group 2: Device & Ambient Integration */}
      <div className="space-y-2">
        <div className="px-2 text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Device Display & Integration</span>
        </div>

        <div className="rounded-2xl bg-stone-900/80 border border-stone-800/90 overflow-hidden divide-y divide-stone-800/70 shadow-md">
          {/* Lock Screen Standby Ayahs */}
          <button
            onClick={onOpenLockScreenModal}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-800/50 transition touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Lock Screen Ayahs (Standby Mode)</div>
                <div className="text-xs text-stone-400">Bedside ambient display of Allah, Dunya & Iman</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
          </button>

          {/* Install to Android / iOS Home Screen */}
          {!isInstalled && (
            <button
              onClick={onInstallApp}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-800/50 transition touch-press"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 border border-emerald-400 flex items-center justify-center text-white shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Install Sallah Mate on Device</div>
                  <div className="text-xs text-stone-400">Full native app icon on home screen with offline support</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* Group 3: Wisdom, Duas & Records */}
      <div className="space-y-2">
        <div className="px-2 text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
          <span>Knowledge & Verification</span>
        </div>

        <div className="rounded-2xl bg-stone-900/80 border border-stone-800/90 overflow-hidden divide-y divide-stone-800/70 shadow-md">
          {/* Dual Calendar */}
          <button
            onClick={onOpenCalendarModal}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-800/50 transition touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 shrink-0">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Dual Islamic Hijri Calendar</div>
                <div className="text-xs text-stone-400">Sync with lunar dates, Islamic milestones & history</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
          </button>

          {/* Context-Aware Duas */}
          <button
            onClick={onOpenDuaModal}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-800/50 transition touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Context-Aware Prayer Duas</div>
                <div className="text-xs text-stone-400">Pre-Sallah, during Ruku/Sujud, and post-prayer supplications</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
          </button>

          {/* Sallah Witness Ledger */}
          <button
            onClick={onOpenLedger}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-800/50 transition touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Witness Ledger & Certificates</div>
                <div className="text-xs text-stone-400">
                  {verificationRecordsCount} verified camera mate certificates
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
          </button>

          {/* Islamic AI Scholar */}
          <button
            onClick={onOpenAIAssistant}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-800/50 transition touch-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Ask Islamic AI Scholar</div>
                <div className="text-xs text-stone-400">Authentic answers grounded in Quran and Hadith</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
