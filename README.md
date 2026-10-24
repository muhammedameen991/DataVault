# DataVault — Public Data Sharing Platform

A modern, lightweight, developer-focused public data-sharing platform where visitors can discover, preview, publish, and download publicly available datasets and files.

Developed by [Ameen](https://iamameen.vercel.app/).

---

## 🚀 Key Features

- **No-Backend Architecture**: Zero servers, zero databases, zero authentication barriers. Fully static, blazing-fast, and secure.
- **Genuine Public Data Library**: Bundled with real datasets (JSON, CSV, TXT, Markdown, etc.) stored directly in the repository.
- **Interactive File Previews**: Live client-side rendering of structured JSON, formatted CSV tables with sorting, and rendered Markdown.
- **Real Downloads & Copy Links**: Native browser blob/URL downloads from valid static paths.
- **Browser-Local Publishing & Drafts**: Genuine client-side draft creator using `localStorage`. Create, validate, inspect, and export datasets locally on your device without fake cloud progress.
- **Dark / Light Theme**: Charcoal dark theme with electric cyan, blue, and purple accents, alongside clean high-contrast light mode.
- **SEO & Discoverability**: Semantic HTML, Open Graph cards, sitemap.xml, and robots.txt.
- **Ultra Responsive**: Optimized for desktop, tablet, and mobile devices.

---

## 📁 How It Works & Publishing Guide

DataVault operates on a **Git-backed static repository architecture**:

1. **Global Public Publishing (Repository Pull Request)**:
   - Add your data file (e.g. `my-dataset.json` or `.csv`) into `/public/datasets/`.
   - Add the dataset metadata entry into `/public/data/datasets.json`:
     ```json
     {
       "id": "my-dataset",
       "title": "My Dataset Name",
       "description": "Clear explanation of the dataset content.",
       "category": "Technology",
       "format": "JSON",
       "size": "45 KB",
       "downloads": 0,
       "published": "Apr 25, 2025",
       "source": "Your Source Attribution",
       "license": "CC BY 4.0",
       "isLocal": true,
       "fileUrl": "/datasets/my-dataset.json",
       "tags": ["tag1", "tag2"]
     }
     ```
   - Commit and push to GitHub. When connected to Vercel, the site builds and deploys automatically within seconds.

2. **Browser-Local Drafts**:
   - Use the in-app **Publish** tab to upload and preview local files directly inside your browser.
   - Drafts are stored in browser `localStorage` on that specific device and are marked as local drafts with zero false claims of cloud synchronization.
   - You can copy formatted JSON metadata or export the file directly to prepare your pull request.

---

## 🛠️ Local Development & Deployment

### Run Locally:
```bash
npm install
npm run dev
```
Open `http://localhost:3000` to view the application.

### Build for Production:
```bash
npm run build
```

### Deploy to Vercel:
1. Push this repository to GitHub or GitLab.
2. Import the project into your Vercel Dashboard.
3. Framework Preset: **Vite**.
4. Click **Deploy**.
