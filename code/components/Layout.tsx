import React from 'react';
import { BookOpen, Mic } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onLiveClick: () => void;
  goHome: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLiveClick, goHome }) => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-serif">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={goHome}>
            <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:bg-indigo-700 transition-colors">
              <BookOpen size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-stone-800 font-sans">ReadWithMe</h1>
          </div>
          
          <button 
            onClick={onLiveClick}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-stone-50 rounded-full hover:bg-stone-700 transition-all font-sans text-sm font-medium shadow-sm active:scale-95"
          >
            <Mic size={16} />
            <span>Voice Mode</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
};
