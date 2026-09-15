#!/usr/bin/env bash
set -euo pipefail

DB="${1:-samplerack.db}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="samplerack-${STAMP}.db"

sqlite3 "$DB" ".backup '$OUT'"
echo "wrote $OUT"
