"""Tests for JSON schema validation."""

import unittest
from .json_validator import JsonValidator, ValidationError

class TestJsonValidator(unittest.TestCase):
    """Test cases for JsonValidator."""

    def setUp(self):
        """Set up test cases."""
        self.validator = JsonValidator()

    def test_metadata_validation(self):
        """Test metadata validation."""
        # Valid metadata
        valid_metadata = {
            'fuzzer': {
                'name': 'TestFuzzer',
                'timestamp': '2024-02-22T03:53:50',
                'total_requests': 100,
                'success_count': 80,
                'failure_count': 20
            },
            'summary': {
                'endpoints_tested': 5,
                'success_rate': 80.0
            }
        }
        errors = self.validator.validate_metadata(valid_metadata)
        self.assertEqual(len(errors), 0, "Valid metadata should have no errors")

        # Invalid metadata - missing required fields
        invalid_metadata = {
            'fuzzer': {
                'name': 'TestFuzzer'
            },
            'summary': {
                'endpoints_tested': 5
            }
        }
        errors = self.validator.validate_metadata(invalid_metadata)
        self.assertGreater(len(errors), 0, "Invalid metadata should have errors")
        error_paths = [e.path for e in errors]
        self.assertIn('metadata.fuzzer.timestamp', error_paths)
        self.assertIn('metadata.fuzzer.total_requests', error_paths)
        self.assertIn('metadata.summary.success_rate', error_paths)

        # Invalid metadata - wrong types
        invalid_types = {
            'fuzzer': {
                'name': 123,  # Should be string
                'timestamp': '2024-02-22T03:53:50',
                'total_requests': '100',  # Should be int
                'success_count': 80,
                'failure_count': 20
            },
            'summary': {
                'endpoints_tested': '5',  # Should be int
                'success_rate': '80.0'  # Should be float
            }
        }
        errors = self.validator.validate_metadata(invalid_types)
        self.assertGreater(len(errors), 0, "Invalid types should have errors")
        self.assertTrue(any('Invalid type' in e.message for e in errors))

    def test_endpoint_validation(self):
        """Test endpoint validation."""
        # Valid endpoint
        valid_endpoint = {
            'path': '/api/test',
            'method': 'GET',
            'statistics': {
                'total_requests': 100,
                'success_rate': 80.0,
                'status_codes': {
                    '200': 80,
                    '404': 15,
                    '500': 5
                }
            }
        }
        errors = self.validator.validate_endpoint(valid_endpoint)
        self.assertEqual(len(errors), 0, "Valid endpoint should have no errors")

        # Invalid endpoint - missing fields
        invalid_endpoint = {
            'path': '/api/test',
            'statistics': {}
        }
        errors = self.validator.validate_endpoint(invalid_endpoint)
        self.assertGreater(len(errors), 0, "Invalid endpoint should have errors")
        self.assertTrue(any('method' in e.path for e in errors))

        # Invalid endpoint - wrong types in status codes
        invalid_status_codes = {
            'path': '/api/test',
            'method': 'GET',
            'statistics': {
                'total_requests': 100,
                'success_rate': 80.0,
                'status_codes': {
                    '200': '80'  # Should be int
                }
            }
        }
        errors = self.validator.validate_endpoint(invalid_status_codes)
        self.assertGreater(len(errors), 0, "Invalid status codes should have errors")

    def test_test_case_validation(self):
        """Test test case validation."""
        # Valid test case
        valid_test_case = {
            'id': 'test_1',
            'name': 'Test Case 1',
            'endpoint': '/api/test',
            'method': 'GET',
            'type': 'success',
            'request': {
                'headers': {'Content-Type': 'application/json'},
                'body': '{"test": true}'
            },
            'response': {
                'status_code': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': '{"result": "ok"}',
                'error_type': None
            }
        }
        errors = self.validator.validate_test_case(valid_test_case)
        self.assertEqual(len(errors), 0, "Valid test case should have no errors")

        # Invalid test case - invalid type
        invalid_type = dict(valid_test_case)
        invalid_type['type'] = 'unknown'
        errors = self.validator.validate_test_case(invalid_type)
        self.assertGreater(len(errors), 0, "Invalid type should have errors")
        self.assertTrue(any("Type must be either 'success' or 'fault'" in e.message for e in errors))

        # Invalid test case - missing required fields
        invalid_test_case = {
            'id': 'test_1',
            'name': 'Test Case 1',
            'type': 'success'
        }
        errors = self.validator.validate_test_case(invalid_test_case)
        self.assertGreater(len(errors), 0, "Invalid test case should have errors")
        error_paths = [e.path for e in errors]
        self.assertIn('test_case.endpoint', error_paths)
        self.assertIn('test_case.method', error_paths)
        self.assertIn('test_case.request', error_paths)
        self.assertIn('test_case.response', error_paths)

    def test_validation_error_severity(self):
        """Test validation error severity levels."""
        error = ValidationError('test.path', 'Test message', severity='warning')
        self.assertEqual(error.severity, 'warning')
        self.assertEqual(error.path, 'test.path')
        self.assertEqual(error.message, 'Test message')

if __name__ == '__main__':
    unittest.main()