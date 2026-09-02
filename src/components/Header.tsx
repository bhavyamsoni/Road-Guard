import React, { useState, useEffect } from 'react';
import { ShieldCheck, Video, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'playground';
  onNavigate: (view: 'landing' | 'playground') => void;
  activeCount: number;
  darkMode: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<NavbarProps> = ({ currentView, onNavigate, activeCount, darkMode, onToggleDark }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/90 dark:border-zinc-800/90 shadow-xs'
          : 'bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-emerald-600/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">RoadGuard AI</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 uppercase tracking-wider">
                  {currentView === 'playground' ? 'Live Playground' : ''}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden md:block">Real-Time Road Defect Intelligence & Inspection</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-medium">
            {currentView === 'playground' && (
              <button
                onClick={() => onNavigate('landing')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                <span>← Back to Landing Page</span>
              </button>
            )}
          </nav>

          {/* Right Action & Real-Time Status */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDark}
              className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 transition-colors cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Launch Inspector CTA Button / Switch View */}
            {currentView === 'landing' ? (
              <button
                type="button"
                onClick={() => onNavigate('playground')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm shadow-emerald-600/20 transition-all cursor-pointer hover:shadow-md hover:scale-[1.02]"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Enter Playground</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
