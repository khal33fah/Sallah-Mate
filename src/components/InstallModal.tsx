import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  X,
  Share,
  Monitor,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Moon,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'desktop'>(() => {
    if (isIOS) return 'ios';
    if (typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)) return 'android';
    return 'android';
  });

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-stone-950 border border-stone-800 rounded-t-[32px] sm:rounded-3xl shadow-2xl p-6 z-10 animate-sheet-up max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* iOS Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-stone-700 mx-auto mb-4" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 border border-emerald-400/40 flex items-center justify-center text-white shadow-md shadow-emerald-950">
              <Moon className="w-5 h-5 fill-white/10" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Install Sallah Mate</h3>
              <p className="text-xs text-stone-400">Offline prayers & native mobile experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Value Proposition Highlights */}
        <div className="mt-4 p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Works 100% Offline with cached prayer calculations</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Full-screen app view without browser address bar</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Bedside standby Ayah reminders and Adhan notifications</span>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-stone-900 p-1.5 rounded-2xl border border-stone-800 text-xs mt-4">
          <button
            type="button"
            onClick={() => setActivePlatform('android')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold transition ${
              activePlatform === 'android'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePlatform('ios')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold transition ${
              activePlatform === 'ios'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Share className="w-4 h-4" />
            <span>iOS / Apple</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePlatform('desktop')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold transition ${
              activePlatform === 'desktop'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>PC / Mac</span>
          </button>
        </div>

        {/* Step-by-step instructions */}
        <div className="mt-4 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3 text-xs text-stone-300">
          {activePlatform === 'android' && (
            <>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <span className="leading-relaxed">
                  In Chrome or Samsung Internet, tap the <strong>⋮ (three dots)</strong> menu button in the top-right corner.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <span className="leading-relaxed">
                  Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <span className="leading-relaxed">
                  Tap <strong>"Install"</strong>. Sallah Mate will be installed in your app drawer and home screen.
                </span>
              </div>
            </>
          )}

          {activePlatform === 'ios' && (
            <>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <span className="leading-relaxed">
                  In <strong>Safari</strong> on your iPhone or iPad, tap the <strong>Share button</strong> (<Share className="w-3.5 h-3.5 inline text-emerald-400" /> square with arrow).
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <span className="leading-relaxed">
                  Scroll down the share sheet and tap <strong>"Add to Home Screen"</strong>.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <span className="leading-relaxed">
                  Tap <strong>"Add"</strong> in the top-right corner. The app icon will now appear on your iPhone home screen!
                </span>
              </div>
            </>
          )}

          {activePlatform === 'desktop' && (
            <>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <span className="leading-relaxed">
                  In Chrome, Edge, or Brave, look for the <strong>Install</strong> icon (<Download className="w-3.5 h-3.5 inline text-emerald-400" />) in the right side of the address bar.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <span className="leading-relaxed">
                  Click <strong>"Install Sallah Mate"</strong> to add it as a standalone desktop app on macOS or Windows.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Direct One-Click Install Button if supported by current browser session */}
        {isInstallable && (
          <button
            type="button"
            onClick={handleDirectInstall}
            className="w-full mt-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950 active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Launch Native Install Prompt</span>
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-3 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-semibold text-xs transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
