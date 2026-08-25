# API

All endpoints return JSON unless stated otherwise.

## GET /health

`{ "ok": true }`

## Samples

### GET /api/samples?status=

List samples, optional status filter.

### POST /api/samples

```json
{
  "barcode": "KBL-2026-0011",
  "subject": "surface swab, Kadriorg",
  "collected_at": "2026-08-19",
  "storage": "rack-b"
}
```

`barcode`, `subject`, `collected_at` are required. Returns 201 with the row.

### GET /api/samples/:id

Single sample or 404.

### PATCH /api/samples/:id

```json
{ "status": "incubating" }
```

## Plates

### GET /api/plates?sample_id=

### POST /api/plates

```json
{ "sample_id": 1, "medium": "R2A", "incubated_at": "2026-08-20" }
```

### PATCH /api/plates/:id

```json
{ "readout": "12 CFU, mixed colony" }
```

## GET /api/export/samples?status=

`text/csv` attachment, one row per sample. Fields containing commas or quotes
are quoted and escaped.
