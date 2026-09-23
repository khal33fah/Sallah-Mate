import React, { useState } from 'react';
import { Plane, Compass, Clock, CheckCircle2, Shield, Info, AlertCircle, X, ChevronRight } from 'lucide-react';
import { TravelerSettings } from '../types';

interface TravelerJourneyModalProps {
  settings: TravelerSettings;
  onUpdateSettings: (newSettings: TravelerSettings) => void;
  onClose: () => void;
  onTriggerFiveMinTimer: () => void;
  onOpenQiblaNavigator?: () => void;
}

export const TravelerJourneyModal: React.FC<TravelerJourneyModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onTriggerFiveMinTimer,
  onOpenQiblaNavigator,
}) => {
  const [localSettings, setLocalSettings] = useState<TravelerSettings>(settings);
  const [timerStartedMessage, setTimerStartedMessage] = useState<string | null>(null);

  const handleToggleTraveler = (val: boolean) => {
    const updated = { ...localSettings, isTraveler: val };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleToggleShorten = (val: boolean) => {
    const updated = { ...localSettings, shortenPrayers: val };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleToggleCombine = (val: boolean) => {
    const updated = { ...localSettings, combinePrayers: val };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleToggleAllowAppUsage = (val: boolean) => {
    const updated = { ...localSettings, allowAppUsageWhileTraveling: val };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleStart5MinTimer = () => {
    onTriggerFiveMinTimer();
    setTimerStartedMessage('5-minute countdown initiated! All suspended apps and notifications will be automatically released once the timer expires.');
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        id="traveler-journey-modal-content"
        className="bg-stone-900 border border-emerald-700/50 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-800 bg-gradient-to-r from-emerald-950/80 to-stone-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Traveler Mode (Musafir / Safar)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                  Islamic Concessions
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Options for travelers on journeys, rides, flights, or road trips
              </p>
            </div>
          </div>

          <button
            id="close-traveler-modal-btn"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg bg-stone-800/60 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Notification / Success feedback */}
          {timerStartedMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{timerStartedMessage}</span>
            </div>
          )}

          {/* Primary Toggle: On a Journey */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
            <div className="space-y-0.5 pr-3">
              <div className="text-sm font-semibold text-stone-100 flex items-center gap-2">
                <span>Are you currently on a Journey?</span>
                {localSettings.isTraveler && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Musafir
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                Enable journey allowances according to Islamic Sharia (Safar of ~48+ miles / 77+ km).
              </p>
            </div>

            <button
              id="toggle-traveler-mode-switch"
              onClick={() => handleToggleTraveler(!localSettings.isTraveler)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                localSettings.isTraveler ? 'bg-emerald-600 justify-end' : 'bg-stone-700 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition" />
            </button>
          </div>

          {/* Core Feature Requested by User: Options for travelers to continue using app OR 5 min release timer */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              App Lockdown & Distraction Release Options
            </div>

            {/* Option 1: Continue Using App Freely */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/90 hover:border-emerald-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-stone-200 flex items-center gap-2">
                  <span>Continue Using App While Traveling</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Allows you to tap and freely navigate reading Quran, listening to Hadiths, checking Qibla, or accessing transit info without locking you out.
                </p>
              </div>

              <button
                id="toggle-allow-app-usage-btn"
                onClick={() => handleToggleAllowAppUsage(!localSettings.allowAppUsageWhileTraveling)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  localSettings.allowAppUsageWhileTraveling
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{localSettings.allowAppUsageWhileTraveling ? 'App Usage Allowed' : 'Allow App Usage'}</span>
              </button>
            </div>

            {/* Option 2: 5-Minute Timer to Release All Suspended Apps */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-stone-950 to-emerald-950/30 border border-emerald-500/30 hover:border-emerald-500/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>5-Minute Release Timer</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    5:00
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Put a 5-minute timer so you can complete your traveling prayer or supplication, after which all suspended apps, phone calls, and notifications are automatically released.
                </p>
              </div>

              <button
                id="start-five-min-release-timer-btn"
                onClick={handleStart5MinTimer}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 whitespace-nowrap shrink-0"
              >
                <Clock className="w-4 h-4" />
                <span>Start 5 Min Timer</span>
              </button>
            </div>
          </div>

          {/* Islamic Concessions for Travelers */}
          {localSettings.isTraveler && (
            <div className="space-y-3 pt-2 border-t border-stone-800">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-300">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                Islamic Prayer Rulings for Journey (Rukhsah)
              </div>

              {/* Shorten Prayers (Qasr) */}
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-semibold text-stone-200">
                    Shorten 4-Rakah Prayers to 2 (Qasr / قَصْر)
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Dhuhr, Asr, and Isha are shortened to 2 Rakahs. Fajr (2) and Maghrib (3) remain unchanged.
                  </div>
                </div>
                <button
                  onClick={() => handleToggleShorten(!localSettings.shortenPrayers)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition ${
                    localSettings.shortenPrayers ? 'bg-emerald-600 justify-end' : 'bg-stone-700 justify-start'
                  }`}
                >
                  <div className="bg-white w-3.5 h-3.5 rounded-full shadow" />
                </button>
              </div>

              {/* Combine Prayers (Jam') */}
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-semibold text-stone-200">
                    Combine Prayers (Jam' / جَمْع)
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Permits joining Dhuhr with Asr, and Maghrib with Isha at either prayer's time while traveling.
                  </div>
                </div>
                <button
                  onClick={() => handleToggleCombine(!localSettings.combinePrayers)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition ${
                    localSettings.combinePrayers ? 'bg-emerald-600 justify-end' : 'bg-stone-700 justify-start'
                  }`}
                >
                  <div className="bg-white w-3.5 h-3.5 rounded-full shadow" />
                </button>
              </div>

              {/* Qibla Navigation for Unfamiliar Travel Environments */}
              {onOpenQiblaNavigator && (
                <div className="p-3.5 rounded-xl bg-stone-950 border border-emerald-500/40 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Can't Find Qibla on Your Journey?</div>
                      <div className="text-[11px] text-stone-400">Launch live GPS compass to orient your prayer rug towards Mecca.</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenQiblaNavigator();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 transition"
                  >
                    Open Compass
                  </button>
                </div>
              )}

              {/* Authentic Hadith for Travelers */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs text-stone-300">
                <p className="italic font-serif">
                  "Allah loves that His concessions (Rukhsah) be accepted, just as He dislikes that His prohibitions be committed."
                </p>
                <div className="text-[10px] text-emerald-400 mt-1 font-mono">
                  — Musnad Ahmad (5866), Sahih Ibn Hibban (354)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="text-xs text-stone-400">
            Status: {localSettings.isTraveler ? 'Journey Mode Active' : 'Resident Mode'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
