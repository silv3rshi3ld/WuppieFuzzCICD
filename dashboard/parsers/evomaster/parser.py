"""Parser for EvoMaster results."""

import os
import re
import ast
from datetime import datetime
from typing import Dict, List, Any, Tuple

from ..base.base_parser import BaseParser
from ..base.standardized_types import (
    StandardizedRequest,
    StandardizedResponse,
    TestMetadata,
    StandardizedTestCase,
    StandardizedEndpoint,
    EndpointStatistics
)

class EvoMasterParser(BaseParser):
    """Parser for EvoMaster output data."""
    
    def __init__(self, input_path: str, output_dir: str):
        """Initialize parser.
        
        Args:
            input_path: Path to EvoMaster output directory
            output_dir: Directory to save parsed results
        """
        super().__init__(input_path, output_dir, 'EvoMaster')

    def _load_raw_data(self) -> Dict[str, Any]:
        """Load raw data from EvoMaster output.
        
        Returns:
            Dict containing raw fuzzer output data
            
        Raises:
            FileNotFoundError: If required files are missing
            ValueError: If data is invalid
        """
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
        coverage_data = {}
        
        for test_type, file_path in test_files.items():
            if os.path.exists(file_path):
                cases, file_start, file_end, file_coverage = self._parse_test_file(file_path, test_type)
                all_test_cases.extend(cases)
                
                # Track execution timeframe
                if file_start and (not start_time or file_start < start_time):
                    start_time = file_start
                if file_end and (not end_time or file_end > end_time):
                    end_time = file_end
                    
                # Merge coverage data
                for metric, value in file_coverage.items():
                    coverage_data[metric] = max(coverage_data.get(metric, 0), value)
        
        if not all_test_cases:
            raise ValueError("No test cases found in test files")
            
        return {
            'test_cases': all_test_cases,
            'start_time': start_time,
            'end_time': end_time,
            'coverage': coverage_data
        }

    def _parse_test_file(
        self,
        file_path: str,
        test_type: str
    ) -> Tuple[List[Dict[str, Any]], datetime, datetime, Dict[str, int]]:
        """Parse a Python test file and extract test information.
        
        Args:
            file_path: Path to the test file
            test_type: Type of tests ('success', 'fault', or 'other')
            
        Returns:
            Tuple containing:
            - List of test case dictionaries
            - Start time of first test
            - End time of last test
            - Coverage data dictionary
        """
        test_cases = []
        current_test = None
        start_time = None
        end_time = None
        coverage = {
            'lines': 0,
            'functions': 0,
            'branches': 0,
            'statements': 0
        }
        
        with open(file_path, 'r') as f:
            lines = f.readlines()
        
        for line_num, line in enumerate(lines):
            # Look for timestamp comments
            time_match = re.search(r'# Generated on: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})', line)
            if time_match and not start_time:
                start_time = datetime.fromisoformat(time_match.group(1))
            
            # Look for coverage information
            coverage_match = re.search(r'# Coverage: (\d+)% lines, (\d+)% functions, (\d+)% branches', line)
            if coverage_match:
                coverage['lines'] = int(coverage_match.group(1))
                coverage['functions'] = int(coverage_match.group(2))
                coverage['branches'] = int(coverage_match.group(3))
                coverage['statements'] = coverage['lines']  # Use line coverage as statement coverage
            
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
                        self.logger.warning(f"Could not parse request data in {test_name}")
            
            # Extract headers
            if '.headers=' in line:
                headers_match = re.search(r'\.headers=({[^}]+})', line)
                if headers_match:
                    try:
                        headers_str = headers_match.group(1)
                        current_test['request_data']['headers'] = ast.literal_eval(headers_str)
                    except (SyntaxError, ValueError):
                        self.logger.warning(f"Could not parse headers in {test_name}")
            
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
                        self.logger.warning(f"Could not parse response body in {test_name}")
        
        # Add the last test case
        if current_test:
            test_cases.append(current_test)
            end_time = datetime.now()  # Use current time as end time for last test
        
        return test_cases, start_time, end_time, coverage

    def _transform_metadata(self, raw_data: Dict[str, Any]) -> TestMetadata:
        """Transform EvoMaster metadata to standard format.
        
        Args:
            raw_data: Raw EvoMaster output data
            
        Returns:
            Standardized test metadata
        """
        test_cases = raw_data['test_cases']
        success_cases = [tc for tc in test_cases if tc['type'] == 'success']
        fault_cases = [tc for tc in test_cases if tc['type'] == 'fault']
        
        # Calculate duration
        start_time = raw_data['start_time'] or datetime.now()
        end_time = raw_data['end_time'] or datetime.now()
        duration = str(end_time - start_time)
        
        # Calculate critical issues (500 errors)
        critical_issues = sum(
            1 for tc in test_cases
            if tc.get('status_code', 0) >= 500
        )
        
        return TestMetadata(
            timestamp=start_time,
            total_requests=len(test_cases),
            success_count=len(success_cases),
            failure_count=len(fault_cases),
            fuzzer_info={
                'name': 'EvoMaster',
                'duration': duration,
                'critical_issues': critical_issues
            },
            summary={
                'endpoints_tested': len(set((tc['endpoint'], tc['method']) for tc in test_cases if tc.get('endpoint') and tc.get('method'))),
                'success_rate': (len(success_cases) / len(test_cases) * 100) if test_cases else 0,
                'coverage': raw_data.get('coverage', {
                    'lines': 0,
                    'functions': 0,
                    'branches': 0,
                    'statements': 0
                })
            }
        )

    def _transform_endpoints(self, raw_data: Dict[str, Any]) -> List[StandardizedEndpoint]:
        """Transform endpoint data to standard format.
        
        Args:
            raw_data: Raw EvoMaster output data
            
        Returns:
            List of standardized endpoints
        """
        endpoints = {}  # Dict[Tuple[str, str], StandardizedEndpoint]
        
        # Process test cases to get endpoint information
        for test_case in raw_data['test_cases']:
            if not test_case.get('endpoint') or not test_case.get('method'):
                continue
                
            key = (test_case['endpoint'], test_case['method'])
            if key not in endpoints:
                endpoints[key] = StandardizedEndpoint(
                    path=test_case['endpoint'],
                    method=test_case['method'],
                    statistics=EndpointStatistics()
                )
            
            # Update statistics
            status_code = test_case.get('status_code', 0)
            endpoints[key].statistics.total_requests += 1
            if 200 <= status_code < 300:
                endpoints[key].statistics.success_count += 1
            else:
                endpoints[key].statistics.failure_count += 1
            
            # Update status code counts
            status_str = str(status_code)
            if status_str in endpoints[key].statistics.status_codes:
                endpoints[key].statistics.status_codes[status_str] += 1
            else:
                endpoints[key].statistics.status_codes[status_str] = 1
                
            # Calculate success rate
            stats = endpoints[key].statistics
            stats.success_rate = (stats.success_count / stats.total_requests * 100) if stats.total_requests > 0 else 0
        
        return list(endpoints.values())

    def _transform_test_cases(self, raw_data: Dict[str, Any]) -> List[StandardizedTestCase]:
        """Transform test cases to standard format.
        
        Args:
            raw_data: Raw EvoMaster output data
            
        Returns:
            List of standardized test cases
        """
        test_cases = []
        
        for i, case in enumerate(raw_data['test_cases']):
            if not case.get('endpoint') or not case.get('method'):
                continue
            
            # Create request
            request = StandardizedRequest(
                method=case['method'],
                path=case['endpoint'],
                headers=case.get('request_data', {}).get('headers', {}),
                body=str(case.get('request_data', {}).get('body', ''))
            )
            
            # Create response
            response = StandardizedResponse(
                status_code=case.get('status_code', 0),
                headers=case.get('response_data', {}).get('headers', {}),
                body=str(case.get('response_data', {}).get('body', '')),
                error_type='fault' if case['type'] == 'fault' else None
            )
            
            # Create test case
            test_case = StandardizedTestCase(
                id=f"test_{i+1}",
                name=case['name'],
                request=request,
                response=response,
                type=case['type']
            )
            
            test_cases.append(test_case)
        
        return test_cases
