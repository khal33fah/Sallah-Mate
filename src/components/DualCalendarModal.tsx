import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Sparkles,
  Info,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  getHijriDate,
  getGregorianDate,
  generateDualMonthCalendar,
  HIJRI_MONTHS,
  CombinedCalendarDay,
} from '../utils/calendarUtils';

interface DualCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate?: (date: Date) => void;
}

export const DualCalendarModal: React.FC<DualCalendarModalProps> = ({
  isOpen,
  onClose,
  onSelectDate,
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [hijriAdjustment, setHijriAdjustment] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sallah_hijri_adjustment');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDay, setSelectedDay] = useState<CombinedCalendarDay | null>(null);

  if (!isOpen) return null;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDay(null);
  };

  const handleSaveAdjustment = (val: number) => {
    setHijriAdjustment(val);
    try {
      localStorage.setItem('sallah_hijri_adjustment', val.toString());
    } catch {
      // ignore
    }
  };

  const daysMatrix = generateDualMonthCalendar(currentYear, currentMonth, hijriAdjustment);
  const todayHijri = getHijriDate(today, hijriAdjustment);
  const todayGregorian = getGregorianDate(today);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Active view primary Hijri estimate
  const firstOfMonthHijri = getHijriDate(new Date(currentYear, currentMonth, 15), hijriAdjustment);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        id="dual-calendar-modal"
        className="max-w-3xl w-full bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-4 sm:p-6 my-auto text-stone-100 relative animate-in fade-in zoom-in-95"
      >
        {/* Header with Close */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-emerald-400" />
                Islamic Hijri & Western Calendar
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                Dual View
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
              <span>{monthNames[currentMonth]} {currentYear}</span>
              <span className="text-stone-400 font-light text-base sm:text-lg">/</span>
              <span className="text-emerald-300 text-base sm:text-lg font-semibold">
                {firstOfMonthHijri.monthNameEn} {firstOfMonthHijri.year} AH
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="calendar-settings-toggle-btn"
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 transition"
              title="Hijri Moon Sighting Adjustment"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              id="close-dual-calendar-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Moon sighting adjustment panel if opened */}
        {showSettings && (
          <div className="mt-3 p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-stone-300">
              <Info className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Moon Sighting Adjustment:</strong> Shift Hijri day count according to local Nigeria or regional Hilal sightings:
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {[-2, -1, 0, 1, 2].map((adj) => (
                <button
                  key={adj}
                  onClick={() => handleSaveAdjustment(adj)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs transition font-semibold ${
                    hijriAdjustment === adj
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  {adj > 0 ? `+${adj}` : adj}d
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Date Highlights Banner: Today in Gregorian & Hijri */}
        <div className="my-4 p-3 rounded-xl bg-gradient-to-r from-emerald-950/70 via-stone-950 to-stone-900 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-stone-400 uppercase tracking-wider">Today's Alignment</div>
              <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                <span className="text-stone-200">{todayGregorian.formatted}</span>
                <span className="text-stone-500">•</span>
                <span className="text-emerald-300 font-semibold">{todayHijri.formattedEn}</span>
                <span className="text-emerald-400 font-arabic text-xs">({todayHijri.formattedAr})</span>
              </div>
            </div>
          </div>

          {todayHijri.specialEvent && (
            <div className="px-2.5 py-1 rounded-lg bg-emerald-900/50 border border-emerald-500/40 text-emerald-200 font-semibold text-xs">
              {todayHijri.specialEvent}
            </div>
          )}
        </div>

        {/* Month Navigation Bar */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-stone-300">
              {monthNames[currentMonth]} {currentYear}
            </span>
          </div>

          <button
            onClick={handleJumpToToday}
            className="px-3 py-1 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs rounded-lg transition font-medium"
          >
            Jump to Today
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center text-xs font-bold text-stone-400 mb-1.5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dw, i) => (
            <div
              key={dw}
              className={`py-1.5 rounded-lg ${
                i === 5 ? 'text-emerald-400 bg-emerald-950/40' : 'text-stone-400'
              }`}
            >
              {dw}
            </div>
          ))}
        </div>

        {/* Calendar Matrix Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {daysMatrix.map((item, idx) => {
            const isSel = selectedDay?.date.toDateString() === item.date.toDateString();

            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedDay(item);
                  if (onSelectDate) onSelectDate(item.date);
                }}
                className={`min-h-[58px] sm:min-h-[68px] p-1.5 sm:p-2 rounded-xl text-left flex flex-col justify-between transition relative border ${
                  item.isToday
                    ? 'bg-emerald-950/70 border-emerald-500 shadow-md shadow-emerald-950'
                    : isSel
                    ? 'bg-stone-800 border-stone-600'
                    : item.isCurrentMonth
                    ? item.isFriday
                      ? 'bg-stone-950/80 hover:bg-stone-800/80 border-emerald-900/40'
                      : 'bg-stone-950 hover:bg-stone-800/70 border-stone-800/70'
                    : 'bg-stone-950/30 hover:bg-stone-900/40 border-stone-900 text-stone-600 opacity-60'
                }`}
              >
                {/* Top Row: Western Day Number + Friday Indicator */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-semibold text-xs sm:text-sm font-mono ${
                      item.isToday
                        ? 'text-emerald-300 font-bold'
                        : item.isCurrentMonth
                        ? 'text-stone-200'
                        : 'text-stone-600'
                    }`}
                  >
                    {item.gregorianDay}
                  </span>

                  {/* Hijri Day Number in Emerald */}
                  <span
                    className={`text-[10px] sm:text-xs font-mono font-bold px-1 rounded ${
                      item.isToday
                        ? 'bg-emerald-500 text-stone-950'
                        : item.isWhiteDay
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'text-emerald-400'
                    }`}
                    title={`Hijri: ${item.hijriDay} ${item.hijriMonthName}`}
                  >
                    {item.hijriDay}
                  </span>
                </div>

                {/* Bottom Row: Month Name & Special Badges */}
                <div className="w-full text-[9px] sm:text-[10px] truncate flex items-center justify-between gap-1 mt-1">
                  <span className="text-stone-500 truncate">{item.hijriMonthName.split(' ')[0]}</span>

                  {item.isFriday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Jummah Mubarak" />
                  )}
                  {item.isWhiteDay && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Ayyam al-Beed Fasting" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Detail Card */}
        {selectedDay && (
          <div className="mt-4 p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div>
              <div className="text-[11px] text-stone-400 uppercase tracking-wider">Selected Day Detail</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {getGregorianDate(selectedDay.date).formatted}
                <span className="text-emerald-400 ml-2 font-medium">
                  ({getHijriDate(selectedDay.date, hijriAdjustment).formattedEn})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {selectedDay.isFriday && (
                <span className="px-2 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px]">
                  🕌 Jummah Mubarak
                </span>
              )}
              {selectedDay.isWhiteDay && (
                <span className="px-2 py-1 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-semibold text-[11px]">
                  🌕 Ayyam al-Beed (White Days Fast)
                </span>
              )}
              {selectedDay.isFastingDay && !selectedDay.isFriday && (
                <span className="px-2 py-1 rounded bg-stone-800 text-stone-300 font-semibold text-[11px]">
                  🌱 Sunnah Fast (Mon/Thu)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer Legend */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-400">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-stone-200 inline-block" />
              <span>Western (Gregorian) Day</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block" />
              <span>Islamic (Hijri) Day</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Ayyam al-Beed (13th-15th)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>Jummah (Friday)</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition ml-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
