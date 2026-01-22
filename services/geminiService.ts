import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateIslamicResponse = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please check your configuration.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are a knowledgeable and respectful Islamic assistant for an app called "Deen Companion". 
        Your goal is to provide accurate, balanced, and referenced information based on the Quran and Sunnah.
        
        Guidelines:
        1. When answering religious questions, provide references (Surah:Verse or Hadith collection) where possible.
        2. Be concise and easy to read on a mobile screen.
        3. Use a polite and supportive tone.
        4. If a question is about a specific Fatwa or highly controversial topic, advise the user to consult a local scholar, but provide general context.
        5. You can explain verses, provide Dua suggestions, or historical context.
        `,
      },
    });

    return response.text || "I apologize, I could not generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while connecting to the AI service. Please try again later.";
  }
};

export const getDailyInspiration = async (): Promise<{ type: 'Hadith' | 'Quran', arabic: string, translation: string, reference: string }> => {
    if (!apiKey) return {
        type: 'Hadith',
        arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
        translation: 'Actions are judged by intentions.',
        reference: 'Sahih Bukhari 1'
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Generate a random short inspirational Islamic quote. It can be a Quranic verse or a Sahih Hadith. Return ONLY valid JSON.",
            config: {
                responseMimeType: "application/json",
            }
        });
        
        const text = response.text;
        if(text) {
             return JSON.parse(text);
        }
        throw new Error("Empty response");

    } catch (e) {
         return {
            type: 'Quran',
            arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
            translation: 'For indeed, with hardship [will be] ease.',
            reference: 'Surah Ash-Sharh 94:5'
        };
    }
}