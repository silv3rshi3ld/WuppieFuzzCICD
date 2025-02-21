"""Tests for WuppieFuzz parser."""

import os
import unittest
import sqlite3
from tempfile import TemporaryDirectory
from datetime import datetime

from .parser import parse_wuppiefuzz_results, extract_error_message

class TestWuppieFuzzParser(unittest.TestCase):
    def setUp(self):
        self.temp_dir = TemporaryDirectory()
        os.makedirs(os.path.join(self.temp_dir.name, 'grafana'))
        self.db_path = os.path.join(self.temp_dir.name, 'grafana', 'report.db')
        
        # Create test database
        self.conn = sqlite3.connect(self.db_path)
        self.cursor = self.conn.cursor()
        
        # Create tables
        self.cursor.executescript("""
            CREATE TABLE coverage (
                timestamp TEXT,
                line_coverage INTEGER,
                line_coverage_total INTEGER,
                endpoint_coverage INTEGER,
                endpoint_coverage_total INTEGER
            );
            
            CREATE TABLE requests (
                id INTEGER PRIMARY KEY,
                timestamp TEXT,
                type TEXT,
                path TEXT,
                data TEXT
            );
            
            CREATE TABLE responses (
                reqid INTEGER,
                status INTEGER,
                error TEXT,
                data TEXT,
                FOREIGN KEY(reqid) REFERENCES requests(id)
            );
            
            CREATE TABLE runs (
                timestamp TEXT
            );
        """)
        
        # Insert test data
        self.cursor.execute(
            "INSERT INTO coverage VALUES (?, ?, ?, ?, ?)",
            ('2025-02-19T13:53:50.672Z', 50, 100, 10, 20)
        )
        
        # Insert test request
        self.cursor.execute(
            "INSERT INTO requests VALUES (?, ?, ?, ?, ?)",
            (1, '2025-02-19T13:53:50.672Z', 'GET', '/test', 'test request')
        )
        
        # Insert test response
        self.cursor.execute(
            "INSERT INTO responses VALUES (?, ?, ?, ?)",
            (1, 500, 'Test error', '<title>Test Error Message</title>')
        )
        
        # Insert test run timestamps
        self.cursor.execute(
            "INSERT INTO runs VALUES (?)",
            ('2025-02-19T13:53:50.672Z',)
        )
        
        self.conn.commit()

    def tearDown(self):
        self.conn.close()
        self.temp_dir.cleanup()

    def test_parse_results(self):
        """Test parsing WuppieFuzz results."""
        summary, data = parse_wuppiefuzz_results(self.temp_dir.name)
        
        # Check summary
        self.assertEqual(summary['total_requests'], 1)
        
        # Check metadata
        self.assertEqual(data['metadata']['fuzzer'], 'WuppieFuzz')
        self.assertEqual(data['metadata']['total_requests'], 1)
        
        # Check coverage
        self.assertEqual(data['coverage']['lines']['covered'], 50)
        self.assertEqual(data['coverage']['lines']['total'], 100)
        self.assertEqual(data['coverage']['functions']['covered'], 10)
        self.assertEqual(data['coverage']['functions']['total'], 20)
        
        # Check bugs
        self.assertEqual(len(data['bugs']), 1)
        bug = data['bugs'][0]
        self.assertEqual(bug['method'], 'GET')
        self.assertEqual(bug['endpoint'], '/test')
        self.assertEqual(bug['status_code'], 500)
        self.assertEqual(bug['severity'], 'Critical')

    def test_extract_error_message(self):
        """Test error message extraction."""
        html = '<title>Test Error // Some details</title>'
        self.assertEqual(extract_error_message(html), 'Test Error')
        
        # Test empty input
        self.assertEqual(
            extract_error_message(''),
            'No error details available'
        )
        
        # Test invalid HTML
        self.assertEqual(
            extract_error_message('Invalid HTML'),
            'No error details available'
        )

if __name__ == '__main__':
    unittest.main()