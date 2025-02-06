#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Create necessary directories with appropriate permissions
mkdir -p /workspace/output /workspace/Compile /workspace/Test /workspace/FuzzLean /workspace/Fuzz
chmod 755 /workspace/output /workspace/Compile /workspace/Test /workspace/FuzzLean /workspace/Fuzz

# Change to the workspace directory
cd /workspace

# Debug: Check if OpenAPI file exists and is readable
echo "Checking OpenAPI file..."
echo "Current working directory: $(pwd)"
echo "Workspace contents:"
ls -la /workspace/
echo "OpenAPI file details:"
if [ -f "/workspace/openapi3.yml" ]; then
    ls -la /workspace/openapi3.yml
    echo "File permissions:"
    stat /workspace/openapi3.yml
    echo "File contents (first few lines):"
    head -n 5 /workspace/openapi3.yml
    # Ensure file is readable
    chmod 644 /workspace/openapi3.yml
else
    echo "Error: OpenAPI file not found at /workspace/openapi3.yml"
    echo "Current directory structure:"
    find /workspace -type f -ls
    exit 1
fi

# First generate the config file
echo "Generating RESTler config..."
dotnet /restler_bin/restler/Restler.dll generate_config \
    --specs "/workspace/openapi3.yml" \
    --output_dir "/workspace/Compile"

# Check config generation status
CONFIG_STATUS=$?
if [ $CONFIG_STATUS -ne 0 ]; then
    echo "Config generation failed with status: $CONFIG_STATUS"
    echo "Checking workspace directory after failed config generation:"
    find /workspace -type f -ls
    exit $CONFIG_STATUS
fi

# Display generated config
echo "Generated config file:"
cat /workspace/Compile/config.json

# Compile using the generated config
echo "Compiling API specification..."
echo "RESTler binary location:"
ls -la /restler_bin/restler/Restler.dll

echo "Starting compilation..."
dotnet /restler_bin/restler/Restler.dll compile \
    "/workspace/Compile/config.json" \
    --workingDirPath "/workspace/Compile"

# Check compilation exit status
COMPILE_STATUS=$?
if [ $COMPILE_STATUS -ne 0 ]; then
    echo "Compilation failed with status: $COMPILE_STATUS"
    echo "Checking workspace directory after failed compilation:"
    find /workspace -type f -ls
    exit $COMPILE_STATUS
fi

# Display generated files
echo "Generated files in Compile directory:"
ls -la /workspace/Compile/

# Verify grammar file exists in Compile directory
if [ ! -f "/workspace/Compile/RestlerGrammar/grammar.py" ]; then
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
dotnet /restler_bin/restler/Restler.dll test \
    --grammar_file "/workspace/Compile/RestlerGrammar/grammar.py" \
    --dictionary_file "/workspace/Compile/RestlerGrammar/dict.json" \
    --settings "/workspace/Compile/engine_settings.json" \
    --target_ip "${TARGET_IP}" \
    --target_port "${TARGET_PORT}" \
    --no_ssl \
    --workingDirPath "/workspace/Test"

# Run fuzz-lean if enabled
if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /restler_bin/restler/Restler.dll fuzz-lean \
        --grammar_file "/workspace/Compile/RestlerGrammar/grammar.py" \
        --dictionary_file "/workspace/Compile/RestlerGrammar/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget "${FUZZ_LEAN_TIME_BUDGET}" \
        --target_ip "${TARGET_IP}" \
        --target_port "${TARGET_PORT}" \
        --no_ssl \
        --workingDirPath "/workspace/FuzzLean"
fi

# Run full fuzzing if enabled
if [ "${RUN_FUZZ}" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /restler_bin/restler/Restler.dll fuzz \
        --grammar_file "/workspace/Compile/RestlerGrammar/grammar.py" \
        --dictionary_file "/workspace/Compile/RestlerGrammar/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget "${FUZZ_TIME_BUDGET}" \
        --target_ip "${TARGET_IP}" \
        --target_port "${TARGET_PORT}" \
        --no_ssl \
        --workingDirPath "/workspace/Fuzz"
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