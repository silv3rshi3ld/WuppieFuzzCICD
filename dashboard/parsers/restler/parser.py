"""Parser for RESTler results."""

import os
import json
import glob
from datetime import datetime
from typing import Dict, List, Any

from ..base.base_parser import BaseParser
from ..base.standardized_types import (
    StandardizedRequest,
    StandardizedResponse,
    TestMetadata,
    StandardizedTestCase,
    StandardizedEndpoint,
    EndpointStatistics
)

class RestlerParser(BaseParser):
    """Parser for RESTler output data."""
    
    def __init__(self, input_path: str, output_dir: str):
        """Initialize parser.
        
        Args:
            input_path: Path to RESTler output directory
            output_dir: Directory to save parsed results
        """
        super().__init__(input_path, output_dir, 'Restler')

    def _load_raw_data(self) -> Dict[str, Any]:
        """Load raw data from RESTler output.
        
        Returns:
            Dict containing raw fuzzer output data
            
        Raises:
            FileNotFoundError: If required files are missing
            json.JSONDecodeError: If JSON parsing fails
            ValueError: If data is invalid
        """
        # Find experiment directories
        experiment_pattern = os.path.join(self.input_path, 'RestlerResults', 'experiment*')
        experiment_dirs = sorted(glob.glob(experiment_pattern))
        if not experiment_dirs:
            raise FileNotFoundError("No experiment directories found")
            
        # Load response data
        response_data = self._load_response_data()
        if not response_data:
            raise FileNotFoundError("No response data found")
            
        # Load bugs from all experiments
        all_bugs = []
        coverage_data = {}
        for exp_dir in experiment_dirs:
            bugs = self._load_bug_buckets(exp_dir)
            all_bugs.extend(bugs)
            
            # Load coverage data from experiment
            exp_coverage = self._load_experiment_coverage(exp_dir)
            coverage_data.update(exp_coverage)
            
        return {
            'response_data': response_data,
            'bugs': all_bugs,
            'coverage': coverage_data
        }

    def _load_experiment_coverage(self, experiment_dir: str) -> Dict[str, int]:
        """Load coverage data from experiment directory.
        
        Args:
            experiment_dir: Path to experiment directory
            
        Returns:
            Dictionary containing coverage data
        """
        coverage = {
            'lines': 0,
            'functions': 0,
            'branches': 0,
            'statements': 0
        }
        
        # Try to load coverage from experiment logs
        log_file = os.path.join(experiment_dir, 'EngineStdOut.txt')
        if os.path.exists(log_file):
            with open(log_file, 'r') as f:
                log_content = f.read()
                
                # Extract coverage metrics from log
                if 'Coverage:' in log_content:
                    coverage_section = log_content.split('Coverage:')[1].split('\n')[0]
                    try:
                        # Parse coverage percentages
                        coverage['lines'] = int(coverage_section.split('lines:')[1].split('%')[0].strip())
                        coverage['functions'] = int(coverage_section.split('functions:')[1].split('%')[0].strip())
                        coverage['branches'] = int(coverage_section.split('branches:')[1].split('%')[0].strip())
                        coverage['statements'] = coverage['lines']  # Use line coverage as statement coverage
                    except (IndexError, ValueError):
                        pass
                        
        return coverage

    def _load_response_data(self) -> Dict[str, Any]:
        """Load response bucket data.
        
        Returns:
            Dict containing summary and error buckets
        """
        response_data = {}
        
        # Load runSummary.json
        summary_file = os.path.join(self.input_path, 'ResponseBuckets', 'runSummary.json')
        if os.path.exists(summary_file):
            with open(summary_file, 'r') as f:
                response_data['summary'] = json.load(f)
                
        # Load errorBuckets.json
        error_file = os.path.join(self.input_path, 'ResponseBuckets', 'errorBuckets.json')
        if os.path.exists(error_file):
            with open(error_file, 'r') as f:
                response_data['errors'] = json.load(f)
                
        return response_data

    def _load_bug_buckets(self, experiment_dir: str) -> List[Dict[str, Any]]:
        """Load bug bucket data from an experiment directory.
        
        Args:
            experiment_dir: Path to experiment directory
            
        Returns:
            List of bug data dictionaries
        """
        bugs = []
        bug_buckets_dir = os.path.join(experiment_dir, 'bug_buckets')
        
        # Load Bugs.json
        bugs_file = os.path.join(bug_buckets_dir, 'Bugs.json')
        if os.path.exists(bugs_file):
            with open(bugs_file, 'r') as f:
                bug_list = json.load(f)
                if isinstance(bug_list, list):
                    bugs.extend(bug_list)
        
        # Load individual bug bucket files
        bucket_files = glob.glob(os.path.join(bug_buckets_dir, '*.json'))
        for file in bucket_files:
            if os.path.basename(file) != 'Bugs.json':
                with open(file, 'r') as f:
                    bug_data = json.load(f)
                    if isinstance(bug_data, dict):
                        # Extract bug type from filename
                        bug_type = os.path.splitext(os.path.basename(file))[0]
                        bug_data['bug_type'] = bug_type
                        bugs.append(bug_data)
                        
        return bugs

    def _transform_metadata(self, raw_data: Dict[str, Any]) -> TestMetadata:
        """Transform RESTler metadata to standard format.
        
        Args:
            raw_data: Raw RESTler output data
            
        Returns:
            Standardized test metadata
        """
        summary = raw_data['response_data'].get('summary', {})
        errors = raw_data['response_data'].get('errors', {})
        coverage = raw_data.get('coverage', {})
        
        # Count total requests and successes
        total_requests = summary.get('total_requests', 0)
        success_requests = summary.get('success_requests', 0)
        
        # Add requests from error buckets
        for error_data in errors.values():
            if isinstance(error_data, list):
                for error in error_data:
                    if isinstance(error, dict):
                        total_requests += error.get('count', 1)
            elif isinstance(error_data, dict):
                total_requests += error_data.get('count', 1)
        
        # Calculate critical issues (500 errors)
        critical_issues = 0
        for error_type, error_data in errors.items():
            if '_500_' in error_type:
                if isinstance(error_data, list):
                    critical_issues += sum(error.get('count', 1) for error in error_data)
                else:
                    critical_issues += error_data.get('count', 1)
        
        # Add critical issues from bug buckets
        for bug in raw_data['bugs']:
            if self._extract_status_code(bug) >= 500:
                critical_issues += 1
        
        # Calculate unique endpoints
        unique_endpoints = set()
        for bug in raw_data['bugs']:
            endpoint = bug.get('endpoint')
            verb = bug.get('verb')
            if endpoint and verb:
                unique_endpoints.add((endpoint, verb))
        
        return TestMetadata(
            timestamp=datetime.fromisoformat(summary.get('start_time', datetime.now().isoformat())),
            total_requests=total_requests,
            success_count=success_requests,
            failure_count=total_requests - success_requests,
            fuzzer_info={
                'name': 'Restler',
                'duration': summary.get('duration', '0'),
                'critical_issues': critical_issues
            },
            summary={
                'endpoints_tested': len(unique_endpoints),
                'success_rate': (success_requests / total_requests * 100) if total_requests > 0 else 0,
                'coverage': {
                    'lines': coverage.get('lines', 0),
                    'functions': coverage.get('functions', 0),
                    'branches': coverage.get('branches', 0),
                    'statements': coverage.get('statements', 0)
                }
            }
        )

    def _transform_endpoints(self, raw_data: Dict[str, Any]) -> List[StandardizedEndpoint]:
        """Transform endpoint data to standard format.
        
        Args:
            raw_data: Raw RESTler output data
            
        Returns:
            List of standardized endpoints
        """
        endpoints = {}  # Dict[Tuple[str, str], StandardizedEndpoint]
        
        # Process error buckets to get status codes
        errors = raw_data['response_data'].get('errors', {})
        for error_type, error_data in errors.items():
            if isinstance(error_data, list):
                for error in error_data:
                    if isinstance(error, dict):
                        self._process_error_data(error, error_type, endpoints)
            elif isinstance(error_data, dict):
                self._process_error_data(error_data, error_type, endpoints)
        
        # Process bugs to get additional endpoints
        for bug in raw_data['bugs']:
            endpoint = bug.get('endpoint')
            verb = bug.get('verb')
            if endpoint and verb:
                key = (endpoint, verb.upper())
                if key not in endpoints:
                    endpoints[key] = StandardizedEndpoint(
                        path=endpoint,
                        method=verb.upper(),
                        statistics=EndpointStatistics()
                    )
                
                # Update statistics
                status_code = self._extract_status_code(bug)
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
            raw_data: Raw RESTler output data
            
        Returns:
            List of standardized test cases
        """
        test_cases = []
        
        # Transform bug cases
        for i, bug in enumerate(raw_data['bugs']):
            endpoint = bug.get('endpoint')
            verb = bug.get('verb')
            if not endpoint or not verb:
                continue
            
            # Extract basic info
            method = verb.upper()
            status_code = self._extract_status_code(bug)
            
            # Create request
            request = StandardizedRequest(
                method=method,
                path=endpoint,
                headers=bug.get('request_headers', {}) if 'request_headers' in bug else bug.get('request', {}).get('headers', {}),
                body=bug.get('request_data', '') if 'request_data' in bug else bug.get('request', {}).get('body', '')
            )
            
            # Create response
            response = StandardizedResponse(
                status_code=status_code,
                headers=bug.get('response_headers', {}) if 'response_headers' in bug else bug.get('response', {}).get('headers', {}),
                body=bug.get('response_body', '') if 'response_body' in bug else bug.get('response', {}).get('body', ''),
                error_type='fault' if status_code >= 400 else None
            )
            
            # Create test case
            test_case = StandardizedTestCase(
                id=f"bug_{i+1}",
                name=bug.get('bug_type', 'Unknown Bug'),
                request=request,
                response=response,
                type='fault'
            )
            
            test_cases.append(test_case)
        
        return test_cases

    def _process_error_data(
        self,
        error: Dict[str, Any],
        error_type: str,
        endpoints: Dict[tuple, StandardizedEndpoint]
    ) -> None:
        """Process error data to update endpoint statistics.
        
        Args:
            error: Error data dictionary
            error_type: Type of error
            endpoints: Dictionary of endpoints to update
        """
        path = error.get('endpoint')
        method = error.get('verb')
        if not path or not method:
            return
            
        method = method.upper()
        count = error.get('count', 1)
        key = (path, method)
        
        # Create endpoint if not exists
        if key not in endpoints:
            endpoints[key] = StandardizedEndpoint(
                path=path,
                method=method,
                statistics=EndpointStatistics()
            )
        
        # Extract status code from error type
        status_code = '500'  # Default
        if '_' in error_type:
            parts = error_type.split('_')
            for part in parts:
                if part.isdigit() and len(part) == 3:
                    status_code = part
                    break
        
        # Update statistics
        endpoints[key].statistics.total_requests += count
        if status_code.startswith('2'):
            endpoints[key].statistics.success_count += count
        else:
            endpoints[key].statistics.failure_count += count
            
        # Update status code counts
        if status_code in endpoints[key].statistics.status_codes:
            endpoints[key].statistics.status_codes[status_code] += count
        else:
            endpoints[key].statistics.status_codes[status_code] = count
            
        # Calculate success rate
        stats = endpoints[key].statistics
        stats.success_rate = (stats.success_count / stats.total_requests * 100) if stats.total_requests > 0 else 0

    def _extract_status_code(self, data: Dict[str, Any]) -> int:
        """Extract status code from bug data.
        
        Args:
            data: Bug data dictionary
            
        Returns:
            HTTP status code
        """
        # Try direct response code
        if 'response_code' in data:
            return int(data['response_code'])
            
        # Try nested response status code
        if 'response' in data and 'status_code' in data['response']:
            return int(data['response']['status_code'])
            
        # Try to extract from bug type
        bug_type = data.get('bug_type', '')
        if '_' in bug_type:
            parts = bug_type.split('_')
            for part in parts:
                if part.isdigit() and len(part) == 3:
                    return int(part)
        
        # Default to 500 for unknown errors
        return 500
