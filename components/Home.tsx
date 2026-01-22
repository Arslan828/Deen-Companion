import React, { useState, useEffect, useRef } from 'react';
import { PrayerTimes, GeoLocation, HijriDate } from '../types';
import { getPrayerTimes, adhanOptions, getAppSetting, saveAppSetting } from '../services/islamicService';
import { getDailyInspiration } from '../services/geminiService';
import { Bell, Moon, Sun, Share2, Settings, X, Play, Pause } from 'lucide-react';

interface Props {
    location: GeoLocation | null;
    onNavigate: (view: any) => void;
}

const Home: React.FC<Props> = ({ location, onNavigate }) => {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
    const [nextPrayer, setNextPrayer] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [inspiration, setInspiration] = useState<{arabic: string, translation: string, reference: string, type: string} | null>(null);
    
    // Settings State
    const [showSettings, setShowSettings] = useState(false);
    const [selectedAdhan, setSelectedAdhan] = useState(adhanOptions[0]);
    const [adhanVolume, setAdhanVolume] = useState(0.8);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [calculationMethod, setCalculationMethod] = useState(2); // 2: ISNA

    // Audio Preview State
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Refs
    const selectedAdhanRef = useRef(selectedAdhan);
    const adhanVolumeRef = useRef(adhanVolume);
    const notificationsEnabledRef = useRef(notificationsEnabled);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playedPrayersRef = useRef<Set<string>>(new Set());

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    // Load settings from DB on mount
    useEffect(() => {
        const loadSettings = async () => {
            const vol = await getAppSetting<number>('adhanVolume', 0.8);
            const method = await getAppSetting<number>('calculationMethod', 2);
            const adhanUrl = await getAppSetting<string>('selectedAdhanUrl', adhanOptions[0].url);
            
            const savedAdhan = adhanOptions.find(a => a.url === adhanUrl) || adhanOptions[0];
            
            setAdhanVolume(vol);
            setCalculationMethod(method);
            setSelectedAdhan(savedAdhan);
        };
        loadSettings();
    }, []);

    const handleSettingChange = async (key: string, value: any) => {
        if (key === 'adhanVolume') setAdhanVolume(value);
        if (key === 'calculationMethod') setCalculationMethod(value);
        await saveAppSetting(key, value);
    };

    const handleAdhanSelect = async (opt: typeof adhanOptions[0]) => {
        setSelectedAdhan(opt);
        await saveAppSetting('selectedAdhanUrl', opt.url);
        playAudio(opt.url); 
    };

    // Update refs when state changes
    useEffect(() => {
        selectedAdhanRef.current = selectedAdhan;
        adhanVolumeRef.current = adhanVolume;
        notificationsEnabledRef.current = notificationsEnabled;
        
        // Update volume of currently playing audio if any
        if (audioRef.current) {
            audioRef.current.volume = adhanVolume;
        }
    }, [selectedAdhan, adhanVolume, notificationsEnabled]);

    useEffect(() => {
        if (location) {
            getPrayerTimes(location.latitude, location.longitude, calculationMethod).then(data => {
                setPrayerTimes(data.timings);
                setHijriDate(data.date);
            });
        }
        getDailyInspiration().then(setInspiration);
    }, [location, calculationMethod]);

    const playAudio = (url: string) => {
        // Stop existing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            // Remove previous listeners to prevent state leaks
            audioRef.current.onplay = null;
            audioRef.current.onpause = null;
            audioRef.current.onended = null;
        }

        const audio = new Audio(url);
        audio.volume = adhanVolumeRef.current;
        
        // Event listeners for state sync
        audio.onplay = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);
        audio.onended = () => {
            setIsPlaying(false);
            setPreviewUrl(null);
        };

        // Setup error handling
        audio.onerror = (e) => {
            console.error("Audio playback error", e, audio.error);
            setIsPlaying(false);
            setPreviewUrl(null);
        };

        audioRef.current = audio;
        setPreviewUrl(url);
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Audio playback blocked or failed:", error);
                setIsPlaying(false);
                setPreviewUrl(null);
            });
        }
    };

    const togglePreview = (url: string) => {
        if (previewUrl === url && audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Resume failed", e));
            }
        } else {
            playAudio(url);
        }
    };

    // Countdown and Alarm Logic
    useEffect(() => {
        if (!prayerTimes) return;
        
        const timer = setInterval(() => {
            const now = new Date();
            const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
            let foundNext = false;
            
            for (const prayer of prayers) {
                const timeStr = prayerTimes[prayer];
                if (!timeStr) continue;
                
                const [h, m] = timeStr.split(' ')[0].split(':').map(Number);
                
                // Alarm Check (Trigger once per minute)
                if (now.getHours() === h && now.getMinutes() === m) {
                    const key = `${prayer}-${now.getDate()}`;
                    
                    if (notificationsEnabledRef.current && !playedPrayersRef.current.has(key)) {
                        console.log("Triggering Adhan for", prayer);
                        playAudio(selectedAdhanRef.current.url);
                        playedPrayersRef.current.add(key);
                        
                        if (playedPrayersRef.current.size > 10) playedPrayersRef.current.clear();
                    }
                }

                const pDate = new Date();
                pDate.setHours(h, m, 0);
                
                if (pDate > now && !foundNext) {
                    setNextPrayer(prayer);
                    const diff = pDate.getTime() - now.getTime();
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    setTimeLeft(`- ${hours}h ${minutes}m`);
                    foundNext = true;
                }
            }
            
            if (!foundNext) {
                setNextPrayer('Fajr');
                setTimeLeft('Tomorrow');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [prayerTimes]);

    const PrayerRow = ({ name, time, isNext }: { name: string, time: string, isNext: boolean }) => (
        <div className={`flex justify-between items-center p-4 rounded-xl mb-2 transition-all ${isNext ? 'bg-primary text-white shadow-lg scale-[1.02]' : 'bg-white text-gray-700 border border-gray-100'}`}>
            <div className="flex items-center gap-3">
                {name === 'Fajr' || name === 'Isha' ? <Moon size={18} className={isNext ? 'text-accent' : 'text-gray-400'} /> : <Sun size={18} className={isNext ? 'text-accent' : 'text-gray-400'} />}
                <span className="font-semibold">{name}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="font-bold font-mono">{time?.split(' ')[0]}</span>
                <Bell size={16} className={isNext ? 'text-white/70' : 'text-gray-300'} />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full overflow-y-auto pb-24 relative">
            {/* Header Section */}
            <div className="bg-primary text-white p-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-white/80 text-xs uppercase tracking-wider mb-1">
                                {hijriDate ? `${hijriDate.day} ${hijriDate.month.en}, ${hijriDate.year}` : 'Loading...'}
                            </p>
                            <h1 className="text-2xl font-bold font-arabic">{hijriDate?.weekday.ar}</h1>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => setShowSettings(true)} className="bg-white/10 p-2 rounded-full backdrop-blur-sm hover:bg-white/20">
                                <Settings size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-sm text-accent font-semibold mb-1 uppercase tracking-widest">{nextPrayer ? `Next: ${nextPrayer}` : 'Prayer Times'}</p>
                        <h2 className="text-5xl font-bold tracking-tight mb-2">{timeLeft}</h2>
                    </div>

                    {/* Quick Access Buttons */}
                    <div className="flex justify-between gap-2 mb-2">
                        {[
                            { label: 'Quran', action: 'QURAN' },
                            { label: 'Qibla', action: 'QIBLA' },
                            { label: 'Duas', action: 'DUAS' },
                            { label: 'Names', action: 'NAMES_99' },
                        ].map((btn) => (
                            <button 
                                key={btn.label}
                                onClick={() => onNavigate(btn.action)}
                                className="flex-1 bg-white/20 backdrop-blur-sm py-3 rounded-xl text-xs font-semibold hover:bg-white/30 transition-colors"
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 relative z-10">
                {/* Daily Card */}
                {inspiration && (
                    <div className="bg-white p-5 rounded-2xl shadow-lg border-l-4 border-accent mb-6 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="flex justify-between items-start mb-2">
                             <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{inspiration.type} of the Day</span>
                             <button className="text-gray-400"><Share2 size={16} /></button>
                        </div>
                        <p className="text-right font-arabic text-xl leading-loose text-gray-800 mb-2" dir="rtl">{inspiration.arabic}</p>
                        <p className="text-sm text-gray-600 italic mb-2">"{inspiration.translation}"</p>
                        <p className="text-xs text-gray-500 font-semibold text-right">— {inspiration.reference}</p>
                    </div>
                )}

                <h3 className="font-bold text-gray-800 mb-3 px-1 flex items-center gap-2">
                    Prayer Schedule 
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                         {location ? 'Auto Loc' : 'Default Loc'}
                    </span>
                </h3>
                
                {prayerTimes ? (
                    <div className="space-y-1">
                        <PrayerRow name="Fajr" time={prayerTimes.Fajr} isNext={nextPrayer === 'Fajr'} />
                        <PrayerRow name="Sunrise" time={prayerTimes.Sunrise} isNext={false} />
                        <PrayerRow name="Dhuhr" time={prayerTimes.Dhuhr} isNext={nextPrayer === 'Dhuhr'} />
                        <PrayerRow name="Asr" time={prayerTimes.Asr} isNext={nextPrayer === 'Asr'} />
                        <PrayerRow name="Maghrib" time={prayerTimes.Maghrib} isNext={nextPrayer === 'Maghrib'} />
                        <PrayerRow name="Isha" time={prayerTimes.Isha} isNext={nextPrayer === 'Isha'} />
                    </div>
                ) : (
                    <div className="space-y-3">
                         {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>)}
                    </div>
                )}
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
                    <div className="bg-white w-full sm:w-96 rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Settings</h3>
                            <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>

                        <div className="space-y-6">
                            {/* Adhan Section */}
                            <div>
                                <label className="text-sm font-semibold text-gray-500 block mb-3">Adhan Sound</label>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {adhanOptions.map(opt => (
                                        <button 
                                            key={opt.name}
                                            onClick={() => handleAdhanSelect(opt)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl border ${selectedAdhan.name === opt.name ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 hover:bg-gray-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${selectedAdhan.name === opt.name ? 'bg-primary' : 'bg-gray-300'}`}></div>
                                                <span>{opt.name}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                 <button 
                                                    onClick={(e) => { 
                                                        e.stopPropagation(); 
                                                        togglePreview(opt.url);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-primary transition-colors"
                                                 >
                                                    {previewUrl === opt.url && isPlaying ? (
                                                        <Pause size={18} fill="currentColor" />
                                                    ) : (
                                                        <Play size={18} fill="currentColor" />
                                                    )}
                                                 </button>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Volume */}
                            <div>
                                <label className="text-sm font-semibold text-gray-500 block mb-3 flex justify-between">
                                    <span>Volume</span>
                                    <span>{Math.round(adhanVolume * 100)}%</span>
                                </label>
                                <input 
                                    type="range" 
                                    min="0" max="1" step="0.1"
                                    value={adhanVolume}
                                    onChange={(e) => handleSettingChange('adhanVolume', parseFloat(e.target.value))}
                                    className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                             {/* Calc Method */}
                             <div>
                                <label className="text-sm font-semibold text-gray-500 block mb-3">Calculation Method</label>
                                <select 
                                    value={calculationMethod}
                                    onChange={(e) => handleSettingChange('calculationMethod', parseInt(e.target.value))}
                                    className="w-full p-3 rounded-xl border border-gray-200 bg-white"
                                >
                                    <option value="2">ISNA (North America)</option>
                                    <option value="3">Muslim World League</option>
                                    <option value="4">Umm Al-Qura (Makkah)</option>
                                    <option value="5">Egyptian General Authority</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;