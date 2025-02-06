#!/bin/bash
set -e

# Convert OpenAPI spec to Restler format
echo "Converting OpenAPI spec to RESTler format..."
cd /restler/restler/
python ./restler.py compile \
  --api_spec "$OPENAPI_SPEC" \
  --set_version 1.0 \
  --settings /workspace/settings.json

# Move compiled files to workspace
mkdir -p /workspace/Compile
cp -r Compile/* /workspace/
cd /workspace

# Define common RESTler parameters
RESTLER_ARGS="--grammar_file ./grammar.py \
  --settings ./settings.json \
  --target_url $TARGET_URL \
  --time_budget 1 \
  --no_ssl \
  --no_tokens_in_logs"

run_restler() {
  local mode=$1
  echo "Running $mode mode..."
  dotnet /restler/restler/engine/Restler.dll $mode $RESTLER_ARGS \
    --results_dir "/workspace/fuzzing_results/${mode,,}"
}

# Mode-based execution
case $MODE in
  "test")
    run_restler "test"
    ;;
  "fuzz-lean")
    run_restler "fuzz-lean"
    ;;
  "fuzz")
    run_restler "fuzz"
    ;;
  "all")
    echo "Running COMPLETE MODE SEQUENCE"
    run_restler "test"
    run_restler "fuzz-lean"
    run_restler "fuzz"
    ;;
  *)
    echo "Error: Invalid MODE specified. Valid values are: test, fuzz-lean, fuzz, all"
    exit 1
    ;;
esac

echo "RESTler execution completed successfully!"