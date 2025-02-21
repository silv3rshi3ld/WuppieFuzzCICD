# WuppieFuzz Parser Implementation Plan

## Current Issues
- Code coverage data is not being extracted from endpointcoverage/index.html
- Crashes and issues data is not being extracted from report.db
- This data is not being included in the dashboard

## Implementation Steps

### 1. Create New Parser Structure
Create a new WuppieFuzz parser package in `dashboard/parsers/wuppiefuzz/` with:
- `__init__.py`
- `parser.py` - Main parser logic
- `coverage_parser.py` - Specific to parsing coverage data
- `db_parser.py` - Specific to parsing SQLite data
- `test_parser.py` - Unit tests

### 2. Implement Coverage Parser
In `coverage_parser.py`:
```python
def parse_coverage_data(index_path):
    """Parse coverage data from index.html file."""
    # Parse HTML file
    # Extract coverage metrics:
    # - Lines covered/total
    # - Functions covered/total
    # - Branches covered/total
    # - Statements covered/total
    return {
        'lines': {'covered': X, 'total': Y},
        'functions': {'covered': X, 'total': Y},
        'branches': {'covered': X, 'total': Y},
        'statements': {'covered': X, 'total': Y}
    }
```

### 3. Implement DB Parser
In `db_parser.py`:
```python
def parse_crashes_and_issues(db_path):
    """Parse crashes and issues from SQLite database."""
    # Connect to SQLite DB
    # Extract:
    # - Crashes with stack traces
    # - Issues found
    # - Severity levels
    return {
        'crashes': [...],
        'issues': [...]
    }
```

### 4. Update Main Parser
Update parser to combine all data sources:
```python
def parse_wuppiefuzz_results(input_path):
    """Parse all WuppieFuzz results."""
    # Get coverage data
    coverage_path = os.path.join(input_path, 'endpointcoverage', 'index.html')
    coverage_data = parse_coverage_data(coverage_path)
    
    # Get crashes/issues
    db_path = os.path.join(input_path, 'grafana', 'report.db')
    crashes_data = parse_crashes_and_issues(db_path)
    
    # Combine into dashboard format
    dashboard_data = {
        'metadata': {...},
        'stats': {...},
        'coverage': coverage_data,
        'crashes': crashes_data['crashes'],
        'issues': crashes_data['issues'],
        'endpoints': [...]
    }
    
    return report, dashboard_data
```

### 5. Update Dashboard Generation
Modify `generate_dashboards.py` to:
- Handle the new coverage data format
- Include crashes and issues in summary statistics
- Update templates to display the new data

### 6. Testing Plan
1. Create test data fixtures:
   - Sample coverage HTML
   - Sample SQLite DB
   - Sample endpoint data
2. Write unit tests for each parser component
3. Write integration tests for combined parser
4. Test dashboard generation with complete dataset

### 7. Implementation Order
1. Create basic parser structure
2. Implement coverage parsing
3. Implement DB parsing
4. Update main parser
5. Write tests
6. Update dashboard generation
7. Manual testing and validation

## Next Steps
1. Create the new parser package structure
2. Begin with coverage parser implementation as it's critical for dashboard display
3. Follow with DB parser for crashes/issues
4. Integrate into main dashboard generation