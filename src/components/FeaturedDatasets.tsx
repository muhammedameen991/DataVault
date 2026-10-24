import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Dataset } from '../types';
import { DatasetCard } from './DatasetCard';

interface FeaturedDatasetsProps {
  datasets: Dataset[];
  onViewDetails: (id: string) => void;
  onDownload: (dataset: Dataset, e: React.MouseEvent) => void;
  onViewAll: () => void;
}

export const FeaturedDatasets: React.FC<FeaturedDatasetsProps> = ({
  datasets,
  onViewDetails,
  onDownload,
  onViewAll,
}) => {
  const featured = datasets.filter((d) => d.featured).slice(0, 3);
  const displayItems = featured.length > 0 ? featured : datasets.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Featured Datasets
            </h2>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-sm text-slate-400 mt-1">Most popular and useful datasets</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors group"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((dataset) => (
          <DatasetCard
            key={dataset.id}
            dataset={dataset}
            onViewDetails={onViewDetails}
            onDownload={onDownload}
          />
        ))}
      </div>
    </section>
  );
};
