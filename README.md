# Fuzzing Dashboard Generator

This project generates a comprehensive dashboard for visualizing and analyzing API fuzzing results from multiple fuzzers: **WuppieFuzz**, **RESTler**, and **EvoMaster**. The dashboard provides insights into API endpoint coverage, status codes, and potential vulnerabilities discovered during fuzzing.

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the Fuzzers](#running-the-fuzzers)
  - [Generating the Dashboard](#generating-the-dashboard)
  - [Viewing the Dashboard](#viewing-the-dashboard)
- [CI/CD Integration](#cicd-integration)
- [Fuzzer Integration](#fuzzer-integration)
  - [WuppieFuzz](#wuppiefuzz)
  - [RESTler](#restler)
  - [EvoMaster](#evomaster)
- [Configuring Fuzzer Timebudgets](#configuring-fuzzer-timebudgets)
  - [RESTler Timebudget](#restler-timebudget)
  - [WuppieFuzz Timebudget](#wuppiefuzz-timebudget)
  - [EvoMaster Timebudget](#evomaster-timebudget)
- [Dashboard Features](#dashboard-features)
- [Running Individual Parsers](#running-individual-parsers)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project automates the process of generating a visual dashboard from API fuzzing results. It parses output from three different fuzzers (WuppieFuzz, RESTler, and EvoMaster) and creates an interactive HTML dashboard that helps analyze API security testing results, endpoint coverage, and potential vulnerabilities.

The primary target for fuzzing is [VAmPI](https://github.com/erev0s/VAmPI), a purposefully vulnerable API designed for testing and educational purposes.

## Project Structure

- **parsers/**: Contains parsers for each fuzzer's output format
  - `wuppiefuzz_parser.py`: Parser for WuppieFuzz results
  - `restler_parser.py`: Parser for RESTler results
  - `evomaster_parser.py`: Parser for EvoMaster results
- **dashboard/**: Contains the dashboard templates and generated output
  - `templates/`: HTML templates for the dashboard
  - `js/`: JavaScript files for dashboard functionality
  - `components/`: Reusable dashboard components
- **generate_dashboard.py**: Main script to generate the dashboard
- **serve_dashboard.py**: Simple HTTP server for testing the dashboard locally
- **.github/workflows/**: GitHub Actions workflow files
  - `wuppiefuzz_fuzz_and_RESTles.yaml`: Workflow for running the fuzzers and generating the dashboard
  - `dashboard-generation.yml`: (Deprecated) Previous workflow for generating the dashboard
- **services/**: Contains service configurations for the fuzzers and target API
  - `vampi/`: The vulnerable API used as the fuzzing target
  - `wuppiefuzz/`: Configuration for WuppieFuzz
  - `restler/`: Configuration for RESTler
  - `evomaster/`: Configuration for EvoMaster
- **output-fuzzers/**: Directory where fuzzing results are stored

## Prerequisites

- Python 3.10 or higher
- Dependencies listed in `requirements.txt`
- Docker and Docker Compose (for running the fuzzing workflows)

## Getting Started

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/silv3rshi3ld/WuppieFuzzCICD.git
   cd fuzzing-dashboard
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Fuzzers

The first step in the process is to run the fuzzers against the target API to generate fuzzing results:

1. **Run the fuzzers**: Each fuzzer (WuppieFuzz, RESTler, and EvoMaster) can be run against the VAmPI API to generate fuzzing results. The results will be stored in the `output-fuzzers/` directory.

   ```bash
   # Example: Run WuppieFuzz against VAmPI
   cd services/wuppiefuzz
   docker-compose -f docker-compose.wuppie.yml up
   ```

   Similar commands can be used for RESTler and EvoMaster. Alternatively, you can use the GitHub Actions workflow to run all fuzzers automatically.

2. **Verify fuzzing results**: After running the fuzzers, verify that the results are available in the appropriate directories:
   - WuppieFuzz results: `output-fuzzers/Wuppiefuzz/fuzzing-report.zip`
   - RESTler results: `output-fuzzers/Restler/restler-fuzz-results.zip`
   - EvoMaster results: `output-fuzzers/Evomaster/evomaster-results.zip`

### Generating the Dashboard

Once you have the fuzzing results, you can generate the dashboard:

1. **Parse the fuzzing results**: This step processes the raw fuzzing output files and converts them into a structured format that the dashboard can use.

   ```bash
   # Run all parsers at once (this will process all available fuzzer results)
   python -m parsers
   ```

   This will parse the fuzzing results and generate processed data files in the `dashboard/data/` directory.

2. **Generate the dashboard**: After parsing the fuzzing results, generate the dashboard:

   ```bash
   python generate_dashboard.py
   ```

   This script:
   1. Reads the processed data from `dashboard/data/`
   2. Generates summary statistics
   3. Creates individual pages for each fuzzer
   4. Updates the main dashboard index.html

### Viewing the Dashboard

To view the generated dashboard, you can open the `dashboard/index.html` file directly in your browser:

```bash
# On Windows
start dashboard/index.html

# On macOS
open dashboard/index.html

# On Linux
xdg-open dashboard/index.html
```

Alternatively, you can use the included server script for testing:

```bash
python serve_dashboard.py
```

## CI/CD Integration

The project includes GitHub Actions workflows for automating fuzzing and dashboard generation:

1. **Fuzzing and Dashboard Generation Workflow** (`wuppiefuzz_fuzz_and_RESTles.yaml`): 
   - Runs the three fuzzers (WuppieFuzz, RESTler, and EvoMaster) against the VAmPI API
   - Each fuzzer runs in its own job
   - Uploads the fuzzing results as artifacts
   - After all fuzzing jobs complete, a dashboard generation job:
     - Downloads the fuzzing results artifacts
     - Extracts the artifacts to the appropriate directories
     - Processes the results using the parsers
     - Generates the dashboard
     - Packages and uploads the dashboard as an artifact

This integrated workflow ensures that whenever fuzzing is performed, the dashboard is automatically generated with the latest results, requiring no manual intervention.

## Fuzzer Integration

### WuppieFuzz

The dashboard integrates with [WuppieFuzz](https://github.com/TNO-S3/WuppieFuzz), a fuzzer for RESTful APIs. The parser extracts information from WuppieFuzz's SQLite database output.

### RESTler

[RESTler](https://github.com/microsoft/restler-fuzzer) is Microsoft's stateful REST API fuzzer. The dashboard parses RESTler's output files to extract endpoint coverage and discovered vulnerabilities.

### EvoMaster

[EvoMaster](https://github.com/EMResearch/EvoMaster) is an evolutionary-based test generation tool for REST APIs. The dashboard integrates EvoMaster's test results and coverage information.

## Configuring Fuzzer Timebudgets

By default, the fuzzers are configured with very short timebudgets (around 1 minute each) to allow for quick testing. For more thorough fuzzing, you can increase these timebudgets as described below.

### RESTler Timebudget

RESTler's timebudget is configured in the `services/restler/config/run-restler.sh` script. The timebudget is specified in hours.

1. Open the script:
   ```bash
   nano services/restler/config/run-restler.sh
   ```

2. Locate the following lines:
   ```bash
   # Line 23
   /service/config/entrypoint.sh fuzz-lean --api_spec=/workspace/openapi3.yml --dictionary=/service/config/restler-custom-dictionary.json --time_budget=0.017
   
   # Line 30
   /service/config/entrypoint.sh fuzz --api_spec=/workspace/openapi3.yml --dictionary=/service/config/restler-custom-dictionary.json --time_budget=0.017
   ```

3. Change the `--time_budget=0.017` value to your desired duration in hours. For example:
   - `--time_budget=0.5` for 30 minutes
   - `--time_budget=1` for 1 hour
   - `--time_budget=24` for 24 hours

### WuppieFuzz Timebudget

WuppieFuzz's timeout is configured in the GitHub workflow file or directly in your command when running locally.

1. For GitHub Actions, edit `.github/workflows/wuppiefuzz_fuzz_and_RESTles.yaml`:
   ```bash
   nano .github/workflows/wuppiefuzz_fuzz_and_RESTles.yaml
   ```

2. Locate the following line (around line 90):
   ```yaml
   --timeout 60
   ```

3. Change the value to your desired duration in seconds. For example:
   - `--timeout 1800` for 30 minutes
   - `--timeout 3600` for 1 hour
   - `--timeout 86400` for 24 hours

4. For local execution, modify the timeout parameter in your WuppieFuzz command:
   ```bash
   ./wuppiefuzz fuzz --timeout 3600 [other parameters]
   ```

### EvoMaster Timebudget

EvoMaster's timebudget is configured in the GitHub workflow file or directly in your command when running locally.

1. For GitHub Actions, edit `.github/workflows/wuppiefuzz_fuzz_and_RESTles.yaml`:
   ```bash
   nano .github/workflows/wuppiefuzz_fuzz_and_RESTles.yaml
   ```

2. Locate the following line (around line 40):
   ```yaml
   --maxTime 60s
   ```

3. Change the value to your desired duration. EvoMaster accepts various time formats:
   - `--maxTime 1800s` for 30 minutes
   - `--maxTime 3600s` or `--maxTime 1h` for 1 hour
   - `--maxTime 24h` for 24 hours

4. For local execution, modify the maxTime parameter in your EvoMaster command:
   ```bash
   java -jar evomaster.jar --maxTime 1h [other parameters]
   ```

## Dashboard Features

The dashboard provides:

- **Overview**: Summary of fuzzing results across all fuzzers
- **Endpoint Coverage**: Visual representation of API endpoint coverage
- **Status Code Distribution**: Analysis of HTTP status codes returned during fuzzing
- **Vulnerability Detection**: Highlighting of potential security issues
- **Detailed Response Data**: In-depth view of request and response data for each endpoint

## Running Individual Parsers

The parsers in this project are designed to be run as Python modules, not as standalone scripts. This ensures proper package imports and relative path resolution.

### Running All Parsers

To run all parsers at once (no arguments needed):

```bash
python -m parsers
```

This command will automatically process all available fuzzer results without requiring any additional arguments.

### Running a Specific Parser

To run a specific parser:

```bash
python -m parsers.wuppiefuzz_parser
python -m parsers.restler_parser
python -m parsers.evomaster_parser
```

### Common Import Errors

If you try to run a parser script directly (e.g., `python parsers/wuppiefuzz_parser.py`), you may encounter import errors like:

```
ModuleNotFoundError: No module named 'parsers'
```

This happens because the script is trying to import from the `parsers` package, but when run directly, Python doesn't recognize it as part of a package. Always use the module approach (`python -m parsers.wuppiefuzz_parser`) to avoid these issues.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache2 License - see the [LICENSE](LICENSE) file for details.

**Disclaimer:** This project is intended for educational and testing purposes only. The use of fuzzing tools should be done responsibly and ethically. #
