import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Scroll, BookMarked, Sparkles, Search, Play, Pause, ChevronRight, MessageSquare, Send, Check, Bookmark, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { ALL_114_SURAHS, SurahMeta } from '../data/quran114Chapters';
import { getSurahWithAyahs } from '../services/quranApiService';
import { QURAN_SURAHS } from '../data/quranData';
import { HADITH_COLLECTION } from '../data/hadithData';
import { ISLAMIC_BOOKS } from '../data/islamicBooksData';
import { QuranSurah, HadithItem, IslamicBook } from '../types';

export const IslamicLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quran' | 'hadith' | 'books' | 'assistant'>('quran');

  // Quran state - initialized with full 114 chapters
  const [selectedSurahMeta, setSelectedSurahMeta] = useState<SurahMeta>(ALL_114_SURAHS[0]);
  const [selectedSurah, setSelectedSurah] = useState<QuranSurah>(QURAN_SURAHS[0]);
  const [surahLoading, setSurahLoading] = useState<boolean>(false);
  const [quranSearch, setQuranSearch] = useState<string>('');
  const [surahTypeFilter, setSurahTypeFilter] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  const [arabicFontSize, setArabicFontSize] = useState<number>(28);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<string[]>([]);

  // Quran Audio Recitation state
  const [isAudioReciting, setIsAudioReciting] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load surah with ayahs whenever selectedSurahMeta changes
  useEffect(() => {
    let isCancelled = false;
    async function loadSurah() {
      setSurahLoading(true);
      try {
        const fullSurah = await getSurahWithAyahs(selectedSurahMeta.number);
        if (!isCancelled) {
          setSelectedSurah(fullSurah);
        }
      } catch (err) {
        console.warn('Failed to load full surah, using fallback', err);
      } finally {
        if (!isCancelled) setSurahLoading(false);
      }
    }

    // Stop current audio when switching surahs
    if (audioRef.current) {
      audioRef.current.pause();
      setIsAudioReciting(false);
    }

    loadSurah();

    return () => {
      isCancelled = true;
    };
  }, [selectedSurahMeta]);

  // Audio recitation toggle
  const toggleSurahAudio = () => {
    const audioUrl =
      selectedSurah.audioUrl ||
      `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${String(
        selectedSurah.number
      ).padStart(3, '0')}.mp3`;

    if (isAudioReciting && audioRef.current) {
      audioRef.current.pause();
      setIsAudioReciting(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      newAudio.onended = () => setIsAudioReciting(false);
      newAudio.onerror = () => {
        console.warn('Audio recitation failed to load');
        setIsAudioReciting(false);
      };
      newAudio
        .play()
        .then(() => setIsAudioReciting(true))
        .catch((e) => {
          console.warn('Playback error', e);
          setIsAudioReciting(false);
        });
    }
  };

  // Hadith state
  const [hadithSearch, setHadithSearch] = useState<string>('');
  const [selectedHadithTopic, setSelectedHadithTopic] = useState<string>('all');

  // Islamic Books state
  const [selectedBook, setSelectedBook] = useState<IslamicBook>(ISLAMIC_BOOKS[0]);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(ISLAMIC_BOOKS[0].chapters[0].id);

  // Islamic AI Assistant state
  const [assistantQuestion, setAssistantQuestion] = useState<string>('');
  const [assistantLoading, setAssistantLoading] = useState<boolean>(false);
  const [assistantChat, setAssistantChat] = useState<
    { sender: 'user' | 'assistant'; text: string; references?: string[] }[]
  >([
    {
      sender: 'assistant',
      text: 'As-salamu alaykum wa rahmatullah. I am your Islamic knowledge companion. You can ask about prayer rulings, Quranic meanings, authentic Hadiths, or the virtues of congregational Sallah.',
      references: ['Surah Al-Baqarah 2:43', 'Sahih al-Bukhari 527'],
    },
  ]);

  const toggleBookmark = (key: string) => {
    setBookmarkedVerses((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Filter all 114 surahs
  const filteredSurahs = ALL_114_SURAHS.filter((s) => {
    const q = quranSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.number.toString() === q ||
      s.englishName.toLowerCase().includes(q) ||
      s.name.includes(q) ||
      s.englishNameTranslation.toLowerCase().includes(q) ||
      (s.theme && s.theme.toLowerCase().includes(q));
    const matchesType =
      surahTypeFilter === 'all' || s.revelationType === surahTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filter hadiths
  const filteredHadiths = HADITH_COLLECTION.filter((h) => {
    const matchesSearch =
      h.englishText.toLowerCase().includes(hadithSearch.toLowerCase()) ||
      h.narrator.toLowerCase().includes(hadithSearch.toLowerCase()) ||
      h.hadithNumber.toLowerCase().includes(hadithSearch.toLowerCase());
    const matchesTopic =
      selectedHadithTopic === 'all' || h.topic.toLowerCase().includes(selectedHadithTopic.toLowerCase());
    return matchesSearch && matchesTopic;
  });

  const hadithTopics = ['all', 'congregational', 'distraction', 'on time', 'tasbih'];

  // Handle AI question
  const askIslamicAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantQuestion.trim() || assistantLoading) return;

    const q = assistantQuestion.trim();
    setAssistantQuestion('');
    setAssistantChat((prev) => [...prev, { sender: 'user', text: q }]);
    setAssistantLoading(true);

    try {
      const response = await fetch('/api/islamic-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          context: `Surah: ${selectedSurah.englishName}, Book: ${selectedBook.title}`,
          history: assistantChat.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })),
        }),
      });

      const data = await response.json();
      setAssistantChat((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: data.answer || 'Seek guidance in the remembrance of Allah and establishing sincere prayer.',
          references: data.references || [],
        },
      ]);
    } catch (err) {
      setAssistantChat((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Allah says in the Quran: "Recite what has been revealed to you of the Book and establish prayer. Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater." (Surah Al-Ankabut 29:45).',
          references: ['Surah Al-Ankabut 29:45'],
        },
      ]);
    } finally {
      setAssistantLoading(false);
    }
  };

  const currentBookChapter =
    selectedBook.chapters.find((c) => c.id === selectedChapterId) || selectedBook.chapters[0];

  return (
    <div id="islamic-library-container" className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Islamic Texts & Wisdom Library
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            The Holy Quran, Authentic Hadiths, and Classical Islamic Books
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800 self-start sm:self-auto overflow-x-auto">
          <button
            id="tab-quran-btn"
            onClick={() => setActiveTab('quran')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'quran'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Holy Quran
          </button>

          <button
            id="tab-hadith-btn"
            onClick={() => setActiveTab('hadith')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'hadith'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            Hadiths
          </button>

          <button
            id="tab-books-btn"
            onClick={() => setActiveTab('books')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'books'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            Islamic Books
          </button>

          <button
            id="tab-assistant-btn"
            onClick={() => setActiveTab('assistant')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'assistant'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask Scholar AI
          </button>
        </div>
      </div>

      {/* TAB 1: HOLY QURAN */}
      {activeTab === 'quran' && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Surah List / Selector */}
          <div className="lg:col-span-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                id="search-surahs-input"
                type="text"
                value={quranSearch}
                onChange={(e) => setQuranSearch(e.target.value)}
                placeholder="Search by number (1-114), name or meaning..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Revelation Type Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 text-[11px]">
              {(['all', 'Meccan', 'Medinan'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSurahTypeFilter(type)}
                  className={`flex-1 py-1 px-2 rounded-lg font-medium transition ${
                    surahTypeFilter === type
                      ? 'bg-emerald-600 text-white'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {type === 'all' ? 'All (114)' : type === 'Meccan' ? 'Meccan (86)' : 'Medinan (28)'}
                </button>
              ))}
            </div>

            {/* Surahs scrollable list */}
            <div className="max-h-[520px] overflow-y-auto space-y-1.5 pr-1">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  id={`surah-select-${surah.number}`}
                  onClick={() => setSelectedSurahMeta(surah)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    selectedSurahMeta.number === surah.number
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : 'bg-stone-950/40 border-stone-800/80 text-stone-300 hover:bg-stone-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 text-[11px] font-bold text-stone-400 flex items-center justify-center">
                      {surah.number}
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{surah.englishName}</div>
                      <div className="text-[11px] text-stone-400">{surah.englishNameTranslation}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-arabic text-emerald-400">{surah.name}</div>
                    <div className="text-[10px] text-stone-500">
                      {surah.revelationType} • {surah.numberOfAyahs} v.
                    </div>
                  </div>
                </button>
              ))}
              {filteredSurahs.length === 0 && (
                <div className="text-center py-8 text-xs text-stone-500">
                  No Surah found matching &quot;{quranSearch}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Surah Content Reader */}
          <div className="lg:col-span-8 bg-stone-950/60 border border-stone-800 rounded-2xl p-5 sm:p-6 flex flex-col">
            {/* Surah Header, Audio Recitation & Font Size Control */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-stone-400 font-mono">
                    Surah #{selectedSurah.number}
                  </span>
                  <h3 className="text-xl font-bold text-white">{selectedSurah.englishName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                    {selectedSurah.revelationType}
                  </span>
                  <span className="text-xs text-stone-400">
                    ({selectedSurah.numberOfAyahs} Ayahs)
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1">{selectedSurah.theme}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Audio Recitation Button */}
                <button
                  id="toggle-surah-recitation-btn"
                  onClick={toggleSurahAudio}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                    isAudioReciting
                      ? 'bg-emerald-600 border-emerald-500 text-white animate-pulse'
                      : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-200'
                  }`}
                  title="Listen to complete recitation by Sheikh Mishary Rashid Alafasy"
                >
                  {isAudioReciting ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Recitation</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Play Recitation</span>
                    </>
                  )}
                </button>

                {/* Font Resizer */}
                <div className="flex items-center space-x-2 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 text-xs">
                  <span className="text-stone-400">Arabic:</span>
                  <button
                    onClick={() => setArabicFontSize((s) => Math.max(20, s - 2))}
                    className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-300 hover:text-white"
                  >
                    A-
                  </button>
                  <span className="font-mono text-emerald-400">{arabicFontSize}px</span>
                  <button
                    onClick={() => setArabicFontSize((s) => Math.min(42, s + 2))}
                    className="px-1.5 py-0.5 bg-stone-800 rounded text-stone-300 hover:text-white"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            {/* Bismillah Banner for surahs (except Surah 9 At-Tawbah) */}
            {selectedSurah.number !== 9 && (
              <div className="text-center py-4 my-2 border-b border-stone-900">
                <div className="font-arabic text-2xl text-emerald-300" dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                {/* Transliteration directly below Arabic */}
                <div className="text-xs text-emerald-200/90 font-medium tracking-wide mt-1">
                  Bismillāhir-Raḥmānir-Raḥīm
                </div>
                <div className="text-[11px] text-stone-400 italic mt-0.5">
                  In the Name of Allah—the Most Compassionate, Most Merciful
                </div>
              </div>
            )}

            {/* Loading Indicator or Verses display */}
            {surahLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-stone-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <span className="text-xs">Loading Uthmanic Ayahs & English Translation...</span>
              </div>
            ) : (
              <div className="mt-4 space-y-5 max-h-[500px] overflow-y-auto pr-2">
                {selectedSurah.ayahs.map((ayah) => {
                  const bKey = `${selectedSurah.number}:${ayah.numberInSurah}`;
                  const isBookmarked = bookmarkedVerses.includes(bKey);

                  return (
                    <div
                      key={ayah.numberInSurah}
                      className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 hover:border-emerald-500/30 transition space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono">
                          Ayah {ayah.numberInSurah}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {ayah.audioUrl && (
                            <button
                              onClick={() => {
                                const a = new Audio(ayah.audioUrl);
                                a.play();
                              }}
                              className="p-1.5 rounded-md text-stone-400 hover:text-emerald-300 transition"
                              title="Listen to this verse"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleBookmark(bKey)}
                            className={`p-1.5 rounded-md transition ${
                              isBookmarked
                                ? 'text-emerald-400 bg-emerald-950 border border-emerald-500/40'
                                : 'text-stone-500 hover:text-stone-300'
                            }`}
                            title={isBookmarked ? 'Bookmarked' : 'Bookmark Ayah'}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Arabic Text */}
                      <div
                        className="font-arabic text-right text-emerald-200 leading-loose"
                        style={{ fontSize: `${arabicFontSize}px` }}
                        dir="rtl"
                      >
                        {ayah.arabic}
                      </div>

                      {/* Transliteration (if available) */}
                      {ayah.transliteration && (
                        <div className="text-xs text-stone-400 italic">
                          {ayah.transliteration}
                        </div>
                      )}

                      {/* Translation */}
                      <div className="text-sm text-stone-200 leading-relaxed">
                        {ayah.translation}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AUTHENTIC HADITHS */}
      {activeTab === 'hadith' && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                id="search-hadith-input"
                type="text"
                value={hadithSearch}
                onChange={(e) => setHadithSearch(e.target.value)}
                placeholder="Search hadiths, narrators..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Topic Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {hadithTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedHadithTopic(topic)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition ${
                    selectedHadithTopic === topic
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  {topic === 'all' ? 'All Hadiths' : topic}
                </button>
              ))}
            </div>
          </div>

          {/* Hadith Cards */}
          <div className="grid grid-cols-1 gap-4 max-h-[560px] overflow-y-auto pr-1">
            {filteredHadiths.map((hadith) => (
              <div
                key={hadith.id}
                className="bg-stone-950/60 border border-stone-800 rounded-2xl p-5 space-y-4 hover:border-emerald-500/30 transition shadow-sm"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/30">
                      {hadith.collection}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      {hadith.hadithNumber} • {hadith.bookName}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-900 border border-stone-700 text-stone-300">
                    Grade: {hadith.grade}
                  </span>
                </div>

                {/* Arabic Hadith */}
                <div className="font-arabic text-right text-emerald-200 text-xl sm:text-2xl" dir="rtl">
                  {hadith.arabicText}
                </div>

                {/* English Text */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-emerald-400">{hadith.narrator}</div>
                  <div className="text-sm text-stone-200 leading-relaxed font-serif">
                    {hadith.englishText}
                  </div>
                </div>

                <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-800 flex items-center justify-between">
                  <span>Topic: {hadith.topic}</span>
                  <span className="text-emerald-400">Authentic Tradition</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ISLAMIC BOOKS */}
      {activeTab === 'books' && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Books and Chapters Navigator */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">Select Islamic Book</label>
              <div className="space-y-2">
                {ISLAMIC_BOOKS.map((b) => (
                  <button
                    key={b.id}
                    id={`book-select-${b.id}`}
                    onClick={() => {
                      setSelectedBook(b);
                      setSelectedChapterId(b.chapters[0].id);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      selectedBook.id === b.id
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800/40'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{b.title}</div>
                      <div className="text-[11px] text-stone-400">{b.author}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 text-stone-400 border border-stone-700">
                      {b.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">Chapters / Sections</label>
              <div className="space-y-1.5 max-h-[260px] overflow-y-auto">
                {selectedBook.chapters.map((ch) => (
                  <button
                    key={ch.id}
                    id={`chapter-select-${ch.id}`}
                    onClick={() => setSelectedChapterId(ch.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                      selectedChapterId === ch.id
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-stone-950/60 text-stone-300 hover:bg-stone-800 border border-stone-800'
                    }`}
                  >
                    <span>{ch.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter Content Reader */}
          <div className="lg:col-span-8 bg-stone-950/60 border border-stone-800 rounded-2xl p-5 sm:p-6 flex flex-col space-y-5">
            <div className="pb-3 border-b border-stone-800">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {selectedBook.title}
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">{currentBookChapter.title}</h3>
              {currentBookChapter.arabicTitle && (
                <div className="text-sm font-arabic text-emerald-300 mt-1">
                  {currentBookChapter.arabicTitle}
                </div>
              )}
            </div>

            {/* Main content body */}
            <div className="text-sm text-stone-200 leading-relaxed whitespace-pre-line">
              {currentBookChapter.content}
            </div>

            {/* Arabic Duas if available in chapter */}
            {currentBookChapter.arabicDuas && currentBookChapter.arabicDuas.length > 0 && (
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Prescribed Supplications & Adhkar
                </h4>
                {currentBookChapter.arabicDuas.map((dua, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-3"
                  >
                    {dua.repetitions && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-mono">
                        Repeat {dua.repetitions}x
                      </span>
                    )}

                    {/* Arabic text on top */}
                    <div
                      className="font-arabic text-right text-emerald-200 text-xl leading-loose p-3.5 rounded-xl bg-stone-950/70 border border-emerald-500/20"
                      dir="rtl"
                    >
                      {dua.arabic}
                    </div>

                    {/* Transliteration directly below Arabic text */}
                    <div className="p-3 rounded-xl bg-stone-950/80 border border-emerald-500/30 text-left space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>Transliteration</span>
                      </div>
                      <div className="text-xs sm:text-sm text-stone-100 font-semibold leading-relaxed">
                        {dua.transliteration}
                      </div>
                    </div>

                    {/* Translation */}
                    <div className="text-xs sm:text-sm text-stone-300 italic px-1">
                      "{dua.translation}"
                    </div>

                    <div className="text-[10px] text-stone-500 font-mono px-1">
                      Reference: {dua.reference}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ASK ISLAMIC SCHOLAR AI */}
      {activeTab === 'assistant' && (
        <div className="mt-5 space-y-4">
          <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 sm:p-5 flex flex-col h-[500px]">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
              {assistantChat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                        : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        Islamic Knowledge Assistant
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {msg.references && msg.references.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-stone-800/80 flex flex-wrap gap-1.5">
                        {msg.references.map((ref, rIdx) => (
                          <span
                            key={rIdx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-stone-950 text-emerald-300 border border-stone-700"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {assistantLoading && (
                <div className="flex items-center space-x-2 text-xs text-stone-400 bg-stone-900/60 p-3 rounded-xl max-w-xs border border-stone-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce delay-300"></div>
                  <span>Consulting verified Islamic sources...</span>
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={askIslamicAssistant} className="mt-4 pt-3 border-t border-stone-800 flex gap-2">
              <input
                id="ask-assistant-input"
                type="text"
                value={assistantQuestion}
                onChange={(e) => setAssistantQuestion(e.target.value)}
                placeholder="Ask about prayer timings, hadiths, prayer invalidators, or Quranic verses..."
                className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                id="ask-assistant-submit-btn"
                type="submit"
                disabled={assistantLoading || !assistantQuestion.trim()}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm transition flex items-center gap-1.5 shadow-md shadow-emerald-950"
              >
                <Send className="w-4 h-4" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
