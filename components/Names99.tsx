import React, { useEffect, useState } from 'react';
import { getStoredNames } from '../services/islamicService';
import { NameOfAllah } from '../types';
import { Play, Loader2 } from 'lucide-react';

const Names99: React.FC = () => {
    const [names, setNames] = useState<NameOfAllah[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStoredNames().then(data => {
            setNames(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-off-white p-4">
            <h2 className="text-2xl font-bold text-primary mb-6">99 Names of Allah</h2>
            
            <div className="flex-1 overflow-y-auto pb-24 space-y-4">
                {names.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-primary/5 p-6 flex justify-center items-center relative">
                            <span className="absolute top-3 left-4 text-xs font-bold text-primary/30">#{idx + 1}</span>
                            <h3 className="font-arabic text-4xl text-primary">{item.name}</h3>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-lg text-gray-800">{item.transliteration}</h4>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-accent hover:text-white transition-colors">
                                        <Play size={16} fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-accent font-medium text-sm mb-2">{item.meaning}</p>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.explanation}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Names99;