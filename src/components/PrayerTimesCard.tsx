import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Compass,
  Bell,
  Shield,
  Camera,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Volume2,
  Plane,
  AlertCircle,
  Smartphone,
  Calendar as CalendarIcon,
  Bot,
  Lock,
  Flame,
  ShieldAlert,
  BookOpen,
  Sliders,
} from 'lucide-react';
import { PrayerName, PrayerTimeItem, LocationConfig, VerificationRecord, TravelerSettings } from '../types';
import {
  POPULAR_LOCATIONS,
  DEFAULT_NIGERIA_LOCATION,
  CALCULATION_METHODS,
  calculatePrayerTimes,
  getNextPrayer,
  calculateQiblaDirection,
  playSpiritualChime,
  getStoredPrayerAdjustments,
} from '../utils/prayerTimes';
import { checkAndTriggerAutomaticAdhan } from '../services/adhanService';
import { getHijriDate, getGregorianDate } from '../utils/calendarUtils';
import { DualCalendarModal } from './DualCalendarModal';

interface PrayerTimesCardProps {
  onStartScanner: (prayer: PrayerName) => void;
  onStartLockdown: (prayer: PrayerName, rakahs: number) => void;
  verificationRecords: VerificationRecord[];
  onToggleManualStatus: (prayer: PrayerName) => void;
  completedPrayers: PrayerName[];
  travelerSettings: TravelerSettings;
  onOpenTravelerSettings: () => void;
  onOpenPrayerAdjustments?: () => void;
  selectedLocation?: LocationConfig;
  onSelectLocation?: (loc: LocationConfig) => void;
  onOpenLockScreenModal?: () => void;
  onOpenAdhanModal?: (prayer?: PrayerName) => void;
  onOpenAIAssistant?: () => void;
  onTriggerAzkarLock?: (prayer: PrayerName) => void;
  onOpenSuspensionSettings?: () => void;
  onOpenStreaksModal?: () => void;
  onOpenDuaModal?: (prayer?: PrayerName) => void;
  onOpenQiblaCompass?: () => void;
}

