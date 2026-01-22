import React from 'react';
import { ViewState } from '../types';
import { Activity, Heart, Book, Sparkles, Settings, Star, Info, Moon } from 'lucide-react';

interface Props {
    onNavigate: (view: ViewState) => void;
}

const MoreMenu: React.FC<Props> = ({ onNavigate }) => {
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
                <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-50 text-left">
                    <Settings className="text-gray-400" size={20} />
                    <span className="text-gray-700">App Settings</span>
                </button>
                <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-50 text-left">
                    <Moon className="text-gray-400" size={20} />
                    <span className="text-gray-700">Dark Mode</span>
                </button>
                <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 text-left">
                    <Info className="text-gray-400" size={20} />
                    <span className="text-gray-700">About</span>
                </button>
            </div>
        </div>
    );
};

export default MoreMenu;