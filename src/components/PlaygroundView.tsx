import React, { useState } from 'react';
import { VideoQueueItem, OverallStats, VideoAnalysisResult } from '../types';
import { VideoUploadZone } from './VideoUploadZone';
import { VideoResultCard } from './VideoResultCard';
import { OverallStatsBanner } from './OverallStatsBanner';
import {
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Video,
  Sliders,
  Play,
  Film,
  Download,
  Info,
  Layers,
  Activity,
  CheckCircle2,
  Settings2,
} from 'lucide-react';

interface PlaygroundViewProps {
  queue: VideoQueueItem[];
  isUploading: boolean;
  isAnalyzing: boolean;
  activeProcessingName: string;
  globalError: string | null;
  isLoadingSamples: boolean;
  onAddFiles: (files: FileList | File[]) => void;
  onAddSampleVideos: () => void;
  onRemoveItem: (id: string) => void;
  onStartAnalysis: () => void;
  onResetAll: () => void;
  onBackToLanding: () => void;
  onDismissError: () => void;
}

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  queue,
  isUploading,
  isAnalyzing,
  activeProcessingName,
  globalError,
  isLoadingSamples,
  onAddFiles,
  onAddSampleVideos,
  onRemoveItem,
  onStartAnalysis,
  onResetAll,
  onBackToLanding,
  onDismissError,
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [confThreshold, setConfThreshold] = useState(65);
  const [iouThreshold, setIouThreshold] = useState(45);
  const [enableHudBurnIn, setEnableHudBurnIn] = useState(true);

  // Compute Overall Stats from completed items
  const completedResults = queue
    .filter((item) => item.status === 'completed' && item.result)
    .map((item) => item.result as VideoAnalysisResult);

  const overallStats: OverallStats = {
    totalVideos: completedResults.length,
    totalPotholes: completedResults.reduce((acc, curr) => acc + (curr.potholeCount || 0), 0),
    totalCracks: completedResults.reduce((acc, curr) => acc + (curr.crackCount || 0), 0),
    totalDefects: completedResults.reduce((acc, curr) => acc + (curr.totalDefects || 0), 0),
  };

  const samplePresets = [
    {
      title: 'Highway Interstate Route',
      desc: 'High-speed multi-lane asphalt video with deep potholes and road wear.',
      tag: '60 FPS • 1080p',
      type: 'Corridor Survey',
    },
    {
      title: 'Urban Arterial Defect Run',
      desc: 'City street dashcam with transverse cracks and fatigue alligator fissures.',
      tag: '30 FPS • 4K Survey',
      type: 'Municipal Scan',
    },
    {
      title: 'Residential Pavement Wear',
      desc: 'Suburban roadway with edge cracking and multiple small cavity clusters.',
      tag: '60 FPS • Dashcam',
      type: 'Subdivision Road',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col pb-20">
      {/* Playground Top Banner / Sticky Navigation */}
      <div className="bg-white border-b border-zinc-200 sticky top-16 z-40 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center justify-between gap-4">
            
            {/* Left: Back to Landing Page & Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBackToLanding}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-zinc-500" />
                <span>Landing Page</span>
              </button>
              <div className="h-4 w-px bg-zinc-200" />
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-zinc-900 font-mono tracking-tight">
                  LIVE INSPECTION PLAYGROUND
                </span>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  showConfig
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Detection Parameters</span>
                <span className="sm:hidden">Settings</span>
              </button>

              <button
                type="button"
                onClick={onAddSampleVideos}
                disabled={isLoadingSamples || isAnalyzing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isLoadingSamples ? 'Loading...' : 'Load Sample Clips'}</span>
              </button>

              {queue.length > 0 && (
                <button
                  type="button"
                  onClick={onResetAll}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear Queue</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Playground Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-1.5">
                <Video className="w-3.5 h-3.5" />
                Computer Vision Video Workbench
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                Road Video Defect Analyzer & HUD Player
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-3xl">
                Upload raw dashcam, smartphone, or drone survey footage. Our multi-scale cavity fusion and directional ridge filter will pinpoint potholes and cracks with exact bounding boxes and spatio-temporal tracking.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white border border-zinc-200/90 rounded-xl p-3 flex items-center gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-mono text-zinc-400">Tracker State</div>
                  <div className="text-xs font-bold text-zinc-800">IoU Spatial Clustering Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{globalError}</span>
            </div>
            <button
              onClick={onDismissError}
              className="text-xs font-semibold text-red-700 hover:text-red-900 ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Optional Detection Parameters Config Drawer */}
        {showConfig && (
          <div className="mb-8 p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  AI Inspection & HUD Parameters
                </h3>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">Real-Time OpenCV / YOLO Pipeline Settings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-zinc-700 mb-1">
                  <span>Confidence Gate:</span>
                  <span className="font-mono text-emerald-700 font-bold">{confThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="95"
                  value={confThreshold}
                  onChange={(e) => setConfThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <p className="text-[10px] text-zinc-400 mt-1">Filters out uncertain shadow gradients</p>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-zinc-700 mb-1">
                  <span>Spatio-Temporal IoU Gate:</span>
                  <span className="font-mono text-emerald-700 font-bold">{(iouThreshold / 100).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={iouThreshold}
                  onChange={(e) => setIouThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <p className="text-[10px] text-zinc-400 mt-1">Controls multi-frame duplicate prevention</p>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-zinc-700 mb-1">
                  <span>Video Burn-in Telemetry:</span>
                  <span className="font-mono text-emerald-700 font-bold">{enableHudBurnIn ? 'ENABLED' : 'OFF'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableHudBurnIn(!enableHudBurnIn)}
                  className={`w-full py-1.5 px-3 rounded-lg border font-medium text-center transition-colors cursor-pointer ${
                    enableHudBurnIn
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                  }`}
                >
                  {enableHudBurnIn ? '✓ HUD Stamp Burned Into Video' : 'Raw Video Only'}
                </button>
                <p className="text-[10px] text-zinc-400 mt-1">Embeds live defect count & FPS in video</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Sample Presets (When Queue is Empty) */}
        {queue.length === 0 && (
          <div className="mb-8 bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>ONE-CLICK TEST CLIPS</span>
                </div>
                <h2 className="text-lg font-bold text-white">Try Pre-Loaded Survey Recordings</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Test the detection algorithms without needing your own road video files.
                </p>
              </div>

              <button
                type="button"
                onClick={onAddSampleVideos}
                disabled={isLoadingSamples}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isLoadingSamples ? 'Loading...' : 'Load All Sample Clips'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {samplePresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={onAddSampleVideos}
                  className="bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl p-4 cursor-pointer transition-all hover:border-emerald-500/60 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {preset.type}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">{preset.tag}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{preset.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overall Stats Banner (When at least one video completed) */}
        {completedResults.length > 0 && <OverallStatsBanner stats={overallStats} />}

        {/* Video Upload & Queue Component */}
        <VideoUploadZone
          queue={queue}
          onAddFiles={onAddFiles}
          onAddSampleVideos={onAddSampleVideos}
          onRemoveItem={onRemoveItem}
          onStartAnalysis={onStartAnalysis}
          isAnalyzing={isAnalyzing}
          isUploading={isUploading}
        />

        {/* Active Analysis Banner */}
        {isAnalyzing && (
          <div className="bg-emerald-600 text-white rounded-2xl p-5 my-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">AI Defect Detection Pipeline Running</h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Currently analyzing: <span className="font-semibold underline">{activeProcessingName}</span>
                </p>
              </div>
            </div>
            <span className="text-xs font-mono bg-emerald-700/80 px-3 py-1.5 rounded-lg border border-emerald-500/40">
              
            </span>
          </div>
        )}

        {/* Results Section */}
        {completedResults.length > 0 && (
          <div className="mt-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-900">Detection Results & Annotated Videos</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Inspect annotated videos with defect bounding boxes, telemetry HUD, or export forensic CSV logs
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onResetAll}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Clear All Results
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedResults.map((result) => (
                <VideoResultCard key={result.videoId} result={result} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation to Landing Page */}
        <div className="mt-14 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>RoadGuard AI</span>
          </div>
          <button
            type="button"
            onClick={onBackToLanding} 
            className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Landing Page & Technical Specs</span>
          </button>
        </div>

      </div>
    </div>
  );
};
