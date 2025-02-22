# Parser Enhancement Plan - JSON Generation

## Data Analysis

### Common Patterns Across Fuzzers
1. All fuzzers track:
   - Total requests
   - Critical issues
   - Duration/timing information
   - Endpoint-specific statistics
   - Status code distributions
   - Test case results

2. Format Differences:
   - WuppieFuzz: Structured JSON with detailed endpoint stats
   - RESTler: Similar JSON structure with focus on API testing
   - EvoMaster: Python test files with embedded metadata

## Standardized JSON Structure

### 1. Core JSON Format

```json
{
  "metadata": {
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
  },
  "endpoints": [
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
          // etc
        }
      }
    }
  ],
  "test_cases": [
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
      },
      "assertions": [
        {
          "type": "string",
          "expected": "any",
          "actual": "any",
          "passed": "boolean"
        }
      ]
    }
  ]
}
```

### 2. Chunking Strategy

```
output/
├── {fuzzer_name}/
│   ├── metadata.json              # Core fuzzer metadata
│   ├── endpoints/
│   │   ├── chunk_0.json          # 50 endpoints per file
│   │   └── chunk_n.json
│   └── test_cases/
       ├── success/
       │   ├── chunk_0.json       # 100 test cases per file
       │   └── chunk_n.json
       └── faults/
           ├── chunk_0.json
           └── chunk_n.json
```

## Parser Implementation Steps

### 1. WuppieFuzz Parser
- Input: report.json
- Process:
  1. Extract metadata and coverage info
  2. Transform endpoint statistics
  3. Convert test cases to standard format
  4. Generate chunked output files

### 2. RESTler Parser
- Input: testing_summary.json
- Process:
  1. Parse summary data for metadata
  2. Extract endpoint information
  3. Transform test cases
  4. Generate chunked files

### 3. EvoMaster Parser
- Input: EvoMaster_*_Test.py files
- Process:
  1. Parse test file comments for metadata
  2. Extract test cases and assertions
  3. Separate successes and faults
  4. Generate standardized JSON output

## Implementation Plan

### Phase 1: Base Infrastructure (Week 1)
1. Create base chunking utility
   - File size monitoring
   - JSON chunk writer
   - Directory structure creation

2. Implement common utilities
   - JSON validators
   - Data transformers
   - File handlers

### Phase 2: Parser Implementation (Week 2-3)
1. WuppieFuzz Parser (3 days)
   - Implement core parser
   - Add chunking support
   - Test with sample data

2. RESTler Parser (3 days)
   - Implement core parser
   - Add chunking support
   - Test with sample data

3. EvoMaster Parser (4 days)
   - Implement test file parser
   - Extract metadata from comments
   - Add chunking support
   - Test with sample data

### Phase 3: Testing & Validation (Week 4)
1. Unit Tests
   - Test each parser individually
   - Validate output format
   - Check chunking behavior

2. Integration Tests
   - Test all parsers together
   - Verify consistent output
   - Check file structure

3. Performance Testing
   - Test with large datasets
   - Monitor memory usage
   - Verify chunking efficiency

## Success Criteria

1. Data Completeness
   - All important information extracted
   - No data loss during conversion
   - Consistent format across fuzzers

2. File Management
   - Proper chunking of large datasets
   - Organized directory structure
   - Efficient file handling

3. Data Validation
   - Valid JSON output
   - Correct data types
   - Required fields present

4. Performance
   - Efficient memory usage
   - Reasonable processing time
   - Proper handling of large files

## Next Steps

1. Review and approve JSON structure
2. Implement base chunking utility
3. Start with WuppieFuzz parser
4. Create validation tools