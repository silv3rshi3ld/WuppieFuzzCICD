#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Create necessary directories with appropriate permissions
mkdir -p /workspace/output /workspace/FuzzLean
chmod 755 /workspace/output /workspace/FuzzLean

# Change to the workspace directory
cd /workspace

# Debug: Check if the OpenAPI file exists
echo "Checking for OpenAPI file..."
if [ ! -f "/workspace/openapi3.yml" ]; then
    echo "Error: OpenAPI file not found at /workspace/openapi3.yml"
    ls -la /workspace/
    exit 1
fi

# Compile API specification
echo "Compiling API specification..."
dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" compile --api_spec "/workspace/openapi3.yml"

# Verify grammar file exists in the Compile directory
if [ ! -f "/workspace/Compile/grammar.py" ]; then
    echo "Error: Grammar file was not generated!"
    echo "Contents of /workspace/Compile:"
    ls -la /workspace/Compile
    exit 1
fi

# Display compilation logs (if available)
echo "Compilation logs:"
cat /workspace/Compile/RestlerCompile.log || echo "No compile log found."

# Run test phase
echo "Running test phase..."
dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" test \
    --grammar_file "/workspace/Compile/grammar.py" \
    --dictionary_file "/workspace/Compile/dict.json" \
    --settings "/workspace/Compile/engine_settings.json" \
    --target_ip "${TARGET_IP}" \
    --target_port "${TARGET_PORT}" \
    --no_ssl

# Optionally run fuzz-le
