#!/bin/bash

# Exit on error
set -e

# Get all worker nodes
WORKER_NODES=($(sudo docker node ls --format '{{.Hostname}}' --filter role=worker))
FUZZERS=(restler wuppiefuzz evomaster)

# Label each worker with a different fuzzer
for i in "${!WORKER_NODES[@]}"; do
  if [ $i -lt ${#FUZZERS[@]} ]; then
    WORKER="${WORKER_NODES[$i]}"
    FUZZER="${FUZZERS[$i]}"
    echo "Labeling worker node $WORKER for fuzzer $FUZZER"
    sudo docker node update --label-add type=fuzzer --label-add fuzzer=$FUZZER "$WORKER"
  fi
done
