import React, { useEffect, useState } from 'react';
import { Share2, Download, Copy, Check, AlertTriangle, ArrowLeft, FileText } from 'lucide-react';
import { decodeShareableFragment } from '../utils/dataVaultLogic';

interface SharedSnippetPageProps {
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const SharedSnippetPage: React.FC<SharedSnippetPageProps> = ({
  onBack,
  onShowToast,
}) => {
  const [snippet, setSnippet] = useState<{
    title: string;
    format: string;
    content: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Read fragment after the hash
    const fullHash = window.location.hash;
    // format is #/share#<fragment> or #share#<fragment>
    const parts = fullHash.split('#');
    const fragment = parts.length > 2 ? parts[2] : parts[1]?.replace(/^\/?share/, '');

    if (fragment) {
      const decoded = decodeShareableFragment(fragment);
      setSnippet(decoded);
    }
  }, []);

  const handleCopy = () => {
    if (!snippet) return;
    navigator.clipboard.writeText(snippet.content).then(() => {
      setCopied(true);
      onShowToast('Copied shared data to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    if (!snippet) return;
    const blob = new Blob([snippet.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snippet.title.toLowerCase().replace(/\s+/g, '-')}.${snippet.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast(`Downloading ${snippet.title}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Catalog</span>
      </button>

      {snippet ? (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  URL-Fragment Shared Snippet
                </span>
                <h1 className="text-2xl font-bold text-white">{snippet.title}</h1>
                <span className="text-xs font-mono text-slate-400">
                  Format: {snippet.format}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Privacy Warning */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-2.5 text-xs text-amber-200/90">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              This snippet was transmitted completely client-side inside the URL hash fragment. No server has logged or inspected this content. Treat all untrusted data carefully before execution.
            </p>
          </div>

          {/* Content Viewer */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-auto max-h-96">
            <pre className="font-mono text-xs text-cyan-300 whitespace-pre-wrap">
              <code>{snippet.content}</code>
            </pre>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-4">
          <Share2 className="w-12 h-12 text-slate-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">No Valid Snippet Detected</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            The URL fragment did not contain valid snippet data or was formatted improperly.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Go to Catalog
          </button>
        </div>
      )}
    </div>
  );
};
