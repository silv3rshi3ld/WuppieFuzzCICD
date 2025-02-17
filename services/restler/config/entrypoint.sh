#!/bin/bash
set -e

# Use the BASE_DIR environment variable if provided, otherwise default to /workspace.
BASE_DIR="${BASE_DIR:-/workspace}"

usage() {
    echo "Usage: $0 {compile|test|fuzz-lean|fuzz} --api_spec=<path_to_api_spec> [--dictionary=<path>] [--settings=<path>] [--time_budget=<seconds>]"
    exit 1
}

# Ensure a command is provided.
if [ $# -lt 1 ]; then
    usage
fi

COMMAND=$1
shift

# Initialize parameters.
API_SPEC=""
DICTIONARY=""
SETTINGS=""
TIME_BUDGET=""

# Parse command-line options.
while [ $# -gt 0 ]; do
    case "$1" in
        --api_spec=*)
            API_SPEC="${1#*=}"
            ;;
        --dictionary=*)
            DICTIONARY="${1#*=}"
            ;;
        --settings=*)
            SETTINGS="${1#*=}"
            ;;
        --time_budget=*)
            TIME_BUDGET="${1#*=}"
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
    shift
done

# Check that an API specification is provided.
if [ -z "$API_SPEC" ]; then
    echo "Error: --api_spec is required"
    usage
fi

# Define the full path to the RESTler DLL.
RESTLER_DLL="/restler_bin/restler/Restler.dll"

# Change to the base directory (mounted GitHub Actions workspace).
cd "$BASE_DIR"

# Execute the appropriate RESTler command.
case "$COMMAND" in
    compile)
        echo "Compiling API specification..."
        dotnet "$RESTLER_DLL" compile --api_spec "$API_SPEC"
        ;;
    test)
        echo "Running tests..."
        dotnet "$RESTLER_DLL" test --grammar_file Compile/grammar.py --dictionary_file Compile/dict.json --settings /service/config/test-config.json
        ;;
    fuzz-lean)
        if [ -z "$TIME_BUDGET" ]; then
            echo "Error: --time_budget is required for fuzz-lean"
            usage
        fi
        echo "Running fuzz-lean..."
        dotnet "$RESTLER_DLL" fuzz-lean --grammar_file Compile/grammar.py --dictionary_file Compile/dict.json --settings /service/config/fuzz-lean-config.json --time_budget "$TIME_BUDGET"
        ;;
    fuzz)
        if [ -z "$TIME_BUDGET" ]; then
            echo "Error: --time_budget is required for fuzz"
            usage
        fi
        echo "Running full fuzzing..."
        dotnet "$RESTLER_DLL" fuzz --grammar_file Compile/grammar.py --dictionary_file Compile/dict.json --settings /service/config/fuzz-lean-config.json --time_budget "$TIME_BUDGET"
        ;;
    *)
        echo "Unknown command: $COMMAND"
        usage
        ;;
esac
