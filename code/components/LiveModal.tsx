import React, { useEffect, useState } from 'react';
import { X, Mic, MicOff, Loader2 } from 'lucide-react';
import { useLiveSession } from '../hooks/useLiveSession';

interface LiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveModal: React.FC<LiveModalProps> = ({ isOpen, onClose }) => {
  const { isActive, isConnecting, startSession, stopSession, volume, error } = useLiveSession();
  const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(12).fill(10));

  useEffect(() => {
    if (isOpen && !isActive && !isConnecting) {
      startSession();
    } else if (!isOpen && isActive) {
      stopSession();
    }
  }, [isOpen]); // Only react to open/close prop changes

  // Simple visualizer effect based on volume
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setVisualizerBars(prev => prev.map(() => 
        Math.max(10, Math.random() * 50 + (volume * 200)) // Random height boosted by volume
      ));
    }, 100);
    return () => clearInterval(interval);
  }, [isActive, volume]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-8 mt-4">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors duration-500 ${
              isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-stone-100 text-stone-400'
            }`}>
              {isConnecting ? (
                <Loader2 size={40} className="animate-spin" />
              ) : (
                <Mic size={40} />
              )}
            </div>
            {isActive && (
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500 animate-ping opacity-20"></div>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-stone-800 font-sans mb-2">
          {isConnecting ? 'Connecting...' : isActive ? 'Listening...' : 'Disconnected'}
        </h2>
        <p className="text-stone-500 text-center mb-8 max-w-xs">
          {isActive 
            ? "Go ahead, ask about a book, an author, or get a recommendation." 
            : "Starting your voice session with Gemini..."}
        </p>

        {error && (
          <div className="mb-6 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Visualizer */}
        <div className="flex items-end justify-center gap-1 h-16 w-full mb-6">
          {isActive ? visualizerBars.map((height, i) => (
            <div 
              key={i} 
              className="w-2 bg-indigo-500 rounded-full transition-all duration-100"
              style={{ height: `${height}%`, opacity: 0.5 + (height/200) }}
            />
          )) : (
            <div className="w-full h-[2px] bg-stone-200" />
          )}
        </div>

        <div className="flex gap-4">
           {isActive ? (
             <button 
               onClick={stopSession}
               className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors font-medium font-sans"
             >
               <MicOff size={18} /> End Session
             </button>
           ) : (
             <button 
              onClick={startSession}
              disabled={isConnecting}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors font-medium font-sans disabled:opacity-50"
             >
               <Mic size={18} /> Try Again
             </button>
           )}
        </div>
      </div>
    </div>
  );
};
