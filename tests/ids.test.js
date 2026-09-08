import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { freshDb, seedSample } from './helpers.js';
import { barcodeFor, nextSequence } from '../src/lib/ids.js';

let db;

beforeEach(() => {
  db = freshDb();
});

afterEach(() => {
  db.close();
});

describe('ids', () => {
  it('pads the sequence to four digits', () => {
    expect(barcodeFor('2026-09-01', 7)).toBe('KBL-2026-0007');
    expect(barcodeFor('2026-09-01', 1234)).toBe('KBL-2026-1234');
  });

  it('counts existing samples', () => {
    expect(nextSequence(db)).toBe(1);
    seedSample(db, { barcode: 'KBL-2026-9001' });
    expect(nextSequence(db)).toBe(2);
  });
});
