#!/bin/bash
set -e

# Function to find restler.py
find_restler() {
    # First check in root directory
    if [ -f "/RESTler/restler.py" ]; then
        echo "/RESTler/restler.py"
        return 0
    fi
    
    # Then check in engine directory
    if [ -f "/RESTler/engine/restler.py" ]; then
        echo "/RESTler/engine/restler.py"
        return 0
    fi
    
    echo "Error: Could not find restler.py"
    return 1
}

# Find restler.py
RESTLER_PATH=$(find_restler)
if [ $? -ne 0 ]; then
    echo "Directory contents of /RESTler:"
    ls -R /RESTler
    exit 1
fi

echo "Using RESTler at: $RESTLER_PATH"

# If no arguments are provided, run the full workflow (compile -> test -> fuzz-lean -> fuzz)
if [ "$#" -eq 0 ]; then
    echo "No mode specified. Running full RESTler workflow..."
    
    # Clean up previous compile results (if any)
    rm -rf Compile
    
    echo "Directory structure before compilation:"
    ls -R /RESTler
    
    # Mode: Compile – generate grammar and dictionary from your OpenAPI spec.
    echo "Compiling grammar..."
    python3 "$RESTLER_PATH" compile \
        --api_spec /RESTler/openapi-specs/openapi3.yml \
        --settings /RESTler/config/compile-config.json
    
    echo "Compilation complete. Directory structure:"
    ls -R /RESTler
    
    # Mode: Test – perform a quick smoke-test using the generated grammar.
    echo "Running test mode..."
    python3 "$RESTLER_PATH" test \
        --grammar_file /RESTler/Compile/grammar.py \
        --dictionary_file /RESTler/Compile/dict.json \
        --target_ip vampi \
        --target_port 5000
    
    # Mode: Fuzz-lean – perform a short fuzzing run.
    echo "Running fuzz-lean mode..."
    python3 "$RESTLER_PATH" fuzz-lean \
        --grammar_file /RESTler/Compile/grammar.py \
        --dictionary_file /RESTler/Compile/dict.json \
        --target_ip vampi \
        --target_port 5000
    
    # Mode: Fuzz – perform a longer fuzzing run (here with a 1-hour time budget).
    echo "Running fuzz mode..."
    python3 "$RESTLER_PATH" fuzz \
        --grammar_file /RESTler/Compile/grammar.py \
        --dictionary_file /RESTler/Compile/dict.json \
        --target_ip vampi \
        --target_port 5000 \
        --time_budget 1
else
    # If arguments are provided, forward them to the RESTler binary.
    echo "Running RESTler with arguments: $@"
    exec python3 "$RESTLER_PATH" "$@"
fi
