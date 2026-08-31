export interface DefectSample {
  type: 'Pothole' | 'Crack';
  conf: number;
  frame: number;
  timestamp: number;
  bbox: [number, number, number, number];
}

export interface VideoAnalysisResult {
  videoId: string;
  videoName: string;
  potholeCount: number;
  crackCount: number;
  totalDefects: number;
  durationSeconds: number;
  totalFrames: number;
  fps: number;
  resolution: string;
  processedVideoUrl: string;
  originalVideoUrl: string;
  sampleDetections?: DefectSample[];
}

export interface VideoQueueItem {
  id: string;
  file?: File;
  name: string;
  size: number;
  previewUrl: string;
  serverFilePath?: string;
  status: 'pending' | 'uploading' | 'analyzing' | 'completed' | 'error';
  progress: number;
  currentFrame?: number;
  totalFrames?: number;
  error?: string;
  result?: VideoAnalysisResult;
}

export interface OverallStats {
  totalVideos: number;
  totalPotholes: number;
  totalCracks: number;
  totalDefects: number;
}
