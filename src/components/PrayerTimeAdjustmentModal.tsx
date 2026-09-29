import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  RotateCcw,
  Check,
  Clock,
  Compass,
  Calendar as CalendarIcon,
  Plus,
  Minus,
} from 'lucide-react';
import { LocationConfig, PrayerAdjustments, PrayerName } from '../types';
import {
  CALCULATION_METHODS,
  DEFAULT_PRAYER_ADJUSTMENTS,
  getStoredPrayerAdjustments,
  savePrayerAdjustments,
  calculatePrayerTimes,
} from '../utils/prayerTimes';
import { getHijriDate } from '../utils/calendarUtils';

interface PrayerTimeAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationConfig: LocationConfig;
  onUpdateLocationConfig: (config: LocationConfig) => void;
  onAdjustmentsChange?: (adjustments: PrayerAdjustments) => void;
}

const PRAYER_LIST: { id: PrayerName; name: string; arabic: string }[] = [
  { id: 'Fajr', name: 'Fajr', arabic: 'الفَجْر' },
  { id: 'Sunrise', name: 'Sunrise', arabic: 'الشُّرُوق' },
  { id: 'Dhuhr', name: 'Dhuhr', arabic: 'الظُّهْر' },
  { id: 'Asr', name: 'Asr', arabic: 'العَصْر' },
  { id: 'Maghrib', name: 'Maghrib', arabic: 'المَغْرِب' },
  { id: 'Isha', name: 'Isha', arabic: 'العِشَاء' },
];

