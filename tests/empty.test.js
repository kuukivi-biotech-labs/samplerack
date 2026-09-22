import { describe, it, expect } from 'vitest';
import { toCsv, SAMPLE_COLUMNS } from '../src/export.js';

describe('empty export', () => {
  it('returns just the header', () => {
    expect(toCsv([], SAMPLE_COLUMNS)).toBe(SAMPLE_COLUMNS.join(',') + '\n');
  });
});
