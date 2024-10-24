#!/bin/sh
set -e

# Navigate to RESTler directory
cd /home/restler

# Compile the API specification
./Restler.Driver.dll compile --api_spec /workspace/openapi.yaml --out_dir /restler_workdir/Compile

# Run RESTler fuzzing in lean mode
./Restler.Driver.dll fuzz-lean \
  --grammar_file /restler_workdir/Compile/grammar.py \
  --dictionary_file /restler_workdir/Compile/dict.json \
  --settings /restler_workdir/Compile/engine_settings.json \
  --target_ip app_restler \
  --target_port 3001 \
  --no_ssl \
  --out_dir /restler_workdir/RestlerResults
