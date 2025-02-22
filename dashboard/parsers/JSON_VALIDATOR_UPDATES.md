# JSON Validator Updates

## Current Issues
- Validating fields that don't exist in actual fuzzer outputs
- Not aligned with our new standardized types
- Some validation rules are too strict

## Required Changes

### 1. Metadata Validation
```python
# Current required fields
required_fuzzer_fields = {
    'name': str,
    'timestamp': str,
    'duration': str,
    'total_requests': int,
    'critical_issues': int
}

# Should be updated to match actual data
required_fuzzer_fields = {
    'name': str,
    'timestamp': str,  # Keep - we have this from all fuzzers
    'total_requests': int,  # Keep - we can calculate this
    'success_count': int,  # Add - we can calculate this
    'failure_count': int   # Add - we can calculate this
}
```

### 2. Endpoint Validation
```python
# Current required fields
required_fields = {
    'path': str,
    'method': str,
    'statistics': dict
}

# Should be updated to
required_fields = {
    'path': str,
    'method': str,
    'statistics': {
        'total_requests': int,
        'success_rate': float,
        'status_codes': Dict[str, int]  # Map of status code to count
    }
}
```

### 3. Test Case Validation
```python
# Current required fields
required_fields = {
    'id': str,
    'name': str,
    'endpoint': str,
    'method': str,
    'type': str,
    'request': dict,
    'response': dict
}

# Should be updated to match actual data
required_fields = {
    'id': str,
    'name': str,
    'endpoint': str,
    'method': str,
    'type': str,  # Only 'success' or 'fault'
    'request': {
        'headers': Dict[str, str],  # Optional
        'body': Optional[str]       # Optional
    },
    'response': {
        'status_code': int,
        'headers': Dict[str, str],  # Optional
        'body': Optional[str],      # Optional
        'error_type': Optional[str] # Basic categorization
    }
}
```

### 4. Implementation Changes

1. Update ValidationError class:
```python
@dataclass
class ValidationError:
    path: str
    message: str
    value: Any = None
    severity: str = 'error'  # Add severity levels
```

2. Add type validation helper:
```python
def _validate_type(value: Any, expected_type: Union[Type, Tuple[Type, ...]], path: str) -> Optional[ValidationError]:
    """Validate value type with better error messages."""
    if not isinstance(value, expected_type):
        type_name = expected_type.__name__ if isinstance(expected_type, type) else str(expected_type)
        return ValidationError(
            path=path,
            message=f'Invalid type: expected {type_name}, got {type(value).__name__}',
            value=value
        )
    return None
```

3. Add dictionary validation helper:
```python
def _validate_dict_fields(
    data: Dict[str, Any],
    required_fields: Dict[str, Type],
    optional_fields: Dict[str, Type],
    path: str
) -> List[ValidationError]:
    """Validate dictionary fields with support for optional fields."""
    errors = []
    
    # Check required fields
    for field, field_type in required_fields.items():
        if field not in data:
            errors.append(ValidationError(
                path=f'{path}.{field}',
                message=f'Missing required field: {field}'
            ))
        elif error := _validate_type(data[field], field_type, f'{path}.{field}'):
            errors.append(error)
            
    # Check optional fields if present
    for field, field_type in optional_fields.items():
        if field in data and (error := _validate_type(data[field], field_type, f'{path}.{field}')):
            errors.append(error)
            
    return errors
```

## Migration Plan

1. Update JsonValidator class
   - Implement new validation rules
   - Add helper methods
   - Update error messages

2. Update Tests
   - Add test cases for new validation rules
   - Remove tests for removed fields
   - Add tests for optional fields

3. Update Documentation
   - Document new validation rules
   - Update examples
   - Add migration guide

4. Integration
   - Test with all parser implementations
   - Verify no data loss
   - Check error handling