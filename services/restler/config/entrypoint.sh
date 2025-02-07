#!/bin/sh
set -e

# If no arguments are provided, run the full workflow (compile -> test -> fuzz-lean -> fuzz)
if [ "$#" -eq 0 ]; then
  echo "No mode specified. Running full RESTler workflow..."
  # Clean up previous compile results (if any)
  rm -rf Compile
  # Mode: Compile – generate grammar and dictionary from your OpenAPI spec.
  echo "Compiling grammar..."
  /RESTler/restler/Restler compile compile-config.json
  # Mode: Test – perform a quick smoke-test using the generated grammar.
  echo "Running test mode..."
  /RESTler/restler/Restler test --grammar_file Compile/grammar.py --dictionary_file Compile/dict.json
  # Mode: Fuzz-lean – perform a short fuzzing run.
  echo "Running fuzz-lean mode..."
  /RESTler/restler/Restler fuzz-lean --grammar_file Compile/grammar.py --dictionary_file Compile/dict.json
  # Mode: Fuzz – perform a longer fuzzing run (here with a 1-hour time budget).
  echo "Running fuzz mode..."
  /RESTler/restler/Restler fuzz --grammar_file Compile/grammar.py --dictionary_file Compile/dict.json --time_budget 1
else
  # If arguments are provided, forward them to the RESTler binary.
  echo "Running RESTler with arguments: $@"
  exec /RESTler/restler/Restler "$@"
fi
