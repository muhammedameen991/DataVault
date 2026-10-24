import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterAndSortDatasets,
  parseCsvToTable,
  calculateStats,
  formatBytes,
  validatePublishForm,
  encodeShareableFragment,
  decodeShareableFragment,
} from './dataVaultLogic';
import { Dataset } from '../types';

const mockDatasets: Dataset[] = [
  {
    id: 'kerala-districts',
    title: 'Kerala Districts',
    description: 'District info of Kerala',
    category: 'Other',
    format: 'JSON',
    size: '12 KB',
    sizeBytes: 12288,
    downloads: 320,
    published: 'Apr 25, 2025',
    publishedIso: '2025-04-25T10:00:00Z',
    source: 'Gov of Kerala',
    license: 'CC BY 4.0',
    isLocal: true,
    fileUrl: '/datasets/kerala-districts.json',
    tags: ['kerala', 'government', 'state'],
  },
  {
    id: 'world-population-2024',
    title: 'World Population 2024',
    description: 'Global population metrics',
    category: 'Social',
    format: 'CSV',
    size: '2.4 MB',
    sizeBytes: 2457600,
    downloads: 2540,
    published: 'Jan 12, 2025',
    publishedIso: '2025-01-12T08:30:00Z',
    source: 'UN',
    license: 'ODbL',
    isLocal: true,
    fileUrl: '/datasets/world-population-2024.csv',
    tags: ['population', 'world', 'demographics'],
  },
  {
    id: 'climate-indicators',
    title: 'Climate Change Indicators',
    description: 'Surface temp and co2 trends',
    category: 'Environment',
    format: 'JSON',
    size: '3.2 MB',
    sizeBytes: 3276800,
    downloads: 980,
    published: 'Mar 18, 2025',
    publishedIso: '2025-03-18T14:15:00Z',
    source: 'NASA',
    license: 'Public Domain',
    isLocal: true,
    fileUrl: '/datasets/climate-indicators.json',
    tags: ['climate', 'environment', 'data'],
  },
];

test('filterAndSortDatasets filters by search term', () => {
  const result = filterAndSortDatasets(mockDatasets, { search: 'kerala' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'kerala-districts');
});

test('filterAndSortDatasets filters by tag', () => {
  const result = filterAndSortDatasets(mockDatasets, { search: 'demographics' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'world-population-2024');
});

test('filterAndSortDatasets filters by format', () => {
  const result = filterAndSortDatasets(mockDatasets, { format: 'CSV' });
  assert.equal(result.length, 1);
  assert.equal(result[0].format, 'CSV');
});

test('filterAndSortDatasets sorts by downloads descending', () => {
  const result = filterAndSortDatasets(mockDatasets, { sort: 'downloads' });
  assert.equal(result[0].id, 'world-population-2024');
  assert.equal(result[1].id, 'climate-indicators');
  assert.equal(result[2].id, 'kerala-districts');
});

test('parseCsvToTable handles commas inside quotes correctly', () => {
  const csv = 'Name,Location,Notes\n"Alpha, Inc.",USA,"High, Priority"\nBeta,Canada,Standard';
  const parsed = parseCsvToTable(csv);
  assert.deepEqual(parsed.headers, ['Name', 'Location', 'Notes']);
  assert.equal(parsed.rows.length, 2);
  assert.equal(parsed.rows[0][0], 'Alpha, Inc.');
  assert.equal(parsed.rows[0][2], 'High, Priority');
  assert.equal(parsed.rows[1][0], 'Beta');
});

test('calculateStats computes accurate totals', () => {
  const stats = calculateStats(mockDatasets);
  assert.equal(stats.totalDatasets, 3);
  assert.equal(stats.totalCategories, 3);
  assert.equal(stats.totalFileTypes, 2);
  assert.equal(stats.totalDownloads, 320 + 2540 + 980);
});

test('formatBytes formats numbers properly', () => {
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1048576 * 2.5), '2.5 MB');
});

test('validatePublishForm catches missing required fields', () => {
  const res = validatePublishForm({
    title: 'ab',
    description: 'too short',
    category: '',
    format: '',
  });
  assert.equal(res.valid, false);
  assert.ok(res.errors.title);
  assert.ok(res.errors.description);
  assert.ok(res.errors.category);
});

test('encodeShareableFragment and decodeShareableFragment roundtrip', () => {
  const payload = {
    title: 'Test Snippet',
    format: 'JSON',
    content: '{"key": "value"}',
  };
  const encoded = encodeShareableFragment(payload);
  assert.ok(encoded);
  const decoded = decodeShareableFragment(encoded);
  assert.deepEqual(decoded, payload);
});
