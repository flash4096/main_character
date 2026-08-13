#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if [ ! -d venv ]; then
  echo "Creating virtualenv..."
  python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

exec uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
