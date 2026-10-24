import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Eye,
  Link2,
  Check,
  ShieldCheck,
  Calendar,
  Building,
  FileCode2,
  FileSpreadsheet,
  FileText,
  HardDrive,
  Copy,
  Table,
  Code2,
  Sparkles,
} from 'lucide-react';
import { Dataset } from '../types';
import { parseCsvToTable } from '../utils/dataVaultLogic';

interface DatasetDetailPageProps {
  dataset: Dataset;
  relatedDatasets: Dataset[];
  onBack: () => void;
  onSelectDataset: (id: string) => void;
  onDownload: (dataset: Dataset, e: React.MouseEvent) => void;
  onShowToast: (message: string) => void;
}

export const DatasetDetailPage: React.FC<DatasetDetailPageProps> = ({
  dataset,
  relatedDatasets,
  onBack,
  onSelectDataset,
  onDownload,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'metadata' | 'raw'>('preview');
  const [fileContent, setFileContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [tableSearch, setTableSearch] = useState('');

  // Fetch file content from static path or draft
  useEffect(() => {
    let isMounted = true;
    setLoadingContent(true);

    if (dataset.draftContent) {
      setFileContent(dataset.draftContent);
      setLoadingContent(false);
      return;
    }

    if (dataset.fileUrl) {
      fetch(dataset.fileUrl)
        .then((res) => {
          if (!res.ok) throw new Error('File not found');
          return res.text();
        })
        .then((text) => {
          if (isMounted) {
            setFileContent(text);
            setLoadingContent(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setFileContent('// File preview could not be loaded from static storage.');
            setLoadingContent(false);
          }
        });
    } else {
      setLoadingContent(false);
    }

    return () => {
      isMounted = false;
    };
  }, [dataset]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#/dataset/${dataset.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      onShowToast('Dataset link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleCopyContent = () => {
    if (!fileContent) return;
    navigator.clipboard.writeText(fileContent).then(() => {
      setCopiedContent(true);
      onShowToast('File content copied to clipboard!');
      setTimeout(() => setCopiedContent(false), 2000);
    });
  };

  // Render CSV table
  const csvParsed = React.useMemo(() => {
    if (dataset.format.toUpperCase() === 'CSV' && fileContent) {
      return parseCsvToTable(fileContent);
    }
    return null;
  }, [dataset.format, fileContent]);

  const filteredCsvRows = React.useMemo(() => {
    if (!csvParsed) return [];
    if (!tableSearch.trim()) return csvParsed.rows;
    const q = tableSearch.toLowerCase();
    return csvParsed.rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(q))
    );
  }, [csvParsed, tableSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to Browse link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Browse</span>
      </button>

      {/* Hero Banner Header Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl mb-8">
        {/* Banner Graphic Header */}
        <div className="relative h-44 sm:h-56 bg-gradient-to-r from-slate-900 via-cyan-950 to-indigo-950 overflow-hidden">
          {/* Subtle scenic overlay simulation */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400/30 via-blue-600/20 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-cyan-300 border border-cyan-800/50 backdrop-blur-md">
              {dataset.isLocal ? 'Verified Public Dataset' : 'External Dataset'}
            </span>
          </div>
        </div>

        {/* Content details inside card */}
        <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-cyan-500/40 flex items-center justify-center shrink-0 shadow-xl shadow-cyan-500/10">
                {dataset.format === 'CSV' ? (
                  <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
                ) : dataset.format === 'JSON' ? (
                  <FileCode2 className="w-8 h-8 text-amber-400" />
                ) : (
                  <FileText className="w-8 h-8 text-cyan-400" />
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {dataset.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm font-mono text-slate-400">
                  <span className="px-2.5 py-0.5 rounded-md font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                    {dataset.format}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                    {dataset.size}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    {dataset.downloads} downloads
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={(e) => onDownload(dataset, e)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('preview');
                  const el = document.getElementById('dataset-preview-box');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Preview</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
                title="Copy shareable link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 text-slate-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
            {dataset.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {dataset.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-300 text-xs font-medium border border-slate-800"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom metadata strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
            <div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                Source
              </p>
              <p className="text-sm font-semibold text-slate-200 truncate" title={dataset.source}>
                {dataset.source}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                License
              </p>
              <p className="text-sm font-semibold text-slate-200 truncate" title={dataset.license}>
                {dataset.license}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Published
              </p>
              <p className="text-sm font-semibold text-slate-200">{dataset.published}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                Distribution
              </p>
              <p className="text-sm font-semibold text-slate-200">
                {dataset.isDraft ? 'Browser Local Draft' : 'Static Repo File'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Preview & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tabs & Preview Area */}
        <div className="lg:col-span-8 space-y-4" id="dataset-preview-box">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'metadata'
                    ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                Metadata
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'raw'
                    ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                Raw Data
              </button>
            </div>

            {activeTab !== 'metadata' && (
              <button
                onClick={handleCopyContent}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors"
                title="Copy raw content"
              >
                {copiedContent ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Data</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Tab 1: Preview View */}
          {activeTab === 'preview' && (
            <div className="glass-card rounded-2xl border border-slate-800/90 overflow-hidden">
              {loadingContent ? (
                <div className="p-12 text-center text-slate-400 font-mono text-sm">
                  Loading dataset preview...
                </div>
              ) : dataset.format.toUpperCase() === 'CSV' && csvParsed ? (
                /* CSV Interactive Table View */
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-400 font-mono">
                      Showing {filteredCsvRows.length} of {csvParsed.rows.length} rows
                    </span>
                    <input
                      type="text"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      placeholder="Filter rows..."
                      className="text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
                    />
                  </div>

                  <div className="overflow-x-auto max-h-[500px] border border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900/95 sticky top-0 text-cyan-400 border-b border-slate-800">
                        <tr>
                          <th className="px-3 py-2.5 text-slate-500 font-bold w-12">#</th>
                          {csvParsed.headers.map((h, i) => (
                            <th key={i} className="px-3 py-2.5 font-bold uppercase tracking-wider whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {filteredCsvRows.slice(0, 100).map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-3 py-2 text-slate-500">{rIdx + 1}</td>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3 py-2 text-slate-300 whitespace-nowrap">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* JSON or Text Code block with syntax styling */
                <div className="bg-[#0b0f17] p-4 overflow-x-auto max-h-[500px]">
                  <pre className="font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed">
                    <code>{fileContent}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Metadata View */}
          {activeTab === 'metadata' && (
            <div className="glass-card rounded-2xl p-6 border border-slate-800/90 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Dataset Catalog Metadata</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Dataset ID</span>
                  <span className="text-slate-200">{dataset.id}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Category</span>
                  <span className="text-slate-200">{dataset.category}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Format Specification</span>
                  <span className="text-slate-200">{dataset.format} format</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Estimated Size</span>
                  <span className="text-slate-200">{dataset.size}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Canonical File URL</span>
                  <span className="text-cyan-400 break-all">{dataset.fileUrl}</span>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">License Type</span>
                  <span className="text-emerald-400">{dataset.license}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
                <p>
                  This dataset is stored statically inside the repository and delivered through standard HTTP GET caching headers. Anyone can fork or pull the repository to verify the files.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Raw Data View */}
          {activeTab === 'raw' && (
            <div className="glass-card rounded-2xl border border-slate-800/90 overflow-hidden">
              <div className="bg-slate-950 p-4 max-h-[500px] overflow-auto">
                <textarea
                  readOnly
                  value={fileContent}
                  className="w-full h-96 bg-transparent font-mono text-xs text-slate-300 resize-none focus:outline-none"
                  aria-label="Raw file content"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Related Datasets Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-800/90">
            <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Related Datasets</span>
            </h3>

            <div className="space-y-3">
              {relatedDatasets
                .filter((d) => d.id !== dataset.id)
                .slice(0, 4)
                .map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectDataset(rel.id)}
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                        {rel.format === 'CSV' ? (
                          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <FileCode2 className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 truncate transition-colors">
                          {rel.title}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          <span className="text-cyan-400 font-semibold">{rel.format}</span> • {rel.size}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
