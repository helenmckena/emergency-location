#!/bin/sh

set -exo pipefail
export PATH="/backend/.venv/bin:$PATH"
cd app
alembic upgrade head
python main.py