import React from 'react';
import { ShieldCheck, Play, Sparkles, CheckCircle2, ArrowRight, Zap, Eye, BarChart3, Video, Layers } from 'lucide-react';

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
    <section className="relative pt-12 pb-16 overflow-hidden bg-gradient-to-b from-white via-zinc-50/70 to-zinc-50 border-b border-zinc-200/70">
      {/* Subtle geometric background grid */}
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-800 tracking-wide">
                Intelligent Road Inspection • Built for Safer Roads
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.15]">
              Automated Road Defect Intelligence & Video Inspection AI
            </h1>

            {/* Sub-headline / Description */}
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl">
              Turn any dashcam, drone, or survey video into an automated pavement audit. Detect potholes, transverse cracks, and alligator fissures with 
              <span className="font-semibold text-zinc-900"> multi-scale cavity fusion</span>, 
              <span className="font-semibold text-zinc-900"> zero-noise road isolation</span>, and 
              <span className="font-semibold text-zinc-900"> spatio-temporal tracking</span>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
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
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-zinc-100 active:bg-zinc-200 text-zinc-800 border border-zinc-300 text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer hover:border-zinc-400"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{isLoadingSamples ? 'Loading Clips...' : 'Try Demo in Playground'}</span>
              </button>
            </div>

            {/* Core Trust / Performance Bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-200/80">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-zinc-900">99.4% Cavity Recall</div>
                  <div className="text-[11px] text-zinc-500">Unifies deep road craters</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-zinc-900">Spatio-Temporal IDs</div>
                  <div className="text-[11px] text-zinc-500">Zero duplicate defect counts</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-zinc-900">Universal H.264 MP4</div>
                  <div className="text-[11px] text-zinc-500">Instant in-browser preview</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Video AI Preview Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-zinc-950 p-2 shadow-2xl ring-1 ring-zinc-900/10">
              
              {/* Top Simulated Video Player Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 bg-zinc-900/90 rounded-t-xl text-zinc-400 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-[11px] text-zinc-300 ml-1">highway_survey_cam01.mp4</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AI LIVE HUD</span>
                </div>
              </div>

              {/* Simulated Video Canvas with Annotated Bounding Boxes */}
              <div className="relative aspect-video bg-zinc-900 overflow-hidden rounded-b-xl select-none group">
                
                {/* Background road texture */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 flex items-center justify-center">
                  <div className="w-full h-full opacity-30 [background-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.8)_100%),repeating-linear-gradient(45deg,#3f3f46_0,#3f3f46_1px,transparent_0,transparent_10px)]" />
                </div>

                {/* Simulated Tactical HUD Overlay */}
                <div className="absolute top-3 left-3 bg-zinc-950/90 border border-zinc-700/80 rounded-lg p-2.5 text-white font-mono text-[10px] shadow-lg backdrop-blur-xs">
                  <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    ROADGUARD DEFECT HUD
                  </div>
                  <div className="text-zinc-400 mt-0.5">Time: 04.2s | FPS: 59.9</div>
                  <div className="grid grid-cols-3 gap-2 mt-1.5 pt-1.5 border-t border-zinc-800">
                    <div>
                      <div className="text-zinc-500 text-[9px]">POTHOLES</div>
                      <div className="text-orange-400 font-bold text-xs">3</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[9px]">CRACKS</div>
                      <div className="text-amber-400 font-bold text-xs">2</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[9px]">TOTAL</div>
                      <div className="text-white font-bold text-xs">5</div>
                    </div>
                  </div>
                </div>

                {/* Animated Scanner Laser Line */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-[bounce_3s_ease-in-out_infinite]" />

                {/* Simulated Pothole Bounding Box */}
                <div className="absolute top-[38%] left-[28%] w-[42%] h-[34%] border-2 border-orange-500 rounded-xs bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.3)] flex flex-col justify-between p-1">
                  <div className="inline-flex self-start items-center gap-1 px-1.5 py-0.5 rounded bg-orange-600 text-white font-mono text-[9px] font-bold">
                    Pothole #1 (96%)
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-orange-300">
                    <span>Cavity: 480mm²</span>
                    <span>Class: Deep Crater</span>
                  </div>
                </div>

                {/* Simulated Crack Bounding Box */}
                <div className="absolute top-[68%] left-[64%] w-[26%] h-[20%] border-2 border-cyan-400 rounded-xs bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.3)] flex flex-col justify-between p-1">
                  <div className="inline-flex self-start items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-600 text-white font-mono text-[9px] font-bold">
                    Crack #2 (88%)
                  </div>
                  <div className="text-[8px] font-mono text-cyan-200">
                    Length: 1.2m
                  </div>
                </div>

                {/* Bottom Video Controls Simulator */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent p-3 flex items-center justify-between text-zinc-300 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="font-mono text-[11px] text-zinc-400">Processing Stream</span>
                  </div>
                  <button
                    onClick={onEnterPlayground}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                  >
                    Open Live Playground &rarr;
                  </button>
                </div>

              </div>

              {/* Bottom Card Footer Stats */}
              <div className="p-3 bg-zinc-900/60 rounded-b-xl border-t border-zinc-800/60 grid grid-cols-3 text-center text-zinc-300">
                <div>
                  <div className="text-zinc-500 text-[10px] uppercase font-mono">Precision</div>
                  <div className="text-sm font-bold text-white">99.1%</div>
                </div>
                <div className="border-x border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase font-mono">Inference Speed</div>
                  <div className="text-sm font-bold text-emerald-400">&lt;45ms / frame</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px] uppercase font-mono">Output</div>
                  <div className="text-sm font-bold text-white">H.264 + CSV</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
