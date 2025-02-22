# Plan for Using Standardized Outputs in Dashboard

## Current System
The dashboard currently processes raw fuzzer outputs directly:
- Handles ZIP files and directories
- Uses fuzzer-specific parsers
- Generates dashboard data during processing

## Standardized Output System
The new standardized outputs provide:
- Consistent JSON format across all fuzzers
- Pre-processed and validated data
- Organized structure (metadata, endpoints, test cases)

## Implementation Plan

### 1. Create Standardized Data Loader
Create a new class `StandardizedDataLoader` that will:
- Read from standardized-outputs/ directory
- Handle the consistent JSON structure
- Load and validate standardized data
- Replace fuzzer-specific parsers

### 2. Modify Dashboard Generation
Update generate_dashboards.py to:
- Remove ZIP handling logic
- Use StandardizedDataLoader instead of fuzzer parsers
- Keep existing dashboard generation logic
- Simplify the main processing loop

### 3. Data Flow
1. Input: standardized-outputs/{fuzzer}/{fuzzer}/
   - metadata.json
     ```json
     {
       "fuzzer": {
         "name": "FuzzerName",
         "timestamp": "ISO-8601",
         "duration": "duration",
         "total_requests": number,
         "critical_issues": number
       },
       "summary": {
         "endpoints_tested": number,
         "success_rate": number,
         "coverage": {
           "lines": number,
           "functions": number,
           "branches": number,
           "statements": number
         }
       }
     }
     ```
   - endpoints/endpoints_chunk_*.json
     ```json
     [
       {
         "path": "/api/path",
         "method": "HTTP_METHOD",
         "statistics": {
           "total_requests": number,
           "success_rate": number,
           "status_codes": {
             "200": number,
             "404": number,
             etc.
           }
         }
       }
     ]
     ```

2. Processing:
   - Load metadata.json directly into dashboard data structure
   - Load and combine all endpoint chunks
   - Calculate additional statistics:
     - Method coverage (GET, POST, etc.)
     - Overall status code distribution
     - Success/failure rates
   - Generate dashboard data structure

3. Output:
   - Chunked dashboard data
   - Fuzzer-specific pages
   - Summary data
   - Index page

### 4. Benefits
- Simplified setup process
- Consistent data handling
- Reduced error potential
- Easier maintenance
- Better separation of concerns

### Next Steps
1. Implement StandardizedDataLoader
2. Update generate_dashboards.py
3. Test with sample standardized outputs
4. Update documentation