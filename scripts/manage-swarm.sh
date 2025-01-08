#!/bin/bash

# Combines logic from both manage-swarm.sh files into one unified script.

# Usage:
#   ./manage-swarm.sh [CURRENT_RUNNERS] [GITHUB_OUTPUT]
# Example:
#   ./manage-swarm.sh 2 $GITHUB_OUTPUT

set -e  # Exit on error

CURRENT_RUNNERS=$1
SWARM_STATE_FILE=".swarm-state"
STACK_NAME="fuzzing-stack"
MAX_RETRIES=3

# Function to check if port is in use
check_port() {
    local port=$1
    if sudo lsof -i :$port -P -n | grep -q LISTEN; then
        return 0  # Port is in use
    fi
    return 1  # Port is free
}

# Function to cleanup existing swarm
cleanup_swarm() {
    echo "Cleaning up existing swarm..."
    # Force leave any existing swarm
    sudo docker swarm leave --force 2>/dev/null || true
    
    # Kill any process using port 2377
    if check_port 2377; then
        echo "Port 2377 is in use, killing process..."
        sudo fuser -k 2377/tcp || true
        sleep 2  # Wait for port to be freed
    fi
}

# Function to initialize the swarm
initialize_swarm() {
    local retry_count=0
    
    while [ $retry_count -lt $MAX_RETRIES ]; do
        echo "Initializing swarm (attempt $((retry_count + 1))/$MAX_RETRIES)..."
        
        # Cleanup first
        cleanup_swarm
        
        # Initialize new swarm
        if [ -n "$MANAGER_IP" ]; then
            if sudo docker swarm init --advertise-addr "$MANAGER_IP"; then
                break
            fi
        else
            if sudo docker swarm init; then
                break
            fi
        fi
        
        retry_count=$((retry_count + 1))
        [ $retry_count -lt $MAX_RETRIES ] && sleep 5
    done
    
    if [ $retry_count -eq $MAX_RETRIES ]; then
        echo "Failed to initialize swarm after $MAX_RETRIES attempts"
        return 1
    fi
    
    echo "$CURRENT_RUNNERS" > "$SWARM_STATE_FILE"
    echo "Swarm initialized successfully"
    return 0
}

# Function to verify swarm status
verify_swarm() {
    echo "Verifying swarm status..."
    if ! sudo docker info 2>/dev/null | grep -q "Swarm: active"; then
        echo "Swarm is not active"
        return 1
    fi
    
    if ! sudo docker node ls >/dev/null 2>&1; then
        echo "Not a swarm manager"
        return 1
    fi
    
    echo "Swarm verification successful"
    return 0
}

# Function to setup network
setup_network() {
    echo "Setting up Docker network..."
    # Check if network exists first
    if ! sudo docker network ls | grep -q "cicd_network"; then
        echo "Creating overlay network cicd_network"
        if ! sudo docker network create --driver overlay --attachable cicd_network; then
            echo "Failed to create network"
            return 1
        fi
    else
        echo "Network cicd_network already exists"
    fi
    
    # Verify network is overlay type
    if ! sudo docker network inspect cicd_network --format "{{.Driver}}" | grep -q "overlay"; then
        echo "Network cicd_network is not an overlay network"
        return 1
    fi
    
    echo "Network setup successful"
    return 0
}

# Function to deploy the Docker stack
deploy_stack() {
    echo "Deploying Docker stack with stack name: $STACK_NAME"
    local retry_count=0
    
    # Setup network first
    if ! setup_network; then
        echo "Network setup failed"
        return 1
    fi
    
    while [ $retry_count -lt $MAX_RETRIES ]; do
        echo "Deploying stack (attempt $((retry_count + 1))/$MAX_RETRIES)..."
        
        if sudo docker stack deploy -c docker-swarm.yml "$STACK_NAME"; then
            echo "Stack deployed successfully"
            return 0
        fi
        
        retry_count=$((retry_count + 1))
        [ $retry_count -lt $MAX_RETRIES ] && sleep 5
    done
    
    echo "Failed to deploy stack after $MAX_RETRIES attempts"
    return 1
}

# Main execution
echo "Starting swarm management..."

# Initialize swarm
if ! initialize_swarm; then
    echo "Failed to initialize swarm"
    exit 1
fi

# Verify swarm is properly initialized
if ! verify_swarm; then
    echo "Swarm verification failed"
    exit 1
fi

# Show node status
echo "Current swarm nodes:"
sudo docker node ls

# Deploy the stack
if ! deploy_stack; then
    echo "Stack deployment failed"
    exit 1
fi

# Show stack tasks
echo "Current stack tasks:"
sudo docker stack ps "$STACK_NAME" || true

echo "Swarm management completed successfully"
