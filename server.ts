import express from 'express';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import multer from 'multer';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Directories for storage
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const PROCESSED_DIR = path.join(process.cwd(), 'public', 'processed');
const SAMPLES_DIR = path.join(process.cwd(), 'public', 'samples');

[UPLOADS_DIR, PROCESSED_DIR, SAMPLES_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static assets
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/processed', express.static(PROCESSED_DIR));
app.use('/samples', express.static(SAMPLES_DIR));

// Configure Multer for video file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}_${cleanName}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max per video
  fileFilter: (req, file, cb) => {
    const allowed = /\.(mp4|mov|avi|webm|m4v|mkv)$/i;
    if (allowed.test(file.originalname) || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid video format. Supported formats: MP4, MOV, AVI, WebM.'));
    }
  },
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'YOLO + OpenCV', timestamp: new Date().toISOString() });
});

// Get available sample videos
app.get('/api/samples', (req, res) => {
  try {
    const samples = [
      {
        id: 'sample-highway',
        name: 'Highway_Inspection_Road_A4.mp4',
        path: '/samples/highway_inspection.mp4',
        fullPath: path.join(SAMPLES_DIR, 'highway_inspection.mp4'),
        size: 1024 * 1024 * 3.5,
        type: 'video/mp4',
        defectHighlight: 'Potholes & Longitudinal Cracks',
      },
      {
        id: 'sample-urban',
        name: 'Urban_Pothole_Patrol_Sector7.mp4',
        path: '/samples/urban_pothole_patrol.mp4',
        fullPath: path.join(SAMPLES_DIR, 'urban_pothole_patrol.mp4'),
        size: 1024 * 1024 * 2.8,
        type: 'video/mp4',
        defectHighlight: 'Deep Asphalt Potholes',
      },
      {
        id: 'sample-expressway',
        name: 'Expressway_Cracks_Survey_B12.mp4',
        path: '/samples/expressway_cracks_survey.mp4',
        fullPath: path.join(SAMPLES_DIR, 'expressway_cracks_survey.mp4'),
        size: 1024 * 1024 * 3.1,
        type: 'video/mp4',
        defectHighlight: 'Alligator & Transverse Cracks',
      },
    ];

    // Check if sample files exist; if not, return list and trigger generation
    const exists = samples.filter((s) => fs.existsSync(s.fullPath));
    if (exists.length < samples.length) {
      // Trigger generator script in background
      spawn('python3', [path.join(process.cwd(), 'ai', 'generate_sample_videos.py')]);
    }

    res.json({ samples });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Upload multiple video files
app.post('/api/upload', upload.array('videos', 10), (req, res) => {
  try {
    const files = (req as any).files as any[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No video files uploaded' });
    }

    const uploadedVideos = files.map((file) => ({
      id: path.basename(file.filename, path.extname(file.filename)),
      name: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      path: `/uploads/${file.filename}`,
      fullPath: file.path,
    }));

    res.json({ success: true, videos: uploadedVideos });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Analyze a specific video using Python YOLO/OpenCV detector
app.post('/api/analyze-video', async (req, res) => {
  const { videoPath, videoId, videoName } = req.body;

  if (!videoPath) {
    return res.status(400).json({ error: 'videoPath is required' });
  }

  // Resolve input path
  let resolvedInputPath = '';
  if (videoPath.startsWith('/uploads/')) {
    resolvedInputPath = path.join(UPLOADS_DIR, path.basename(videoPath));
  } else if (videoPath.startsWith('/samples/')) {
    resolvedInputPath = path.join(SAMPLES_DIR, path.basename(videoPath));
  } else if (fs.existsSync(videoPath)) {
    resolvedInputPath = videoPath;
  } else {
    // Try in uploads directory
    resolvedInputPath = path.join(UPLOADS_DIR, path.basename(videoPath));
  }

  if (!fs.existsSync(resolvedInputPath)) {
    return res.status(404).json({ error: `Video file not found at ${resolvedInputPath}` });
  }

  const outputFileName = `analyzed_${videoId || Date.now()}_${path.basename(resolvedInputPath, path.extname(resolvedInputPath))}.mp4`;
  const resolvedOutputPath = path.join(PROCESSED_DIR, outputFileName);
  const processedVideoUrl = `/processed/${outputFileName}`;

  const pythonScript = path.join(process.cwd(), 'ai', 'detector.py');

  try {
    // Run Python detection process
    const pythonProc = spawn('python3', [
      pythonScript,
      resolvedInputPath,
      resolvedOutputPath,
      videoId || 'vid',
    ]);

    let stdoutData = '';
    let stderrData = '';

    pythonProc.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProc.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProc.on('close', (code) => {
      if (code !== 0) {
        console.error('Python detector error:', stderrData);
        return res.status(500).json({
          error: 'Detection processing failed',
          details: stderrData || 'Python execution exited with code ' + code,
        });
      }

      try {
        // Parse result JSON from python script output
        const lines = stdoutData.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        const stats = JSON.parse(lastLine);

        const result = {
          videoId: videoId || stats.video_id,
          videoName: videoName || path.basename(resolvedInputPath),
          potholeCount: stats.pothole_count,
          crackCount: stats.crack_count,
          totalDefects: stats.total_defects,
          durationSeconds: stats.duration_seconds,
          totalFrames: stats.total_frames,
          fps: stats.fps,
          resolution: stats.resolution,
          processedVideoUrl: processedVideoUrl,
          originalVideoUrl: videoPath.startsWith('/') ? videoPath : `/uploads/${path.basename(resolvedInputPath)}`,
          sampleDetections: stats.sample_detections || [],
        };

        res.json({ success: true, result });
      } catch (parseErr: any) {
        console.error('Failed to parse Python output:', stdoutData);
        res.status(500).json({
          error: 'Failed to parse detector output',
          rawOutput: stdoutData,
          stderr: stderrData,
        });
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Download endpoint
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(PROCESSED_DIR, filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath, `RoadGuard_${filename}`);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Start Express & Vite server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RoadGuard AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
