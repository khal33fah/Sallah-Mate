import { IslamicBook } from '../types';

export const ISLAMIC_BOOKS: IslamicBook[] = [
  {
    id: 'hisn-al-muslim',
    title: 'Fortress of the Muslim',
    arabicTitle: 'حِصْنُ المُسْلِم مِنْ أَذْكَارِ الكِتَابِ وَالسُّنَّة',
    author: 'Sheikh Sa\'id bin Ali bin Wahf Al-Qahtani',
    category: 'Dua & Adhkar',
    description: 'The premier pocketbook of authentic supplications and remembrances from the Quran and Sunnah.',
    chapters: [
      {
        id: 'after-salah',
        title: 'Remembrances After Concluding Sallah',
        arabicTitle: 'الأذكار بعد السلام من الصلاة',
        content:
          'Upon finishing the obligatory prayer with Tasleem (turning right and left saying Assalamu Alaikum wa Rahmatullah), it is Sunnah to remain seated and recite the prescribed post-prayer adhkar with presence of heart.',
        arabicDuas: [
          {
            arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الجَلَالِ وَالإِكْرَامِ',
            transliteration:
              'Astaghfirullāh (3x). Allāhumma antas-Salāmu wa minkas-salām, tabārakta yā Dhal-Jalāli wal-Ikrām.',
            translation:
              'I ask Allah for forgiveness (three times). O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.',
            reference: 'Sahih Muslim 591',
            repetitions: 1,
          },
          {
            arabic: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لاَ مَانِعَ لِمَا أَعْطَيْتَ، وَلاَ مُعْطِيَ لِمَا مَنَعْتَ، وَلاَ يَنْفَعُ ذَا الجَدِّ مِنْكَ الجَدُّ',
            transliteration:
              'Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa Huwa ʿalā kulli shay’in Qadīr. Allāhumma lā māniʿa limā aʿṭayta, wa lā muʿṭiya limā manaʿta, wa lā yanfaʿu dhal-jaddi minkal-jadd.',
            translation:
              'None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He has power over all things. O Allah, none can prevent what You give, and none can give what You withhold, and no fortune can benefit its possessor against You.',
            reference: 'Sahih al-Bukhari 844',
            repetitions: 1,
          },
          {
            arabic: 'سُبْحَانَ اللَّهِ (٣٣)، الحَمْدُ لِلَّهِ (٣٣)، اللَّهُ أَكْبَرُ (٣٣)، ثُمَّ: لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            transliteration:
              'Subḥānallāh (33x), Al-ḥamdu lillāh (33x), Allāhu Akbar (33x). Thumma: Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa Huwa ‘alā kulli shay’in Qadīr.',
            translation:
              'Glory be to Allah (33 times), Praise be to Allah (33 times), Allah is the Greatest (33 times), then complete 100 with the testimony of oneness.',
            reference: 'Sahih Muslim 597',
            repetitions: 33,
          },
        ],
      },
      {
        id: 'morning-evening',
        title: 'Morning and Evening Supplications',
        arabicTitle: 'أذكار الصباح والمساء',
        content:
          'Recited after Fajr until sunrise for the morning adhkar, and after Asr until sunset for the evening adhkar. These establish a spiritual shield against distractions, harm, and anxiety.',
        arabicDuas: [
          {
            arabic: 'أَصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
            transliteration:
              'Aṣbaḥnā wa aṣbaḥal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa Huwa ‘alā kulli shay’in Qadīr.',
            translation:
              'We have reached the morning and the kingdom belongs to Allah, and all praise is due to Allah. None has the right to be worshipped except Allah alone.',
            reference: 'Sahih Muslim 2723',
            repetitions: 1,
          },
          {
            arabic: 'بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ',
            transliteration:
              'Bismillāhilladhī lā yaḍurru maʿasmihī shay’un fil-arḍi wa lā fis-samā’i wa Huwas-Samīʿul-ʿAlīm.',
            translation:
              'In the Name of Allah, with Whose Name nothing can cause harm in the earth nor in the heaven, and He is the All-Hearing, the All-Knowing.',
            reference: 'Sunan Abi Dawud 5088',
            repetitions: 3,
          },
        ],
      },
    ],
  },
  {
    id: 'fiqh-of-salah',
    title: 'Fiqh of Sallah: Pillars & Conditions',
    arabicTitle: 'فِقْهُ الصَّلَاة: أَرْكَانُهَا وَشُرُوطُهَا وَسُنَنُهَا',
    author: 'Imam Ibn Qudamah & Classical Scholars',
    category: 'Fiqh',
    description: 'A comprehensive summary of the essential prerequisites, pillars, obligations, and Sunnah acts of prayer.',
    chapters: [
      {
        id: 'pillars-and-conditions',
        title: 'The 9 Conditions (Shurut) & 14 Pillars (Arkan)',
        arabicTitle: 'شروط الصلاة وأركانها',
        content: `Before stepping onto the prayer mat, nine prerequisites must be fulfilled:
1. Islam (being a Muslim)
2. Sanity and consciousness
3. Age of discernment (Tamyiz)
4. Removal of ritual impurity (Major Ghusl and Minor Wudu)
5. Removal of physical impurities (Najasah) from body, clothing, and prayer place
6. Covering the Awrah (intimate parts) with clean modest clothing
7. The arrival of the prescribed prayer time
8. Facing the Qibla (Kaaba in Mecca)
9. Sincere intention in the heart (Niyyah)

The 14 Pillars of Sallah (cannot be omitted intentionally or mistakenly without nullifying the unit):
1. Standing (Qiyam) in obligatory prayers for those able
2. The opening Takbir (Takbirat al-Ihram saying "Allahu Akbar")
3. Reciting Surah Al-Fatiha in every Rakah
4. Bowing (Ruku) with tranquility
5. Rising from Ruku and standing upright
6. Prostration (Sujud) on seven bodily parts (forehead/nose, two hands, two knees, tips of two feet)
7. Rising from Sujud and sitting between the two prostrations
8. Tranquility and calm (Tuma’ninah) in every physical pillar
9. The final Tashahhud
10. Sitting for the final Tashahhud
11. Sending blessings upon the Prophet ﷺ (Salawat)
12. The concluding Tasleem (Peace greetings)
13. Observing the prescribed order of pillars
14. Maintaining Khushu (mindfulness and reverence before Allah).`,
      },
      {
        id: 'distraction-shield',
        title: 'Protecting Prayer from Distractions (Khushu)',
        arabicTitle: 'الخشوع في الصلاة ودفع الشواغل',
        content: `Allah says: "Successful indeed are the believers: those who are humble and reverent in their prayers" (Surah Al-Mu'minun 23:1-2).
To attain Khushu:
- Remove phone notifications, silence alarms, and close worldly matters before starting.
- Pray behind a Sutrah (screen/barrier) to prevent passersby from interrupting the gaze.
- Look down at the place of prostration rather than wandering with the eyes.
- Ponder upon the meanings of the verses recited.
- Remember death: The Prophet ﷺ said, "Remember death in your prayer, for when a man remembers death in his prayer, he is bound to perform it well."`,
      },
    ],
  },
  {
    id: 'nawawi-40',
    title: 'Imam An-Nawawi’s 40 Hadith',
    arabicTitle: 'الأَرْبَعُونَ النَّوَوِيَّة',
    author: 'Imam Yahya ibn Sharaf An-Nawawi (d. 676 AH)',
    category: 'Foundations',
    description: 'The monumental collection of the most comprehensive sayings of Prophet Muhammad ﷺ spanning all of Islam.',
    chapters: [
      {
        id: 'hadith-1-niyyah',
        title: 'Hadith 1: Actions Depend on Intentions',
        arabicTitle: 'الحديث الأول: إنما الأعمال بالنيات',
        content:
          'On the authority of Amir al-Mu\'minin Abu Hafs Umar ibn al-Khattab (RA), who said: I heard the Messenger of Allah ﷺ say: "Actions are but by intention, and every man shall have but that which he intended. Thus he whose migration was for Allah and His Messenger, his migration was for Allah and His Messenger, and he whose migration was to achieve some worldly benefit or to take some woman in marriage, his migration was for that which he migrated for."',
        arabicDuas: [
          {
            arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
            transliteration: 'Innamal-aʿmālu bin-niyyāt, wa innamā likulli-mri’in mā nawā',
            translation: 'Actions are only by intentions, and every person will only have what they intended.',
            reference: 'Sahih al-Bukhari 1 & Sahih Muslim 1907',
          },
        ],
      },
      {
        id: 'hadith-2-jibril',
        title: 'Hadith 2: Islam, Iman, and Ihsan (The Hadith of Jibril)',
        arabicTitle: 'الحديث الثاني: مراتب الدين (حديث جبريل)',
        content:
          'When Angel Jibril came in human form to teach the companions their religion, he asked the Prophet ﷺ about Islam (the 5 pillars including Sallah), Iman (the 6 articles of faith), and Ihsan. The Prophet ﷺ defined Ihsan: "It is to worship Allah as though you see Him, and if you do not see Him, [know that] He truly sees you."',
        arabicDuas: [
          {
            arabic: 'أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ',
            transliteration: 'An taʿbudallāha ka’annaka tarāh, fa-in lam takun tarāhu fa-innahū yarāk.',
            translation: 'To worship Allah as if you see Him, and though you see Him not, verily He sees you.',
            reference: 'Sahih Muslim 8',
          },
        ],
      },
    ],
  },
  {
    id: 'sealed-nectar',
    title: 'The Sealed Nectar (Ar-Raheeq Al-Makhtum)',
    arabicTitle: 'الرَّحِيقُ المَخْتُوم: السِّيرَةُ النَّبَوِيَّة',
    author: 'Sheikh Safi-ur-Rahman al-Mubarakpuri',
    category: 'Seerah',
    description: 'Award-winning authentic biography of Prophet Muhammad ﷺ detailing his devotion, congregational prayer leadership, and character.',
    chapters: [
      {
        id: 'prayer-devotion',
        title: 'The Prophet\'s ﷺ Devotion to Prayer and Tahajjud',
        arabicTitle: 'هديه ﷺ في قيام الليل والصلوات',
        content: `Aisha (RA) was asked about the Prophet's ﷺ prayer at night. She said: "He would stand in prayer until his feet would swell and crack. I said to him, 'Why do you do this, O Messenger of Allah, when Allah has forgiven all your past and future sins?' He replied: 'Should I not be a grateful servant (Afala akūnu ʿabdan shakūrā)?'"
Whenever a distressing or difficult matter arose, the Prophet ﷺ would hasten to Sallah, and say to his companion and caller to prayer Bilal (RA): "O Bilal, call the Iqamah for prayer and bring us comfort and tranquility through it (Ariḥnā bihā yā Bilāl)!"`,
      },
    ],
  },
];
