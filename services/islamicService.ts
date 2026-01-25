
import { PrayerTimes, HijriDate, Surah, Ayah, NameOfAllah, Dua, HadithData } from '../types';
import { openDB, dbGet, dbGetAll, dbPut, dbDelete } from './db';

const ALADHAN_API = 'https://api.aladhan.com/v1';
const QURAN_API = 'https://api.alquran.cloud/v1';

// --- SEED DATA ---
const SEED_NAMES: NameOfAllah[] = [
    { name: 'Allah', transliteration: 'Allah', meaning: 'The God', explanation: 'The One and Only Deity.' },
    { name: 'Ar-Rahman', transliteration: 'Ar-Rahman', meaning: 'The Most Gracious', explanation: 'He who wills goodness and mercy for all His creatures.' },
    { name: 'Ar-Rahim', transliteration: 'Ar-Rahim', meaning: 'The Most Merciful', explanation: 'He who acts with extreme kindness.' },
    { name: 'Al-Malik', transliteration: 'Al-Malik', meaning: 'The King', explanation: 'The Sovereign Lord, The One with the complete Dominion.' },
    { name: 'Al-Quddus', transliteration: 'Al-Quddus', meaning: 'The Most Holy', explanation: 'The One who is pure from any imperfection.' },
    { name: 'As-Salam', transliteration: 'As-Salam', meaning: 'The Source of Peace', explanation: 'The One who is free from every imperfection and safety.' },
    { name: 'Al-Mu\'min', transliteration: 'Al-Mu\'min', meaning: 'The Guardian of Faith', explanation: 'The One who witnessed for Himself that no one is God but Him.' },
    { name: 'Al-Muhaymin', transliteration: 'Al-Muhaymin', meaning: 'The Protector', explanation: 'The One who witnesses the saying and deeds of His creatures.' },
    { name: 'Al-Aziz', transliteration: 'Al-Aziz', meaning: 'The Mighty', explanation: 'The Strong, The Defeater who is not defeated.' },
    { name: 'Al-Jabbar', transliteration: 'Al-Jabbar', meaning: 'The Compeller', explanation: 'The One that nothing happens in His Dominion except that which He willed.' }
];

