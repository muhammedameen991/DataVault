import React from 'react';
import {
  GraduationCap,
  Leaf,
  HeartPulse,
  Cpu,
  Users,
  Bus,
  Landmark,
  FolderArchive,
  ArrowRight,
  Database,
} from 'lucide-react';
import { DatasetCategory, Dataset } from '../types';

interface CategoriesPageProps {
  datasets: Dataset[];
  onSelectCategory: (category: DatasetCategory) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  datasets,
  onSelectCategory,
}) => {
  const categoryDefs: {
    name: DatasetCategory;
    icon: React.ElementType;
    desc: string;
    iconColor: string;
    borderHover: string;
    bgGlow: string;
  }[] = [
    {
      name: 'Education',
      icon: GraduationCap,
      desc: 'Academic curricula, research papers, chemistry tables, and geography metrics.',
      iconColor: 'text-cyan-400',
      borderHover: 'hover:border-cyan-500/50 hover:bg-cyan-950/20',
      bgGlow: 'bg-cyan-950/50 border-cyan-800/40',
    },
    {
      name: 'Environment',
      icon: Leaf,
      desc: 'Climate change observations, greenhouse gases, solar/wind electricity, and forestry.',
      iconColor: 'text-emerald-400',
      borderHover: 'hover:border-emerald-500/50 hover:bg-emerald-950/20',
      bgGlow: 'bg-emerald-950/50 border-emerald-800/40',
    },
    {
      name: 'Health',
      icon: HeartPulse,
      desc: 'Hospital directories, public health statistics, epidemiological timelines, and metrics.',
      iconColor: 'text-rose-400',
      borderHover: 'hover:border-rose-500/50 hover:bg-rose-950/20',
      bgGlow: 'bg-rose-950/50 border-rose-800/40',
    },
    {
      name: 'Technology',
      icon: Cpu,
      desc: 'Open-source registries, AI evaluation benchmarks, developer frameworks, and specs.',
      iconColor: 'text-blue-400',
      borderHover: 'hover:border-blue-500/50 hover:bg-blue-950/20',
      bgGlow: 'bg-blue-950/50 border-blue-800/40',
    },
    {
      name: 'Social',
      icon: Users,
      desc: 'Global population census, demographic distributions, urban rates, and migration.',
      iconColor: 'text-purple-400',
      borderHover: 'hover:border-purple-500/50 hover:bg-purple-950/20',
      bgGlow: 'bg-purple-950/50 border-purple-800/40',
    },
    {
      name: 'Transport',
      icon: Bus,
      desc: 'Transit GTFS systems, travel destinations, airport routes, and road safety figures.',
      iconColor: 'text-amber-400',
      borderHover: 'hover:border-amber-500/50 hover:bg-amber-950/20',
      bgGlow: 'bg-amber-950/50 border-amber-800/40',
    },
    {
      name: 'Finance',
      icon: Landmark,
      desc: 'Historical stock indices, currency exchange rates, trade balances, and commodity prices.',
      iconColor: 'text-teal-400',
      borderHover: 'hover:border-teal-500/50 hover:bg-teal-950/20',
      bgGlow: 'bg-teal-950/50 border-teal-800/40',
    },
    {
      name: 'Other',
      icon: FolderArchive,
      desc: 'Regional administrative boundaries, government gazettes, and general public domain archives.',
      iconColor: 'text-indigo-400',
      borderHover: 'hover:border-indigo-500/50 hover:bg-indigo-950/20',
      bgGlow: 'bg-indigo-950/50 border-indigo-800/40',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Browse Categories
        </h1>
        <p className="text-base text-slate-400 mt-1">
          Explore structured data domains and discover curated datasets across all sectors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryDefs.map((cat) => {
          const Icon = cat.icon;
          const count = datasets.filter(
            (d) => d.category.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`glass-card rounded-2xl p-6 border border-slate-800/90 cursor-pointer group transition-all flex flex-col justify-between ${cat.borderHover}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${cat.bgGlow}`}>
                    <Icon className={`w-6 h-6 ${cat.iconColor}`} />
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    {count} datasets
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/70 flex items-center text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>View all {cat.name} datasets</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
