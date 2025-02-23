# Fuzzer Result Parsers

This directory contains parsers that extract data from fuzzer output files and convert them into a standardized JSON format.

## Parser Scripts

- `wuppiefuzz_parser.py`: Extracts data from `output-fuzzers/Wuppiefuzz/fuzzing-report.zip`
- `restler_parser.py`: Extracts data from `output-fuzzers/Restler/restler-fuzz-results.zip`
- `evomaster_parser.py`: Extracts data from `output-fuzzers/Evomaster/evomaster-results.zip`

Each parser reads the corresponding fuzzer's output files and converts them into a standardized JSON format for easy comparison and analysis.

## Generated JSON Reports

The parsers generate the following JSON files:

- `wuppiefuzz_report.json`: Contains extracted WuppieFuzz data
- `restler_report.json`: Contains extracted Restler data
- `evomaster_report.json`: Contains extracted Evomaster data

Each report follows a standardized format:

```json
{
    "metadata": {
        "duration": "...",
        "total_requests": 0,
        "unique_bugs": 0,
        "critical_issues": 0
    },
    "endpoints": [
        {
            "path": "...",
            "http_method": "...",
            "status_code": 0,
            "type": "hit/miss",
            "request_details": "...",
            "response_data": "..."
        }
    ],
    "coverage": {
        "status_distribution": {
            "hits": 0,
            "misses": 0,
            "unspecified": 0
        },
        "method_coverage": {
            "GET": {"hits": 0, "misses": 0},
            "POST": {"hits": 0, "misses": 0}
        }
    },
    "status_codes": {
        "200": 0,
        "401": 0,
        "404": 0,
        "500": 0
    },
    "kpi": {
        "total_requests": 0,
        "critical_errors": 0,
        "unique_endpoints": 0,
        "success_rate": 0.0
    }
}
```

## Usage

To extract data from fuzzer outputs:

```bash
cd parsers
python wuppiefuzz_parser.py  # Extracts data from WuppieFuzz output
python restler_parser.py     # Extracts data from Restler output
python evomaster_parser.py   # Extracts data from Evomaster output
```

Each parser will:
1. Read the corresponding fuzzer's output files from the `output-fuzzers` directory
2. Extract and process the data
3. Generate a standardized JSON report in this directory