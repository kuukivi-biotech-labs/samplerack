# samplerack

Sample intake and plate tracking for the wet lab. Small Node service, SQLite
storage, no external infrastructure — runs on a laptop or a shelf box.

## Requirements

- Node 20+ (developed on 22)
- A writable directory for the SQLite file

## Quick start

```bash
npm install
cp .env.example .env
npm run seed      # optional demo data
npm start         # http://localhost:3000
npm test
```

## Layout

```
bin/serve.js        entrypoint
src/app.js          express app factory
src/db.js           sqlite bootstrap + schema
src/models.js       sample and plate operations
src/routes/         HTTP surface
src/export.js       CSV export
tests/              vitest suite
```

## Notes

- The database file lives next to the project by default (`samplerack.db`).
- WAL mode is on; keep the `-wal` and `-shm` files together if you move it.
- This is an internal tool, not a public API.
