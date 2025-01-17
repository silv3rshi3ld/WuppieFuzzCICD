# WuppieFuzz CICD

A continuous integration and deployment system for fuzzing web APIs using multiple fuzzers (WuppieFuzz, RESTler, and EvoMaster) in a Kubernetes environment.

## System Overview

The system runs three instances of the VAmPI vulnerable API, each dedicated to a specific fuzzer:
- vampi-restler: Target for RESTler fuzzer
- vampi-wuppiefuzz: Target for WuppieFuzz
- vampi-evomaster: Target for EvoMaster

Each service runs in isolation within the Kubernetes cluster, with controlled network access through a NetworkPolicy.

## Prerequisites

- Kubernetes cluster (local or remote)
- kubectl installed and configured
- Docker for building images
- Local registry running on port 5000

## Directory Structure

```
.
├── k8s/                    # Kubernetes manifests
│   ├── namespace.yaml      # Fuzzing system namespace
│   ├── network-policy.yaml # Network isolation rules
│   ├── fuzzer-jobs.yaml    # Fuzzer job definitions
│   ├── vampi-restler.yaml  # RESTler target deployment
│   ├── vampi-wuppiefuzz.yaml # WuppieFuzz target deployment
│   └── vampi-evomaster.yaml  # EvoMaster target deployment
├── scripts/
│   ├── deploy-k8s.sh      # Deployment script
│   └── monitor-k8s.sh     # Monitoring script
└── services/              # Service implementations
```

## Usage

1. Start the local registry:
```bash
docker run -d -p 5000:5000 --restart=always --name registry registry:2
```

2. Deploy the system:
```bash
./scripts/deploy-k8s.sh
```

3. Monitor the fuzzing progress:
```bash
./scripts/monitor-k8s.sh
```

Use the `--watch` flag for continuous monitoring:
```bash
./scripts/monitor-k8s.sh --watch
```

4. Clean up the deployment:
```bash
./scripts/deploy-k8s.sh --clean
```

## CI/CD Integration

The system includes two GitHub Actions workflows that work together to provide automated fuzzing:

### Fuzzing Workflow (.github/workflows/k8s-fuzzing-workflow.yaml)
This is the primary workflow, triggered by:
- Push events to the Experiment-kubernetes branch
- Pull requests to the Experiment-kubernetes branch
- Manual workflow_dispatch events

The workflow:
1. Checks if the Kubernetes cluster is ready with required services
2. If cluster is not ready, triggers the deployment workflow
3. Once cluster is ready (either existing or newly deployed):
   - Builds and pushes fuzzer images
   - Deploys and runs fuzzing jobs
   - Monitors fuzzing progress
   - Collects and uploads results as artifacts

### Deployment Workflow (.github/workflows/k8s-deployment-workflow.yaml)
This workflow handles cluster setup and can be:
- Triggered automatically by the fuzzing workflow when needed
- Triggered manually through workflow_dispatch
- Triggered by push events to the Experiment-kubernetes branch

The workflow:
1. Sets up a Kubernetes environment using Minikube
2. Builds and pushes the VAmPI service images
3. Deploys the services to the Kubernetes cluster
4. Verifies the deployment status and service endpoints

### Workflow Intelligence
The system is designed to be smart about deployments:
1. The fuzzing workflow first checks if a working cluster exists
2. Deployment workflow is only triggered if necessary
3. Existing deployments are reused when possible
4. Both workflows can still be run independently if needed

## Service Endpoints

- RESTler target: http://localhost:5012
- WuppieFuzz target: http://localhost:5022
- EvoMaster target: http://localhost:5032

## Network Policy

The system uses a NetworkPolicy to:
- Allow communication between pods within the fuzzing-system namespace
- Allow outbound HTTP/HTTPS traffic for package downloads
- Block unnecessary network access

## Monitoring

The monitoring script provides:
- Pod status and health
- Service endpoints
- Resource usage
- Fuzzing job progress
- Container logs

## Results Collection

Fuzzing results are automatically collected and stored in the `fuzzing-results` directory, containing:
- restler-results.log
- wuppiefuzz-results.log
- evomaster-results.log
