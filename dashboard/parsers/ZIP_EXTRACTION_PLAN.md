# Fuzzing Results Data Extraction Plan

## Required Dashboard Data
- Total requests
- Critical issues
- Unique endpoints
- Success rate
- Method coverage (GET, POST, PUT, DELETE)
- Status codes (2xx, 4xx, 5xx)
- Hits/misses statistics
- Per-endpoint statistics

## Data Sources per Fuzzer

### WuppieFuzz
- Source: `fuzzing-report.zip`
- Key Data:
  * `*/grafana/report.db` - SQLite database containing:
    - Request counts and methods
    - Response status codes
    - Endpoint coverage
    - Error data and stack traces
    - Timestamps and durations

### Restler
- Source: `restler-fuzz-results.zip`
- Key Data:
  * `RestlerResults/*/logs/testing_summary.json`:
    - Total requests sent
    - Coverage statistics
    - Bug counts
  * `RestlerResults/*/bug_buckets/*.json`:
    - Error details
    - Stack traces
    - Request/response data
  * `ResponseBuckets/errorBuckets.json`:
    - Aggregated error statistics
    - Status code distributions

### Evomaster
- Source: `evomaster-results.zip`
- Key Data:
  * Generated test results containing:
    - Request statistics
    - Response codes
    - Coverage data
    - Error information

## Unified Data Format
All fuzzer data should be transformed into this common structure:
```json
{
  "metadata": {
    "fuzzer": "fuzzer_name",
    "timestamp": "ISO timestamp",
    "duration": "HH:MM:SS"
  },
  "stats": {
    "total_requests": number,
    "critical_issues": number,
    "unique_endpoints": number,
    "methodCoverage": {
      "GET": number,
      "POST": number,
      "PUT": number,
      "DELETE": number
    },
    "statusDistribution": {
      "hits": number,
      "misses": number,
      "unspecified": number
    },
    "statusCodes": [
      {
        "status": "200",
        "count": number
      }
    ]
  },
  "endpoints": [
    {
      "path": string,
      "method": string,
      "total_requests": number,
      "success_requests": number,
      "status_codes": {
        "200": number,
        "404": number,
        "500": number
      },
      "responses": {
        "200": "example response",
        "500": "error response"
      },
      "severity_counts": {
        "critical": number,
        "high": number,
        "medium": number,
        "low": number
      }
    }
  ]
}
```

## Implementation Steps

### 1. Extract Data
- WuppieFuzz: Query SQLite database for request/response data
- Restler: Parse JSON files for testing results and bugs
- Evomaster: Extract test execution results

### 2. Transform Data
- Convert each fuzzer's data into the unified format
- Calculate required statistics:
  * Success rates
  * Method coverage
  * Status distributions
  * Error severities

### 3. Generate Dashboard
- Combine data from all fuzzers
- Calculate overall statistics
- Generate summary data
- Create visualization data

### 4. Error Handling
- Handle missing data gracefully
- Provide clear error messages
- Fall back to partial data if some metrics unavailable

## Success Criteria
1. All required metrics present in dashboard
2. Data from all fuzzers properly aggregated
3. Accurate statistics calculation
4. Proper error handling
5. Clear data visualization