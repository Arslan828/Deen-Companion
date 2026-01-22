import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';
import { saveTasbihSession, getTasbihHistory } from '../services/islamicService';

const TasbihCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [history, setHistory] = useState<{timestamp: Date, count: number}[]>([]);

  useEffect(() => {
      getTasbihHistory().then(setHistory);
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    if (newCount % target === 0 && soundEnabled) {
       if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
  };

  const handleReset = async () => {
    if (count > 0) {
      await saveTasbihSession(count);
      const h = await getTasbihHistory();
      setHistory(h);
    }
    setCount(0);
  };

  return (
    <div className="flex flex-col items-center h-full p-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-primary mb-6">Tasbih Counter</h2>
      
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center relative border border-gray-100">
        <div className="absolute top-4 right-4 flex space-x-2">
           <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-gray-400 hover:text-primary transition-colors"
           >
             {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
           </button>
           <button 
            onClick={handleReset}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
           >
             <RotateCcw size={20} />
           </button>
        </div>

        <div className="mb-8 mt-4 text-center">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Target: {target}</span>
            <div className="flex justify-center space-x-2 mt-2">
                {[33, 99, 100].map(t => (
                    <button 
                        key={t}
                        onClick={() => { setTarget(t); setCount(0); }}
                        className={`px-3 py-1 text-xs rounded-full ${target === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>

        {/* Counter Display */}
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-inner mb-8 text-white relative">
            <div className="absolute inset-2 rounded-full border-4 border-white/20 border-dashed animate-spin-slow"></div>
            <span className="text-7xl font-bold font-mono">{count}</span>
        </div>

        {/* Click Button */}
        <button 
            onClick={handleIncrement}
            className="w-full bg-accent hover:bg-yellow-500 active:scale-95 transition-all text-white font-bold py-6 rounded-2xl shadow-lg text-xl flex items-center justify-center gap-2"
        >
           <span className="w-4 h-4 rounded-full bg-white/30"></span> 
           Tap to Count
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
          <div className="w-full max-w-sm mt-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Recent Sessions</h3>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {history.map((h, i) => (
                      <div key={i} className="flex justify-between p-3 border-b border-gray-50 last:border-0 text-sm">
                          <span className="text-gray-600">{h.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className="font-bold text-primary">{h.count} Dhikr</span>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default TasbihCounter;