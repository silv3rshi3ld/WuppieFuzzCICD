#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Create necessary directories with appropriate permissions
mkdir -p /workspace/output
chmod -R 755 /workspace/output

# Clean up any existing Compile directory
rm -rf /workspace/Compile

# Change to the workspace directory
cd /workspace

# Wait for vampi service to be ready
echo "Waiting for vampi service to be ready..."
for i in {1..30}; do
    if curl -s "http://${TARGET_IP}:${TARGET_PORT}/health" > /dev/null; then
        echo "Vampi service is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Vampi service failed to become ready"
        exit 1
    fi
    echo "Waiting for vampi service... (attempt $i/30)"
    sleep 2
done

# Download OpenAPI spec from vampi service
echo "Downloading OpenAPI spec from ${SWAGGER_URL}..."
curl -f -o /workspace/openapi3.yml ${SWAGGER_URL} || {
    echo "Error: Failed to download OpenAPI spec from ${SWAGGER_URL}"
    exit 1
}

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

# Display compilation logs
echo "Compilation logs:"
cat /workspace/Compile/RestlerCompile.log || echo "No compile log found."

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
    if [ -d "${dir}/RestlerResults" ]; then
        mkdir -p "output/${dir}"
        cp -r "${dir}/RestlerResults" "output/${dir}/RestlerResults"
    fi
done
