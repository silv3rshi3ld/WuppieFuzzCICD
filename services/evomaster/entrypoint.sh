#!/bin/bash
set -e

# Set default values for environment variables
OUTPUT_DIR=${OUTPUT_DIR:-"/evomaster/results"}
SPEC_PATH=${SPEC_PATH:-"${TARGET_URL}/openapi.json"}

# Wait for target to be ready
echo "Waiting for target service at ${TARGET_URL}..."
for i in {1..30}; do
    if curl -s "${TARGET_URL}/health" > /dev/null; then
        echo "Target service is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Target service failed to become ready"
        exit 1
    fi
    echo "Waiting for target service... (attempt $i/30)"
    sleep 2
done

java -jar evomaster.jar \
    --bbSwaggerUrl="${SPEC_PATH}" \
    --outputFolder="${OUTPUT_DIR}" \
    --bbTargetUrl="${TARGET_URL}" \
    --maxTime="${TIME_BUDGET}" \
    --blackBox=true
