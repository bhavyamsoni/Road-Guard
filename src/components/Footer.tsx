import React from 'react';
import { ShieldCheck, Terminal, Heart, ArrowUp, Activity, ExternalLink } from 'lucide-react';

interface FooterProps {
  onEnterPlayground: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onEnterPlayground }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 text-xs border-t border-zinc-800">
      {/* Top CTA Banner */}
      <div className="border-b border-zinc-800/80 py-12 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[11px] mb-2 border border-emerald-500/20">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>READY FOR LIVE INSPECTION</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Start Detecting Road Potholes & Cracks in Minutes
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl">
              Upload your survey videos or try preloaded realistic clips to evaluate our multi-scale cavity detection engine.
            </p>
          </div>

          <button
            type="button"
            onClick={onEnterPlayground}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/40 transition-all cursor-pointer hover:scale-105 shrink-0"
          >
            Enter AI Playground &rarr;
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5 text-white font-bold text-base">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>RoadGuard AI</span>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Enterprise computer vision platform for automated pavement defect detection, cavity fusion, and spatio-temporal road asset tracking.
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All AI Pipeline Services Operational</span>
          </div>
        </div>

        {/* Column 2: Platform Modules */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">AI Engine</h4>
          <ul className="space-y-2 text-zinc-400 text-xs">
            <li><button onClick={onEnterPlayground} className="hover:text-white transition-colors cursor-pointer">Live Video Playground</button></li>
            <li><a href="#pipeline" className="hover:text-white transition-colors">Cavity Black-Hat Morphology</a></li>
            <li><a href="#pipeline" className="hover:text-white transition-colors">Directional Crack Ridge Filter</a></li>
            <li><a href="#pipeline" className="hover:text-white transition-colors">Spatio-Temporal Tracker</a></li>
            <li><a href="#pipeline" className="hover:text-white transition-colors">Asphalt Plane Isolator</a></li>
          </ul>
        </div>

        {/* Column 3: Industry Solutions */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Solutions</h4>
          <ul className="space-y-2 text-zinc-400 text-xs">
            <li><a href="#solutions" className="hover:text-white transition-colors">Smart City Public Works</a></li>
            <li><a href="#solutions" className="hover:text-white transition-colors">State Highway Authorities (DOT)</a></li>
            <li><a href="#solutions" className="hover:text-white transition-colors">Commercial Fleet Logistics</a></li>
            <li><a href="#solutions" className="hover:text-white transition-colors">Pavement Resurfacing Audits</a></li>
            <li><a href="#benchmarks" className="hover:text-white transition-colors">ROI & Efficiency Calculator</a></li>
          </ul>
        </div>

        {/* Column 4: System Specs */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Specs & Formats</h4>
          <div className="space-y-2 text-zinc-400 text-xs font-mono">
            <div><span className="text-zinc-500">Video In:</span> MP4, MOV, AVI, MKV</div>
            <div><span className="text-zinc-500">Video Out:</span> H.264 Web-Native MP4</div>
            <div><span className="text-zinc-500">Data Out:</span> Forensic CSV & JSON</div>
            <div><span className="text-zinc-500">Runtime:</span> Python 3.10 + OpenCV</div>
            <div><span className="text-zinc-500">Latency:</span> &lt;45ms / frame (60 FPS)</div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} RoadGuard AI. Automated Road Video Defect Intelligence.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
