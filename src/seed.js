import { open } from './db.js';
import { createSample, createPlate } from './models.js';

const db = open(process.env.DB_PATH || './samplerack.db');

const DEMO = [
  { barcode: 'KBL-2026-0001', subject: 'river sediment, Jägala', collected_at: '2026-07-14' },
  { barcode: 'KBL-2026-0002', subject: 'surface swab, Pirita', collected_at: '2026-07-14' },
  { barcode: 'KBL-2026-0003', subject: 'air filter, Telliskivi', collected_at: '2026-07-21' },
  { barcode: 'KBL-2026-0004', subject: 'water sample, Harku', collected_at: '2026-07-28' },
  { barcode: 'KBL-2026-0005', subject: 'soil core, Nõmme', collected_at: '2026-08-03' },
  { barcode: 'KBL-2026-0006', subject: 'biofilm, Noblessner quay', collected_at: '2026-08-11' },
];

for (const row of DEMO) {
  try {
    const sample = createSample(db, { ...row, storage: 'rack-a' });
    createPlate(db, { sample_id: sample.id, medium: 'TSA' });
  } catch (err) {
    console.warn(`skip ${row.barcode}: ${err.message}`);
  }
}

console.log(`seeded ${db.prepare('SELECT COUNT(*) AS n FROM samples').get().n} samples`);
db.close();
