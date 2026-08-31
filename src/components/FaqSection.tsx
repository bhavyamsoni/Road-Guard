import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, ShieldCheck } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What video formats, resolutions, and camera angles are supported?',
      a: 'RoadGuard AI natively supports MP4, MOV, AVI, and MKV video containers up to 4K resolution at 24 to 60+ FPS. Standard forward-facing windshield dashcams, hood/bumper cameras, smartphone dash mounts, and aerial drone surveys are fully supported without custom calibration.',
    },
    {
      q: 'How does RoadGuard AI prevent counting the same pothole multiple times in video?',
      a: 'Our spatio-temporal MultiObjectTracker assigns persistent unique track IDs to defects. Centroid proximity and IoU metrics track physical defects as the vehicle drives past them. At the end of the survey, lifetime spatial clustering merges multiple observation instances into certified unique physical road defect counts.',
    },
    {
      q: 'How does the model distinguish asphalt aggregate and shadows from real cracks?',
      a: 'The engine applies multi-directional linear ridge filtering across 8 angles (0° to 150°) combined with skeleton continuity and aspect ratio gates. Circular gravel pores and non-linear shadow gradients fail the elongation threshold, ensuring only genuine continuous pavement fractures are detected.',
    },
    {
      q: 'Can defect inspection logs be exported to municipal GIS or work-order systems?',
      a: 'Yes. Every processed video generates a structured forensic CSV containing defect IDs, classification (Pothole or Crack), confidence ratings, exact frame indexes, millisecond timestamps, and bounding box coordinates, ready for direct ingestion into municipal GIS or civil maintenance workflows.',
    },
    {
      q: 'How fast is the video analysis pipeline?',
      a: 'Processing runs at sub-50ms per frame on standard hardware, matching or exceeding real-time 30-60 FPS playback. Completed videos are automatically re-encoded to universal browser-compatible H.264 MP4 for instantaneous preview and side-by-side inspection.',
    },
    {
      q: 'How are privacy and non-road objects handled?',
      a: 'Our road plane isolation algorithm uses chromaticity and luminance masking to restrict AI scanning exclusively to the asphalt surface. Sky, oncoming vehicles, license plates, and pedestrians on sidewalks are automatically excluded from processing.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Technical & Deployment Details
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Answers to common questions about camera hardware, accuracy, tracking algorithms, and GIS integrations.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl transition-all ${
                  isOpen
                    ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                    : 'border-zinc-200/80 bg-zinc-50/40 hover:bg-zinc-50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-zinc-900">{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-emerald-100/60 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
