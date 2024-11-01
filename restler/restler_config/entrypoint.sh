#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Create necessary directories with appropriate permissions
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

# List contents of /workspace to confirm
echo "Contents of /workspace:"
ls -la /workspace

# Compile API specification
echo "Compiling API specification..."
dotnet /restler_bin/restler/Restler.dll compile --api_spec "/workspace/openapi3.yml"

# Display compilation logs
echo "Compilation logs:"
cat /workspace/Compile/RestlerCompile.log || echo "No compile log found."

# Verify grammar file exists in Compile directory
if [ ! -f "/workspace/Compile/grammar.py" ]; then
    echo "Error: Grammar file was not generated!"
    echo "Checking Compile directory contents:"
    find /workspace/Compile -type f
    exit 1
fi

# Test step
echo "Running test phase..."
dotnet /restler_bin/restler/Restler.dll test \
    --grammar_file "/workspace/Compile/grammar.py" \
    --dictionary_file "/workspace/Compile/dict.json" \
    --settings "/workspace/Compile/engine_settings.json" \
    --target_ip host.docker.internal \
    --target_port 5000 \
    --no_ssl \
    --working_dir "/workspace/Compile"

# Run fuzz-lean if enabled
if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /restler_bin/restler/Restler.dll fuzz-lean \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget ${FUZZ_LEAN_TIME_BUDGET} \
        --target_ip host.docker.internal \
        --target_port 5000 \
        --no_ssl \
        --working_dir "/workspace/Compile"
fi

# Run full fuzzing if enabled
if [ "${RUN_FUZZ}" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /restler_bin/restler/Restler.dll fuzz \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget ${FUZZ_TIME_BUDGET} \
        --target_ip host.docker.internal \
        --target_port 5000 \
        --no_ssl \
        --working_dir "/workspace/Compile"
fi

# Copy results to output directory
echo "Copying results to output directory..."
for dir in Test FuzzLean Fuzz; do
    if [ -d "/workspace/Compile/${dir}/RestlerResults" ]; then
        cp -r "/workspace/Compile/${dir}/RestlerResults" "/workspace/output/${dir}/RestlerResults"
    fi
done
if [ -f "/workspace/Compile/coverage_failures_to_investigate.txt" ]; then
    cp "/workspace/Compile/coverage_failures_to_investigate.txt" "/workspace/output/"
fi
