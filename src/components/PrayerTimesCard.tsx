import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Compass, Bell, Shield, Camera, CheckCircle2, ChevronDown, Sparkles, Volume2, Plane, AlertCircle, Smartphone, Calendar as CalendarIcon, Bot, Lock, Flame, ShieldAlert, BookOpen } from 'lucide-react';
import { PrayerName, PrayerTimeItem, LocationConfig, VerificationRecord, TravelerSettings } from '../types';
import { POPULAR_LOCATIONS, DEFAULT_NIGERIA_LOCATION, CALCULATION_METHODS, calculatePrayerTimes, getNextPrayer, calculateQiblaDirection, playSpiritualChime } from '../utils/prayerTimes';
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
  onOpenLockScreenModal,
  onOpenAdhanModal,
  onOpenAIAssistant,
  onTriggerAzkarLock,
  onOpenSuspensionSettings,
  onOpenStreaksModal,
  onOpenDuaModal,
  onOpenQiblaCompass,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationConfig>(() => {
    try {
      const saved = localStorage.getItem('sallah_selected_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.country) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_NIGERIA_LOCATION; // Abuja, Nigeria
  });

  const handleSelectLocation = (loc: LocationConfig) => {
    setSelectedLocation(loc);
    try {
      localStorage.setItem('sallah_selected_location', JSON.stringify(loc));
    } catch {
      // ignore
    }
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

  // Update prayer calculation whenever location or time changes
  useEffect(() => {
    const list = calculatePrayerTimes(new Date(), selectedLocation);
    setPrayerList(list);
    setNextPrayerInfo(getNextPrayer(list));

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

    return () => clearInterval(interval);
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

      {/* Top Header & Location Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-800 relative z-10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              DAILY SALLAH TRACKER
            </span>
            {/* Dual Calendar Badge Button */}
            <button
              id="open-dual-calendar-header-badge"
              onClick={() => setIsDualCalendarOpen(true)}
              className="group flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/90 hover:bg-emerald-900/90 border border-emerald-500/40 text-xs text-stone-200 transition shadow-sm"
              title="Click to view full Islamic Hijri & Western Gregorian Calendar"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-white">
                {getGregorianDate().dayNameShort}, {getGregorianDate().day} {getGregorianDate().monthNameShort} {getGregorianDate().year}
              </span>
              <span className="text-stone-500">•</span>
              <span className="font-semibold text-emerald-300">
                {getHijriDate(new Date(), hijriAdjustment).day} {getHijriDate(new Date(), hijriAdjustment).monthNameEn} {getHijriDate(new Date(), hijriAdjustment).year} AH
              </span>
              <span className="text-[10px] text-emerald-400 underline decoration-dotted font-medium">
                View Calendar →
              </span>
            </button>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-100 mt-1.5 flex items-center gap-2">
            Prayer Times & Verification
          </h1>
        </div>

        {/* Location Dropdown & Qibla Bearing */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Qibla Indicator & Navigator Trigger */}
          <button
            id="qibla-compass-indicator-btn"
            onClick={onOpenQiblaCompass}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-emerald-950/70 border border-stone-800 hover:border-emerald-500/50 text-xs text-stone-200 transition shadow-sm group"
            title="Open Interactive Qibla Compass & Direction Navigator"
          >
            <Compass className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
            <span>Qibla: <strong className="text-emerald-300">{qiblaDeg}°</strong></span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 font-semibold border border-emerald-500/40">
              Find
            </span>
          </button>

          {/* Location Selector */}
          <div className="relative">
            <button
              id="location-picker-btn"
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs font-medium text-stone-200 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectedLocation.city}, {selectedLocation.country}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {isLocationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-stone-950 border border-stone-700 rounded-xl shadow-2xl p-2 z-30 max-h-72 overflow-y-auto">
                <button
                  id="detect-gps-btn"
                  onClick={detectUserLocation}
                  disabled={isDetectingLocation}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-950/60 rounded-lg flex items-center justify-between border-b border-stone-800 mb-1"
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {isDetectingLocation ? 'Detecting GPS...' : 'Use Current Device GPS'}
                  </span>
                </button>

                <div className="text-[11px] font-semibold text-stone-400 px-3 py-1 uppercase">
                  Nigeria & Global Cities
                </div>
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={`${loc.city}-${loc.country}`}
                    onClick={() => handleSelectLocation(loc)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition flex items-center justify-between ${
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

          {/* Dual Calendar Action Button */}
          <button
            id="prayer-card-dual-calendar-btn"
            onClick={() => setIsDualCalendarOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-stone-300 hover:text-white text-xs font-semibold transition"
            title="Open Islamic Hijri & Western Gregorian Dual Calendar"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Islamic & Western Calendar</span>
          </button>

          {/* Daily Dhikr Action Button */}
          <button
            id="prayer-card-daily-dhikr-btn"
            onClick={() => {
              document.getElementById('daily-dhikr-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-stone-300 hover:text-white text-xs font-semibold transition"
            title="Count Daily Dhikr Remembrances & learn spiritual benefits"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Daily Dhikr</span>
          </button>

          {/* Call to Prayer (Adhan) Button */}
          {onOpenAdhanModal && (
            <button
              id="open-adhan-modal-header-btn"
              onClick={() => onOpenAdhanModal()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 text-xs font-semibold transition shadow-sm"
              title="Configure and listen to authentic Call to Prayer (Adhan)"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call to Prayer (Adhan)</span>
            </button>
          )}

          {/* Lock Screen Ayahs Display Trigger */}
          {onOpenLockScreenModal && (
            <button
              id="prayer-card-lockscreen-btn"
              onClick={onOpenLockScreenModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition"
              title="Display Ayahs on device lock screen: reminding of Allah, Dunya & Iman"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lock Screen Ayahs</span>
            </button>
          )}

          {/* Post-Sallah Azkar Lock Gate Trigger */}
          {onTriggerAzkarLock && (
            <button
              id="prayer-card-azkar-lock-btn"
              onClick={() => onTriggerAzkarLock(nextPrayerInfo?.next?.id || 'Fajr')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-200 text-xs font-semibold transition shadow-sm"
              title="Lock app until you recite your authentic post-Sallah Sunnah Azkar"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Finished Sallah? Recite Azkar</span>
            </button>
          )}

          {/* Ask Islamic AI Scholar Button */}
          {onOpenAIAssistant && (
            <button
              id="prayer-card-ai-assistant-btn"
              onClick={onOpenAIAssistant}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold transition"
              title="Ask Islamic AI Scholar about prayer fiqh, Azkar virtues, and Hadith"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ask AI Scholar</span>
            </button>
          )}

          {/* Qibla Direction Navigator Trigger */}
          {onOpenQiblaCompass && (
            <button
              id="prayer-card-qibla-btn"
              onClick={onOpenQiblaCompass}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold transition shadow-sm"
              title="Interactive Live GPS & Compass Qibla Navigator towards Mecca"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Qibla Finder</span>
            </button>
          )}

          {/* Context-Aware Prayer Duas & Supplications Modal Trigger */}
          {onOpenDuaModal && (
            <button
              id="prayer-card-duas-btn"
              onClick={() => onOpenDuaModal()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-950/70 hover:bg-teal-900/80 border border-teal-500/50 text-teal-200 text-xs font-semibold transition shadow-sm"
              title="Context-aware Pre-Sallah, During Sallah and Post-Sallah Supplications"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Prayer Duas</span>
            </button>
          )}

          {/* Spiritual Streaks & Closeness to Allah Trigger */}
          {onOpenStreaksModal && (
            <button
              id="prayer-card-streaks-btn"
              onClick={onOpenStreaksModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/50 text-amber-200 text-xs font-semibold transition shadow-sm"
              title="Daily, Weekly & Monthly Spiritual Streaks and Closeness to Allah"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Spiritual Streaks</span>
            </button>
          )}

          {/* Adhan App Suspension & Anti-Bypass Settings */}
          {onOpenSuspensionSettings && (
            <button
              id="prayer-card-suspension-settings-btn"
              onClick={onOpenSuspensionSettings}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/50 text-rose-200 text-xs font-semibold transition shadow-sm"
              title="Select apps to suspend as soon as Adhan commences with strict anti-bypass security"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Suspended Apps & Security</span>
            </button>
          )}

          {/* Traveler Journey Mode Options Button */}
          <button
            id="traveler-journey-options-btn"
            onClick={onOpenTravelerSettings}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              travelerSettings.isTraveler
                ? 'bg-emerald-900/70 border-emerald-500/60 text-emerald-200'
                : 'bg-stone-950 hover:bg-stone-800 border-stone-800 text-stone-300'
            }`}
            title="Options for journey: continue using app or put 5-minute timer to release suspended apps"
          >
            <Plane className="w-3.5 h-3.5 text-emerald-400" />
            <span>{travelerSettings.isTraveler ? 'Journey Mode Active' : 'On a Journey?'}</span>
          </button>
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
