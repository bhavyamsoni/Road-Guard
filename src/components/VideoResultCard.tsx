import React, { useState, useRef } from 'react';
import { Download, Film, Disc, AlertTriangle, Layers, Maximize2, Play, Pause, Eye } from 'lucide-react';
import { VideoAnalysisResult } from '../types';

interface VideoResultCardProps {
  result: VideoAnalysisResult;
}

export const VideoResultCard: React.FC<VideoResultCardProps> = ({ result }) => {
  const [viewMode, setViewMode] = useState<'annotated' | 'original'>('annotated');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleDownload = () => {
    const filename = result.processedVideoUrl.split('/').pop() || 'annotated_road.mp4';
    const link = document.createElement('a');
    link.href = `/api/download/${filename}`;
    link.download = `RoadGuard_${result.videoName.replace(/\.[^/.]+$/, '')}_analyzed.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentVideoSrc = viewMode === 'annotated' ? result.processedVideoUrl : result.originalVideoUrl;

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-xs transition-all hover:shadow-sm">
      {/* Card Header */}
      <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-zinc-900 truncate" title={result.videoName}>
              {result.videoName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
              <span>{result.durationSeconds}s duration</span>
              <span>•</span>
              <span>{result.totalFrames} frames</span>
              <span>•</span>
              <span>{result.resolution}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* View Toggle */}
          <div className="inline-flex rounded-lg border border-zinc-200 p-0.5 bg-zinc-50 text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('annotated')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'annotated'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Annotated AI
            </button>
            <button
              type="button"
              onClick={() => setViewMode('original')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'original'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Original
            </button>
          </div>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 active:bg-black text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Download Annotated Video"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 bg-zinc-50/70 border-b border-zinc-100 divide-x divide-zinc-200/80 text-center py-3 px-4">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-amber-800 block">
            Potholes Detected
          </span>
          <div className="text-xl font-bold text-amber-950 mt-0.5 flex items-center justify-center gap-1.5">
            <Disc className="w-4 h-4 text-amber-600" />
            {result.potholeCount}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-sky-800 block">
            Cracks Detected
          </span>
          <div className="text-xl font-bold text-sky-950 mt-0.5 flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-sky-600" />
            {result.crackCount}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-800 block">
            Total Defects
          </span>
          <div className="text-xl font-bold text-emerald-950 mt-0.5 flex items-center justify-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            {result.totalDefects}
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative bg-black aspect-video flex items-center justify-center group overflow-hidden">
        <video
          key={currentVideoSrc}
          ref={videoRef}
          src={currentVideoSrc}
          controls
          playsInline
          loop
          className="w-full h-full object-contain max-h-[420px]"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Video Mode Badge Overlay */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold backdrop-blur-md ${
              viewMode === 'annotated'
                ? 'bg-emerald-600/90 text-white'
                : 'bg-zinc-900/80 text-zinc-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {viewMode === 'annotated' ? 'Annotated Output' : 'Original Video'}
          </span>
        </div>
      </div>

      {/* Key Defect Detections Chips */}
      {result.sampleDetections && result.sampleDetections.length > 0 && (
        <div className="p-4 bg-white border-t border-zinc-100">
          <div className="text-xs font-semibold text-zinc-700 mb-2">
            Identified Defect Instances ({result.sampleDetections.length}):
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {result.sampleDetections.map((det, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${
                  det.type === 'Pothole'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-sky-50 text-sky-800 border-sky-200'
                }`}
              >
                {det.type === 'Pothole' ? (
                  <Disc className="w-3 h-3 text-amber-600" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-sky-600" />
                )}
                {det.type} @ {det.timestamp}s ({Math.round(det.conf * 100)}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
