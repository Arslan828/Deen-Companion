import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Activity, Heart, Book, Sparkles, Settings, Star, Info, Moon, Sun } from 'lucide-react';
import { getAppSetting, saveAppSetting } from '../services/islamicService';

interface Props {
    onNavigate: (view: ViewState) => void;
    darkMode: boolean;
    setDarkMode: (dark: boolean) => void;
}

const MoreMenu: React.FC<Props> = ({ onNavigate, darkMode, setDarkMode }) => {
    const [showSettings, setShowSettings] = useState(false);

    const toggleDarkMode = async () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        await saveAppSetting('darkMode', newDarkMode);

        // Apply dark mode to document
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const menuItems = [
        { label: 'Tasbih', icon: Activity, view: ViewState.TASBIH, color: 'bg-blue-100 text-blue-600' },
        { label: '99 Names', icon: Star, view: ViewState.NAMES_99, color: 'bg-yellow-100 text-yellow-600' },
        { label: 'Duas', icon: Heart, view: ViewState.DUAS, color: 'bg-red-100 text-red-600' },
        { label: 'Hadith', icon: Book, view: ViewState.HADITH, color: 'bg-green-100 text-green-600' },
        { label: 'Ask AI', icon: Sparkles, view: ViewState.AI_CHAT, color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <div className="flex flex-col h-full bg-off-white p-6">
            <h2 className="text-2xl font-bold text-primary mb-8">More</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                {menuItems.map((item) => (
                    <button 
                        key={item.label}
                        onClick={() => onNavigate(item.view)}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color}`}>
                            <item.icon size={24} />
                        </div>
                        <span className="font-semibold text-gray-700">{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-50 text-left"
                >
                    <Settings className="text-gray-400" size={20} />
                    <span className="text-gray-700">App Settings</span>
                </button>
                <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-50 text-left"
                >
                    {darkMode ? <Sun className="text-gray-400" size={20} /> : <Moon className="text-gray-400" size={20} />}
                    <span className="text-gray-700">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 text-left">
                    <Info className="text-gray-400" size={20} />
                    <span className="text-gray-700">About</span>
                </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-4">
                    <h3 className="font-bold text-gray-800 mb-4">Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600 block mb-2">Theme</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleDarkMode()}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${!darkMode ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => toggleDarkMode()}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${darkMode ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                                >
                                    Dark
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-2">Language</label>
                            <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                                <option>English</option>
                                <option>العربية (Arabic)</option>
                                <option>اردو (Urdu)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-2">Prayer Method</label>
                            <select className="w-full p-2 border border-gray-200 rounded-lg text-sm">
                                <option>Islamic Society of North America</option>
                                <option>University of Islamic Sciences, Karachi</option>
                                <option>Umm Al-Qura University, Makkah</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoreMenu;