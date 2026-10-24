import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileCode2,
  Download,
  Eye,
  HardDrive,
  ExternalLink,
} from 'lucide-react';
import { Dataset } from '../types';

interface DatasetCardProps {
  dataset: Dataset;
  onViewDetails: (id: string) => void;
  onDownload: (dataset: Dataset, e: React.MouseEvent) => void;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({
  dataset,
  onViewDetails,
  onDownload,
}) => {
  const getFormatBadgeStyle = (format: string) => {
    switch (format.toUpperCase()) {
      case 'JSON':
        return 'bg-amber-950/50 text-amber-300 border-amber-800/40';
      case 'CSV':
        return 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40';
      case 'TXT':
        return 'bg-blue-950/50 text-blue-300 border-blue-800/40';
      case 'MARKDOWN':
        return 'bg-purple-950/50 text-purple-300 border-purple-800/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

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

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-cyan-500/40 flex flex-col justify-between transition-all duration-200 group">
      <div>
        {/* Top Header with Icon & Meta */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {getFormatIcon(dataset.format)}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              onClick={() => onViewDetails(dataset.id)}
              className="font-bold text-base text-white group-hover:text-cyan-400 cursor-pointer truncate transition-colors"
              title={dataset.title}
            >
              {dataset.title}
            </h3>

            {/* Sub-meta: format badge, size, downloads */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase border ${getFormatBadgeStyle(
                  dataset.format
                )}`}
              >
                {dataset.format}
              </span>
              <span className="text-slate-400 font-mono flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-slate-500" />
                {dataset.size}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Download className="w-3 h-3 text-slate-500" />
                {dataset.downloads > 999
                  ? `${(dataset.downloads / 1000).toFixed(1)}k`
                  : dataset.downloads}{' '}
                downloads
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {dataset.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {dataset.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-400 border border-slate-800/80"
            >
              {tag}
            </span>
          ))}
          {dataset.isDraft && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/50">
              Local Draft
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
        <button
          onClick={() => onViewDetails(dataset.id)}
          className="flex-1 py-2 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/40 hover:border-cyan-500/60 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>

        <button
          onClick={(e) => onDownload(dataset, e)}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-slate-700 transition-colors"
          title={`Download ${dataset.title}`}
          aria-label={`Download ${dataset.title}`}
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
