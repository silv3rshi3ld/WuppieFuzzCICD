#!/bin/bash

# Exit on error
set -e

NETWORK_NAME="$1"

# Check if network exists first
if ! sudo docker network ls | grep -q "$NETWORK_NAME"; then
  echo "Creating overlay network $NETWORK_NAME"
  NETWORK_ID=$(sudo docker network create --driver overlay --attachable "$NETWORK_NAME")
  echo "network-id=$NETWORK_ID" >> $GITHUB_OUTPUT
else
  echo "Network $NETWORK_NAME already exists"
  NETWORK_ID=$(sudo docker network ls --filter name="$NETWORK_NAME" --format "{{.ID}}")
  echo "network-id=$NETWORK_ID" >> $GITHUB_OUTPUT
fi

# Verify network was created/exists and is overlay type
if ! sudo docker network inspect "$NETWORK_NAME" --format "{{.Driver}}" | grep -q "overlay"; then
  echo "::error::Network $NETWORK_NAME is not an overlay network"
  exit 1
fi
