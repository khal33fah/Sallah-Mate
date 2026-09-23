import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  BookOpen,
  Info,
  ChevronDown,
  ChevronUp,
  Flame,
  Award,
  Maximize2,
  Minimize2,
  Plus,
  Compass,
} from 'lucide-react';
import { DhikrItem } from '../types';
import { RECOMMENDED_DAILY_DHIKR } from '../data/dailyDhikrData';
import { playSpiritualChime } from '../utils/prayerTimes';

type DhikrProgressMap = Record<string, number>;

export const DailyDhikrModule: React.FC = () => {
  // Load progress from localStorage with daily reset check
  const [progress, setProgress] = useState<DhikrProgressMap>(() => {
    try {
      const todayKey = new Date().toISOString().split('T')[0];
      const savedDate = localStorage.getItem('sallah_dhikr_date');
      const savedData = localStorage.getItem('sallah_dhikr_progress');

      if (savedDate === todayKey && savedData) {
        return JSON.parse(savedData);
      }
      return {};
    } catch {
      return {};
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sallah_dhikr_sound') !== 'false';
    } catch {
      return true;
    }
  });
  const [expandedBenefitId, setExpandedBenefitId] = useState<string | null>(null);
  const [focusedDhikrId, setFocusedDhikrId] = useState<string | null>(null);
  const [lastIncrementedId, setLastIncrementedId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      const todayKey = new Date().toISOString().split('T')[0];
      localStorage.setItem('sallah_dhikr_date', todayKey);
      localStorage.setItem('sallah_dhikr_progress', JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    try {
      localStorage.setItem('sallah_dhikr_sound', String(nextVal));
    } catch {
      // ignore
    }
  };

  const incrementCount = (item: DhikrItem, amount: number = 1) => {
    const current = progress[item.id] || 0;
    const nextCount = Math.min(item.recommendedCount * 3, current + amount);

    setProgress((prev) => ({
      ...prev,
      [item.id]: nextCount,
    }));

    setLastIncrementedId(item.id);
    setTimeout(() => setLastIncrementedId(null), 300);

    // Haptic feedback if supported on mobile
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // ignore
      }
    }

    // Audio chime
    if (soundEnabled) {
      if (nextCount === item.recommendedCount) {
        playSpiritualChime('takbeer');
      } else {
        playSpiritualChime('gentle');
      }
    }
  };

  const resetSingleDhikr = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setProgress((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const resetAllProgress = () => {
    if (window.confirm('Reset all dhikr counts for today?')) {
      setProgress({});
    }
  };

  // Calculations
  const categories = ['All', 'Daily Essentials', 'Morning & Evening', 'Post-Prayer', 'Virtues & Forgiveness'];

  const filteredList = RECOMMENDED_DAILY_DHIKR.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const totalDhikrRecited = Object.values(progress).reduce((acc, val) => acc + val, 0);
  const totalCompletedGoals = RECOMMENDED_DAILY_DHIKR.filter(
    (item) => (progress[item.id] || 0) >= item.recommendedCount
  ).length;

  const focusedDhikr = focusedDhikrId
    ? RECOMMENDED_DAILY_DHIKR.find((d) => d.id === focusedDhikrId)
    : null;

  return (
    <div
      id="daily-dhikr-module"
      className="bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:p-7 text-stone-100 shadow-xl relative overflow-hidden transition-all"
    >
      {/* Decorative ambient glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800 relative z-10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              SPIRITUAL NOURISHMENT
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
              Daily Adhkar & Tasbih
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
            Daily Dhikr Remembrances
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
            "Verily, in the remembrance of Allah do hearts find rest." (Surah Ar-Ra’d 13:28).
            Count your daily sunnah praises, track progress, and learn the profound spiritual benefits and Hadith virtues of each.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            id="toggle-dhikr-sound-btn"
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Chime sound enabled on tap' : 'Chime sound muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>

          <button
            id="reset-all-dhikr-btn"
            onClick={resetAllProgress}
            className="p-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
            title="Reset all counts to 0 for today"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Today</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        <div className="bg-stone-950/70 border border-stone-800/80 rounded-2xl p-3.5">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Total Recited Today</div>
          <div className="text-2xl font-extrabold text-white mt-0.5 font-mono">
            {totalDhikrRecited.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium mt-0.5">Praises to Allah</div>
        </div>

        <div className="bg-stone-950/70 border border-stone-800/80 rounded-2xl p-3.5">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Goals Completed</div>
          <div className="text-2xl font-extrabold text-emerald-300 mt-0.5 font-mono">
            {totalCompletedGoals}{' '}
            <span className="text-stone-500 text-base font-normal">/ {RECOMMENDED_DAILY_DHIKR.length}</span>
          </div>
          <div className="text-[10px] text-stone-400 font-medium mt-0.5">Recommended targets</div>
        </div>

        <div className="bg-stone-950/70 border border-stone-800/80 rounded-2xl p-3.5 col-span-2 sm:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            <span>Overall Adhkar Progress</span>
            <span className="text-emerald-400 font-mono">
              {Math.round((totalCompletedGoals / RECOMMENDED_DAILY_DHIKR.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-stone-900 rounded-full h-2.5 mt-2 border border-stone-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((totalCompletedGoals / RECOMMENDED_DAILY_DHIKR.length) * 100))}%`,
              }}
            />
          </div>
          <div className="text-[11px] text-stone-400 mt-1 flex items-center justify-between">
            <span>Keep your tongue moist with the remembrance of Allah</span>
            <span className="text-stone-500 font-mono text-[10px]">Al-Tirmidhi 3375</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950'
                : 'bg-stone-950 text-stone-400 hover:text-white border-stone-800 hover:border-stone-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dhikr Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {filteredList.map((item) => {
          const count = progress[item.id] || 0;
          const isCompleted = count >= item.recommendedCount;
          const progressPercent = Math.min(100, Math.round((count / item.recommendedCount) * 100));
          const isExpanded = expandedBenefitId === item.id;
          const isJustIncremented = lastIncrementedId === item.id;

          return (
            <div
              key={item.id}
              id={`dhikr-card-${item.id}`}
              className={`bg-stone-950/80 border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
                isCompleted
                  ? 'border-emerald-500/50 shadow-md shadow-emerald-950/30'
                  : 'border-stone-800 hover:border-stone-700'
              }`}
            >
              {/* Top Row: Category + Badge + Progress */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-stone-400 font-medium">
                    {item.category}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-semibold">
                      {item.badge}
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Goal Reached
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFocusedDhikrId(item.id)}
                    className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white transition"
                    title="Open Full Focus Tasbih Mode"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  {count > 0 && (
                    <button
                      onClick={(e) => resetSingleDhikr(item.id, e)}
                      className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-amber-400 transition"
                      title="Reset this count"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Arabic Calligraphy Display */}
              <div className="my-3 text-right py-2 px-3 rounded-xl bg-stone-900/60 border border-stone-800/80">
                <div
                  className="font-serif text-2xl sm:text-3xl text-emerald-100 font-bold leading-relaxed tracking-wide select-none"
                  dir="rtl"
                >
                  {item.arabic}
                </div>
              </div>

              {/* Transliteration directly below Arabic text */}
              <div className="space-y-2 mt-1">
                <div className="p-2.5 rounded-xl bg-stone-900/90 border border-emerald-500/20 text-left">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Transliteration</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-100 mt-0.5 tracking-wide">
                    {item.transliteration}
                  </h3>
                </div>

                <p className="text-xs text-stone-300 italic leading-relaxed px-1">"{item.translation}"</p>
              </div>

              {/* Spiritual Benefit Card / Expandable Hadith Virtues */}
              <div className="mt-4 pt-3 border-t border-stone-800/80">
                <button
                  onClick={() => setExpandedBenefitId(isExpanded ? null : item.id)}
                  className="w-full flex items-center justify-between text-xs text-emerald-400 hover:text-emerald-300 font-semibold py-1 transition"
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Spiritual Benefit & Virtues
                  </span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && (
                  <div className="mt-2 p-3 bg-stone-900/90 border border-emerald-500/20 rounded-xl text-xs text-stone-300 leading-relaxed animate-in fade-in slide-in-from-top-1">
                    <p className="font-sans text-stone-200">{item.spiritualBenefit}</p>
                    <div className="mt-2 text-[10px] font-mono text-emerald-400 font-medium">
                      Source: {item.hadithSource}
                    </div>
                  </div>
                )}
              </div>

              {/* Counter Action & Progress Bar */}
              <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3">
                {/* Left: Counter stats & mini bar */}
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-stone-400">Progress:</span>
                    <span>
                      <strong className={`text-base font-bold ${isCompleted ? 'text-emerald-300' : 'text-white'}`}>
                        {count}
                      </strong>
                      <span className="text-stone-500"> / {item.recommendedCount}</span>
                    </span>
                  </div>
                  <div className="w-full bg-stone-900 rounded-full h-2 border border-stone-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-emerald-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Right: Big Tactile Tap Button */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    id={`increment-btn-${item.id}`}
                    onClick={() => incrementCount(item, 1)}
                    className={`h-12 px-5 rounded-2xl font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 active:scale-95 shadow-md ${
                      isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                        : isJustIncremented
                        ? 'bg-emerald-500 text-white scale-105'
                        : 'bg-stone-900 hover:bg-stone-800 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Count</span>
                  </button>

                  <button
                    onClick={() => incrementCount(item, 10)}
                    className="h-12 px-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-800 text-xs font-mono font-bold transition"
                    title="Add +10 quickly"
                  >
                    +10
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Focus Mode Tasbih Modal */}
      {focusedDhikr && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div
            id="focused-tasbih-modal"
            className="max-w-xl w-full bg-stone-900 border border-stone-800 rounded-3xl p-6 text-center relative shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Focus Tasbih Bead
              </span>
              <button
                onClick={() => setFocusedDhikrId(null)}
                className="p-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-800 transition"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Huge Arabic Text */}
            <div className="my-5 p-4 rounded-2xl bg-stone-950/70 border border-emerald-500/20" dir="rtl">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-200 leading-loose">
                {focusedDhikr.arabic}
              </div>
            </div>

            {/* Transliteration directly below Arabic */}
            <div className="p-3.5 bg-stone-950/90 border border-emerald-500/30 rounded-2xl max-w-md mx-auto text-left space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Transliteration</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {focusedDhikr.transliteration}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 italic max-w-md mx-auto mt-2">
              "{focusedDhikr.translation}"
            </p>

            {/* Giant Circular Click Target Counter */}
            <div className="my-8 flex justify-center">
              <button
                id="giant-tasbih-clicker"
                onClick={() => incrementCount(focusedDhikr, 1)}
                className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 border-emerald-500/40 bg-gradient-to-b from-stone-950 to-stone-900 hover:from-stone-900 hover:to-emerald-950/40 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-2xl shadow-emerald-950 relative group"
              >
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
                  Tap to Count
                </span>
                <span className="text-5xl sm:text-6xl font-extrabold font-mono text-white mt-1 group-hover:scale-105 transition-transform">
                  {progress[focusedDhikr.id] || 0}
                </span>
                <span className="text-xs font-mono text-stone-500 mt-1">
                  Goal: {focusedDhikr.recommendedCount}
                </span>

                {/* Circular ring indicator */}
                <div className="absolute inset-0 rounded-full pointer-events-none border-2 border-dashed border-emerald-500/20 group-hover:border-emerald-400/40 transition" />
              </button>
            </div>

            {/* Spiritual Benefit Box in Modal */}
            <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-2xl text-left text-xs text-stone-300">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Spiritual Virtue:</span>
              </div>
              <p>{focusedDhikr.spiritualBenefit}</p>
              <div className="text-[10px] font-mono text-stone-500 mt-1.5">
                Reference: {focusedDhikr.hadithSource}
              </div>
            </div>

            {/* Controls in Modal */}
            <div className="flex items-center justify-between mt-6 pt-3 border-t border-stone-800">
              <button
                onClick={() => resetSingleDhikr(focusedDhikr.id)}
                className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setFocusedDhikrId(null)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow"
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
