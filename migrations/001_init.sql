-- initial schema, mirrored in src/db.js
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
