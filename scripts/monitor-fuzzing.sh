#!/bin/bash

# Exit on error
set -e

FUZZER="$1"
VAMPI_PORT="$2"
TIMEOUT="${3:-3600}"  # Default 1 hour timeout

# Wait for VAmPI to be ready
echo "Waiting for VAmPI ($FUZZER) to be ready..."
for i in $(seq 1 30); do
  if curl -s http://localhost:$VAMPI_PORT/health > /dev/null; then
    echo "VAmPI is ready"
    # Initialize the database
    if curl -s -X GET http://localhost:$VAMPI_PORT/createdb > /dev/null; then
      echo "Database initialized successfully"
      break
    else
      echo "::error::Failed to initialize database"
      exit 1
    fi
  fi
  if [ $i -eq 30 ]; then
    echo "::error::VAmPI failed to become ready"
    exit 1
  fi
  echo "Waiting for VAmPI... ($i/30)"
  sleep 2
done

# Monitor fuzzing services
echo "Monitoring fuzzing services..."
START_TIME=$(date +%s)

while true; do
  CURRENT_TIME=$(date +%s)
  ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
  
  if [ $ELAPSED_TIME -gt $TIMEOUT ]; then
    echo "Fuzzing timeout reached"
    break
  fi
  
  # Check service status
  if ! sudo docker stack services fuzzing-stack --format "{{.Name}} {{.Replicas}}"; then
    echo "::error::Failed to get service status"
    exit 1
  fi
  
  # Check for completed fuzzing
  COMPLETED_COUNT=$(sudo docker service logs fuzzing-stack_$FUZZER 2>&1 | grep -c "Fuzzing completed" || true)
  
  if [ $COMPLETED_COUNT -gt 0 ]; then
    echo "Fuzzing completed successfully"
    break
  fi
  
  echo "Fuzzing in progress... (${ELAPSED_TIME}s elapsed)"
  sleep 30
done
