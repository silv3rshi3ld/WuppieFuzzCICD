#!/bin/sh
set -e

# Use unified API spec from Docker config
if [ -f "/api.yml" ]; then
  cp /api.yml /workspace/api.yml
fi

# Generate RESTler configuration
python /restler_bin/restler.py compile --api_spec /workspace/api.yml

# Run with time budget from environment
python /restler_bin/restler.py fuzz \
  --grammar_file /Compile/grammar.py \
  --dictionary_file /Compile/dict.json \
  --settings /Compile/engine_settings.json \
  --time_budget $FUZZ_TIME_BUDGET \
  --results_dir /results