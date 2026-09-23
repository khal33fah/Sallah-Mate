import React, { useState } from 'react';
import {
  X,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Heart,
  ChevronRight,
  Camera,
  Star,
  BookOpen,
} from 'lucide-react';
import { PrayerName, SpiritualStreakStats } from '../types';
import { calculateSpiritualStreakStats, getStoredDailyRecords } from '../services/spiritualStreakService';

interface SpiritualStreaksModalProps {
  onClose: () => void;
  onOpenAzkarLock?: (prayer: PrayerName) => void;
  onOpenScanner?: (prayer: PrayerName) => void;
}

export const SpiritualStreaksModal: React.FC<SpiritualStreaksModalProps> = ({
  onClose,
  onOpenAzkarLock,
  onOpenScanner,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [stats, setStats] = useState<SpiritualStreakStats>(() => calculateSpiritualStreakStats());

  const prayers: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <div
      id="spiritual-streaks-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-stone-900 border border-emerald-500/30 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Spiritual Streaks & Closeness to Allah
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  <span>{stats.currentStreakDays} Days Active</span>
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Track your daily, weekly, and monthly steadfastness (Istiqamah) with the five daily prayers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Closeness to Allah Hero Banner */}
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-emerald-950/90 via-stone-950 to-stone-900 border-b border-emerald-500/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Your Spiritual Rank</span>
                </span>
                <span className="text-xs font-arabic text-emerald-300 font-bold" dir="rtl">
                  {stats.closenessLevel.arabicTitle}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-white">
                {stats.closenessLevel.level}
              </h3>
              <p className="text-xs text-stone-300 max-w-lg leading-relaxed">
                {stats.closenessLevel.description}
              </p>
            </div>

            {/* Score Wheel / Pill */}
            <div className="flex sm:flex-col items-center justify-between sm:justify-center w-full sm:w-auto p-3 rounded-xl bg-stone-950/80 border border-emerald-500/40 text-center shrink-0">
              <div className="text-[10px] text-stone-400 uppercase font-semibold">
                Closeness Index
              </div>
              <div className="text-2xl font-black text-emerald-400 tracking-tight">
                {stats.closenessLevel.score}
                <span className="text-xs text-stone-500 font-normal">/100</span>
              </div>
              <div className="text-[10px] text-emerald-300/80 font-medium">
                {stats.weeklyConsistencyPercent}% Weekly Rate
              </div>
            </div>
          </div>

          {/* Next spiritual milestone */}
          <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex items-center gap-2 text-xs text-stone-300">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Next Spiritual Milestone:</strong> {stats.closenessLevel.nextMilestone}
            </span>
          </div>
        </div>

        {/* Period Selector Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-stone-800/80 bg-stone-950/40 flex gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'daily'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Daily Prayers ({stats.todayCompletedCount}/5 Today)</span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'weekly'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Weekly Streak ({stats.weeklyConsistencyPercent}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'monthly'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Monthly Consistency ({stats.monthlyConsistencyPercent}%)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: DAILY VIEW */}
          {activeTab === 'daily' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Today’s Prayer Checklist</h4>
                  <p className="text-xs text-stone-400">
                    Observe each prayer on time, verify posture, and seal with post-Sallah Azkar
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                  {stats.todayCompletedCount} of 5 Completed
                </span>
              </div>

              {/* 5 Prayers Grid */}
              <div className="space-y-2.5">
                {prayers.map((p) => {
                  const todayRec = stats.weeklyBreakdown[stats.weeklyBreakdown.length - 1];
                  const isObserved = todayRec?.prayers?.[p];

                  return (
                    <div
                      key={p}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                        isObserved
                          ? 'bg-emerald-950/40 border-emerald-500/50'
                          : 'bg-stone-950/60 border-stone-800/80'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isObserved
                              ? 'bg-emerald-500 text-stone-950'
                              : 'bg-stone-800 text-stone-500'
                          }`}
                        >
                          {isObserved ? <CheckCircle2 className="w-4 h-4" /> : p[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{p}</span>
                            {isObserved ? (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-500/30">
                                Observed On Time
                              </span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400">
                                Pending
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-400">
                            {p === 'Fajr'
                              ? 'Dawn Prayer • 2 Rakahs (Best Sunnah of the Day)'
                              : p === 'Dhuhr'
                              ? 'Midday Prayer • 4 Rakahs'
                              : p === 'Asr'
                              ? 'Afternoon Prayer • 4 Rakahs (The Middle Prayer)'
                              : p === 'Maghrib'
                              ? 'Sunset Prayer • 3 Rakahs'
                              : 'Night Prayer • 4 Rakahs'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {onOpenScanner && !isObserved && (
                          <button
                            onClick={() => onOpenScanner(p)}
                            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1 transition"
                            title="Verify via Camera Sujud Scan"
                          >
                            <Camera className="w-3 h-3 text-emerald-400" />
                            <span className="hidden sm:inline">Verify</span>
                          </button>
                        )}

                        {onOpenAzkarLock && (
                          <button
                            onClick={() => onOpenAzkarLock(p)}
                            className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/40 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition"
                            title="Recite 33x Post-Sallah Azkar"
                          >
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>Azkar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hadith on Daily Prayer Steadfastness */}
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 text-xs text-stone-300 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Prophetic Treasure
                </div>
                <p className="italic">
                  The Messenger of Allah (ﷺ) was asked: "Which deed is the most beloved to Allah?" He replied: "To perform prayer at its proper earliest time." (Sahih al-Bukhari 527)
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: WEEKLY STREAK VIEW */}
          {activeTab === 'weekly' && (
            <div className="space-y-5">
              {/* 7-Day Consistency Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">7-Day Weekly Consistency Grid</h4>
                    <p className="text-xs text-stone-400">
                      Visual map of prayers observed across the last 7 days
                    </p>
                  </div>
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{stats.currentStreakDays} Day Streak</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {stats.weeklyBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-center space-y-1.5 transition ${
                        item.count === 5
                          ? 'bg-emerald-950/70 border-emerald-500/60 shadow-sm shadow-emerald-950'
                          : item.count >= 3
                          ? 'bg-stone-900/90 border-emerald-500/30'
                          : 'bg-stone-950 border-stone-800/80'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase text-stone-400">
                        {item.day}
                      </div>
                      <div
                        className={`text-lg font-black ${
                          item.count === 5
                            ? 'text-emerald-400'
                            : item.count >= 3
                            ? 'text-emerald-300'
                            : 'text-stone-400'
                        }`}
                      >
                        {item.count}
                        <span className="text-[10px] font-normal text-stone-500">/5</span>
                      </div>
                      <div className="flex justify-center gap-0.5">
                        {prayers.map((pr) => (
                          <div
                            key={pr}
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.prayers[pr] ? 'bg-emerald-400' : 'bg-stone-700'
                            }`}
                            title={`${pr}: ${item.prayers[pr] ? 'Observed' : 'Missed'}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prayer Breakdown Matrix */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                  Weekly Prayer-by-Prayer Reliability
                </h4>

                <div className="space-y-2 text-xs">
                  {prayers.map((p) => {
                    const count = stats.weeklyBreakdown.filter((w) => w.prayers[p]).length;
                    const percent = Math.round((count / 7) * 100);

                    return (
                      <div key={p} className="space-y-1">
                        <div className="flex items-center justify-between text-stone-300">
                          <span className="font-semibold">{p}</span>
                          <span className="font-mono text-emerald-400">
                            {count} / 7 days ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Streak Milestones */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Flame className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 font-bold uppercase">Current Streak</div>
                    <div className="text-sm font-extrabold text-white">{stats.currentStreakDays} Days Unbroken</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 font-bold uppercase">Longest Streak</div>
                    <div className="text-sm font-extrabold text-white">{stats.longestStreakDays} Days Record</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Star className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 font-bold uppercase">Consistency Rate</div>
                    <div className="text-sm font-extrabold text-white">{stats.weeklyConsistencyPercent}% Weekly</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MONTHLY VIEW */}
          {activeTab === 'monthly' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white">4-Week Monthly Progress</h4>
                  <span className="text-xs font-bold text-emerald-400">
                    {stats.monthlyConsistencyPercent}% Total Monthly Consistency
                  </span>
                </div>
                <p className="text-xs text-stone-400 mb-3">
                  Evaluating your sustained devotion across 28 days of Sallah (140 total prayers)
                </p>

                <div className="space-y-3">
                  {stats.monthlyBreakdown.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-200">{item.weekLabel}</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {item.completedPrayers} / 35 prayers ({item.percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spiritual Badges & Virtues */}
              <div className="p-4 rounded-xl bg-stone-950 border border-emerald-500/30 space-y-3">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Honors of the Steadfast Believer</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Fajr Guardian Badge</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/30">
                        Achieved
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Observed dawn prayer on time. "Whoever prays Fajr is under the protection of Allah." (Muslim 657)
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">As-Sujud Master</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/30">
                        Achieved
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Witnessed reverent Sujud in camera scans and prayer mats with stillness and tranquility.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Fortress of Azkar</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/30">
                        Active
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Recited the authentic 33x SubhanAllah, Alhamdulillah, Allahu Akbar and Ayatul Kursi post-prayer.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Jumu’ah Illuminator</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/30">
                        Weekly
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Attended Friday congregation prayer and recited Surah Al-Kahf for light between the two Fridays.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-stone-400">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Keep your streak alive by praying each prayer at its appointed time.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
