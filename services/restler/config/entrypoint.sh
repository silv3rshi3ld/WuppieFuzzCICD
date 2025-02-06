#!/bin/bash
set -euo pipefail

echo "Starting RESTler Fuzzer..."

# Create and setup output directory
mkdir -p /workspace/output
chmod 755 /workspace/output

# Change to workspace directory
cd /workspace

# Debug: Check if OpenAPI file exists
echo "Checking OpenAPI file..."
if [ ! -f "/workspace/openapi3.yml" ]; then
    echo "Error: OpenAPI file not found at /workspace/openapi3.yml"
    ls -la /workspace/
    exit 1
fi

# Step 1: Compile API specification
echo "Compiling API specification..."
cp /service/config/engine_settings.json /workspace/engine_settings.json

dotnet /restler_bin/restler/Restler.dll compile \
    --api_spec "/workspace/openapi3.yml" \
    --settings "/workspace/engine_settings.json"

# Debug: List compiled files
echo "Listing /workspace/Compile:"
ls -la /workspace/Compile/

# Step 2: Run test phase
echo "Running test phase..."
dotnet /restler_bin/restler/Restler.dll test \
    --grammar_file "/workspace/Compile/grammar.py" \
    --dictionary_file "/workspace/Compile/dict.json" \
    --settings "/workspace/Compile/engine_settings.json" \
    --target_ip "${TARGET_IP}" \
    --target_port "${TARGET_PORT}" \
    --no_ssl

# Step 3: Run fuzz-lean if enabled
if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /restler_bin/restler/Restler.dll fuzz-lean \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget "${FUZZ_LEAN_TIME_BUDGET}" \
        --target_ip "${TARGET_IP}" \
        --target_port "${TARGET_PORT}" \
        --no_ssl
fi

# Step 4: Run full fuzzing if enabled
if [ "${RUN_FUZZ}" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /restler_bin/restler/Restler.dll fuzz \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget "${FUZZ_TIME_BUDGET}" \
        --target_ip "${TARGET_IP}" \
        --target_port "${TARGET_PORT}" \
        --no_ssl
fi

# Debug: Print debug logs after execution
echo "Copying results to output directory..."
for dir in Test FuzzLean Fuzz; do
    if [ -d "/workspace/${dir}/RestlerResults" ]; then
        mkdir -p "/workspace/output/${dir}"
        cp -r "/workspace/${dir}/RestlerResults" "/workspace/output/${dir}/RestlerResults"
    fi
done

echo "RESTler execution completed!"