"""Tests for WuppieFuzz parser."""

import unittest
from unittest.mock import patch, mock_open, MagicMock
from datetime import datetime

from .parser import WuppieFuzzParser
from ..base.standardized_types import (
    TestMetadata,
    StandardizedTestCase
)

# pylint: disable=protected-access
class TestWuppieFuzzParser(unittest.TestCase):
    """Test cases for WuppieFuzzParser."""

    def setUp(self):
        """Set up test cases."""
        self.test_dir = '/test/path'
        self.output_dir = '/test/output'
        self.parser = WuppieFuzzParser(self.test_dir, self.output_dir)
        self.timestamp = datetime(2024, 2, 22, 3, 53, 50)

        # Sample HTML content
        self.html_content = '''
<html>
<body>
    <div class="endpoint_path">/api/users
        <div>GET
            <a class="c-hit">200 (15 hits)</a>
            <a class="c-miss">404 (3 hits)</a>
        </div>
        <div>POST
            <a class="c-hit">201 (5 hits)</a>
            <a class="c-miss">400 (2 hits)</a>
            <a class="c-extra">500 (1 hit)</a>
        </div>
    </div>
    <div class="endpoint_path">/api/products
        <div>GET
            <a class="c-hit">200 (10 hits)</a>
        </div>
    </div>
</body>
</html>
'''

        # Sample SQLite data
        self.mock_sqlite_data = [
            ('coverage.lines', 150),
            ('coverage.functions', 45),
            ('coverage.branches', 80),
            ('coverage.statements', 200)
        ]

    @patch('builtins.open', new_callable=mock_open)
    @patch('os.path.exists')
    @patch('sqlite3.connect')
    @patch('..base.zip_handler.find_timestamp_directory')
    def test_load_raw_data(self, mock_find_dir, mock_sqlite, mock_exists, mock_file):
        """Test loading raw data from HTML and SQLite."""
        # Mock directory and file existence
        mock_find_dir.return_value = '/test/path/2025-02-19T135350.002Z'
        mock_exists.return_value = True

        # Mock SQLite connection
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = self.mock_sqlite_data
        mock_conn = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_sqlite.return_value = mock_conn

        # Mock file content
        mock_file.return_value.__enter__.return_value.read.return_value = self.html_content

        # Load raw data
        raw_data = self.parser._load_raw_data()

        # Verify data structure
        self.assertIn('coverage', raw_data)
        self.assertIn('metrics', raw_data)
        self.assertIn('timestamp', raw_data)
        self.assertEqual(raw_data['timestamp'], '2025-02-19T135350.002Z')
        
        # Verify metrics
        metrics = raw_data['metrics']
        self.assertEqual(metrics['lines'], 150)
        self.assertEqual(metrics['functions'], 45)
        self.assertEqual(metrics['branches'], 80)
        self.assertEqual(metrics['statements'], 200)

    def test_parse_html_coverage(self):
        """Test HTML coverage parsing."""
        mock_file = mock_open(read_data=self.html_content)
        
        with patch('builtins.open', mock_file):
            coverage_data = self.parser._parse_html_coverage('/test/path/coverage.html')

        # Verify coverage data
        self.assertIn('endpoints', coverage_data)
        self.assertIn('total_requests', coverage_data)
        self.assertIn('success_count', coverage_data)
        self.assertIn('success_rate', coverage_data)
        
        endpoints = coverage_data['endpoints']
        self.assertEqual(len(endpoints), 3)  # GET /users, POST /users, GET /products
        
        # Verify /api/users GET endpoint
        users_get = next(
            ep for ep in endpoints
            if ep['path'] == '/api/users' and ep['method'] == 'GET'
        )
        self.assertEqual(users_get['statistics']['total_requests'], 18)  # 15 + 3
        self.assertEqual(users_get['statistics']['success_count'], 15)
        self.assertEqual(users_get['statistics']['status_codes']['200'], 15)
        self.assertEqual(users_get['statistics']['status_codes']['404'], 3)
        
        # Verify /api/users POST endpoint
        users_post = next(
            ep for ep in endpoints
            if ep['path'] == '/api/users' and ep['method'] == 'POST'
        )
        self.assertEqual(users_post['statistics']['total_requests'], 8)  # 5 + 2 + 1
        self.assertEqual(users_post['statistics']['success_count'], 5)
        self.assertEqual(users_post['statistics']['status_codes']['201'], 5)
        self.assertEqual(users_post['statistics']['status_codes']['400'], 2)
        self.assertEqual(users_post['statistics']['status_codes']['500'], 1)

    @patch('sqlite3.connect')
    def test_parse_grafana_metrics(self, mock_sqlite):
        """Test Grafana SQLite metrics parsing."""
        # Mock SQLite connection
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = self.mock_sqlite_data
        mock_conn = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_sqlite.return_value = mock_conn

        # Parse metrics
        with patch('os.path.exists', return_value=True):
            metrics = self.parser._parse_grafana_metrics('/test/path/report.db')

        # Verify metrics
        self.assertEqual(metrics['lines'], 150)
        self.assertEqual(metrics['functions'], 45)
        self.assertEqual(metrics['branches'], 80)
        self.assertEqual(metrics['statements'], 200)

    def test_transform_metadata(self):
        """Test metadata transformation."""
        raw_data = {
            'coverage': {
                'endpoints': [
                    {
                        'path': '/api/test',
                        'method': 'GET',
                        'statistics': {
                            'total_requests': 20,
                            'success_count': 15,
                            'success_rate': 75.0,
                            'status_codes': {'200': 15, '404': 3, '500': 2}
                        }
                    }
                ],
                'total_requests': 20,
                'success_count': 15,
                'success_rate': 75.0
            },
            'metrics': {
                'lines': 150,
                'functions': 45,
                'branches': 80,
                'statements': 200
            },
            'timestamp': '2025-02-19T135350.002Z'
        }

        metadata = self.parser._transform_metadata(raw_data)

        # Verify metadata
        self.assertIsInstance(metadata, TestMetadata)
        self.assertEqual(metadata.total_requests, 20)
        self.assertEqual(metadata.success_count, 15)
        self.assertEqual(metadata.failure_count, 5)
        
        # Verify fuzzer info
        self.assertEqual(metadata.fuzzer_info['name'], 'WuppieFuzz')
        self.assertEqual(metadata.fuzzer_info['critical_issues'], 2)
        
        # Verify summary
        self.assertEqual(metadata.summary['endpoints_tested'], 1)
        self.assertEqual(metadata.summary['success_rate'], 75.0)
        self.assertEqual(metadata.summary['coverage']['lines'], 150)
        self.assertEqual(metadata.summary['coverage']['functions'], 45)
        self.assertEqual(metadata.summary['coverage']['branches'], 80)
        self.assertEqual(metadata.summary['coverage']['statements'], 200)

    def test_transform_endpoints(self):
        """Test endpoint transformation."""
        raw_data = {
            'coverage': {
                'endpoints': [
                    {
                        'path': '/api/test',
                        'method': 'GET',
                        'statistics': {
                            'total_requests': 20,
                            'success_count': 15,
                            'success_rate': 75.0,
                            'status_codes': {'200': 15, '404': 5}
                        }
                    }
                ],
                'total_requests': 20,
                'success_count': 15,
                'success_rate': 75.0
            },
            'metrics': {
                'lines': 150,
                'functions': 45,
                'branches': 80,
                'statements': 200
            },
            'timestamp': '2025-02-19T135350.002Z'
        }

        endpoints = self.parser._transform_endpoints(raw_data)

        # Verify endpoints
        self.assertEqual(len(endpoints), 1)
        
        endpoint = endpoints[0]
        self.assertEqual(endpoint.path, '/api/test')
        self.assertEqual(endpoint.method, 'GET')
        self.assertEqual(endpoint.statistics.total_requests, 20)
        self.assertEqual(endpoint.statistics.success_count, 15)
        self.assertEqual(endpoint.statistics.failure_count, 5)
        self.assertEqual(endpoint.statistics.success_rate, 75.0)
        self.assertEqual(endpoint.statistics.status_codes['200'], 15)
        self.assertEqual(endpoint.statistics.status_codes['404'], 5)

    def test_transform_test_cases(self):
        """Test test case transformation."""
        raw_data = {
            'coverage': {
                'endpoints': [
                    {
                        'path': '/api/test',
                        'method': 'GET',
                        'statistics': {
                            'total_requests': 2,
                            'success_count': 1,
                            'success_rate': 50.0,
                            'status_codes': {'200': 1, '404': 1}
                        }
                    }
                ],
                'total_requests': 2,
                'success_count': 1,
                'success_rate': 50.0
            },
            'metrics': {
                'lines': 150,
                'functions': 45,
                'branches': 80,
                'statements': 200
            },
            'timestamp': '2025-02-19T135350.002Z'
        }

        test_cases = self.parser._transform_test_cases(raw_data)

        # Verify test cases
        self.assertEqual(len(test_cases), 2)  # One for each status code
        
        # Find success case
        success_case = next(tc for tc in test_cases if tc.type == 'success')
        self.assertIsInstance(success_case, StandardizedTestCase)
        self.assertEqual(success_case.request.method, 'GET')
        self.assertEqual(success_case.request.path, '/api/test')
        self.assertEqual(success_case.response.status_code, 200)
        self.assertIsNone(success_case.response.error_type)
        
        # Find fault case
        fault_case = next(tc for tc in test_cases if tc.type == 'fault')
        self.assertEqual(fault_case.request.method, 'GET')
        self.assertEqual(fault_case.request.path, '/api/test')
        self.assertEqual(fault_case.response.status_code, 404)
        self.assertEqual(fault_case.response.error_type, 'fault')

if __name__ == '__main__':
    unittest.main()
