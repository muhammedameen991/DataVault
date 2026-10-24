import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, FileX } from 'lucide-react';
import { Dataset, DatasetFormat, DatasetCategory, SortOption } from '../types';
import { DatasetCard } from './DatasetCard';
import { filterAndSortDatasets } from '../utils/dataVaultLogic';

interface BrowsePageProps {
  datasets: Dataset[];
  initialSearch?: string;
  initialCategory?: string;
  onViewDetails: (id: string) => void;
  onDownload: (dataset: Dataset, e: React.MouseEvent) => void;
}

export const BrowsePage: React.FC<BrowsePageProps> = ({
  datasets,
  initialSearch = '',
  initialCategory = 'All',
  onViewDetails,
  onDownload,
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [format, setFormat] = useState<string>('All');
  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const formats = ['All', 'JSON', 'CSV', 'TXT', 'Markdown', 'HTML', 'PDF', 'ZIP'];

  const categories: string[] = [
    'All',
    'Education',
    'Environment',
    'Health',
    'Technology',
    'Social',
    'Transport',
    'Finance',
    'Other',
  ];

  // Filtered and sorted dataset items
  const filteredDatasets = useMemo(() => {
    return filterAndSortDatasets(datasets, {
      search,
      format,
      category,
      sort,
    });
  }, [datasets, search, format, category, sort]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage) || 1;
  const paginatedDatasets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDatasets.slice(start, start + itemsPerPage);
  }, [filteredDatasets, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Browse All Datasets
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-1">
          Explore our complete collection of public datasets and files.
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search datasets, tags, or categories..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/80 transition-colors"
          />
        </div>

        {/* Category & Sort controls */}
        <div className="flex items-center gap-3">
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/80 cursor-pointer"
            aria-label="Filter by category"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2.5 text-sm">
            <span className="text-xs text-slate-400 hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortOption);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-200 text-sm focus:outline-none cursor-pointer"
              aria-label="Sort datasets"
            >
              <option value="newest" className="bg-slate-900 text-white">Newest</option>
              <option value="oldest" className="bg-slate-900 text-white">Oldest</option>
              <option value="downloads" className="bg-slate-900 text-white">Most Downloaded</option>
              <option value="title-asc" className="bg-slate-900 text-white">Title A-Z</option>
              <option value="title-desc" className="bg-slate-900 text-white">Title Z-A</option>
              <option value="size" className="bg-slate-900 text-white">File Size</option>
            </select>
          </div>
        </div>
      </div>

      {/* Format Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8 overflow-x-auto pb-2">
        {formats.map((fmt) => {
          const isActive = format.toLowerCase() === fmt.toLowerCase();
          return (
            <button
              key={fmt}
              onClick={() => {
                setFormat(fmt);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-cyan-500/30 hover:text-white'
              }`}
            >
              {fmt}
            </button>
          );
        })}
      </div>

      {/* Dataset Cards Grid */}
      {paginatedDatasets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {paginatedDatasets.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              dataset={dataset}
              onViewDetails={onViewDetails}
              onDownload={onDownload}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 my-8">
          <FileX className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No datasets found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-5">
            We couldn't find any datasets matching your criteria. Try adjusting your search query or filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setFormat('All');
              setCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                currentPage === pageNum
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
