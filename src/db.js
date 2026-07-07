import path from 'node:path';
import Database from 'better-sqlite3';

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS samples (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  barcode TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  collected_at TEXT NOT NULL,
  storage TEXT NOT NULL DEFAULT 'rack-a',
  status TEXT NOT NULL DEFAULT 'received',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS plates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sample_id INTEGER NOT NULL REFERENCES samples(id) ON DELETE CASCADE,
  medium TEXT NOT NULL,
  incubated_at TEXT,
  readout TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_plates_sample ON plates(sample_id);
CREATE INDEX IF NOT EXISTS idx_samples_status ON samples(status);
`;

export function open(dbPath) {
  const file = dbPath || process.env.DB_PATH || path.join(import.meta.dirname, '..', 'samplerack.db');
  const db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  return db;
}
