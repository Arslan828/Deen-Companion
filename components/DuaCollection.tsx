import React, { useState, useEffect } from 'react';
import { getStoredDuas, toggleFavoriteItem, getAllFavorites } from '../services/islamicService';
import { Dua } from '../types';
import { Search, Heart, Share2, Loader2 } from 'lucide-react';

const DuaCollection: React.FC = () => {
    const [duas, setDuas] = useState<Dua[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    
    useEffect(() => {
        const loadData = async () => {
            const [fetchedDuas, fetchedFavs] = await Promise.all([
                getStoredDuas(),
                getAllFavorites()
            ]);
            setDuas(fetchedDuas);
            setFavorites(new Set(fetchedFavs));
            setLoading(false);
        };
        loadData();
    }, []);

    const toggleFav = async (id: string) => {
        const isNowFav = await toggleFavoriteItem(id);
        const newSet = new Set(favorites);
        if (isNowFav) newSet.add(id);
        else newSet.delete(id);
        setFavorites(newSet);
    };

    const categories = ['All', 'Morning', 'Evening', 'Travel', 'Food', 'Sleep', 'Home', 'Mosque', 'Toilet', 'Prayer', 'Difficulty'];

    const filteredDuas = duas.filter(dua => 
        (filter === 'All' || dua.category === filter) &&
        (dua.title.toLowerCase().includes(search.toLowerCase()) || dua.translation.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-off-white p-4">
            <h2 className="text-2xl font-bold text-primary mb-4">Hisnul Muslim</h2>
            
            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search Duas..." 
                    className="w-full bg-white pl-10 pr-4 py-3 rounded-xl shadow-sm border-none focus:ring-2 focus:ring-primary outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${filter === cat ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-100'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto pb-24 space-y-4">
                {filteredDuas.map((dua) => (
                    <div key={dua.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{dua.category}</span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => toggleFav(dua.id)}
                                    className={`transition-colors ${favorites.has(dua.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                >
                                    <Heart size={18} fill={favorites.has(dua.id) ? "currentColor" : "none"} />
                                </button>
                                <button className="text-gray-400 hover:text-primary"><Share2 size={18} /></button>
                            </div>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">{dua.title}</h3>
                        <p className="font-arabic text-2xl text-right leading-loose text-primary mb-3 dir-rtl">{dua.arabic}</p>
                        <p className="text-xs text-gray-400 mb-2 italic">{dua.transliteration}</p>
                        <p className="text-sm text-gray-700">{dua.translation}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DuaCollection;