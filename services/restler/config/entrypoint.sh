#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Create necessary directories with appropriate permissions
mkdir -p /RESTler/results
chmod 755 /RESTler/results

# Debug: Check if OpenAPI file exists
echo "Checking OpenAPI file..."
if [ ! -f "/RESTler/openapi-specs/openapi3.yml" ]; then
    echo "Error: OpenAPI file not found at /RESTler/openapi-specs/openapi3.yml"
    ls -la /RESTler/openapi-specs/
    exit 1
fi

# Convert YAML to JSON in the writable results directory
echo "Converting YAML to JSON..."
python3 -c '
import yaml
import json
import sys

try:
    with open("/RESTler/openapi-specs/openapi3.yml", "r") as yaml_file:
        yaml_content = yaml.safe_load(yaml_file)
    with open("/RESTler/results/openapi3.json", "w") as json_file:
        json.dump(yaml_content, json_file, indent=2)
    print("Successfully converted YAML to JSON")
except Exception as e:
    print(f"Error converting YAML to JSON: {str(e)}", file=sys.stderr)
    sys.exit(1)
'

# Compile API specification using the JSON file from the results directory
echo "Compiling API specification..."
dotnet /RESTler/restler/Restler.dll --workingDirPath "/RESTler" compile --api_spec "/RESTler/results/openapi3.json"

# Verify grammar file exists in Compile directory
if [ ! -f "/RESTler/Compile/grammar.py" ]; then
    echo "Error: Grammar file was not generated!"
    echo "Checking Compile directory contents:"
    ls -la /RESTler/Compile
    exit 1
fi

# Display compilation logs
echo "Compilation logs:"
cat /RESTler/Compile/RestlerCompile.log || echo "No compile log found."

# Test step
echo "Running test phase..."
dotnet /RESTler/restler/Restler.dll --workingDirPath "/RESTler" test \
    --grammar_file "/RESTler/Compile/grammar.py" \
    --dictionary_file "/RESTler/Compile/dict.json" \
    --settings "/RESTler/config/test-config.json" \
    --target_ip "${TARGET_IP:-vampi}" \
    --target_port "${TARGET_PORT:-5000}" \
    --no_ssl

# Run fuzz-lean if enabled
if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /RESTler/restler/Restler.dll --workingDirPath "/RESTler" fuzz-lean \
        --grammar_file "/RESTler/Compile/grammar.py" \
        --dictionary_file "/RESTler/Compile/dict.json" \
        --settings "/RESTler/config/fuzz-lean-config.json" \
        --time_budget "${FUZZ_LEAN_TIME_BUDGET:-0.05}" \
        --target_ip "${TARGET_IP:-vampi}" \
        --target_port "${TARGET_PORT:-5000}" \
        --no_ssl
fi

# Run full fuzzing if enabled
if [ "${RUN_FUZZ}" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /RESTler/restler/Restler.dll --workingDirPath "/RESTler" fuzz \
        --grammar_file "/RESTler/Compile/grammar.py" \
        --dictionary_file "/RESTler/Compile/dict.json" \
        --settings "/RESTler/config/fuzz-config.json" \
        --time_budget "${FUZZ_TIME_BUDGET:-0.25}" \
        --target_ip "${TARGET_IP:-vampi}" \
        --target_port "${TARGET_PORT:-5000}" \
        --no_ssl
fi

# Copy results to output directory
echo "Copying results to output directory..."
for dir in Test FuzzLean Fuzz; do
    if [ -d "/RESTler/${dir}/RestlerResults" ]; then
        mkdir -p "/RESTler/results/${dir}"
        cp -r "/RESTler/${dir}/RestlerResults" "/RESTler/results/${dir}/"
    fi
done

echo "RESTler execution completed!"
