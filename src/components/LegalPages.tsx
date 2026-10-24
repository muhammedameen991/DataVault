import React, { useState } from 'react';
import { Shield, FileCheck, Copyright, Mail, Send, CheckCircle2 } from 'lucide-react';

interface LegalPagesProps {
  page: 'privacy' | 'terms' | 'copyright' | 'contact';
  onShowToast: (msg: string) => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({ page, onShowToast }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Dataset Contribution / Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMessage) {
      onShowToast('Please provide an email and message.');
      return;
    }
    setContactSubmitted(true);
    onShowToast('Message transmitted! Ameen will get back to you shortly.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Privacy Policy */}
      {page === 'privacy' && (
        <div className="glass-card rounded-2xl p-8 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Privacy Policy</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Last updated: April 2025</p>
            </div>
          </div>

          <div className="prose prose-invert text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>
              DataVault is dedicated to total digital privacy. Because DataVault operates as an entirely static client-side web application without a centralized database or authentication backend, we do not collect, monetize, or harvest personal identifiable information.
            </p>

            <h3 className="text-base font-bold text-white pt-2">1. Information We Do Not Collect</h3>
            <p>
              We do not require user accounts, passwords, email addresses, or phone numbers to explore, preview, or download public datasets. All dataset downloads occur as direct client-to-static-file HTTP GET transfers.
            </p>

            <h3 className="text-base font-bold text-white pt-2">2. Browser Local Storage</h3>
            <p>
              When you use the "Publish" tool to create local drafts or save display preferences (such as light or dark theme), this data is stored strictly in your browser's local sandbox (<code className="text-cyan-300 font-mono">localStorage</code>). It never leaves your device and is never transmitted to our repository or third parties.
            </p>

            <h3 className="text-base font-bold text-white pt-2">3. Hosting and Content Delivery</h3>
            <p>
              DataVault is hosted statically on Vercel. Standard, ephemeral server request logs (such as IP addresses and User-Agent headers) may be recorded by edge networks purely for routing and DDoS mitigation in compliance with Vercel's global privacy standards.
            </p>
          </div>
        </div>
      )}

      {/* Terms of Service */}
      {page === 'terms' && (
        <div className="glass-card rounded-2xl p-8 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Terms of Service</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Effective: April 2025</p>
            </div>
          </div>

          <div className="prose prose-invert text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>
              Welcome to DataVault. By accessing or using this website, you agree to comply with and be bound by these terms.
            </p>

            <h3 className="text-base font-bold text-white pt-2">1. Public & Open Data Usage</h3>
            <p>
              All datasets hosted or cataloged on DataVault are provided under their respective open licenses (e.g. Creative Commons CC0, CC BY 4.0, MIT, Open Database License ODbL, or Government Open Data licenses). You agree to respect the individual attribution requirements and terms designated by each dataset's original publisher.
            </p>

            <h3 className="text-base font-bold text-white pt-2">2. "As Is" Warranty Disclaimer</h3>
            <p>
              DataVault is provided free of charge on an "as is" and "as available" basis without warranties of any kind, either express or implied. While we strive to maintain accurate data schemas and verified sources, we do not warrant that datasets are error-free, complete, or suitable for any critical decision-making purpose.
            </p>

            <h3 className="text-base font-bold text-white pt-2">3. Prohibited Content</h3>
            <p>
              Contributors proposing datasets via pull request must not submit private sensitive data (PII), medical records without de-identification, proprietary source materials, or malicious payloads.
            </p>
          </div>
        </div>
      )}

      {/* Copyright and Takedown Policy */}
      {page === 'copyright' && (
        <div className="glass-card rounded-2xl p-8 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <Copyright className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Copyright & Takedown Policy</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">DMCA / Notice & Takedown Procedure</p>
            </div>
          </div>

          <div className="prose prose-invert text-sm text-slate-300 space-y-4 leading-relaxed">
            <p>
              DataVault respects the intellectual property rights of creators and organizations. We only host or catalog datasets that have been made publicly available under open access licenses or dedicated to the public domain.
            </p>

            <h3 className="text-base font-bold text-white pt-2">Submitting a Takedown Notice</h3>
            <p>
              If you are a copyright owner or an authorized agent and believe that any dataset cataloged on DataVault infringes upon your copyright, please submit a formal notification with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>The exact URL or dataset identifier of the infringing material on DataVault.</li>
              <li>Your contact information (name, address, email, telephone number).</li>
              <li>A statement that you have a good-faith belief that the use is not authorized by the copyright owner.</li>
            </ul>
            <p className="pt-2">
              Please direct all copyright notifications to Ameen at <a href="mailto:ameendev111@gmail.com" className="text-cyan-400 hover:underline">ameendev111@gmail.com</a> or via GitHub issue. Valid notices are processed and files removed within 24–48 hours.
            </p>
          </div>
        </div>
      )}

      {/* Contact Information */}
      {page === 'contact' && (
        <div className="glass-card rounded-2xl p-8 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Get In Touch</h1>
              <p className="text-xs text-slate-400 mt-0.5">Have questions, feedback, or a dataset suggestion?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 space-y-4 text-sm text-slate-300">
              <p>
                DataVault is developed and maintained by <strong>Ameen</strong>. We welcome open data contributions, feature ideas, and collaborations.
              </p>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">Developer Portfolio</span>
                  <a
                    href="https://iamameen.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    https://iamameen.vercel.app/
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block">Direct Email</span>
                  <a
                    href="mailto:ameendev111@gmail.com"
                    className="text-cyan-400 hover:underline"
                  >
                    ameendev111@gmail.com
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block">Response Time</span>
                  <span className="text-slate-300">Within 24 business hours</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              {contactSubmitted ? (
                <div className="p-6 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Message Dispatched!</h3>
                  <p className="text-xs text-slate-300">
                    Thank you for reaching out. We will review your message and reply via email.
                  </p>
                  <button
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactMessage('');
                    }}
                    className="text-xs text-cyan-400 hover:underline font-semibold"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alex Miller"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Topic / Subject
                    </label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="Dataset Contribution / Inquiry">Dataset Contribution / Inquiry</option>
                      <option value="Bug Report or UI Suggestion">Bug Report or UI Suggestion</option>
                      <option value="Takedown / Copyright Request">Takedown / Copyright Request</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Type your message, dataset link, or details here..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
