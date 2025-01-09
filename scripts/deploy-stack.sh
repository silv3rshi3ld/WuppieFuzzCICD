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
  
  # Verify Docker registry is running
  echo "Verifying local registry..."
  if ! curl -s http://localhost:5000/v2/_catalog > /dev/null; then
    echo "Local registry not running at localhost:5000"
    # Remove existing registry container if it exists but not running
    if sudo docker ps -a --filter "name=registry" --format '{{.Names}}' | grep -q "^registry$"; then
      echo "Removing existing registry container..."
      sudo docker rm -f registry || true
    fi
    echo "Starting registry..."
    sudo docker run -d --restart=always -p 5000:5000 --name registry registry:2
    # Wait for registry to be ready
    for i in $(seq 1 30); do
      if curl -s http://localhost:5000/v2/_catalog > /dev/null; then
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
  fi
  
  # Images will be verified by Docker Swarm during deployment
  echo "Images will be verified during deployment..."
  
  # Verify network exists and is ready
  if ! sudo docker network ls | grep -q "cicd_network"; then
    echo "Creating overlay network cicd_network"
    sudo docker network create --driver overlay --attachable cicd_network
  fi
  
  echo "Network status:"
  sudo docker network ls | grep "cicd_network"
  
  if sudo docker stack deploy -c docker-swarm.yml fuzzing-stack; then
    # Wait for network to stabilize
    sleep 15
    # Wait for services to be running
    echo "Waiting for services to start..."
    for i in $(seq 1 60); do
      echo "Detailed service status:"
      sudo docker stack services fuzzing-stack
      
      # Count services that are fully deployed (current = desired replicas)
      RUNNING_COUNT=0
      for service in vampi-evomaster vampi-restler vampi-wuppiefuzz; do
        echo "Checking service: fuzzing-stack_$service"
        
        # Get detailed service status
        REPLICAS=$(sudo docker service ps "fuzzing-stack_$service" --filter "desired-state=running" --filter "current-state=running" -q | wc -l)
        echo "Running replicas for $service: $REPLICAS"
        
        # Show error state and logs if service is not running
        if [ "$REPLICAS" -ne 1 ]; then
          echo "Service $service status:"
          sudo docker service ps "fuzzing-stack_$service" --no-trunc
          
          echo "Service $service logs:"
          sudo docker service logs "fuzzing-stack_$service" 2>&1 || true
        else
          RUNNING_COUNT=$((RUNNING_COUNT + 1))
        fi
      done
      EXPECTED_COUNT=3  # One VAmPI instance per fuzzer
      
      # Show node status
      echo "Node status:"
      sudo docker node ls
      
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
