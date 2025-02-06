#!/bin/bash
set -e

# Convert OpenAPI spec to Restler format (Compile Mode)
python3.12 /restler/restler/restler.py compile --api_spec "$OPENAPI_SPEC"

# Test Mode Validation
if [ "$MODE" = "test" ] || [ "$MODE" = "all" ]; then
  echo "Running TEST mode (smoketest)"
  dotnet /restler/restler/Restler.dll test \
    --grammar_file ./grammar.py \
    --settings ./settings.json \
    --target_url $TARGET_URL \
    --results_dir /workspace/test_results
fi

# Wait for VAmPI to be ready
until curl -s -f $TARGET_URL/health >/dev/null; do
  echo "Waiting for VAmPI to become available..."
  sleep 10
done

# Mode-based execution
case $MODE in
  "fuzz-lean")
    echo "Running FUZZ-LEAN mode"
    dotnet /restler/restler/Restler.dll fuzz-lean \
      --grammar_file ./grammar.py \
      --settings ./settings.json \
      --target_url $TARGET_URL \
      --results_dir /workspace/fuzz_lean_results
    ;;
    
  "fuzz")
    echo "Running FULL FUZZ mode"
    dotnet /restler/restler/Restler.dll fuzz \
      --grammar_file ./grammar.py \
      --settings ./settings.json \
      --target_url $TARGET_URL \
      --results_dir /workspace/fuzzing_results
    ;;
    
  "all")
    echo "Running COMPLETE MODE SEQUENCE"
    # Fuzz-lean first
    dotnet /restler/restler/Restler.dll fuzz-lean \
      --grammar_file ./grammar.py \
      --settings ./settings.json \
      --target_url $TARGET_URL \
      --results_dir /workspace/fuzz_lean_results
      
    # Full fuzz after
    dotnet /restler/restler/Restler.dll fuzz \
      --grammar_file ./grammar.py \
      --settings ./settings.json \
      --target_url $TARGET_URL \
      --results_dir /workspace/fuzzing_results
    ;;
esac

# Copy results to mounted volume
cp -r /workspace/*_results/* /results 2>/dev/null || :