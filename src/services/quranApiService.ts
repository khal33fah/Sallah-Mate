import { QuranSurah, QuranAyah } from '../types';
import { ALL_114_SURAHS, SurahMeta } from '../data/quran114Chapters';
import { QURAN_SURAHS as OFFLINE_PRELOADED_SURAHS } from '../data/quranData';

const CACHE_PREFIX = 'sallah_quran_cache_surah_';

// In-memory cache for fast session access
const memoryCache = new Map<number, QuranAyah[]>();

// Initialize memory cache with the pre-bundled offline Surahs
OFFLINE_PRELOADED_SURAHS.forEach((s) => {
  if (s.ayahs && s.ayahs.length > 0) {
    memoryCache.set(s.number, s.ayahs);
  }
});

/**
 * Retrieves Surah metadata for any of the 114 Surahs
 */
export function getSurahMeta(surahNumber: number): SurahMeta | undefined {
  return ALL_114_SURAHS.find((s) => s.number === surahNumber);
}

/**
 * Returns complete surah representation with ayahs.
 * Checks memory cache -> localStorage cache -> network API -> fallback.
 */
export async function getSurahWithAyahs(
  surahNumber: number,
  onProgress?: (status: string) => void
): Promise<QuranSurah> {
  const meta = getSurahMeta(surahNumber) || ALL_114_SURAHS[0];

  // 1. Check in-memory cache
  if (memoryCache.has(surahNumber)) {
    const ayahs = memoryCache.get(surahNumber)!;
    return {
      ...meta,
      ayahs,
    };
  }

  // 2. Check localStorage cache
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${surahNumber}`);
    if (cached) {
      const parsed: QuranAyah[] = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache.set(surahNumber, parsed);
        return {
          ...meta,
          ayahs: parsed,
        };
      }
    }
  } catch (e) {
    console.warn('Could not read from local storage Quran cache', e);
  }

  // 3. Fetch from Quran API (api.alquran.cloud)
  if (onProgress) onProgress('Loading Uthmanic text & translation...');
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`
    );

    if (res.ok) {
      const json = await res.json();
      if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
        const arabicData = json.data[0];
        const translationData = json.data[1];

        const ayahs: QuranAyah[] = arabicData.ayahs.map((arabicAyah: any, idx: number) => {
          const trans = translationData.ayahs[idx]?.text || '';
          return {
            numberInSurah: arabicAyah.numberInSurah,
            arabic: arabicAyah.text,
            translation: trans,
            audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${arabicAyah.number}.mp3`,
          };
        });

        // Save to cache
        memoryCache.set(surahNumber, ayahs);
        try {
          localStorage.setItem(`${CACHE_PREFIX}${surahNumber}`, JSON.stringify(ayahs));
        } catch {
          // LocalStorage might be full, safe to ignore
        }

        return {
          ...meta,
          ayahs,
        };
      }
    }
  } catch (err) {
    console.warn(`Network fetch for Surah ${surahNumber} failed, using fallback`, err);
  }

  // 4. If offline or fetch failed, check if we have any preloaded offline copy
  const preloaded = OFFLINE_PRELOADED_SURAHS.find((s) => s.number === surahNumber);
  if (preloaded && preloaded.ayahs.length > 0) {
    return preloaded;
  }

  // 5. Basic fallback for first verse / Basmalah
  const fallbackAyahs: QuranAyah[] = [
    {
      numberInSurah: 1,
      arabic:
        surahNumber === 9
          ? 'بَرَاءَةٌ مِّنَ اللَّهِ وَرَسُولِهِ إِلَى الَّذِينَ عَاهَدتُّم مِّنَ الْمُشْرِكِينَ'
          : 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration:
        surahNumber === 9
          ? 'Bara-atun minallahi wa rasulih'
          : 'Bismillāhir-Raḥmānir-Raḥīm',
      translation:
        surahNumber === 9
          ? '[This is a declaration of] disassociation from Allah and His Messenger to those with whom you had made a treaty among the polytheists.'
          : 'In the Name of Allah—the Most Compassionate, Most Merciful.',
      audioUrl: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${String(
        surahNumber
      ).padStart(3, '0')}.mp3`,
    },
  ];

  return {
    ...meta,
    ayahs: fallbackAyahs,
  };
}
