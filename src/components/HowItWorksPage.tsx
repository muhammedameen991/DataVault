import React from 'react';
import {
  FilePlus2,
  Compass,
  Rocket,
  Share2,
  ShieldCheck,
  ServerOff,
  GitPullRequest,
  CheckCircle,
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigatePublish: () => void;
  onNavigateBrowse: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onNavigatePublish,
  onNavigateBrowse,
}) => {
  const steps = [
    {
      num: '1',
      title: 'Add a Dataset',
      desc: 'Place your file in the repository and update datasets.json with the metadata.',
      icon: FilePlus2,
      color: 'text-cyan-400',
      border: 'hover:border-cyan-500/50',
    },
    {
      num: '2',
      title: 'Browse & Discover',
      desc: 'Visitors can search, preview, and download published datasets easily in any modern browser.',
      icon: Compass,
      color: 'text-blue-400',
      border: 'hover:border-blue-500/50',
    },
    {
      num: '3',
      title: 'Deploy to Vercel',
      desc: 'Push your changes to GitHub and Vercel will automatically build and deploy the updated static site.',
      icon: Rocket,
      color: 'text-purple-400',
      border: 'hover:border-purple-500/50',
    },
    {
      num: '4',
      title: 'Share Knowledge',
      desc: 'Help developers, educators, data scientists, and students by contributing accurate open datasets.',
      icon: Share2,
      color: 'text-emerald-400',
      border: 'hover:border-emerald-500/50',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How It Works
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          DataVault is a static website. Here's how you can add, discover, and access public data without relying on proprietary databases.
        </p>
      </div>

      {/* 4 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className={`glass-card rounded-2xl p-6 border border-slate-800/90 transition-all duration-200 flex items-start gap-4 ${step.border}`}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                <Icon className={`w-6 h-6 ${step.color}`} />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 mb-1 block">
                  STEP 0{step.num}
                </span>
                <h3 className="text-lg font-bold text-white mb-1.5">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Highlight Banner: No Backend, No Database */}
      <div className="glass-card rounded-2xl p-8 border border-cyan-800/50 relative overflow-hidden bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
            <ServerOff className="w-8 h-8 text-cyan-400" />
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              No Backend. No Database.
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Everything is static and served from GitHub + Vercel with zero operating costs, maximum speed, and uncompromised transparency.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateBrowse}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all"
            >
              Browse Datasets
            </button>
            <button
              onClick={onNavigatePublish}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 font-semibold text-sm transition-all"
            >
              Publish Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
