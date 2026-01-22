import React, { useEffect, useState } from 'react';
import { Compass, MapPin, Loader2 } from 'lucide-react';
import { getQiblaDirection, getDistanceToMecca } from '../services/islamicService';
import { GeoLocation } from '../types';

interface Props {
    location: GeoLocation | null;
}

const QiblaCompass: React.FC<Props> = ({ location }) => {
    const [qiblaDirection, setQiblaDirection] = useState<number>(0);
    const [distance, setDistance] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location) {
            setLoading(true);
            getQiblaDirection(location.latitude, location.longitude)
                .then(dir => setQiblaDirection(dir))
                .finally(() => setLoading(false));
            
            setDistance(getDistanceToMecca(location.latitude, location.longitude));
        }
    }, [location]);

    if (!location) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MapPin className="text-gray-300 w-16 h-16 mb-4" />
                <p className="text-gray-500">Enable location to find Qibla direction.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center h-full p-6 animate-in zoom-in duration-500 bg-off-white">
            <h2 className="text-2xl font-bold text-primary mb-1">Qibla Direction</h2>
            <p className="text-gray-500 text-sm mb-6 flex items-center gap-1">
                <MapPin size={12} /> {distance.toLocaleString()} km to Mecca
            </p>

            <div className="relative w-80 h-80 flex items-center justify-center mb-8">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-[6px] border-white shadow-2xl bg-gray-50"></div>
                
                {/* Degree markings */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <div 
                        key={deg} 
                        className="absolute w-full text-center"
                        style={{ transform: `rotate(${deg}deg)` }}
                    >
                        <div className="mx-auto w-0.5 h-3 bg-gray-300 mt-2"></div>
                    </div>
                ))}
                
                {/* Cardinal Points */}
                {[0, 90, 180, 270].map((deg) => (
                    <div 
                        key={deg} 
                        className="absolute w-full text-center text-sm font-bold text-gray-400"
                        style={{ transform: `rotate(${deg}deg)` }}
                    >
                        <span className="bg-gray-50 px-1 relative top-6 inline-block transform -rotate-[${deg}deg]">
                            {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}
                        </span>
                    </div>
                ))}

                {/* Kaaba Direction Pointer */}
                {loading ? (
                    <Loader2 className="animate-spin text-primary relative z-10" />
                ) : (
                    <div 
                        className="absolute inset-0 transition-transform duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
                        style={{ transform: `rotate(${qiblaDirection}deg)` }}
                    >
                        <div className="h-full flex flex-col items-center pt-6">
                            {/* The Pointer */}
                            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-primary drop-shadow-md z-20"></div>
                            
                            {/* Kaaba Graphic */}
                            <div className="mt-2 w-12 h-12 bg-black rounded-sm border-t-2 border-accent relative shadow-lg flex items-center justify-center transform -rotate-[${qiblaDirection}deg]">
                                <div className="w-full h-[1px] bg-accent/80 absolute top-3"></div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Center Pivot */}
                <div className="absolute w-3 h-3 bg-accent rounded-full border-2 border-white shadow z-30"></div>
            </div>

            <div className="bg-white px-8 py-6 rounded-2xl shadow-sm text-center border border-gray-100 w-full max-w-xs">
                <span className="text-gray-400 text-xs uppercase tracking-widest block mb-2">Qibla Angle</span>
                <span className="text-5xl font-bold text-primary font-mono block mb-1">{qiblaDirection.toFixed(1)}°</span>
                <span className="text-xs text-gray-400 block">From True North</span>
            </div>
            
            <p className="mt-auto text-[10px] text-gray-400 max-w-xs text-center pb-20">
                Ensure your device is flat and away from magnetic interference. Top of screen represents North.
            </p>
        </div>
    );
};

export default QiblaCompass;