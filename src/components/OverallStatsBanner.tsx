import React from 'react';
import { ShieldAlert, AlertTriangle, Disc, Video } from 'lucide-react';
import { OverallStats } from '../types';

interface OverallStatsBannerProps {
  stats: OverallStats;
}

export const OverallStatsBanner: React.FC<OverallStatsBannerProps> = ({ stats }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-700 rounded-2xl p-5 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-700 mb-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Overall Detection Summary</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Aggregated road surface defects detected across analyzed videos</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {stats.totalVideos} {stats.totalVideos === 1 ? 'Video Analyzed' : 'Videos Analyzed'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Defects */}
        <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl p-4 transition-all">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Defects</span>
            <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-950 dark:text-emerald-300">{stats.totalDefects}</div>
          <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">Potholes + Cracks identified</p>
        </div>

        {/* Potholes Detected */}
        <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-4 transition-all">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Potholes</span>
            <Disc className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-950 dark:text-amber-300">{stats.totalPotholes}</div>
          <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">Surface cavities & depressions</p>
        </div>

        {/* Cracks Detected */}
        <div className="bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/60 rounded-xl p-4 transition-all">
          <div className="flex items-center justify-between text-sky-800 dark:text-sky-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Road Cracks</span>
            <AlertTriangle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-sky-950 dark:text-sky-300">{stats.totalCracks}</div>
          <p className="text-xs text-sky-700 dark:text-sky-500 mt-1">Longitudinal & alligator cracks</p>
        </div>

        {/* Processed Videos */}
        <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl p-4 transition-all">
          <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Videos Processed</span>
            <Video className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalVideos}</div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Completed inspection jobs</p>
        </div>
      </div>
    </div>
  );
};
