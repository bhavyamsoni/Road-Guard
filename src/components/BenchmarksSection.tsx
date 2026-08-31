import React, { useState } from 'react';
import { BarChart3, Check, X, Calculator, Zap, Shield, Sparkles, TrendingUp } from 'lucide-react';

export const BenchmarksSection: React.FC = () => {
  const [routeMiles, setRouteMiles] = useState(50);

  // Approximate metrics calculation
  const manualSurveyHours = Math.round(routeMiles * 1.8);
  const aiProcessingMinutes = Math.round(routeMiles * 0.9);
  const costSavingsDollars = Math.round(routeMiles * 85);
  const estimatedPotholesFound = Math.round(routeMiles * 3.4);

  const comparisonRows = [
    {
      metric: 'Crater Cavity Recall Rate',
      roadguard: '99.4% (Multi-Scale Fusion)',
      vanillaYolo: '72.1% (Fractured Boxes)',
      manual: '64.0% (Human Fatigue Bias)',
    },
    {
      metric: 'Road Noise & Texture Rejection',
      roadguard: 'Active (HSV & Luminance Mask)',
      vanillaYolo: 'Poor (Gravel/Shadow Triggers)',
      manual: 'Subjective / Inconsistent',
    },
    {
      metric: 'Multi-Frame Duplicate Prevention',
      roadguard: 'Spatio-Temporal Object Tracker',
      vanillaYolo: 'None (Repeated Frame Counts)',
      manual: 'Manual tally errors',
    },
    {
      metric: 'Survey Speed & Throughput',
      roadguard: 'Up to 60 MPH Video Ingestion',
      vanillaYolo: 'Real-time but noisy',
      manual: '5 - 15 MPH Road Crew Truck',
    },
    {
      metric: 'Report Generation Time',
      roadguard: 'Instant CSV, MP4 HUD & JSON',
      vanillaYolo: 'Raw bounding box coordinates',
      manual: '2 - 4 business days',
    },
    {
      metric: 'Lane Closure Requirement',
      roadguard: 'Zero (Standard Moving Vehicle)',
      vanillaYolo: 'Zero',
      manual: 'Frequent safety flaggers required',
    },
  ];

  return (
    <section id="benchmarks" className="py-20 bg-zinc-50/70 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            Empirical Benchmarks
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            How RoadGuard AI Outperforms Generic Models
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600">
            Engineered specifically for moving road perspectives, eliminating the failure modes of standard generic bounding-box detectors.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-100/70 font-bold text-zinc-800 uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-6">Evaluation Metric</th>
                  <th className="py-4 px-6 text-emerald-950 bg-emerald-50/80 border-x border-emerald-100">
                    <div className="flex items-center gap-1.5 font-extrabold">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>RoadGuard AI (Ours)</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-zinc-600">Vanilla Object Detector</th>
                  <th className="py-4 px-6 text-zinc-600">Manual Walking / Van Survey</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-zinc-900">{row.metric}</td>
                    <td className="py-3.5 px-6 font-bold text-emerald-900 bg-emerald-50/40 border-x border-emerald-100/80">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{row.roadguard}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-zinc-600">
                      <div className="flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{row.vanillaYolo}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-zinc-500">{row.manual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive ROI & Time-Savings Calculator Card */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Slider Control */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono">
                <Calculator className="w-3.5 h-3.5" />
                <span>MUNICIPAL SAVINGS ESTIMATOR</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Calculate Efficiency for Your Route
              </h3>
              
              <p className="text-xs text-zinc-400 leading-relaxed">
                Adjust your survey corridor length to see how automated video defect analysis reduces labor hours and maintenance turnaround times.
              </p>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-zinc-300">Survey Corridor Length:</span>
                  <span className="font-mono text-emerald-400 text-sm font-bold">{routeMiles} Miles</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="250"
                  step="5"
                  value={routeMiles}
                  onChange={(e) => setRouteMiles(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>5 mi (Township)</span>
                  <span>100 mi (County)</span>
                  <span>250 mi (Interstate)</span>
                </div>
              </div>
            </div>

            {/* Right Output Metric Badges */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/80 border border-zinc-700/80 rounded-xl p-4">
                <div className="text-[11px] font-mono uppercase text-zinc-400">Time Saved</div>
                <div className="text-2xl font-extrabold text-white mt-1">~{manualSurveyHours} hrs</div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Processed in {aiProcessingMinutes} mins
                </div>
              </div>

              <div className="bg-zinc-800/80 border border-zinc-700/80 rounded-xl p-4">
                <div className="text-[11px] font-mono uppercase text-zinc-400">Labor Cost Saved</div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                  ${costSavingsDollars.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Avg municipal rate</div>
              </div>

              <div className="bg-zinc-800/80 border border-zinc-700/80 rounded-xl p-4">
                <div className="text-[11px] font-mono uppercase text-zinc-400">Estimated Defects Pinpointed</div>
                <div className="text-2xl font-extrabold text-orange-400 mt-1">
                  ~{estimatedPotholesFound}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">With exact GPS/timestamp</div>
              </div>

              <div className="bg-zinc-800/80 border border-zinc-700/80 rounded-xl p-4">
                <div className="text-[11px] font-mono uppercase text-zinc-400">Auditing Turnaround</div>
                <div className="text-2xl font-extrabold text-white mt-1">Instant</div>
                <div className="text-[10px] text-emerald-400 mt-1">Vs 3-5 days manual</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
