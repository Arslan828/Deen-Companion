import React, { useState, useEffect } from 'react';
import { ViewState, GeoLocation } from './types';
import Home from './components/Home';
import QuranReader from './components/QuranReader';
import QiblaCompass from './components/QiblaCompass';
import TasbihCounter from './components/TasbihCounter';
import AskAI from './components/AskAI';
import Names99 from './components/Names99';
import DuaCollection from './components/DuaCollection';
import HadithBrowser from './components/HadithBrowser';
import MoreMenu from './components/MoreMenu';
import { initializeDatabase } from './services/islamicService';
import { Home as HomeIcon, BookOpen, Compass, Grid, MessageCircle, Heart, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewState>(ViewState.HOME);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [showDaroodReminder, setShowDaroodReminder] = useState(true);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    // Initialize DB
    initializeDatabase().then(() => {
        setDbReady(true);
    });

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Location error", error);
          // Default: Mecca
          setLocation({ latitude: 21.4225, longitude: 39.8262 }); 
        }
      );
    }
  }, []);

  const renderContent = () => {
    if (!dbReady) {
        return (
            <div className="flex h-full items-center justify-center flex-col gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-gray-500 font-medium">Initializing Database...</p>
            </div>
        );
    }

    switch (activeTab) {
      case ViewState.HOME: return <Home location={location} onNavigate={setActiveTab} />;
      case ViewState.QURAN: return <QuranReader />;
      case ViewState.QIBLA: return <QiblaCompass location={location} />;
      case ViewState.TASBIH: return <TasbihCounter />;
      case ViewState.AI_CHAT: return <AskAI />;
      case ViewState.NAMES_99: return <Names99 />;
      case ViewState.DUAS: return <DuaCollection />;
      case ViewState.HADITH: return <HadithBrowser />;
      case ViewState.MORE: return <MoreMenu onNavigate={setActiveTab} />;
      default: return <Home location={location} onNavigate={setActiveTab} />;
    }
  };

  const NavButton = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(view)}
      className={`flex flex-col items-center justify-center w-full py-2 transition-all duration-300 ${activeTab === view ? 'text-primary -translate-y-2' : 'text-gray-400'}`}
    >
      <div className={`p-2 rounded-full ${activeTab === view ? 'bg-primary text-white shadow-lg shadow-primary/30' : ''}`}>
        <Icon size={activeTab === view ? 24 : 22} strokeWidth={activeTab === view ? 2.5 : 2} />
      </div>
      <span className={`text-[10px] mt-1 font-medium ${activeTab === view ? 'opacity-100 font-bold' : 'opacity-70'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="h-screen w-full bg-off-white flex justify-center overflow-hidden font-sans text-gray-800">
      <div className="w-full max-w-md h-full bg-white relative flex flex-col shadow-2xl overflow-hidden">
        
        {/* Darood Reminder Overlay */}
        {showDaroodReminder && dbReady && (
          <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl p-6 text-center shadow-2xl w-full max-w-sm transform transition-all animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Heart size={32} fill="currentColor" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Reminder</h2>
              <p className="text-gray-600 mb-4">Please recite Darood o Salam on<br/>Prophet Muhammad (PBUH)</p>
              
              <div className="bg-primary/5 rounded-xl p-4 mb-6">
                <p className="font-arabic text-2xl text-primary leading-loose dir-rtl" dir="rtl">
                  اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ
                </p>
              </div>

              <button 
                onClick={() => setShowDaroodReminder(false)}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
              >
                I Have Recited
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {renderContent()}
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-100 px-2 pb-safe-area shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-30">
          <div className="flex justify-around items-center h-20">
            <NavButton view={ViewState.HOME} icon={HomeIcon} label="Home" />
            <NavButton view={ViewState.QURAN} icon={BookOpen} label="Quran" />
            <NavButton view={ViewState.QIBLA} icon={Compass} label="Qibla" />
            <NavButton view={ViewState.AI_CHAT} icon={MessageCircle} label="AI" />
            <NavButton view={ViewState.MORE} icon={Grid} label="More" />
          </div>
        </nav>

      </div>
    </div>
  );
}