#!/bin/bash
cd /app
export PYTHONPATH=/app:$PYTHONPATH
pytest tests/ -v --cov=. --cov-report=term-missing
