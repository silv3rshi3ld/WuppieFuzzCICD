#!/bin/bash

# Exit on error, undefined variables, and propagate pipe failures
set -euo pipefail

# Function for logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function for cleanup
cleanup() {
    log "Cleaning up..."
    # Kill any remaining java processes
    pkill -f evomaster.jar || true
    exit "${1:-0}"
}

# Set up trap for cleanup
trap 'cleanup $?' EXIT
trap 'cleanup 1' INT TERM

# Validate required environment variables
REQUIRED_VARS=("TARGET_URL" "TIME_BUDGET")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var:-}" ]; then
        log "ERROR: Required environment variable $var is not set"
        exit 1
    fi
done

# Set default values for optional environment variables
OUTPUT_DIR=${OUTPUT_DIR:-"/evomaster/results"}
SPEC_PATH=${SPEC_PATH:-"${TARGET_URL}/openapi.json"}
MAX_RETRIES=${MAX_RETRIES:-30}
RETRY_INTERVAL=${RETRY_INTERVAL:-2}
HEALTH_ENDPOINT=${HEALTH_ENDPOINT:-"/health"}

# Create output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}"

# Wait for target to be ready
log "Waiting for target service at ${TARGET_URL}..."
for i in $(seq 1 "${MAX_RETRIES}"); do
    if curl -s "${TARGET_URL}${HEALTH_ENDPOINT}" > /dev/null; then
        log "Target service is ready!"
        break
    fi
    if [ "$i" -eq "${MAX_RETRIES}" ]; then
        log "ERROR: Target service failed to become ready after ${MAX_RETRIES} attempts"
        exit 1
    fi
    log "Waiting for target service... (attempt $i/${MAX_RETRIES})"
    sleep "${RETRY_INTERVAL}"
done

# Validate OpenAPI specification is accessible
log "Validating OpenAPI specification at ${SPEC_PATH}..."
if [[ "${SPEC_PATH}" =~ ^https?:// ]]; then
    # For HTTP(S) URLs, try to fetch the spec
    if ! curl -s -f "${SPEC_PATH}" > /dev/null; then
        log "ERROR: Unable to access OpenAPI specification at ${SPEC_PATH}"
        exit 1
    fi
else
    # For local files, check if they exist and are readable
    if [ ! -f "${SPEC_PATH}" ] || [ ! -r "${SPEC_PATH}" ]; then
        log "ERROR: Unable to access OpenAPI specification at ${SPEC_PATH}"
        exit 1
    fi
fi

# Additional EvoMaster configuration options with defaults
STATISTICS_FILE="${OUTPUT_DIR}/statistics.csv"
REPORT_DIR="${OUTPUT_DIR}/reports"
SEED=${SEED:-42}
REPORT_ENABLED=${REPORT_ENABLED:-true}

# Create report directory if enabled
if [ "${REPORT_ENABLED}" = "true" ]; then
    mkdir -p "${REPORT_DIR}"
fi

log "Starting EvoMaster with the following configuration:"
log "- Target URL: ${TARGET_URL}"
log "- OpenAPI Spec: ${SPEC_PATH}"
log "- Output Directory: ${OUTPUT_DIR}"
log "- Time Budget: ${TIME_BUDGET}"
log "- Report Enabled: ${REPORT_ENABLED}"

# Run EvoMaster with extended configuration
java -jar evomaster.jar \
    --bbSwaggerUrl="${SPEC_PATH}" \
    --outputFolder="${OUTPUT_DIR}" \
    --bbTargetUrl="${TARGET_URL}" \
    --maxTime="${TIME_BUDGET}" \
    --blackBox=true \
    --seed="${SEED}" \
    --statisticsFile="${STATISTICS_FILE}" \
    --writeStatistics=true \
    --showProgress=true \
    --appendToStatisticsFile=true \
    --outputFormat=JAVA_JUNIT_4 \
    --testSuiteFileName=EvoMasterTest \
    ${REPORT_ENABLED:+"--writeReport=true"} \
    ${REPORT_ENABLED:+"--reportFolder=${REPORT_DIR}"} \
    "$@"

log "EvoMaster execution completed successfully"
