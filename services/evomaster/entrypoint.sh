#!/bin/bash
set -e

java -jar evomaster.jar \
    --bbSwaggerUrl="$SPEC_PATH" \
    --outputFolder="$OUTPUT_DIR" \
    --bbTargetUrl="$TARGET_URL" \
    --maxTime="$TIME_BUDGET" \
    --blackBox=true
