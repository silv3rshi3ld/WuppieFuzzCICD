#!/bin/bash
set -e

# Function to check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        echo "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
}

# Function to check if a resource exists
check_resource() {
    local namespace=$1
    local resource_type=$2
    local resource_name=$3
    
    kubectl get $resource_type -n $namespace $resource_name &> /dev/null
}

# Function to wait for deployment
wait_for_deployment() {
    local namespace=$1
    local deployment=$2
    local timeout=300  # 5 minutes timeout
    
    echo "Waiting for deployment $deployment to be ready..."
    
    # Pre-pull the image to ensure it's available
    local image=$(kubectl get deployment $deployment -n $namespace -o jsonpath='{.spec.template.spec.containers[0].image}')
    echo "Pre-pulling image: $image"
    docker pull $image || echo "Warning: Failed to pre-pull image $image"
    
    # Wait for deployment with enhanced logging
    kubectl wait --for=condition=available --timeout=${timeout}s deployment/$deployment -n $namespace || {
        echo "Deployment $deployment failed to become ready. Checking pod status..."
        kubectl get pods -n $namespace -l app=$deployment -o wide
        echo "Checking pod logs..."
        kubectl logs -n $namespace -l app=$deployment --tail=50
        echo "Checking pod events..."
        kubectl get events -n $namespace --field-selector involvedObject.kind=Pod,involvedObject.name=$deployment
        return 1
    }
}

# Main deployment function
deploy_fuzzing_system() {
    echo "Starting Kubernetes deployment for fuzzing system..."
    
    # Create namespace
    if ! check_resource "" "namespace" "fuzzing-system"; then
        echo "Creating fuzzing-system namespace..."
        kubectl apply -f k8s/namespace.yaml
    fi
    
    # Apply network policy
    echo "Applying network policy..."
    kubectl apply -f k8s/network-policy.yaml
    
    # Deploy services
    echo "Deploying vampi services..."
    kubectl apply -f k8s/vampi-restler.yaml
    kubectl apply -f k8s/vampi-wuppiefuzz.yaml
    kubectl apply -f k8s/vampi-evomaster.yaml
    
    # Wait for deployments
    wait_for_deployment "fuzzing-system" "vampi-restler"
    wait_for_deployment "fuzzing-system" "vampi-wuppiefuzz"
    wait_for_deployment "fuzzing-system" "vampi-evomaster"
    
    # Deploy fuzzer jobs if they exist
    if [[ -f "k8s/fuzzer-jobs.yaml" ]]; then
        echo "Deploying fuzzer jobs..."
        kubectl apply -f k8s/fuzzer-jobs.yaml
    fi
    
    echo "Getting service endpoints..."
    kubectl get services -n fuzzing-system
    
    echo "Deployment complete!"
}

# Main execution
main() {
    check_kubectl
    
    # Check if we should clean up first
    if [[ "$1" == "--clean" ]]; then
        echo "Cleaning up existing deployments..."
        kubectl delete namespace fuzzing-system --ignore-not-found
        sleep 10  # Wait for cleanup
    fi
    
    deploy_fuzzing_system
}

main "$@"
