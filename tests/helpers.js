import { open } from '../src/db.js';
import { createSample } from '../src/models.js';

export function freshDb() {
  return open(':memory:');
}

export function seedSample(db, overrides = {}) {
  return createSample(db, {
    barcode: 'KBL-2026-9001',
    subject: 'test subject',
    collected_at: '2026-08-01',
    ...overrides,
  });
}
