import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateIslamicResponse = async (prompt: string): Promise<string> => {
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    return "API Key is missing or invalid. Please add your Gemini API key to the .env.local file as GEMINI_API_KEY=your_actual_api_key_here";
  }

  // Check if the question is Islamic-related
  const islamicKeywords = [
    'allah', 'islam', 'muslim', 'quran', 'hadith', 'prophet', 'muhammad', 'salah', 'prayer', 'fasting', 'ramadan',
    'hajj', 'umrah', 'zakat', 'dua', 'dhikr', 'surah', 'ayat', 'verse', 'deen', 'iman', 'taqwa', 'halal', 'haram',
    'jihad', 'jihad', 'fatwa', 'sharia', 'sunna', 'sunnah', 'ahlul bayt', 'companion', 'sahaba', 'islamic', 'mosque',
    'masjid', 'imam', 'khalifa', 'caliph', 'islamic history', 'seerah', 'fiqh', 'aqeedah', 'tafsir', 'tawheed'
  ];

  const isIslamicQuestion = islamicKeywords.some(keyword =>
    prompt.toLowerCase().includes(keyword.toLowerCase())
  );

  if (!isIslamicQuestion) {
    return "I'm sorry, I can only assist with Islamic and religious questions. Please ask me something related to Islam, Quran, Hadith, or Islamic practices.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{
        parts: [{
          text: `You are an expert Islamic scholar and assistant for the "Deen Companion" app. You have deep knowledge of the Quran, Hadith, Islamic history, and Islamic jurisprudence.

INSTRUCTIONS FOR RESPONDING:
1. ALWAYS provide Quranic references (Surah:Verse) when discussing verses or concepts from the Quran
2. ALWAYS provide Hadith references (collection name and number) when citing Prophetic traditions
3. Be extremely respectful and use Islamic terminology appropriately
4. Keep responses concise but comprehensive for mobile screens
5. If the question is about controversial topics, advise consulting local scholars
6. Always end responses with relevant Islamic reminders or duas when appropriate
7. Use Arabic terms with English translations when introducing new concepts
8. Structure answers clearly with bullet points or numbered lists when explaining steps

CORE ISLAMIC KNOWLEDGE AREAS:
- Quran: All 114 Surahs, their meanings, and contexts
- Hadith: Collections from Bukhari, Muslim, Tirmidhi, Abu Dawood, etc.
- Fiqh: Islamic jurisprudence from all major schools (Hanafi, Shafi, Maliki, Hanbali)
- Aqeedah: Islamic creed and beliefs
- Seerah: Life of Prophet Muhammad (PBUH)
- Islamic history and major events
- Daily worship practices (Salah, Fasting, Zakat, Hajj)
- Islamic ethics and character development

User's Islamic Question: ${prompt}

Respond as a knowledgeable Islamic scholar would, with proper references and Islamic etiquette.`
        }]
      }]
    });

    const aiResponse = response.candidates[0].content.parts[0].text;

    // Add Islamic blessing at the end if not already present
    if (!aiResponse.includes('JazakAllah') && !aiResponse.includes('Alhamdulillah') && !aiResponse.toLowerCase().includes('may allah')) {
      return aiResponse + '\n\n*May Allah (SWT) guide us all to the straight path. Ameen.*';
    }

    return aiResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error.message && error.message.includes("quota")) {
      return "API quota exceeded. Please upgrade your Google AI Studio plan or wait for quota reset. Visit https://ai.google.dev/gemini-api/docs/rate-limits for more information.";
    }
    return "An error occurred while connecting to the AI service. Please check your API key and try again.";
  }
};

export const getDailyInspiration = async (): Promise<{ type: 'Hadith' | 'Quran', arabic: string, translation: string, reference: string }> => {
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') return {
        type: 'Hadith',
        arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
        translation: 'Actions are judged by intentions.',
        reference: 'Sahih Bukhari 1'
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{
              parts: [{
                text: `Generate an authentic Islamic inspirational quote for daily reflection. Choose from these authentic sources:

QURANIC VERSES (choose one):
- "And whoever puts all his trust in Allah, He will be enough for him." (Surah At-Talaq 65:3)
- "Indeed, with hardship [will be] ease." (Surah Ash-Sharh 94:5)
- "And Allah is with the patient." (Surah Al-Baqarah 2:153)
- "My mercy encompasses all things." (Surah Al-A'raf 7:156)
- "Indeed, Allah loves those who rely [upon Him]." (Surah Al-Imran 3:159)

AUTHENTIC HADITHS (choose one):
- "The strong believer is better and more beloved to Allah than the weak believer, although both are good." (Sahih Muslim 2664)
- "None of you truly believes until he loves for his brother what he loves for himself." (Sahih Bukhari 13)
- "The most beloved deeds to Allah are the most consistent ones, even if they are small." (Sahih Bukhari 6464)
- "Take advantage of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your busyness, and your life before your death." (Sahih Hakim 4)
- "Whoever guides someone to goodness will have a reward like the one who does it." (Sahih Muslim 1893)

Return ONLY valid JSON in this format: {"type": "Hadith" or "Quran", "arabic": "arabic text", "translation": "english translation", "reference": "source reference"}`
              }]
            }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const text = response.candidates[0].content.parts[0].text;
        if(text) {
             return JSON.parse(text);
        }
        throw new Error("Empty response");

    } catch (e) {
         console.error("Daily inspiration API Error:", e);
         if (e.message && e.message.includes("quota")) {
           return {
             type: 'Quran',
             arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
             translation: 'For indeed, with hardship [will be] ease. (API quota exceeded - upgrade your plan at https://ai.google.dev/gemini-api/docs/rate-limits)',
             reference: 'Surah Ash-Sharh 94:5'
           };
         }

         // Return a random fallback from authentic Islamic sources
         const fallbacks = [
           { type: 'Quran' as const, arabic: 'وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا', translation: 'And whoever fears Allah, He will make for him a way out.', reference: 'Surah At-Talaq 65:2' },
           { type: 'Hadith' as const, arabic: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ', translation: 'The strong believer is better and more beloved to Allah than the weak believer.', reference: 'Sahih Muslim 2664' },
           { type: 'Quran' as const, arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', translation: 'Indeed, Allah is with the patient.', reference: 'Surah Al-Baqarah 2:153' },
           { type: 'Hadith' as const, arabic: 'مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ', translation: 'Whoever guides someone to goodness will have a reward like the one who does it.', reference: 'Sahih Muslim 1893' }
         ];

         return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}