#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

mkdir -p /workspace/Compile

# Convert OpenAPI YAML to JSON if necessary
if [[ "${OPENAPI_SPEC}" == *.yaml || "${OPENAPI_SPEC}" == *.yml ]]; then
    sudo apt-get update
    sudo apt-get install -y yq
    yq eval -o=json /workspace/openapi.yaml > /workspace/swagger.json
    API_SPEC_PATH="/workspace/swagger.json"
else
    API_SPEC_PATH="/workspace/openapi.json"
fi

dotnet /home/restler/restler/Restler.dll compile \
    --api_spec ${API_SPEC_PATH} \
    --restler_compiler_telemetry_optout ${RESTLER_TELEMETRY_OPTOUT}

if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    dotnet /home/restler/restler/Restler.dll fuzz-lean \
        --grammar_file /workspace/Compile/grammar.py \
        --dictionary_file /workspace/Compile/dict.json \
        --settings /workspace/Compile/engine_settings.json \
        --time_budget ${FUZZ_LEAN_TIME_BUDGET} \
        --restler_telemetry_optout ${RESTLER_TELEMETRY_OPTOUT}
fi

if [ "${RUN_FUZZ}" = "true" ]; then
    dotnet /home/restler/restler/Restler.dll fuzz \
        --grammar_file /workspace/Compile/grammar.py \
        --dictionary_file /workspace/Compile/dict.json \
        --settings /workspace/Compile/engine_settings.json \
        --time_budget ${FUZZ_TIME_BUDGET} \
        --restler_telemetry_optout ${RESTLER_TELEMETRY_OPTOUT}
fi

echo "RESTler Fuzzing completed!"
