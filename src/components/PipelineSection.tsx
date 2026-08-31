import React, { useState } from 'react';
import { Layers, Scan, Cpu, GitMerge, Check, Eye, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

export const PipelineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const pipelineStages = [
    {
      id: 'plane-isolation',
      title: '1. Road Surface & Asphalt Plane Isolation',
      badge: 'HSV / LAB Filtering',
      description:
        'Eliminates sky glare, roadside greenery, vehicle hoods, and sidewalk interference before defect scanning begins.',
      bullets: [
        'Chrominance & saturation boundaries restrict bounding box search strictly to neutral asphalt gray.',
        'Adaptive luminance thresholding excludes direct solar reflections and dark shadow letterboxing.',
        'Morphological opening and closing kernels generate an asphalt mask for high signal-to-noise ratio.',
      ],
      codeSnippet: `road_mask, roi_top, gray = detector.extract_road_plane_mask(frame)
asphalt_sat_mask = s_chan < 85
asphalt_val_mask = (v_chan > 20) & (v_chan < 240)
cleaned_road_mask = cv2.morphologyEx(raw_road, cv2.MORPH_CLOSE, kernel)`,
      outputStat: '100% Non-Road Noise Rejection',
      icon: Scan,
    },
    {
      id: 'cavity-fusion',
      title: '2. Multi-Scale Morphological Cavity Fusion',
      badge: 'Black-Hat Morphology',
      description:
        'Detects genuine road craters and depressions without fragmenting large potholes into clusters of broken boxes.',
      bullets: [
        'Multi-scale elliptical Black-Hat filtering across 4 structural kernels (25px, 45px, 75px, 110px).',
        'Large morphological dilation bridges disjointed dark crater patches into a single unified polygon.',
        'Annular contrast verification compares crater depth to adjacent asphalt luminance to prevent dark asphalt texture false alarms.',
      ],
      codeSnippet: `for k_size in [25, 45, 75, 110]:
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k_size, k_size))
    bh = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, k)
    blackhat_combined += bh.astype(np.float32)
# Annular outer-ring contrast drop: outer_mean - inner_mean >= 4.0`,
      outputStat: 'Zero Crater Fragmentation',
      icon: Layers,
    },
    {
      id: 'crack-ridge',
      title: '3. Directional Linear Crack & Fissure Analyzer',
      badge: 'Multi-Angle Ridge Filter',
      description:
        'Differentiates continuous structural pavement cracks from coarse gravel aggregate and painted line markings.',
      bullets: [
        '8 directional line filters (0° to 150°) sweep the asphalt road plane to identify linear fissures.',
        'Aspect-ratio and skeleton elongation checks filter out circular gravel and surface micro-pores.',
        'Pothole exclusion zones prevent craters from being double-counted as crack networks.',
      ],
      codeSnippet: `for angle in [0, 30, 45, 60, 90, 120, 135, 150]:
    kernel = build_oriented_line_kernel(angle, length=23)
    max_response = np.maximum(max_response, cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel))
# Elongation + skeleton continuity threshold validation`,
      outputStat: 'Continuous Structural Fissures',
      icon: Cpu,
    },
    {
      id: 'tracking-smoothing',
      title: '4. Spatio-Temporal Multi-Object Tracking',
      badge: 'Kalman & IoU Tracker',
      description:
        'Maintains persistent defect IDs across video frames, eliminating jitter and preventing duplicate counts in reports.',
      bullets: [
        'Centroid distance & Intersection-over-Union (IoU) matching binds bounding boxes across consecutive frames.',
        'Exponential moving average smoothing eliminates camera vibration and dashcam wobble jitter.',
        'Lifetime spatial clustering consolidates video tracks into certified unique physical road defect counts.',
      ],
      codeSnippet: `class DefectTrack:
    def update(self, bbox, conf, frame_idx):
        alpha = 0.55
        for i in range(4):
            self.smooth_bbox[i] = int(alpha * bbox[i] + (1 - alpha) * self.smooth_bbox[i])
# Unique physical defect count via cluster_tracks(lifetime_tracks)`,
      outputStat: 'Exact Physical Defect Count',
      icon: GitMerge,
    },
  ];

  const current = pipelineStages[activeStep];

  return (
    <section id="pipeline" className="py-20 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Neural & Computer Vision Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            How RoadGuard AI Detects Defect Depressions with Precision
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600">
            A 4-stage pipeline designed to eliminate false positives, unify fragmented crater cavities, and provide verified counts from moving survey cameras.
          </p>
        </div>

        {/* Pipeline Stage Selector Pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30'
                    : 'bg-zinc-50/60 border-zinc-200 hover:bg-zinc-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      isActive ? 'bg-emerald-200/60 text-emerald-900' : 'bg-zinc-200/60 text-zinc-600'
                    }`}
                  >
                    Stage 0{idx + 1}
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-bold ${isActive ? 'text-emerald-950' : 'text-zinc-900'}`}>
                    {stage.title.split('. ')[1]}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{stage.badge}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Stage Deep Dive Card */}
        <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Description */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold border border-emerald-500/30">
                {current.badge}
              </span>
              <span className="text-zinc-400 text-xs font-mono">• {current.outputStat}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{current.title}</h3>

            <p className="text-sm text-zinc-300 leading-relaxed">{current.description}</p>

            <ul className="space-y-2.5 pt-2">
              {current.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Code / Architecture Snippet */}
          <div className="lg:col-span-6">
            <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800 text-zinc-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RoadGuard Core Logic</span>
                </div>
                <span className="text-emerald-400">Python 3.10 / OpenCV</span>
              </div>
              <pre className="text-zinc-300 overflow-x-auto text-[11px] leading-relaxed select-all">
                <code>{current.codeSnippet}</code>
              </pre>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
