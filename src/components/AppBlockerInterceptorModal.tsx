import React from 'react';
import { X, ShieldAlert, Lock, Moon, Clock, ArrowRight, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { SuspendableApp, PrayerName } from '../types';

interface AppBlockerInterceptorModalProps {
  app: SuspendableApp;
  currentPrayer?: PrayerName;
  onGoPray: () => void;
  onClose: () => void;
}

export const AppBlockerInterceptorModal: React.FC<AppBlockerInterceptorModalProps> = ({
  app,
  currentPrayer = 'Dhuhr',
  onGoPray,
  onClose,
}) => {
  return (
    <div
      id="app-blocker-interceptor-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-stone-900 border-2 border-rose-500/50 rounded-2xl w-full max-w-md shadow-2xl p-6 text-center space-y-5 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 mx-auto flex items-center justify-center text-rose-400 shadow-lg animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
            SallahMate • Khushu Distraction Shield
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            {app.name} is Suspended
          </h2>
          <p className="text-xs text-stone-300 max-w-xs mx-auto">
            The Call to Prayer for <strong>{currentPrayer}</strong> has commenced. This app is locked to protect your focus and preserve your connection with Allah.
          </p>
        </div>

        {/* Sacred Quote */}
        <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 text-left space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Prophetic Reminder
          </div>
          <p className="text-xs text-stone-300 italic">
            “The first matter that the slave will be brought to account for on the Day of Judgment is the prayer.” (Sunan an-Nasa'i 465)
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onGoPray}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition"
          >
            <span>Stand for Prayer Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-medium transition"
          >
            Acknowledge & Return
          </button>
        </div>
      </div>
    </div>
  );
};
