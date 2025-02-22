# Parser Improvement Plan

## Current State Analysis

### Available Data from Fuzzers

#### Restler
- Basic request/response info
- Status codes and counts
- Bug buckets with error types
- Basic timing info (start time, duration)
- Endpoint statistics

#### EvoMaster
- Generated test files with request/response info
- Status codes
- Basic timing info
- Test assertions and results
- Endpoint information

#### WuppieFuzz
- HTML coverage data
- Status codes and counts
- Basic endpoint statistics
- Timestamp information
- Success/failure metrics

### Common Data Points
1. Request Information
   - HTTP method
   - Endpoint path
   - Headers (where available)
   - Request body/data

2. Response Information
   - Status codes
   - Response headers
   - Response body
   - Error indicators

3. Metadata
   - Timestamps
   - Duration (where available)
   - Success/failure counts
   - Endpoint coverage

## Implementation Plan

### Phase 1: Core Infrastructure

1. Standardized Data Classes
```python
@dataclass
class StandardizedRequest:
    """Common request format across all parsers"""
    method: str
    path: str
    headers: Dict[str, str] = field(default_factory=dict)
    body: Optional[str] = None

@dataclass
class StandardizedResponse:
    """Common response format across all parsers"""
    status_code: int
    headers: Dict[str, str] = field(default_factory=dict)
    body: Optional[str] = None
    error_type: Optional[str] = None  # Basic error categorization

@dataclass
class TestMetadata:
    """Common test metadata across all parsers"""
    timestamp: datetime
    duration: Optional[str] = None
    success_count: int = 0
    failure_count: int = 0
    total_requests: int = 0
```

2. Base Parser Implementation
```python
class BaseParser(ABC):
    """Abstract base class for all fuzzer parsers"""
    
    def __init__(self, input_path: str, output_dir: str):
        self.input_path = input_path
        self.output_dir = output_dir
        self.chunker = JsonChunker(output_dir)
        self.validator = JsonValidator()
        self.logger = self._setup_logger()
        
    @abstractmethod
    def _load_raw_data(self) -> Dict[str, Any]:
        """Load raw data from fuzzer output"""
        pass
        
    @abstractmethod
    def _transform_metadata(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Transform fuzzer metadata to standard format"""
        pass
        
    @abstractmethod
    def _transform_endpoints(self, raw_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Transform endpoint data to standard format"""
        pass
```

### Phase 2: Parser-Specific Implementations

1. Restler Parser
```python
class RestlerParser(BaseParser):
    """Enhanced Restler parser"""
    
    def _load_raw_data(self) -> Dict[str, Any]:
        return {
            'bug_buckets': self._load_bug_buckets(),
            'response_data': self._load_response_data()
        }
        
    def _transform_test_case(self, bug_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'request': StandardizedRequest(
                method=self._extract_method(bug_data),
                path=bug_data.get('endpoint', ''),
                headers=bug_data.get('request_headers', {}),
                body=self._extract_request_body(bug_data)
            ),
            'response': StandardizedResponse(
                status_code=self._extract_status_code(bug_data),
                headers=bug_data.get('response_headers', {}),
                body=self._extract_response_body(bug_data),
                error_type=bug_data.get('bug_type')
            )
        }
```

2. EvoMaster Parser
```python
class EvoMasterParser(BaseParser):
    """Enhanced EvoMaster parser"""
    
    def _load_raw_data(self) -> Dict[str, Any]:
        return {
            'test_files': self._load_test_files(),
            'assertions': self._load_test_assertions()
        }
        
    def _transform_test_case(self, test_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'request': StandardizedRequest(
                method=test_data.get('method', 'GET'),
                path=test_data.get('endpoint', ''),
                headers=test_data.get('request_data', {}).get('headers', {}),
                body=self._extract_request_body(test_data)
            ),
            'response': StandardizedResponse(
                status_code=test_data.get('status_code', 0),
                headers=test_data.get('response_data', {}).get('headers', {}),
                body=self._extract_response_body(test_data),
                error_type='fault' if test_data.get('type') == 'fault' else None
            )
        }
```

3. WuppieFuzz Parser
```python
class WuppieFuzzParser(BaseParser):
    """Enhanced WuppieFuzz parser"""
    
    def _load_raw_data(self) -> Dict[str, Any]:
        return {
            'coverage': self._parse_html_coverage(),
            'endpoints': self._extract_endpoints()
        }
        
    def _transform_test_case(self, endpoint_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'request': StandardizedRequest(
                method=endpoint_data.get('method', 'GET'),
                path=endpoint_data.get('path', ''),
                headers={},  # Not available in HTML output
                body=None   # Not available in HTML output
            ),
            'response': StandardizedResponse(
                status_code=self._extract_status_code(endpoint_data),
                headers={},  # Not available in HTML output
                body=None,   # Not available in HTML output
                error_type='fault' if self._is_error_status(endpoint_data) else None
            )
        }
```

### Phase 3: Validation and Testing

1. Schema Validation
```python
class SchemaValidator:
    """Validates standardized output format"""
    
    def validate_request(self, request: StandardizedRequest) -> List[str]:
        """Validate request data"""
        errors = []
        if not request.method:
            errors.append("Missing HTTP method")
        if not request.path:
            errors.append("Missing endpoint path")
        return errors
        
    def validate_response(self, response: StandardizedResponse) -> List[str]:
        """Validate response data"""
        errors = []
        if response.status_code <= 0:
            errors.append("Invalid status code")
        return errors
```

2. Test Cases
```python
class ParserTestSuite:
    """Test suite for parser validation"""
    
    def test_request_parsing(self):
        """Test request data extraction"""
        pass
        
    def test_response_parsing(self):
        """Test response data extraction"""
        pass
        
    def test_metadata_extraction(self):
        """Test metadata handling"""
        pass
```

## Implementation Steps

1. Core Infrastructure (3 days)
   - Implement standardized data classes
   - Create base parser class
   - Set up validation framework

2. Parser Updates (6 days)
   - Restler parser enhancements (2 days)
   - EvoMaster parser updates (2 days)
   - WuppieFuzz parser improvements (2 days)

3. Testing (3 days)
   - Unit tests for each parser
   - Integration tests
   - Format validation

4. Documentation (1 day)
   - Update parser documentation
   - Add usage examples
   - Document limitations

Total Timeline: 13 days

## Success Criteria

1. Data Quality
   - All available data is correctly extracted
   - No data loss during parsing
   - Consistent output format

2. Validation
   - All parsers pass schema validation
   - Test coverage > 90%
   - No critical parsing errors

3. Performance
   - Parser execution time within acceptable limits
   - Memory usage optimized
   - Efficient file handling

## Migration Strategy

1. Development
   - Implement new parsers alongside existing ones
   - Add comprehensive tests
   - Document all changes

2. Testing
   - Run parsers in parallel
   - Compare outputs
   - Validate all data points

3. Deployment
   - Gradual rollout
   - Monitor for issues
   - Maintain backward compatibility

4. Verification
   - Validate all parser outputs
   - Check data consistency
   - Verify format compliance