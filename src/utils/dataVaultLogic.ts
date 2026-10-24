import { Dataset, DatasetFormat, DatasetCategory, SortOption } from '../types';

/**
 * Filter and sort datasets based on user inputs
 */
export function filterAndSortDatasets(
  datasets: Dataset[],
  query: {
    search?: string;
    format?: string;
    category?: string;
    sort?: SortOption;
  }
): Dataset[] {
  let result = [...datasets];

  // 1. Text Search across title, description, category, tags
  if (query.search && query.search.trim()) {
    const s = query.search.toLowerCase().trim();
    result = result.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(s);
      const descMatch = item.description.toLowerCase().includes(s);
      const catMatch = item.category.toLowerCase().includes(s);
      const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(s));
      const formatMatch = item.format.toLowerCase() === s;
      return titleMatch || descMatch || catMatch || tagMatch || formatMatch;
    });
  }

  // 2. Format filter
  if (query.format && query.format !== 'All') {
    result = result.filter(
      (item) => item.format.toLowerCase() === query.format?.toLowerCase()
    );
  }

  // 3. Category filter
  if (query.category && query.category !== 'All') {
    result = result.filter(
      (item) => item.category.toLowerCase() === query.category?.toLowerCase()
    );
  }

  // 4. Sorting
  const sort = query.sort || 'newest';
  result.sort((a, b) => {
    switch (sort) {
      case 'newest': {
        const timeA = a.publishedIso ? new Date(a.publishedIso).getTime() : 0;
        const timeB = b.publishedIso ? new Date(b.publishedIso).getTime() : 0;
        return timeB - timeA;
      }
      case 'oldest': {
        const timeA = a.publishedIso ? new Date(a.publishedIso).getTime() : 0;
        const timeB = b.publishedIso ? new Date(b.publishedIso).getTime() : 0;
        return timeA - timeB;
      }
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'downloads':
        return b.downloads - a.downloads;
      case 'size':
        return (b.sizeBytes || 0) - (a.sizeBytes || 0);
      default:
        return 0;
    }
  });

  return result;
}

/**
 * Robust CSV parser that handles quoted strings and comma delimiters safely
 */
export function parseCsvToTable(csvText: string): { headers: string[]; rows: string[][] } {
  if (!csvText || !csvText.trim()) {
    return { headers: [], rows: [] };
  }

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    return fields;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine).filter((r) => r.length > 0 && r.some((c) => c !== ''));

  return { headers, rows };
}

/**
 * Calculate dynamic live statistics from dataset collection
 */
export function calculateStats(datasets: Dataset[]) {
  const totalDatasets = datasets.length;
  const categories = new Set(datasets.map((d) => d.category));
  const fileTypes = new Set(datasets.map((d) => d.format));
  const totalDownloads = datasets.reduce((sum, d) => sum + (d.downloads || 0), 0);

  return {
    totalDatasets,
    totalCategories: categories.size,
    totalDownloads,
    totalFileTypes: fileTypes.size,
  };
}

/**
 * Format bytes to readable string (e.g. 1.2 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Form validation for dataset creation / drafts
 */
export function validatePublishForm(fields: {
  title: string;
  description: string;
  category: string;
  format: string;
  fileName?: string;
  content?: string;
  source?: string;
  license?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!fields.title || fields.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }
  if (!fields.description || fields.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }
  if (!fields.category) {
    errors.category = 'Please select a valid category.';
  }
  if (!fields.format) {
    errors.format = 'Please select or upload a valid format.';
  }
  if (!fields.content && !fields.fileName) {
    errors.content = 'A file or data content is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * URL Fragment encoding for small snippet sharing (< 3.5KB)
 */
export function encodeShareableFragment(data: {
  title: string;
  format: string;
  content: string;
}): string | null {
  try {
    const jsonStr = JSON.stringify(data);
    if (jsonStr.length > 3500) {
      return null; // Exceeds safe URL length limit
    }
    return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
  } catch {
    return null;
  }
}

/**
 * URL Fragment decoding for small snippet sharing
 */
export function decodeShareableFragment(hash: string): {
  title: string;
  format: string;
  content: string;
} | null {
  try {
    const cleaned = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!cleaned) return null;
    const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(cleaned))));
    const parsed = JSON.parse(jsonStr);
    if (parsed && typeof parsed.title === 'string' && typeof parsed.content === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
