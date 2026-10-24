import React, { useState } from 'react';
import { Search, Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onSearch: (term: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onSearch,
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="inline-block p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 font-mono text-4xl font-extrabold mb-2">
        404
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Lost in 404
      </h1>

      <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
        The dataset or page you are looking for does not exist in this static catalog or may have been moved.
      </p>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search catalog for datasets..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all"
        >
          Search
        </button>
      </form>

      <div className="pt-4">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition-colors"
        >
          <Home className="w-4 h-4 text-cyan-400" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
};
