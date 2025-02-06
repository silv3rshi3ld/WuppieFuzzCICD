#!/bin/bash
set -e

echo "Starting RESTler Fuzzer..."

# Create necessary directories with appropriate permissions
mkdir -p /workspace/output
chmod 755 /workspace/output

# Change to the workspace directory
cd /workspace

# Debug: Check workspace and OpenAPI file
echo "Checking workspace structure..."
tree /workspace || true

echo "Checking OpenAPI file..."
if [ ! -f "/workspace/openapi3.yml" ]; then
    echo "Error: OpenAPI file not found at /workspace/openapi3.yml"
    ls -la /workspace/
    exit 1
fi

echo "OpenAPI file contents (first 10 lines):"
head -n 10 /workspace/openapi3.yml || true

# Compile API specification
echo "Compiling API specification..."
dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" compile \
    --api_spec "/workspace/openapi3.yml" \
    --target_ip "${TARGET_IP}" \
    --target_port "${TARGET_PORT}"

# Verify compilation results
echo "Checking compilation results..."
if [ ! -d "/workspace/Compile" ]; then
    echo "Error: Compile directory not created!"
    exit 1
fi

echo "Compile directory contents:"
ls -la /workspace/Compile || true

if [ ! -f "/workspace/Compile/grammar.py" ]; then
    echo "Error: Grammar file was not generated!"
    echo "Compilation logs:"
    cat /workspace/Compile/RestlerCompile.log || echo "No compile log found"
    echo "Engine settings:"
    cat /workspace/Compile/engine_settings.json || echo "No engine settings found"
    exit 1
fi

echo "Grammar file preview (first 20 lines):"
head -n 20 /workspace/Compile/grammar.py || true

echo "Compilation logs:"
cat /workspace/Compile/RestlerCompile.log || echo "No compile log found"

# Test step
echo "Running test phase..."
dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" test \
    --grammar_file "/workspace/Compile/grammar.py" \
    --dictionary_file "/workspace/Compile/dict.json" \
    --settings "/workspace/Compile/engine_settings.json" \
    --target_ip "${TARGET_IP}" \
    --target_port "${TARGET_PORT}" \
    --no_ssl

# Run fuzz-lean if enabled
if [ "${RUN_FUZZ_LEAN}" = "true" ]; then
    echo "Starting fuzz-lean testing..."
    dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" fuzz-lean \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget "${FUZZ_LEAN_TIME_BUDGET}" \
        --target_ip "${TARGET_IP}" \
        --target_port "${TARGET_PORT}" \
        --no_ssl
fi

# Run full fuzzing if enabled
if [ "${RUN_FUZZ}" = "true" ]; then
    echo "Starting full fuzzing..."
    dotnet /restler_bin/restler/Restler.dll --workingDirPath "/workspace" fuzz \
        --grammar_file "/workspace/Compile/grammar.py" \
        --dictionary_file "/workspace/Compile/dict.json" \
        --settings "/workspace/Compile/engine_settings.json" \
        --time_budget "${FUZZ_TIME_BUDGET}" \
        --target_ip "${TARGET_IP}" \
        --target_port "${TARGET_PORT}" \
        --no_ssl
fi

# Check VAmPI connectivity
echo "Checking VAmPI connectivity..."
for i in {1..5}; do
    if curl -s "http://${TARGET_IP}:${TARGET_PORT}/" > /dev/null; then
        echo "Successfully connected to VAmPI service"
        break
    fi
    if [ $i -eq 5 ]; then
        echo "Error: Could not connect to VAmPI service after 5 attempts"
        exit 1
    fi
    echo "Attempt $i: Waiting for VAmPI service..."
    sleep 5
done

# Function to check and collect results
check_results() {
    local phase=$1
    echo "Checking ${phase} results..."
    if [ -d "/workspace/${phase}/RestlerResults" ]; then
        echo "${phase} results found:"
        ls -la "/workspace/${phase}/RestlerResults"
        
        echo "Copying ${phase} results..."
        mkdir -p "/workspace/output/${phase}"
        cp -r "/workspace/${phase}/RestlerResults" "/workspace/output/${phase}/"
        
        echo "Network logs for ${phase}:"
        cat "/workspace/${phase}/RestlerResults/network.txt" || echo "No network logs found"
        
        echo "Bug buckets for ${phase}:"
        cat "/workspace/${phase}/RestlerResults/bug_buckets/bug_buckets.txt" || echo "No bug buckets found"
    else
        echo "Warning: No results found for ${phase}"
    fi
}

# Copy results and logs
echo "Collecting results..."
for phase in Test FuzzLean Fuzz; do
    check_results $phase
done

# Create summary report
echo "Creating summary report..."
{
    echo "RESTler Execution Summary"
    echo "========================"
    echo "Date: $(date)"
    echo ""
    echo "OpenAPI Spec: $(head -n 1 /workspace/openapi3.yml)"
    echo ""
    echo "Results Overview:"
    for phase in Test FuzzLean Fuzz; do
        echo "${phase}:"
        if [ -d "/workspace/${phase}/RestlerResults" ]; then
            echo "- Completed"
            echo "- Bug buckets: $(find "/workspace/${phase}/RestlerResults/bug_buckets" -type f | wc -l)"
        else
            echo "- No results"
        fi
    done
} > "/workspace/output/summary.txt"

echo "RESTler execution completed!"
echo "Summary report available in /workspace/output/summary.txt"