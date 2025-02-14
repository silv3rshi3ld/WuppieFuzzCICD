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

# Create required directories for output and intermediate results
mkdir -p /workspace/output /workspace/Test /workspace/Fuzz /workspace/FuzzLean

# Change to the workspace directory
cd /workspace

# DEBUG: List workspace contents before compilation
echo "----- LS of /workspace BEFORE compilation -----"
ls -la /workspace

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
fi

# Copy results to the output directory (if they exist)
echo "Copying results to output directory..."
for dir in Test FuzzLean Fuzz; do
    if [ -d "/workspace/${dir}/RestlerResults" ]; then
        mkdir -p "/workspace/output/${dir}"
        cp -r "/workspace/${dir}/RestlerResults" "/workspace/output/${dir}/RestlerResults"
    else
        echo "No results directory found for phase ${dir}"
    fi
done

# --- NEW WAIT STEP ---
# Wait until output files are created (up to 60 seconds)
echo "Waiting for output files to be created..."
max_wait=60  # maximum seconds to wait
elapsed=0
while [ $elapsed -lt $max_wait ]; do
    if [ -d "/workspace/output" ] && [ "$(ls -A /workspace/output)" ]; then
        echo "Output detected."
        break
    else
        echo "Output not found yet, sleeping 5 seconds..."
        sleep 5
        elapsed=$((elapsed+5))
    fi
done
if [ $elapsed -ge $max_wait ]; then
    echo "Warning: Timeout reached without detecting output."
fi

# Create a placeholder file if output directory is still empty
if [ -z "$(ls -A /workspace/output)" ]; then
    echo "No output files detected. Creating placeholder file."
    touch /workspace/output/restler.complete
fi
# --- END WAIT STEP ---

# DEBUG: List directories after execution
echo "----- LS of /workspace AFTER execution -----"
ls -la /workspace

echo "RESTler execution completed!"
