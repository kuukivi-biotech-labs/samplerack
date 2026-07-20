# Schema

Two tables, both local to the SQLite file. No migrations yet — the schema is
created idempotently on every open (`CREATE TABLE IF NOT EXISTS`).

## samples

| column | type | notes |
|---|---|---|
| id | INTEGER PK | autoincrement |
| barcode | TEXT | unique, lab-printed |
| subject | TEXT | free text, what was sampled |
| collected_at | TEXT | ISO date |
| storage | TEXT | rack-a / rack-b / rack-c / cold-room |
| status | TEXT | received → inoculated → incubating → read → archived |
| created_at | TEXT | default now() |

## plates

| column | type | notes |
|---|---|---|
| id | INTEGER PK | autoincrement |
| sample_id | INTEGER FK | ON DELETE CASCADE |
| medium | TEXT | e.g. TSA, R2A |
| incubated_at | TEXT | ISO date, nullable |
| readout | TEXT | free text, nullable |
| created_at | TEXT | default now() |

## Indexes

- `idx_plates_sample` on `plates(sample_id)`
- `idx_samples_status` on `samples(status)`
