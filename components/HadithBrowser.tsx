import React, { useState, useEffect } from 'react';
import { hadithCollectionsList, getStoredHadiths, toggleFavoriteItem, getAllFavorites } from '../services/islamicService';
import { HadithData } from '../types';
import { Search, Heart, Share2, ChevronLeft, Book, Bookmark, Loader2 } from 'lucide-react';

const HadithBrowser: React.FC = () => {
    const [view, setView] = useState<'COLLECTIONS' | 'LIST' | 'FAVORITES'>('COLLECTIONS');
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [hadiths, setHadiths] = useState<HadithData[]>([]);
    const [loading, setLoading] = useState(true);

    // Load Data from DB
    useEffect(() => {
        const load = async () => {
            const [h, f] = await Promise.all([
                getStoredHadiths(),
                getAllFavorites()
            ]);
            setHadiths(h);
            setFavorites(new Set(f));
            setLoading(false);
        };
        load();
    }, []);

    // Save favorites to DB
    const toggleFavorite = async (id: string) => {
        const isFav = await toggleFavoriteItem(id);
        const newFavs = new Set(favorites);
        if (isFav) newFavs.add(id);
        else newFavs.delete(id);
        setFavorites(newFavs);
    };

    const handleShare = async (hadith: HadithData) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Deen Companion - Hadith',
                    text: `"${hadith.text}" - ${hadith.source}`,
                });
            } catch (err) {
                console.log("Share failed", err);
            }
        } else {
            // Fallback for desktop (simplified)
            navigator.clipboard.writeText(`"${hadith.text}" - ${hadith.source}`);
            alert('Copied to clipboard!');
        }
    };

    // Filter Logic
    const getFilteredHadiths = () => {
        if (view === 'FAVORITES') {
            return hadiths.filter(h => favorites.has(h.id));
        }

        let filtered = hadiths;

        if (view === 'LIST' && selectedCollection) {
            filtered = filtered.filter(h => h.collectionId === selectedCollection);
        }

        if (searchQuery.trim()) {
            const lowerQ = searchQuery.toLowerCase();
            filtered = filtered.filter(h => 
                h.text.toLowerCase().includes(lowerQ) || 
                h.source.toLowerCase().includes(lowerQ) ||
                (h.arabic && h.arabic.includes(searchQuery))
            );
        }

        return filtered;
    };

    const displayHadiths = getFilteredHadiths();

    if (loading) {
         return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    const renderHeader = () => (
        <div className="bg-white p-4 shadow-sm z-10 sticky top-0">
            <div className="flex items-center gap-3 mb-4">
                {view !== 'COLLECTIONS' && !searchQuery ? (
                    <button onClick={() => { setView('COLLECTIONS'); setSelectedCollection(null); }} className="p-2 hover:bg-gray-100 rounded-full">
                        <ChevronLeft size={20} />
                    </button>
                ) : (
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <Book size={20} />
                    </div>
                )}
                <h2 className="text-xl font-bold text-primary">
                    {view === 'FAVORITES' ? 'Saved Hadiths' : selectedCollection ? hadithCollectionsList.find(c => c.id === selectedCollection)?.name : 'Hadith Collections'}
                </h2>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search Hadiths..." 
                    className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value && view === 'COLLECTIONS') setView('LIST');
                    }}
                />
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                    onClick={() => { setView('COLLECTIONS'); setSearchQuery(''); }}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${view !== 'FAVORITES' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Browse
                </button>
                <button 
                    onClick={() => setView('FAVORITES')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${view === 'FAVORITES' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Favorites
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-off-white">
            {renderHeader()}

            <div className="flex-1 overflow-y-auto p-4 pb-24">
                {view === 'COLLECTIONS' && !searchQuery ? (
                    <div className="grid gap-4">
                        {hadithCollectionsList.map(collection => (
                            <button 
                                key={collection.id}
                                onClick={() => { setSelectedCollection(collection.id); setView('LIST'); }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">{collection.name}</h3>
                                    <Book className="text-gray-200 group-hover:text-accent transition-colors" />
                                </div>
                                <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">{collection.count} Hadiths</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayHadiths.length > 0 ? (
                            displayHadiths.map(hadith => (
                                <div key={hadith.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-50">
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                                            {hadith.collectionName}
                                        </span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => toggleFavorite(hadith.id)}
                                                className={`p-1 transition-colors ${favorites.has(hadith.id) ? 'text-red-500' : 'text-gray-300 hover:text-gray-400'}`}
                                            >
                                                <Heart size={20} fill={favorites.has(hadith.id) ? "currentColor" : "none"} />
                                            </button>
                                            <button 
                                                onClick={() => handleShare(hadith)}
                                                className="p-1 text-gray-300 hover:text-primary"
                                            >
                                                <Share2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {hadith.arabic && (
                                        <p className="font-arabic text-xl text-right leading-loose text-gray-800 mb-4 dir-rtl" dir="rtl">
                                            {hadith.arabic}
                                        </p>
                                    )}
                                    
                                    <p className="text-gray-700 leading-relaxed text-sm mb-3">
                                        "{hadith.text}"
                                    </p>
                                    
                                    <p className="text-xs text-gray-400 font-semibold italic text-right">
                                        — {hadith.source}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <Book size={40} className="mb-4 opacity-20" />
                                <p>No Hadiths found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HadithBrowser;