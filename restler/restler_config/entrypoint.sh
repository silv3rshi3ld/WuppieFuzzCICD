#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Create output directory
mkdir -p /workspace/Compile
mkdir -p /workspace/output

# Compile step
echo "Compiling API specification..."
dotnet /restler_bin/restler/Restler.dll compile \
    --api_spec /workspace/openapi3.yml

# Test step
echo "Running test phase..."
dotnet /restler_bin/restler/Restler.dll test \
    --grammar_file /workspace/Compile/grammar.py \
    --dictionary_file /workspace/Compile/dict.json \
    --settings /workspace/Compile/engine_settings.json \
    --target_ip vampi-vulnerable \
    --target_port 5000 \
    --no_ssl

# Run fuzz-lean if enabled
if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /restler_bin/restler/Restler.dll fuzz-lean \
        --grammar_file /workspace/Compile/grammar.py \
        --dictionary_file /workspace/Compile/dict.json \
        --settings /workspace/Compile/engine_settings.json \
        --time_budget ${FUZZ_LEAN_TIME_BUDGET} \
        --target_ip host.docker.internal \
        --target_port 5000 \
        --no_ssl
fi

# Run full fuzzing if enabled
if [ "${RUN_FUZZ}" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /restler_bin/restler/Restler.dll fuzz \
        --grammar_file /workspace/Compile/grammar.py \
        --dictionary_file /workspace/Compile/dict.json \
        --settings /workspace/Compile/engine_settings.json \
        --time_budget ${FUZZ_TIME_BUDGET} \
        --target_ip host.docker.internal \
        --target_port 5000 \
        --no_ssl
fi

# Copy results to output directory
for dir in Test FuzzLean Fuzz; do
    if [ -d "/workspace/$dir/RestlerResults" ]; then
        cp -r "/workspace/$dir/RestlerResults" "/workspace/output/$dir/RestlerResults"
    fi
done
if [ -f "/workspace/coverage_failures_to_investigate.txt" ]; then
    cp "/workspace/coverage_failures_to_investigate.txt" "/workspace/output/"
fi