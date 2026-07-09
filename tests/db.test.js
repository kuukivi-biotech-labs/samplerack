import { describe, it, expect } from 'vitest';
import { open } from '../src/db.js';

describe('db', () => {
  it('creates both tables on open', () => {
    const db = open(':memory:');
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .all()
      .map((row) => row.name);
    expect(tables).toContain('samples');
    expect(tables).toContain('plates');
    db.close();
  });

  it('is idempotent when opened twice', () => {
    const db = open(':memory:');
    db.close();
    const again = open(':memory:');
    expect(again.prepare('SELECT COUNT(*) AS n FROM samples').get().n).toBe(0);
    again.close();
  });

  it('enforces foreign keys', () => {
    const db = open(':memory:');
    expect(() =>
      db.prepare('INSERT INTO plates (sample_id, medium) VALUES (999, ?)').run('TSA')
    ).toThrow();
    db.close();
  });
});
