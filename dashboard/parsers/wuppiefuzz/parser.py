"""Parser for WuppieFuzz results."""

import os
import re
from datetime import datetime
from typing import Any, Dict, List
from bs4 import BeautifulSoup

from ..base.json_chunker import JsonChunker
from ..base.json_validator import JsonValidator
from ..base.zip_handler import find_timestamp_directory

class WuppieFuzzParser:
    """Parser for WuppieFuzz output data."""
    
    def __init__(self, input_path: str, output_dir: str):
        """Initialize the parser.
        
        Args:
            input_path: Path to WuppieFuzz output directory
            output_dir: Directory to save parsed results
        """
        self.input_path = input_path
        self.output_dir = output_dir
        self.chunker = JsonChunker(output_dir, 'WuppieFuzz')
        self.validator = JsonValidator()
        
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
        for endpoint_div in soup.find_all('div', class_='endpoint_path'):
            path = endpoint_div.get_text().strip()
            methods = {}
            
            for method_div in endpoint_div.find_all('div', recursive=False):
                method = method_div.get_text().strip()
                status_codes = {}
                
                for link in method_div.find_all('a', class_=['c-hit', 'c-miss', 'c-extra']):
                    status = re.search(r'(\d{3})', link.get_text())
                    if status:
                        status_code = status.group(1)
                        status_codes[status_code] = status_codes.get(status_code, 0) + 1
                
                methods[method] = {
                    'total_requests': sum(status_codes.values()),
                    'status_codes': status_codes
                }
            
            for method, stats in methods.items():
                endpoints.append({
                    'path': path,
                    'method': method,
                    'statistics': {
                        'total_requests': stats['total_requests'],
                        'success_rate': self._calculate_success_rate(stats['status_codes']),
                        'status_codes': stats['status_codes']
                    }
                })
                
        return {
            'endpoints': endpoints,
            'total_requests': sum(e['statistics']['total_requests'] for e in endpoints),
            'success_rate': sum(e['statistics']['success_rate'] for e in endpoints) / len(endpoints) if endpoints else 0
        }
        
    def parse(self) -> bool:
        """Parse WuppieFuzz results and generate standardized output.
        
        Returns:
            bool: True if parsing was successful
        """
        try:
            # Find timestamp directory
            timestamp_dir = find_timestamp_directory(self.input_path)
            if not timestamp_dir:
                raise FileNotFoundError("Could not find timestamp directory")
            
            # Parse HTML coverage data
            coverage_file = os.path.join(timestamp_dir, 'endpointcoverage', 'index.html')
            if not os.path.exists(coverage_file):
                raise FileNotFoundError(f"Coverage file not found at {coverage_file}")
            
            coverage_data = self._parse_html_coverage(coverage_file)
            
            # Generate metadata
            metadata = {
                'fuzzer': {
                    'name': 'WuppieFuzz',
                    'timestamp': os.path.basename(timestamp_dir),
                    'duration': '0:00:00',  # Duration not available in HTML
                    'total_requests': coverage_data['total_requests'],
                    'critical_issues': sum(
                        1 for e in coverage_data['endpoints']
                        for count in e['statistics']['status_codes'].items()
                        if count[0].startswith('5')
                    )
                },
                'summary': {
                    'endpoints_tested': len(coverage_data['endpoints']),
                    'success_rate': coverage_data['success_rate'],
                    'coverage': {
                        'lines': 0,      # Not available in HTML
                        'functions': 0,   
                        'branches': 0,    
                        'statements': 0   
                    }
                }
            }
            
            # Validate metadata
            metadata_errors = self.validator.validate_metadata(metadata)
            if metadata_errors:
                for error in metadata_errors:
                    print(f"Metadata validation error: {error.path} - {error.message}")
                return False
            
            # Save metadata
            self.chunker.save_metadata(metadata)
            
            # Validate endpoints
            endpoints = coverage_data['endpoints']
            for endpoint in endpoints:
                endpoint_errors = self.validator.validate_endpoint(endpoint)
                if endpoint_errors:
                    for error in endpoint_errors:
                        print(f"Endpoint validation error: {error.path} - {error.message}")
                    return False
            
            # Save endpoints in chunks
            self.chunker.chunk_endpoints(endpoints)
            
            # Transform test cases from HTML data
            test_cases = self._transform_test_cases(coverage_data['endpoints'])
            for test_case in test_cases:
                test_case_errors = self.validator.validate_test_case(test_case)
                if test_case_errors:
                    for error in test_case_errors:
                        print(f"Test case validation error: {error.path} - {error.message}")
                    return False
            
            # Save test cases in chunks
            self.chunker.chunk_test_cases(test_cases)
            
            return True
            
        except FileNotFoundError as e:
            print(f"File not found error: {str(e)}")
            return False
        except (ValueError, AttributeError) as e:
            print(f"Data processing error: {str(e)}")
            return False
    
    def _calculate_success_rate(self, status_codes: Dict[str, int]) -> float:
        """Calculate success rate from status codes.
        
        Args:
            status_codes: Dictionary mapping status codes to counts
            
        Returns:
            Success rate as percentage
        """
        total = sum(status_codes.values())
        if total == 0:
            return 0.0
            
        success = sum(
            count for code, count in status_codes.items()
            if code.startswith('2')
        )
        
        return round((success / total * 100), 2)
    
    def _transform_test_cases(self, endpoints: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Transform endpoint data into test cases.
        
        Args:
            endpoints: List of endpoint data
            
        Returns:
            List of standardized test cases
        """
        test_cases = []
        case_id = 0
        
        for endpoint in endpoints:
            path = endpoint['path']
            method = endpoint['method']
            status_codes = endpoint['statistics']['status_codes']
            
            for status_code, count in status_codes.items():
                for _ in range(count):
                    case_id += 1
                    test_cases.append({
                        'id': f'test_{case_id}',
                        'name': f'{method} {path} - {status_code}',
                        'endpoint': path,
                        'method': method,
                        'type': 'success' if status_code.startswith('2') else 'fault',
                        'request': {
                            'headers': {},
                            'data': {}
                        },
                        'response': {
                            'status_code': int(status_code),
                            'headers': {},
                            'body': {}
                        }
                    })
                    
        return test_cases
