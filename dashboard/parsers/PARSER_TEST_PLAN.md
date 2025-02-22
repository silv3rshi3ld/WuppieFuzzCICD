# Parser Testing Plan

## Overview
This plan outlines the testing strategy for verifying the parser functionality across all fuzzers, focusing on zip handling, JSON standardization, and data validation.

## Directory Structures

### WuppieFuzz
```
fuzzing-report/
├── {timestamp}/              # Dynamic timestamp directory (e.g., 2025-02-19T135350.002Z)
│   └── endpointcoverage/
│       └── index.html
└── grafana/
    └── report.db
```

Key Considerations:
- Parser must handle dynamic timestamp-based directories
- Need to locate report data in either endpointcoverage or grafana
- Validate timestamp format handling

### RESTler
```
restler-fuzz-results/
├── ResponseBuckets/
│   ├── errorBuckets.json
│   └── runSummary.json
└── RestlerResults/
    └── experiment{num}/      # Multiple experiment directories
        └── bug_buckets/
            ├── bug_buckets.json
            └── Bugs.json
```

Key Considerations:
- Handle multiple experiment directories
- Aggregate data from multiple bug bucket files
- Process both error and success cases

### EvoMaster
```
evomaster-results/
├── em_test_utils.py
├── EvoMaster_faults_Test.py
├── EvoMaster_others_Test.py
└── EvoMaster_successes_Test.py
```

Key Considerations:
- Parse Python test files for metadata
- Extract test cases from different categories
- Handle utility code separation

## Test Areas

### 1. Directory Structure Handling
Test each parser's ability to handle their specific directory structures:

#### WuppieFuzz Tests
- Verify timestamp directory detection
- Test with different timestamp formats
- Handle missing subdirectories gracefully

#### RESTler Tests
- Handle multiple experiment directories
- Aggregate data across experiments
- Process all bug bucket files

#### EvoMaster Tests
- Process all test file types
- Extract metadata from test files
- Handle missing optional files

### 2. JSON Format Standardization
Verify each parser produces the standardized JSON structure:

#### Metadata Format
```json
{
  "fuzzer": {
    "name": "string",
    "timestamp": "string",
    "duration": "string",
    "total_requests": "number",
    "critical_issues": "number"
  },
  "summary": {
    "endpoints_tested": "number",
    "success_rate": "number",
    "coverage": {
      "lines": "number",
      "functions": "number",
      "branches": "number",
      "statements": "number"
    }
  }
}
```

#### Endpoints Format
```json
{
  "path": "string",
  "method": "string",
  "statistics": {
    "total_requests": "number",
    "success_rate": "number",
    "status_codes": {
      "200": "number",
      "404": "number",
      "500": "number"
    }
  }
}
```

#### Test Cases Format
```json
{
  "id": "string",
  "name": "string",
  "endpoint": "string",
  "method": "string",
  "type": "success|fault",
  "request": {
    "headers": "object?",
    "data": "object?"
  },
  "response": {
    "status_code": "number",
    "body": "object?"
  }
}
```

### 3. Chunking Verification
Test the chunking functionality:

1. Metadata Files
   - Single metadata.json per fuzzer
   - Proper location in fuzzer output directory

2. Endpoint Chunks
   - Maximum 50 endpoints per file
   - Proper sequential naming (chunk_0.json, chunk_1.json, etc.)
   - Complete data across chunks

3. Test Case Chunks
   - Separate success/fault directories
   - Maximum 100 test cases per file
   - Proper data distribution

### 4. Error Handling

Test error scenarios:

1. Directory Structure Issues
   - Invalid timestamp format (WuppieFuzz)
   - Missing experiment directories (RESTler)
   - Incomplete test files (EvoMaster)

2. Data Validation
   - Missing required fields
   - Invalid data types
   - Malformed JSON

3. Resource Management
   - Large file handling
   - Temporary directory cleanup
   - Memory usage during processing

## Test Procedure

1. Setup Test Environment
   ```bash
   # Test directories already exist with extracted contents:
   output-fuzzers/
   ├── Wuppiefuzz/fuzzing-report/
   ├── Restler/restler-fuzz-results/
   └── Evomaster/evomaster-results/
   ```

2. Run Parser Tests
   ```bash
   # Process all fuzzer outputs
   python dashboard/parsers/generate_json_outputs.py
   ```

3. Verify Outputs
   - Check standardized-outputs/ directory structure
   - Validate JSON formats
   - Verify chunking behavior
   - Check error logs

## Success Criteria

1. Directory Handling
   - WuppieFuzz correctly handles timestamp directories
   - RESTler processes all experiment directories
   - EvoMaster parses all test file types

2. JSON Format
   - All outputs follow standardized schema
   - No validation errors in output files
   - Complete data transformation

3. Chunking
   - Proper file size management
   - Correct chunk distribution
   - No data loss across chunks

4. Error Handling
   - Clear error messages for all failure cases
   - Graceful handling of invalid inputs
   - Proper cleanup on errors

## Test Data Requirements

1. Sample Directories
   - WuppieFuzz with various timestamp formats
   - RESTler with multiple experiments
   - EvoMaster with different test categories

2. Large Datasets
   - 100+ endpoints
   - 1000+ test cases
   - Various response types

3. Edge Cases
   - Missing optional fields
   - Maximum/minimum values
   - Special characters in paths/names

## Reporting

Test results should include:

1. Processing Status
   - Success/failure for each fuzzer
   - Error messages if any
   - Processing time

2. Output Validation
   - JSON schema validation results
   - Chunk distribution statistics
   - Data completeness checks

3. Resource Usage
   - Memory consumption
   - Disk space usage
   - Processing time per fuzzer

## Implementation Notes

### WuppieFuzz Parser Updates Needed
- Add timestamp directory detection
- Handle dynamic subdirectory structure
- Update path resolution logic

### RESTler Parser Updates Needed
- Add multi-experiment support
- Implement data aggregation
- Handle varied bug bucket formats

### EvoMaster Parser Updates Needed
- Enhance test file parsing
- Add metadata extraction
- Implement test categorization