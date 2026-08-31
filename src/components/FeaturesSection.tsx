import React from 'react';
import { Video, Layers, BarChart3, Download, Zap, Shield, Sparkles, Sliders, CheckCircle, FileSpreadsheet, Eye, RefreshCw } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Video,
      title: 'Multi-Video Batch Processing',
      description: 'Queue dozens of road survey clips simultaneously. Process long highway routes in parallel with live status feeds.',
      tag: 'High Throughput',
    },
    {
      icon: Eye,
      title: 'Real-Time Tactical HUD Telemetry',
      description: 'Burn-in engineering HUD with real-time pothole counters, crack tallies, millisecond timestamps, and confidence ratings.',
      tag: 'OpenCV Overlay',
    },
    {
      icon: Layers,
      title: 'Multi-Scale Cavity Fusion',
      description: 'Eliminates broken bounding boxes. Unifies wide craters into single, solid physical defect contours with precision borders.',
      tag: 'Zero Fragmentation',
    },
    {
      icon: FileSpreadsheet,
      title: 'Forensic Audit & CSV Export',
      description: 'Export structured inspection logs with defect timestamps, bounding box coordinates, and frame counts for civil engineering teams.',
      tag: 'One-Click Export',
    },
    {
      icon: Zap,
      title: 'Universal Browser H.264 MP4',
      description: 'Automated server-side transcoding ensures processed videos play instantly in any web browser without codec errors.',
      tag: 'Fast Playback',
    },
    {
      icon: Shield,
      title: 'Zero Hardware Lock-In',
      description: 'Compatible with standard windshield dashcams, action cameras, municipal fleet cameras, and aerial drone recordings.',
      tag: 'Universal Camera',
    },
  ];

  return (
    <section id="features" className="py-20 bg-zinc-50/60 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Enterprise Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Engineered for Municipal Scale & Forensic Road Auditing
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600">
            Everything highway authorities, city planners, and civil engineering auditors need to inspect, report, and schedule road repairs efficiently.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all hover:border-emerald-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 group-hover:text-emerald-950 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center text-[11px] font-semibold text-emerald-600 group-hover:text-emerald-700">
                  <span>Standard Feature</span>
                  <CheckCircle className="w-3.5 h-3.5 ml-1 text-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
