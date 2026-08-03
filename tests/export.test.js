import { describe, it, expect } from 'vitest';
import { toCsv, SAMPLE_COLUMNS } from '../src/export.js';

describe('toCsv', () => {
  it('writes a header and rows', () => {
    const rows = [
      { id: 1, barcode: 'KBL-1', subject: 'sediment', collected_at: '2026-07-14', storage: 'rack-a', status: 'received', created_at: '2026-07-14 10:00:00' },
    ];
    const out = toCsv(rows, SAMPLE_COLUMNS);
    const [header, row] = out.trim().split('\n');
    expect(header).toBe(SAMPLE_COLUMNS.join(','));
    expect(row).toBe('1,KBL-1,sediment,2026-07-14,rack-a,received,2026-07-14 10:00:00');
  });

  it('quotes fields with commas', () => {
    const out = toCsv([{ id: 2, barcode: 'KBL-2', subject: 'water, Harku', collected_at: '2026-07-15', storage: 'rack-a', status: 'received', created_at: 'x' }], SAMPLE_COLUMNS);
    expect(out).toContain('"water, Harku"');
  });

  it('escapes embedded quotes', () => {
    const out = toCsv([{ id: 3, barcode: 'KBL-3', subject: 'swab "A"', collected_at: '2026-07-16', storage: 'rack-a', status: 'received', created_at: 'x' }], SAMPLE_COLUMNS);
    expect(out).toContain('"swab ""A"""');
  });

  it('renders null as empty', () => {
    const out = toCsv([{ id: 4, barcode: null, subject: null, collected_at: null, storage: null, status: null, created_at: null }], SAMPLE_COLUMNS);
    expect(out.trim().split('\n')[1]).toBe('4,,,,,,');
  });

  it('ends with a newline', () => {
    expect(toCsv([], SAMPLE_COLUMNS).endsWith('\n')).toBe(true);
  });
});
