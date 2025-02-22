# Dashboard Migration Plan

## 1. Standardized Data Integration

### Current Structure
```
standardized-outputs/
  {fuzzer}/
    {fuzzer}/
      metadata.json         - Contains overall stats and coverage
      endpoints/           - Contains endpoint-specific data
      test_cases/
        faults/           - Contains failure cases
        success/          - Contains success cases
```

### Data Mapping
1. Metadata
   - Fuzzer name, timestamp, duration
   - Total requests and critical issues
   - Coverage information

2. Endpoints
   - Path and method information
   - Request statistics
   - Status code distribution

3. Test Cases
   - Detailed request/response pairs
   - Fault information
   - Reproduction steps

## 2. Severity Categorization

### Implementation
Add severity classification based on status codes:

```python
def classify_severity(status_code, response_data=None):
    if status_code >= 500:
        return {
            "level": "Critical",
            "description": "Server Error - Potential crash or unhandled exception",
            "class": "bg-red-100 text-red-800"
        }
    elif status_code in [401, 403]:
        return {
            "level": "Medium-High",
            "description": "Security-related client error",
            "class": "bg-orange-100 text-orange-800"
        }
    elif status_code == 400:
        return {
            "level": "Medium",
            "description": "Bad Request - Potential security implication",
            "class": "bg-yellow-100 text-yellow-800"
        }
    elif status_code >= 400:
        return {
            "level": "Low",
            "description": "Expected client error",
            "class": "bg-blue-100 text-blue-800"
        }
    elif status_code >= 300:
        return {
            "level": "Informational",
            "description": "Redirect - Check for security implications",
            "class": "bg-gray-100 text-gray-800"
        }
    else:
        return {
            "level": "Medium",
            "description": "Success - Check for unexpected behavior",
            "class": "bg-green-100 text-green-800"
        }
```

## 3. Dashboard Updates

### Main Page
1. Overview Section
   - Total requests and endpoints tested
   - Critical issues count (5xx errors)
   - Code coverage metrics

2. Severity Distribution
   - Chart showing distribution of issues by severity
   - Quick filters for different severity levels

3. Fuzzer Cards
   - Add severity indicators
   - Show critical issue count prominently

### Fuzzer-specific Pages
1. Issues Section
   - Group by severity
   - Show reproduction steps
   - Include endpoint and method info

2. Coverage Section
   - Code coverage metrics
   - Tested endpoints list

3. Details Panel
   - Request/response pairs
   - Status code with severity
   - Reproduction instructions

## 4. Implementation Steps

1. Update Data Loading
```python
def load_standardized_data(fuzzer_name):
    base_path = f"standardized-outputs/{fuzzer_name}/{fuzzer_name}"
    
    # Load metadata
    with open(f"{base_path}/metadata.json") as f:
        metadata = json.load(f)
    
    # Load endpoints
    endpoints = []
    endpoint_files = glob.glob(f"{base_path}/endpoints/endpoints_chunk_*.json")
    for file in endpoint_files:
        with open(file) as f:
            endpoints.extend(json.load(f))
            
    # Load test cases
    test_cases = {
        "faults": load_test_cases(f"{base_path}/test_cases/faults"),
        "success": load_test_cases(f"{base_path}/test_cases/success")
    }
    
    return {
        "metadata": metadata,
        "endpoints": endpoints,
        "test_cases": test_cases
    }
```

2. Generate Dashboard Data
```python
def generate_dashboard_data(fuzzer_data):
    # Calculate severity distributions
    severity_stats = defaultdict(int)
    for case in fuzzer_data["test_cases"]["faults"]:
        severity = classify_severity(case["response"]["status_code"])
        severity_stats[severity["level"]] += 1
    
    return {
        "metadata": fuzzer_data["metadata"],
        "severity_distribution": dict(severity_stats),
        "endpoints": process_endpoints(fuzzer_data["endpoints"]),
        "critical_issues": [
            case for case in fuzzer_data["test_cases"]["faults"]
            if case["response"]["status_code"] >= 500
        ]
    }
```

3. Update Templates
- Add severity classes and icons
- Include reproduction steps
- Show coverage information

## 5. Testing Plan

1. Data Loading
   - Verify all standardized files are loaded
   - Check for proper error handling

2. Severity Classification
   - Test all status code ranges
   - Verify severity assignments

3. Dashboard Generation
   - Check severity distribution calculations
   - Verify critical issue identification

4. UI/UX
   - Test severity filtering
   - Verify reproduction step display
   - Check coverage visualization

## Timeline
1. Data Integration: 1 day
2. Severity Implementation: 1 day
3. Dashboard Updates: 1-2 days
4. Testing: 1 day

Total: 4-5 days