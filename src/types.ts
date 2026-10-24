export type DatasetFormat = 'JSON' | 'CSV' | 'TXT' | 'Markdown' | 'HTML' | 'PDF' | 'ZIP';

export type DatasetCategory =
  | 'Education'
  | 'Environment'
  | 'Health'
  | 'Technology'
  | 'Social'
  | 'Transport'
  | 'Finance'
  | 'Other';

export interface Dataset {
  id: string;
  title: string;
  description: string;
  category: DatasetCategory;
  format: DatasetFormat;
  size: string;
  sizeBytes?: number;
  downloads: number;
  published: string;
  publishedIso?: string;
  source: string;
  license: string;
  isLocal: boolean;
  fileUrl: string;
  banner?: string;
  tags: string[];
  featured?: boolean;
  recent?: boolean;
  isDraft?: boolean;
  draftContent?: string;
}

export interface LocalDraft {
  id: string;
  title: string;
  description: string;
  category: DatasetCategory;
  format: DatasetFormat;
  size: string;
  tags: string[];
  source: string;
  license: string;
  createdAt: string;
  content: string;
  fileName: string;
}

export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc' | 'downloads' | 'size';

export interface CategoryInfo {
  name: DatasetCategory;
  iconName: string;
  color: string;
  bgDark: string;
  bgLight: string;
  count: number;
}
