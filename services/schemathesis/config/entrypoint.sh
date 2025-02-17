#!/bin/bash
set -e

# Wait for VAmPI to be ready
until curl -s http://${TARGET_IP}:${TARGET_PORT}/health > /dev/null; do
    echo "Waiting for VAmPI API to be ready..."
    sleep 2
done

echo "Starting Schemathesis test execution..."

# Run Schemathesis with configured parameters
schemathesis run /app/openapi3.yml \
    --stateful=links \
    --hypothesis-deadline=1000 \
    --hypothesis-max-examples=1000 \
    --checks all \
    --workers auto \
    --base-url http://${TARGET_IP}:${TARGET_PORT} \
    --report \
    --report-type html \
    --verbosity debug \
    --show-errors \
    --validate-schema \
    --store-network-log \
    --max-response-time=1000 \
    --wait-for-schema=60

echo "Schemathesis test execution completed."