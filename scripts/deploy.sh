#!/usr/bin/env bash
# Deploy the report site to Hostinger over FTP.
#
# Reads credentials from .env.deploy (gitignored). Uploads every git-tracked
# file (minus repo metadata, dotfiles, the deploy script itself, and docs/)
# to $FTP_PATH on the remote. Creates remote directories as needed.
#
# Usage:
#   ./scripts/deploy.sh           # full upload
#   ./scripts/deploy.sh --dry-run # list what would be uploaded, don't push
#
# Requires: bash, curl (with FTP support), git.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE=".env.deploy"
[ -f "$ENV_FILE" ] || { echo "ERROR: $ENV_FILE missing. Copy .env.example and fill in FTP_PASSWORD." >&2; exit 1; }

# shellcheck disable=SC1090
set -a; . "./$ENV_FILE"; set +a

for v in FTP_HOST FTP_USER FTP_PORT FTP_PATH FTP_PASSWORD; do
  if [ -z "${!v:-}" ]; then
    echo "ERROR: $v not set in $ENV_FILE" >&2
    exit 1
  fi
done

DRY=false
[ "${1:-}" = "--dry-run" ] && DRY=true

# Build the list of files to upload from git (only tracked files, no secrets).
mapfile -t FILES < <(
  git ls-files \
    | grep -vE '^(\.env|\.gitignore|README\.md|docs/|scripts/|\.github/)' \
    | sort
)

if [ "${#FILES[@]}" -eq 0 ]; then
  echo "Nothing to upload."
  exit 0
fi

echo "Target: ftp://${FTP_HOST}:${FTP_PORT}${FTP_PATH}/"
echo "Files to upload: ${#FILES[@]}"
$DRY && { printf '  %s\n' "${FILES[@]}"; exit 0; }

# URL-encode the password for the curl URL form.
encode() { python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1],safe=''))" "$1" 2>/dev/null \
  || node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' -- "$1" 2>/dev/null \
  || printf '%s' "$1"; }
ENC_USER=$(encode "$FTP_USER")
ENC_PASS=$(encode "$FTP_PASSWORD")

OK=0; FAIL=0
for f in "${FILES[@]}"; do
  remote="ftp://${ENC_USER}:${ENC_PASS}@${FTP_HOST}:${FTP_PORT}${FTP_PATH}/${f}"
  if curl -sS --ftp-create-dirs --fail-with-body -T "$f" "$remote" >/tmp/ftp-curl-err 2>&1; then
    printf '  ✓ %s\n' "$f"
    OK=$((OK+1))
  else
    printf '  ✗ %s — %s\n' "$f" "$(tr -d '\r' </tmp/ftp-curl-err | tail -1)" >&2
    FAIL=$((FAIL+1))
  fi
done

echo "---"
echo "Uploaded: $OK   Failed: $FAIL"
[ "$FAIL" -eq 0 ]
