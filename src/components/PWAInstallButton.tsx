import React, { useState } from 'react';
import { Download, Smartphone, X, Share, Monitor, CheckCircle2, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'button' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(() => {
    if (isIOS) return 'ios';
    if (/android/i.test(navigator.userAgent)) return 'android';
    return 'desktop';
  });

  // If already running in standalone mode, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowInstallGuide(true);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  return (
    <>
      <button
        id="pwa-header-install-btn"
        onClick={handleInstallClick}
        className={
          className ||
          (variant === 'header'
            ? 'flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition active:scale-95'
            : 'flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-emerald-500 transition active:scale-95')
        }
        title="Install Sallah Mate on your phone or computer for offline prayers & lock screen reminders"
      >
        <Download className="w-4 h-4 shrink-0 text-white animate-bounce" />
        <span>Install App</span>
      </button>

      {/* Guided installation modal for all platforms */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-stone-900 border border-emerald-500/40 p-6 shadow-2xl space-y-4 text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Install Sallah Mate</span>
              </div>
              <button
                onClick={() => setShowInstallGuide(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Install Sallah Mate on your home screen or desktop to unlock full-screen mode, offline prayer times, fast loading, and sacred lock screen Ayahs.
            </p>

            {/* Platform selector tabs */}
            <div className="grid grid-cols-3 gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition ${
                  activeTab === 'android'
                    ? 'bg-emerald-600 text-white font-semibold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition ${
                  activeTab === 'ios'
                    ? 'bg-emerald-600 text-white font-semibold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Share className="w-3.5 h-3.5" />
                <span>iPhone/iPad</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition ${
                  activeTab === 'desktop'
                    ? 'bg-emerald-600 text-white font-semibold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>PC / Mac</span>
              </button>
            </div>

            {/* Step-by-step instructions per platform */}
            <div className="space-y-3 p-4 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300">
              {activeTab === 'android' && (
                <>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </span>
                    <span>
                      Tap the menu button (<strong>⋮</strong> three dots) in the top-right corner of Chrome or Samsung Internet.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <span>
                      Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      3
                    </span>
                    <span>
                      Confirm <strong>"Install"</strong>. The app icon will appear immediately on your home screen and app drawer!
                    </span>
                  </div>
                </>
              )}

              {activeTab === 'ios' && (
                <>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </span>
                    <span>
                      In <strong>Safari</strong>, tap the <strong>Share</strong> button (the square icon with an upward arrow at the bottom toolbar).
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <span>
                      Scroll down the list and tap <strong>"Add to Home Screen"</strong>.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      3
                    </span>
                    <span>
                      Tap <strong>"Add"</strong> in the top right. Launch Sallah Mate directly from your home screen for standalone mode!
                    </span>
                  </div>
                </>
              )}

              {activeTab === 'desktop' && (
                <>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </span>
                    <span>
                      In Chrome or Edge, look for the <strong>Install</strong> icon (<Download className="w-3 h-3 inline text-emerald-400" />) on the right side of the address bar.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <span>
                      Click <strong>"Install Sallah Mate"</strong> to add it to your Desktop, Dock, and Start menu as a standalone application.
                    </span>
                  </div>
                </>
              )}
            </div>

            {isInstallable && (
              <button
                type="button"
                onClick={async () => {
                  await install();
                  setShowInstallGuide(false);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition shadow-lg shadow-emerald-950"
              >
                <Download className="w-4 h-4" />
                <span>Launch Direct Install Prompt</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
