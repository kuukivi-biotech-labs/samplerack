import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { open } from '../src/db.js';
import * as models from '../src/models.js';

let db;

beforeEach(() => {
  db = open(':memory:');
});

afterEach(() => {
  db.close();
});

describe('samples', () => {
  it('creates and reads a sample', () => {
    const sample = models.createSample(db, {
      barcode: 'KBL-2026-0001',
      subject: 'river sediment',
      collected_at: '2026-07-14',
    });
    expect(sample.id).toBeGreaterThan(0);
    expect(sample.status).toBe('received');
    expect(sample.storage).toBe('rack-a');
    expect(models.getSample(db, sample.id).barcode).toBe('KBL-2026-0001');
  });

  it('rejects missing fields', () => {
    expect(() => models.createSample(db, { barcode: 'x' })).toThrow(/required/);
  });

  it('rejects duplicate barcodes', () => {
    const row = { barcode: 'KBL-2026-0002', subject: 'swab', collected_at: '2026-07-15' };
    models.createSample(db, row);
    expect(() => models.createSample(db, row)).toThrow();
  });

  it('filters by status', () => {
    const a = models.createSample(db, {
      barcode: 'KBL-2026-0003',
      subject: 'air filter',
      collected_at: '2026-07-16',
    });
    models.updateSampleStatus(db, a.id, 'incubating');
    expect(models.listSamples(db, { status: 'incubating' })).toHaveLength(1);
    expect(models.listSamples(db)).toHaveLength(1);
  });

  it('rejects unknown status values', () => {
    const s = models.createSample(db, {
      barcode: 'KBL-2026-0004',
      subject: 'soil',
      collected_at: '2026-07-17',
    });
    expect(() => models.updateSampleStatus(db, s.id, 'banana')).toThrow(/unknown status/);
  });

  it('returns null for a missing sample', () => {
    expect(models.getSample(db, 4242)).toBeNull();
  });
});

describe('plates', () => {
  it('attaches a plate to a sample', () => {
    const s = models.createSample(db, {
      barcode: 'KBL-2026-0005',
      subject: 'biofilm',
      collected_at: '2026-07-18',
    });
    const plate = models.createPlate(db, { sample_id: s.id, medium: 'TSA' });
    expect(plate.sample_id).toBe(s.id);
    expect(models.listPlates(db, s.id)).toHaveLength(1);
  });

  it('refuses plates for unknown samples', () => {
    expect(() => models.createPlate(db, { sample_id: 999, medium: 'TSA' })).toThrow(/not found/);
  });

  it('stores a readout', () => {
    const s = models.createSample(db, {
      barcode: 'KBL-2026-0006',
      subject: 'water',
      collected_at: '2026-07-19',
    });
    const plate = models.createPlate(db, { sample_id: s.id, medium: 'R2A' });
    const updated = models.setPlateReadout(db, plate.id, '12 CFU, mixed');
    expect(updated.readout).toBe('12 CFU, mixed');
  });
});
