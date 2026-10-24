import React from 'react';
import {
  ArrowRight,
  Download,
  Clock,
  FileCode2,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { Dataset } from '../types';

interface RecentlyAddedProps {
  datasets: Dataset[];
  onViewDetails: (id: string) => void;
  onDownload: (dataset: Dataset, e: React.MouseEvent) => void;
  onViewAll: () => void;
}

export const RecentlyAdded: React.FC<RecentlyAddedProps> = ({
  datasets,
  onViewDetails,
  onDownload,
  onViewAll,
}) => {
  const recentItems = datasets.filter((d) => d.recent).slice(0, 3);
  const displayItems = recentItems.length > 0 ? recentItems : datasets.slice(0, 3);

  const getFormatIcon = (format: string) => {
    switch (format.toUpperCase()) {
      case 'CSV':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'JSON':
        return <FileCode2 className="w-5 h-5 text-amber-400" />;
      default:
        return <FileText className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getRelativeTime = (index: number) => {
    switch (index) {
      case 0:
        return '2 hours ago';
      case 1:
        return '4 hours ago';
      case 2:
        return '6 hours ago';
      default:
        return '1 day ago';
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Recently Added
          </h2>
          <p className="text-sm text-slate-400 mt-1">Latest datasets added to DataVault</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors group"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {displayItems.map((dataset, idx) => (
          <div
            key={dataset.id}
            onClick={() => onViewDetails(dataset.id)}
            className="glass-card rounded-xl p-4 border border-slate-800/80 hover:border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group transition-all"
          >
            {/* Left: Icon, Title, meta */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getFormatIcon(dataset.format)}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-400 transition-colors truncate">
                  {dataset.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-mono">
                  <span className="text-cyan-400 font-semibold">{dataset.format}</span>
                  <span>•</span>
                  <span>{dataset.size}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {getRelativeTime(idx)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Tags and Download Button */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
              <div className="flex flex-wrap items-center gap-1.5">
                {dataset.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(dataset, e);
                }}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-slate-700 transition-colors"
                title={`Download ${dataset.title}`}
                aria-label={`Download ${dataset.title}`}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
