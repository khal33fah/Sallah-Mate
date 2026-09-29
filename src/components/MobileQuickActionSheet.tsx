import React from 'react';
import {
  X,
  Camera,
  Shield,
  Sparkles,
  Compass,
  BookOpen,
  Plane,
  Smartphone,
  Calendar as CalendarIcon,
  Bot,
  Volume2,
  Lock,
  Flame,
  Award,
  Download,
  Sliders,
} from 'lucide-react';

interface MobileQuickActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (actionKey: string) => void;
}

export const MobileQuickActionSheet: React.FC<MobileQuickActionSheetProps> = ({
  isOpen,
  onClose,
  onAction,
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      key: 'scan',
      label: 'Scan Praying Mate',
      desc: 'Verify companion prayer posture',
      icon: Camera,
      color: 'bg-emerald-600 text-white',
    },
    {
      key: 'lockdown',
      label: 'Khushu Lockdown',
      desc: 'Silence distractions during prayer',
      icon: Shield,
      color: 'bg-stone-800 text-emerald-400 border border-emerald-500/30',
    },
    {
      key: 'qibla',
      label: 'Qibla Finder',
      desc: 'Live GPS Kaaba compass',
      icon: Compass,
      color: 'bg-teal-900/80 text-teal-300 border border-teal-500/40',
    },
    {
      key: 'dhikr',
      label: 'Daily Dhikr',
      desc: 'Tasbeeh counter & blessings',
      icon: Sparkles,
      color: 'bg-amber-950/80 text-amber-300 border border-amber-500/40',
    },
    {
      key: 'azkar_lock',
      label: 'Sunnah Azkar Lock',
      desc: 'Post-Sallah authentic lock',
      icon: Lock,
      color: 'bg-stone-800 text-stone-200 border border-stone-700',
    },
    {
      key: 'journey',
      label: 'Journey Mode',
      desc: 'Travel concessions & 5-min timer',
      icon: Plane,
      color: 'bg-emerald-950 text-emerald-300 border border-emerald-500/40',
    },
    {
      key: 'lockscreen',
      label: 'Lock Screen Ayahs',
      desc: 'Bedside standby display',
      icon: Smartphone,
      color: 'bg-indigo-950 text-indigo-300 border border-indigo-500/40',
    },
    {
      key: 'duas',
      label: 'Prayer Duas',
      desc: 'Context-aware supplications',
      icon: BookOpen,
      color: 'bg-teal-950 text-teal-300 border border-teal-500/40',
    },
    {
      key: 'ai_scholar',
      label: 'Ask AI Scholar',
      desc: 'Instant fiqh & Hadith guidance',
      icon: Bot,
      color: 'bg-emerald-900 text-emerald-200 border border-emerald-500/50',
    },
    {
      key: 'calendar',
      label: 'Dual Calendar',
      desc: 'Hijri & Gregorian dates',
      icon: CalendarIcon,
      color: 'bg-stone-800 text-stone-300 border border-stone-700',
    },
    {
      key: 'adjustments',
      label: 'Adjust Prayer Times',
      desc: 'Fine-tune minutes & calculation',
      icon: Sliders,
      color: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50',
    },
    {
      key: 'install',
      label: 'Install App',
      desc: 'Add to Android or iOS home screen',
      icon: Download,
      color: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop tap to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-stone-950 border border-stone-800 rounded-t-[32px] sm:rounded-3xl shadow-2xl p-5 z-10 animate-sheet-up max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* iOS Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-stone-700 mx-auto mb-4" />

        <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Quick Actions & Shortcuts</h3>
            <p className="text-xs text-stone-400">Instant access to Sallah Mate features</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.key}
                onClick={() => {
                  onAction(act.key);
                  onClose();
                }}
                className="flex items-start gap-3 p-3 rounded-2xl bg-stone-900/90 hover:bg-stone-800/90 border border-stone-800/80 text-left transition-all touch-press group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-200 group-hover:text-emerald-300 truncate">
                    {act.label}
                  </div>
                  <div className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                    {act.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
