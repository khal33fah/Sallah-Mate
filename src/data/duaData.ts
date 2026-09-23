import { DuaItem, PrayerName } from '../types';

export const PRAYER_DUAS_DATA: DuaItem[] = [
  // ==========================================
  // PRE-SALLAH SUPPLICATIONS (Across all prayers)
  // ==========================================
  {
    id: 'pre-adhan-response',
    title: 'Dua When Hearing the Adhan',
    prayerTiming: 'Any',
    phase: 'pre',
    arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    transliteration: "Allahumma Rabba hadhihid-da'watit-tammah, was-salatil-qa'imah, ati Muhammadanil-wasilata wal-fadilah, wab'ath-hu maqamam mahmudanilladhi wa'adtah.",
    translation: "O Allah, Lord of this perfect call and established prayer, grant Muhammad the Wasilah (highest rank in Jannah) and virtue, and resurrect him to the praised station which You have promised him.",
    source: 'Sahih al-Bukhari 614',
    virtue: 'Intercession of Prophet Muhammad ﷺ is guaranteed on the Day of Resurrection for whoever recites this after the Adhan.',
    recommendedCount: 1,
    occasion: 'Immediately after the Adhan finishes, after sending Salawat on the Prophet ﷺ',
    tags: ['adhan', 'sunnah', 'intercession', 'forgiveness']
  },
  {
    id: 'pre-adhan-iqamah-interim',
    title: 'Supplication Between Adhan and Iqamah',
    prayerTiming: 'Any',
    phase: 'pre',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
    transliteration: "Allahumma inni as'alukal-'afwa wal-'afiyata fid-dunya wal-akhirah.",
    translation: "O Allah, I ask You for pardon and well-being in this worldly life and in the Hereafter.",
    source: 'Sunan Abi Dawud 521, Jami` at-Tirmidhi 3594',
    virtue: 'The Prophet ﷺ said: "Supplication made between the Adhan and the Iqamah is not rejected." (At-Tirmidhi 212)',
    recommendedCount: 1,
    occasion: 'In the sacred window between the Adhan and the Iqamah before starting prayer',
    tags: ['acceptance', 'golden-hour', 'wellbeing', 'iqamah']
  },
  {
    id: 'pre-entering-masjid',
    title: 'Dua When Entering the Mosque / Prayer Space',
    prayerTiming: 'Any',
    phase: 'pre',
    arabic: 'بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: "Bismillahi, was-salatu was-salamu 'ala Rasulillah. Allahummaftah li abwaba rahmatik.",
    translation: "In the name of Allah, and peace and blessings be upon the Messenger of Allah. O Allah, open for me the doors of Your mercy.",
    source: 'Sahih Muslim 713',
    virtue: 'Steps toward the masjid wipe away sins and raise spiritual degrees, entering with right foot.',
    recommendedCount: 1,
    occasion: 'When entering the Masjid or walking onto your clean prayer rug',
    tags: ['masjid', 'mercy', 'worship', 'focus']
  },
  {
    id: 'pre-wudu-completion',
    title: 'Dua After Completing Wudu (Ablution)',
    prayerTiming: 'Any',
    phase: 'pre',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ، وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    transliteration: "Ash-hadu alla ilaha illallahu wahdahu la sharika lah, wa ash-hadu anna Muhammadan 'abduhu wa Rasuluh. Allahummaj'alni minat-tawwabina waj'alni minal-mutatahhireen.",
    translation: "I bear witness that none has the right to be worshipped but Allah alone with no partner, and that Muhammad is His slave and Messenger. O Allah, make me among those who constantly repent and make me among those who purify themselves.",
    source: 'Sahih Muslim 234, Jami` at-Tirmidhi 55',
    virtue: 'All eight gates of Paradise are opened for the one who says this, and they may enter through whichever gate they choose.',
    recommendedCount: 1,
    occasion: 'Directly after finishing the ablution before beginning prayer',
    tags: ['wudu', 'purification', 'paradise', 'cleanliness']
  },
  {
    id: 'during-opening-istiftah',
    title: 'Dua al-Istiftah (The Opening Supplication)',
    prayerTiming: 'Any',
    phase: 'pre',
    arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالثَّلْجِ وَالْمَاءِ وَالْبَرَدِ',
    transliteration: "Allahumma ba'id bayni wa bayna khatayaya kama ba'adta baynal-mashriqi wal-maghrib. Allahumma naqqini min khatayaya kama yunaqqath-thawbul-abyadu minad-danas. Allahummagh-silni min khatayaya bith-thalji wal-ma'i wal-barad.",
    translation: "O Allah, distance me from my sins as You have distanced the East from the West. O Allah, purify me of my sins as a white garment is cleansed of dirt. O Allah, wash away my sins with snow, water, and hail.",
    source: 'Sahih al-Bukhari 744, Sahih Muslim 598',
    virtue: 'Recited silently after Takbirat al-Ihram before Surah Al-Fatiha; purifies the heart and enters with profound Khushu.',
    recommendedCount: 1,
    occasion: 'Immediately after the opening Takbir before reciting Surah Al-Fatiha',
    tags: ['khushu', 'opening', 'forgiveness', 'purification']
  },

  // ==========================================
  // SPECIFIC FOR FAJR (Dawn Prayer)
  // ==========================================
  {
    id: 'fajr-pre-protection',
    title: 'Prophetic Protection Supplication at Fajr Dawn',
    prayerTiming: 'Fajr',
    phase: 'pre',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadeer.",
    translation: "We have reached the morning and the kingdom belongs to Allah, and all praise is due to Allah. None has the right to be worshipped but Allah alone with no partner. His is the kingdom and His is the praise, and He is over all things capable.",
    source: 'Sahih Muslim 2723',
    virtue: 'Provides complete divine protection, light in the soul, and safety through the morning hours.',
    recommendedCount: 1,
    occasion: 'At dawn before or right after the Fajr Sunnah prayer',
    tags: ['morning', 'fajr', 'protection', 'barakah']
  },
  {
    id: 'fajr-qunut-guidance',
    title: 'Dua al-Qunut for Fajr / Witr',
    prayerTiming: 'Fajr',
    phase: 'during',
    arabic: 'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ',
    transliteration: "Allahummahdini feeman hadayt, wa 'afini feeman 'afayt, wa tawallani feeman tawallayt, wa barik li feema a'tayt, wa qini sharra ma qadayt, fa innaka taqdi wa la yuqda 'alayk, wa innahu la yadhillu man walayt, wa la ya'izzu man 'adayt, tabarakta Rabbana wa ta'alayt.",
    translation: "O Allah, guide me among those You have guided, grant me well-being among those You have granted well-being, take me into Your care among those You have taken into care, bless me in what You have given, and shield me from the evil of what You have decreed. For indeed You decree and none can decree over You. He whom You hold as ally is never humiliated, and he whom You oppose is never honored. Blessed are You, our Lord, and Exalted.",
    source: 'Sunan Abi Dawud 1425, Jami` at-Tirmidhi 464',
    virtue: 'Taught by the Prophet ﷺ to his grandson Al-Hasan (RA); encompasses every form of guidance and safeguarding.',
    recommendedCount: 1,
    occasion: 'During Qunut in Fajr (Shāfi‘ī/Mālikī) or in the standing after Ruku in Witr',
    tags: ['qunut', 'guidance', 'protection', 'blessing']
  },
  {
    id: 'fajr-post-knowledge-rizq',
    title: 'Supplication for Beneficial Knowledge & Pure Provision',
    prayerTiming: 'Fajr',
    phase: 'post',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    transliteration: "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.",
    translation: "O Allah, I ask You for beneficial knowledge, wholesome pure provision, and deeds that are accepted.",
    source: 'Sunan Ibn Majah 925, Musnad Ahmad 26521 (Umm Salamah)',
    virtue: 'Recited by the Prophet ﷺ every single morning immediately after saying the Salam of Fajr.',
    recommendedCount: 1,
    occasion: 'Immediately after the final Salam of Fajr prayer',
    tags: ['fajr', 'rizq', 'knowledge', 'acceptance', 'morning']
  },
  {
    id: 'fajr-post-shield-hellfire',
    title: 'The Sevenfold Shield from Hellfire at Fajr',
    prayerTiming: 'Fajr',
    phase: 'post',
    arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ',
    transliteration: "Allahumma ajirni minan-nar.",
    translation: "O Allah, protect and save me from the Fire.",
    source: 'Sunan Abi Dawud 5079, Musnad Ahmad',
    virtue: 'Whoever recites this 7 times after Fajr before speaking to anyone, if they die that day, Allah decrees for them protection from Hellfire.',
    recommendedCount: 7,
    occasion: 'Directly after Salam of Fajr, before engaging in any worldly speech',
    tags: ['fajr', 'protection', 'hellfire', 'safety']
  },

  // ==========================================
  // SPECIFIC FOR DHUHR (Midday Prayer)
  // ==========================================
  {
    id: 'dhuhr-pre-doors-heaven',
    title: 'Dua for the Opening of Heavenly Gates at Dhuhr',
    prayerTiming: 'Dhuhr',
    phase: 'pre',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ، فَإِنَّهُ لَا يَمْلِكُهَا إِلَّا أَنْتَ',
    transliteration: "Allahumma inni as'aluka min fadlika wa rahmatik, fa innahu la yamlikuha illa Ant.",
    translation: "O Allah, I ask You from Your bounty and Your mercy, for indeed none possesses them except You.",
    source: 'At-Tabarani (Al-Mu’jam al-Kabir 10379), Sahih al-Jami 1278',
    virtue: 'The Prophet ﷺ said: "The gates of the heavens are opened when the sun declines at Dhuhr, and I love that a righteous deed of mine ascends at that time." (Tirmidhi 478)',
    recommendedCount: 1,
    occasion: 'Right before the 4 Sunnah rakahs of Dhuhr when the sun passes zenith',
    tags: ['dhuhr', 'mercy', 'bounty', 'heaven-doors']
  },
  {
    id: 'dhuhr-during-sujud-humility',
    title: 'Supplication for Forgiveness of All Sins in Sujud',
    prayerTiming: 'Dhuhr',
    phase: 'during',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ',
    transliteration: "Allahummagh-fir li dhanbi kullahu, diqqahu wa jillahu, wa awwalahu wa akhirahu, wa 'alaniyatahu wa sirrah.",
    translation: "O Allah, forgive me all my sins: the minor and the major, the first and the last, the open and the secret.",
    source: 'Sahih Muslim 483',
    virtue: 'A comprehensive prophetic Dua in prostration, erasing every past slip while closest to Allah.',
    recommendedCount: 1,
    occasion: 'During Sujud (prostration) in Dhuhr',
    tags: ['sujud', 'forgiveness', 'repentance', 'dhuhr']
  },
  {
    id: 'dhuhr-post-steady-heart',
    title: 'Supplication for Steadfastness in Faith After Dhuhr',
    prayerTiming: 'Dhuhr',
    phase: 'post',
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    transliteration: "Ya Muqallibal-quloobi thabbit qalbi 'ala deenik.",
    translation: "O Turner of the hearts, make my heart firm upon Your religion.",
    source: 'Jami` at-Tirmidhi 2140',
    virtue: 'The most frequent supplication made by the Prophet ﷺ; protects from spiritual drift amidst midday worldly busyness.',
    recommendedCount: 3,
    occasion: 'After concluding the Dhuhr prayer and Sunnah',
    tags: ['firmness', 'heart', 'dhuhr', 'faith']
  },

  // ==========================================
  // SPECIFIC FOR ASR (The Middle Prayer)
  // ==========================================
  {
    id: 'asr-pre-guarding-prayer',
    title: 'Supplication for Preserving the Middle Prayer (Asr)',
    prayerTiming: 'Asr',
    phase: 'pre',
    arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    transliteration: "Rabbij'alni muqeemas-salati wa min dhurriyyati, Rabbana wa taqabbal du'a'.",
    translation: "My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication.",
    source: 'Surah Ibrahim 14:40',
    virtue: 'Guards the vital "Salat al-Wusta" (Middle Prayer), concerning which Allah specifically commanded vigilance in Surah Al-Baqarah 2:238.',
    recommendedCount: 1,
    occasion: 'Before entering the Asr prayer to renew focus',
    tags: ['asr', 'middle-prayer', 'family', 'vigilance']
  },
  {
    id: 'asr-during-ruku-praise',
    title: 'Exalted Praise in Ruku & Sujud',
    prayerTiming: 'Asr',
    phase: 'during',
    arabic: 'سُبُّوحٌ قُدُّوسٌ، رَبُّ الْمَلَائِكَةِ وَالرُّوحِ',
    transliteration: "Subbuhun Quddusun, Rabbul-mala'ikati war-Rooh.",
    translation: "All-Glorious, All-Holy, Lord of the angels and of the Spirit (Jibril).",
    source: 'Sahih Muslim 487',
    virtue: 'Recited by the Prophet ﷺ in bowing and prostration; fills the scales with pure glorification.',
    recommendedCount: 1,
    occasion: 'During Ruku or Sujud in Asr',
    tags: ['ruku', 'sujud', 'glorification', 'angels']
  },
  {
    id: 'asr-post-repentance',
    title: 'Prophetic Repentance Before the Sun Sets',
    prayerTiming: 'Asr',
    phase: 'post',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، وَأَتُوبُ إِلَيْهِ',
    transliteration: "Astaghfirullahal-'Adheemal-ladhi la ilaha illa Huwal-Hayyul-Qayyumu wa atoobu ilayh.",
    translation: "I seek the forgiveness of Allah the Almighty, whom none has the right to be worshipped except Him, the Ever-Living, the Sustainer of all existence, and I turn to Him in repentance.",
    source: 'Sunan Abi Dawud 1517, Jami` at-Tirmidhi 3577',
    virtue: 'The Prophet ﷺ said: "Whoever says this, his sins are forgiven even if he had fled from battle." (Abu Dawud)',
    recommendedCount: 3,
    occasion: 'After concluding Asr before the evening comes',
    tags: ['asr', 'istighfar', 'forgiveness', 'salvation']
  },

  // ==========================================
  // SPECIFIC FOR MAGHRIB (Sunset Prayer)
  // ==========================================
  {
    id: 'maghrib-pre-sunset-dua',
    title: 'Supplication at Sunset / Before Maghrib',
    prayerTiming: 'Maghrib',
    phase: 'pre',
    arabic: 'اللَّهُمَّ هَذَا إِقْبَالُ لَيْلِكَ، وَإِدْبَارُ نَهَارِكَ، وَأَصْوَاتُ دُعَاتِكَ، فَاغْفِرْ لِي',
    transliteration: "Allahumma hadha iqbalu laylik, wa idbaru naharik, wa aswatu du'atik, fagh-fir li.",
    translation: "O Allah, this is the approach of Your night, the departure of Your day, and the calling voices of Your summoners, so forgive me.",
    source: 'Sunan Abi Dawud 530, Jami` at-Tirmidhi 3589',
    virtue: 'Taught by the Prophet ﷺ to Umm Salamah (RA) to recite when hearing the Adhan of Maghrib.',
    recommendedCount: 1,
    occasion: 'At the call to prayer of Maghrib as the sun dips below the horizon',
    tags: ['maghrib', 'sunset', 'forgiveness', 'nightfall']
  },
  {
    id: 'maghrib-post-tenfold-protection',
    title: 'The Tenfold Testimony of Tawhid After Maghrib',
    prayerTiming: 'Maghrib',
    phase: 'post',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu, yuhyee wa yumeetu, wa Huwa 'ala kulli shay'in Qadeer.",
    translation: "None has the right to be worshipped but Allah alone with no partner. His is the dominion and His is the praise; He gives life and causes death, and He is over all things capable.",
    source: 'Jami` at-Tirmidhi 3534, Musnad Ahmad',
    virtue: 'Recited 10 times after Maghrib: Allah sends armed angels to guard the reciter from Shaytan until morning, writes 10 good deeds, and erases 10 major sins.',
    recommendedCount: 10,
    occasion: 'Immediately after the Salam of Maghrib before moving legs from sitting posture',
    tags: ['maghrib', 'protection', 'tawhid', 'angels', 'night-shield']
  },
  {
    id: 'maghrib-post-shield-hellfire',
    title: 'The Sevenfold Evening Shield from Hellfire',
    prayerTiming: 'Maghrib',
    phase: 'post',
    arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ',
    transliteration: "Allahumma ajirni minan-nar.",
    translation: "O Allah, protect and save me from the Fire.",
    source: 'Sunan Abi Dawud 5079',
    virtue: 'If recited 7 times after Maghrib, protection from the Fire is guaranteed if death occurs that night.',
    recommendedCount: 7,
    occasion: 'After concluding the Maghrib prayer',
    tags: ['maghrib', 'hellfire', 'protection', 'safety']
  },

  // ==========================================
  // SPECIFIC FOR ISHA (Night Prayer)
  // ==========================================
  {
    id: 'isha-pre-night-safety',
    title: 'Seeking Complete Protection for the Night Ahead',
    prayerTiming: 'Isha',
    phase: 'pre',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'oodhu bi kalimatil-lahit-tammati min sharri ma khalaq.",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    source: 'Sahih Muslim 2709',
    virtue: 'Whoever recites this in the evening will not be harmed by any poison, venom, scorpion, or evil that night.',
    recommendedCount: 3,
    occasion: 'Before the Isha prayer as twilight fades',
    tags: ['isha', 'protection', 'evil-eye', 'refuge']
  },
  {
    id: 'during-tashahhud-four-refuges',
    title: 'Dua Before Salam (Refuge from Four Calamities)',
    prayerTiming: 'Isha',
    phase: 'during',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
    transliteration: "Allahumma inni a'oodhu bika min 'adhabi jahannam, wa min 'adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-Maseehid-Dajjal.",
    translation: "O Allah, I seek refuge in You from the torment of Hellfire, from the torment of the grave, from the trials of life and death, and from the evil trial of the False Messiah (Dajjal).",
    source: 'Sahih al-Bukhari 1377, Sahih Muslim 588',
    virtue: 'The Prophet ﷺ taught this to be recited after the final Tashahhud and Salawat, right before giving the Tasleem.',
    recommendedCount: 1,
    occasion: 'At the end of Tashahhud right before making Tasleem (Salam)',
    tags: ['tashahhud', 'salam', 'protection', 'grave', 'dajjal']
  },
  {
    id: 'isha-post-light-in-heart',
    title: 'Supplication for Divine Light in the Soul and Limbs',
    prayerTiming: 'Isha',
    phase: 'post',
    arabic: 'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي بَصَرِي نُورًا، وَفِي سَمْعِي نُورًا، وَعَنْ يَمِينِي نُورًا، وَعَنْ يَسَارِي نُورًا، وَفَوْقِي نُورًا، وَتَحْتِي نُورًا، وَأَمَامِي نُورًا، وَخَلْفِي نُورًا، وَاجْعَلْ لِي نُورًا',
    transliteration: "Allahummaj'al fee qalbi noora, wa fee basari noora, wa fee sam'i noora, wa 'an yameeni noora, wa 'an yasari noora, wa fawqi noora, wa tahti noora, wa amami noora, wa khalfi noora, waj'al li noora.",
    translation: "O Allah, place light in my heart, light in my sight, light in my hearing, light on my right, light on my left, light above me, light below me, light before me, light behind me, and bestow light upon me.",
    source: 'Sahih al-Bukhari 6316, Sahih Muslim 763',
    virtue: 'Recited by the Prophet ﷺ when walking to and concluding night prayer; illuminates the grave and the Sirat bridge.',
    recommendedCount: 1,
    occasion: 'After concluding Isha or Witr prayer',
    tags: ['light', 'noor', 'isha', 'guidance', 'grave']
  },

  // ==========================================
  // TAHAJJUD & QIYAM AL-LAYL (Night Vigil)
  // ==========================================
  {
    id: 'tahajjud-last-third-night',
    title: 'Dua of the Last Third of the Night (Tahajjud Opening)',
    prayerTiming: 'Tahajjud',
    phase: 'pre',
    arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَاوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَاوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ، أَنْتَ الْحَقُّ وَوَعْدُكَ الْحَقُّ وَلِقَاؤُكَ حَقٌّ وَالْجَنَّةُ حَقٌّ وَالنَّارُ حَقٌّ',
    transliteration: "Allahumma lakal-hamdu Anta noorus-samawati wal-ardi wa man feehinn, wa lakal-hamdu Anta qayyimus-samawati wal-ardi wa man feehinn, Antal-Haqqu wa wa'dukal-haqq, wa liqa'uka haqq, wal-jannatu haqq, wan-naru haqq.",
    translation: "O Allah, to You belongs all praise. You are the Light of the heavens and the earth and all within them. To You belongs all praise, You are the Sustainer of the heavens and the earth and all within them. You are the Truth, Your promise is truth, meeting You is truth, Paradise is truth, and the Fire is truth.",
    source: 'Sahih al-Bukhari 1120, Sahih Muslim 769',
    virtue: 'Recited by Prophet Muhammad ﷺ when rising for Tahajjud; the Lord descends to the lowest heaven in the last third calling: "Who is asking of Me so I may give?"',
    recommendedCount: 1,
    occasion: 'When waking up in the night for Tahajjud and Qiyam',
    tags: ['tahajjud', 'night-vigil', 'closeness', 'intimacy']
  },
  {
    id: 'tahajjud-forgiveness-repentance',
    title: 'Master Supplication of Forgiveness (Sayyid al-Istighfar)',
    prayerTiming: 'Tahajjud',
    phase: 'post',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allahumma Anta Rabbi la ilaha illa Ant, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't. A'oodhu bika min sharri ma sana't, aboo'u laka bini'matika 'alayya, wa aboo'u laka bidhanbi fagh-fir li, fa innahu la yaghfirudh-dhunooba illa Ant.",
    translation: "O Allah, You are my Lord, none has the right to be worshipped but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favors upon me and I confess my sins to You, so forgive me, for none forgives sins except You.",
    source: 'Sahih al-Bukhari 6306',
    virtue: 'The Prophet ﷺ said: "Whoever says this at night with firm faith, and dies before morning, enters Paradise." (Bukhari)',
    recommendedCount: 1,
    occasion: 'During Tahajjud, before sleep, or at dawn',
    tags: ['sayyid-al-istighfar', 'forgiveness', 'tahajjud', 'paradise']
  },

  // ==========================================
  // JUMMAH (Friday Congregational Prayer)
  // ==========================================
  {
    id: 'jummah-salawat-prophet',
    title: 'Abundant Salawat upon the Prophet ﷺ on Friday',
    prayerTiming: 'Jummah',
    phase: 'pre',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hameedum-Majeed. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammad, kama barakta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hameedum-Majeed.",
    translation: "O Allah, bestow Your favor upon Muhammad and upon the family of Muhammad, as You bestowed favor upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy, Full of Glory. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy, Full of Glory.",
    source: 'Sahih al-Bukhari 3370',
    virtue: 'The Prophet ﷺ said: "The best of your days is Friday, so send abundant blessings upon me on it, for your blessings are presented to me." (Abu Dawud 1047)',
    recommendedCount: 10,
    occasion: 'Throughout the day of Friday, especially before and after the Jummah Khutbah',
    tags: ['jummah', 'salawat', 'friday', 'prophet', 'blessings']
  },
  {
    id: 'jummah-hour-of-acceptance',
    title: 'The Golden Hour of Acceptance on Friday (Sa‘at al-Ijabah)',
    prayerTiming: 'Jummah',
    phase: 'post',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
    translation: "Our Lord, grant us good in this world and good in the Hereafter, and save us from the punishment of the Fire.",
    source: 'Surah Al-Baqarah 2:201, Sahih Muslim 852',
    virtue: 'On Friday there is an hour wherein no Muslim asks Allah for anything good except that He grants it, especially between Asr and Maghrib.',
    recommendedCount: 3,
    occasion: 'During the final hour of Friday afternoon between Asr and Maghrib sunset',
    tags: ['jummah', 'saat-al-ijabah', 'acceptance', 'golden-hour']
  },

  // ==========================================
  // UNIVERSAL POST-SALLAH AZKAR (Every Prayer)
  // ==========================================
  {
    id: 'post-universal-salam-istighfar',
    title: 'Prophetic Sunnah Istighfar & Peace Supplication',
    prayerTiming: 'Any',
    phase: 'post',
    arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ',
    transliteration: "Astaghfirullah, Astaghfirullah, Astaghfirullah. Allahumma Antas-Salamu wa minkas-salam, tabarakta ya Dhal-Jalali wal-Ikram.",
    translation: "I seek the forgiveness of Allah (3x). O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of Majesty and Honor.",
    source: 'Sahih Muslim 591',
    virtue: 'Recited immediately upon completing the prayer to seek forgiveness for any shortcomings in focus.',
    recommendedCount: 1,
    occasion: 'Immediately after the Tasleem of any prayer',
    tags: ['post-sallah', 'istighfar', 'peace', 'sunnah']
  },
  {
    id: 'post-universal-muadh-dua',
    title: 'Dua Taught to Mu‘adh for Constant Remembrance',
    prayerTiming: 'Any',
    phase: 'post',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik.",
    translation: "O Allah, help me to remember You, to thank You, and to worship You in an excellent manner.",
    source: 'Sunan Abi Dawud 1522, Sunan an-Nasa’i 1303',
    virtue: 'The Prophet ﷺ took Mu‘adh by the hand and said: "O Mu‘adh, by Allah I love you... never forget to recite this after every prayer."',
    recommendedCount: 1,
    occasion: 'After concluding any obligatory or voluntary prayer',
    tags: ['post-sallah', 'gratitude', 'remembrance', 'muadh']
  },
  {
    id: 'post-universal-ayat-kursi',
    title: 'Ayat al-Kursi (The Greatest Verse in the Quran)',
    prayerTiming: 'Any',
    phase: 'post',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۚ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta'khudhuhu sinatuw-wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnih. Ya'lamu ma bayna aydeehim wa ma khalfahum, wa la yuheetoona bi shay'im-min 'ilmihi illa bima sha'. Wasi'a Kursiyyuhus-samawati wal-ard, wa la ya'ooduhu hifzuhuma, wa Huwal-'Aliyyul-'Adheem.",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    source: 'Surah Al-Baqarah 2:255, Sunan an-Nasa’i (Al-Sunan al-Kubra 9848)',
    virtue: 'The Prophet ﷺ said: "Whoever recites Ayat al-Kursi after every obligatory prayer, nothing stands between him and his entering Paradise except death." (Sahih al-Jami 6464)',
    recommendedCount: 1,
    occasion: 'After concluding every obligatory prayer',
    tags: ['ayat-al-kursi', 'paradise', 'protection', 'greatest-ayah']
  },
  {
    id: 'during-sujud-general-closeness',
    title: 'Supplication for Forgiveness and Guidance in Sujud',
    prayerTiming: 'Any',
    phase: 'during',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي',
    transliteration: "Subhanakallahumma Rabbana wa bihamdik, Allahummagh-fir li.",
    translation: "Glory be to You, O Allah, our Lord, and all praise is for You. O Allah, forgive me.",
    source: 'Sahih al-Bukhari 794, Sahih Muslim 484 (Aisha RA)',
    virtue: 'Recited extensively by the Prophet ﷺ in his bowing and prostrations following the revelation of Surah An-Nasr.',
    recommendedCount: 3,
    occasion: 'During Ruku and Sujud in any prayer',
    tags: ['sujud', 'ruku', 'forgiveness', 'closeness']
  },
  {
    id: 'during-jalsah-between-sujuds',
    title: 'Supplication Between the Two Prostrations (Jalsah)',
    prayerTiming: 'Any',
    phase: 'during',
    arabic: 'رَبِّ اغْفِرْ لِي، وَارْحَمْنِي، وَاهْدِنِي، وَاجْبُرْنِي، وَعَافِنِي، وَارْزُقْنِي، وَارْفَعْنِي',
    transliteration: "Rabbigh-fir li, warhamni, wahdini, wajburni, wa 'afini, warzuqni, warfa'ni.",
    translation: "My Lord, forgive me, have mercy on me, guide me, mend me, grant me well-being, provide for me, and elevate my rank.",
    source: 'Sunan Abi Dawud 850, Jami` at-Tirmidhi 284',
    virtue: 'Covers every necessity of this world and the Hereafter while sitting reverently between prostrations.',
    recommendedCount: 1,
    occasion: 'While sitting between the two prostrations in every rakah',
    tags: ['jalsah', 'sitting', 'mercy', 'provision', 'elevation']
  }
];

