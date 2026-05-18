#!/usr/bin/env bash
# Usage: ./scripts/ci-wait-for-url.sh <url> [max_attempts]
set -euo pipefail

URL="${1:?URL required}"
MAX="${2:-60}"

for i in $(seq 1 "$MAX"); do
  if curl -sf "$URL" > /dev/null; then
    echo "Ready: $URL"
    exit 0
  fi
  sleep 2
done

echo "Timeout waiting for $URL" >&2
exit 1
