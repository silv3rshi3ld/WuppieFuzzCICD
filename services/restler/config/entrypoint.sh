#!/bin/bash
set -e

# Wait for VAmPI to be ready first
echo "Waiting for VAmPI to become available..."
until curl -s -f "$TARGET_URL"/ >/dev/null; do
  echo "VAmPI is not ready yet... retrying in 5s"
  sleep 5
done
echo "VAmPI is ready!"

# Convert OpenAPI spec to RESTler format (Compile Mode)
echo "Converting OpenAPI spec to RESTler format..."
cd /restler/restler/
python restler.py compile --api_spec "$OPENAPI_SPEC"

# Move compiled files to workspace
cp -r Compile/* /workspace/
cd /workspace

# Mode-based execution
case "$MODE" in
  "test")
    echo "Running TEST mode (smoketest)"
    dotnet /restler/restler/engine/Restler.dll test \
      --grammar_file ./grammar.py \
      --settings ./settings.json \
      --target_url "$TARGET_URL" \
      --time_budget 1 \
      --no_ssl \
      --no_tokens_in_logs \
      --results_dir /workspace/fuzzing_results/test
    ;;
  
  "fuzz-lean")
    echo "Running FUZZ-LEAN mode"
    dotnet /restler/restler/engine/Restler.dll fuzz-lean \
      --grammar_file ./grammar.py \
      --settings ./settings.json \
      --target_url "$TARGET_URL" \
      --time_budget 1 \
      --no_ssl \
      --no_tokens_in_logs \
      --results_dir /workspace/fuzzing_results/fuzz-lean
    ;;
    
  "fuzz")
    echo "Running FULL FUZZ mode"
    dotnet /restler/restler/engine/Restler.dll fuzz \
      --grammar_file ./grammar.py \
      --settings ./settings.json \
      --target_url "$TARGET_URL" \
      --time_budget 1 \
      --no_ssl \
      --no_tokens_in_logs \
      --results_dir /workspace/fuzzing_results/fuzz
    ;;
    
  "all")
    echo "Running ALL modes: test, fuzz-lean, and full fuzz sequentially"
    dotnet /restler/restler/engine/Restler.dll test \
      --grammar_file ./grammar.py \
      --settings ./settings.json \
      --target_url "$TARGET_URL" \
      --time_budget 1 \
      --no_ssl \
      --no_tokens_in_logs \
      --results_dir /workspace/fuzzing_results/test

    dotnet /restler/restler/engine/Restler.dll fuzz-lean \
      --grammar_file ./grammar.py \
      --settings ./settings.json \
      --target_url "$TARGET_URL" \
      --time_budget 1 \
      --no_ssl \
      --no_tokens_in_logs \
      --results_dir /workspace/fuzzing_results/fuzz-lean

    dotnet /restler/restler/engine/Restler.dll fuzz \
      --grammar_file ./grammar.py \
      --settings ./settings.json \
      --target_url "$TARGET_URL" \
      --time_budget 1 \
      --no_ssl \
      --no_tokens_in_logs \
      --results_dir /workspace/fuzzing_results/fuzz
    ;;
    
  *)
    echo "Unknown mode: $MODE"
    exit 1
    ;;
esac
