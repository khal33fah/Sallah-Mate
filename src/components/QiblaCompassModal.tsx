import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Compass,
  Navigation,
  MapPin,
  Sparkles,
  Info,
  CheckCircle2,
  RefreshCw,
  Sun,
  Shield,
  HelpCircle,
  Sliders,
  RotateCw,
  ArrowUp
} from 'lucide-react';
import { calculateQiblaDirection, calculateKaabaDistance, playSpiritualChime, POPULAR_LOCATIONS } from '../utils/prayerTimes';
import { LocationConfig } from '../types';

interface QiblaCompassModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation?: LocationConfig;
}

export const QiblaCompassModal: React.FC<QiblaCompassModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
}) => {
  // Use passed location or Nigeria Abuja fallback
  const [activeLocation, setActiveLocation] = useState<LocationConfig>(() => {
    if (currentLocation) return currentLocation;
    try {
      const saved = localStorage.getItem('sallah_selected_location');
      if (saved) return JSON.parse(saved);
    } catch {}
    return POPULAR_LOCATIONS[0];
  });

  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSupport, setHasCompassSupport] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [showFiqhGuide, setShowFiqhGuide] = useState<boolean>(false);

  // Exact target Qibla bearing from active location
  const qiblaAngle = Math.round(
    calculateQiblaDirection(activeLocation.latitude, activeLocation.longitude)
  );

  // Distance to Kaaba
  const kaabaDistance = calculateKaabaDistance(activeLocation.latitude, activeLocation.longitude);

  // Current heading to use: device sensor if available and not in manual mode, else manualHeading
  const currentHeading = isManualMode || !hasCompassSupport ? manualHeading : deviceHeading;

  // Relative angle to Kaaba from user's current facing direction
  // (qiblaAngle - currentHeading + 360) % 360
  const relativeAngle = ((qiblaAngle - currentHeading + 360) % 360);

  // Aligned within ±4 degrees
  const isAligned = relativeAngle <= 4 || relativeAngle >= 356;
  const hasChimedRef = useRef<boolean>(false);

  // When user reaches perfect alignment, trigger celebratory haptic and chime once
  useEffect(() => {
    if (isAligned && !hasChimedRef.current) {
      hasChimedRef.current = true;
      playSpiritualChime('takbeer');
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([40, 50, 40]);
        } catch {}
      }
    } else if (!isAligned) {
      hasChimedRef.current = false;
    }
  }, [isAligned]);

  // Set up device orientation listeners
  useEffect(() => {
    if (!isOpen) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      // webkitCompassHeading is available on iOS Safari (0 is North)
      // alpha is available on Android / standard browsers (0 is North if absolute: true)
      let heading: number | null = null;

      if ((e as any).webkitCompassHeading !== undefined && (e as any).webkitCompassHeading !== null) {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null && e.alpha !== undefined) {
        // On Android, alpha increases counter-clockwise, so compass heading is 360 - alpha
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null && !isNaN(heading)) {
        setDeviceHeading(Math.round(heading));
        setHasCompassSupport(true);
      }
    };

    // Check for absolute device orientation if available
    try {
      if ('ondeviceorientationabsolute' in (window as any)) {
        window.addEventListener('deviceorientationabsolute' as any, handleOrientation as any, true);
      } else if ('ondeviceorientation' in window) {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    } catch {}

    return () => {
      try {
        window.removeEventListener('deviceorientationabsolute' as any, handleOrientation as any, true);
        window.removeEventListener('deviceorientation', handleOrientation, true);
      } catch {}
    };
  }, [isOpen]);

  // Request iOS permission if needed
  const requestIOSCompassPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionState('granted');
          playSpiritualChime('gentle');
        } else {
          setPermissionState('denied');
          setIsManualMode(true);
        }
      } catch (err) {
        setPermissionState('denied');
        setIsManualMode(true);
      }
    }
  };

  // High-precision live GPS locator
  const handleDetectLiveGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingGPS(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLoc: LocationConfig = {
          city: 'My Current Location (GPS)',
          country: 'Local Coordinates',
          latitude: parseFloat(latitude.toFixed(4)),
          longitude: parseFloat(longitude.toFixed(4)),
          calculationMethod: 'MuslimWorldLeague',
          asrMethod: 'standard',
        };
        setActiveLocation(newLoc);
        setIsLocatingGPS(false);
        playSpiritualChime('gentle');
      },
      (error) => {
        setIsLocatingGPS(false);
        setGpsError(
          error.code === error.PERMISSION_DENIED
            ? 'Location permission denied. Please allow location or select a city below.'
            : 'Unable to retrieve your location. Check your GPS.'
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  if (!isOpen) return null;

  // Directions text for user guidance (e.g. "Turn 24° to your right")
  const getGuidanceText = () => {
    if (isAligned) {
      return {
        text: 'Alhamdulillah! You are directly facing the Holy Kaaba in Mecca.',
        subtext: 'Align your prayer rug in this exact line of sight.',
        color: 'text-emerald-300',
        bgColor: 'bg-emerald-950/80 border-emerald-500/60 shadow-lg shadow-emerald-950/50'
      };
    }

    if (relativeAngle <= 180) {
      return {
        text: `Turn ${Math.round(relativeAngle)}° to your right ↻`,
        subtext: 'Rotate clockwise until the needle aligns with the Kaaba.',
        color: 'text-amber-300',
        bgColor: 'bg-stone-900/90 border-amber-500/40'
      };
    } else {
      const leftAngle = Math.round(360 - relativeAngle);
      return {
        text: `Turn ${leftAngle}° to your left ↺`,
        subtext: 'Rotate counter-clockwise until the needle aligns with the Kaaba.',
        color: 'text-amber-300',
        bgColor: 'bg-stone-900/90 border-amber-500/40'
      };
    }
  };

  const guidance = getGuidanceText();

  // Cardinal point name from heading
  const getCardinalDirection = (deg: number) => {
    const points = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(deg / 22.5) % 16;
    return points[idx];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-stone-900 border border-emerald-500/40 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 px-5 sm:px-6 py-4 border-b border-emerald-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-inner">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white tracking-tight">
                  Qibla Direction Navigator
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-semibold uppercase">
                  GPS & Compass
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Exact bearing towards the Holy Kaaba in Makkah al-Mukarramah
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition border border-stone-700/60"
            title="Close navigator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Location & GPS Bar */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-stone-200">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">
                  {activeLocation.city}, {activeLocation.country}
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  {activeLocation.latitude}° N, {activeLocation.longitude}° E • {kaabaDistance.km.toLocaleString()} km ({kaabaDistance.miles.toLocaleString()} mi) to Kaaba
                </span>
              </div>
            </div>

            <button
              onClick={handleDetectLiveGPS}
              disabled={isLocatingGPS}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50 shrink-0"
              title="Detect your exact GPS coordinates right now"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocatingGPS ? 'animate-spin' : ''}`} />
              <span>{isLocatingGPS ? 'Detecting GPS...' : 'Use Live GPS'}</span>
            </button>
          </div>

          {gpsError && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between">
              <span>{gpsError}</span>
              <button
                onClick={() => setGpsError(null)}
                className="text-stone-400 hover:text-white ml-2 text-xs"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* iOS Safari Permission Banner */}
          {typeof DeviceOrientationEvent !== 'undefined' &&
            typeof (DeviceOrientationEvent as any).requestPermission === 'function' &&
            permissionState === 'prompt' && (
              <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Enable Mobile Compass:</strong> Tap to activate real-time device motion sensors.
                  </span>
                </div>
                <button
                  onClick={requestIOSCompassPermission}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0"
                >
                  Enable Sensor
                </button>
              </div>
            )}

          {/* Interactive Dynamic Compass Disc */}
          <div className="flex flex-col items-center justify-center pt-2 pb-2">
            
            {/* The Compass Outer Container */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center select-none">
              
              {/* Outer Decorative Glow Ring */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isAligned
                    ? 'ring-4 ring-emerald-400 shadow-2xl shadow-emerald-500/60 bg-emerald-950/20'
                    : 'ring-2 ring-stone-800 shadow-xl bg-stone-950/60'
                }`}
              />

              {/* Fixed Top Phone Pointer (Phone's forward direction) */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-emerald-400 drop-shadow" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 font-mono mt-0.5">
                  Your Phone Top
                </span>
              </div>

              {/* Rotating Compass Dial: Rotates opposite to current device heading */}
              <div
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-full relative transition-transform duration-100 ease-out border border-stone-800"
                style={{
                  transform: `rotate(${-currentHeading}deg)`,
                }}
              >
                {/* Cardinal Points Markings */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-black text-rose-500 font-mono">
                  N (0°)
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-stone-300 font-mono">
                  E (90°)
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-black text-stone-300 font-mono">
                  S (180°)
                </div>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-stone-300 font-mono">
                  W (270°)
                </div>

                {/* Sub-cardinal Points */}
                <div className="absolute top-8 right-10 text-[9px] font-bold text-stone-500 font-mono">
                  NE
                </div>
                <div className="absolute bottom-8 right-10 text-[9px] font-bold text-stone-500 font-mono">
                  SE
                </div>
                <div className="absolute bottom-8 left-10 text-[9px] font-bold text-stone-500 font-mono">
                  SW
                </div>
                <div className="absolute top-8 left-10 text-[9px] font-bold text-stone-500 font-mono">
                  NW
                </div>

                {/* 360 Degree Ticks Ring */}
                <div className="absolute inset-4 rounded-full border border-dashed border-stone-800/80 pointer-events-none" />

                {/* KAABA QIBLA NEEDLE: Points to qiblaAngle on the rotating compass dial */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    transform: `rotate(${qiblaAngle}deg)`,
                  }}
                >
                  {/* Needle pointing outward to Qibla */}
                  <div className="w-1.5 h-28 -translate-y-14 bg-gradient-to-t from-emerald-600 via-amber-400 to-amber-300 rounded-t-full shadow-lg flex flex-col items-center justify-start pt-1 relative">
                    {/* Golden Kaaba Icon at the tip */}
                    <div className="w-7 h-7 -mt-4 rounded-lg bg-stone-950 border-2 border-amber-400 flex items-center justify-center text-xs shadow-md shadow-amber-500/50">
                      🕋
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Hub Indicator */}
              <div className="absolute w-20 h-20 rounded-full bg-stone-900/90 border-2 border-stone-700 flex flex-col items-center justify-center text-center z-10 shadow-lg">
                <span className="text-[10px] text-stone-400 font-semibold uppercase">Qibla</span>
                <span className="text-base font-extrabold text-amber-300 font-mono leading-none mt-0.5">
                  {qiblaAngle}°
                </span>
                <span className="text-[9px] font-medium text-emerald-400 mt-0.5">
                  {getCardinalDirection(qiblaAngle)}
                </span>
              </div>
            </div>

            {/* Live Guidance Alert Card */}
            <div
              className={`mt-4 w-full p-4 rounded-2xl border transition-all duration-300 text-center space-y-1 ${guidance.bgColor}`}
            >
              <div className="flex items-center justify-center gap-2">
                {isAligned ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                ) : (
                  <Navigation className="w-4 h-4 text-amber-400" />
                )}
                <h3 className={`font-bold text-sm sm:text-base ${guidance.color}`}>
                  {guidance.text}
                </h3>
              </div>
              <p className="text-xs text-stone-300">{guidance.subtext}</p>
            </div>
          </div>

          {/* Heading Stats Row */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 space-y-0.5">
              <span className="text-[10px] text-stone-400 font-semibold uppercase block">
                Current Facing
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {currentHeading}° {getCardinalDirection(currentHeading)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 space-y-0.5">
              <span className="text-[10px] text-stone-400 font-semibold uppercase block">
                Mecca Qibla
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {qiblaAngle}° {getCardinalDirection(qiblaAngle)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 space-y-0.5">
              <span className="text-[10px] text-stone-400 font-semibold uppercase block">
                Difference
              </span>
              <span
                className={`font-mono font-bold text-sm ${
                  isAligned ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {Math.round(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle)}°
              </span>
            </div>
          </div>

          {/* Manual Direction Adjustment Slider (For Desktop or Weak Sensors) */}
          <div className="bg-stone-950/90 border border-stone-800/90 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-stone-200">
                  {isManualMode || !hasCompassSupport ? 'Manual Orientation Dial' : 'Sensor Active'}
                </span>
              </div>
              <button
                onClick={() => setIsManualMode(!isManualMode)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
              >
                {isManualMode ? 'Switch to Sensor' : 'Switch to Manual Dial'}
              </button>
            </div>

            {(isManualMode || !hasCompassSupport) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>Rotate your facing direction manually:</span>
                  <span className="font-mono font-bold text-emerald-300">{manualHeading}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={manualHeading}
                  onChange={(e) => setManualHeading(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
                />
                <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span>0° N</span>
                  <span>90° E</span>
                  <span>180° S</span>
                  <span>270° W</span>
                  <span>360° N</span>
                </div>
              </div>
            )}
          </div>

          {/* Environmental Navigation Tips (Sun, Shadows & Calibration) */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-200">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="font-bold">Natural Environmental Navigation Tips</span>
              </div>
              <button
                onClick={() => setShowFiqhGuide(!showFiqhGuide)}
                className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Islamic Ruling</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-stone-300">
              <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800/60">
                <strong className="text-amber-300 block mb-1">Magnetic Interference in Buildings:</strong>
                If inside reinforced concrete or near metal desks, step away from electronic appliances and rotate your phone in a figure-8 motion to calibrate the magnetometer.
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800/60">
                <strong className="text-emerald-300 block mb-1">Sun & Shadow Method:</strong>
                In West Africa (Nigeria/Ghana), the Qibla is generally East-North-East (approx 65°–70°). Facing the morning sunrise and angling slightly to the left will place you facing Mecca.
              </div>
            </div>

            {/* Collapsible Fiqh Ruling for Unsure Travelers */}
            {showFiqhGuide && (
              <div className="mt-3 p-3 bg-stone-900/90 rounded-xl border border-emerald-500/30 text-[11px] text-stone-300 space-y-1.5 animate-in fade-in">
                <strong className="text-emerald-400 block font-semibold">
                  Fiqh of Facing the Qibla in Unfamiliar Environments (Ijtihad al-Qibla):
                </strong>
                <p className="italic text-stone-300">
                  "If a believer is in an unfamiliar place where the Qibla cannot be definitively determined, they should make their best sincere effort (Ijtihad) using available indicators (compass, sun, road direction), and pray. Their prayer is completely valid and they do not need to repeat it, even if they discover afterward that the direction was slightly off."
                </p>
                <p className="text-[10px] text-stone-400">
                  — Sunan at-Tirmidhi 345, Sahih al-Bukhari. Allah says: <em>"Wherever you turn, there is the Face of Allah."</em> (Surah Al-Baqarah 2:115).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate max-w-[240px] sm:max-w-none">
              Calculated using Great Circle Geodesic to Kaaba (21.4225° N, 39.8262° E)
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
