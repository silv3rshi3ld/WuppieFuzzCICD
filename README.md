# Multi-Target Fuzzing Framework

This repository contains a framework for fuzzing multiple web applications using various fuzzing tools including WuppieFuzz, EvoMaster, RESTler, and Schemathesis.

## Repository Structure

```
/
├── fuzzers/            # Fuzzing tools configurations
│   ├── docker-compose.base.yml  # Base configuration for all fuzzers
│   ├── evomaster/     # EvoMaster configurations
│   ├── restler/       # RESTler configurations
│   ├── schemathesis/  # Schemathesis configurations
│   └── wuppiefuzz/    # WuppieFuzz configurations
├── targets/           # Target applications
│   ├── vampi/        # VAmPI application
│   ├── juiceshop/    # OWASP Juice Shop
│   └── dvapi/        # Damn Vulnerable REST API
└── dashboard/         # Results dashboard (future implementation)
```

## Supported Targets

### VAmPI
A vulnerable API for security testing.
- Port: 5000
- Docker: `erev0s/vampi:latest`
- Configuration: `targets/vampi/config.env`

### OWASP Juice Shop
A modern vulnerable web application.
- Port: 3000
- Docker: `bkimminich/juice-shop`
- Configuration: `targets/juiceshop/config.env`

### DVAPI (Damn Vulnerable REST API)
A deliberately vulnerable API for testing.
- Port: 5000
- Docker: `appsecco/dvapi`
- Configuration: `targets/dvapi/config.env`

## Configuration System

### Target Configuration
Each target has its own configuration file (`config.env`) that defines:
- Target host and port
- API schema and swagger path
- Docker image and container name
- Health check command
- Fuzzing parameters

Example `config.env`:
```bash
TARGET_HOST=localhost
TARGET_PORT=3000
TARGET_SCHEMA=http
TARGET_SWAGGER_PATH=/swagger.json
TARGET_IMAGE=example/app
TARGET_NAME=app-name
HEALTH_CHECK=["CMD", "curl", "-f", "http://localhost:3000"]
SWAGGER_FILE=/path/to/swagger.json
FUZZING_DURATION=1h
REQUESTS_PER_MINUTE=60
```

### Fuzzer Configuration
Fuzzers use a base configuration (`fuzzers/docker-compose.base.yml`) and target-specific overrides. This makes it easy to:
- Add new targets without modifying fuzzer code
- Maintain consistent configuration across all fuzzers
- Override settings per target when needed

## Adding New Targets

1. Create target directory:
```powershell
mkdir targets/newtarget
```

2. Create target configuration:
```powershell
# targets/newtarget/config.env
TARGET_HOST=localhost
TARGET_PORT=8080
TARGET_SCHEMA=http
TARGET_SWAGGER_PATH=/swagger.json
TARGET_IMAGE=example/new-target
TARGET_NAME=new-target
HEALTH_CHECK=["CMD", "curl", "-f", "http://localhost:8080/health"]
SWAGGER_FILE=/path/to/swagger.json
FUZZING_DURATION=1h
REQUESTS_PER_MINUTE=60
```

3. Create docker-compose file:
```yaml
# targets/newtarget/docker-compose.yml
version: '3.8'
services:
  app:
    image: ${TARGET_IMAGE}
    ports:
      - "${TARGET_PORT}:${TARGET_PORT}"
    networks:
      - fuzzing-network
```

4. Create workflow file:
```yaml
# .github/workflows/newtarget.yaml
name: Fuzz NewTarget with Multiple Tools
...
```

## Running Locally

1. Create the fuzzing network:
```powershell
docker network create fuzzing-network
```

2. Load target configuration:
```powershell
set -a
source targets/<target>/config.env
set +a
```

3. Start the target:
```powershell
docker compose -f targets/<target>/docker-compose.yml up -d
```

4. Run fuzzing tools:
```powershell
# Example: Run Schemathesis
cd fuzzers/schemathesis
docker compose -f docker-compose.schemathesis.yml up
```

## Contributing

To contribute a new target:

1. Fork the repository
2. Create a new branch
3. Follow the "Adding New Targets" guide above
4. Submit a pull request

## License

See the LICENSE file for details.
