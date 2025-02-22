"""Tests for EvoMaster parser."""

import unittest
from unittest.mock import patch, mock_open
from datetime import datetime

from .parser import EvoMasterParser
from ..base.standardized_types import (
    TestMetadata,
    StandardizedTestCase
)

# pylint: disable=protected-access
class TestEvoMasterParser(unittest.TestCase):
    """Test cases for EvoMasterParser."""

    def setUp(self):
        """Set up test cases."""
        self.test_dir = '/test/path'
        self.output_dir = '/test/output'
        self.parser = EvoMasterParser(self.test_dir, self.output_dir)
        self.timestamp = datetime(2024, 2, 22, 3, 53, 50)

        # Sample test file content
        self.test_file_content = '''
# Generated on: 2024-02-22T03:53:50
# Coverage: 75% lines, 80% functions, 65% branches

def test_success_case():
    # (200) GET:/api/users
    response = client.get('/api/users', headers={'Accept': 'application/json'})
    assert response.status == 200
    assert response.body == {"users": []}

def test_fault_case():
    # (500) POST:/api/users
    response = client.post(
        '/api/users',
        headers={'Content-Type': 'application/json'},
        json={"name": "test"}
    )
    assert response.status == 500
    assert response.body == {"error": "Internal Server Error"}
'''

    @patch('builtins.open', new_callable=mock_open)
    @patch('os.path.exists')
    def test_load_raw_data(self, mock_exists, mock_file):
        """Test loading raw data from test files."""
        # Mock file existence
        mock_exists.side_effect = lambda path: 'successes' in path or 'faults' in path

        # Mock file content
        mock_file.return_value.__enter__.return_value.readlines.return_value = (
            self.test_file_content.splitlines(keepends=True)
        )

        # Load raw data
        raw_data = self.parser._load_raw_data()

        # Verify data structure
        self.assertIn('test_cases', raw_data)
        self.assertIn('start_time', raw_data)
        self.assertIn('end_time', raw_data)
        self.assertIn('coverage', raw_data)
        self.assertTrue(raw_data['test_cases'])
        
        # Verify coverage data
        coverage = raw_data['coverage']
        self.assertEqual(coverage['lines'], 75)
        self.assertEqual(coverage['functions'], 80)
        self.assertEqual(coverage['branches'], 65)
        self.assertEqual(coverage['statements'], 75)  # Same as lines

    def test_parse_test_file(self):
        """Test parsing of Python test files."""
        mock_file = mock_open(read_data=self.test_file_content)
        
        with patch('builtins.open', mock_file):
            test_cases, start_time, end_time, coverage = self.parser._parse_test_file(
                '/test/path/test_file.py',
                'success'
            )

        # Verify test cases
        self.assertEqual(len(test_cases), 2)
        
        # Verify success case
        success_case = test_cases[0]
        self.assertEqual(success_case['name'], 'test_success_case')
        self.assertEqual(success_case['type'], 'success')
        self.assertEqual(success_case['method'], 'GET')
        self.assertEqual(success_case['endpoint'], '/api/users')
        self.assertEqual(success_case['status_code'], 200)
        self.assertEqual(
            success_case['request_data']['headers'],
            {'Accept': 'application/json'}
        )
        
        # Verify fault case
        fault_case = test_cases[1]
        self.assertEqual(fault_case['name'], 'test_fault_case')
        self.assertEqual(fault_case['type'], 'success')  # Type comes from file type
        self.assertEqual(fault_case['method'], 'POST')
        self.assertEqual(fault_case['endpoint'], '/api/users')
        self.assertEqual(fault_case['status_code'], 500)
        self.assertEqual(
            fault_case['request_data']['headers'],
            {'Content-Type': 'application/json'}
        )
        self.assertEqual(
            fault_case['request_data']['json'],
            {'name': 'test'}
        )

        # Verify timestamps
        self.assertIsInstance(start_time, datetime)
        self.assertEqual(
            start_time.isoformat(),
            '2024-02-22T03:53:50'
        )
        self.assertIsInstance(end_time, datetime)
        
        # Verify coverage
        self.assertEqual(coverage['lines'], 75)
        self.assertEqual(coverage['functions'], 80)
        self.assertEqual(coverage['branches'], 65)
        self.assertEqual(coverage['statements'], 75)  # Same as lines

    def test_transform_metadata(self):
        """Test metadata transformation."""
        raw_data = {
            'test_cases': [
                {
                    'name': 'test_success',
                    'type': 'success',
                    'endpoint': '/api/users',
                    'method': 'GET',
                    'status_code': 200
                },
                {
                    'name': 'test_fault',
                    'type': 'fault',
                    'endpoint': '/api/users',
                    'method': 'POST',
                    'status_code': 500
                }
            ],
            'start_time': self.timestamp,
            'end_time': self.timestamp.replace(minute=54),  # 1 minute later
            'coverage': {
                'lines': 75,
                'functions': 80,
                'branches': 65,
                'statements': 75
            }
        }

        metadata = self.parser._transform_metadata(raw_data)

        # Verify metadata
        self.assertIsInstance(metadata, TestMetadata)
        self.assertEqual(metadata.total_requests, 2)
        self.assertEqual(metadata.success_count, 1)
        self.assertEqual(metadata.failure_count, 1)
        self.assertEqual(metadata.timestamp, self.timestamp)
        
        # Verify fuzzer info
        self.assertEqual(metadata.fuzzer_info['name'], 'EvoMaster')
        self.assertEqual(metadata.fuzzer_info['duration'], '0:01:00')  # 1 minute
        self.assertEqual(metadata.fuzzer_info['critical_issues'], 1)  # One 500 error
        
        # Verify summary
        self.assertEqual(metadata.summary['endpoints_tested'], 2)  # GET and POST /api/users
        self.assertEqual(metadata.summary['success_rate'], 50.0)  # 1/2 * 100
        self.assertEqual(metadata.summary['coverage']['lines'], 75)
        self.assertEqual(metadata.summary['coverage']['functions'], 80)
        self.assertEqual(metadata.summary['coverage']['branches'], 65)
        self.assertEqual(metadata.summary['coverage']['statements'], 75)

    def test_transform_endpoints(self):
        """Test endpoint transformation."""
        raw_data = {
            'test_cases': [
                {
                    'endpoint': '/api/users',
                    'method': 'GET',
                    'status_code': 200,
                    'type': 'success'
                },
                {
                    'endpoint': '/api/users',
                    'method': 'POST',
                    'status_code': 500,
                    'type': 'fault'
                },
                {
                    'endpoint': '/api/users',
                    'method': 'GET',
                    'status_code': 200,
                    'type': 'success'
                }
            ],
            'start_time': self.timestamp,
            'end_time': self.timestamp.replace(minute=54)
        }

        endpoints = self.parser._transform_endpoints(raw_data)

        # Verify endpoints
        self.assertEqual(len(endpoints), 2)  # GET and POST /api/users
        
        # Find GET endpoint
        get_endpoint = next(
            ep for ep in endpoints
            if ep.method == 'GET' and ep.path == '/api/users'
        )
        self.assertEqual(get_endpoint.statistics.total_requests, 2)
        self.assertEqual(get_endpoint.statistics.success_count, 2)
        self.assertEqual(get_endpoint.statistics.failure_count, 0)
        self.assertEqual(get_endpoint.statistics.success_rate, 100.0)
        
        # Find POST endpoint
        post_endpoint = next(
            ep for ep in endpoints
            if ep.method == 'POST' and ep.path == '/api/users'
        )
        self.assertEqual(post_endpoint.statistics.total_requests, 1)
        self.assertEqual(post_endpoint.statistics.success_count, 0)
        self.assertEqual(post_endpoint.statistics.failure_count, 1)
        self.assertEqual(post_endpoint.statistics.success_rate, 0.0)

    def test_transform_test_cases(self):
        """Test test case transformation."""
        raw_data = {
            'test_cases': [
                {
                    'name': 'test_success',
                    'endpoint': '/api/users',
                    'method': 'GET',
                    'type': 'success',
                    'status_code': 200,
                    'request_data': {
                        'headers': {'Accept': 'application/json'}
                    },
                    'response_data': {
                        'body': {'users': []}
                    }
                }
            ],
            'start_time': self.timestamp,
            'end_time': self.timestamp.replace(minute=54)
        }

        test_cases = self.parser._transform_test_cases(raw_data)

        # Verify test cases
        self.assertEqual(len(test_cases), 1)
        
        test_case = test_cases[0]
        self.assertIsInstance(test_case, StandardizedTestCase)
        self.assertEqual(test_case.name, 'test_success')
        self.assertEqual(test_case.type, 'success')
        self.assertEqual(test_case.request.method, 'GET')
        self.assertEqual(test_case.request.path, '/api/users')
        self.assertEqual(
            test_case.request.headers,
            {'Accept': 'application/json'}
        )
        self.assertEqual(test_case.response.status_code, 200)
        self.assertEqual(test_case.response.error_type, None)

if __name__ == '__main__':
    unittest.main()
