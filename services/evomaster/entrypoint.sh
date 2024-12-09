#!/bin/bash
set -e

java -jar evomaster.jar \
    -p "$SPEC_PATH" \
    -o "$OUTPUT_DIR" \
    --target_url="$TARGET_URL" \
    --time_budget="$TIME_BUDGET"
