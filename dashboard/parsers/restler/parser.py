"""Parser for RESTler results."""

import json
import os
import glob
from datetime import datetime
from typing import Any, Dict, List, Set

from ..base.json_chunker import JsonChunker
from ..base.json_validator import JsonValidator

class RestlerParser:
    """Parser for RESTler output data."""
    
    def __init__(self, input_path: str, output_dir: str):
        """Initialize the parser.
        
        Args:
            input_path: Path to RESTler output directory
            output_dir: Directory to save parsed results
        """
        self.input_path = input_path
        self.output_dir = output_dir
        self.chunker = JsonChunker(output_dir, 'Restler')
        self.validator = JsonValidator()
        
    def _find_experiment_dirs(self) -> List[str]:
        """Find all experiment directories.
        
        Returns:
            List[str]: List of experiment directory paths
        """
        experiment_pattern = os.path.join(self.input_path, 'RestlerResults', 'experiment*')
        return sorted(glob.glob(experiment_pattern))
        
    def _load_bug_buckets(self, experiment_dir: str) -> List[Dict[str, Any]]:
        """Load bug bucket data from an experiment directory.
        
        Args:
            experiment_dir: Path to experiment directory
            
        Returns:
            List[Dict[str, Any]]: List of bug data
        """
        bugs = []
        bug_buckets_dir = os.path.join(experiment_dir, 'bug_buckets')
        
        # Load Bugs.json
        bugs_file = os.path.join(bug_buckets_dir, 'Bugs.json')
        if os.path.exists(bugs_file):
            try:
                with open(bugs_file, 'r') as f:
                    bug_list = json.load(f)
                    if isinstance(bug_list, list):
                        for bug_data in bug_list:
                            if isinstance(bug_data, dict):
                                bugs.append(bug_data)
                            else:
                                print(f"Warning: Bug data in {bugs_file} is not a dictionary")
                    else:
                        print(f"Warning: {bugs_file} does not contain a list of bugs")
            except json.JSONDecodeError:
                print(f"Warning: Could not parse {bugs_file}")
        
        # Load individual bug bucket files
        bucket_files = glob.glob(os.path.join(bug_buckets_dir, '*.json'))
        for file in bucket_files:
            if os.path.basename(file) != 'Bugs.json':
                try:
                    with open(file, 'r') as f:
                        # Extract bug type from filename (e.g., "InvalidDynamicObjectChecker_500_1.json")
                        bug_type = os.path.splitext(os.path.basename(file))[0]
                        bug_data = json.load(f)
                        if isinstance(bug_data, dict):
                            bug_data['bug_type'] = bug_type
                            bugs.append(bug_data)
                        else:
                            print(f"Warning: Bug data in {file} is not a dictionary")
                except json.JSONDecodeError:
                    print(f"Warning: Could not parse {file}")
                    
        return bugs
        
    def _load_response_data(self) -> Dict[str, Any]:
        """Load response bucket data.
        
        Returns:
            Dict[str, Any]: Response data including summary and error buckets
        """
        response_data = {}
        
        # Load runSummary.json
        summary_file = os.path.join(self.input_path, 'ResponseBuckets', 'runSummary.json')
        if os.path.exists(summary_file):
            try:
                with open(summary_file, 'r') as f:
                    response_data['summary'] = json.load(f)
            except json.JSONDecodeError:
                print(f"Warning: Could not parse {summary_file}")
                
        # Load errorBuckets.json
        error_file = os.path.join(self.input_path, 'ResponseBuckets', 'errorBuckets.json')
        if os.path.exists(error_file):
            try:
                with open(error_file, 'r') as f:
                    response_data['errors'] = json.load(f)
            except json.JSONDecodeError:
                print(f"Warning: Could not parse {error_file}")
                
        return response_data
        
    def parse(self) -> bool:
        """Parse RESTler results and generate standardized output.
        
        Returns:
            bool: True if parsing was successful
        """
        try:
            # Find all experiment directories
            experiment_dirs = self._find_experiment_dirs()
            if not experiment_dirs:
                raise FileNotFoundError("No experiment directories found")
            
            # Load response data
            response_data = self._load_response_data()
            if not response_data:
                raise FileNotFoundError("No response data found")
            
            # Collect bugs from all experiments
            all_bugs = []
            unique_endpoints = set()
            for exp_dir in experiment_dirs:
                bugs = self._load_bug_buckets(exp_dir)
                all_bugs.extend(bugs)
                # Track unique endpoints
                for bug in bugs:
                    if 'endpoint' in bug and 'verb' in bug:
                        unique_endpoints.add(f"{bug['verb']} {bug['endpoint']}")
            
            # Transform and validate metadata
            metadata = self._transform_metadata(response_data, len(unique_endpoints), len(all_bugs))
            metadata_errors = self.validator.validate_metadata(metadata)
            if metadata_errors:
                for error in metadata_errors:
                    print(f"Metadata validation error: {error.path} - {error.message}")
                return False
            
            # Save metadata
            self.chunker.save_metadata(metadata)
            
            # Transform and validate endpoints
            endpoints = self._transform_endpoints(response_data, unique_endpoints)
            for endpoint in endpoints:
                endpoint_errors = self.validator.validate_endpoint(endpoint)
                if endpoint_errors:
                    for error in endpoint_errors:
                        print(f"Endpoint validation error: {error.path} - {error.message}")
                    return False
            
            # Save endpoints in chunks
            self.chunker.chunk_endpoints(endpoints)
            
            # Transform and validate test cases
            test_cases = self._transform_test_cases(all_bugs, response_data)
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
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}")
            return False
        except (KeyError, ValueError) as e:
            print(f"Data processing error: {str(e)}")
            return False
    
    def _transform_metadata(self, response_data: Dict[str, Any], endpoint_count: int, bug_count: int) -> Dict[str, Any]:
        """Transform RESTler metadata to standardized format.
        
        Args:
            response_data: Response bucket data
            endpoint_count: Number of unique endpoints
            bug_count: Number of unique bugs
        
        Returns:
            Standardized metadata dictionary
        """
        summary = response_data.get('summary', {})
        
        return {
            'fuzzer': {
                'name': 'Restler',
                'timestamp': summary.get('start_time', datetime.now().isoformat()),
                'duration': summary.get('total_time', '0:00:00'),
                'total_requests': summary.get('total_requests', 0),
                'critical_issues': bug_count
            },
            'summary': {
                'endpoints_tested': endpoint_count,
                'success_rate': self._calculate_success_rate(response_data),
                'coverage': {
                    'lines': summary.get('coverage', {}).get('lines', 0),
                    'functions': summary.get('coverage', {}).get('functions', 0),
                    'branches': summary.get('coverage', {}).get('branches', 0),
                    'statements': summary.get('coverage', {}).get('statements', 0)
                }
            }
        }
    
    def _transform_endpoints(self, response_data: Dict[str, Any], unique_endpoints: Set[str]) -> List[Dict[str, Any]]:
        """Transform endpoint data to standardized format.
        
        Args:
            response_data: Response bucket data
            unique_endpoints: Set of unique endpoints found
        
        Returns:
            List of standardized endpoint dictionaries
        """
        transformed = []
        summary = response_data.get('summary', {})
        endpoint_stats = summary.get('endpoint_stats', {})
        
        for endpoint in unique_endpoints:
            # Extract method and path from endpoint string
            if ' ' in endpoint:
                method, path = endpoint.split(' ', 1)
            else:
                # If no method in endpoint string, try to find it in stats
                path = endpoint
                method = endpoint_stats.get(endpoint, {}).get('verb', 'GET')
            
            transformed.append({
                'path': path,
                'method': method.upper(),  # Ensure method is uppercase
                'statistics': {
                    'total_requests': endpoint_stats.get(endpoint, {}).get('requests', 0),
                    'success_rate': endpoint_stats.get(endpoint, {}).get('success_rate', 0),
                    'status_codes': endpoint_stats.get(endpoint, {}).get('status_codes', {})
                }
            })
        
        return transformed
    
    def _transform_test_cases(self, bugs: List[Dict[str, Any]], response_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Transform test cases to standardized format.
        
        Args:
            bugs: List of bug data
            response_data: Response bucket data
        
        Returns:
            List of standardized test case dictionaries
        """
        transformed = []
        
        # Transform bug cases
        for i, bug in enumerate(bugs):
            # Extract method from bug type (e.g., "InvalidDynamicObjectChecker_500_1" -> "GET")
            bug_type = bug.get('bug_type', '')
            method = 'GET'  # Default method
            if 'verb' in bug:
                method = bug['verb']
            elif 'request' in bug:
                method = bug['request'].get('method', 'GET')
            elif '_' in bug_type:
                # Try to extract method from bug type
                for known_method in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']:
                    if known_method in bug_type:
                        method = known_method
                        break

            transformed.append({
                'id': f"bug_{i+1}",
                'name': bug_type or 'Unknown Bug',
                'endpoint': bug.get('endpoint', ''),
                'method': method,
                'type': 'fault',
                'request': {
                    'headers': bug.get('request_headers', {}) if 'request_headers' in bug else bug.get('request', {}).get('headers', {}),
                    'data': bug.get('request_data', {}) if 'request_data' in bug else bug.get('request', {}).get('body', {})
                },
                'response': {
                    'status_code': bug.get('response_code', 500) if 'response_code' in bug else bug.get('response', {}).get('status_code', 500),
                    'headers': bug.get('response_headers', {}) if 'response_headers' in bug else bug.get('response', {}).get('headers', {}),
                    'body': bug.get('response_body', {}) if 'response_body' in bug else bug.get('response', {}).get('body', {})
                }
            })
        
        # Transform success cases from response data
        success_cases = response_data.get('summary', {}).get('success_cases', [])
        for i, case in enumerate(success_cases):
            transformed.append({
                'id': f"success_{i+1}",
                'name': case.get('name', f"Success Case {i+1}"),
                'endpoint': case.get('endpoint', ''),
                'method': case.get('verb', case.get('method', 'GET')).upper(),
                'type': 'success',
                'request': {
                    'headers': case.get('request_headers', {}),
                    'data': case.get('request_data', {})
                },
                'response': {
                    'status_code': case.get('response_code', 200),
                    'headers': case.get('response_headers', {}),
                    'body': case.get('response_body', {})
                }
            })
        
        return transformed
    
    def _calculate_success_rate(self, response_data: Dict[str, Any]) -> float:
        """Calculate overall success rate from response data.
        
        Args:
            response_data: Response bucket data
        
        Returns:
            Float representing success rate percentage
        """
        summary = response_data.get('summary', {})
        total_requests = summary.get('total_requests', 0)
        if total_requests == 0:
            return 0.0
            
        success_requests = summary.get('success_requests', 0)
        return round((success_requests / total_requests * 100), 2)
