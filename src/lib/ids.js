export function barcodeFor(date, seq) {
  const year = String(date).slice(0, 4);
  return `KBL-${year}-${String(seq).padStart(4, '0')}`;
}

export function nextSequence(db) {
  const row = db.prepare("SELECT COUNT(*) AS n FROM samples WHERE barcode LIKE 'KBL-%'").get();
  return row.n + 1;
}
