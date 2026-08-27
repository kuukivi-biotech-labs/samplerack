# Operations

## Where the database lives

`samplerack.db` in the project root unless `DB_PATH` is set. WAL mode is on,
so back it up with:

```bash
sqlite3 samplerack.db ".backup 'samplerack-backup.db'"
```

Do not copy the `.db` file while the service is running.

## Starting

```bash
npm run start
```

`PORT` defaults to 3000. There is no auth layer — keep it on the internal
network or behind the shelf box's firewall.

## Seeding

```bash
npm run seed
```

Idempotent-ish: duplicate barcodes are skipped with a warning.
