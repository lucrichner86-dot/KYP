#!/usr/bin/env bash
# Applies supabase/migrations to a throwaway local Postgres and runs the flow
# checks in supabase/tests. Never touches the Supabase project.
#
# Needs a local Postgres install (initdb, pg_ctl, psql). The cluster lives in
# a temp directory, listens on a unix socket only, and is deleted afterwards.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
supabase_dir="$(dirname "$here")"

bindir=""
if command -v pg_config >/dev/null 2>&1; then bindir="$(pg_config --bindir)"; fi
if [ ! -x "$bindir/initdb" ]; then
  bindir="$(ls -d /usr/lib/postgresql/*/bin /opt/homebrew/opt/postgresql*/bin /usr/local/opt/postgresql*/bin 2>/dev/null | sort -V | tail -n 1 || true)"
fi
if [ ! -x "$bindir/initdb" ]; then
  echo "Could not find initdb. Install Postgres (for example: brew install postgresql@17)." >&2
  exit 1
fi

work="$(mktemp -d)"
chmod 755 "$work"
touch "$work/out" && chmod 666 "$work/out"

# Postgres refuses to run as root; in that case run it as the postgres user.
as_pg() { "$@"; }
if [ "$(id -u)" = "0" ]; then
  chown postgres "$work"
  as_pg() { runuser -u postgres -- "$@"; }
fi

cleanup() {
  as_pg "$bindir/pg_ctl" -D "$work/data" -m immediate stop >/dev/null 2>&1 || true
  rm -rf "$work"
}
trap cleanup EXIT

as_pg "$bindir/initdb" -D "$work/data" -U postgres -A trust --locale=C -E UTF8 >/dev/null
as_pg "$bindir/pg_ctl" -D "$work/data" -w -l "$work/log" \
  -o "-c listen_addresses='' -c unix_socket_directories='$work'" start >/dev/null

run() {
  as_pg "$bindir/psql" -X -q -v ON_ERROR_STOP=1 -h "$work" -U postgres -d postgres "$@"
}

echo "== Supabase stub"
run -f "$here/setup/supabase_stub.sql"

echo "== Migrations"
for f in "$supabase_dir"/migrations/*.sql; do
  echo "   $(basename "$f")"
  run -f "$f"
done

echo "== Flow checks"
for f in "$here"/[0-9]*.sql; do
  echo "-- $(basename "$f")"
  if ! run -o /dev/null -f "$f" >"$work/out" 2>&1; then
    sed -e 's/^psql:[^ ]* NOTICE:  //' "$work/out"
    echo "FAILED in $(basename "$f")" >&2
    exit 1
  fi
  sed -e 's/^psql:[^ ]* NOTICE:  //' "$work/out"
done

echo "All database checks passed."
