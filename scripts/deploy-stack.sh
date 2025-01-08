#!/bin/bash
set -e

# Use existing compose file

# Ensure old stack is removed
if sudo docker stack ls | grep -q "fuzzing-stack"; then
  echo "Removing existing stack..."
  sudo docker stack rm fuzzing-stack
  while sudo docker stack ls | grep -q "fuzzing-stack"; do
    echo "Waiting for stack removal..."
    sleep 5
  done
fi

# Deploy stack
RETRY_COUNT=0
MAX_RETRIES=3

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo "Deploying stack (Attempt $((RETRY_COUNT + 1))/$MAX_RETRIES)"
  
  if sudo docker stack deploy -c services/vampi/docker-compose.vampi.yml fuzzing-stack; then
    # Wait for network to stabilize
    sleep 10
    # Wait for services to be running
    echo "Waiting for services to start..."
    for i in $(seq 1 60); do
      RUNNING_COUNT=$(sudo docker stack services fuzzing-stack --format "{{.Replicas}}" | grep -c "1/1" || echo "0")
      EXPECTED_COUNT=3  # One VAmPI instance per fuzzer
      if [ "$RUNNING_COUNT" -eq "$EXPECTED_COUNT" ]; then
        echo "All services are running"
        sudo docker stack services fuzzing-stack
        exit 0
      fi
      echo "Services running: $RUNNING_COUNT/$EXPECTED_COUNT"
      sleep 2
    done
  fi
  
  echo "Attempt $((RETRY_COUNT + 1)) failed, cleaning up..."
  sudo docker stack rm fuzzing-stack || true
  sleep 10
  RETRY_COUNT=$((RETRY_COUNT + 1))
done

echo "::error::Failed to deploy stack after $MAX_RETRIES attempts"
sudo docker stack services fuzzing-stack || true
exit 1
