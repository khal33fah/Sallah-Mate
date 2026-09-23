import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Heart,
  Clock,
  BookOpen,
  Compass,
  Sun,
  Moon,
  ChevronRight,
  Filter,
  Share2,
  Flame,
  Shield,
  HelpCircle,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import { PrayerName, DuaItem, DuaPhase } from '../types';
import { PRAYER_DUAS_DATA, getRecommendedPrayerTimingNow, filterDuas } from '../data/duaData';
import { playSpiritualChime } from '../utils/prayerTimes';

interface ContextAwareDuaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrayer?: PrayerName | 'Tahajjud' | 'Jummah';
}

const FAVORITES_KEY = 'sallah_favorite_duas_v1';
const PERSONAL_DUAS_KEY = 'sallah_personal_duas_v1';

interface PersonalDua {
  id: string;
  prayer: string;
  text: string;
  createdAt: string;
}

export const ContextAwareDuaModal: React.FC<ContextAwareDuaModalProps> = ({
  isOpen,
  onClose,
  initialPrayer,
}) => {
  const currentTiming = getRecommendedPrayerTimingNow();
  const [selectedTiming, setSelectedTiming] = useState<PrayerName | 'Tahajjud' | 'Jummah' | 'all'>(
    initialPrayer || currentTiming
  );
  const [selectedPhase, setSelectedPhase] = useState<DuaPhase>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track interactive recitation counters for each dua
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const [showPersonalDuas, setShowPersonalDuas] = useState<boolean>(false);

  // Personal Duas State
  const [personalDuas, setPersonalDuas] = useState<PersonalDua[]>(() => {
    try {
      const saved = localStorage.getItem(PERSONAL_DUAS_KEY);
      return saved ? JSON.parse(saved) : [
        {
          id: 'sample-1',
          prayer: 'Fajr',
          text: 'O Allah, bless my family with health and strong Iman, and grant me success in my work and sincere worship.',
          createdAt: new Date().toLocaleDateString()
        }
      ];
    } catch {
      return [];
    }
  });
  const [newPersonalDuaText, setNewPersonalDuaText] = useState<string>('');

  useEffect(() => {
    if (initialPrayer) {
      setSelectedTiming(initialPrayer);
    }
  }, [initialPrayer]);

  // Persist favorites
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
    playSpiritualChime('gentle');
  };

  // Copy Dua details to clipboard
  const handleCopyDua = (dua: DuaItem) => {
    const textToCopy = `${dua.title}\n\n${dua.arabic}\n\nTransliteration: ${dua.transliteration}\n\nTranslation: "${dua.translation}"\n\nReference: ${dua.source}\nVirtue: ${dua.virtue}\n[Sallah Mate Prayer Duas]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(dua.id);
    playSpiritualChime('gentle');
    setTimeout(() => {
      setCopiedId(null);
    }, 2200);
  };

  // Increment interactive Dhikr bead counter
  const handleIncrementCounter = (dua: DuaItem) => {
    const max = dua.recommendedCount || 1;
    setCounters((prev) => {
      const current = prev[dua.id] || 0;
      const next = current >= max ? 1 : current + 1;
      return { ...prev, [dua.id]: next };
    });
    playSpiritualChime('gentle');
  };

  // Audio speech synthesis playback of Arabic text
  const handlePlayAudio = (dua: DuaItem) => {
    if (playingAudioId === dua.id) {
      window.speechSynthesis?.cancel();
      setPlayingAudioId(null);
      return;
    }

    if (!('speechSynthesis' in window)) {
      playSpiritualChime('takbeer');
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingAudioId(dua.id);

    const utterance = new SpeechSynthesisUtterance(dua.arabic);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;

    utterance.onend = () => {
      setPlayingAudioId(null);
      playSpiritualChime('gentle');
    };

    utterance.onerror = () => {
      setPlayingAudioId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Save personal Dua
  const handleAddPersonalDua = () => {
    if (!newPersonalDuaText.trim()) return;
    const newDua: PersonalDua = {
      id: 'personal-' + Date.now(),
      prayer: selectedTiming === 'all' ? 'Every Prayer' : selectedTiming,
      text: newPersonalDuaText.trim(),
      createdAt: new Date().toLocaleDateString()
    };
    const updated = [newDua, ...personalDuas];
    setPersonalDuas(updated);
    localStorage.setItem(PERSONAL_DUAS_KEY, JSON.stringify(updated));
    setNewPersonalDuaText('');
    playSpiritualChime('gentle');
  };

  const handleDeletePersonalDua = (id: string) => {
    const updated = personalDuas.filter((item) => item.id !== id);
    setPersonalDuas(updated);
    localStorage.setItem(PERSONAL_DUAS_KEY, JSON.stringify(updated));
  };

  if (!isOpen) return null;

  // Filter Duas
  const filteredDuas = filterDuas(selectedTiming, selectedPhase, searchQuery).filter(
    (item) => !showOnlyFavorites || favorites.includes(item.id)
  );

  const prayerTimingOptions: { id: PrayerName | 'Tahajjud' | 'Jummah' | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Prayers', icon: '✨' },
    { id: 'Fajr', label: 'Fajr Dawn', icon: '🌅' },
    { id: 'Dhuhr', label: 'Dhuhr Midday', icon: '☀️' },
    { id: 'Asr', label: 'Asr Afternoon', icon: '🌤️' },
    { id: 'Maghrib', label: 'Maghrib Sunset', icon: '🌇' },
    { id: 'Isha', label: 'Isha Night', icon: '🌙' },
    { id: 'Tahajjud', label: 'Tahajjud Vigil', icon: '🌌' },
    { id: 'Jummah', label: 'Jummah (Friday)', icon: '🕌' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-stone-900 border border-emerald-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 px-5 sm:px-7 py-4 border-b border-emerald-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  Prophetic Prayer Duas & Supplications
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-semibold uppercase tracking-wider">
                  Context-Aware
                </span>
              </div>
              <p className="text-xs text-stone-300 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Current Active Timing:{' '}
                  <strong className="text-emerald-300 underline underline-offset-2">{currentTiming}</strong>
                </span>
                <span className="text-stone-500">•</span>
                <span className="text-stone-400">Authentic Pre, During & Post-Sallah Adhkar</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition border border-stone-700/60"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Context Alert Banner */}
        <div className="bg-emerald-950/70 border-b border-emerald-500/30 px-5 sm:px-7 py-2.5 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Prophetic Wisdom:</strong> The Prophet ﷺ said: <em>"Du'a is the essence of worship."</em> (At-Tirmidhi 3371). Ask Allah with certainty in your heart.
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowPersonalDuas(!showPersonalDuas)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition flex items-center gap-1 ${
                showPersonalDuas
                  ? 'bg-amber-600 border-amber-400 text-white'
                  : 'bg-stone-900/80 border-stone-700 text-stone-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>Personal Duas ({personalDuas.length})</span>
            </button>

            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition flex items-center gap-1 ${
                showOnlyFavorites
                  ? 'bg-rose-600 border-rose-400 text-white'
                  : 'bg-stone-900/80 border-stone-700 text-stone-300 hover:text-white'
              }`}
            >
              <Heart className={`w-3 h-3 ${showOnlyFavorites ? 'fill-current' : ''}`} />
              <span>Favorites ({favorites.length})</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/40 space-y-3.5 shrink-0">
          {/* Timing Selectors */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {prayerTimingOptions.map((opt) => {
              const isSelected = selectedTiming === opt.id;
              const isCurrent = opt.id === currentTiming;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedTiming(opt.id);
                    playSpiritualChime('gentle');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-950'
                      : 'bg-stone-900/80 hover:bg-stone-800 border-stone-800 text-stone-300'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Phase Selectors & Search Query */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Phase Filters */}
            <div className="inline-flex rounded-xl bg-stone-900 p-1 border border-stone-800 text-xs">
              <button
                onClick={() => setSelectedPhase('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedPhase === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                All Phases
              </button>
              <button
                onClick={() => setSelectedPhase('pre')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                  selectedPhase === 'pre'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>Pre-Sallah</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-black/30">Adhan / Wudu</span>
              </button>
              <button
                onClick={() => setSelectedPhase('during')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                  selectedPhase === 'during'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>During Sallah</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-black/30">Ruku / Sujud</span>
              </button>
              <button
                onClick={() => setSelectedPhase('post')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                  selectedPhase === 'post'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <span>Post-Sallah</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-black/30">Taslim / Azkar</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search forgiveness, protection, sujud..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

          {/* Personal Duas Drawer if Open */}
          {showPersonalDuas && (
            <div className="bg-stone-950/70 border border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    <Edit3 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-amber-200">
                      My Personal Duas & Heartfelt Whispers to Allah
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Write down your personal needs, loved ones to pray for, and specific intentions for this prayer.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPersonalDuas(false)}
                  className="text-stone-400 hover:text-white text-xs px-2 py-1 rounded bg-stone-800"
                >
                  Hide
                </button>
              </div>

              {/* Add New Personal Dua */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPersonalDuaText}
                  onChange={(e) => setNewPersonalDuaText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddPersonalDua();
                  }}
                  placeholder="e.g. O Allah, cure my mother, grant me ease in my exams, and guide my heart..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleAddPersonalDua}
                  disabled={!newPersonalDuaText.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Dua</span>
                </button>
              </div>

              {/* List of Personal Duas */}
              {personalDuas.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {personalDuas.map((pd) => (
                    <div
                      key={pd.id}
                      className="p-3 bg-stone-900/90 border border-stone-800 rounded-xl flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                            {pd.prayer}
                          </span>
                          <span className="text-[10px] text-stone-500">{pd.createdAt}</span>
                        </div>
                        <p className="text-stone-200 leading-relaxed italic">"{pd.text}"</p>
                      </div>
                      <button
                        onClick={() => handleDeletePersonalDua(pd.id)}
                        className="text-stone-500 hover:text-rose-400 p-1 transition"
                        title="Delete personal dua"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic text-center py-2">
                  No personal supplications recorded yet. Add one above!
                </p>
              )}
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-stone-400 px-1">
            <span>
              Showing <strong className="text-emerald-300">{filteredDuas.length}</strong> authentic supplications
              {selectedTiming !== 'all' ? ` for ${selectedTiming}` : ''}
              {selectedPhase !== 'all' ? ` (${selectedPhase}-Sallah)` : ''}
            </span>
            <span className="text-stone-500 text-[11px]">
              Tip: Tap the recitation count badge to count repetitions
            </span>
          </div>

          {/* Dua Cards Grid / List */}
          {filteredDuas.length > 0 ? (
            <div className="space-y-4">
              {filteredDuas.map((dua) => {
                const isFav = favorites.includes(dua.id);
                const isPlaying = playingAudioId === dua.id;
                const isCopied = copiedId === dua.id;
                const countTarget = dua.recommendedCount || 1;
                const currentCount = counters[dua.id] || 0;
                const isCountCompleted = currentCount >= countTarget;

                return (
                  <div
                    key={dua.id}
                    className="bg-stone-950/80 border border-stone-800/90 hover:border-emerald-500/40 rounded-2xl p-5 transition-all shadow-md space-y-4 relative group"
                  >
                    {/* Card Top: Timing badge, phase badge, action buttons */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              dua.phase === 'pre'
                                ? 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                                : dua.phase === 'during'
                                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                                : 'bg-teal-950/80 border border-teal-500/40 text-teal-300'
                            }`}
                          >
                            {dua.phase === 'pre' ? 'Pre-Sallah' : dua.phase === 'during' ? 'During Sallah' : 'Post-Sallah'}
                          </span>

                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300 font-medium">
                            {dua.prayerTiming === 'Any' ? 'All Prayers' : dua.prayerTiming}
                          </span>

                          <span className="text-[10px] text-stone-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            <span>{dua.occasion}</span>
                          </span>
                        </div>

                        <h3 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors">
                          {dua.title}
                        </h3>
                      </div>

                      {/* Top Action Icons: Audio, Bookmark, Copy */}
                      <div className="flex items-center space-x-1 shrink-0">
                        {/* Audio Reciter Button */}
                        <button
                          onClick={() => handlePlayAudio(dua)}
                          className={`w-8 h-8 rounded-xl border flex items-center justify-center transition ${
                            isPlaying
                              ? 'bg-emerald-600 border-emerald-400 text-white animate-pulse'
                              : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-400 hover:text-emerald-300'
                          }`}
                          title="Listen to Arabic recitation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        {/* Favorite Bookmark Button */}
                        <button
                          onClick={() => toggleFavorite(dua.id)}
                          className={`w-8 h-8 rounded-xl border flex items-center justify-center transition ${
                            isFav
                              ? 'bg-rose-950 border-rose-500/50 text-rose-400'
                              : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-400 hover:text-rose-400'
                          }`}
                          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>

                        {/* Copy to Clipboard */}
                        <button
                          onClick={() => handleCopyDua(dua)}
                          className={`w-8 h-8 rounded-xl border flex items-center justify-center transition ${
                            isCopied
                              ? 'bg-emerald-600 border-emerald-400 text-white'
                              : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-400 hover:text-white'
                          }`}
                          title="Copy supplication and translation"
                        >
                          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text Display */}
                    <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-4 sm:p-5 text-right font-serif" dir="rtl">
                      <p className="text-xl sm:text-2xl text-emerald-100 leading-loose tracking-wide font-medium select-all">
                        {dua.arabic}
                      </p>
                    </div>

                    {/* Transliteration */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Transliteration
                      </span>
                      <p className="text-xs text-stone-300 italic font-mono leading-relaxed bg-stone-900/30 p-2.5 rounded-xl border border-stone-800/50">
                        "{dua.transliteration}"
                      </p>
                    </div>

                    {/* Translation */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Translation
                      </span>
                      <p className="text-xs text-stone-200 leading-relaxed font-sans-custom">
                        "{dua.translation}"
                      </p>
                    </div>

                    {/* Spiritual Reward & Hadith Citation Footer */}
                    <div className="pt-2 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-[11px] font-semibold text-emerald-400">
                          {dua.source}
                        </span>
                        <span className="text-[11px] text-stone-400 font-medium">
                          {dua.virtue}
                        </span>
                      </div>

                      {/* Interactive Repetition Counter */}
                      <button
                        onClick={() => handleIncrementCounter(dua)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 self-end sm:self-auto ${
                          isCountCompleted
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 shadow-inner'
                            : 'bg-stone-900 hover:bg-stone-800 border-stone-700 text-stone-200'
                        }`}
                        title="Click to track your recitations"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Recite {countTarget}x:</span>
                        <span className={`px-2 py-0.5 rounded-md font-mono ${isCountCompleted ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-emerald-300'}`}>
                          {currentCount}/{countTarget}
                        </span>
                        {isCountCompleted && <Check className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-stone-300">No supplications found matching your filters</p>
              <p className="text-xs text-stone-500">
                Try selecting "All Prayers" or clearing your search term.
              </p>
              <button
                onClick={() => {
                  setSelectedTiming('all');
                  setSelectedPhase('all');
                  setSearchQuery('');
                  setShowOnlyFavorites(false);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Sunnah Etiquettes of Supplication Section */}
          <div className="bg-stone-950/90 border border-stone-800/90 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                Prophetic Etiquettes for Guaranteed Dua Acceptance (Adab ad-Du‘a)
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-stone-300">
              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800/60 space-y-1">
                <span className="font-bold text-emerald-300 block">1. Praise Allah & Salawat</span>
                <p className="text-stone-400">
                  Begin your supplication by praising Allah’s majesty, then sending peace and blessings upon the Prophet ﷺ.
                </p>
              </div>
              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800/60 space-y-1">
                <span className="font-bold text-emerald-300 block">2. In Prostration (Sujud)</span>
                <p className="text-stone-400">
                  The Prophet ﷺ said: "The closest that a servant comes to his Lord is when he is prostrating, so make abundant supplication." (Muslim).
                </p>
              </div>
              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800/60 space-y-1">
                <span className="font-bold text-emerald-300 block">3. Certainty & Perseverance</span>
                <p className="text-stone-400">
                  Ask Allah with certainty that He will answer, without impatience or saying "I prayed but was not answered."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All supplications sourced from Sahih al-Bukhari, Sahih Muslim, and authentic Sunan.</span>
          </div>
          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onClose();
            }}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
