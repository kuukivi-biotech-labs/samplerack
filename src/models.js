export const STATUSES = ['received', 'inoculated', 'incubating', 'read', 'archived'];
export const STORAGE = ['rack-a', 'rack-b', 'rack-c', 'cold-room'];

export function createSample(db, input) {
  const { barcode, subject, collected_at, storage = 'rack-a' } = input;
  if (!barcode || !subject || !collected_at) {
    throw new Error('barcode, subject and collected_at are required');
  }
  const info = db
    .prepare('INSERT INTO samples (barcode, subject, collected_at, storage) VALUES (?, ?, ?, ?)')
    .run(barcode, subject, collected_at, storage);
  return getSample(db, info.lastInsertRowid);
}

export function getSample(db, id) {
  return db.prepare('SELECT * FROM samples WHERE id = ?').get(id) ?? null;
}

export function getSampleByBarcode(db, barcode) {
  return db.prepare('SELECT * FROM samples WHERE barcode = ?').get(barcode) ?? null;
}

export function listSamples(db, { status } = {}) {
  if (status) {
    return db.prepare('SELECT * FROM samples WHERE status = ? ORDER BY id').all(status);
  }
  return db.prepare('SELECT * FROM samples ORDER BY id').all();
}

export function updateSampleStatus(db, id, status) {
  if (!STATUSES.includes(status)) {
    throw new Error(`unknown status: ${status}`);
  }
  const info = db.prepare('UPDATE samples SET status = ? WHERE id = ?').run(status, id);
  if (info.changes === 0) {
    throw new Error(`sample ${id} not found`);
  }
  return getSample(db, id);
}

export function createPlate(db, input) {
  const { sample_id, medium, incubated_at = null } = input;
  if (!sample_id || !medium) {
    throw new Error('sample_id and medium are required');
  }
  if (!getSample(db, sample_id)) {
    throw new Error(`sample ${sample_id} not found`);
  }
  const info = db
    .prepare('INSERT INTO plates (sample_id, medium, incubated_at) VALUES (?, ?, ?)')
    .run(sample_id, medium, incubated_at);
  return getPlate(db, info.lastInsertRowid);
}

export function getPlate(db, id) {
  return db.prepare('SELECT * FROM plates WHERE id = ?').get(id) ?? null;
}

export function listPlates(db, sampleId) {
  if (sampleId) {
    return db.prepare('SELECT * FROM plates WHERE sample_id = ? ORDER BY id').all(sampleId);
  }
  return db.prepare('SELECT * FROM plates ORDER BY id').all();
}

export function setPlateReadout(db, id, readout) {
  const info = db.prepare('UPDATE plates SET readout = ? WHERE id = ?').run(readout, id);
  if (info.changes === 0) {
    throw new Error(`plate ${id} not found`);
  }
  return getPlate(db, id);
}
