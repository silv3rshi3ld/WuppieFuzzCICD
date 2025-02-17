#!/bin/bash
set -e

MAX_RETRIES=30
RETRY_INTERVAL=2
RETRY_COUNT=0

echo "Waiting for VAmPI API to be ready..."
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s -f http://${TARGET_IP}:${TARGET_PORT}/health > /dev/null; then
        echo "VAmPI API is ready!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "Error: VAmPI API failed to become ready after $((MAX_RETRIES * RETRY_INTERVAL)) seconds"
        exit 1
    fi
    
    echo "Attempt $RETRY_COUNT of $MAX_RETRIES - Waiting for VAmPI API..."
    sleep $RETRY_INTERVAL
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

EXIT_CODE=$?
echo "Schemathesis test execution completed with exit code: $EXIT_CODE"
exit $EXIT_CODE