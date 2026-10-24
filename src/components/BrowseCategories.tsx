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
} from 'lucide-react';
import { DatasetCategory } from '../types';

interface BrowseCategoriesProps {
  onSelectCategory: (category: DatasetCategory) => void;
  onViewAll: () => void;
  categoryCounts?: Record<string, number>;
}

export const BrowseCategories: React.FC<BrowseCategoriesProps> = ({
  onSelectCategory,
  onViewAll,
  categoryCounts = {},
}) => {
  const categories: {
    name: DatasetCategory;
    icon: React.ElementType;
    iconColor: string;
    bgAccent: string;
    defaultCount: number;
  }[] = [
    {
      name: 'Education',
      icon: GraduationCap,
      iconColor: 'text-cyan-400',
      bgAccent: 'group-hover:border-cyan-500/50 group-hover:bg-cyan-950/20',
      defaultCount: 6,
    },
    {
      name: 'Environment',
      icon: Leaf,
      iconColor: 'text-emerald-400',
      bgAccent: 'group-hover:border-emerald-500/50 group-hover:bg-emerald-950/20',
      defaultCount: 6,
    },
    {
      name: 'Health',
      icon: HeartPulse,
      iconColor: 'text-rose-400',
      bgAccent: 'group-hover:border-rose-500/50 group-hover:bg-rose-950/20',
      defaultCount: 5,
    },
    {
      name: 'Technology',
      icon: Cpu,
      iconColor: 'text-blue-400',
      bgAccent: 'group-hover:border-blue-500/50 group-hover:bg-blue-950/20',
      defaultCount: 7,
    },
    {
      name: 'Social',
      icon: Users,
      iconColor: 'text-purple-400',
      bgAccent: 'group-hover:border-purple-500/50 group-hover:bg-purple-950/20',
      defaultCount: 4,
    },
    {
      name: 'Transport',
      icon: Bus,
      iconColor: 'text-amber-400',
      bgAccent: 'group-hover:border-amber-500/50 group-hover:bg-amber-950/20',
      defaultCount: 5,
    },
    {
      name: 'Finance',
      icon: Landmark,
      iconColor: 'text-teal-400',
      bgAccent: 'group-hover:border-teal-500/50 group-hover:bg-teal-950/20',
      defaultCount: 4,
    },
    {
      name: 'Other',
      icon: FolderArchive,
      iconColor: 'text-indigo-400',
      bgAccent: 'group-hover:border-indigo-500/50 group-hover:bg-indigo-950/20',
      defaultCount: 9,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Browse Categories
          </h2>
          <p className="text-sm text-slate-400 mt-1">Explore data by category</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors group"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const count = categoryCounts[cat.name] ?? cat.defaultCount;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`group glass-card rounded-xl p-4 text-left border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200 flex items-center gap-3.5 ${cat.bgAccent}`}
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Icon className={`w-5 h-5 ${cat.iconColor}`} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{count} datasets</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
