#!/bin/bash
set -e

# Function to check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        echo "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
}

# Function to check pod status
check_pod_status() {
    local namespace=$1
    local app=$2
    
    echo "Checking status for $app pods..."
    kubectl get pods -n $namespace -l app=$app -o wide
    
    # Get the pod name
    local pod_name=$(kubectl get pods -n $namespace -l app=$app -o jsonpath='{.items[0].metadata.name}')
    
    if [ ! -z "$pod_name" ]; then
        echo "Recent logs for $app:"
        kubectl logs -n $namespace $pod_name --tail=50
    else
        echo "No pods found for $app"
    fi
}

# Function to check service endpoints
check_service_endpoints() {
    local namespace=$1
    echo "Checking service endpoints..."
    kubectl get services -n $namespace
}

# Function to check resource usage
check_resource_usage() {
    local namespace=$1
    echo "Checking resource usage..."
    kubectl top pods -n $namespace 2>/dev/null || echo "Metrics server not available"
}

# Main monitoring function
monitor_fuzzing_system() {
    local namespace="fuzzing-system"
    
    echo "=== Fuzzing System Status ==="
    echo "Timestamp: $(date)"
    echo
    
    # Check overall namespace status
    echo "Namespace Status:"
    kubectl get namespace $namespace
    echo
    
    # Check all resources in the namespace
    echo "All Resources in Namespace:"
    kubectl get all -n $namespace
    echo
    
    # Check individual services
    for service in "vampi-restler" "vampi-wuppiefuzz" "vampi-evomaster"; do
        echo "=== $service Status ==="
        check_pod_status $namespace $service
        echo
    done
    
    # Check service endpoints
    check_service_endpoints $namespace
    echo
    
    # Check resource usage
    check_resource_usage $namespace
    echo
    
    echo "Monitoring complete at $(date)"
}

# Main execution
main() {
    check_kubectl
    
    if [ "$1" == "--watch" ]; then
        while true; do
            monitor_fuzzing_system
            echo "Waiting 30 seconds before next check..."
            sleep 30
            clear
        done
    else
        monitor_fuzzing_system
    fi
}

main "$@"
