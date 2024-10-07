# CI/CD Pipeline with WuppieFuzz and Vulnerable REST API

Welcome to my CI/CD project, which integrates **WuppieFuzz** for automated API fuzz testing against a **Vulnerable REST API**. This repository demonstrates how to set up a continuous integration and deployment (CI/CD) pipeline that builds a vulnerable API, runs security tests using WuppieFuzz, and generates reports for analysis—all without manual setup!

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Setting Up a Self-Hosted Runner](#setting-up-a-self-hosted-runner)
  - [Workflow Overview](#workflow-overview)
- [CI/CD Pipeline Details](#cicd-pipeline-details)
  - [Workflow Steps](#workflow-steps)
- [WuppieFuzz Integration](#wuppiefuzz-integration)
- [Vulnerable REST API](#vulnerable-rest-api)
  - [Including Vulnerable API Source Code](#including-vulnerable-api-source-code)
  - [Security Considerations](#security-considerations)
- [Visualizing Fuzzing Results](#visualizing-fuzzing-results)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project sets up a CI/CD pipeline using **GitHub Actions** to automate the process of building a **Vulnerable RESTful API**, performing security fuzz testing using **WuppieFuzz**, and generating reports. The goal is to demonstrate how fuzz testing can be seamlessly integrated into the development lifecycle to identify and address potential vulnerabilities.

## Project Structure

- **.github/workflows/**: Contains the GitHub Actions workflow file.
- **docker-compose.yml**: Docker Compose configuration to build and run the API and its dependencies.
- **openapi.yaml**: The OpenAPI specification for the API.
- **reports/**: Directory where WuppieFuzz outputs reports.
- **WuppieFuzz/**: Directory containing WuppieFuzz source code.
- **vulnerable-rest-api/**: Directory containing the source code of the Vulnerable REST API.
- **README.md**: Project documentation.

## Prerequisites

- **Docker** and **Docker Compose** installed on the machine that will host the **self-hosted GitHub Actions runner**.
- **GitHub Actions** enabled if running the CI/CD pipeline on GitHub.

## Getting Started

### Setting Up a Self-Hosted Runner

To run this CI/CD pipeline, you need to set up a **self-hosted runner** on the machine where Docker is installed. This runner will handle all steps in the CI/CD pipeline.

#### Step 1: Create a Self-Hosted Runner on GitHub

1. Navigate to your repository on GitHub.
2. Click on **Settings**.
3. In the left sidebar, click on **Actions**.
4. Click on **Runners** and then click **Add runner**.
5. Follow the instructions to download the runner package, configure it, and start the runner.

#### Step 2: Configure the Self-Hosted Runner

After setting up the runner on GitHub, follow the steps provided to configure the runner:

```bash
./config.sh --url https://github.com/your-username/your-repository --token <your_runner_token>
```

This command will link the runner to your repository.

#### Step 3: Start the Runner

Run the following command to start the runner:

```bash
./run.sh
```

Your self-hosted runner should now be active and ready to execute the CI/CD pipeline.

### Workflow Overview

Once the runner is set up and active, pushing code to the `main` branch or creating a pull request will automatically trigger the CI/CD pipeline. The pipeline will handle all the setup, build, and testing steps, ensuring a fully automated process.

## CI/CD Pipeline Details

The CI/CD pipeline is defined using GitHub Actions in `.github/workflows/ci.yml`. The pipeline performs the following tasks:

1. **Checkout Code**: Retrieves the latest code from the repository.
2. **Set Up Dependencies**: Installs Docker Compose.
3. **Build and Run Services**: Uses Docker Compose to build and run the Vulnerable REST API.
4. **Wait for Services**: Ensures the API is up and running before testing.
5. **Test API Connectivity**: Verifies that the API is accessible.
6. **Clone and Build WuppieFuzz**: Clones the WuppieFuzz repository and builds it.
7. **Generate Initial Corpus**: Creates an initial set of inputs for fuzzing.
8. **Run WuppieFuzz Fuzzing**: Executes the fuzzing process against the Vulnerable REST API.
9. **Upload Fuzzing Reports**: Uploads the generated reports for analysis.
10. **Cleanup**: Stops and removes Docker containers.

### Workflow Steps

Here's a simplified version of the workflow:

```yaml
name: WuppieFuzz CI Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build_and_fuzz:
    runs-on: self-hosted

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install Docker Compose
        run: |
          sudo apt-get update
          sudo apt-get install -y docker-compose
          docker-compose --version

      - name: Build and run services with Docker Compose
        env:
          SMTP_USER: ${{ secrets.SMTP_USER }}
          SMTP_PASS: ${{ secrets.SMTP_PASS }}
          SMTP_HOST: ${{ secrets.SMTP_HOST }}
          SMTP_PORT: ${{ secrets.SMTP_PORT }}
        run: |
          docker-compose up -d --build

      - name: Wait for services to start
        run: sleep 15

      - name: Test API Connectivity
        run: |
          curl -I http://localhost:3001

      - name: Clone WuppieFuzz repository
        run: git clone https://github.com/TNO-S3/WuppieFuzz.git

      - name: Build WuppieFuzz
        run: |
          cd WuppieFuzz
          cargo build --release
          cd ..

      - name: Add WuppieFuzz to PATH
        run: |
          echo "${{ github.workspace }}/WuppieFuzz/target/release" >> $GITHUB_PATH

      - name: Generate initial corpus
        run: wuppiefuzz output-corpus --openapi-spec openapi.yaml corpus_directory

      - name: Run WuppieFuzz
        env:
          RUST_BACKTRACE: 1
        run: |
          wuppiefuzz fuzz --report --log-level info --initial-corpus corpus_directory \
          --timeout 300 openapi.yaml

      - name: Upload WuppieFuzz report
        uses: actions/upload-artifact@v4
        with:
          name: wuppiefuzz-report
          path: reports/

      - name: Stop and remove Docker containers
        if: always()
        run: docker-compose down
```

## WuppieFuzz Integration

The CI/CD pipeline automates the process of building and running WuppieFuzz, so no manual steps are needed.

## Vulnerable REST API

The CI/CD pipeline automatically builds and deploys the Vulnerable REST API using Docker Compose. The source code is included in the repository under the `vulnerable-rest-api/` directory.

### Including Vulnerable API Source Code

The source code for the Vulnerable REST API is included in the repository under the `vulnerable-rest-api/` directory. This API is intentionally designed with vulnerabilities for educational and testing purposes.

## Visualizing Fuzzing Results

The pipeline outputs the fuzzing reports in the `reports/` directory. To view the results:

1. Locate the `index.html` file in the `reports/` directory.
2. Open it in your web browser to view the fuzzing results.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

**Disclaimer:** This project is intended for educational and testing purposes only. The use of vulnerable software should be done responsibly and ethically.
```
