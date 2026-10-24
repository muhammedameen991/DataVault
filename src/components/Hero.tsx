import React, { useState } from 'react';
import { Search, Sparkles, Database, FileSpreadsheet, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onSearch: (term: string) => void;
  onNavigatePublish: () => void;
  onNavigateBrowse: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  onNavigatePublish,
  onNavigateBrowse,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const quickPills = [
    { label: 'covid', query: 'covid' },
    { label: 'kerala', query: 'kerala' },
    { label: 'csv', query: 'csv' },
    { label: 'json', query: 'json' },
    { label: 'education', query: 'education' },
  ];

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold tracking-wide">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Public Data Library</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Share <span className="text-cyan-400">Data.</span> <br className="hidden sm:inline" />
              Discover <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Knowledge.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              DataVault is a free, open platform where you can explore, preview and download public datasets and files. Find valuable data, contribute to the community, and make knowledge accessible to everyone.
            </p>

            {/* Big Search Form */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl pt-2">
              <div className="relative flex items-center shadow-2xl rounded-2xl p-1.5 glass-panel border border-slate-700/70 focus-within:border-cyan-500/80 transition-all duration-300">
                <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search datasets, categories, tags, or file types..."
                  className="w-full bg-transparent px-3.5 py-2.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
                  aria-label="Search datasets"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/25 shrink-0 transition-all active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>

              {/* Quick Pills */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-slate-400">
                  <ArrowRight className="w-3 h-3 text-cyan-400" />
                  <span>eg:</span>
                </span>
                {quickPills.map((pill) => (
                  <button
                    key={pill.label}
                    type="button"
                    onClick={() => {
                      setSearchTerm(pill.query);
                      onSearch(pill.query);
                    }}
                    className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Graphical showcase element on desktop */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="relative w-full max-w-sm mx-auto">
              {/* Back card */}
              <div className="absolute -top-4 -right-4 w-full h-64 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 backdrop-blur-md transform rotate-3" />
              {/* Front glass mockup card */}
              <div className="relative glass-card rounded-2xl p-6 border border-cyan-500/20 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900/40">
                    catalog.json
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                  <p className="text-cyan-400">{"// Zero backend, pure static"}</p>
                  <p><span className="text-purple-400">"status"</span>: <span className="text-emerald-400">"public"</span>,</p>
                  <p><span className="text-purple-400">"storage"</span>: <span className="text-emerald-400">"repository"</span>,</p>
                  <p><span className="text-purple-400">"verified"</span>: <span className="text-blue-400">true</span></p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Verified Public Data
                  </span>
                  <button
                    onClick={onNavigateBrowse}
                    className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
