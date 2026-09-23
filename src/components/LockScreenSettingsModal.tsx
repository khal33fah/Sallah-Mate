import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Bell,
  Clock,
  CheckCircle2,
  Download,
  Sparkles,
  Maximize2,
  Volume2,
  BookOpen,
  Info,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { LOCK_SCREEN_AYAHS, LockScreenAyah } from '../data/lockScreenAyahs';
import {
  LockScreenSettings,
  getStoredLockScreenSettings,
  saveLockScreenSettings,
  requestNotificationPermission,
  sendLockScreenAyahNotification,
  generateLockscreenWallpaper,
  getNotificationPermission,
  startLockScreenMediaWidget,
  stopLockScreenMediaWidget,
  isLockScreenMediaWidgetActive,
} from '../services/lockScreenNotificationService';

interface LockScreenSettingsModalProps {
  onClose: () => void;
  onOpenAmbientDisplay: (ayahId?: string) => void;
}

export const LockScreenSettingsModal: React.FC<LockScreenSettingsModalProps> = ({
  onClose,
  onOpenAmbientDisplay,
}) => {
  const [settings, setSettings] = useState<LockScreenSettings>(getStoredLockScreenSettings());
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermission());
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDownloadingId, setActiveDownloadingId] = useState<string | null>(null);
  const [isMediaWidgetActive, setIsMediaWidgetActive] = useState<boolean>(
    isLockScreenMediaWidgetActive()
  );

  const handleToggleAutoDisplayOnLock = (val: boolean) => {
    const updated = { ...settings, autoDisplayOnLock: val };
    setSettings(updated);
    saveLockScreenSettings(updated);
  };

  const handleToggleLiveMediaWidget = (val: boolean) => {
    const updated = { ...settings, liveMediaWidgetEnabled: val };
    setSettings(updated);
    saveLockScreenSettings(updated);
    if (val) {
      startLockScreenMediaWidget();
      setIsMediaWidgetActive(true);
      setTestSentMessage('Lock screen media card activated! Press your phone power button to lock, then wake to view.');
      setTimeout(() => setTestSentMessage(null), 6000);
    } else {
      stopLockScreenMediaWidget();
      setIsMediaWidgetActive(false);
    }
  };

  const handleTestPowerButtonFlow = async () => {
    // 1. Ensure permission
    if (permission !== 'granted') {
      const res = await requestNotificationPermission();
      setPermission(res);
      if (res !== 'granted') {
        setTestSentMessage('Please grant notification permission so the app can show on your lock screen.');
        setTimeout(() => setTestSentMessage(null), 4000);
        return;
      }
    }

    // 2. Dispatch the lock screen notification with high priority
    const sampleAyah = LOCK_SCREEN_AYAHS[0];
    await sendLockScreenAyahNotification(
      sampleAyah,
      '🔒 Lock Screen Reminder (Press Power Button to View)'
    );

    // 3. Also activate the lock screen media session
    startLockScreenMediaWidget(sampleAyah);
    setIsMediaWidgetActive(true);

    setTestSentMessage(
      'Ready! Now press your phone’s POWER BUTTON to turn the screen off, then press it again before unlocking to see the Ayah display!'
    );
  };

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      const updated = { ...settings, enabled: true };
      setSettings(updated);
      saveLockScreenSettings(updated);
      // Immediately send welcome Ayah to lock screen
      handleSendSample();
    }
  };

  const handleUpdateFrequency = (freq: LockScreenSettings['frequency']) => {
    const updated = { ...settings, frequency: freq };
    setSettings(updated);
    saveLockScreenSettings(updated);
  };

  const handleToggleEnabled = (val: boolean) => {
    const updated = { ...settings, enabled: val };
    setSettings(updated);
    saveLockScreenSettings(updated);
  };

  const handleSendSample = async (ayah?: LockScreenAyah) => {
    const success = await sendLockScreenAyahNotification(ayah, '📱 Lock Screen Reminder');
    if (success) {
      setTestSentMessage('Ayah sent! Lock your phone screen right now to see the reminder displayed.');
      setTimeout(() => setTestSentMessage(null), 5000);
    } else {
      setTestSentMessage('Please grant notification permissions so the app can display on your lock screen.');
      setTimeout(() => setTestSentMessage(null), 4000);
    }
  };

  const handleDownloadWallpaper = (ayah: LockScreenAyah) => {
    setActiveDownloadingId(ayah.id);
    try {
      const dataUrl = generateLockscreenWallpaper(ayah);
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `sallah-lockscreen-${ayah.verseRef.replace(':', '-')}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setActiveDownloadingId(null), 1200);
    }
  };

  const filteredAyahs = LOCK_SCREEN_AYAHS.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.theme === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="lockscreen-settings-modal-content"
        className="bg-stone-900 border border-emerald-700/50 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-800 bg-gradient-to-r from-emerald-950/80 via-stone-900 to-stone-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Lock Screen Ayah Reminders</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                  Dunya & Iman
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Display sacred Ayahs on your device's lock screen reminding of Allah and your true purpose
              </p>
            </div>
          </div>

          <button
            id="close-lockscreen-settings-btn"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl bg-stone-800/60 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Feedback banner */}
          {testSentMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{testSentMessage}</span>
            </div>
          )}

          {/* Primary Permission Card */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-100">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span>Device Lock Screen Permissions</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    permission === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {permission === 'granted' ? 'Allowed' : 'Requires Permission'}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Allows Sallah Mate to display purposeful Ayahs with Arabic, translations, and reflections directly on your phone's lock screen.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {permission !== 'granted' ? (
                <button
                  id="grant-lockscreen-permission-btn"
                  onClick={handleRequestPermission}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md whitespace-nowrap"
                >
                  Allow Lock Screen Display
                </button>
              ) : (
                <button
                  id="send-sample-lockscreen-btn"
                  onClick={() => handleSendSample()}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-emerald-500/40 text-emerald-300 hover:text-white font-semibold text-xs transition flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Ayah Now</span>
                </button>
              )}
            </div>
          </div>

          {/* POWER BUTTON LOCK SCREEN FEATURE CARD */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-emerald-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Display on Power Button Press (Before Unlocking)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    Direct OS Lock Screen
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  When you lock your phone with the power button, Sallah Mate keeps an Ayah on Allah, our purpose in Dunya, and our Iman ready so when you press the power button before unlocking, it displays on your screen.
                </p>
              </div>

              <button
                id="test-power-button-flow-btn"
                onClick={handleTestPowerButtonFlow}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-emerald-950 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Test Power Button Display</span>
              </button>
            </div>

            {/* Toggle options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-stone-800/80">
              {/* Auto Display on Lock */}
              <button
                onClick={() => handleToggleAutoDisplayOnLock(!settings.autoDisplayOnLock)}
                className={`p-3 rounded-xl border text-left transition flex items-start justify-between gap-3 ${
                  settings.autoDisplayOnLock
                    ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">Auto-Trigger on Screen Lock</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    Fires a fresh Ayah the instant your screen is locked by the power button
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                    settings.autoDisplayOnLock
                      ? 'border-emerald-400 bg-emerald-500 text-black'
                      : 'border-stone-600'
                  }`}
                >
                  {settings.autoDisplayOnLock && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </button>

              {/* Live Media Card on Lock Screen */}
              <button
                onClick={() => handleToggleLiveMediaWidget(!settings.liveMediaWidgetEnabled)}
                className={`p-3 rounded-xl border text-left transition flex items-start justify-between gap-3 ${
                  settings.liveMediaWidgetEnabled
                    ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">Active Lock Screen Media Card</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    Keeps an OS lock-screen card with Arabic calligraphy and English translation
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                    settings.liveMediaWidgetEnabled
                      ? 'border-emerald-400 bg-emerald-500 text-black'
                      : 'border-stone-600'
                  }`}
                >
                  {settings.liveMediaWidgetEnabled && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </button>
            </div>
          </div>

          {/* Standby / Always-On Display Mode Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-950 via-emerald-950/30 to-stone-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <Maximize2 className="w-4 h-4 text-emerald-400" />
                <span>Ambient Standby Lock Screen Mode</span>
              </div>
              <p className="text-xs text-stone-400">
                Transform your phone or tablet into an ambient bedside or desk clock showing the next prayer and rotating Ayahs on purpose & Iman.
              </p>
            </div>

            <button
              id="open-ambient-display-from-settings-btn"
              onClick={() => {
                onClose();
                onOpenAmbientDisplay();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 shadow-lg shadow-emerald-950"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Launch Standby Screen</span>
            </button>
          </div>

          {/* Delivery Frequency Options */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              Lock Screen Reminder Frequency
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: '1h', label: 'Every 1 Hour' },
                { id: '2h', label: 'Every 2 Hours' },
                { id: '4h', label: 'Every 4 Hours' },
                { id: 'prayer_times', label: 'At Prayer Times' },
              ].map((freq) => (
                <button
                  key={freq.id}
                  onClick={() => handleUpdateFrequency(freq.id as any)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition text-center ${
                    settings.frequency === freq.id
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ayah Library of Dunya, Purpose & Iman */}
          <div className="space-y-3 pt-2 border-t border-stone-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-300">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                Select Ayah to Display or Export as Lock Screen Wallpaper
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'purpose', label: 'Purpose' },
                  { id: 'dunya', label: 'Dunya' },
                  { id: 'iman', label: 'Iman' },
                  { id: 'allah', label: 'Allah' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Ayahs */}
            <div className="space-y-3">
              {filteredAyahs.map((ayah) => (
                <div
                  key={ayah.id}
                  className="p-4 rounded-2xl bg-stone-950 border border-stone-800 hover:border-emerald-500/40 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-emerald-300">
                        {ayah.surahName} ({ayah.verseRef})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-stone-400">
                        {ayah.themeLabel}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {/* Send to real lock screen */}
                      <button
                        onClick={() => handleSendSample(ayah)}
                        className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium transition flex items-center gap-1"
                        title="Push to device lock screen"
                      >
                        <Smartphone className="w-3 h-3 text-emerald-400" />
                        <span>Send to Lock Screen</span>
                      </button>

                      {/* Download 9:16 wallpaper */}
                      <button
                        onClick={() => handleDownloadWallpaper(ayah)}
                        className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-[11px] font-medium transition flex items-center gap-1"
                        title="Download 9:16 lock screen wallpaper"
                      >
                        <Download className="w-3 h-3 text-amber-400" />
                        <span>{activeDownloadingId === ayah.id ? 'Saved!' : 'Wallpaper'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Arabic snippet */}
                  <div
                    lang="ar"
                    dir="rtl"
                    className="text-lg font-bold text-stone-200 font-serif line-clamp-2"
                    style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
                  >
                    {ayah.arabic}
                  </div>

                  {/* Translation */}
                  <p className="text-xs text-stone-300 italic line-clamp-2">
                    {ayah.translation}
                  </p>

                  {/* Purpose Writeup */}
                  <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800 text-[11px] text-emerald-300/90 leading-relaxed">
                    <strong>Reminder:</strong> {ayah.writeup}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How Lock Screen Reminders Work on Devices Notice */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-400 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-stone-300">
              <Info className="w-4 h-4 text-emerald-400" />
              <span>How Lock Screen Displays Work on Your Device</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-400 pl-1">
              <li>
                <strong>Android:</strong> Once installed or notifications are allowed, Ayahs appear directly in your lock screen notification center even when locked.
              </li>
              <li>
                <strong>iPhone (iOS 16.4+):</strong> Install Sallah Mate via Safari (Share → Add to Home Screen) to allow lock screen web notifications and wallpaper widgets.
              </li>
              <li>
                <strong>Phone Wallpaper:</strong> Tap "Wallpaper" on any Ayah to save an ultra-sharp 9:16 wallpaper to set as your permanent lock screen background.
              </li>
              <li>
                <strong>Standby Mode:</strong> Launch Standby Screen when keeping your phone on a charger or nightstand for an always-on display.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between">
          <button
            onClick={() => handleSendSample()}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Random Ayah to Lock Screen</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
