# Technical Specification

## Base Parser Implementation

The base parser will provide core functionality for:
1. Standardized data structures
2. Common parsing utilities
3. Data transformation methods

### Class Structure

```python
class BaseParser:
    def __init__(self):
        self.data = {
            "crashes": {
                "total": 0,
                "unique": 0,
                "by_severity": {
                    "critical": 0,
                    "high": 0,
                    "medium": 0,
                    "low": 0
                },
                "details": []
            },
            "coverage": {
                "current": {
                    "lines": {"covered": 0, "total": 0, "percentage": 0},
                    "functions": {"covered": 0, "total": 0, "percentage": 0},
                    "branches": {"covered": 0, "total": 0, "percentage": 0}
                },
                "history": []
            },
            "stats": {
                "execution_speed": 0,
                "total_test_cases": 0,
                "duration": "00:00:00",
                "status": "completed",
                "resource_usage": {
                    "cpu_percent": 0,
                    "memory_mb": 0
                }
            }
        }

    def classify_crash_severity(self, crash_data):
        """
        Classify crash severity based on:
        - Crash type (buffer overflow, null pointer, etc.)
        - Location (critical modules vs non-critical)
        - Impact (crash vs hang)
        - Reproducibility
        """
        pass

    def parse_stack_trace(self, trace_data):
        """
        Parse stack trace to extract:
        - Function names
        - File locations
        - Line numbers
        - Module information
        """
        pass

    def calculate_coverage(self, coverage_data):
        """
        Calculate coverage metrics:
        - Line coverage
        - Function coverage
        - Branch coverage
        - Coverage progression
        """
        pass

    def process_crash(self, crash_data):
        """
        Process crash information:
        - Deduplicate crashes
        - Extract stack traces
        - Classify severity
        - Parse sanitizer output
        """
        pass
```

### Fuzzer-Specific Implementations

#### WuppieFuzz Parser
```python
class WuppieFuzzParser(BaseParser):
    def parse_zip(self, zip_path):
        """
        1. Extract SQLite database
        2. Parse coverage information
        3. Process crash reports
        4. Calculate execution metrics
        """
        pass

    def parse_sqlite_db(self, db_path):
        """
        1. Extract crash information
        2. Parse coverage data
        3. Calculate statistics
        """
        pass
```

#### Restler Parser
```python
class RestlerParser(BaseParser):
    def parse_zip(self, zip_path):
        """
        1. Process bug buckets
        2. Extract coverage from logs
        3. Parse testing summary
        4. Calculate metrics
        """
        pass

    def parse_bug_buckets(self, bucket_dir):
        """
        1. Process each bug file
        2. Extract request/response
        3. Classify severity
        """
        pass
```

#### Evomaster Parser
```python
class EvomasterParser(BaseParser):
    def parse_zip(self, zip_path):
        """
        1. Process test files
        2. Extract coverage data
        3. Parse execution metrics
        4. Calculate statistics
        """
        pass

    def parse_test_file(self, test_file):
        """
        1. Extract test cases
        2. Process coverage info
        3. Parse execution data
        """
        pass
```

## Data Processing Pipeline

1. Extract Data
   ```python
   def extract_zip(zip_path):
       """Extract zip contents to temp directory"""
       pass
   ```

2. Parse Contents
   ```python
   def parse_contents(temp_dir):
       """Parse extracted files based on fuzzer type"""
       pass
   ```

3. Transform Data
   ```python
   def transform_data(raw_data):
       """Transform to standardized format"""
       pass
   ```

4. Generate Dashboard Data
   ```python
   def generate_dashboard_data(transformed_data):
       """Generate final dashboard JSON"""
       pass
   ```

## Dashboard Data Structure

```json
{
    "fuzzer_name": {
        "crashes": {
            "total": 0,
            "unique": 0,
            "by_severity": {},
            "details": []
        },
        "coverage": {
            "current": {},
            "history": []
        },
        "stats": {
            "execution_speed": 0,
            "total_test_cases": 0,
            "duration": "00:00:00",
            "status": "completed",
            "resource_usage": {}
        }
    }
}
```

## Implementation Notes

1. Data Chunking
   - Split large datasets into manageable chunks
   - Implement pagination for UI components
   - Cache processed data when possible

2. Error Handling
   - Validate data at each processing step
   - Provide meaningful error messages
   - Implement fallback values

3. Performance Optimization
   - Use generators for large datasets
   - Implement caching where appropriate
   - Optimize file I/O operations

4. Testing Strategy
   - Unit tests for each parser class
   - Integration tests for data pipeline
   - End-to-end tests for dashboard generation