import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({ children }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sallah_device_frame_mode');
      if (saved) return saved === 'phone';
    } catch {}
    // Default to false so wide screens get fluid view, but users can toggle
    return false;
  });

  const toggleFrame = () => {
    const next = !isPhoneFrame;
    setIsPhoneFrame(next);
    try {
      localStorage.setItem('sallah_device_frame_mode', next ? 'phone' : 'fluid');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center">
      {/* Discreet floating Desktop/Phone View switcher - only visible on md+ screens */}
      <div className="hidden lg:flex fixed top-3 right-4 z-50 items-center gap-1.5 bg-stone-900/90 border border-stone-800 rounded-full p-1 text-[11px] shadow-xl backdrop-blur-md">
        <button
          onClick={() => {
            setIsPhoneFrame(true);
            try {
              localStorage.setItem('sallah_device_frame_mode', 'phone');
            } catch {}
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition ${
            isPhoneFrame
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Display inside an iPhone / Android smartphone bezel frame"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile Device View</span>
        </button>

        <button
          onClick={() => {
            setIsPhoneFrame(false);
            try {
              localStorage.setItem('sallah_device_frame_mode', 'fluid');
            } catch {}
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition ${
            !isPhoneFrame
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
          title="Expanded responsive mobile layout"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full Screen</span>
        </button>
      </div>

      {isPhoneFrame ? (
        <div className="py-6 px-4 flex justify-center w-full">
          {/* Smartphone Hardware Chassis */}
          <div className="relative w-full max-w-[430px] min-h-[880px] bg-stone-950 border-[10px] border-stone-900 rounded-[52px] shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_0_2px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col">
            {/* Speaker Ear Piece & Front Camera Cutout */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-stone-900 rounded-full z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-950/80 mr-2 ring-1 ring-stone-800" />
              <div className="w-8 h-1 rounded-full bg-stone-950/90" />
            </div>

            {/* App Content */}
            <div className="flex-1 w-full overflow-y-auto no-scrollbar pt-2">
              {children}
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="w-full flex justify-center pb-2 pt-1 bg-stone-950 select-none">
              <div className="w-32 h-1 rounded-full bg-stone-700/60" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl min-h-screen flex flex-col relative">
          {children}
        </div>
      )}
    </div>
  );
};
