"""JSON schema validation for fuzzer output data."""

from typing import Any, Dict, List
from dataclasses import dataclass

@dataclass
class ValidationError:
    """Represents a validation error."""
    path: str
    message: str
    value: Any = None

class JsonValidator:
    """Validates JSON data against expected schemas."""
    
    @staticmethod
    def validate_metadata(data: Dict[str, Any]) -> List[ValidationError]:
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
                'duration': str,
                'total_requests': int,
                'critical_issues': int
            }
            for field, field_type in required_fuzzer_fields.items():
                if field not in fuzzer:
                    errors.append(ValidationError(
                        f'metadata.fuzzer.{field}',
                        f'Missing required field: {field}'
                    ))
                elif not isinstance(fuzzer[field], field_type):
                    errors.append(ValidationError(
                        f'metadata.fuzzer.{field}',
                        f'Invalid type: expected {field_type.__name__}, got {type(fuzzer[field]).__name__}',
                        fuzzer[field]
                    ))
        
        # Check summary section
        if 'summary' not in data:
            errors.append(ValidationError('metadata.summary', 'Missing summary section'))
        else:
            summary = data['summary']
            required_summary_fields = {
                'endpoints_tested': int,
                'success_rate': (int, float),
                'coverage': dict
            }
            for field, field_type in required_summary_fields.items():
                if field not in summary:
                    errors.append(ValidationError(
                        f'metadata.summary.{field}',
                        f'Missing required field: {field}'
                    ))
                elif not isinstance(summary[field], field_type):
                    type_name = field_type.__name__ if isinstance(field_type, type) else str(field_type)
                    errors.append(ValidationError(
                        f'metadata.summary.{field}',
                        f'Invalid type: expected {type_name}, got {type(summary[field]).__name__}',
                        summary[field]
                    ))
            
            # Validate coverage if present
            if 'coverage' in summary:
                coverage = summary['coverage']
                required_coverage_fields = {
                    'lines': int,
                    'functions': int,
                    'branches': int,
                    'statements': int
                }
                for field, field_type in required_coverage_fields.items():
                    if field not in coverage:
                        errors.append(ValidationError(
                            f'metadata.summary.coverage.{field}',
                            f'Missing required field: {field}'
                        ))
                    elif not isinstance(coverage[field], field_type):
                        errors.append(ValidationError(
                            f'metadata.summary.coverage.{field}',
                            f'Invalid type: expected {field_type.__name__}, got {type(coverage[field]).__name__}',
                            coverage[field]
                        ))
        
        return errors
    
    @staticmethod
    def validate_endpoint(endpoint: Dict[str, Any]) -> List[ValidationError]:
        """Validate endpoint structure.
        
        Args:
            endpoint: Endpoint dictionary to validate
        
        Returns:
            List of validation errors (empty if valid)
        """
        errors = []
        
        required_fields = {
            'path': str,
            'method': str,
            'statistics': dict
        }
        
        for field, field_type in required_fields.items():
            if field not in endpoint:
                errors.append(ValidationError(
                    f'endpoint.{field}',
                    f'Missing required field: {field}'
                ))
            elif not isinstance(endpoint[field], field_type):
                errors.append(ValidationError(
                    f'endpoint.{field}',
                    f'Invalid type: expected {field_type.__name__}, got {type(endpoint[field]).__name__}',
                    endpoint[field]
                ))
        
        if 'statistics' in endpoint:
            stats = endpoint['statistics']
            required_stats = {
                'total_requests': int,
                'success_rate': (int, float),
                'status_codes': dict
            }
            for field, field_type in required_stats.items():
                if field not in stats:
                    errors.append(ValidationError(
                        f'endpoint.statistics.{field}',
                        f'Missing required field: {field}'
                    ))
                elif not isinstance(stats[field], field_type):
                    type_name = field_type.__name__ if isinstance(field_type, type) else str(field_type)
                    errors.append(ValidationError(
                        f'endpoint.statistics.{field}',
                        f'Invalid type: expected {type_name}, got {type(stats[field]).__name__}',
                        stats[field]
                    ))
        
        return errors
    
    @staticmethod
    def validate_test_case(test_case: Dict[str, Any]) -> List[ValidationError]:
        """Validate test case structure.
        
        Args:
            test_case: Test case dictionary to validate
        
        Returns:
            List of validation errors (empty if valid)
        """
        errors = []
        
        required_fields = {
            'id': str,
            'name': str,
            'endpoint': str,
            'method': str,
            'type': str,
            'request': dict,
            'response': dict
        }
        
        for field, field_type in required_fields.items():
            if field not in test_case:
                errors.append(ValidationError(
                    f'test_case.{field}',
                    f'Missing required field: {field}'
                ))
            elif not isinstance(test_case[field], field_type):
                errors.append(ValidationError(
                    f'test_case.{field}',
                    f'Invalid type: expected {field_type.__name__}, got {type(test_case[field]).__name__}',
                    test_case[field]
                ))
        
        # Validate type value
        if 'type' in test_case and test_case['type'] not in ['success', 'fault']:
            errors.append(ValidationError(
                'test_case.type',
                "Type must be either 'success' or 'fault'",
                test_case['type']
            ))
        
        return errors