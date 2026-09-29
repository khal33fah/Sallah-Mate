import React, { useState } from 'react';
import { X, MapPin, Check, Search, Compass, Navigation } from 'lucide-react';
import { LocationConfig } from '../types';
import { POPULAR_LOCATIONS, DEFAULT_NIGERIA_LOCATION } from '../utils/prayerTimes';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: LocationConfig;
  onSelectLocation: (location: LocationConfig) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGPS(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detectedLoc: LocationConfig = {
          city: 'Current Location',
          country: 'Device GPS',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          calculationMethod: 'MWL',
          asrMethod: 'standard',
        };
        onSelectLocation(detectedLoc);
        setIsDetectingGPS(false);
        onClose();
      },
      (err) => {
        setIsDetectingGPS(false);
        setGpsError('Could not acquire GPS position. Please check location permissions.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const filteredLocations = POPULAR_LOCATIONS.filter((loc) =>
    `${loc.city} ${loc.country}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-stone-950 border border-stone-800 rounded-t-[32px] sm:rounded-3xl shadow-2xl p-5 z-10 animate-sheet-up max-h-[85vh] flex flex-col">
        {/* iOS Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-stone-700 mx-auto mb-4" />

        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Select Prayer Location</h3>
            <p className="text-xs text-stone-400">Accurate prayer times & Qibla direction</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* GPS Button */}
        <div className="mt-4">
          <button
            onClick={handleDetectGPS}
            disabled={isDetectingGPS}
            className="w-full p-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/50 text-emerald-200 text-xs font-bold transition flex items-center justify-between touch-press shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Navigation className={`w-4 h-4 text-emerald-400 ${isDetectingGPS ? 'animate-spin' : ''}`} />
              {isDetectingGPS ? 'Acquiring GPS Signal...' : 'Use Current Device GPS'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-semibold uppercase">
              Auto
            </span>
          </button>

          {gpsError && (
            <p className="text-[11px] text-rose-400 mt-2 px-1">{gpsError}</p>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mt-3">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city or country..."
            className="w-full bg-stone-900/90 border border-stone-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500/60"
          />
        </div>

        {/* Locations List */}
        <div className="mt-3 overflow-y-auto space-y-1.5 flex-1 pr-1 no-scrollbar">
          {filteredLocations.map((loc) => {
            const isSelected =
              selectedLocation.city === loc.city && selectedLocation.country === loc.country;
            return (
              <button
                key={`${loc.city}-${loc.country}`}
                onClick={() => {
                  onSelectLocation(loc);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition touch-press ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-medium shadow-md shadow-emerald-950'
                    : 'bg-stone-900/60 hover:bg-stone-900 text-stone-300 border border-stone-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                  <div>
                    <div className="text-xs font-bold">{loc.city}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-stone-400'}`}>
                      {loc.country} • {loc.calculationMethod}
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