export function getRecommendedPrayerTimingNow(): PrayerName | 'Tahajjud' | 'Jummah' {
  const now = new Date();
  const day = now.getDay(); // 5 = Friday
  const hours = now.getHours();

  // Friday between 11 AM and 3 PM is Jummah time
  if (day === 5 && hours >= 11 && hours <= 15) {
    return 'Jummah';
  }

  // Tahajjud: between 1:00 AM and 4:30 AM
  if (hours >= 1 && hours < 5) {
    return 'Tahajjud';
  }

  // Fajr: 5:00 AM to 6:30 AM
  if (hours >= 5 && hours < 7) {
    return 'Fajr';
  }

  // Dhuhr: 12:00 PM to 3:30 PM
  if (hours >= 12 && hours < 16) {
    return 'Dhuhr';
  }

  // Asr: 3:30 PM to 6:30 PM
  if (hours >= 16 && hours < 18) {
    return 'Asr';
  }

  // Maghrib: 6:30 PM to 8:00 PM
  if (hours >= 18 && hours < 20) {
    return 'Maghrib';
  }

  // Isha: 8:00 PM to midnight
  if (hours >= 20 || hours === 0) {
    return 'Isha';
  }

  return 'Dhuhr';
}

export function filterDuas(
  prayerTiming: PrayerName | 'Tahajjud' | 'Jummah' | 'Any' | 'all',
  phase: 'all' | 'pre' | 'during' | 'post',
  searchQuery: string = ''
): DuaItem[] {
  let list = PRAYER_DUAS_DATA;

  if (prayerTiming !== 'all') {
    list = list.filter((item) => item.prayerTiming === prayerTiming || item.prayerTiming === 'Any');
  }

  if (phase !== 'all') {
    list = list.filter((item) => item.phase === phase);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.translation.toLowerCase().includes(q) ||
        item.transliteration.toLowerCase().includes(q) ||
        item.arabic.includes(q) ||
        item.virtue.toLowerCase().includes(q) ||
        item.occasion.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  return list;
}
