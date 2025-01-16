#!/bin/bash

# Exit on error
set -e

# Check if registry exists and is running
if ! sudo docker ps --filter "name=registry" --format '{{.Names}}' | grep -q "^registry$"; then
  echo "Starting new registry container..."
  sudo docker run -d \
    --name registry \
    --restart=always \
    -v registry_data:/var/lib/registry \
    -p 5000:5000 \
    registry:2
else
  echo "Registry container already running"
fi

# Wait for registry to be ready
for i in $(seq 1 30); do
  if curl -s http://localhost:5000/v2/ > /dev/null; then
    echo "Registry is ready"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "Registry failed to start"
    exit 1
  fi
  echo "Waiting for registry... ($i/30)"
  sleep 1
done
