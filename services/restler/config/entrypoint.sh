#!/bin/bash
set -e

# If no arguments are provided, run the full workflow (compile -> test -> fuzz-lean -> fuzz)
if [ "$#" -eq 0 ]; then
  echo "No mode specified. Running full RESTler workflow..."
  # Clean up previous compile results (if any)
  rm -rf Compile
  # Mode: Compile – generate grammar and dictionary from your OpenAPI spec.
  echo "Compiling grammar..."
  python3 /RESTler/engine/restler.py compile --api_spec /RESTler/openapi-specs/openapi3.yml --settings /RESTler/config/compile-config.json
  # Mode: Test – perform a quick smoke-test using the generated grammar.
  echo "Running test mode..."
  python3 /RESTler/engine/restler.py test --grammar_file /RESTler/Compile/grammar.py --dictionary_file /RESTler/Compile/dict.json --target_ip vampi --target_port 5000
  # Mode: Fuzz-lean – perform a short fuzzing run.
  echo "Running fuzz-lean mode..."
  python3 /RESTler/engine/restler.py fuzz-lean --grammar_file /RESTler/Compile/grammar.py --dictionary_file /RESTler/Compile/dict.json --target_ip vampi --target_port 5000
  # Mode: Fuzz – perform a longer fuzzing run (here with a 1-hour time budget).
  echo "Running fuzz mode..."
  python3 /RESTler/engine/restler.py fuzz --grammar_file /RESTler/Compile/grammar.py --dictionary_file /RESTler/Compile/dict.json --target_ip vampi --target_port 5000 --time_budget 1
else
  # If arguments are provided, forward them to the RESTler binary.
  echo "Running RESTler with arguments: $@"
  exec python3 /RESTler/engine/restler.py "$@"
fi
