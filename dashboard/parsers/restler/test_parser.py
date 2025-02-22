"""Tests for RESTler parser."""

import os
import json
import unittest
from unittest.mock import patch, mock_open
from datetime import datetime

from .parser import RestlerParser
from ..base.standardized_types import (
    TestMetadata,
    StandardizedTestCase
)

# pylint: disable=protected-access
class TestRestlerParser(unittest.TestCase):
    """Test cases for RestlerParser."""

    def setUp(self):
        """Set up test cases."""
        self.test_dir = '/test/path'
        self.output_dir = '/test/output'
        self.parser = RestlerParser(self.test_dir, self.output_dir)
        self.timestamp = datetime.fromisoformat('2024-02-22T03:53:50')

        # Sample test data
        self.sample_summary = {
            'start_time': self.timestamp.isoformat(),
            'total_requests': 100,
            'success_requests': 80,
            'duration': '1h 30m'
        }

        self.sample_errors = {
            'InvalidDynamicObjectChecker_500_1': {
                'endpoint': '/api/test',
                'verb': 'POST',
                'count': 5
            },
            'PayloadBodyChecker_400_1': [{
                'endpoint': '/api/test',
                'verb': 'POST',
                'count': 15
            }]
        }

        self.sample_bug = {
            'bug_type': 'InvalidDynamicObjectChecker_500_1',
            'endpoint': '/api/test',
            'verb': 'POST',
            'request_headers': {'Content-Type': 'application/json'},
            'request_data': '{"test": true}',
            'response_headers': {'Content-Type': 'application/json'},
            'response_code': 500,
            'response_body': '{"error": "Internal Server Error"}'
        }

        # Sample coverage log
        self.coverage_log = '''
[INFO] Test execution completed
Coverage:
  lines: 75%
  functions: 80%
  branches: 65%
  statements: 70%
[INFO] Generating report...
'''

    @patch('builtins.open', new_callable=mock_open)
    @patch('glob.glob')
    def test_load_raw_data(self, mock_glob, mock_file):
        """Test loading raw data from files."""
        # Mock experiment directories
        mock_glob.side_effect = [
            [os.path.join(self.test_dir, 'RestlerResults/experiment1')],  # Experiment dirs
            [os.path.join(self.test_dir, 'bug_buckets/bug1.json')]       # Bug files
        ]

        # Mock file reads
        mock_file.return_value.__enter__.return_value.read.side_effect = [
            json.dumps(self.sample_summary),
            json.dumps(self.sample_errors),
            json.dumps([self.sample_bug]),
            self.coverage_log  # Coverage log
        ]

        # Load raw data
        raw_data = self.parser._load_raw_data()

        # Verify data structure
        self.assertIn('response_data', raw_data)
        self.assertIn('bugs', raw_data)
        self.assertIn('coverage', raw_data)
        self.assertIn('summary', raw_data['response_data'])
        self.assertIn('errors', raw_data['response_data'])
        self.assertIsInstance(raw_data['bugs'], list)

        # Verify coverage data
        coverage = raw_data['coverage']
        self.assertEqual(coverage['lines'], 75)
        self.assertEqual(coverage['functions'], 80)
        self.assertEqual(coverage['branches'], 65)
        self.assertEqual(coverage['statements'], 70)

    def test_transform_metadata(self):
        """Test metadata transformation."""
        raw_data = {
            'response_data': {
                'summary': self.sample_summary,
                'errors': self.sample_errors
            },
            'bugs': [self.sample_bug],
            'coverage': {
                'lines': 75,
                'functions': 80,
                'branches': 65,
                'statements': 70
            }
        }

        metadata = self.parser._transform_metadata(raw_data)

        # Verify metadata
        self.assertIsInstance(metadata, TestMetadata)
        self.assertEqual(metadata.total_requests, 120)  # 100 + 5 + 15
        self.assertEqual(metadata.success_count, 80)
        self.assertEqual(metadata.failure_count, 40)
        self.assertEqual(metadata.timestamp, self.timestamp)
        
        # Verify fuzzer info
        self.assertEqual(metadata.fuzzer_info['name'], 'Restler')
        self.assertEqual(metadata.fuzzer_info['duration'], '1h 30m')
        self.assertEqual(metadata.fuzzer_info['critical_issues'], 6)  # 5 from errors + 1 from bug
        
        # Verify summary
        self.assertEqual(metadata.summary['endpoints_tested'], 1)
        self.assertAlmostEqual(metadata.summary['success_rate'], 66.67, places=2)  # 80/120 * 100
        self.assertEqual(metadata.summary['coverage']['lines'], 75)
        self.assertEqual(metadata.summary['coverage']['functions'], 80)
        self.assertEqual(metadata.summary['coverage']['branches'], 65)
        self.assertEqual(metadata.summary['coverage']['statements'], 70)

    def test_transform_endpoints(self):
        """Test endpoint transformation."""
        raw_data = {
            'response_data': {
                'summary': self.sample_summary,
                'errors': self.sample_errors
            },
            'bugs': [self.sample_bug]
        }

        endpoints = self.parser._transform_endpoints(raw_data)

        # Verify endpoints
        self.assertIsInstance(endpoints, list)
        self.assertTrue(endpoints)
        
        endpoint = endpoints[0]
        self.assertEqual(endpoint.path, '/api/test')
        self.assertEqual(endpoint.method, 'POST')
        
        # Verify statistics
        stats = endpoint.statistics
        self.assertEqual(stats.total_requests, 21)  # 5 + 15 + 1 (bug)
        self.assertEqual(stats.failure_count, 21)  # All are errors
        self.assertEqual(len(stats.status_codes), 2)  # 400 and 500
        self.assertEqual(stats.status_codes.get('500'), 6)  # 5 + 1 (bug)
        self.assertEqual(stats.status_codes.get('400'), 15)
        self.assertEqual(stats.success_rate, 0)  # All requests failed

    def test_transform_test_cases(self):
        """Test test case transformation."""
        raw_data = {
            'response_data': {
                'summary': self.sample_summary,
                'errors': self.sample_errors
            },
            'bugs': [self.sample_bug]
        }

        test_cases = self.parser._transform_test_cases(raw_data)

        # Verify test cases
        self.assertIsInstance(test_cases, list)
        self.assertTrue(test_cases)
        
        test_case = test_cases[0]
        self.assertIsInstance(test_case, StandardizedTestCase)
        self.assertEqual(test_case.type, 'fault')
        self.assertEqual(test_case.request.method, 'POST')
        self.assertEqual(test_case.request.path, '/api/test')
        self.assertEqual(test_case.response.status_code, 500)
        self.assertEqual(test_case.response.error_type, 'fault')

    def test_extract_status_code(self):
        """Test status code extraction."""
        # Test direct response code
        data = {'response_code': 404}
        self.assertEqual(self.parser._extract_status_code(data), 404)

        # Test nested response status code
        data = {'response': {'status_code': 500}}
        self.assertEqual(self.parser._extract_status_code(data), 500)

        # Test bug type extraction
        data = {'bug_type': 'InvalidDynamicObjectChecker_404_1'}
        self.assertEqual(self.parser._extract_status_code(data), 404)

        # Test default
        data = {'bug_type': 'UnknownError'}
        self.assertEqual(self.parser._extract_status_code(data), 500)

    def test_load_experiment_coverage(self):
        """Test coverage data extraction from experiment logs."""
        mock_file = mock_open(read_data=self.coverage_log)
        
        with patch('builtins.open', mock_file):
            with patch('os.path.exists', return_value=True):
                coverage = self.parser._load_experiment_coverage('/test/path/experiment1')
        
        # Verify coverage data
        self.assertEqual(coverage['lines'], 75)
        self.assertEqual(coverage['functions'], 80)
        self.assertEqual(coverage['branches'], 65)
        self.assertEqual(coverage['statements'], 70)

if __name__ == '__main__':
    unittest.main()
