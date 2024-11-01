#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Create output directory with appropriate permissions
# 755 gives read & execute to group/others, full access to owner
mkdir -p /workspace/Compile
mkdir -p /workspace/output
chmod 755 /workspace/Compile
chmod 755 /workspace/output

# Debug: Check if OpenAPI file exists
echo "Checking OpenAPI file..."
if [ ! -f "/workspace/openapi3.yml" ]; then
    echo "Error: OpenAPI file not found at /workspace/openapi3.yml"
    ls -la /workspace/
    exit 1
fi

# Create a working directory for compilation
WORKING_DIR="/workspace/Compile"
cd "${WORKING_DIR}"

# Debug: Print current working directory
echo "Current working directory: $(pwd)"

# Compile step with verbose output
echo "Compiling API specification..."
dotnet /restler_bin/restler/Restler.dll compile \
    --api_spec /workspace/openapi3.yml \
    --working_dir "${WORKING_DIR}"

# Debug: List files in Compile directory
echo "Contents of ${WORKING_DIR}:"
ls -la "${WORKING_DIR}"

# Verify grammar file exists
if [ ! -f "${WORKING_DIR}/grammar.py" ]; then
    echo "Error: Grammar file was not generated!"
    echo "Checking Compile directory contents:"
    find /workspace/Compile -type f
    exit 1
fi

# Test step
echo "Running test phase..."
dotnet /restler_bin/restler/Restler.dll test \
    --grammar_file "${WORKING_DIR}/grammar.py" \
    --dictionary_file "${WORKING_DIR}/dict.json" \
    --settings "${WORKING_DIR}/engine_settings.json" \
    --target_ip host.docker.internal \
    --target_port 5000 \
    --no_ssl \
    --working_dir "${WORKING_DIR}"

# Run fuzz-lean if enabled
if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /restler_bin/restler/Restler.dll fuzz-lean \
        --grammar_file "${WORKING_DIR}/grammar.py" \
        --dictionary_file "${WORKING_DIR}/dict.json" \
        --settings "${WORKING_DIR}/engine_settings.json" \
        --time_budget ${FUZZ_LEAN_TIME_BUDGET} \
        --target_ip host.docker.internal \
        --target_port 5000 \
        --no_ssl \
        --working_dir "${WORKING_DIR}"
fi

# Run full fuzzing if enabled
if [ "${RUN_FUZZ}" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /restler_bin/restler/Restler.dll fuzz \
        --grammar_file "${WORKING_DIR}/grammar.py" \
        --dictionary_file "${WORKING_DIR}/dict.json" \
        --settings "${WORKING_DIR}/engine_settings.json" \
        --time_budget ${FUZZ_TIME_BUDGET} \
        --target_ip host.docker.internal \
        --target_port 5000 \
        --no_ssl \
        --working_dir "${WORKING_DIR}"
fi

# Copy results to output directory
echo "Copying results to output directory..."
for dir in Test FuzzLean Fuzz; do
    if [ -d "${WORKING_DIR}/${dir}/RestlerResults" ]; then
        cp -r "${WORKING_DIR}/${dir}/RestlerResults" "/workspace/output/${dir}/RestlerResults"
    fi
done
if [ -f "${WORKING_DIR}/coverage_failures_to_investigate.txt" ]; then
    cp "${WORKING_DIR}/coverage_failures_to_investigate.txt" "/workspace/output/"
fi