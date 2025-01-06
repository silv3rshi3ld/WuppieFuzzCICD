# API Fuzzing Pipeline

This GitHub Actions workflow manages a Docker Swarm-based API fuzzing pipeline.

## Required Runner Labels

The workflow requires self-hosted runners with specific labels:

- `swarm-manager`: For the node that will act as the Swarm manager
- `swarm-worker`: For nodes that will join the Swarm as workers

Make sure to add these labels to your self-hosted runners in GitHub Actions settings:

1. Go to your repository settings
2. Navigate to Actions > Runners
3. Select each runner and add the appropriate label:
   - Add `swarm-manager` to the manager node
   - Add `swarm-worker` to worker nodes

## Workflow Overview

1. **Cleanup**: Removes any existing containers, networks, and processes
2. **Initialize Swarm**: Sets up Docker Swarm on the manager node
3. **Join Swarm**: Workers join the Swarm cluster
4. **Build Images**: Builds and pushes Docker images for all services
5. **Deploy Stack**: Deploys the full service stack to the Swarm
6. **Run Fuzzing**: Executes fuzzing tests across the distributed services
7. **Collect Results**: Gathers and uploads fuzzing results

## Configuration

The workflow uses several environment variables that can be configured:

```yaml
env:
  DOCKER_NETWORK_NAME: cicd_network
  VAMPI_RESTLER_PORT: 5012
  VAMPI_WUPPIEFUZZ_PORT: 5022
  VAMPI_EVOMASTER_PORT: 5032
```

## Required Secrets

- `MANAGER_IP`: The IP address of the Swarm manager node

## Network Configuration

The workflow creates an encrypted overlay network for secure communication between services:

```yaml
networks:
  swarm_network:
    driver: overlay
    driver_opts:
      encrypted: "true"
    attachable: true
```

## Service Stack

The stack deploys several services:
- VAmPI (vulnerable API target)
- WuppieFuzz (fuzzing service)
- RESTler (fuzzing service)
- EvoMaster (fuzzing service)

Each service is configured with:
- Resource limits
- Health checks
- Restart policies
- Proper network configuration
- Volume mounts for results
