import React from 'react';
import { Smartphone, Sparkles, CheckCircle2, X, Send, Maximize2, Shield } from 'lucide-react';
import {
  requestNotificationPermission,
  sendLockScreenAyahNotification,
} from '../services/lockScreenNotificationService';

interface AppInstalledWelcomeModalProps {
  onClose: () => void;
  onOpenAmbientDisplay: () => void;
  onOpenSettings: () => void;
}

export const AppInstalledWelcomeModal: React.FC<AppInstalledWelcomeModalProps> = ({
  onClose,
  onOpenAmbientDisplay,
  onOpenSettings,
}) => {
  const handleEnableAndSend = async () => {
    const res = await requestNotificationPermission();
    if (res === 'granted') {
      await sendLockScreenAyahNotification(undefined, '📖 Welcome to Sallah Mate');
    }
    onClose();
    onOpenSettings();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div
        id="app-installed-welcome-modal"
        className="bg-stone-900 border border-emerald-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Icon */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Smartphone className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              Installed on Your Device
            </span>
          </div>
          <h3 className="text-lg font-bold text-white leading-snug">
            Activate Lock Screen Ayah Display
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Whenever you lock or pick up your phone, Sallah Mate can display writeups of sacred Quranic Ayahs—constantly reminding you of <strong>Allah</strong>, our <strong>purpose in this dunya</strong>, and strengthening our <strong>Iman</strong>.
          </p>
        </div>

        {/* Highlighted Ayah sample */}
        <div className="p-3.5 rounded-2xl bg-stone-950 border border-emerald-500/30 space-y-2 text-center">
          <div
            lang="ar"
            dir="rtl"
            className="text-lg font-bold text-stone-100 font-serif"
            style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
          >
            وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ
          </div>
          <p className="text-[11px] text-stone-300 italic">
            “And I did not create jinn and mankind except to worship Me.” (Adh-Dhariyat 51:56)
          </p>
          <div className="text-[10px] text-emerald-400 font-medium">
            Daily reminders on the ultimate purpose of life & steadfast faith
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            id="enable-lockscreen-welcome-btn"
            onClick={handleEnableAndSend}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950"
          >
            <Send className="w-4 h-4" />
            <span>Enable Lock Screen Ayahs & Test Now</span>
          </button>

          <button
            id="open-ambient-welcome-btn"
            onClick={() => {
              onClose();
              onOpenAmbientDisplay();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs transition flex items-center justify-center space-x-2 border border-stone-700"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Launch Standby Bedside Display</span>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="text-[11px] text-stone-500 hover:text-stone-300"
          >
            I will set this up later
          </button>
        </div>
      </div>
    </div>
  );
};
