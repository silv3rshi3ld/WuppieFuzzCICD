#!/bin/bash
set -e

echo "Setting up local registry..."
# Check if registry container exists and is running
if ! docker container inspect registry >/dev/null 2>&1 || \
   [ "$(docker container inspect -f '{{.State.Running}}' registry)" != "true" ]; then
    echo "Starting registry container..."
    docker run -d -p 5000:5000 --name registry registry:2
    sleep 5  # Give registry time to start
fi

# Function to build and push an image
build_and_push() {
    local context=$1
    local dockerfile=$2
    local tag=$3
    
    echo "Building $tag..."
    docker build -t $tag -f $dockerfile $context
    
    echo "Pushing $tag..."
    docker push $tag
    
    # Verify push was successful
    if ! curl -s "http://localhost:5000/v2/_catalog" | grep -q "\"$tag\""; then
        echo "Failed to verify $tag in registry"
        exit 1
    fi
}

# Build base VAmPI image
echo "Building VAmPI images..."
cd services/vampi
build_and_push . Dockerfile localhost:5000/vampi-vulnerable:latest
build_and_push . Dockerfile localhost:5000/vampi-vulnerable-restler:latest
build_and_push . Dockerfile localhost:5000/vampi-vulnerable-wuppiefuzz:latest
build_and_push . Dockerfile localhost:5000/vampi-vulnerable-evomaster:latest
cd ../..

# Build fuzzer images
echo "Building fuzzer images..."
cd services/restler
build_and_push . Dockerfile.restler localhost:5000/restler:latest
cd ../..

cd services/wuppiefuzz
build_and_push . Dockerfile.wuppiefuzz localhost:5000/wuppiefuzz:latest
cd ../..

cd services/evomaster
build_and_push . Dockerfile.evomaster localhost:5000/evomaster:latest
cd ../..

echo "All images built and pushed successfully"
