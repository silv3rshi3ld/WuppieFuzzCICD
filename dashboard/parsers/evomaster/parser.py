"""Parser for EvoMaster results."""

import os
import re
import ast
from datetime import datetime
from typing import Any, Dict, List, Tuple, Optional

from ..base.json_chunker import JsonChunker
from ..base.json_validator import JsonValidator

class EvoMasterParser:
    """Parser for EvoMaster output data."""
    
    def __init__(self, input_path: str, output_dir: str):
        """Initialize the parser.
        
        Args:
            input_path: Path to EvoMaster output directory
            output_dir: Directory to save parsed results
        """
        self.input_path = input_path
        self.output_dir = output_dir
        self.chunker = JsonChunker(output_dir, 'Evomaster')
        self.validator = JsonValidator()
        
    def parse(self) -> bool:
        """Parse EvoMaster results and generate standardized output.
        
        Returns:
            bool: True if parsing was successful
        """
        try:
            # Check for test files
            test_files = {
                'success': os.path.join(self.input_path, 'EvoMaster_successes_Test.py'),
                'fault': os.path.join(self.input_path, 'EvoMaster_faults_Test.py'),
                'other': os.path.join(self.input_path, 'EvoMaster_others_Test.py')
            }
            
            # At minimum we need either successes or faults
            if not os.path.exists(test_files['success']) and not os.path.exists(test_files['fault']):
                raise FileNotFoundError("No test files found")
            
            # Parse all available test files
            all_test_cases = []
            start_time = None
            end_time = None
            
            for test_type, file_path in test_files.items():
                if os.path.exists(file_path):
                    cases, file_start, file_end = self._parse_test_file(file_path, test_type)
                    all_test_cases.extend(cases)
                    
                    # Track execution timeframe
                    if file_start and (not start_time or file_start < start_time):
                        start_time = file_start
                    if file_end and (not end_time or file_end > end_time):
                        end_time = file_end
            
            if not all_test_cases:
                raise ValueError("No test cases found in test files")
            
            # Generate and validate metadata
            metadata = self._generate_metadata(all_test_cases, start_time, end_time)
            metadata_errors = self.validator.validate_metadata(metadata)
            if metadata_errors:
                for error in metadata_errors:
                    print(f"Metadata validation error: {error.path} - {error.message}")
                return False
            
            # Save metadata
            self.chunker.save_metadata(metadata)
            
            # Transform and validate endpoints
            endpoints = self._extract_endpoints(all_test_cases)
            for endpoint in endpoints:
                endpoint_errors = self.validator.validate_endpoint(endpoint)
                if endpoint_errors:
                    for error in endpoint_errors:
                        print(f"Endpoint validation error: {error.path} - {error.message}")
                    return False
            
            # Save endpoints in chunks
            self.chunker.chunk_endpoints(endpoints)
            
            # Transform test cases to standard format
            standardized_tests = self._transform_test_cases(all_test_cases)
            for test_case in standardized_tests:
                test_case_errors = self.validator.validate_test_case(test_case)
                if test_case_errors:
                    for error in test_case_errors:
                        print(f"Test case validation error: {error.path} - {error.message}")
                    return False
            
            # Save test cases in chunks
            self.chunker.chunk_test_cases(standardized_tests)
            
            return True
            
        except FileNotFoundError as e:
            print(f"File not found error: {str(e)}")
            return False
        except (ValueError, AttributeError) as e:
            print(f"Data processing error: {str(e)}")
            return False
    
    def _parse_test_file(self, file_path: str, test_type: str) -> Tuple[List[Dict[str, Any]], Optional[datetime], Optional[datetime]]:
        """Parse a Python test file and extract test information.
        
        Args:
            file_path: Path to the test file
            test_type: Type of tests ('success', 'fault', or 'other')
        
        Returns:
            Tuple containing:
            - List of test case dictionaries
            - Start time of first test (or None)
            - End time of last test (or None)
        """
        test_cases = []
        current_test = None
        start_time = None
        end_time = None
        
        with open(file_path, 'r') as f:
            lines = f.readlines()
        
        for line_num, line in enumerate(lines):
            # Look for timestamp comments
            time_match = re.search(r'# Generated on: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})', line)
            if time_match and not start_time:
                start_time = datetime.fromisoformat(time_match.group(1))
            
            # Start of a test method
            if line.strip().startswith('def test_'):
                if current_test:
                    test_cases.append(current_test)
                
                test_name = line.strip().split('def ')[1].split('(')[0]
                current_test = {
                    'name': test_name,
                    'type': test_type,
                    'method': None,
                    'endpoint': None,
                    'status_code': None,
                    'request_data': {},
                    'response_data': {},
                    'assertions': [],
                    'line_number': line_num + 1
                }
            
            if not current_test:
                continue
            
            # Extract HTTP method and endpoint
            if '# (' in line and ')' in line:
                match = re.search(r'# \((\d+)\) (GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS):([^\s]+)', line)
                if match:
                    status, method, endpoint = match.groups()
                    current_test['status_code'] = int(status)
                    current_test['method'] = method
                    current_test['endpoint'] = endpoint.strip()
            
            # Extract request data
            if 'data=' in line or 'json=' in line:
                data_match = re.search(r'(data|json)=({[^}]+})', line)
                if data_match:
                    try:
                        data_type, data_str = data_match.groups()
                        current_test['request_data'][data_type] = ast.literal_eval(data_str)
                    except (SyntaxError, ValueError):
                        print(f"Warning: Could not parse request data in {test_name}")
            
            # Extract headers
            if '.headers=' in line:
                headers_match = re.search(r'\.headers=({[^}]+})', line)
                if headers_match:
                    try:
                        headers_str = headers_match.group(1)
                        current_test['request_data']['headers'] = ast.literal_eval(headers_str)
                    except (SyntaxError, ValueError):
                        print(f"Warning: Could not parse headers in {test_name}")
            
            # Extract assertions
            if 'assert' in line:
                assertion = line.strip()
                current_test['assertions'].append(assertion)
                
                # Try to extract expected response data from assertions
                status_match = re.search(r'assert.*status.*==\s*(\d+)', line)
                if status_match:
                    current_test['status_code'] = int(status_match.group(1))
                
                body_match = re.search(r'assert.*body.*==\s*({[^}]+})', line)
                if body_match:
                    try:
                        body_str = body_match.group(1)
                        current_test['response_data']['body'] = ast.literal_eval(body_str)
                    except (SyntaxError, ValueError):
                        print(f"Warning: Could not parse response body in {test_name}")
        
        # Add the last test case
        if current_test:
            test_cases.append(current_test)
            end_time = datetime.now()  # Use current time as end time for last test
        
        return test_cases, start_time, end_time
    
    def _generate_metadata(
        self,
        test_cases: List[Dict[str, Any]],
        start_time: Optional[datetime],
        end_time: Optional[datetime]
    ) -> Dict[str, Any]:
        """Generate metadata from test cases.
        
        Args:
            test_cases: List of test cases
            start_time: Start time of test execution
            end_time: End time of test execution
        
        Returns:
            Metadata dictionary
        """
        success_cases = [tc for tc in test_cases if tc['type'] == 'success']
        fault_cases = [tc for tc in test_cases if tc['type'] == 'fault']
        total_requests = len(test_cases)
        critical_issues = sum(1 for tc in fault_cases if tc.get('status_code', 0) >= 500)
        
        # Calculate duration if we have both timestamps
        duration = '0:00:00'
        if start_time and end_time:
            duration = str(end_time - start_time)
        
        return {
            'fuzzer': {
                'name': 'Evomaster',
                'timestamp': start_time.isoformat() if start_time else datetime.now().isoformat(),
                'duration': duration,
                'total_requests': total_requests,
                'critical_issues': critical_issues
            },
            'summary': {
                'endpoints_tested': len(self._get_unique_endpoints(test_cases)),
                'success_rate': len(success_cases) / total_requests * 100 if total_requests > 0 else 0,
                'coverage': {
                    'lines': 0,      # EvoMaster doesn't provide these metrics
                    'functions': 0,   # in the test files, but they might
                    'branches': 0,    # be available in other output files
                    'statements': 0   # that we could parse later
                }
            }
        }
    
    def _get_unique_endpoints(self, test_cases: List[Dict[str, Any]]) -> List[Tuple[str, str]]:
        """Get unique endpoint-method combinations.
        
        Args:
            test_cases: List of test cases
        
        Returns:
            List of unique (endpoint, method) tuples
        """
        unique = set()
        for tc in test_cases:
            if tc.get('endpoint') and tc.get('method'):
                unique.add((tc['endpoint'], tc['method']))
        return list(unique)
    
    def _extract_endpoints(self, test_cases: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Extract endpoint information from test cases.
        
        Args:
            test_cases: List of test cases
        
        Returns:
            List of endpoint dictionaries
        """
        endpoints_dict = {}
        
        for test_case in test_cases:
            if not test_case.get('endpoint') or not test_case.get('method'):
                continue
                
            key = (test_case['endpoint'], test_case['method'])
            if key not in endpoints_dict:
                endpoints_dict[key] = {
                    'path': test_case['endpoint'],
                    'method': test_case['method'],
                    'statistics': {
                        'total_requests': 0,
                        'success_rate': 0,
                        'status_codes': {}
                    }
                }
            
            # Update statistics
            stats = endpoints_dict[key]['statistics']
            stats['total_requests'] += 1
            status = str(test_case.get('status_code', 0))
            stats['status_codes'][status] = stats['status_codes'].get(status, 0) + 1
        
        # Calculate success rates
        for endpoint in endpoints_dict.values():
            stats = endpoint['statistics']
            success_count = sum(
                count for status, count in stats['status_codes'].items()
                if status.startswith('2')
            )
            stats['success_rate'] = (
                success_count / stats['total_requests'] * 100
                if stats['total_requests'] > 0 else 0
            )
        
        return list(endpoints_dict.values())
    
    def _transform_test_cases(self, test_cases: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Transform test cases to standardized format.
        
        Args:
            test_cases: List of raw test case data
        
        Returns:
            List of standardized test case dictionaries
        """
        transformed = []
        for idx, test_case in enumerate(test_cases):
            if not test_case.get('endpoint') or not test_case.get('method'):
                continue
                
            transformed.append({
                'id': f"test_{idx}",
                'name': test_case['name'],
                'endpoint': test_case['endpoint'],
                'method': test_case['method'],
                'type': test_case['type'],
                'request': {
                    'headers': test_case.get('request_data', {}).get('headers', {}),
                    'data': {
                        k: v for k, v in test_case.get('request_data', {}).items()
                        if k != 'headers'
                    }
                },
                'response': {
                    'status_code': test_case.get('status_code', 0),
                    'headers': test_case.get('response_data', {}).get('headers', {}),
                    'body': test_case.get('response_data', {}).get('body', {})
                }
            })
        return transformed
