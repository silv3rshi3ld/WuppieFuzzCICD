"""Parser for WuppieFuzz results."""

import os
import re
import sqlite3
from datetime import datetime
from typing import Dict, List, Any
from bs4 import BeautifulSoup

from ..base.base_parser import BaseParser
from ..base.standardized_types import (
    StandardizedRequest,
    StandardizedResponse,
    TestMetadata,
    StandardizedTestCase,
    StandardizedEndpoint,
    EndpointStatistics
)

class WuppieFuzzParser(BaseParser):
    """Parser for WuppieFuzz output data."""
    
    def __init__(self, input_path: str, output_dir: str):
        """Initialize parser.
        
        Args:
            input_path: Path to WuppieFuzz output directory
            output_dir: Directory to save parsed results
        """
        super().__init__(input_path, output_dir, 'WuppieFuzz')

    def _parse_timestamp(self, timestamp_str: str) -> datetime:
        """Parse timestamp from directory name.
        
        Args:
            timestamp_str: Timestamp string from directory name
            
        Returns:
            Parsed datetime object
            
        Example:
            '2025-02-19T135350.002Z' -> datetime(2025, 2, 19, 13, 53, 50)
        """
        # Extract timestamp parts
        match = re.match(r'(\d{4})-(\d{2})-(\d{2})T(\d{2})(\d{2})(\d{2})', timestamp_str)
        if not match:
            raise ValueError(f"Invalid timestamp format: {timestamp_str}")
            
        year, month, day, hour, minute, second = map(int, match.groups())
        return datetime(year, month, day, hour, minute, second)

    def _load_raw_data(self) -> Dict[str, Any]:
        """Load raw data from WuppieFuzz output.
        
        Returns:
            Dict containing raw fuzzer output data
            
        Raises:
            FileNotFoundError: If required files are missing
            ValueError: If data is invalid
        """
        # Find timestamp directory
        report_dir = os.path.join(self.input_path, 'fuzzing-report')
        if not os.path.exists(report_dir):
            raise FileNotFoundError(f"Report directory not found at {report_dir}")
            
        # Find latest timestamp directory
        timestamp_dirs = []
        for item in os.listdir(report_dir):
            item_path = os.path.join(report_dir, item)
            if os.path.isdir(item_path) and re.match(r'\d{4}-\d{2}-\d{2}T\d{6}', item):
                timestamp_dirs.append(item_path)
                
        if not timestamp_dirs:
            raise FileNotFoundError("No timestamp directories found")
            
        timestamp_dir = max(timestamp_dirs)  # Get latest timestamp
        
        # Parse HTML coverage data
        coverage_file = os.path.join(timestamp_dir, 'endpointcoverage', 'index.html')
        if not os.path.exists(coverage_file):
            raise FileNotFoundError(f"Coverage file not found at {coverage_file}")
        
        coverage_data = self._parse_html_coverage(coverage_file)
        
        # Load grafana data for additional metrics
        grafana_db = os.path.join(report_dir, 'grafana', 'report.db')
        metrics = self._parse_grafana_metrics(grafana_db)
        
        return {
            'coverage': coverage_data,
            'metrics': metrics,
            'timestamp': os.path.basename(timestamp_dir)
        }

    def _parse_grafana_metrics(self, db_path: str) -> Dict[str, Any]:
        """Parse metrics from Grafana SQLite database.
        
        Args:
            db_path: Path to Grafana SQLite database
            
        Returns:
            Dictionary containing metrics data
        """
        metrics = {
            'lines': 0,
            'functions': 0,
            'branches': 0,
            'statements': 0
        }
        
        if not os.path.exists(db_path):
            return metrics
            
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Query coverage metrics from the database
            cursor.execute("""
                SELECT metric_name, MAX(value)
                FROM metrics
                WHERE metric_name IN ('coverage.lines', 'coverage.functions', 'coverage.branches', 'coverage.statements')
                GROUP BY metric_name
            """)
            
            for metric_name, value in cursor.fetchall():
                if metric_name == 'coverage.lines':
                    metrics['lines'] = int(value)
                elif metric_name == 'coverage.functions':
                    metrics['functions'] = int(value)
                elif metric_name == 'coverage.branches':
                    metrics['branches'] = int(value)
                elif metric_name == 'coverage.statements':
                    metrics['statements'] = int(value)
                    
            conn.close()
            
        except sqlite3.Error as e:
            self.logger.warning(f"Failed to parse Grafana metrics: {str(e)}")
            
        return metrics

    def _parse_html_coverage(self, html_path: str) -> Dict[str, Any]:
        """Parse endpoint coverage from HTML file.
        
        Args:
            html_path: Path to the HTML file
            
        Returns:
            Dictionary containing coverage data
        """
        with open(html_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            
        endpoints = []
        total_requests = 0
        total_successes = 0
        
        for endpoint_div in soup.find_all('div', class_='endpoint_path'):
            path = endpoint_div.get_text().strip()
            methods = {}
            
            for method_div in endpoint_div.find_all('div', recursive=False):
                method = method_div.get_text().strip()
                status_codes = {}
                method_requests = 0
                method_successes = 0
                
                for link in method_div.find_all('a', class_=['c-hit', 'c-miss', 'c-extra']):
                    status = re.search(r'(\d{3})', link.get_text())
                    if status:
                        status_code = status.group(1)
                        count = int(re.search(r'\((\d+) hits?\)', link.get_text()).group(1))
                        status_codes[status_code] = count
                        method_requests += count
                        if status_code.startswith('2'):
                            method_successes += count
                
                methods[method] = {
                    'total_requests': method_requests,
                    'success_count': method_successes,
                    'status_codes': status_codes
                }
                
                total_requests += method_requests
                total_successes += method_successes
            
            for method, stats in methods.items():
                endpoints.append({
                    'path': path,
                    'method': method,
                    'statistics': {
                        'total_requests': stats['total_requests'],
                        'success_count': stats['success_count'],
                        'success_rate': (stats['success_count'] / stats['total_requests'] * 100) if stats['total_requests'] > 0 else 0,
                        'status_codes': stats['status_codes']
                    }
                })
                
        return {
            'endpoints': endpoints,
            'total_requests': total_requests,
            'success_count': total_successes,
            'success_rate': (total_successes / total_requests * 100) if total_requests > 0 else 0
        }

    def _transform_metadata(self, raw_data: Dict[str, Any]) -> TestMetadata:
        """Transform WuppieFuzz metadata to standard format.
        
        Args:
            raw_data: Raw WuppieFuzz output data
            
        Returns:
            Standardized test metadata
        """
        coverage = raw_data['coverage']
        metrics = raw_data['metrics']
        timestamp = raw_data['timestamp']
        
        # Calculate critical issues (500 errors)
        critical_issues = 0
        for endpoint in coverage['endpoints']:
            for status_code, count in endpoint['statistics']['status_codes'].items():
                if status_code.startswith('5'):
                    critical_issues += count
        
        return TestMetadata(
            timestamp=self._parse_timestamp(timestamp),
            total_requests=coverage['total_requests'],
            success_count=coverage['success_count'],
            failure_count=coverage['total_requests'] - coverage['success_count'],
            fuzzer_info={
                'name': 'WuppieFuzz',
                'duration': '0',  # Not available
                'critical_issues': critical_issues
            },
            summary={
                'endpoints_tested': len(coverage['endpoints']),
                'success_rate': coverage['success_rate'],
                'coverage': {
                    'lines': metrics['lines'],
                    'functions': metrics['functions'],
                    'branches': metrics['branches'],
                    'statements': metrics['statements']
                }
            }
        )

    def _transform_endpoints(self, raw_data: Dict[str, Any]) -> List[StandardizedEndpoint]:
        """Transform endpoint data to standard format.
        
        Args:
            raw_data: Raw WuppieFuzz output data
            
        Returns:
            List of standardized endpoints
        """
        endpoints = []
        
        for endpoint_data in raw_data['coverage']['endpoints']:
            # Create statistics
            stats = EndpointStatistics()
            stats.total_requests = endpoint_data['statistics']['total_requests']
            stats.success_count = endpoint_data['statistics']['success_count']
            stats.failure_count = stats.total_requests - stats.success_count
            stats.success_rate = endpoint_data['statistics']['success_rate']
            stats.status_codes = endpoint_data['statistics']['status_codes']
            
            # Create endpoint
            endpoint = StandardizedEndpoint(
                path=endpoint_data['path'],
                method=endpoint_data['method'],
                statistics=stats
            )
            
            endpoints.append(endpoint)
        
        return endpoints

    def _transform_test_cases(self, raw_data: Dict[str, Any]) -> List[StandardizedTestCase]:
        """Transform test cases to standard format.
        
        Args:
            raw_data: Raw WuppieFuzz output data
            
        Returns:
            List of standardized test cases
        """
        test_cases = []
        case_id = 0
        
        # Create test cases from endpoint coverage data
        for endpoint in raw_data['coverage']['endpoints']:
            path = endpoint['path']
            method = endpoint['method']
            status_codes = endpoint['statistics']['status_codes']
            
            for status_code, count in status_codes.items():
                for _ in range(count):
                    case_id += 1
                    
                    # Create request
                    request = StandardizedRequest(
                        method=method,
                        path=path,
                        headers={},  # Not available in HTML output
                        body=None    # Not available in HTML output
                    )
                    
                    # Create response
                    response = StandardizedResponse(
                        status_code=int(status_code),
                        headers={},  # Not available in HTML output
                        body=None,   # Not available in HTML output
                        error_type='fault' if not status_code.startswith('2') else None
                    )
                    
                    # Create test case
                    test_case = StandardizedTestCase(
                        id=f'test_{case_id}',
                        name=f'{method} {path} - {status_code}',
                        request=request,
                        response=response,
                        type='success' if status_code.startswith('2') else 'fault'
                    )
                    
                    test_cases.append(test_case)
        
        return test_cases
