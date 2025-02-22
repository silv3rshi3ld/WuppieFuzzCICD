# Parser Enhancement Plan for Better Issue Categorization

## Current Limitations

The standardized outputs currently lack critical information needed for proper issue categorization:

1. Response Details
   - No response bodies
   - Missing error messages and stack traces
   - No SQL error information
   - No memory corruption details

2. Server Health Metrics
   - No CPU/memory usage data
   - No server restart information
   - No connection status details

3. Sanitizer Information
   - No ASAN/UBSAN reports
   - No memory corruption flags

## Required Enhancements

### 1. Parser Modifications

Each fuzzer parser needs to be updated to capture:

#### WuppieFuzz Parser
```python
class WuppieFuzzParser:
    def parse_response(self, response):
        return {
            "status_code": response.status,
            "body": response.body,  # Add full response body
            "error_details": {
                "stack_trace": extract_stack_trace(response.body),
                "sql_errors": extract_sql_errors(response.body),
                "memory_issues": extract_memory_issues(response.body)
            },
            "server_metrics": {
                "cpu_usage": get_cpu_metrics(),
                "memory_usage": get_memory_metrics(),
                "restarts": detect_restarts()
            }
        }
```

#### RESTler Parser
```python
class RestlerParser:
    def parse_bug_bucket(self, bucket):
        return {
            "status_code": bucket.status_code,
            "response_body": bucket.response,  # Add full response
            "sanitizer_output": parse_sanitizer_output(bucket.logs),
            "server_health": extract_server_metrics(bucket.metadata)
        }
```

#### EvoMaster Parser
```python
class EvoMasterParser:
    def parse_test_result(self, result):
        return {
            "status_code": result.status,
            "response": result.body,  # Add full response
            "error_info": parse_error_info(result.logs),
            "metrics": collect_execution_metrics(result)
        }
```

### 2. Standardized Output Format Update

Update the JSON schema to include new fields:

```json
{
  "test_case": {
    "id": "string",
    "name": "string",
    "endpoint": "string",
    "method": "string",
    "type": "string",
    "request": {
      "headers": {},
      "data": {}
    },
    "response": {
      "status_code": "number",
      "headers": {},
      "body": "string",  // Full response body
      "error_details": {
        "stack_trace": "string",
        "sql_errors": ["string"],
        "memory_issues": ["string"]
      }
    },
    "server_metrics": {
      "cpu_usage": "number",
      "memory_usage": "number",
      "restarts": "number"
    },
    "sanitizer_output": {
      "asan_reports": ["string"],
      "ubsan_reports": ["string"]
    }
  }
}
```

### 3. Categorization Logic

Implement severity scoring based on enhanced data:

```python
def categorize_issue(test_case):
    severity = "Low"
    evidence = []
    
    # Critical Issues
    if test_case.response.status_code >= 500:
        if test_case.response.error_details.stack_trace:
            severity = "Critical"
            evidence.append("Stack trace found")
        if test_case.sanitizer_output.asan_reports:
            severity = "Critical"
            evidence.append("Memory corruption detected")
            
    # Suspicious Behavior
    elif test_case.response.status_code >= 400:
        if "sql error" in test_case.response.body.lower():
            severity = "High"
            evidence.append("SQL error detected")
        if test_case.server_metrics.restarts > 0:
            severity = "High"
            evidence.append("Server restart detected")
            
    return {
        "severity": severity,
        "evidence": evidence,
        "reproducible": test_case.occurrences > 1
    }
```

## Implementation Steps

1. Update Parser Classes
   - Modify each fuzzer parser to collect additional data
   - Add new parsing functions for error details
   - Implement server metric collection

2. Update Output Format
   - Extend JSON schema
   - Update chunking logic for larger responses
   - Add validation for new fields

3. Enhance Dashboard
   - Add severity visualization
   - Create detailed error views
   - Implement filtering by severity

4. Testing
   - Create test cases with various error types
   - Validate parser enhancements
   - Verify categorization logic

## Timeline

1. Parser Updates: 2-3 days
2. Output Format Changes: 1-2 days
3. Dashboard Enhancements: 2-3 days
4. Testing and Validation: 2-3 days

Total Estimated Time: 7-11 days