export const PrayerTimeAdjustmentModal: React.FC<PrayerTimeAdjustmentModalProps> = ({
  isOpen,
  onClose,
  locationConfig,
  onUpdateLocationConfig,
  onAdjustmentsChange,
}) => {
  const [adjustments, setAdjustments] = useState<PrayerAdjustments>(() => getStoredPrayerAdjustments());
  const [calculationMethod, setCalculationMethod] = useState<string>(locationConfig.calculationMethod || 'MWL');
  const [asrMethod, setAsrMethod] = useState<'standard' | 'hanafi'>(locationConfig.asrMethod || 'standard');
  const [activeTab, setActiveTab] = useState<'minutes' | 'method' | 'calendar'>('minutes');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  // Hijri adjustment
  const [hijriAdjustment, setHijriAdjustment] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sallah_hijri_adjustment');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Sync on modal open
  useEffect(() => {
    if (isOpen) {
      setAdjustments(getStoredPrayerAdjustments());
      setCalculationMethod(locationConfig.calculationMethod || 'MWL');
      setAsrMethod(locationConfig.asrMethod || 'standard');
    }
  }, [isOpen, locationConfig]);

  if (!isOpen) return null;

  // Calculate base times without manual minute offsets
  const zeroAdjustments: PrayerAdjustments = { ...DEFAULT_PRAYER_ADJUSTMENTS };
  const baseLocationConfig: LocationConfig = {
    ...locationConfig,
    calculationMethod,
    asrMethod,
  };

  const rawTimes = calculatePrayerTimes(new Date(), baseLocationConfig, zeroAdjustments);
  // Calculate adjusted times
  const previewTimes = calculatePrayerTimes(new Date(), baseLocationConfig, adjustments);

  const handleOffsetChange = (prayer: PrayerName, delta: number) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
    setAdjustments((prev) => {
      const current = prev[prayer] || 0;
      const nextVal = Math.min(60, Math.max(-60, current + delta));
      return { ...prev, [prayer]: nextVal };
    });
  };

  const handleSetExactOffset = (prayer: PrayerName, val: number) => {
    setAdjustments((prev) => ({
      ...prev,
      [prayer]: Math.min(60, Math.max(-60, val)),
    }));
  };

  const handleResetOffsets = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }
    setAdjustments({ ...DEFAULT_PRAYER_ADJUSTMENTS });
  };

  const handleSaveAndApply = () => {
    // Save minute adjustments
    savePrayerAdjustments(adjustments);
    if (onAdjustmentsChange) {
      onAdjustmentsChange(adjustments);
    }

    // Save calculation and Asr method to location
    const updatedLocation: LocationConfig = {
      ...locationConfig,
      calculationMethod,
      asrMethod,
    };
    onUpdateLocationConfig(updatedLocation);
    try {
      localStorage.setItem('sallah_selected_location', JSON.stringify(updatedLocation));
    } catch {}

    // Save Hijri adjustment
    try {
      localStorage.setItem('sallah_hijri_adjustment', hijriAdjustment.toString());
      window.dispatchEvent(new Event('sallah_hijri_adjusted'));
    } catch {}

    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      onClose();
    }, 600);
  };

  const totalAdjustmentsCount = Object.values(adjustments).filter((v) => v !== 0).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-stone-950 border border-stone-800 rounded-t-[32px] sm:rounded-3xl shadow-2xl p-5 sm:p-6 z-10 animate-sheet-up max-h-[92vh] flex flex-col">
        {/* iOS Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-stone-700 mx-auto mb-3 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 border border-emerald-400/30 flex items-center justify-center text-white shadow-md shadow-emerald-950">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Prayer Time Settings</h3>
                {totalAdjustmentsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                    {totalAdjustmentsCount} adjusted
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">Fine-tune times, calculation method & Asr madhab</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-stone-900 p-1 rounded-2xl border border-stone-800 text-xs font-semibold my-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('minutes')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'minutes'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Minute Adjust</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('method')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'method'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Calculation</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'calendar'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Hijri Date</span>
          </button>
        </div>

        {/* Tab 1: Minute Adjustments */}
        {activeTab === 'minutes' && (
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pr-0.5">
            <div className="flex items-center justify-between text-xs text-stone-400 px-1">
              <span>Adjust individual times to match your local mosque</span>
              <button
                type="button"
                onClick={handleResetOffsets}
                className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to 0</span>
              </button>
            </div>

            <div className="space-y-2">
              {PRAYER_LIST.map((prayer) => {
                const offset = adjustments[prayer.id] || 0;
                const baseItem = rawTimes.find((t) => t.id === prayer.id);
                const previewItem = previewTimes.find((t) => t.id === prayer.id);

                return (
                  <div
                    key={prayer.id}
                    className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800/80 hover:border-stone-700 transition flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{prayer.name}</span>
                        <span className="text-xs text-stone-500 font-arabic">{prayer.arabic}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {offset !== 0 && (
                          <span className="text-[11px] text-stone-500 line-through">
                            {baseItem?.time}
                          </span>
                        )}
                        <span className="text-sm font-bold text-emerald-400 font-mono">
                          {previewItem?.time}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold ${
                            offset > 0
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : offset < 0
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-stone-800 text-stone-400 border border-stone-700/50'
                          }`}
                        >
                          {offset > 0 ? `+${offset}m` : offset < 0 ? `${offset}m` : '0m'}
                        </span>
                      </div>
                    </div>

                    {/* Stepper & Slider Controls */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOffsetChange(prayer.id, -5)}
                          className="px-2 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold active:scale-95 transition"
                          title="Minus 5 minutes"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOffsetChange(prayer.id, -1)}
                          className="w-7 h-7 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center active:scale-95 transition"
                          title="Minus 1 minute"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Range slider */}
                      <input
                        type="range"
                        min="-30"
                        max="30"
                        step="1"
                        value={offset}
                        onChange={(e) => handleSetExactOffset(prayer.id, parseInt(e.target.value, 10))}
                        className="flex-1 accent-emerald-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                      />

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOffsetChange(prayer.id, 1)}
                          className="w-7 h-7 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center active:scale-95 transition"
                          title="Plus 1 minute"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOffsetChange(prayer.id, 5)}
                          className="px-2 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold active:scale-95 transition"
                          title="Plus 5 minutes"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Calculation Method & Asr Madhab */}
        {activeTab === 'method' && (
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-0.5">
            {/* Asr Juristic Method */}
            <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
              <label className="text-xs font-bold text-stone-300 block">
                Asr Juristic Method (Madhab)
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAsrMethod('standard')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col ${
                    asrMethod === 'standard'
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-white'
                      : 'bg-stone-800/60 border-stone-700/60 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className="font-bold text-xs text-white">Standard (Shafi'i, Maliki, Hanbali)</span>
                  <span className="text-[11px] text-stone-400 mt-0.5">Shadow length = 1x object length</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAsrMethod('hanafi')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col ${
                    asrMethod === 'hanafi'
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-white'
                      : 'bg-stone-800/60 border-stone-700/60 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className="font-bold text-xs text-white">Hanafi</span>
                  <span className="text-[11px] text-stone-400 mt-0.5">Shadow length = 2x object length</span>
                </button>
              </div>
            </div>

            {/* Calculation Authority Method */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 block">
                Calculation Authority & Angles
              </label>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {CALCULATION_METHODS.map((method) => {
                  const isSelected = calculationMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setCalculationMethod(method.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-950/70 border-emerald-500/60 text-white'
                          : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:bg-stone-900'
                      }`}
                    >
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{method.name}</span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {method.region} • Fajr: {method.fajrAngle}° | Isha:{' '}
                          {method.ishaInterval ? `${method.ishaInterval}min` : `${method.ishaAngle}°`}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-400 text-black'
                            : 'border-stone-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Hijri Date Calibration */}
        {activeTab === 'calendar' && (
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-0.5">
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <CalendarIcon className="w-4 h-4 text-emerald-400" />
                <span>Moon Sighting & Hijri Date Calibration</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Islamic months depend on the visual crescent moon sighting. If your local moon sighting committee declared the month 1 day earlier or later, calibrate it here.
              </p>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-400">Current Hijri Date:</span>
                <span className="text-xs font-bold text-emerald-300">
                  {getHijriDate(new Date(), hijriAdjustment).formattedEn}
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-stone-400">Offset (Days):</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[-2, -1, 0, 1, 2].map((dayOffset) => (
                    <button
                      key={dayOffset}
                      type="button"
                      onClick={() => setHijriAdjustment(dayOffset)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        hijriAdjustment === dayOffset
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-950'
                          : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white'
                      }`}
                    >
                      {dayOffset > 0 ? `+${dayOffset}` : `${dayOffset}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-stone-800 mt-2 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold text-xs transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndApply}
            className="flex-[2] py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950 active:scale-98"
          >
            {saveSuccessNotice ? (
              <>
                <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
                <span>Adjustments Applied!</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save & Apply Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
