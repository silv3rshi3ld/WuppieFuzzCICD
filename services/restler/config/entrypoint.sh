#!/bin/bash
set -e

# Use the BASE_DIR environment variable if provided, otherwise default to /workspace.
BASE_DIR="${BASE_DIR:-/workspace}"

usage() {
    echo "Usage: $0 {compile|test|fuzz-lean|fuzz} --api_spec=<path_to_api_spec> [--dictionary=<path>] [--time_budget=<seconds>]"
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

# Create output directory structure
mkdir -p "$BASE_DIR/output/Test"
mkdir -p "$BASE_DIR/output/FuzzLean"
mkdir -p "$BASE_DIR/output/Fuzz"

# Change to the base directory (mounted GitHub Actions workspace).
cd "$BASE_DIR"

# Generate RESTler configuration files
# This step generates the restlerConfig directory with config.json, dict.json, etc.
echo "Generating RESTler configuration files..."
dotnet "$RESTLER_DLL" generate_config --specs "$API_SPEC" --output_dir restlerConfig

# Execute the appropriate RESTler command.
case "$COMMAND" in
    compile)
        echo "Compiling API specification..."
        # Compile the API spec using the generated config.json file
        dotnet "$RESTLER_DLL" generate_config --specs "$API_SPEC" --output_dir restlerConfig
        # Copy compile results to output directory
        cp -r Compile/* "$BASE_DIR/output/Test/"
        ;;
    test)
        echo "Running tests..."
        dotnet "$RESTLER_DLL" test --grammar_file Compile/grammar.py --dictionary_file Compile/dict.json --no_ssl
        # Copy test results including coverage file to output directory
        cp -r Test/* "$BASE_DIR/output/Test/"
        if [ -f "Test/coverage_failures_to_investigate.txt" ]; then
            echo "Coverage failures file found in Test directory"
        fi
        ;;
    fuzz-lean)
        if [ -z "$TIME_BUDGET" ]; then
            echo "Error: --time_budget is required for fuzz-lean"
            usage
        fi
        echo "Running fuzz-lean..."
        dotnet "$RESTLER_DLL" fuzz-lean --grammar_file Compile/grammar.py --dictionary_file Compile/dict.json --time_budget "$TIME_BUDGET" --no_ssl
        # Copy fuzz-lean results to output directory
        cp -r FuzzLean/* "$BASE_DIR/output/FuzzLean/"
        ;;
    fuzz)
        if [ -z "$TIME_BUDGET" ]; then
            echo "Error: --time_budget is required for fuzz"
            usage
        fi
        echo "Running full fuzzing..."
        dotnet "$RESTLER_DLL" fuzz --grammar_file Compile/grammar.py --dictionary_file Compile/dict.json --time_budget "$TIME_BUDGET" --no_ssl
        # Copy fuzz results to output directory
        cp -r Fuzz/* "$BASE_DIR/output/Fuzz/"
        ;;
    *)
        echo "Unknown command: $COMMAND"
        usage
        ;;
esac
