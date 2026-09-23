import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Flame,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { PrayerName } from '../types';
import { playSpiritualChime } from '../utils/prayerTimes';

interface PostSallahAzkarLockModalProps {
  prayerName: PrayerName;
  onUnlocked: () => void;
  onEmergencyBypass?: () => void;
}

interface AzkarSequenceItem {
  id: string;
  name: string;
  arabic: string;
  transliteration: string;
  translation: string;
  requiredCount: number;
  virtue: string;
  hadithSource: string;
}

const POST_SALLAH_AZKAR_STEPS: AzkarSequenceItem[] = [
  {
    id: 'istighfar_salam',
    name: '1. Istighfar & Salam Supplication',
    arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ\nاللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    transliteration: 'Astaghfiru Allāh, Astaghfiru Allāh, Astaghfiru Allāh. Allāhumma antas-Salāmu wa minkas-salām, tabārakta yā Dhal-Jalāli wal-Ikrām.',
    translation: 'I seek forgiveness from Allah (thrice). O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of Majesty and Honor.',
    requiredCount: 3,
    virtue: 'The Messenger of Allah ﷺ would immediately seek forgiveness thrice upon saying Salam to wash away any lapses or lack of concentration during prayer.',
    hadithSource: 'Sahih Muslim 591',
  },
  {
    id: 'tahlil_after_salam',
    name: '2. Tahlil After Salam',
    arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    transliteration: 'Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa Huwa ‘alā kulli shay’in Qadīr. Allāhumma lā māni‘a limā a‘ṭayta, wa lā mu‘ṭiya limā mana‘ta, wa lā yanfa‘u dhal-jaddi minkal-jadd.',
    translation: 'None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He is over all things capable. O Allah, none can prevent what You give, and none can give what You withhold, and no fortune can benefit its possessor against You.',
    requiredCount: 1,
    virtue: 'Recited by the Prophet ﷺ immediately following the obligatory prayer to declare complete dependence on Allah alone.',
    hadithSource: 'Sahih al-Bukhari 844 & Sahih Muslim 593',
  },
  {
    id: 'tasbih_subhanallah',
    name: '3. Tasbih (SubhanAllah)',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subḥān Allāh',
    translation: 'Glory be to Allah, far above any imperfection.',
    requiredCount: 33,
    virtue: 'Reciting SubhanAllah 33 times after obligatory prayer elevates spiritual ranks and washes away transgressions.',
    hadithSource: 'Sahih Muslim 597',
  },
  {
    id: 'tahmid_alhamdulillah',
    name: '4. Tahmid (Alhamdulillah)',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    translation: 'All praise and gratitude belong exclusively to Allah.',
    requiredCount: 33,
    virtue: 'Fills the celestial scales with supreme weight of good deeds on the Day of Judgment.',
    hadithSource: 'Sahih Muslim 223 & 597',
  },
  {
    id: 'takbeer_allahuakbar',
    name: '5. Takbeer (Allahu Akbar)',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah is Greater than all creation, worries, and difficulties.',
    requiredCount: 33,
    virtue: 'Reaffirms divine majesty, cleanses pride, and sanctifies the believer’s soul before returning to Dunya affairs.',
    hadithSource: 'Sahih Muslim 597',
  },
  {
    id: 'tahlil_seal',
    name: '6. The 100th Seal (Tawheed Tahlil)',
    arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu, wa Huwa ‘alā kulli shay’in qadīr',
    translation: 'None has the right to be worshipped except Allah alone, without partner. To Him belongs kingdom and praise, and He is over all things capable.',
    requiredCount: 1,
    virtue: 'The Prophet ﷺ said whoever recites this to seal the 100 remembrances after Sallah, all his sins are forgiven even if as vast as the foam of the ocean.',
    hadithSource: 'Sahih Muslim 597',
  },
  {
    id: 'ayatul_kursi',
    name: '7. Ayat al-Kursi (Verse of the Throne)',
    arabic: 'اللَّهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: 'Allāhu lā ilāha illā Huwa, al-Ḥayyul-Qayyūm. Lā ta’khudhuhū sinatuw-wa lā nawm. Lahū mā fis-samāwāti wa mā fil-arḍ. Man dhal-ladhī yashfa‘u ‘indahū illā bi-idhnih. Ya‘lamu mā bayna aydīhim wa mā khalfahum, wa lā yuḥīṭūna bi-shay’im-min ‘ilmihī illā bimā shā’. Wasi‘a kursiyyuhus-samāwāti wal-arḍ, wa lā ya’ūduhū ḥifẓuhumā, wa Huwal-‘Aliyyul-‘Aẓīm.',
    translation: 'Allah! There is no deity worthy of worship except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    requiredCount: 1,
    virtue: 'The Prophet ﷺ said: "Whoever recites Ayat al-Kursi after every obligatory prayer, nothing stands between him and entering Paradise except death."',
    hadithSource: 'Sunan an-Nasa’i (Al-Sunan al-Kubra 9848) & Sahih Ibn Hibban',
  },
  {
    id: 'dua_shukr_ibadah',
    name: '8. Supplication for Remembrance & Excellence in Worship',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: 'Allāhumma a‘innī ‘alā dhikrika wa shukrika wa ḥusni ‘ibādatik',
    translation: 'O Allah, assist me in remembering You, showing gratitude to You, and worshipping You with excellence.',
    requiredCount: 1,
    virtue: 'The Messenger of Allah ﷺ took Mu’adh ibn Jabal by the hand and said: "O Mu’adh, by Allah I love you! I advise you never to omit reciting this supplication at the conclusion of every prayer."',
    hadithSource: 'Sunan Abi Dawud 1522 & Sunan an-Nasa’i 1303 (Sahih)',
  },
];

