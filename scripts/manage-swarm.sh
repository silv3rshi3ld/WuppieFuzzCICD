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
    # If swarm is not active, initialize
    if ! docker node ls >/dev/null 2>&1; then
        # The environment variable MANAGER_IP should be set externally for a stable advertise-addr, if needed
        if [ -n "$MANAGER_IP" ]; then
            docker swarm init --advertise-addr "$MANAGER_IP"
        else
            docker swarm init
        fi
        echo "$CURRENT_RUNNERS" > "$SWARM_STATE_FILE"
        echo "Swarm initialized successfully"
    else
        echo "Reusing existing swarm"
    fi
}

# Function to check if swarm needs reconfiguration (e.g., if number of runners changed)
check_swarm_state() {
    if [ ! -f "$SWARM_STATE_FILE" ]; then
        echo "No previous swarm state found"
        return 1
    fi

    PREVIOUS_RUNNERS=$(cat "$SWARM_STATE_FILE")
    if [ "$PREVIOUS_RUNNERS" != "$CURRENT_RUNNERS" ]; then
        echo "Number of runners changed from $PREVIOUS_RUNNERS to $CURRENT_RUNNERS"
        return 1
    fi

    return 0
}

# Function to tear down the existing swarm, if any
tear_down_swarm() {
    echo "Tearing down swarm..."
    docker swarm leave --force || echo "Failed to leave swarm"
    rm -f "$SWARM_STATE_FILE"
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

# 1) If swarm config changed, tear down previous swarm and re-init
if ! check_swarm_state; then
    if docker node ls >/dev/null 2>&1; then
        tear_down_swarm
    fi
    initialize_swarm
    echo "swarm-initialized=true" >> "$GITHUB_OUTPUT"
    SWARM_INITIALIZED="true"
else
    echo "Swarm configuration is up to date"
    echo "swarm-initialized=false" >> "$GITHUB_OUTPUT"
    SWARM_INITIALIZED="false"
fi

# 2) Always show node status
docker node ls

# 3) If newly (re)initialized, deploy the stack
if [ "$SWARM_INITIALIZED" == "true" ]; then
    if deploy_stack; then
        echo "swarm-deployed=true" >> "$GITHUB_OUTPUT"
    else
        echo "swarm-deployed=false" >> "$GITHUB_OUTPUT"
    fi

    # Show stack tasks
    docker stack ps "$STACK_NAME"
else
    echo "No new swarm deployment needed."
fi
