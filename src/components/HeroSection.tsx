import React from 'react';
import { Play, Sparkles, CheckCircle2, ArrowRight, Zap, BarChart3, Video } from 'lucide-react';

interface HeroSectionProps {
  onEnterPlayground: () => void;
  onLoadSamplesAndEnterPlayground: () => void;
  isLoadingSamples?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onEnterPlayground,
  onLoadSamplesAndEnterPlayground,
  isLoadingSamples = false,
}) => {
  return (
    <section className="relative pt-12 pb-16 overflow-hidden bg-gradient-to-b from-white via-zinc-50/70 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border-b border-zinc-200/70 dark:border-zinc-800">
      {/* Subtle geometric background grid */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10 [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 items-center">
          
          {/* Main Column: Value Proposition & CTAs */}
          <div className="mx-auto text-center flex flex-col items-center space-y-6 max-w-3xl">
            
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 tracking-wide">
                Intelligent Road Inspection • Built for Safer Roads
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-[1.15]">
              Automated Road Defect Intelligence & Video Inspection AI
            </h1>

            {/* Sub-headline / Description */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Turn any dashcam, drone, or survey video into an automated pavement audit. Detect potholes, transverse cracks, and alligator fissures with 
              <span className="font-semibold text-zinc-900 dark:text-zinc-200"> multi-scale cavity fusion</span>, 
              <span className="font-semibold text-zinc-900 dark:text-zinc-200"> zero-noise road isolation</span>, and 
              <span className="font-semibold text-zinc-900 dark:text-zinc-200"> spatio-temporal tracking</span>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onEnterPlayground}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/25 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <Video className="w-4 h-4" />
                <span>Enter AI Playground</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onLoadSamplesAndEnterPlayground}
                disabled={isLoadingSamples}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 active:bg-zinc-200 text-zinc-800 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-600 text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isLoadingSamples ? 'Loading Clips...' : 'Try Demo in Playground'}</span>
              </button>
            </div>

            {/* Core Trust / Performance Bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-200/80 dark:border-zinc-700/80 w-full">
              <div className="flex items-start gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">99.4% Cavity Recall</div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-500">Unifies deep road craters</div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Spatio-Temporal IDs</div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-500">Zero duplicate defect counts</div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Universal H.264 MP4</div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-500">Instant in-browser preview</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