export const PostSallahAzkarLockModal: React.FC<PostSallahAzkarLockModalProps> = ({
  prayerName,
  onUnlocked,
  onEmergencyBypass,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepCounts, setStepCounts] = useState<Record<string, number>>({});
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCompletedAll, setIsCompletedAll] = useState<boolean>(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState<boolean>(false);

  const currentStep = POST_SALLAH_AZKAR_STEPS[currentStepIndex];
  const currentCount = stepCounts[currentStep.id] || 0;
  const isStepFinished = currentCount >= currentStep.requiredCount;

  // Handle tap on bead
  const handleCountIncrement = () => {
    if (isCompletedAll) return;

    const nextCount = currentCount + 1;
    setStepCounts((prev) => ({
      ...prev,
      [currentStep.id]: nextCount,
    }));

    // Haptic feedback
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(20);
      } catch {
        // ignore
      }
    }

    if (soundEnabled) {
      if (nextCount >= currentStep.requiredCount) {
        playSpiritualChime('takbeer');
      } else {
        playSpiritualChime('gentle');
      }
    }

    // If step is completed
    if (nextCount >= currentStep.requiredCount) {
      if (currentStepIndex < POST_SALLAH_AZKAR_STEPS.length - 1) {
        setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, 350);
      } else {
        // All Azkar steps completed!
        setIsCompletedAll(true);
        playSpiritualChime('takbeer');
      }
    }
  };

  const handleUnlockApp = () => {
    playSpiritualChime('takbeer');
    onUnlocked();
  };

  return (
    <div
      id="post-sallah-azkar-lock-overlay"
      className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto selection:bg-emerald-600 text-stone-100"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at top center, rgba(6, 78, 59, 0.35) 0%, rgba(12, 10, 9, 0.98) 75%)',
      }}
    >
      {/* Top Banner: Sanctuary Lock State */}
      <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 animate-pulse">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {prayerName} Sallah Finished • Post-Prayer Azkar Lock Active
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[11px] text-stone-300">
              App locked to worldly distractions until you recite your authentic Sunnah remembrances
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition"
            title={soundEnabled ? 'Mute chimes' : 'Unmute chimes'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Focus Area: Sequential Dhikr Bead Gate */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center my-auto">
        {!isCompletedAll ? (
          <div className="space-y-6 text-center animate-in fade-in">
            {/* Header info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Step {currentStepIndex + 1} of {POST_SALLAH_AZKAR_STEPS.length}: {currentStep.name}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Recite Post-{prayerName} Azkar to Unlock App
              </h2>
              <p className="text-xs text-stone-400 max-w-md mx-auto mt-1">
                "Whoever glorifies Allah after every prayer, his sins will be forgiven even if like the foam of the sea."
              </p>
            </div>

            {/* Stepper Dots Indicator */}
            <div className="flex justify-center items-center gap-1.5">
              {POST_SALLAH_AZKAR_STEPS.map((step, idx) => {
                const isPast = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={step.id}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'w-8 bg-emerald-400'
                        : isPast
                        ? 'w-3 bg-emerald-600'
                        : 'w-3 bg-stone-800'
                    }`}
                  />
                );
              })}
            </div>

            {/* Arabic Script & Transliteration Display Box */}
            <div className="bg-stone-900/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Step indicator header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800/80 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {currentStep.name}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold">
                  {currentCount} / {currentStep.requiredCount} completed
                </span>
              </div>

              {/* 1. ARABIC TEXT (Prominent Display) */}
              <div className="my-3 text-center" dir="rtl">
                <div
                  className="text-2xl sm:text-4xl font-serif text-emerald-200 font-bold leading-loose tracking-wide select-none p-3 rounded-2xl bg-stone-950/60 border border-emerald-500/20"
                  style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
                >
                  {currentStep.arabic}
                </div>
              </div>

              {/* 2. TRANSLITERATION (Directly follows below the Arabic text) */}
              <div className="mt-3.5 p-3.5 bg-stone-950/90 border border-emerald-500/30 rounded-2xl text-left space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Transliteration</span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-stone-100 tracking-wide leading-relaxed font-sans">
                  {currentStep.transliteration}
                </p>
              </div>

              {/* 3. ENGLISH TRANSLATION */}
              <div className="mt-3 p-3.5 bg-stone-950/60 border border-stone-800 rounded-2xl text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Translation & Meaning
                </span>
                <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                  "{currentStep.translation}"
                </p>
              </div>

              {/* 4. Hadith Virtue Callout */}
              <div className="mt-3.5 pt-3 border-t border-stone-800/80 text-left bg-stone-950/70 p-3 rounded-2xl border border-stone-800">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Spiritual Virtue & Hadith:</span>
                </div>
                <p className="text-xs text-stone-300 mt-1">{currentStep.virtue}</p>
                <div className="text-[10px] font-mono text-emerald-400/80 mt-1">
                  Source: {currentStep.hadithSource}
                </div>
              </div>
            </div>

            {/* Giant Circular Click Target Counter */}
            <div className="flex flex-col items-center justify-center my-4">
              <button
                id="post-sallah-tasbih-clicker"
                onClick={handleCountIncrement}
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-emerald-500/50 bg-gradient-to-b from-stone-900 to-stone-950 hover:from-stone-900 hover:to-emerald-950/50 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-2xl shadow-emerald-950 relative group"
              >
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
                  Tap to Count
                </span>
                <span className="text-5xl sm:text-6xl font-extrabold font-mono text-white mt-1 group-hover:scale-105 transition-transform">
                  {currentCount}
                </span>
                <span className="text-xs font-mono text-stone-400 mt-1">
                  Required: {currentStep.requiredCount}
                </span>

                <div className="absolute inset-0 rounded-full pointer-events-none border-2 border-dashed border-emerald-500/20 group-hover:border-emerald-400/40 transition" />
              </button>

              <p className="text-[11px] text-stone-400 mt-3">
                Tap the circle repeatedly until the count is complete to unlock the next Azkar
              </p>
            </div>
          </div>
        ) : (
          /* All Azkar Finished Celebration Screen */
          <div className="bg-stone-900/90 border border-emerald-500/50 rounded-3xl p-6 sm:p-10 text-center shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-300 shadow-xl shadow-emerald-950 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                TAQABBAL ALLAH (MAY ALLAH ACCEPT)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Post-Sallah Azkar Completed!
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-md mx-auto leading-relaxed">
                You have fulfilled the Sunnah of the Prophet Muhammad ﷺ by completing your post-prayer remembrances and glorifications.
                The application and all phone distractions are now unlocked.
              </p>
            </div>

            {/* Virtues achieved badge */}
            <div className="p-4 bg-stone-950/80 border border-emerald-500/30 rounded-2xl text-xs text-stone-300 space-y-2 text-left max-w-lg mx-auto">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Recorded in Your Witness Ledger:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-stone-300 text-xs">
                <li>3x Istighfar & Salam supplication</li>
                <li>1x Tahlil after Salam declaring Allah's sovereignty</li>
                <li>33x SubhanAllah, 33x Alhamdulillah, 33x Allahu Akbar</li>
                <li>1x Tawheed 100th seal (Forgiveness of sins like sea foam)</li>
                <li>1x Ayat al-Kursi with full transliteration & translation</li>
                <li>1x Supplication for Remembrance & Excellence in Worship</li>
              </ul>
            </div>

            {/* Final Unlock Action Button */}
            <button
              id="unlock-app-final-btn"
              onClick={handleUnlockApp}
              className="w-full max-w-md py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-950 mx-auto active:scale-95"
            >
              <Unlock className="w-5 h-5" />
              <span>Enter Unlocked Sallah Mate App</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Emergency Release / Traveler Bypass */}
      <div className="p-4 border-t border-stone-800 bg-stone-950/90 flex items-center justify-between text-xs text-stone-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sacred Sallah Sanctuary Protection</span>
        </div>

        <div>
          {!showEmergencyConfirm ? (
            <button
              onClick={() => setShowEmergencyConfirm(true)}
              className="text-stone-400 hover:text-amber-300 underline decoration-stone-600 transition"
              title="Urgent emergency override"
            >
              Emergency / Traveler Bypass
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-amber-400 text-[11px]">Bypass post-prayer Azkar?</span>
              <button
                onClick={() => {
                  onEmergencyBypass ? onEmergencyBypass() : onUnlocked();
                }}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold text-[11px]"
              >
                Yes, Bypass
              </button>
              <button
                onClick={() => setShowEmergencyConfirm(false)}
                className="px-2 py-1 bg-stone-900 text-stone-300 rounded text-[11px]"
              >
                Stay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
