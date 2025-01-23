#!/bin/bash
set -euo pipefail

# Wait for VAmPI
until curl -s ${TARGET_URL}/health >/dev/null; do
  echo "Waiting for VAmPI..."
  sleep 2
done

# Run EvoMaster
java -jar evomaster.jar \
  --blackBox true \
  --bbSwaggerUrl ${TARGET_URL}/openapi.json \
  --outputFolder /evomaster/results \
  --maxTime ${TIME_BUDGET}m \
  --seed 42
