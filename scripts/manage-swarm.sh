#!/bin/bash

# Get the current number of runners from the environment
CURRENT_RUNNERS=$1
SWARM_STATE_FILE=".swarm-state"

# Function to initialize swarm
initialize_swarm() {
    echo "Initializing swarm with $CURRENT_RUNNERS runners..."
    
    # Initialize swarm if not already initialized
    if ! docker node ls >/dev/null 2>&1; then
        docker swarm init --advertise-addr $MANAGER_IP
        echo $CURRENT_RUNNERS > $SWARM_STATE_FILE
        echo "Swarm initialized successfully"
    fi
}

# Function to check if swarm needs reconfiguration
check_swarm_state() {
    if [ ! -f $SWARM_STATE_FILE ]; then
        echo "No previous swarm state found"
        return 1
    fi

    PREVIOUS_RUNNERS=$(cat $SWARM_STATE_FILE)
    if [ "$PREVIOUS_RUNNERS" != "$CURRENT_RUNNERS" ]; then
        echo "Number of runners changed from $PREVIOUS_RUNNERS to $CURRENT_RUNNERS"
        return 1
    fi

    return 0
}

# Function to tear down swarm
tear_down_swarm() {
    echo "Tearing down swarm..."
    docker swarm leave --force
    rm -f $SWARM_STATE_FILE
}

# Main logic
if ! check_swarm_state; then
    if docker node ls >/dev/null 2>&1; then
        tear_down_swarm
    fi
    initialize_swarm
else
    echo "Swarm configuration is up to date"
fi

# Verify swarm status
docker node ls
