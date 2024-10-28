#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."
mkdir -p /workspace/Compile

# Check if openapi.yaml exists and convert to JSON
if [ -f "/workspace/openapi.yaml" ]; then
    echo "Found OpenAPI YAML specification, converting to JSON..."
    python3 -c '
import yaml
import json
import sys
with open("/workspace/openapi.yaml", "r") as yaml_file:
    yaml_content = yaml.safe_load(yaml_file)
with open("/workspace/swagger.json", "w") as json_file:
    json.dump(yaml_content, json_file, indent=2)
'
    API_SPEC_PATH="/workspace/swagger.json"
elif [ -f "/workspace/swagger.json" ]; then
    echo "Found existing swagger.json..."
    API_SPEC_PATH="/workspace/swagger.json"
elif [ -f "/workspace/openapi.json" ]; then
    echo "Found existing openapi.json..."
    API_SPEC_PATH="/workspace/openapi.json"
else
    echo "Error: No OpenAPI specification file found"
    exit 1
fi

echo "Using API specification at: ${API_SPEC_PATH}"

# Compile phase
echo "Compiling API specification..."
dotnet /home/restler/restler/Restler.dll compile \
    --api_spec "${API_SPEC_PATH}" \
    --restler_compiler_telemetry_optout "${RESTLER_TELEMETRY_OPTOUT:-1}"

# Fuzz-lean phase
if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /home/restler/restler/Restler.dll fuzz-lean \
        --grammar_file /workspace/Compile/grammar.py \
        --dictionary_file /workspace/Compile/dict.json \
        --settings /workspace/Compile/engine_settings.json \
        --time_budget "${FUZZ_LEAN_TIME_BUDGET:-0.01}" \
        --restler_telemetry_optout "${RESTLER_TELEMETRY_OPTOUT:-1}"
fi

# Full fuzzing phase
if [ "${RUN_FUZZ}" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /home/restler/restler/Restler.dll fuzz \
        --grammar_file /workspace/Compile/grammar.py \
        --dictionary_file /workspace/Compile/dict.json \
        --settings /workspace/Compile/engine_settings.json \
        --time_budget "${FUZZ_TIME_BUDGET:-1}" \
        --restler_telemetry_optout "${RESTLER_TELEMETRY_OPTOUT:-1}"
fi

echo "RESTler Fuzzing completed!"