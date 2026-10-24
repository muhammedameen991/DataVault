import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Dataset } from '../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasets: Dataset[];
  onSelectDataset: (id: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  datasets,
  onSelectDataset,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? datasets
        .filter(
          (d) =>
            d.title.toLowerCase().includes(query.toLowerCase()) ||
            d.description.toLowerCase().includes(query.toLowerCase()) ||
            d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
            d.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : datasets.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="glass-panel rounded-2xl max-w-xl w-full border border-slate-700 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search datasets by name, tag, or topic..."
            className="w-full bg-transparent text-white text-sm placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-80 overflow-y-auto divide-y divide-slate-800/40">
          <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Datasets'}
          </div>
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectDataset(item.id);
                onClose();
              }}
              className="p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    <span className="text-cyan-400">{item.format}</span> • {item.size} • {item.category}
                  </p>
                </div>
              </div>
              <CornerDownLeft className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          {results.length === 0 && (
            <div className="p-6 text-center text-sm text-slate-400">
              No matching datasets found.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Press ESC to close</span>
          <span>DataVault Catalog</span>
        </div>
      </div>
    </div>
  );
};
