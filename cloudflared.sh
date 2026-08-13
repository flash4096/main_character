#!/usr/bin/env bash
# Expose the local dev frontend via a Cloudflare quick tunnel.
set -euo pipefail

PORT="${1:-3012}"

echo "Starting cloudflared tunnel for http://localhost:$PORT ..."
exec cloudflared tunnel --url "http://localhost:$PORT"