const SEED_DUAS: Dua[] = [
    { id: '1', category: 'Morning', title: 'Upon Waking Up', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', transliteration: 'Alhamdu lillahil-lathee ahyana ba\'da ma amatana wa-ilayhin-nushoor', translation: 'All praise is due to Allah who gave us life after having given us death and unto Him is the resurrection.' },
    { id: '2', category: 'Travel', title: 'Start of Journey', arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ', transliteration: 'Subhanal-lathee sakhkhara lana hatha wama kunna lahu muqrineen. Wa-inna ila rabbina lamunqaliboon', translation: 'Glory is to Him Who has subjected this to us, and we were not able to do it. And surely to our Lord we are returning.' },
    { id: '3', category: 'Food', title: 'Before Eating', arabic: 'بِسْمِ اللَّهِ', transliteration: 'Bismillah', translation: 'In the name of Allah.' },
    { id: '4', category: 'Food', title: 'After Eating', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', transliteration: 'Alhamdu lillahil-lathee at\'amana wasaqana waja\'alana muslimeen', translation: 'All praise is due to Allah who fed us and gave us drink and made us Muslims.' },
    { id: '5', category: 'Evening', title: 'Evening Remembrance', arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', transliteration: 'Amsayna wa-amsal-mulku lillah', translation: 'We have reached the evening and at this very time unto Allah belongs all sovereignty.' },
    { id: '6', category: 'Sleep', title: 'Before Sleeping', arabic: 'بِسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', transliteration: 'Bismika Allahumma amootu wa-ahya', translation: 'In Your Name, O Allah, I die and I live.' },
    { id: '7', category: 'Home', title: 'Leaving Home', arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', transliteration: 'Bismillahi tawakkaltu alallahi, wa la hawla wa la quwwata illa billah', translation: 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.' },
    { id: '8', category: 'Home', title: 'Entering Home', arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا', transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa ala rabbina tawakkalna', translation: 'In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we rely.' },
    { id: '9', category: 'Mosque', title: 'Entering Mosque', arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', transliteration: 'Allahumma iftah li abwaba rahmatik', translation: 'O Allah, open for me the doors of Your mercy.' },
    { id: '10', category: 'Mosque', title: 'Leaving Mosque', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', transliteration: 'Allahumma inni as-aluka min fadlik', translation: 'O Allah, I ask You from Your bounty.' },
    { id: '11', category: 'Toilet', title: 'Entering Toilet', arabic: 'بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبْثِ وَالْخَبَائِثِ', transliteration: 'Bismillahi, Allahumma inni a\'oodhu bika minal-khubthi wal-khaba-ith', translation: 'In the name of Allah. O Allah, I seek refuge in You from the male and female foul spirits.' },
    { id: '12', category: 'Toilet', title: 'Leaving Toilet', arabic: 'غُفْرَانَكَ', transliteration: 'Ghufranak', translation: '(I ask) Your forgiveness.' },
    { id: '13', category: 'Prayer', title: 'After Prayer', arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah, Astaghfirullah, Astaghfirullah', translation: 'I seek forgiveness from Allah, I seek forgiveness from Allah, I seek forgiveness from Allah.' },
    { id: '14', category: 'Difficulty', title: 'During Hardship', arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimeen', translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.' },
    { id: '15', category: 'Morning', title: 'Morning Protection', arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay-un fil-ardi wa la fis-sama-i wa huwas-sami\'ul-aleem', translation: 'In the name of Allah with Whose name nothing can harm on earth or in heaven, and He is the All-Hearing, All-Knowing.' }
];

const SEED_HADITHS: HadithData[] = [
    {
        id: 'bukhari-1',
        collectionId: 'bukhari',
        collectionName: 'Sahih Bukhari',
        text: "Actions are judged by intentions, so each man will have what he intended...",
        source: "Sahih Bukhari 1",
        arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ..."
    },
    {
        id: 'bukhari-2',
        collectionId: 'bukhari',
        collectionName: 'Sahih Bukhari',
        text: "The Prophet (ﷺ) said, 'None of you will have faith till he wishes for his (Muslim) brother what he likes for himself.'",
        source: "Sahih Bukhari 13",
        arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ"
    },
    {
        id: 'muslim-1',
        collectionId: 'muslim',
        collectionName: 'Sahih Muslim',
        text: "He who cheats is not of us.",
        source: "Sahih Muslim 101",
        arabic: "مَنْ غَشَّ فَلَيْسَ مِنَّا"
    },
    {
        id: 'dawud-1',
        collectionId: 'dawud',
        collectionName: 'Sunan Abu Dawud',
        text: "The most perfect believer in respect of faith is he who is best of them in manners.",
        source: "Sunan Abu Dawud 4682",
        arabic: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا"
    },
    {
        id: 'tirmidhi-1',
        collectionId: 'tirmidhi',
        collectionName: 'Jami At-Tirmidhi',
        text: "Fear Allah wherever you are, do good deeds after doing bad ones...",
        source: "Jami At-Tirmidhi 1987",
        arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا..."
    },
    {
        id: 'nasai-1',
        collectionId: 'nasai',
        collectionName: 'Sunan an-Nasa\'i',
        text: "The Messenger of Allah (ﷺ) said: 'Perfume is that which has a hidden color...'",
        source: "Sunan an-Nasa'i 5117",
        arabic: "طِيبُ الرِّجَالِ مَا ظَهَرَ رِيحُهُ وَخَفِيَ لَوْنُهُ..."
    },
    {
        id: 'majah-1',
        collectionId: 'majah',
        collectionName: 'Sunan Ibn Majah',
        text: "Seeking knowledge is a duty upon every Muslim.",
        source: "Sunan Ibn Majah 224",
        arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ"
    }
];

// --- INITIALIZATION ---
export const initializeDatabase = async () => {
    try {
        const duas = await dbGetAll('duas');
        if (duas.length === 0) {
            console.log("Seeding Duas...");
            for (const d of SEED_DUAS) await dbPut('duas', d);
        }

        const names = await dbGetAll('names99');
        if (names.length === 0) {
            console.log("Seeding Names...");
            for (const n of SEED_NAMES) await dbPut('names99', n);
        }

        const hadiths = await dbGetAll('hadiths');
        if (hadiths.length === 0) {
             console.log("Seeding Hadiths...");
             for (const h of SEED_HADITHS) await dbPut('hadiths', h);
        }
        
        // Seed default settings if missing
        const vol = await dbGet('settings', 'adhanVolume');
        if (vol === undefined) await dbPut('settings', { key: 'adhanVolume', value: 0.8 });
        
        const method = await dbGet('settings', 'calculationMethod');
        if (method === undefined) await dbPut('settings', { key: 'calculationMethod', value: 2 });

        return true;
    } catch (e) {
        console.error("Database initialization failed:", e);
        return false;
    }
}

// --- DATA ACCESS METHODS ---

export const getStoredDuas = async (): Promise<Dua[]> => {
    return dbGetAll<Dua>('duas');
};

export const getStoredNames = async (): Promise<NameOfAllah[]> => {
    return dbGetAll<NameOfAllah>('names99');
};

export const getStoredHadiths = async (): Promise<HadithData[]> => {
    return dbGetAll<HadithData>('hadiths');
};

export const getFavoriteStatus = async (id: string): Promise<boolean> => {
    const item = await dbGet('favorites', id);
    return !!item;
};

export const toggleFavoriteItem = async (id: string): Promise<boolean> => {
    const exists = await getFavoriteStatus(id);
    if (exists) {
        await dbDelete('favorites', id);
        return false;
    } else {
        await dbPut('favorites', { id, timestamp: Date.now() });
        return true;
    }
};

export const getAllFavorites = async (): Promise<string[]> => {
    const favs = await dbGetAll<{id: string}>('favorites');
    return favs.map(f => f.id);
};

export const saveTasbihSession = async (count: number) => {
    await dbPut('tasbih_history', { count, timestamp: new Date() });
};

export const getTasbihHistory = async () => {
    const history = await dbGetAll<{id: number, count: number, timestamp: Date}>('tasbih_history');
    return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5);
};

export const getAppSetting = async <T>(key: string, defaultValue: T): Promise<T> => {
    const result = await dbGet<{key: string, value: T}>('settings', key);
    return result ? result.value : defaultValue;
}

export const saveAppSetting = async (key: string, value: any) => {
    await dbPut('settings', { key, value });
}


// --- API SERVICES (Keep existing) ---

export const getPrayerTimes = async (lat: number, lng: number, method: number = 2): Promise<{ timings: PrayerTimes; date: HijriDate }> => {
  try {
    const date = new Date();
    const response = await fetch(`${ALADHAN_API}/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${lat}&longitude=${lng}&method=${method}`);
    const data = await response.json();
    if (data.code === 200) {
      return { timings: data.data.timings, date: data.data.date.hijri };
    }
    throw new Error('Failed to fetch prayer times');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${QURAN_API}/surah`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getSurahAyahs = async (surahNumber: number, edition: string = 'quran-uthmani'): Promise<Ayah[]> => {
  try {
    const response = await fetch(`${QURAN_API}/surah/${surahNumber}/${edition}`);
    const data = await response.json();
    return data.data.ayahs;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getSurahWithTranslation = async (surahNumber: number, translationEdition: string = 'en.sahih'): Promise<{arabic: Ayah[], translation: Ayah[]}> => {
  try {
    const [arabicResponse, translationResponse] = await Promise.all([
      fetch(`${QURAN_API}/surah/${surahNumber}/quran-uthmani`),
      fetch(`${QURAN_API}/surah/${surahNumber}/${translationEdition}`)
    ]);

    const arabicData = await arabicResponse.json();
    const translationData = await translationResponse.json();

    return {
      arabic: arabicData.data.ayahs,
      translation: translationData.data.ayahs
    };
  } catch (error) {
    console.error(`Translation edition '${translationEdition}' not found, falling back to English:`, error);
    // Fallback to English if the requested translation doesn't exist
    try {
      const [arabicResponse, englishResponse] = await Promise.all([
        fetch(`${QURAN_API}/surah/${surahNumber}/quran-uthmani`),
        fetch(`${QURAN_API}/surah/${surahNumber}/en.sahih`)
      ]);

      const arabicData = await arabicResponse.json();
      const englishData = await englishResponse.json();

      return {
        arabic: arabicData.data.ayahs,
        translation: englishData.data.ayahs
      };
    } catch (fallbackError) {
      console.error('Fallback translation also failed:', fallbackError);
      return { arabic: [], translation: [] };
    }
  }
};

export const getQiblaDirection = async (lat: number, lng: number): Promise<number> => {
    try {
        const response = await fetch(`${ALADHAN_API}/qibla/${lat}/${lng}`);
        const data = await response.json();
        return data.data.direction;
    } catch (error) { return 0; }
}

export const getDistanceToMecca = (lat: number, lng: number): number => {
    const R = 6371; 
    const dLat = deg2rad(21.4225 - lat);
    const dLon = deg2rad(39.8262 - lng); 
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat)) * Math.cos(deg2rad(21.4225)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return Math.round(R * c);
}

function deg2rad(deg: number) { return deg * (Math.PI/180); }

export const adhanOptions = [
    { name: 'Makkah', url: 'https://www.islamcan.com/audio/adhan/azan1.mp3' },
    { name: 'Madina', url: 'https://www.islamcan.com/audio/adhan/azan2.mp3' },
    { name: 'Egypt', url: 'https://www.islamcan.com/audio/adhan/azan3.mp3' },
    { name: 'Al-Aqsa', url: 'https://www.islamcan.com/audio/adhan/azan4.mp3' },
    { name: 'Turkey', url: 'https://www.islamcan.com/audio/adhan/azan5.mp3' }
];

export const hadithCollectionsList = [
    { id: 'bukhari', name: 'Sahih Bukhari', count: '7,563' },
    { id: 'muslim', name: 'Sahih Muslim', count: '7,563' },
    { id: 'dawud', name: 'Sunan Abu Dawud', count: '5,274' },
    { id: 'tirmidhi', name: 'Jami At-Tirmidhi', count: '3,956' },
    { id: 'nasai', name: 'Sunan an-Nasa\'i', count: '5,758' },
    { id: 'majah', name: 'Sunan Ibn Majah', count: '4,341' },
];
