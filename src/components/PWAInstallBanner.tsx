import React, { useState } from 'react';
import { Download, Smartphone, Sparkles, X, Share, Monitor } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  onOpenLockScreenSettings: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  onOpenLockScreenSettings,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(() => {
    if (isIOS) return 'ios';
    if (/android/i.test(navigator.userAgent)) return 'android';
    return 'desktop';
  });

  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sallah_pwa_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('sallah_pwa_banner_dismissed', 'true');
    } catch {}
  };

  // If already installed or dismissed, don't show the big banner
  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onOpenLockScreenSettings();
      } else {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <div
        id="pwa-install-banner"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 border border-emerald-500/40 p-4 shadow-xl mb-6"
      >
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Install Sallah Mate on Your Device</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold uppercase tracking-wider">
                  Standalone PWA
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
                Install as a full application on your phone, tablet, or PC for instant offline prayer times, Qibla compass navigator, and sacred lock screen Ayahs.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
            <button
              id="install-pwa-button-banner"
              onClick={handleInstallClick}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-lg shadow-emerald-950 active:scale-95"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>Install on Device</span>
            </button>

            <button
              id="setup-lockscreen-btn-banner"
              onClick={onOpenLockScreenSettings}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lock Screen Ayahs</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-2 text-stone-500 hover:text-stone-300 rounded-lg transition"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cross-platform Installation Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-stone-900 border border-emerald-500/40 p-6 shadow-2xl space-y-4 text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2 text-emerald-300 font-bold text-base">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>Install Sallah Mate</span>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Choose your device platform below for easy, one-tap installation:
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

            {/* Step-by-step instructions */}
            <div className="space-y-3 p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300">
              {activeTab === 'android' && (
                <>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </span>
                    <span>
                      Tap the menu button (<strong>⋮</strong> three dots) in Chrome or Samsung Internet.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <span>
                      Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      3
                    </span>
                    <span>
                      Tap <strong>"Install"</strong>. The app launches independently without browser bars!
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
                      In <strong>Safari</strong>, tap the <strong>Share</strong> button (box with upward arrow) in the bottom toolbar.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <span>
                      Scroll down and tap <strong>"Add to Home Screen"</strong>.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      3
                    </span>
                    <span>
                      Tap <strong>"Add"</strong> in the top right. Launch Sallah Mate from your home screen.
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
                      In Chrome or Edge, click the <strong>Install</strong> icon in the address bar.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <span>
                      Confirm <strong>"Install"</strong> to add Sallah Mate as a native desktop application.
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
                  setShowGuide(false);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition shadow-lg shadow-emerald-950"
              >
                <Download className="w-4 h-4" />
                <span>Launch Direct Install Prompt</span>
              </button>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
