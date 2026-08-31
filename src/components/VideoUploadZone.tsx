import React, { useRef, useState } from 'react';
import { UploadCloud, Film, X, Play, Loader2, Sparkles, CheckCircle2, AlertCircle, FileVideo } from 'lucide-react';
import { VideoQueueItem } from '../types';

interface VideoUploadZoneProps {
  queue: VideoQueueItem[];
  onAddFiles: (files: FileList | File[]) => void;
  onAddSampleVideos: () => void;
  onRemoveItem: (id: string) => void;
  onStartAnalysis: () => void;
  isAnalyzing: boolean;
  isUploading: boolean;
}

export const VideoUploadZone: React.FC<VideoUploadZoneProps> = ({
  queue,
  onAddFiles,
  onAddSampleVideos,
  onRemoveItem,
  onStartAnalysis,
  isAnalyzing,
  isUploading,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const pendingCount = queue.filter((item) => item.status === 'pending' || item.status === 'error').length;
  const completedCount = queue.filter((item) => item.status === 'completed').length;

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Upload Road Inspection Videos</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Select one or multiple dashcam/drone road recordings to detect potholes and cracks
          </p>
        </div>

        <button
          type="button"
          onClick={onAddSampleVideos}
          disabled={isAnalyzing || isUploading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Load Sample Road Videos
        </button>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-50/40 scale-[0.995]'
            : 'border-zinc-300 hover:border-emerald-500 hover:bg-zinc-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/mp4,video/quicktime,video/x-msvideo,video/webm,.mp4,.mov,.avi,.webm"
          onChange={handleFileChange}
          className="hidden"
          disabled={isAnalyzing || isUploading}
        />

        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-semibold text-zinc-800 mb-1">
          Click to upload or drag & drop multiple road videos
        </p>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Supports <span className="font-medium text-zinc-700">MP4, MOV, AVI, WebM</span> (up to 200MB each)
        </p>
      </div>

      {/* Selected Video List */}
      {queue.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
              Selected Videos ({queue.length})
            </span>
            <span className="text-xs text-zinc-500">
              {completedCount} analyzed • {pendingCount} ready
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {queue.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  item.status === 'completed'
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : item.status === 'analyzing'
                    ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400'
                    : item.status === 'error'
                    ? 'bg-red-50/60 border-red-200'
                    : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      item.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : item.status === 'analyzing'
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    <FileVideo className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-zinc-900 truncate">{item.name}</p>
                      <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                        {formatFileSize(item.size)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      {item.status === 'pending' && (
                        <span className="text-xs text-zinc-500">Ready for AI analysis</span>
                      )}
                      {item.status === 'uploading' && (
                        <span className="text-xs text-emerald-700 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading video...
                        </span>
                      )}
                      {item.status === 'analyzing' && (
                        <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Processing frames with YOLO + OpenCV...
                        </span>
                      )}
                      {item.status === 'completed' && item.result && (
                        <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Detected: {item.result.potholeCount} potholes, {item.result.crackCount} cracks (
                          {item.result.totalDefects} total)
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {item.error || 'Analysis failed'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  disabled={isAnalyzing}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Remove video"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-5 flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onStartAnalysis}
              disabled={queue.length === 0 || isAnalyzing || isUploading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Videos...</span>
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Videos...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>
                    Analyze {queue.length} {queue.length === 1 ? 'Video' : 'Videos'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
