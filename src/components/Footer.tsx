import React, { useState } from 'react';
import { Database, Github, Twitter, Linkedin, Heart, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
  onShowToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate, onShowToast }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      onShowToast('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    onShowToast('Thanks for subscribing to public dataset releases!');
    setEmail('');
  };

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigate('home')}
              className="flex items-center gap-2.5 cursor-pointer group w-fit"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Database className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-white">
                Data<span className="text-cyan-400">Vault</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Share Data. Discover Knowledge. A modern, free, and open platform for exploring, previewing, and downloading public datasets.
            </p>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => navigate('home')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('browse')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Browse
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('categories')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('how-it-works')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Resources
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('privacy')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('terms')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('copyright')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Copyright & Takedown
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('contact')}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Stay Updated */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Stay Updated
            </h4>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
              >
                {subscribed ? 'Subscribed ✓' : 'Subscribe'}
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a
                href="https://github.com/iamameen"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/iamameen"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
                aria-label="Twitter / X Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/iamameen"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits Bar matching screenshot */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            Developed by Ameen —{' '}
            <a
              href="https://iamameen.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline font-medium"
            >
              https://iamameen.vercel.app/
            </a>
          </p>
          <span className="font-mono text-slate-400">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};
