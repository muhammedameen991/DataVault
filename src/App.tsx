import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsSection } from './components/StatsSection';
import { BrowseCategories } from './components/BrowseCategories';
import { FeaturedDatasets } from './components/FeaturedDatasets';
import { RecentlyAdded } from './components/RecentlyAdded';
import { BrowsePage } from './components/BrowsePage';
import { DatasetDetailPage } from './components/DatasetDetailPage';
import { PublishPage } from './components/PublishPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { AboutPage } from './components/AboutPage';
import { CategoriesPage } from './components/CategoriesPage';
import { LegalPages } from './components/LegalPages';
import { NotFoundPage } from './components/NotFoundPage';
import { SharedSnippetPage } from './components/SharedSnippetPage';
import { Footer } from './components/Footer';
import { QuickSearchModal } from './components/QuickSearchModal';
import { Dataset, DatasetCategory } from './types';
import { calculateStats, decodeShareableFragment } from './utils/dataVaultLogic';

export default function App() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string>('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('datavault_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('datavault_theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  // Fetch catalog from /data/datasets.json
  useEffect(() => {
    fetch('/data/datasets.json')
      .then((res) => {
        if (!res.ok) throw new Error('Catalog fetch failed');
        return res.json();
      })
      .then((data: Dataset[]) => {
        setDatasets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching datasets catalog:', err);
        setLoading(false);
      });
  }, []);

  // Hash-based router listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash || hash === 'home') {
        setCurrentRoute('home');
        setRouteParam('');
      } else if (hash.startsWith('dataset/')) {
        setCurrentRoute('dataset');
        setRouteParam(hash.replace('dataset/', ''));
      } else if (hash.startsWith('browse')) {
        setCurrentRoute('browse');
      } else if (hash.startsWith('categories')) {
        setCurrentRoute('categories');
      } else if (hash.startsWith('publish')) {
        setCurrentRoute('publish');
      } else if (hash.startsWith('how-it-works')) {
        setCurrentRoute('how-it-works');
      } else if (hash.startsWith('about')) {
        setCurrentRoute('about');
      } else if (hash.startsWith('privacy')) {
        setCurrentRoute('privacy');
      } else if (hash.startsWith('terms')) {
        setCurrentRoute('terms');
      } else if (hash.startsWith('copyright')) {
        setCurrentRoute('copyright');
      } else if (hash.startsWith('contact')) {
        setCurrentRoute('contact');
      } else if (hash.startsWith('share')) {
        setCurrentRoute('share');
      } else {
        setCurrentRoute('404');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (param) {
      window.location.hash = `#/${route}/${param}`;
    } else {
      window.location.hash = `#/${route}`;
    }
  };

  // Real download handler: triggers browser download
  const handleDownload = (dataset: Dataset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (dataset.draftContent) {
      const blob = new Blob([dataset.draftContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataset.id}.${dataset.format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Downloading local draft: ${dataset.title}`);
      return;
    }

    if (dataset.fileUrl) {
      fetch(dataset.fileUrl)
        .then((res) => {
          if (!res.ok) throw new Error('File not available on server');
          return res.blob();
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const fileName = dataset.fileUrl.split('/').pop() || `${dataset.id}.${dataset.format.toLowerCase()}`;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast(`Downloading ${dataset.title}`);
        })
        .catch(() => {
          // Direct fallback anchor navigation
          window.location.href = dataset.fileUrl;
        });
    }
  };

  // Calculate live stats
  const stats = calculateStats(datasets);

  // Category counts
  const categoryCounts = datasets.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Selected dataset for detail view
  const selectedDataset = datasets.find((d) => d.id === routeParam);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 font-sans ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0f17] text-slate-100'} selection:bg-cyan-500 selection:text-slate-950`}>
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className="glass-panel px-4 py-3 rounded-xl border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 text-xs sm:text-sm font-medium text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenQuickSearch={() => setQuickSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Route: Home */}
        {currentRoute === 'home' && (
          <div>
            <Hero
              onSearch={(term) => {
                setSearchQuery(term);
                navigate('browse');
              }}
              onNavigatePublish={() => navigate('publish')}
              onNavigateBrowse={() => navigate('browse')}
            />
            <StatsSection
              totalDatasets={stats.totalDatasets}
              totalCategories={stats.totalCategories}
              totalDownloads={stats.totalDownloads}
              totalFileTypes={stats.totalFileTypes}
            />
            <BrowseCategories
              onSelectCategory={(cat: DatasetCategory) => {
                setSelectedCategoryFilter(cat);
                navigate('browse');
              }}
              onViewAll={() => navigate('categories')}
              categoryCounts={categoryCounts}
            />
            <FeaturedDatasets
              datasets={datasets}
              onViewDetails={(id) => navigate('dataset', id)}
              onDownload={handleDownload}
              onViewAll={() => navigate('browse')}
            />
            <RecentlyAdded
              datasets={datasets}
              onViewDetails={(id) => navigate('dataset', id)}
              onDownload={handleDownload}
              onViewAll={() => navigate('browse')}
            />
          </div>
        )}

        {/* Route: Browse */}
        {currentRoute === 'browse' && (
          <BrowsePage
            datasets={datasets}
            initialSearch={searchQuery}
            initialCategory={selectedCategoryFilter}
            onViewDetails={(id) => navigate('dataset', id)}
            onDownload={handleDownload}
          />
        )}

        {/* Route: Categories */}
        {currentRoute === 'categories' && (
          <CategoriesPage
            datasets={datasets}
            onSelectCategory={(cat: DatasetCategory) => {
              setSelectedCategoryFilter(cat);
              navigate('browse');
            }}
          />
        )}

        {/* Route: Dataset Detail */}
        {currentRoute === 'dataset' && (
          selectedDataset ? (
            <DatasetDetailPage
              dataset={selectedDataset}
              relatedDatasets={datasets}
              onBack={() => navigate('browse')}
              onSelectDataset={(id) => navigate('dataset', id)}
              onDownload={handleDownload}
              onShowToast={showToast}
            />
          ) : (
            <div className="py-20 text-center">
              <h2 className="text-xl font-bold text-white mb-2">Dataset Not Found</h2>
              <p className="text-slate-400 text-sm mb-4">
                The requested dataset identifier "{routeParam}" is not in the catalog.
              </p>
              <button
                onClick={() => navigate('browse')}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Browse All Datasets
              </button>
            </div>
          )
        )}

        {/* Route: Publish / Local Drafts */}
        {currentRoute === 'publish' && (
          <PublishPage
            onShowToast={showToast}
            onNavigateDetail={(id) => navigate('dataset', id)}
          />
        )}

        {/* Route: How It Works */}
        {currentRoute === 'how-it-works' && (
          <HowItWorksPage
            onNavigatePublish={() => navigate('publish')}
            onNavigateBrowse={() => navigate('browse')}
          />
        )}

        {/* Route: About */}
        {currentRoute === 'about' && <AboutPage />}

        {/* Route: Share Snippet */}
        {currentRoute === 'share' && (
          <SharedSnippetPage
            onBack={() => navigate('browse')}
            onShowToast={showToast}
          />
        )}

        {/* Legal & Contact Pages */}
        {(currentRoute === 'privacy' ||
          currentRoute === 'terms' ||
          currentRoute === 'copyright' ||
          currentRoute === 'contact') && (
          <LegalPages
            page={currentRoute as 'privacy' | 'terms' | 'copyright' | 'contact'}
            onShowToast={showToast}
          />
        )}

        {/* Route: 404 */}
        {currentRoute === '404' && (
          <NotFoundPage
            onNavigateHome={() => navigate('home')}
            onSearch={(term) => {
              setSearchQuery(term);
              navigate('browse');
            }}
          />
        )}
      </main>

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        datasets={datasets}
        onSelectDataset={(id) => navigate('dataset', id)}
      />

      {/* Footer */}
      <Footer navigate={navigate} onShowToast={showToast} />
    </div>
  );
}
