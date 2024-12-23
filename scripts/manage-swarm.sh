#!/bin/bash

# Combines logic from both manage-swarm.sh files into one unified script.

# Usage:
#   ./manage-swarm.sh [CURRENT_RUNNERS] [GITHUB_OUTPUT]
# Example:
#   ./manage-swarm.sh 2 $GITHUB_OUTPUT

CURRENT_RUNNERS=$1
GITHUB_OUTPUT=$2

SWARM_STATE_FILE=".swarm-state"
STACK_NAME="wuppiefuzz"

# Function to initialize the swarm
initialize_swarm() {
    echo "Initializing swarm with $CURRENT_RUNNERS runners..."
    # Always leave any existing swarm first
    docker swarm leave --force 2>/dev/null || true
    
    # Initialize new swarm
    if [ -n "$MANAGER_IP" ]; then
        docker swarm init --advertise-addr "$MANAGER_IP"
    else
        docker swarm init
    fi
    echo "$CURRENT_RUNNERS" > "$SWARM_STATE_FILE"
    echo "Swarm initialized successfully"
}

# Function to deploy the Docker stack
deploy_stack() {
    echo "Deploying Docker stack with stack name: $STACK_NAME"
    docker stack deploy -c docker-swarm.yml "$STACK_NAME"
    if [ $? -ne 0 ]; then
        echo "Error deploying stack"
        return 1
    fi
    echo "Stack deployed successfully"
    return 0
}

# Always initialize swarm
initialize_swarm
echo "swarm-initialized=true" >> "$GITHUB_OUTPUT"
SWARM_INITIALIZED="true"

# Show node status
docker node ls

# Deploy the stack
if deploy_stack; then
    echo "swarm-deployed=true" >> "$GITHUB_OUTPUT"
else
    echo "swarm-deployed=false" >> "$GITHUB_OUTPUT"
fi

# Show stack tasks
docker stack ps "$STACK_NAME"
