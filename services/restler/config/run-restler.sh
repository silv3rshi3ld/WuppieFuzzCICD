#!/bin/bash
set -e

cd /workspace

echo "Starting RESTler fuzzing sequence..."

echo "Step 1: Compile"
/service/config/entrypoint.sh compile --api_spec=/workspace/openapi3.yml --dictionary=/service/config/restler-custom-dictionary.json
if [ ! -d "Compile" ]; then
    echo "Error: Compile directory not created"
    exit 1
fi

echo "Step 2: Test"
/service/config/entrypoint.sh test --api_spec=/workspace/openapi3.yml --dictionary=/service/config/restler-custom-dictionary.json
if [ ! -d "Test" ]; then
    echo "Error: Test directory not created"
    exit 1
fi

echo "Step 3: Fuzz-lean"
/service/config/entrypoint.sh fuzz-lean --api_spec=/workspace/openapi3.yml --dictionary=/service/config/restler-custom-dictionary.json --time_budget=60
if [ ! -d "FuzzLean" ]; then
    echo "Error: FuzzLean directory not created"
    exit 1
fi

echo "Step 4: Fuzz"
/service/config/entrypoint.sh fuzz --api_spec=/workspace/openapi3.yml --dictionary=/service/config/restler-custom-dictionary.json --time_budget=3600
if [ ! -d "Fuzz" ]; then
    echo "Error: Fuzz directory not created"
    exit 1
fi

echo "RESTler fuzzing sequence completed"
