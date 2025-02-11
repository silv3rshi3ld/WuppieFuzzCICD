#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Create necessary directories with appropriate permissions
mkdir -p /workspace/results
chmod 755 /workspace/results

# Debug: Check if OpenAPI file exists
echo "Checking OpenAPI file..."
if [ ! -f "/RESTler/openapi-specs/openapi3.yml" ]; then
    echo "Error: OpenAPI file not found at /RESTler/openapi-specs/openapi3.yml"
    ls -la /RESTler/openapi-specs/
    exit 1
fi

# Compile API specification using the YAML file directly
echo "Compiling API specification..."
dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" compile \
    --api_spec "/RESTler/openapi-specs/openapi3.yml"

# Verify grammar file exists in Compile directory
if [ ! -f "/workspace/Compile/grammar.py" ]; then
    echo "Error: Grammar file was not generated!"
    echo "Checking Compile directory contents:"
    ls -la /workspace/Compile
    exit 1
fi

# Display compilation logs
echo "Compilation logs:"
cat /workspace/Compile/RestlerCompile.log || echo "No compile log found."

# Test step
echo "Running test phase..."
dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" test \
    --grammar_file "/workspace/Compile/grammar.py" \
    --dictionary_file "/workspace/Compile/dict.json" \
    --settings "/RESTler/config/test-config.json" \
    --target_ip "${TARGET_IP:-vampi}" \
    --target_port "${TARGET_PORT:-5000}" \
    --no_ssl

# Run fuzz-lean if enabled
if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" fuzz-lean \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/RESTler/config/fuzz-lean-config.json" \
        --time_budget "${FUZZ_LEAN_TIME_BUDGET:-0.05}" \
        --target_ip "${TARGET_IP:-vampi}" \
        --target_port "${TARGET_PORT:-5000}" \
        --no_ssl
fi

# Run full fuzzing if enabled
if [ "${RUN_FUZZ}" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" fuzz \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/RESTler/config/fuzz-config.json" \
        --time_budget "${FUZZ_TIME_BUDGET:-0.25}" \
        --target_ip "${TARGET_IP:-vampi}" \
        --target_port "${TARGET_PORT:-5000}" \
        --no_ssl
fi

# Copy results to output directory
echo "Copying results to output directory..."
for dir in Test FuzzLean Fuzz; do
    if [ -d "/workspace/${dir}/RestlerResults" ]; then
        mkdir -p "/workspace/results/${dir}"
        cp -r "/workspace/${dir}/RestlerResults" "/workspace/results/${dir}/"
    fi
done

echo "RESTler execution completed!"
