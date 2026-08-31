import React, { useState, useEffect } from 'react';
import { ShieldCheck, Video, Activity, Sparkles, ChevronRight, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'playground';
  onNavigate: (view: 'landing' | 'playground') => void;
  activeCount: number;
}

export const Header: React.FC<NavbarProps> = ({ currentView, onNavigate, activeCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Periodic API health check for real-time indicator
    const checkHealth = async () => {
      const start = performance.now();
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const lat = Math.round(performance.now() - start);
          setLatencyMs(lat);
          setApiOnline(true);
        } else {
          setApiOnline(false);
        }
      } catch {
        setApiOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200/90 shadow-xs'
          : 'bg-white border-b border-zinc-100'
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
                <span className="text-base font-bold text-zinc-900 tracking-tight">RoadGuard AI</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase tracking-wider">
                  {currentView === 'playground' ? 'Live Playground' : ''}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden md:block">Real-Time Road Defect Intelligence & Inspection</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          {currentView === 'landing' ? (
            <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-zinc-600">
              <button
                onClick={() => onNavigate('playground')}
                className="hover:text-emerald-600 font-bold text-zinc-900 transition-colors cursor-pointer flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200/60"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Playground</span>
                {activeCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </button>
              <button
                onClick={() => scrollToSection('pipeline')}
                className="hover:text-emerald-600 transition-colors cursor-pointer"
              >
                AI Pipeline
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="hover:text-emerald-600 transition-colors cursor-pointer"
              >
                Capabilities
              </button>
              <button
                onClick={() => scrollToSection('solutions')}
                className="hover:text-emerald-600 transition-colors cursor-pointer"
              >
                Solutions
              </button>
              <button
                onClick={() => scrollToSection('benchmarks')}
                className="hover:text-emerald-600 transition-colors cursor-pointer"
              >
                Benchmarks
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="hover:text-emerald-600 transition-colors cursor-pointer"
              >
                FAQ
              </button>
            </nav>
          ) : (
            <nav className="hidden lg:flex items-center gap-4 text-xs font-medium">
              <button
                onClick={() => onNavigate('landing')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              >
                <span>← Back to Landing Page</span>
              </button>
              <div className="h-4 w-px bg-zinc-200" />
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-md font-mono text-[11px]">
                <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                <span>Active Workbench Session</span>
              </div>
            </nav>
          )}

          {/* Right Action & Real-Time Status */}
          <div className="flex items-center gap-3">
            {/* Live Model Telemetry Status */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200/80 text-[11px] text-zinc-600">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="font-mono text-zinc-700">
                {apiOnline ? ` ${latencyMs ? `• ${latencyMs}ms` : ''}` : 'Engine Connecting...'}
              </span>
            </div>

            {/* Launch Inspector CTA Button / Switch View */}
            {currentView === 'landing' ? (
              <button
                type="button"
                onClick={() => onNavigate('playground')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm shadow-emerald-600/20 transition-all cursor-pointer hover:shadow-md hover:scale-[1.02]"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Enter Playground</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-80" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl border border-zinc-300 transition-colors cursor-pointer"
              >
                <span>Landing Page</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-zinc-100 flex flex-col gap-2">
            {currentView === 'landing' ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('playground');
                  }}
                  className="text-left px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg flex items-center justify-between"
                >
                  <span>Enter Video Playground</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection('pipeline')}
                  className="text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg"
                >
                  AI Detection Pipeline
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg"
                >
                  Enterprise Capabilities
                </button>
                <button
                  onClick={() => scrollToSection('solutions')}
                  className="text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg"
                >
                  Industry Solutions
                </button>
                <button
                  onClick={() => scrollToSection('benchmarks')}
                  className="text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg"
                >
                  Accuracy Benchmarks
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-left px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg"
                >
                  FAQ & Documentation
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('landing');
                  }}
                  className="text-left px-3 py-2 text-xs font-bold text-zinc-800 bg-zinc-100 rounded-lg"
                >
                  ← Back to Landing Page
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
