#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Create necessary directories with appropriate permissions
mkdir -p /workspace/output /workspace/Compile /workspace/Test /workspace/FuzzLean /workspace/Fuzz
chmod -R 777 /workspace

# Change to the workspace directory
cd /workspace

# Debug: Print working directory and list contents
pwd
ls -la

# Debug: Check if OpenAPI file exists and print its contents
echo "Checking OpenAPI file..."
if [ ! -f "/workspace/openapi3.yml" ]; then
    echo "Error: OpenAPI file not found at /workspace/openapi3.yml"
    ls -la /workspace/
    exit 1
else
    echo "OpenAPI file found. Contents:"
    cat /workspace/openapi3.yml
fi

# Compile API specification
echo "Compiling API specification..."
dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" compile \
    --api_spec "/workspace/openapi3.yml"

# Verify grammar file exists in Compile directory
if [ ! -f "/workspace/Compile/grammar.py" ]; then
    echo "Error: Grammar file was not generated!"
    echo "Checking Compile directory contents:"
    ls -la /workspace/Compile
    exit 1
fi

# Display compilation logs with more debug info
echo "Compilation logs:"
echo "Checking Compile directory contents:"
ls -la /workspace/Compile/
if [ -f "/workspace/Compile/RestlerCompile.log" ]; then
    echo "Found compile log. Contents:"
    cat /workspace/Compile/RestlerCompile.log
else
    echo "No compile log found"
fi

# Test step
echo "Running test phase..."
dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" test \
    --grammar_file "/workspace/Compile/grammar.py" \
    --dictionary_file "/workspace/Compile/dict.json" \
    --settings "/workspace/Compile/engine_settings.json" \
    --target_ip "${TARGET_IP}" \
    --target_port "${TARGET_PORT}" \
    --no_ssl

# Run fuzz-lean if enabled
if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" fuzz-lean \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget "${FUZZ_LEAN_TIME_BUDGET}" \
        --target_ip "${TARGET_IP}" \
        --target_port "${TARGET_PORT}" \
        --no_ssl
fi

# Run full fuzzing if enabled
if [ "${RUN_FUZZ}" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" fuzz \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget "${FUZZ_TIME_BUDGET}" \
        --target_ip "${TARGET_IP}" \
        --target_port "${TARGET_PORT}" \
        --no_ssl
fi

# Copy results to output directory
echo "Copying results to output directory..."
for dir in Test FuzzLean Fuzz; do
    if [ -d "/workspace/${dir}/RestlerResults" ]; then
        mkdir -p "/workspace/output/${dir}"
        cp -r "/workspace/${dir}/RestlerResults" "/workspace/output/${dir}/RestlerResults"
    fi
done

echo "RESTler execution completed!"
