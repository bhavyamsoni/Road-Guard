import React from 'react';
import { Building2, Truck, Landmark, Compass, ArrowRight, Check } from 'lucide-react';

interface SolutionsSectionProps {
  onEnterPlayground: () => void;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({ onEnterPlayground }) => {
  const useCases = [
    {
      icon: Building2,
      category: 'Municipalities & Smart Cities',
      title: 'Automated Pothole Repair Work Orders',
      description:
        'Transform routine garbage truck or utility vehicle dashcam runs into daily citywide pavement condition surveys.',
      metrics: '70% reduction in manual survey costs',
      points: [
        'Automatic geo-tagged defect queues for road maintenance crews',
        'Eliminates citizen complaints by fixing potholes before enlargement',
        'Exportable audit records for municipal budget allocation',
      ],
    },
    {
      icon: Landmark,
      category: 'State & National Highway Authorities',
      title: 'High-Speed Corridor Pavement Health Audits',
      description:
        'Analyze thousands of miles of multi-lane interstate video at highway speeds without requiring lane closures.',
      metrics: 'Over 500+ corridor miles analyzed daily',
      points: [
        'Continuous longitudinal and transverse crack density tracking',
        'Pavement Condition Index (PCI) score calculation',
        'Long-term pavement degradation trend analysis',
      ],
    },
    {
      icon: Truck,
      category: 'Fleet & Logistics Operators',
      title: 'Suspension Protection & Route Optimization',
      description:
        'Equip commercial fleet vehicles with AI defect intelligence to route around severe crater corridors and protect cargo.',
      metrics: '34% decrease in fleet tire & suspension damage',
      points: [
        'Live road hazard alerts for high-value logistics convoys',
        'Vehicle wear-and-tear correlation with road roughness',
        'Automated claims documentation with timestamped video evidence',
      ],
    },
    {
      icon: Compass,
      category: 'Civil Engineering & Contractors',
      title: 'Pre-Resurfacing & Warranty Pavement Quality Auditing',
      description:
        'Verify freshly paved asphalt quality or document baseline road distress prior to civil excavation projects.',
      metrics: '100% verifiable pre/post paving compliance',
      points: [
        'Objective, unalterable defect logs for dispute resolution',
        'Standardized defect classification for paving contract milestones',
        'Side-by-side before-and-after resurfacing validation',
      ],
    },
  ];

  return (
    <section id="solutions" className="py-20 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
              Industry Applications
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Built for Modern Infrastructure Management
            </h2>
            <p className="mt-2 text-sm text-zinc-600 max-w-xl">
              Scalable computer vision solutions deployed across municipal roads, commercial fleets, and national highway networks.
            </p>
          </div>

          <button
            type="button"
            onClick={onEnterPlayground}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer self-start md:self-auto"
          >
            <span>Try in Video Playground</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((uc, idx) => {
            const Icon = uc.icon;
            return (
              <div
                key={idx}
                className="bg-zinc-50/70 border border-zinc-200/90 rounded-2xl p-7 flex flex-col justify-between hover:border-emerald-300 hover:bg-emerald-50/20 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-md">
                      {uc.category}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 text-zinc-700 flex items-center justify-center group-hover:text-emerald-600 shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{uc.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed mb-5">{uc.description}</p>

                  <div className="space-y-2 mb-6">
                    {uc.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-zinc-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-900">{uc.metrics}</span>
                  <button
                    type="button"
                    onClick={onEnterPlayground}
                    className="text-emerald-600 font-medium group-hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect demo &rarr;</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
