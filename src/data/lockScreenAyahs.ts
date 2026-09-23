export interface LockScreenAyah {
  id: string;
  surahName: string;
  surahArabic: string;
  verseRef: string;
  theme: 'purpose' | 'dunya' | 'iman' | 'allah';
  themeLabel: string;
  arabic: string;
  transliteration: string;
  translation: string;
  writeup: string;
  audioUrl?: string;
}

export const LOCK_SCREEN_AYAHS: LockScreenAyah[] = [
  {
    id: 'purpose-worship-51-56',
    surahName: 'Adh-Dhariyat',
    surahArabic: 'سُورَةُ الذَّارِيَات',
    verseRef: '51:56',
    theme: 'purpose',
    themeLabel: 'The Ultimate Purpose of Life',
    arabic: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
    transliteration: 'Wa mā khalaqtul-jinna wal-insa illā liya‘budūn',
    translation: '“And I did not create jinn and mankind except to worship Me.”',
    writeup:
      'Every breath in this Dunya is temporary. Your ultimate purpose, honor, and inner peace lie in sincere devotion, prayer, and submission to your Creator.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4731.mp3',
  },
  {
    id: 'dunya-test-67-2',
    surahName: 'Al-Mulk',
    surahArabic: 'سُورَةُ المُلْك',
    verseRef: '67:2',
    theme: 'purpose',
    themeLabel: 'The Test of Deeds',
    arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
    transliteration:
      'Alladhī khalaqal-mawta wal-ḥayāta liyabluwakum ayyukum aḥsanu ‘amalā, wa Huwal-‘Azīzul-Ghafūr',
    translation:
      '“He who created death and life to test you as to which of you is best in deeds—and He is the Almighty, the All-Forgiving.”',
    writeup:
      'This worldly life is not a permanent residence, but an examination hall. Guard your prayers, purify your intentions, and prepare for your eternal home.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5243.mp3',
  },
  {
    id: 'dunya-illusion-57-20',
    surahName: 'Al-Hadid',
    surahArabic: 'سُورَةُ الحَدِيد',
    verseRef: '57:20',
    theme: 'dunya',
    themeLabel: 'Reality of the World (Dunya)',
    arabic: 'اعْلَمُوا أَنَّمَا الْحَيَاةُ الدُّنْيَا لَعِبٌ وَلَهْوٌ وَزِينَةٌ وَتَفَاخُرٌ بَيْنَكُمْ وَتَكَاثُرٌ فِي الْأَمْوَالِ وَالْأَوْلَادِ ۖ ... وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ',
    transliteration:
      'I‘lamū annamal-ḥayātud-dunyā la‘ibunw-wa lahwunw-wa zīnatunw-wa tafākhurum-baynakum wa takāthurun fil-amwāli wal-awlād... wa mal-ḥayātud-dunyā illā matā‘ul-ghurūr',
    translation:
      '“Know that the life of this world is but amusement and diversion, ornament and mutual boasting among you, and rivalry in increase of wealth and children... And what is the life of this world except the enjoyment of delusion.”',
    writeup:
      'Do not let the temporary shine of this dunya distract you from the eternal reality of the Akhirah. What you send forward in prayers and good deeds is what truly remains.',
  },
  {
    id: 'allah-remember-me-2-152',
    surahName: 'Al-Baqarah',
    surahArabic: 'سُورَةُ البَقَرَة',
    verseRef: '2:152',
    theme: 'allah',
    themeLabel: 'Remembrance of Allah',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    transliteration: 'Fadhkurūnī adhkurkum washkurū lī wa lā takfurūn',
    translation: '“So remember Me; I will remember you. And be grateful to Me and do not deny Me.”',
    writeup:
      'When you remember Allah in private or amidst public distraction, the Sovereign of the Heavens and Earth remembers you by name before the noblest company of angels.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/159.mp3',
  },
  {
    id: 'iman-hearts-rest-13-28',
    surahName: "Ar-Ra'd",
    surahArabic: 'سُورَةُ الرَّعْد',
    verseRef: '13:28',
    theme: 'iman',
    themeLabel: 'Peace of the Believer',
    arabic: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    transliteration:
      'Alladhīna āmanū wa taṭma’innu qulūbuhum bidhikrillāh, alā bidhikrillāhi taṭma’innul-qulūb',
    translation:
      '“Those who believe and whose hearts find rest in the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts find peace.”',
    writeup:
      'No worldly possession, status, or smartphone screen can heal anxiety like turning your face toward the Qibla and pouring your heart in Sujud to Allah.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1735.mp3',
  },
  {
    id: 'purpose-entire-life-6-162',
    surahName: "Al-An'am",
    surahArabic: 'سُورَةُ الأَنْعَام',
    verseRef: '6:162',
    theme: 'purpose',
    themeLabel: 'Dedication of Existence',
    arabic: 'قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ',
    transliteration: 'Qul inna ṣalātī wa nusukī wa maḥyāya wa mamātī lillāhi Rabbil-‘ālamīn',
    translation:
      '“Say, ‘Indeed, my prayer, my rites of sacrifice, my living and my dying are all for Allah, Lord of all worlds.’”',
    writeup:
      'Live every hour with intention. Turn even your daily work, your studies, your kindness to family, and your sleep into worship through sincere devotion to Allah.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/951.mp3',
  },
  {
    id: 'iman-nearness-2-186',
    surahName: 'Al-Baqarah',
    surahArabic: 'سُورَةُ البَقَرَة',
    verseRef: '2:186',
    theme: 'iman',
    themeLabel: 'Allah is Ever Near',
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    transliteration: 'Wa idhā sa’alaka ‘ibādī ‘annī fa-innī qarīb, ujību da‘watad-dā‘i idhā da‘ān',
    translation:
      '“And when My servants ask you concerning Me, indeed I am near. I respond to the call of the caller when he calls upon Me.”',
    writeup:
      'You are never alone. Allah hears the unspoken whisper of your heart before you even utter the words. Raise your hands in Du’a with complete certitude.',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/193.mp3',
  },
  {
    id: 'dunya-transient-10-24',
    surahName: 'Yunus',
    surahArabic: 'سُورَةُ يُونُس',
    verseRef: '10:24',
    theme: 'dunya',
    themeLabel: 'The Vanishing Season',
    arabic: 'إِنَّمَا مَثَلُ الْحَيَاةِ الدُّنْيَا كَمَاءٍ أَنزَلْنَاهُ مِنَ السَّمَاءِ فَاخْتَلَطَ بِهِ نَبَاتُ الْأَرْضِ ... كَأَن لَّمْ تَغْنَ بِالْأَمْسِ ۚ كَذَٰلِكَ نُفَصِّلُ الْآيَاتِ لِقَوْمٍ يَتَفَكَّرُونَ',
    transliteration:
      'Innamā mathalul-ḥayātid-dunyā kamā’in anzalnāhu minas-samā’i fakhtalaṭa bihī nabātul-arḍ... kadhālika nufaṣṣilul-āyāti liqawminy-yatafakkarūn',
    translation:
      '“The example of worldly life is merely like rain which We send down from the sky... until it becomes as if it had not flourished just yesterday. Thus do We explain in detail the signs for a people who give thought.”',
    writeup:
      'Beauty fades, strength departs, and time slips like sand. Anchor your soul to that which never dies: your faith in Allah and your righteous deeds.',
  },
  {
    id: 'iman-tawakkul-65-3',
    surahName: 'At-Talaq',
    surahArabic: 'سُورَةُ الطَّلَاق',
    verseRef: '65:3',
    theme: 'iman',
    themeLabel: 'Reliance on Allah (Tawakkul)',
    arabic: 'وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ',
    transliteration:
      'Wa yarzuqhu min ḥaythu lā yaḥtasib, wa many-yatawakkal ‘alallāhi fahuwa ḥasbuh, innallāha bālighu amrih',
    translation:
      '“And He will provide for him from where he does not expect. And whoever relies upon Allah—then He is sufficient for him. Indeed, Allah will accomplish His purpose.”',
    writeup:
      'Relieve your mind of anxiety over tomorrow. Do your best, fulfill your prayers, and place your absolute trust in Al-Wakil (The Ultimate Trustee).',
  },
  {
    id: 'purpose-accountability-23-115',
    surahName: "Al-Mu'minun",
    surahArabic: 'سُورَةُ المُؤْمِنُون',
    verseRef: '23:115',
    theme: 'purpose',
    themeLabel: 'Created with Solemn Purpose',
    arabic: 'أَفَحَسِبْتُمْ أَنَّمَا خَلَقْنَاكُمْ عَبَثًا وَأَنَّكُمْ إِلَيْنَا لَا تُرْجَعُونَ',
    transliteration:
      'Afaḥasibtum annamā khalaqnākum ‘abathanw-wa annakum ilaynā lā turja‘ūn',
    translation:
      '“Did you then think that We created you uselessly and that to Us you would not be returned?”',
    writeup:
      'You were not placed on this earth by accident or for aimless amusement. Every hour holds value. Make your life count in the scales of eternity.',
  },
  {
    id: 'allah-mercy-39-53',
    surahName: 'Az-Zumar',
    surahArabic: 'سُورَةُ الزُّمَر',
    verseRef: '39:53',
    theme: 'allah',
    themeLabel: 'Boundless Divine Mercy',
    arabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ',
    transliteration:
      'Qul yā ‘ibādiyal-ladhīna asrafū ‘alā anfusihim lā taqnaṭū mir-raḥmatillāh, innallāha yaghfirudh-dhunūba jamī‘ā, innahū Huwal-Ghafūrur-Raḥīm',
    translation:
      '“Say, ‘O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.’”',
    writeup:
      'Never allow Shaytan to convince you that your mistakes are too great for Allah’s mercy. Turn back to Him right now in sincere repentance—His door is always open.',
  },
  {
    id: 'iman-time-103-1',
    surahName: 'Al-Asr',
    surahArabic: 'سُورَةُ العَصْر',
    verseRef: '103:1-3',
    theme: 'iman',
    themeLabel: 'The Loss of Time & Salvation',
    arabic: 'وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
    transliteration:
      'Wal-‘aṣr. Innal-insāna lafī khusr. Illal-ladhīna āmanū wa ‘amiluṣ-ṣāliḥāti wa tawāṣaw bil-ḥaqqi wa tawāṣaw biṣ-ṣabr',
    translation:
      '“By time, indeed mankind is in loss, except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.”',
    writeup:
      'Time is your most precious capital in this Dunya. Guard it with Iman, righteous actions, standing for truth, and steadfast perseverance.',
  },
];