export const PrayerTimesCard: React.FC<PrayerTimesCardProps> = ({
  onStartScanner,
  onStartLockdown,
  verificationRecords,
  onToggleManualStatus,
  completedPrayers,
  travelerSettings,
  onOpenTravelerSettings,
  onOpenPrayerAdjustments,
  selectedLocation: propLocation,
  onSelectLocation: propOnSelectLocation,
  onOpenLockScreenModal,
  onOpenAdhanModal,
  onOpenAIAssistant,
  onTriggerAzkarLock,
  onOpenSuspensionSettings,
  onOpenStreaksModal,
  onOpenDuaModal,
  onOpenQiblaCompass,
}) => {
  const [internalLocation, setInternalLocation] = useState<LocationConfig>(() => {
    try {
      const saved = localStorage.getItem('sallah_selected_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.country) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_NIGERIA_LOCATION; // Abuja, Nigeria
  });

  const selectedLocation = propLocation || internalLocation;

  const handleSelectLocation = (loc: LocationConfig) => {
    setInternalLocation(loc);
    if (propOnSelectLocation) {
      propOnSelectLocation(loc);
    }
    try {
      localStorage.setItem('sallah_selected_location', JSON.stringify(loc));
    } catch {}
    setIsLocationDropdownOpen(false);
  };

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState<boolean>(false);
  const [prayerList, setPrayerList] = useState<PrayerTimeItem[]>([]);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{
    current: PrayerTimeItem;
    next: PrayerTimeItem;
    timeRemaining: string;
    progressPercent: number;
  } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [isDualCalendarOpen, setIsDualCalendarOpen] = useState<boolean>(false);
  const [hijriAdjustment, setHijriAdjustment] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sallah_hijri_adjustment');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Check how many manual adjustments are currently active
  const [activeAdjustmentsCount, setActiveAdjustmentsCount] = useState<number>(() => {
    const adj = getStoredPrayerAdjustments();
    return Object.values(adj).filter((v) => v !== 0).length;
  });

  // Update prayer calculation whenever location or time changes
  useEffect(() => {
    const updateTimes = () => {
      const list = calculatePrayerTimes(new Date(), selectedLocation);
      setPrayerList(list);
      setNextPrayerInfo(getNextPrayer(list));
      const adj = getStoredPrayerAdjustments();
      setActiveAdjustmentsCount(Object.values(adj).filter((v) => v !== 0).length);
    };

    updateTimes();

    const checkAutoAdhan = (prayers: PrayerTimeItem[]) => {
      const now = new Date();
      prayers.forEach((p) => {
        if (p.id === 'Sunrise') return;
        const diffSec = Math.abs(now.getTime() - p.rawTime.getTime()) / 1000;
        // Trigger within 60 seconds of prayer entry
        if (diffSec <= 60 && now >= p.rawTime) {
          checkAndTriggerAutomaticAdhan(p.id as PrayerName);
        }
      });
    };

    // Update countdown every second
    const interval = setInterval(() => {
      const updatedList = calculatePrayerTimes(new Date(), selectedLocation);
      setPrayerList(updatedList);
      setNextPrayerInfo(getNextPrayer(updatedList));
      checkAutoAdhan(updatedList);
    }, 1000);

    const handleAdjustmentsChange = () => {
      updateTimes();
    };

    const handleHijriChange = () => {
      try {
        const saved = localStorage.getItem('sallah_hijri_adjustment');
        setHijriAdjustment(saved ? parseInt(saved, 10) : 0);
      } catch {}
    };

    window.addEventListener('sallah_prayer_adjustments_changed', handleAdjustmentsChange);
    window.addEventListener('sallah_hijri_adjusted', handleHijriChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('sallah_prayer_adjustments_changed', handleAdjustmentsChange);
      window.removeEventListener('sallah_hijri_adjusted', handleHijriChange);
    };
  }, [selectedLocation]);

  // Detect GPS
  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingLocation(false);
        const userLoc: LocationConfig = {
          city: 'My Location',
          country: 'Local Coordinates',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          calculationMethod: 'MWL',
          asrMethod: 'standard',
        };
        handleSelectLocation(userLoc);
      },
      (err) => {
        setIsDetectingLocation(false);
        console.warn('Geolocation denied or failed:', err);
      },
      { timeout: 8000 }
    );
  };

  const qiblaDeg = Math.round(
    calculateQiblaDirection(selectedLocation.latitude, selectedLocation.longitude)
  );

  return (
    <div id="prayer-times-dashboard-card" className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative Islamic Arch Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Mobile-Styled Header & Location Bar */}
      <div className="flex flex-col gap-3 pb-4 border-b border-stone-800/80 relative z-10">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Dual Calendar Badge Pill */}
          <button
            id="open-dual-calendar-header-badge"
            onClick={() => setIsDualCalendarOpen(true)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-xs text-stone-200 transition shadow-sm touch-press"
            title="Click to view full Islamic Hijri & Western Gregorian Calendar"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-white">
              {getGregorianDate().dayNameShort}, {getGregorianDate().day} {getGregorianDate().monthNameShort}
            </span>
            <span className="text-stone-500">•</span>
            <span className="font-semibold text-emerald-300">
              {getHijriDate(new Date(), hijriAdjustment).day} {getHijriDate(new Date(), hijriAdjustment).monthNameEn} AH
            </span>
          </button>

          {/* Quick Action Badges: Qibla & Location */}
          <div className="flex items-center gap-2">
            {/* Qibla Compass Quick Bearing */}
            {onOpenQiblaCompass && (
              <button
                id="qibla-compass-indicator-btn"
                onClick={onOpenQiblaCompass}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-stone-900/90 hover:bg-emerald-950/70 border border-stone-800 hover:border-emerald-500/40 text-xs text-stone-300 hover:text-emerald-300 transition shadow-sm touch-press"
                title="Open Interactive Qibla Compass"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-emerald-300 font-bold">{qiblaDeg}°</span>
              </button>
            )}

            {/* Location Selector Pill */}
            <div className="relative">
              <button
                id="location-picker-btn"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-xs font-medium text-stone-200 transition touch-press"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate max-w-[120px]">{selectedLocation.city}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-stone-950 border border-stone-700 rounded-2xl shadow-2xl p-2 z-30 max-h-72 overflow-y-auto no-scrollbar">
                  <button
                    id="detect-gps-btn"
                    onClick={detectUserLocation}
                    disabled={isDetectingLocation}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-950/60 rounded-xl flex items-center justify-between border-b border-stone-800 mb-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {isDetectingLocation ? 'Detecting GPS...' : 'Use Current Device GPS'}
                    </span>
                  </button>

                  <div className="text-[10px] font-bold text-stone-400 px-3 py-1 uppercase tracking-wider">
                    Popular Locations
                  </div>
                  {POPULAR_LOCATIONS.map((loc) => (
                    <button
                      key={`${loc.city}-${loc.country}`}
                      onClick={() => handleSelectLocation(loc)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl transition flex items-center justify-between ${
                        selectedLocation.city === loc.city
                          ? 'bg-emerald-600 text-white font-medium'
                          : 'text-stone-300 hover:bg-stone-900'
                      }`}
                    >
                      <span>{loc.city}, {loc.country}</span>
                      <span className="text-[10px] opacity-70">{loc.calculationMethod}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Prayer Times Adjustment Button */}
            {onOpenPrayerAdjustments && (
              <button
                id="adjust-prayer-times-btn"
                onClick={onOpenPrayerAdjustments}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 hover:bg-emerald-950/70 border border-stone-800 hover:border-emerald-500/40 text-xs text-stone-200 hover:text-emerald-300 transition shadow-sm touch-press"
                title="Adjust prayer times & calculation methods"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">Adjust</span>
                {activeAdjustmentsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-[10px] font-bold text-black leading-none">
                    {activeAdjustmentsCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Traveler Mode Active Alert Banner */}
      {travelerSettings.isTraveler && (
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-950/70 via-stone-900 to-stone-950 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-emerald-300">
            <Plane className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Musafir Journey Active:</strong>{' '}
              {travelerSettings.shortenPrayers ? '4-Rakah prayers shortened to 2 (Qasr). ' : ''}
              {travelerSettings.combinePrayers ? 'Prayers combined (Jam\'). ' : ''}
              {travelerSettings.allowAppUsageWhileTraveling ? 'App usage allowed during journey.' : ''}
            </span>
          </div>
          <button
            onClick={onOpenTravelerSettings}
            className="text-xs text-emerald-300 hover:text-emerald-100 underline decoration-emerald-500 font-semibold"
          >
            Traveler Options & 5m Timer →
          </button>
        </div>
      )}

      {/* Countdown to Next Prayer Banner */}
      {nextPrayerInfo && (
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-stone-900 to-stone-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-stone-400 font-medium">NEXT PRAYER CALL</div>
              <div className="text-xl font-bold text-white flex items-center gap-2">
                <span>{nextPrayerInfo.next.name}</span>
                <span className="text-emerald-400 font-arabic text-lg font-normal">
                  ({nextPrayerInfo.next.arabicName})
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 font-mono">
                  {nextPrayerInfo.next.time}
                </span>
              </div>
            </div>
          </div>

          {/* Countdown & Quick Action */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider">Starts in</div>
              <div className="text-xl font-extrabold font-mono text-emerald-300">
                {nextPrayerInfo.timeRemaining}
              </div>
            </div>

            {nextPrayerInfo.next.id !== 'Sunrise' && (
              <button
                id="quick-start-lockdown-btn"
                onClick={() => onStartLockdown(nextPrayerInfo.next.id, nextPrayerInfo.next.rakahs)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-950"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Prepare Khushu</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Daily 5 Prayers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {prayerList.map((prayer) => {
          const isCompleted = completedPrayers.includes(prayer.id);
          const isSunrise = prayer.id === 'Sunrise';

          // Find if this prayer has a camera witness attestation
          const verification = verificationRecords.find(
            (v) => v.prayerName === prayer.id && v.date === new Date().toISOString().split('T')[0]
          );

          return (
            <div
              key={prayer.id}
              className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                prayer.status === 'current'
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                  : isCompleted || verification
                  ? 'bg-stone-950/60 border-emerald-900/40 opacity-95'
                  : 'bg-stone-950/30 border-stone-800/80 hover:border-stone-700'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-base text-stone-100">{prayer.name}</span>
                    <span className="font-arabic text-emerald-400 text-sm">
                      {prayer.arabicName}
                    </span>
                  </div>
                  <div className="text-sm font-extrabold font-mono text-emerald-300">
                    {prayer.time}
                  </div>
                </div>

                <div className="text-xs text-stone-400 line-clamp-2 mb-3">
                  {prayer.description}
                </div>

                {!isSunrise && (
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 mb-3 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 font-medium">
                      {travelerSettings.isTraveler && travelerSettings.shortenPrayers && prayer.rakahs === 4
                        ? '2 Rakahs (Qasr Concession)'
                        : `${prayer.rakahs} Fard Rakahs`}
                    </span>
                    {travelerSettings.isTraveler && travelerSettings.shortenPrayers && prayer.rakahs === 4 ? (
                      <span className="text-emerald-400 font-medium text-[10px]">Shortened for Journey</span>
                    ) : (
                      prayer.sunnahBefore > 0 && (
                        <span className="text-stone-400">+{prayer.sunnahBefore} Sunnah</span>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Witness & Verification Status Banner */}
              {verification && (
                <div className="mb-3 p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-semibold">Sallah Witnessed & Agreed</span>
                      <div className="text-[10px] text-stone-300">
                        Observed by {verification.mateName} ({verification.posture})
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {verification.confidence}%
                  </span>
                </div>
              )}

              {/* Actions for this Prayer */}
              {!isSunrise && (
                <div className="flex items-center gap-2 pt-2 border-t border-stone-800/80">
                  {/* Camera Sallah Scan Button */}
                  <button
                    id={`scan-mate-${prayer.id}-btn`}
                    onClick={() => onStartScanner(prayer.id)}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900/90 border border-emerald-500/40 text-emerald-200 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    title="Scan praying companion with camera to verify Sallah"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Scan Mate</span>
                  </button>

                  {/* Lockdown Khushu Mode Button */}
                  <button
                    id={`lockdown-${prayer.id}-btn`}
                    onClick={() => onStartLockdown(prayer.id, prayer.rakahs)}
                    className="py-1.5 px-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-medium transition flex items-center gap-1"
                    title="Suspend all phone distractions and focus on prayer"
                  >
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Khushu</span>
                  </button>

                  {/* Adhan Call to Prayer Button */}
                  {onOpenAdhanModal && (
                    <button
                      id={`adhan-btn-${prayer.id}`}
                      onClick={() => onOpenAdhanModal(prayer.id)}
                      className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-stone-400 hover:text-emerald-300 transition"
                      title={`Listen or configure Adhan for ${prayer.name}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Context-aware Duas for this specific prayer */}
                  {onOpenDuaModal && (
                    <button
                      id={`duas-btn-${prayer.id}`}
                      onClick={() => onOpenDuaModal(prayer.id)}
                      className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-teal-500/40 text-stone-400 hover:text-teal-300 transition"
                      title={`View Pre, During & Post-Sallah Duas for ${prayer.name}`}
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                  )}

                  {/* Manual Checked toggle */}
                  <button
                    id={`toggle-status-${prayer.id}-btn`}
                    onClick={() => onToggleManualStatus(prayer.id)}
                    className={`p-1.5 rounded-xl border transition ${
                      isCompleted || verification
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300'
                    }`}
                    title={isCompleted ? 'Prayer marked observed (Click to toggle)' : 'Mark prayer observed'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  {/* Recite Post-Prayer Azkar Trigger if completed */}
                  {(isCompleted || verification) && onTriggerAzkarLock && (
                    <button
                      id={`recite-azkar-${prayer.id}-btn`}
                      onClick={() => onTriggerAzkarLock(prayer.id)}
                      className="p-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 transition"
                      title={`Recite Post-${prayer.name} Azkar to unlock app and gain forgiveness`}
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Dual Calendar Modal */}
      <DualCalendarModal
        isOpen={isDualCalendarOpen}
        onClose={() => {
          setIsDualCalendarOpen(false);
          // reload adjustment if changed
          try {
            const saved = localStorage.getItem('sallah_hijri_adjustment');
            setHijriAdjustment(saved ? parseInt(saved, 10) : 0);
          } catch {
            // ignore
          }
        }}
      />
    </div>
  );
};
