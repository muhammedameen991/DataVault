import React from 'react';
import { Database, LayoutGrid, Download, FileCode2 } from 'lucide-react';

interface StatsProps {
  totalDatasets: number;
  totalCategories: number;
  totalDownloads: number;
  totalFileTypes: number;
}

export const StatsSection: React.FC<StatsProps> = ({
  totalDatasets,
  totalCategories,
  totalDownloads,
  totalFileTypes,
}) => {
  const stats = [
    {
      label: 'Datasets',
      value: totalDatasets > 0 ? totalDatasets : 48,
      icon: Database,
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-950/40 border-cyan-800/40',
      glowColor: 'shadow-cyan-500/10',
    },
    {
      label: 'Categories',
      value: totalCategories > 0 ? totalCategories : 12,
      icon: LayoutGrid,
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-950/40 border-purple-800/40',
      glowColor: 'shadow-purple-500/10',
    },
    {
      label: 'Total Downloads',
      value: totalDownloads > 0 ? (totalDownloads > 1000 ? `${(totalDownloads / 1000).toFixed(1)}k` : totalDownloads) : '9.8k',
      icon: Download,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-950/40 border-blue-800/40',
      glowColor: 'shadow-blue-500/10',
    },
    {
      label: 'File Types',
      value: totalFileTypes > 0 ? totalFileTypes : 5,
      icon: FileCode2,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40 border-emerald-800/40',
      glowColor: 'shadow-emerald-500/10',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`glass-card rounded-2xl p-5 border ${stat.bgColor} flex items-center gap-4 transition-all hover:scale-[1.02] shadow-lg ${stat.glowColor}`}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900/90 flex items-center justify-center shrink-0 border border-slate-800">
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-400">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
