CI/CD Pipeline with WuppieFuzz and Vulnerable REST API
Welcome to my CI/CD project integrating WuppieFuzz for automated API fuzz testing against a Vulnerable REST API. This repository demonstrates how to set up a continuous integration and deployment (CI/CD) pipeline that builds a vulnerable API, runs security tests using WuppieFuzz, and generates reports for analysis.

Table of Contents
Introduction
Project Structure
Prerequisites
Getting Started
Clone the Repository
Set Up Environment Variables
Build and Run Services
CI/CD Pipeline Overview
Workflow Steps
WuppieFuzz Integration
Including WuppieFuzz Source Code
Vulnerable REST API
Including Vulnerable API Source Code
Security Considerations
Visualizing Fuzzing Results
Cleanup
Contributing
License
Introduction
This project sets up a CI/CD pipeline that automates the process of building a Vulnerable RESTful API, performing security fuzz testing using WuppieFuzz, and generating reports. The goal is to demonstrate how fuzz testing can be integrated into the development lifecycle to identify and address potential vulnerabilities.

Project Structure
.github/workflows/: Contains the GitHub Actions workflow file.
docker-compose.yml: Docker Compose configuration to build and run the API and its dependencies.
openapi.yaml: The OpenAPI specification for the API.
reports/: Directory where WuppieFuzz outputs reports.
WuppieFuzz/: Submodule or directory containing WuppieFuzz source code.
vulnerable-rest-api/: Directory containing the source code of the Vulnerable REST API.
README.md: Project documentation.
Prerequisites
Docker and Docker Compose installed on your machine.
Git installed for cloning the repository.
Rust toolchain (if building WuppieFuzz from source).
GitHub Actions enabled if running the CI/CD pipeline on GitHub.
Getting Started
Clone the Repository
bash
Copy code
git clone https://github.com/your-username/your-repository.git
cd your-repository
Set Up Environment Variables
Create a .env file in the root directory and add the following variables:

env
Copy code
SMTP_USER=dummy_user
SMTP_PASS=dummy_pass
SMTP_HOST=smtp.example.com
SMTP_PORT=587
These variables are used by the API for email functionalities.

Build and Run Services
Use Docker Compose to build and run the API and its dependencies:

bash
Copy code
docker-compose up -d --build
This command will build both the Vulnerable REST API and any other services defined in the docker-compose.yml file.

CI/CD Pipeline Overview
The CI/CD pipeline is defined using GitHub Actions in .github/workflows/ci.yml. The pipeline performs the following tasks:

Checkout Code: Retrieves the latest code from the repository.
Set Up Dependencies: Installs Docker Compose and Rust toolchain.
Build and Run Services: Uses Docker Compose to build and run the Vulnerable REST API.
Wait for Services: Ensures the API is up and running before testing.
Test API Connectivity: Verifies that the API is accessible.
Clone and Build WuppieFuzz: Clones the WuppieFuzz repository and builds it.
Generate Initial Corpus: Creates an initial set of inputs for fuzzing.
Run WuppieFuzz Fuzzing: Executes the fuzzing process against the Vulnerable REST API.
Upload Fuzzing Reports: Uploads the generated reports for analysis.
Cleanup: Stops and removes Docker containers.
Workflow Steps
Here's a simplified version of the workflow:

yaml
Copy code
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
    runs-on: ubuntu-latest

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

      - name: Install Rust toolchain
        uses: actions/setup-rust@v1
        with:
          rust-version: stable

      - name: Install dependencies for WuppieFuzz
        run: |
          sudo apt-get update
          sudo apt-get install -y pkg-config libssl-dev

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
WuppieFuzz Integration
Including WuppieFuzz Source Code
The WuppieFuzz source code is included in the repository under the WuppieFuzz/ directory. This allows for direct access and potential customization of the fuzzer.

Building WuppieFuzz:

bash
Copy code
cd WuppieFuzz
cargo build --release
cd ..
Adding WuppieFuzz to PATH:

bash
Copy code
echo "${PWD}/WuppieFuzz/target/release" >> $PATH
Vulnerable REST API
Including Vulnerable API Source Code
The source code for the Vulnerable REST API is included in the repository under the vulnerable-rest-api/ directory. This API is intentionally designed with vulnerabilities for educational and testing purposes.

Building and Running the API:

The API is built and run using Docker Compose as part of the CI/CD pipeline.

Manual Build:

bash
Copy code
cd vulnerable-rest-api
docker build -t vulnerable-rest-api .
docker run -d -p 3001:3001 vulnerable-rest-api
Security Considerations
Warning: This API is intentionally vulnerable and should not be exposed to the internet or used in production environments.
Use with Caution: Run the API in a controlled environment, such as a local machine or isolated network.
Legal Compliance: Ensure compliance with all relevant laws and policies when testing with vulnerable software.
Visualizing Fuzzing Results
After fuzzing, WuppieFuzz generates reports in the reports/ directory.

Viewing the HTML Report
Locate the index.html file in the reports/ directory.
Open it in your web browser to view the fuzzing results.
Exploring Detailed Data
The report.db file contains detailed data about the fuzzing process.

Using a SQLite Viewer:

Install DB Browser for SQLite.
Open report.db with the SQLite viewer to explore detailed data.
Cleanup
To stop and remove the Docker containers:

bash
Copy code
docker-compose down
Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

Note: When contributing, please ensure that any changes adhere to ethical guidelines and do not introduce unauthorized vulnerabilities.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Disclaimer: This project is intended for educational and testing purposes only. The use of vulnerable software should be done responsibly and ethically.
