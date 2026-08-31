import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PipelineSection } from './components/PipelineSection';
import { FeaturesSection } from './components/FeaturesSection';
import { SolutionsSection } from './components/SolutionsSection';
import { BenchmarksSection } from './components/BenchmarksSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { PlaygroundView } from './components/PlaygroundView';
import { VideoQueueItem, VideoAnalysisResult } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'playground'>('landing');
  const [queue, setQueue] = useState<VideoQueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeProcessingName, setActiveProcessingName] = useState<string>('');
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);

  // Sync hash with view
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#playground') {
        setCurrentView('playground');
      } else if (hash === '#landing' || hash === '' || hash === '#') {
        setCurrentView('landing');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (view: 'landing' | 'playground') => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddFiles = (files: FileList | File[]) => {
    setGlobalError(null);
    const newItems: VideoQueueItem[] = Array.from(files).map((file, idx) => ({
      id: `local_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    }));

    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleAddSampleVideos = async () => {
    setGlobalError(null);
    setIsLoadingSamples(true);
    try {
      const res = await fetch('/api/samples');
      const data = await res.json();
      if (data.samples && data.samples.length > 0) {
        const sampleItems: VideoQueueItem[] = data.samples.map((sample: any) => ({
          id: `sample_${sample.id}_${Date.now()}`,
          name: sample.name,
          size: sample.size,
          previewUrl: sample.path,
          serverFilePath: sample.path,
          status: 'pending',
          progress: 0,
        }));

        setQueue((prev) => {
          // Avoid duplicate sample paths in queue
          const existingPaths = new Set(prev.map((i) => i.serverFilePath));
          const toAdd = sampleItems.filter((s) => !existingPaths.has(s.serverFilePath));
          return [...prev, ...toAdd];
        });
      }
    } catch (err: any) {
      setGlobalError('Failed to load sample videos: ' + err.message);
    } finally {
      setIsLoadingSamples(false);
    }
  };

  const handleLoadSamplesAndEnterPlayground = async () => {
    handleNavigate('playground');
    await handleAddSampleVideos();
  };

  const handleRemoveItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleStartAnalysis = async () => {
    if (queue.length === 0 || isAnalyzing || isUploading) return;
    setGlobalError(null);

    const itemsToProcess = queue.filter((item) => item.status !== 'completed');
    if (itemsToProcess.length === 0) return;

    setIsAnalyzing(true);

    for (const item of itemsToProcess) {
      try {
        setActiveProcessingName(item.name);

        let serverVideoPath = item.serverFilePath;

        // If it's a locally uploaded file and hasn't been uploaded to server yet:
        if (!serverVideoPath && item.file) {
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', progress: 20 } : q))
          );

          const formData = new FormData();
          formData.append('videos', item.file);

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!uploadRes.ok) {
            throw new Error(`Upload failed with status ${uploadRes.status}`);
          }

          const uploadData = await uploadRes.json();
          if (!uploadData.videos || uploadData.videos.length === 0) {
            throw new Error('Server did not return uploaded video info');
          }

          serverVideoPath = uploadData.videos[0].path;
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, serverFilePath: serverVideoPath, progress: 40 } : q
            )
          );
        }

        // Run AI Analysis on the video
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: 'analyzing', progress: 50 } : q
          )
        );

        const analyzeRes = await fetch('/api/analyze-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoPath: serverVideoPath,
            videoId: item.id,
            videoName: item.name,
          }),
        });

        if (!analyzeRes.ok) {
          const errData = await analyzeRes.json().catch(() => ({}));
          throw new Error(errData.error || errData.details || `Analysis failed with status ${analyzeRes.status}`);
        }

        const analyzeData = await analyzeRes.json();
        if (!analyzeData.result) {
          throw new Error('Analysis completed but no defect data returned');
        }

        const result: VideoAnalysisResult = analyzeData.result;

        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: 'completed',
                  progress: 100,
                  result,
                }
              : q
          )
        );
      } catch (err: any) {
        console.error('Error analyzing video:', err);
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: 'error',
                  error: err.message || 'Processing failed',
                }
              : q
          )
        );
      }
    }

    setIsAnalyzing(false);
    setActiveProcessingName('');
  };

  const handleResetAll = () => {
    setQueue([]);
    setGlobalError(null);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Global High-End Navbar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        activeCount={queue.length}
      />

      {currentView === 'landing' ? (
        /* DEDICATED SEPARATE LANDING PAGE */
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection
            onEnterPlayground={() => handleNavigate('playground')}
            onLoadSamplesAndEnterPlayground={handleLoadSamplesAndEnterPlayground}
            isLoadingSamples={isLoadingSamples}
          />

          {/* Technical Pipeline Visualizer Section */}
          <PipelineSection />

          {/* Enterprise Capabilities Section */}
          <FeaturesSection />

          {/* Real-World Industry Solutions Section */}
          <SolutionsSection onEnterPlayground={() => handleNavigate('playground')} />

          {/* Benchmarks & ROI Calculator Section */}
          <BenchmarksSection />

          {/* Interactive FAQ Section */}
          <FaqSection />

          {/* High-End Enterprise Footer */}
          <Footer onEnterPlayground={() => handleNavigate('playground')} />
        </main>
      ) : (
        /* DEDICATED SEPARATE PLAYGROUND VIEW */
        <PlaygroundView
          queue={queue}
          isUploading={isUploading}
          isAnalyzing={isAnalyzing}
          activeProcessingName={activeProcessingName}
          globalError={globalError}
          isLoadingSamples={isLoadingSamples}
          onAddFiles={handleAddFiles}
          onAddSampleVideos={handleAddSampleVideos}
          onRemoveItem={handleRemoveItem}
          onStartAnalysis={handleStartAnalysis}
          onResetAll={handleResetAll}
          onBackToLanding={() => handleNavigate('landing')}
          onDismissError={() => setGlobalError(null)}
        />
      )}
    </div>
  );
}
