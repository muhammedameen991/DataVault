import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileCode2,
  Trash2,
  Download,
  Share2,
  AlertCircle,
  CheckCircle2,
  Info,
  GitPullRequest,
  Copy,
  Check,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { DatasetCategory, DatasetFormat, LocalDraft } from '../types';
import {
  validatePublishForm,
  formatBytes,
  encodeShareableFragment,
} from '../utils/dataVaultLogic';

interface PublishPageProps {
  onShowToast: (msg: string) => void;
  onNavigateDetail?: (id: string) => void;
}

export const PublishPage: React.FC<PublishPageProps> = ({ onShowToast }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DatasetCategory>('Technology');
  const [format, setFormat] = useState<DatasetFormat>('JSON');
  const [tags, setTags] = useState('');
  const [source, setSource] = useState('Community Contribution');
  const [license, setLicense] = useState('CC BY 4.0');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [shareableUrl, setShareableUrl] = useState<string | null>(null);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);
  const [copiedPrJson, setCopiedPrJson] = useState(false);
  const [drafts, setDrafts] = useState<LocalDraft[]>([]);
  const [previewingDraft, setPreviewingDraft] = useState<LocalDraft | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing local drafts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('datavault_local_drafts');
      if (stored) {
        setDrafts(JSON.parse(stored));
      }
    } catch {
      // Ignore storage read error
    }
  }, []);

  const saveDraftsToStorage = (updatedDrafts: LocalDraft[]) => {
    setDrafts(updatedDrafts);
    try {
      localStorage.setItem('datavault_local_drafts', JSON.stringify(updatedDrafts));
    } catch {
      onShowToast('Could not save draft: Browser storage quota exceeded.');
    }
  };

  const processFile = (file: File) => {
    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ content: 'File exceeds maximum local size limit of 5 MB.' });
      return;
    }

    setFileName(file.name);
    setFileSizeStr(formatBytes(file.size));

    // Guess format from extension
    const ext = file.name.split('.').pop()?.toUpperCase() || 'TXT';
    if (ext === 'JSON') setFormat('JSON');
    else if (ext === 'CSV') setFormat('CSV');
    else if (ext === 'MD' || ext === 'MARKDOWN') setFormat('Markdown');
    else if (ext === 'HTML') setFormat('HTML');
    else if (ext === 'PDF') setFormat('PDF');
    else setFormat('TXT');

    // Auto set title if empty
    if (!title) {
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      setErrors({});
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSaveLocalDraft = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePublishForm({
      title,
      description,
      category,
      format,
      fileName,
      content: fileContent,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      onShowToast('Please fill all required fields correctly.');
      return;
    }

    const newDraft: LocalDraft = {
      id: `draft-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      format,
      size: fileSizeStr || `${fileContent.length} B`,
      tags: tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      source: source.trim() || 'Community Contribution',
      license: license.trim() || 'CC BY 4.0',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      content: fileContent,
      fileName: fileName || `${title.toLowerCase().replace(/\s+/g, '-')}.${format.toLowerCase()}`,
    };

    const updated = [newDraft, ...drafts];
    saveDraftsToStorage(updated);
    onShowToast('Draft saved to browser storage!');

    // Generate fragment if size allows
    const fragment = encodeShareableFragment({
      title: newDraft.title,
      format: newDraft.format,
      content: newDraft.content,
    });

    if (fragment) {
      setShareableUrl(`${window.location.origin}/#/share#${fragment}`);
    } else {
      setShareableUrl(null);
    }
  };

  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter((d) => d.id !== id);
    saveDraftsToStorage(updated);
    if (previewingDraft?.id === id) {
      setPreviewingDraft(null);
    }
    onShowToast('Draft removed from device.');
  };

  const handleDownloadDraft = (draft: LocalDraft) => {
    const blob = new Blob([draft.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = draft.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast(`Downloading ${draft.fileName}`);
  };

  const getPrMetadataJson = () => {
    return JSON.stringify(
      {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: title || 'Dataset Title',
        description: description || 'Dataset description...',
        category: category,
        format: format,
        size: fileSizeStr || '10 KB',
        downloads: 0,
        published: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        source: source || 'Source Attribution',
        license: license || 'CC BY 4.0',
        isLocal: true,
        fileUrl: `/datasets/${fileName || 'my-dataset.' + format.toLowerCase()}`,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      },
      null,
      2
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Publish or Draft Datasets
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-1">
          Prepare datasets in your browser, preview data tables, create local drafts, or prepare a Pull Request for global repository deployment.
        </p>
      </div>

      {/* Honest Architecture Disclaimer Banner */}
      <div className="mb-8 p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-300 space-y-1">
          <p className="font-bold text-white">
            Honest Architecture Notice: Zero Cloud Backend
          </p>
          <p>
            DataVault has no centralized database or cloud servers. Any file you draft here is stored <strong>locally in your browser's private storage</strong>. To make a dataset globally visible to every visitor worldwide, copy the generated metadata below and place the file in the repository's <code className="text-cyan-300 font-mono">/public/datasets/</code> directory.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Dropzone */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveLocalDraft} className="glass-card rounded-2xl p-6 border border-slate-800/90 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-cyan-400" />
              <span>1. File Selection</span>
            </h2>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-950/30'
                  : 'border-slate-700/80 hover:border-cyan-500/50 bg-slate-900/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".json,.csv,.txt,.md,.markdown,.html,.pdf,.zip"
              />
              <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">
                {fileName ? fileName : 'Click to select or drag and drop a file'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supported: JSON, CSV, TXT, Markdown, HTML, XML (Max 5MB for local drafts)
              </p>
              {fileSizeStr && (
                <span className="inline-block mt-2 text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                  Detected size: {fileSizeStr}
                </span>
              )}
            </div>

            {errors.content && (
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.content}
              </p>
            )}

            {/* Metadata Fields */}
            <h2 className="text-lg font-bold text-white pt-2 border-t border-slate-800/80">
              2. Dataset Metadata
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Dataset Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. World Solar Installations 2024"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
              {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a helpful summary of what this dataset contains, collection methodology, and schema..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
              {errors.description && (
                <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DatasetCategory)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Education">Education</option>
                  <option value="Environment">Environment</option>
                  <option value="Health">Health</option>
                  <option value="Technology">Technology</option>
                  <option value="Social">Social</option>
                  <option value="Transport">Transport</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Format *
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as DatasetFormat)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="JSON">JSON</option>
                  <option value="CSV">CSV</option>
                  <option value="TXT">TXT</option>
                  <option value="Markdown">Markdown</option>
                  <option value="HTML">HTML</option>
                  <option value="PDF">PDF</option>
                  <option value="ZIP">ZIP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="energy, solar, global, 2024"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Source Attribution
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. World Bank / Community"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  License
                </label>
                <input
                  type="text"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="CC BY 4.0, CC0, MIT, etc."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Direct text input if no file uploaded */}
            {!fileName && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Or Paste Raw Data Content:
                </label>
                <textarea
                  rows={4}
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  placeholder="Paste JSON or CSV data here..."
                  className="w-full bg-slate-950 font-mono text-xs border border-slate-800 rounded-xl p-3 text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {/* Submit Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save as Local Browser Draft</span>
              </button>

              {fileContent && (
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName || `${title || 'dataset'}.${format.toLowerCase()}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    onShowToast('Exported file to downloads');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Clean File</span>
                </button>
              )}
            </div>
          </form>

          {/* Shareable URL Fragment Banner if generated */}
          {shareableUrl && (
            <div className="glass-card rounded-2xl p-5 border border-cyan-800/60 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Share2 className="w-4 h-4" />
                <span>Small Data Shareable Link</span>
              </div>
              <p className="text-xs text-slate-300">
                This small dataset is encoded entirely in the URL hash fragment. Anyone opening this link can view the data without any server!
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareableUrl}
                  className="flex-1 bg-slate-950 text-xs font-mono px-3 py-2 rounded-lg border border-slate-800 text-slate-300 focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareableUrl);
                    setCopiedShareUrl(true);
                    onShowToast('Shareable link copied to clipboard!');
                    setTimeout(() => setCopiedShareUrl(false), 2000);
                  }}
                  className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-500/30 flex items-center gap-1 shrink-0"
                >
                  {copiedShareUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedShareUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Drafts & GitHub Pull Request Guide */}
        <div className="lg:col-span-5 space-y-6">
          {/* Local Drafts Manager */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/90 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>My Local Drafts ({drafts.length})</span>
              </h3>
              {drafts.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Clear all local drafts from this browser?')) {
                      saveDraftsToStorage([]);
                      onShowToast('All local drafts cleared.');
                    }
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {drafts.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-200 truncate">
                          {draft.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono">
                          <span className="text-cyan-400">{draft.format}</span> • {draft.size} • {draft.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setPreviewingDraft(draft)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                          title="Preview draft"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadDraft(draft)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                          title="Download draft"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                          title="Delete draft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                No local drafts saved yet. Upload a file on the left to save a browser draft.
              </p>
            )}
          </div>

          {/* Global Publishing (GitHub PR Guide) */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800/90 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <GitPullRequest className="w-4 h-4 text-purple-400" />
              <span>Global Public Publishing Guide</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Want to publish your dataset permanently for everyone worldwide? Since DataVault has zero server costs, all global datasets live in the open repository:
            </p>

            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside font-mono">
              <li>Place raw file into <span className="text-cyan-300">/public/datasets/</span></li>
              <li>Append metadata entry into <span className="text-cyan-300">/public/data/datasets.json</span></li>
              <li>Submit PR or push to GitHub (Auto-deploys via Vercel)</li>
            </ol>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Copy Ready-to-Paste Catalog JSON:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(getPrMetadataJson());
                    setCopiedPrJson(true);
                    onShowToast('Metadata JSON copied to clipboard!');
                    setTimeout(() => setCopiedPrJson(false), 2000);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedPrJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPrJson ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-48 border border-slate-800">
                <code>{getPrMetadataJson()}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for previewing a selected local draft */}
      {previewingDraft && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-700 shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{previewingDraft.title}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {previewingDraft.format} • {previewingDraft.size} • {previewingDraft.category}
                </p>
              </div>
              <button
                onClick={() => setPreviewingDraft(null)}
                className="text-slate-400 hover:text-white px-2 py-1 text-sm rounded-lg"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1 bg-slate-950">
              <pre className="font-mono text-xs text-cyan-300">
                <code>{previewingDraft.content}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
