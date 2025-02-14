#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Create required directories for output and intermediate results
mkdir -p /workspace/output /workspace/Test /workspace/Fuzz /workspace/FuzzLean

# Change to the workspace directory
cd /workspace

# DEBUG: List workspace contents before compile
echo "----- LS of /workspace BEFORE compilation -----"
ls -la /workspace

# Compile API specification
echo "Compiling API specification..."
dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" compile --api_spec "/workspace/openapi3.yml"

# Verify that the grammar file was generated
if [ ! -f "/workspace/Compile/grammar.py" ]; then
    echo "Error: Grammar file was not generated!"
    echo "Contents of /workspace/Compile:"
    ls -la /workspace/Compile || true
    exit 1
fi

# Display compilation logs (if available)
echo "Compilation logs:"
cat /workspace/Compile/RestlerCompile.log || echo "No compile log found."

# Set output directory for Restler results
RESTLER_OUTPUT_DIR="/workspace/output"
mkdir -p "$RESTLER_OUTPUT_DIR"

# Run test phase with specified output directory
echo "Running test phase..."
dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" test \
    --grammar_file "/workspace/Compile/grammar.py" \
    --dictionary_file "/workspace/Compile/dict.json" \
    --settings "/workspace/Compile/engine_settings.json" \
    --target_ip "${TARGET_IP}" \
    --target_port "${TARGET_PORT}" \
    --no_ssl \
    --output-directory "$RESTLER_OUTPUT_DIR"

# Optionally run fuzz-lean testing if enabled
if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" fuzz-lean \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget "${FUZZ_LEAN_TIME_BUDGET}" \
        --target_ip "${TARGET_IP}" \
        --target_port "${TARGET_PORT}" \
        --no_ssl \
        --output-directory "$RESTLER_OUTPUT_DIR"
fi

# Optionally run full fuzzing if enabled
if [ "${RUN_FUZZING}" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" fuzz \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --target_ip "${TARGET_IP}" \
        --target_port "${TARGET_PORT}" \
        --no_ssl \
        --output-directory "$RESTLER_OUTPUT_DIR"
fi

# Check if output directories are populated
echo "Checking output directories after execution:"
ls -la /workspace/output/Test || true
ls -la /workspace/output/FuzzLean || true
ls -la /workspace/output/Fuzz || true

