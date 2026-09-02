import React, { useState } from 'react';
import { VideoQueueItem, OverallStats, VideoAnalysisResult } from '../types';
import { VideoUploadZone } from './VideoUploadZone';
import { VideoResultCard } from './VideoResultCard';
import { OverallStatsBanner } from './OverallStatsBanner';
import {
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Video,
  Sparkles
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

  return (
    <div className="min-h-screen bg-zinc-50/70 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col pb-20">

      {/* Main Content Area */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Playground Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-700">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
                <Video className="w-3.5 h-3.5" />
                Computer Vision Video Workbench
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
                Road Video Defect Analyzer
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-3xl">
                Upload raw dashcam, smartphone, or drone survey footage. Our multi-scale cavity fusion and directional ridge filter will pinpoint potholes and cracks with exact bounding boxes and spatio-temporal tracking.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onAddSampleVideos}
                disabled={isLoadingSamples || isAnalyzing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-lg transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{isLoadingSamples ? 'Loading...' : 'Load Sample Videos'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 text-sm flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              <span>{globalError}</span>
            </div>
            <button
              onClick={onDismissError}
              className="text-xs font-semibold text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}



        {/* Overall Stats Banner (When at least one video completed) */}
        {completedResults.length > 0 && <OverallStatsBanner stats={overallStats} />}

        {/* Video Upload & Queue Component */}
        <VideoUploadZone
          queue={queue}
          onAddFiles={onAddFiles}
          onRemoveItem={onRemoveItem}
          onStartAnalysis={onStartAnalysis}
          isAnalyzing={isAnalyzing}
          isUploading={isUploading}
        />

        {/* Active Analysis Banner */}
        {isAnalyzing && (
          <div className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-5 my-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Defect Detection Pipeline Running</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Currently analyzing: <span className="font-semibold text-emerald-700 dark:text-emerald-400 underline">{activeProcessingName}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Processing Frames</span>
            </div>
          </div>
        )}

        {/* Results Section */}
        {completedResults.length > 0 && (
          <div className="mt-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Detection Results & Annotated Videos</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Inspect annotated videos with defect bounding boxes, telemetry HUD, or export forensic CSV logs
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onResetAll}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg transition-colors cursor-pointer"
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


      </div>
    </div>
  );
};
