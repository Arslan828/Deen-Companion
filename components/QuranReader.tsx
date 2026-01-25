import React, { useState, useEffect } from 'react';
import { getAllSurahs, getSurahWithTranslation } from '../services/islamicService';
import { Surah, Ayah } from '../types';
import { Search, ChevronLeft, BookOpen, Loader2, Type, Languages, Settings } from 'lucide-react';

const QuranReader: React.FC = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
    const [arabicAyahs, setArabicAyahs] = useState<Ayah[]>([]);
    const [translationAyahs, setTranslationAyahs] = useState<Ayah[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    // Settings
    const [fontSize, setFontSize] = useState(24);
    const [showSettings, setShowSettings] = useState(false);
    const [showTranslation, setShowTranslation] = useState(true);
    const [translationLang, setTranslationLang] = useState('en.sahih');

    useEffect(() => {
        setLoading(true);
        getAllSurahs()
            .then(setSurahs)
            .finally(() => setLoading(false));
    }, []);

    // Re-fetch translation when language changes
    useEffect(() => {
        if (selectedSurah && translationLang) {
            setLoading(true);
            getSurahWithTranslation(selectedSurah.number, translationLang)
                .then((data) => {
                    setArabicAyahs(data.arabic);
                    setTranslationAyahs(data.translation);
                    // If translation failed to load, it will be empty array
                    if (data.translation.length === 0 && translationLang !== 'en.sahih') {
                        console.warn(`Translation for ${translationLang} not available, showing English instead`);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [translationLang, selectedSurah]);

    const handleSelectSurah = async (surah: Surah) => {
        setSelectedSurah(surah);
        setLoading(true);
        try {
            const data = await getSurahWithTranslation(surah.number, translationLang);
            setArabicAyahs(data.arabic);
            setTranslationAyahs(data.translation);
        } finally {
            setLoading(false);
        }
    };

    const filteredSurahs = surahs.filter(s => 
        s.englishName.toLowerCase().includes(search.toLowerCase()) || 
        s.name.includes(search)
    );

    if (selectedSurah) {
        return (
            <div className="flex flex-col h-full bg-off-white">
                <div className="bg-primary text-white p-4 sticky top-0 z-20 flex items-center justify-between shadow-md">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setSelectedSurah(null)}
                            className="mr-3 p-1 hover:bg-white/10 rounded-full"
                        >
                            <ChevronLeft />
                        </button>
                        <div>
                            <h2 className="font-bold text-lg">{selectedSurah.englishName}</h2>
                            <p className="text-xs text-white/70">{selectedSurah.englishNameTranslation}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-white/10 rounded-full">
                        <Type size={20} />
                    </button>
                </div>

                {/* Reader Settings Drawer */}
                {showSettings && (
                    <div className="bg-white border-b border-gray-200 p-4 sticky top-[72px] z-10 animate-in slide-in-from-top-2">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-2 block">Arabic Font Size</label>
                                <input
                                    type="range"
                                    min="18" max="40"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full accent-primary"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-2 block">Translation</label>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={showTranslation}
                                            onChange={(e) => setShowTranslation(e.target.checked)}
                                            className="accent-primary"
                                        />
                                        <span className="text-sm">Show Translation</span>
                                    </label>
                                </div>
                            </div>
                            {showTranslation && (
                                <div>
                                    <label className="text-xs text-gray-500 mb-2 block">Translation Language</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setTranslationLang('en.sahih')}
                                            className={`flex-1 py-2 rounded text-xs font-bold ${translationLang === 'en.sahih' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            English
                                        </button>
                                        <button
                                            onClick={() => setTranslationLang('ur.ahmedali')}
                                            className={`flex-1 py-2 rounded text-xs font-bold ${translationLang === 'ur.ahmedali' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            Urdu
                                        </button>
                                        <button
                                            onClick={() => setTranslationLang('hi.hindi')}
                                            className={`flex-1 py-2 rounded text-xs font-bold ${translationLang === 'hi.hindi' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            Hindi
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
                     {/* Bismillah */}
                    {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                        <div className="text-center mb-8">
                             <p className="font-arabic text-2xl text-primary">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
                    ) : (
                        arabicAyahs.map((ayah, index) => (
                            <div key={ayah.number} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
                                        {selectedSurah.number}:{ayah.numberInSurah}
                                    </span>
                                    <button className="text-gray-300 hover:text-accent"><BookOpen size={16}/></button>
                                </div>
                                <p
                                    className="font-arabic text-right leading-[2.5] text-gray-800 dir-rtl mb-4"
                                    dir="rtl"
                                    style={{ fontSize: `${fontSize}px` }}
                                >
                                    {ayah.text}
                                </p>
                                {showTranslation && translationAyahs[index] && (
                                    <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                        {translationAyahs[index].text}
                                    </p>
                                )}
                                {showTranslation && !translationAyahs[index] && translationLang !== 'en.sahih' && (
                                    <p className="text-sm text-orange-600 leading-relaxed border-t border-gray-50 pt-4">
                                        Translation not available in selected language. Showing English translation.
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-off-white p-4">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <BookOpen className="text-accent" /> Al-Quran
            </h2>
            
            <div className="relative mb-4">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search Surah..." 
                    className="w-full bg-white pl-10 pr-4 py-3 rounded-xl shadow-sm border-none focus:ring-2 focus:ring-primary outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                 <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
                <div className="flex-1 overflow-y-auto pb-20 space-y-2">
                    {filteredSurahs.map((surah) => (
                        <button 
                            key={surah.number}
                            onClick={() => handleSelectSurah(surah)}
                            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-primary rotate-45">
                                    <span className="-rotate-45">{surah.number}</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800">{surah.englishName}</h3>
                                    <p className="text-xs text-gray-500">{surah.englishNameTranslation}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-arabic text-xl text-primary">{surah.name}</p>
                                <p className="text-xs text-gray-400">{surah.numberOfAyahs} Ayahs</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuranReader;