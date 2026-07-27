export const SAMPLE_COLUMNS = [
  'id',
  'barcode',
  'subject',
  'collected_at',
  'storage',
  'status',
  'created_at',
];

function cell(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows, columns) {
  const header = columns.join(',');
  const body = rows.map((row) => columns.map((col) => cell(row[col])).join(','));
  return [header, ...body].join('\n') + '\n';
}
