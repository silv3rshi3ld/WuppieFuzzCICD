#!/bin/bash

# Exit on error
set -e

DOCKER_NETWORK_NAME="$1"
echo "Cleaning up previous setup..."

# Remove stack if in swarm mode (with timeout)
timeout 30s bash -c '
  if sudo docker info 2>/dev/null | grep -q "Swarm: active"; then
    echo "Removing existing stack..."
    sudo docker stack rm fuzzing-stack || true
    while sudo docker stack ls 2>/dev/null | grep -q "fuzzing-stack"; do
      echo "Waiting for stack removal..."
      sleep 2
    done
  fi
' || echo "Stack removal timed out, continuing..."

# Stop and remove registry container
if sudo docker ps -a --filter "name=registry" --format '{{.Names}}' | grep -q "^registry$"; then
  echo "Removing registry container..."
  sudo docker rm -f registry || true
fi

# Remove related containers and images
echo "Cleaning up containers and images..."

# Remove fuzzing-related containers
sudo docker ps -a --filter "name=fuzzing" --format '{{.ID}}' | xargs -r sudo docker rm -f || true

# Remove related images (only localhost:5000 images)
sudo docker images "localhost:5000/*" --format "{{.ID}}" | xargs -r sudo docker rmi -f || true

# Remove network if exists
if sudo docker network ls | grep -q "$DOCKER_NETWORK_NAME"; then
  echo "Removing Docker network..."
  sudo docker network rm "$DOCKER_NETWORK_NAME" || true
fi

# Light pruning of dangling resources only
echo "Pruning dangling resources..."
sudo docker system prune -f

echo "Cleanup completed."
