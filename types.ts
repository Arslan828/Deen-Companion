export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface HijriDate {
  day: string;
  month: {
    en: string;
    ar: string;
  };
  year: string;
  weekday: {
    en: string;
    ar: string;
  };
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export enum ViewState {
  HOME = 'HOME',
  QURAN = 'QURAN',
  QIBLA = 'QIBLA',
  TASBIH = 'TASBIH',
  AI_CHAT = 'AI_CHAT',
  NAMES_99 = 'NAMES_99',
  DUAS = 'DUAS',
  HADITH = 'HADITH',
  MORE = 'MORE'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface NameOfAllah {
  name: string;
  transliteration: string;
  meaning: string;
  explanation: string;
}

export interface Dua {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface HadithData {
  id: string;
  collectionId: string;
  collectionName: string;
  text: string;
  arabic?: string;
  source: string;
}