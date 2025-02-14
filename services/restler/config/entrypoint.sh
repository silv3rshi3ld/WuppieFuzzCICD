#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Create required directories for output and intermediate results
mkdir -p /workspace/output /workspace/Test /workspace/FuzzLean /workspace/Fuzz

# Set the working directory path
WORKING_DIR="/workspace"

# Change to the workspace directory
cd "$WORKING_DIR"

# DEBUG: List workspace contents before compile
echo "----- LS of workspace BEFORE compilation -----"
ls -la "$WORKING_DIR"

# Compile API specification
echo "Compiling API specification..."
dotnet /restler_bin/restler/Restler.dll compile \
    --api_spec "$WORKING_DIR/openapi3.yml" \
    --workingDirPath "$WORKING_DIR"

# Verify that the grammar file was generated
if [ ! -f "$WORKING_DIR/Compile/grammar.py" ]; then
    echo "Error: Grammar file was not generated!"
    echo "Contents of $WORKING_DIR/Compile:"
    ls -la "$WORKING_DIR/Compile" || true
    exit 1
fi

# Display compilation logs (if available)
echo "Compilation logs:"
cat "$WORKING_DIR/Compile/RestlerCompile.log" || echo "No compile log found."

# Run test phase
echo "Running test phase..."
dotnet /restler_bin/restler/Restler.dll test \
    --grammar_file "$WORKING_DIR/Compile/grammar.py" \
    --dictionary_file "$WORKING_DIR/Compile/dict.json" \
    --settings "$WORKING_DIR/Compile/engine_settings.json" \
    --target_ip "${TARGET_IP}" \
    --target_port "${TARGET_PORT}" \
    --no_ssl \
    --workingDirPath "$WORKING_DIR"

# Optionally run fuzz-lean testing if enabled
if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /restler_bin/restler/Restler.dll fuzz-lean \
        --grammar_file "$WORKING_DIR/Compile/grammar.py" \
        --dictionary_file "$WORKING_DIR/Compile/dict.json" \
        --settings "$WORKING_DIR/Compile/engine_settings.json" \
        --time_budget "${FUZZ_LEAN_TIME_BUDGET}" \
        --target_ip "${TARGET_IP}" \
        --target_port "${TARGET_PORT}" \
        --no_ssl \
        --workingDirPath "$WORKING_DIR"
fi

# Optionally run full fuzzing if enabled
if [ "${RUN_FUZZ}" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /restler_bin/restler/Restler.dll fuzz \
        --grammar_file "$WORKING_DIR/Compile/grammar.py" \
        --dictionary_file "$WORKING_DIR/Compile/dict.json" \
        --settings "$WORKING_DIR/Compile/engine_settings.json" \
        --time_budget "${FUZZ_TIME_BUDGET}" \
        --target_ip "${TARGET_IP}" \
        --target_port "${TARGET_PORT}" \
        --no_ssl \
        --workingDirPath "$WORKING_DIR"
fi

# Copy results to the output directory (if they exist)
echo "Copying results to output directory..."
for dir in Test FuzzLean Fuzz; do
    if [ -d "$WORKING_DIR/${dir}/RestlerResults" ]; then
        mkdir -p "$WORKING_DIR/output/${dir}"
        cp -r "$WORKING_DIR/${dir}/RestlerResults" "$WORKING_DIR/output/${dir}/RestlerResults"
    else
        echo "No results directory found for phase ${dir}"
    fi
done

# Check if output directories are populated
echo "Checking output directories after execution:"
ls -la "$WORKING_DIR/Test" || true
ls -la "$WORKING_DIR/FuzzLean" || true
ls -la "$WORKING_DIR/Fuzz" || true

# Add a check to wait until the output folder has content
echo "Waiting for output files to be created..."
max_wait=60  # maximum seconds to wait
elapsed=0
while [ $elapsed -lt $max_wait ]; do
    if [ -d "$WORKING_DIR/output" ] && [ "$(ls -A $WORKING_DIR/output)" ]; then
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

# Create a placeholder if output directory is empty
if [ -z "$(ls -A $WORKING_DIR/output)" ]; then
    echo "No output files detected. Creating placeholder file."
    touch "$WORKING_DIR/output/restler.complete"
fi

# Final debug output
echo "----- LS of workspace AFTER execution -----"
ls -la "$WORKING_DIR"
echo "----- LS of output directory -----"
ls -la "$WORKING_DIR/output"

echo "RESTler execution completed!"
