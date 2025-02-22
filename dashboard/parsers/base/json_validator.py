"""JSON schema validation for fuzzer output data."""

from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Type, Union, Tuple

@dataclass
class ValidationError:
    """Represents a validation error.
    
    Args:
        path: Path to the field with error
        message: Error message
        value: Optional value that caused the error
        severity: Error severity level
    """
    path: str
    message: str
    value: Any = None
    severity: str = 'error'

class JsonValidator:
    """Validates JSON data against expected schemas."""
    
    def _validate_type(
        self,
        value: Any,
        expected_type: Union[Type, Tuple[Type, ...]],
        path: str
    ) -> Optional[ValidationError]:
        """Validate value type with better error messages.
        
        Args:
            value: Value to validate
            expected_type: Expected type or tuple of types
            path: Field path for error reporting
            
        Returns:
            ValidationError if validation fails, None otherwise
        """
        if not isinstance(value, expected_type):
            type_name = expected_type.__name__ if isinstance(expected_type, type) else str(expected_type)
            return ValidationError(
                path=path,
                message=f'Invalid type: expected {type_name}, got {type(value).__name__}',
                value=value
            )
        return None

    def _validate_dict_fields(
        self,
        data: Dict[str, Any],
        required_fields: Dict[str, Type],
        optional_fields: Dict[str, Type],
        path: str
    ) -> List[ValidationError]:
        """Validate dictionary fields with support for optional fields.
        
        Args:
            data: Dictionary to validate
            required_fields: Required field names and types
            optional_fields: Optional field names and types
            path: Base path for error reporting
            
        Returns:
            List of validation errors
        """
        errors = []
        
        # Check required fields
        for field, field_type in required_fields.items():
            if field not in data:
                errors.append(ValidationError(
                    path=f'{path}.{field}',
                    message=f'Missing required field: {field}'
                ))
            elif error := self._validate_type(data[field], field_type, f'{path}.{field}'):
                errors.append(error)
                
        # Check optional fields if present
        for field, field_type in optional_fields.items():
            if field in data and (error := self._validate_type(data[field], field_type, f'{path}.{field}')):
                errors.append(error)
                
        return errors

    def validate_metadata(self, data: Dict[str, Any]) -> List[ValidationError]:
        """Validate metadata structure.
        
        Args:
            data: Metadata dictionary to validate
            
        Returns:
            List of validation errors (empty if valid)
        """
        errors = []
        
        # Check fuzzer section
        if 'fuzzer' not in data:
            errors.append(ValidationError('metadata.fuzzer', 'Missing fuzzer section'))
        else:
            fuzzer = data['fuzzer']
            required_fuzzer_fields = {
                'name': str,
                'timestamp': str,
                'total_requests': int,
                'success_count': int,
                'failure_count': int
            }
            errors.extend(self._validate_dict_fields(
                fuzzer,
                required_fuzzer_fields,
                {},  # No optional fields
                'metadata.fuzzer'
            ))
        
        # Check summary section
        if 'summary' not in data:
            errors.append(ValidationError('metadata.summary', 'Missing summary section'))
        else:
            summary = data['summary']
            required_summary_fields = {
                'endpoints_tested': int,
                'success_rate': (int, float)
            }
            optional_summary_fields = {
                'coverage': dict  # Some fuzzers might not provide coverage
            }
            errors.extend(self._validate_dict_fields(
                summary,
                required_summary_fields,
                optional_summary_fields,
                'metadata.summary'
            ))
            
        return errors

    def validate_endpoint(self, endpoint: Dict[str, Any]) -> List[ValidationError]:
        """Validate endpoint structure.
        
        Args:
            endpoint: Endpoint dictionary to validate
            
        Returns:
            List of validation errors (empty if valid)
        """
        errors = []
        
        # Validate basic fields
        required_fields = {
            'path': str,
            'method': str,
            'statistics': dict
        }
        errors.extend(self._validate_dict_fields(
            endpoint,
            required_fields,
            {},  # No optional fields
            'endpoint'
        ))
        
        # Validate statistics if present
        if 'statistics' in endpoint:
            stats = endpoint['statistics']
            required_stats = {
                'total_requests': int,
                'success_rate': (int, float),
                'status_codes': dict
            }
            errors.extend(self._validate_dict_fields(
                stats,
                required_stats,
                {},  # No optional fields
                'endpoint.statistics'
            ))
            
            # Validate status codes
            if 'status_codes' in stats:
                status_codes = stats['status_codes']
                if not isinstance(status_codes, dict):
                    errors.append(ValidationError(
                        'endpoint.statistics.status_codes',
                        'Status codes must be a dictionary'
                    ))
                else:
                    for code, count in status_codes.items():
                        if not isinstance(count, int):
                            errors.append(ValidationError(
                                f'endpoint.statistics.status_codes.{code}',
                                'Status code count must be an integer',
                                count
                            ))
        
        return errors

    def validate_test_case(self, test_case: Dict[str, Any]) -> List[ValidationError]:
        """Validate test case structure.
        
        Args:
            test_case: Test case dictionary to validate
            
        Returns:
            List of validation errors (empty if valid)
        """
        errors = []
        
        # Validate basic fields
        required_fields = {
            'id': str,
            'name': str,
            'endpoint': str,
            'method': str,
            'type': str,
            'request': dict,
            'response': dict
        }
        errors.extend(self._validate_dict_fields(
            test_case,
            required_fields,
            {},  # No optional fields
            'test_case'
        ))
        
        # Validate type value
        if 'type' in test_case and test_case['type'] not in ['success', 'fault']:
            errors.append(ValidationError(
                'test_case.type',
                "Type must be either 'success' or 'fault'",
                test_case['type']
            ))
        
        # Validate request if present
        if 'request' in test_case:
            request = test_case['request']
            optional_request_fields = {
                'headers': dict,
                'body': str
            }
            errors.extend(self._validate_dict_fields(
                request,
                {},  # No required fields
                optional_request_fields,
                'test_case.request'
            ))
        
        # Validate response if present
        if 'response' in test_case:
            response = test_case['response']
            required_response_fields = {
                'status_code': int
            }
            optional_response_fields = {
                'headers': dict,
                'body': str,
                'error_type': str
            }
            errors.extend(self._validate_dict_fields(
                response,
                required_response_fields,
                optional_response_fields,
                'test_case.response'
            ))
        
        return errors