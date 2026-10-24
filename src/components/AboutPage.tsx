import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Users2,
  Lock,
  Globe2,
  Code2,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>About DataVault</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          A simple mission: make public data accessible to everyone.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          DataVault is a free, open-source platform built with HTML, CSS, and modern JavaScript. It allows anyone to discover, preview, and download public datasets and files. We believe that open data creates opportunities for learning, innovation, and a more informed world.
        </p>
      </div>

      {/* 3 Pillars from mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800/90 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center mx-auto text-cyan-400">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Open & Free</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            No registration, paywalls, or personal data tracking required. Purely public knowledge accessible directly in your web browser.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800/90 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center mx-auto text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Static & Secure</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Zero backend, zero database exploits, and zero server downtime. Delivered statically via high-performance edge networks.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800/90 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center mx-auto text-purple-400">
            <Users2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Community Driven</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Built for researchers, educators, students, and software engineers. Maintained through open contributions and transparent licenses.
          </p>
        </div>
      </div>

      {/* Architecture details */}
      <div className="glass-card rounded-2xl p-8 border border-slate-800/90 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          <span>Architecture & Transparency</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Traditional data catalogs often require heavy relational databases, administrative authentication, complex microservices, and subscription tiers. DataVault takes an intentionally lean, static-first approach:
        </p>
        <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
          <li><strong>The catalog</strong> is a version-controlled static JSON document (<code className="text-cyan-300 font-mono">datasets.json</code>) loaded once and cached in the client.</li>
          <li><strong>All public datasets</strong> are stored directly as static assets in the repository, making them cloneable, auditable, and immutable.</li>
          <li><strong>Client-side data processing</strong> handles parsing, formatting, table sorting, and search without consuming external cloud computation.</li>
          <li><strong>No tracking:</strong> No telemetry cookies, no third-party behavioral beacons, and no hidden scripts.</li>
        </ul>
      </div>
    </div>
  );
};
