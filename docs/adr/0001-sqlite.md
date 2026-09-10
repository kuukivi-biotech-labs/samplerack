# ADR 0001 — SQLite as the store

Status: accepted (2026-09-10)

## Context

The tool tracks a few thousand samples a year. One shelf box runs it. There is
no ops team and no budget for a database server.

## Decision

Use SQLite via better-sqlite3, one file, WAL mode.

## Consequences

- Backups are file copies made with `.backup`, not `cp`
- No concurrent writers across machines; single host only
- If we ever need multi-user access, this decision gets revisited
