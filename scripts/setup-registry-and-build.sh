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
    
    # Verify push was successful by checking manifest
    # Correctly extract image name by removing registry and tag parts
    image_name=$(echo "$tag" | sed -e 's|^localhost:5000/||' -e 's/:.*//')
    echo "Verifying image $image_name in registry..."
    
    # Try to get manifest with retries
    max_retries=3
    for i in $(seq 1 $max_retries); do
        response=$(curl -s -f -H "Accept: application/vnd.docker.distribution.manifest.v2+json" \
            "http://localhost:5000/v2/$image_name/manifests/latest" 2>&1)
        if [ $? -eq 0 ]; then
            echo "Successfully verified $tag in registry"
            break
        fi
        if [ $i -eq $max_retries ]; then
            echo "Failed to verify $tag in registry after $max_retries attempts"
            echo "Registry response: $response"
            exit 1
        fi
        echo "Attempt $i failed, retrying in 2 seconds..."
        sleep 2
    done
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