#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Set defaults for environment variables if they aren’t provided
TARGET_IP="${TARGET_IP:-localhost}"
TARGET_PORT="${TARGET_PORT:-80}"
FUZZ_LEAN_TIME_BUDGET="${FUZZ_LEAN_TIME_BUDGET:-60}"
FUZZ_TIME_BUDGET="${FUZZ_TIME_BUDGET:-300}"

echo "Using TARGET_IP: $TARGET_IP, TARGET_PORT: $TARGET_PORT"
echo "FUZZ_LEAN_TIME_BUDGET: $FUZZ_LEAN_TIME_BUDGET, FUZZ_TIME_BUDGET: $FUZZ_TIME_BUDGET"

# Define output directories
OUTPUT_DIR="/workspace/output"
TEST_DIR="$OUTPUT_DIR/Test"
FUZZLEAN_DIR="$OUTPUT_DIR/FuzzLean"
FUZZ_DIR="$OUTPUT_DIR/Fuzz"

# Create required directories for output and intermediate results
mkdir -p "$TEST_DIR" "$FUZZLEAN_DIR" "$FUZZ_DIR"

# Change to the workspace directory
cd /workspace

# Compile API specification
echo "Compiling API specification..."
dotnet /restler_bin/restler/Restler.dll compile --api_spec "/workspace/openapi3.yml"

# Verify that the grammar file was generated
if [ ! -f "/workspace/Compile/grammar.py" ]; then
    echo "Error: Grammar file was not generated!"
    echo "Contents of /workspace/Compile:"
    ls -la /workspace/Compile || true
    exit 1
fi

# Display compilation logs (if available)
echo "Compilation logs:"
cat /workspace/Compile/RestlerCompile.log || echo "No compile log found."

# Run test phase
echo "Running test phase..."
dotnet /restler_bin/restler/Restler.dll test \
    --grammar_file "/workspace/Compile/grammar.py" \
    --dictionary_file "/workspace/Compile/dict.json" \
    --settings "/workspace/Compile/engine_settings.json" \
    --target_ip "$TARGET_IP" \
    --target_port "$TARGET_PORT" \
    --no_ssl

# Move test results to the designated output directory
if [ -d "/workspace/Test/RestlerResults" ]; then
    mv /workspace/Test/RestlerResults/* "$TEST_DIR/"
else
    echo "No test results found."
fi

# Optionally run fuzz-lean testing if enabled
if [ "$RUN_FUZZ_LEAN" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /restler_bin/restler/Restler.dll fuzz-lean \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget "$FUZZ_LEAN_TIME_BUDGET" \
        --target_ip "$TARGET_IP" \
        --target_port "$TARGET_PORT" \
        --no_ssl

    # Move fuzz-lean results to the designated output directory
    if [ -d "/workspace/FuzzLean/RestlerResults" ]; then
        mv /workspace/FuzzLean/RestlerResults/* "$FUZZLEAN_DIR/"
    else
        echo "No fuzz-lean results found."
    fi
fi

# Optionally run full fuzzing if enabled
if [ "$RUN_FUZZ" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /restler_bin/restler/Restler.dll fuzz \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget "$FUZZ_TIME_BUDGET" \
        --target_ip "$TARGET_IP" \
        --target_port "$TARGET_PORT" \
        --no_ssl

    # Move fuzz results to the designated output directory
    if [ -d "/workspace/Fuzz/RestlerResults" ]; then
        mv /workspace/Fuzz/RestlerResults/* "$FUZZ_DIR/"
    else
        echo "No fuzz results found."
    fi
fi

echo "RESTler execution completed!"
