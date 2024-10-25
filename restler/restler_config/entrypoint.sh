#!/bin/sh
set -e

# Define variables
API_SPEC="${SWAGGER_URL}"
GRAMMAR_DIR="/home/restler/output/grammar"
FUZZ_DIR="/home/restler/output/RestlerResults"

# Compile the API specification to generate grammar
echo "Compiling API specification..."
dotnet /home/restler/Restler.dll compile --api_spec=${API_SPEC}

# Start fuzzing
echo "Starting Restler fuzzing..."
dotnet /home/restler/Restler.dll fuzz --no_ssl --host ${HOST} --port ${PORT} --output_dir=${FUZZ_DIR} --time_budget=${FUZZ_TIME_BUDGET}

echo "Restler fuzzing completed."
