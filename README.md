# Fuzzing Dashboard Generator

This project generates a comprehensive dashboard for visualizing and analyzing API fuzzing results from multiple fuzzers: **WuppieFuzz**, **RESTler**, and **EvoMaster**. The dashboard provides insights into API endpoint coverage, status codes, and potential vulnerabilities discovered during fuzzing.

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the Dashboard Generator](#running-the-dashboard-generator)
  - [Viewing the Dashboard](#viewing-the-dashboard)
- [CI/CD Integration](#cicd-integration)
- [Fuzzer Integration](#fuzzer-integration)
  - [WuppieFuzz](#wuppiefuzz)
  - [RESTler](#restler)
  - [EvoMaster](#evomaster)
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
  - `wuppiefuzz_fuzz_and_RESTles.yaml`: Workflow for running the fuzzers
  - `dashboard-generation.yml`: Workflow for generating the dashboard
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
   git clone https://github.com/yourusername/fuzzing-dashboard.git
   cd fuzzing-dashboard
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Dashboard Generator

The dashboard generation process involves two main steps:

1. **Parse the fuzzing results**: This step processes the raw fuzzing output files and converts them into a structured format that the dashboard can use.
2. **Generate the dashboard**: This step creates the HTML, CSS, and JavaScript files for the dashboard based on the parsed data.

#### Step 1: Run the Parsers

First, ensure you have fuzzing results in the appropriate directories:
- WuppieFuzz results: `output-fuzzers/Wuppiefuzz/fuzzing-report.zip`
- RESTler results: `output-fuzzers/Restler/restler-fuzz-results.zip`
- EvoMaster results: `output-fuzzers/Evomaster/evomaster-results.zip`

Then run the parsers to process the fuzzing results:

```bash
# Run all parsers at once (this will process all available fuzzer results)
python -m parsers

# Or run individual parsers if needed
python -m parsers.wuppiefuzz_parser
python -m parsers.restler_parser
python -m parsers.evomaster_parser
```

This will parse the fuzzing results and generate processed data files in the `dashboard/data/` directory.

#### Step 2: Generate the Dashboard

After parsing the fuzzing results, generate the dashboard:

```bash
python generate_dashboard.py
```

This script:
1. Reads the processed data from `dashboard/data/`
2. Generates summary statistics
3. Creates individual pages for each fuzzer
4. Updates the main dashboard index.html

### Viewing the Dashboard

To view the dashboard locally, you can use the included server script:

```bash
python serve_dashboard.py
```

This will start a local web server and open the dashboard in your default browser.

Alternatively, you can open the `dashboard/index.html` file directly in your browser.

## CI/CD Integration

The project includes GitHub Actions workflows for automating fuzzing and dashboard generation:

1. **Fuzzing Workflow** (`wuppiefuzz_fuzz_and_RESTles.yaml`): 
   - Runs the three fuzzers (WuppieFuzz, RESTler, and EvoMaster) against the VAmPI API
   - Each fuzzer runs in its own job
   - Uploads the fuzzing results as artifacts

2. **Dashboard Generation** (`dashboard-generation.yml`):
   - Triggered after the fuzzing workflow completes
   - Downloads the fuzzing results artifacts
   - Processes the results using the parsers
   - Generates the dashboard
   - Packages and uploads the dashboard as an artifact

## Fuzzer Integration

### WuppieFuzz

The dashboard integrates with [WuppieFuzz](https://github.com/TNO-S3/WuppieFuzz), a fuzzer for RESTful APIs. The parser extracts information from WuppieFuzz's SQLite database output.

### RESTler

[RESTler](https://github.com/microsoft/restler-fuzzer) is Microsoft's stateful REST API fuzzer. The dashboard parses RESTler's output files to extract endpoint coverage and discovered vulnerabilities.

### EvoMaster

[EvoMaster](https://github.com/EMResearch/EvoMaster) is an evolutionary-based test generation tool for REST APIs. The dashboard integrates EvoMaster's test results and coverage information.

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

To run all parsers at once:

```bash
python -m parsers
```

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Disclaimer:** This project is intended for educational and testing purposes only. The use of fuzzing tools should be done responsibly and ethically.
