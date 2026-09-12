#!/usr/bin/env bash
# Runs the same checks CI runs: build, HTML lint, and the full Cucumber suite
# against a served build. Used as the pre-commit hook and by `npm run validate`.
set -euo pipefail

npm run build

npx serve dist -l 3000 --no-clipboard >/tmp/validate-serve.log 2>&1 &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" 2>/dev/null || true; }
trap cleanup EXIT

for _ in $(seq 1 30); do
  if curl -sf http://localhost:3000/ >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

if ! curl -sf http://localhost:3000/ >/dev/null 2>&1; then
  echo "Local server never became ready; see /tmp/validate-serve.log" >&2
  exit 1
fi

npx html-validate "dist/**/*.html"

BASE_URL=http://localhost:3000 npx cucumber-js
