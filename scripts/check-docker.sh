#!/bin/bash

# Function to print error messages
error() {
    echo "ERROR: $1" >&2
}

# Function to print success messages
success() {
    echo "SUCCESS: $1"
}

# Check if Docker is installed
check_docker_installed() {
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        return 1
    fi
    success "Docker is installed"
    return 0
}

# Check if Docker daemon is running
check_docker_running() {
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running"
        return 1
    fi
    success "Docker daemon is running"
    return 0
}

# Check if current user is in docker group
check_docker_group() {
    if ! groups | grep -q docker; then
        error "Current user is not in the docker group"
        echo "Fixing: Adding current user to docker group..."
        sudo usermod -aG docker $USER
        success "Added user to docker group. Please log out and back in for changes to take effect."
        return 1
    fi
    success "Current user is in docker group"
    return 0
}

# Check if Docker can be run without sudo
check_docker_permissions() {
    if ! docker ps &> /dev/null; then
        error "Cannot run Docker commands without sudo"
        return 1
    fi
    success "Docker commands can be run without sudo"
    return 0
}

# Main function to run all checks
main() {
    echo "Checking Docker installation and configuration..."
    
    local has_error=0

    # Run all checks
    check_docker_installed || has_error=1
    check_docker_running || has_error=1
    check_docker_group || has_error=1
    check_docker_permissions || has_error=1

    if [ $has_error -eq 1 ]; then
        error "Docker configuration needs attention. Please fix the issues above."
        exit 1
    fi

    success "Docker is properly configured!"
    exit 0
}

# Run main function
main
