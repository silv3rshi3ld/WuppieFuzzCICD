import os
import ast
import json
from datetime import datetime, timedelta
import re
import zipfile
import tempfile
import shutil

class EvomasterParser:
    def __init__(self, zip_path):
        """
        Initialize the Evomaster parser.
        
        Args:
            zip_path (str): Path to the zip file containing Evomaster results
        """
        self.zip_path = zip_path
        self.temp_dir = None
        self.results_dir = None
        self.faults_file = None
        self.successes_file = None
        self.test_data = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.temp_dir and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)

    def extract_zip(self):
        """Extract the zip file to a temporary directory."""
        self.temp_dir = tempfile.mkdtemp()
        with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
            zip_ref.extractall(self.temp_dir)
        
        self.results_dir = self.temp_dir
        self.faults_file = os.path.join(self.results_dir, 'EvoMaster_faults_Test.py')
        self.successes_file = os.path.join(self.results_dir, 'EvoMaster_successes_Test.py')

    def _parse_python_file(self, file_path):
        """Parse a Python test file and extract test information."""
        print(f"\nParsing file: {file_path}")
        with open(file_path, 'r') as f:
            content = f.read()
        
        tree = ast.parse(content)
        test_info = []
        
        # Extract metadata from comments
        metadata = {
            'covered_targets': 0,
            'used_time': '',
            'needed_budget': ''
        }
        
        # Extract metadata from file comments
        for node in ast.walk(tree):
            if isinstance(node, ast.Str):
                if 'Covered targets:' in node.s:
                    metadata['covered_targets'] = int(node.s.split(': ')[1])
                elif 'Used time:' in node.s:
                    metadata['used_time'] = node.s.split(': ')[1].strip()
                elif 'Needed budget:' in node.s:
                    metadata['needed_budget'] = node.s.split(': ')[1].strip()
        
        print(f"Found metadata: {metadata}")
        
        # Extract test cases
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef) and node.name.startswith('test_'):
                test_case = {
                    'name': node.name,
                    'method': None,
                    'endpoint': None,
                    'status_code': None,
                    'request_data': None,
                    'response_data': None,
                    'assertions': []
                }
                
                # Get the source code including comments
                source_lines = []
                for child in ast.iter_child_nodes(node):
                    if hasattr(child, 'lineno'):
                        start_line = child.lineno
                        break
                else:
                    start_line = node.lineno
                
                # Extract test information from comments
                print(f"\nProcessing test: {node.name}")
                comment_lines = content.split('\n')[node.lineno-5:start_line]
                print(f"Comment lines: {comment_lines}")
                for line in comment_lines:
                    line = line.strip()
                    if line.startswith('# ('):
                        # Parse lines like "# (401) DELETE:/users/v1/{username}"
                        match = re.match(r'#\s*\((\d+)\)\s*([A-Z]+):(.+)', line)
                        if match:
                            test_case['status_code'] = int(match.group(1))
                            test_case['method'] = match.group(2)
                            test_case['endpoint'] = match.group(3).strip()
                            print(f"Found test info: {test_case['method']} {test_case['endpoint']} -> {test_case['status_code']}")
                
                # Extract request and response details
                for child in ast.walk(node):
                    if isinstance(child, ast.Assert):
                        assertion_text = ast.unparse(child).strip()
                        test_case['assertions'].append(assertion_text)
                        # Try to extract response data from assertions
                        if 'json()' in assertion_text:
                            test_case['response_data'] = assertion_text
                    elif isinstance(child, ast.Assign):
                        if isinstance(child.targets[0], ast.Name):
                            var_name = child.targets[0].id
                            if var_name == 'headers' or var_name == 'body':
                                if test_case['request_data'] is None:
                                    test_case['request_data'] = ''
                                test_case['request_data'] += ast.unparse(child.value).strip() + '\n'
                
                if test_case['status_code'] is not None:  # Only add test cases with valid status codes
                    test_info.append(test_case)
                    print(f"Added test case: {test_case}")
        
        print(f"\nFound {len(test_info)} test cases")
        return metadata, test_info

    def get_metadata_statistics(self):
        """Get metadata statistics about the fuzzing session."""
        if not self.test_data:
            self._parse_all_files()
        
        duration = "Unknown"
        try:
            # Parse the used time string (e.g., "0h 1m 19s")
            time_str = self.test_data['faults']['metadata'].get('used_time')
            if time_str:
                hours = minutes = seconds = 0
                parts = time_str.split()
                for part in parts:
                    if part.endswith('h'):
                        hours = int(part[:-1])
                    elif part.endswith('m'):
                        minutes = int(part[:-1])
                    elif part.endswith('s'):
                        seconds = int(part[:-1])
                
                duration = timedelta(hours=hours, minutes=minutes, seconds=seconds)
        except Exception as e:
            print(f"Warning: Error extracting duration: {e}")
        
        # Count critical issues (500+ status codes)
        critical_issues = 0
        try:
            for test in self.test_data['faults']['tests']:
                if test['status_code'] and test['status_code'] >= 500:
                    critical_issues += 1
        except Exception as e:
            print(f"Warning: Error counting critical issues: {e}")
        
        total_requests = 0
        unique_bugs = 0
        try:
            total_requests = len(self.test_data['faults']['tests']) + len(self.test_data['successes']['tests'])
            unique_bugs = len(self.test_data['faults']['tests'])  # All tests in faults file are bugs
        except Exception as e:
            print(f"Warning: Error getting total requests or unique bugs: {e}")
        
        return {
            "duration": str(duration),
            "total_requests": total_requests,
            "unique_bugs": unique_bugs,
            "critical_issues": critical_issues
        }

    def get_endpoint_information(self):
        """Get detailed information about each endpoint."""
        if not self.test_data:
            self._parse_all_files()
        
        endpoints = []
        try:
            for test_type in ['faults', 'successes']:
                for test in self.test_data[test_type]['tests']:
                    if test['endpoint'] and test['status_code']:
                        endpoints.append({
                            "path": test['endpoint'],
                            "http_method": test['method'] if test['method'] else 'GET',
                            "status_code": test['status_code'],
                            "type": 'miss' if test_type == 'faults' else 'hit',
                            "request_details": test['request_data'],
                            "response_data": test['response_data']
                        })
        except Exception as e:
            print(f"Warning: Error in get_endpoint_information: {e}")
        return endpoints

    def get_coverage_statistics(self):
        """Get coverage statistics."""
        if not self.test_data:
            self._parse_all_files()
        
        status_dist = {'hits': 0, 'misses': 0, 'unspecified': 0}
        method_coverage = {}
        
        try:
            # Process successes
            for test in self.test_data['successes']['tests']:
                if test['status_code']:
                    status_dist['hits'] += 1
                    method = test['method'] if test['method'] else 'GET'
                    if method not in method_coverage:
                        method_coverage[method] = {'hits': 0, 'misses': 0, 'unspecified': 0}
                    method_coverage[method]['hits'] += 1
            
            # Process faults (all counted as misses)
            for test in self.test_data['faults']['tests']:
                if test['status_code']:
                    status_dist['misses'] += 1
                    method = test['method'] if test['method'] else 'GET'
                    if method not in method_coverage:
                        method_coverage[method] = {'hits': 0, 'misses': 0, 'unspecified': 0}
                    method_coverage[method]['misses'] += 1
        except Exception as e:
            print(f"Warning: Error in get_coverage_statistics: {e}")
        
        return {
            "status_distribution": status_dist,
            "method_coverage": method_coverage
        }

    def get_bug_information(self):
        """Get detailed information about bugs."""
        if not self.test_data:
            self._parse_all_files()
        
        bugs = []
        try:
            for test in self.test_data['faults']['tests']:
                if test['status_code']:
                    bugs.append({
                        "status_code": test['status_code'],
                        "endpoint": test['endpoint'],
                        "method": test['method'] if test['method'] else 'GET',
                        "type": 'miss',
                        "request": test['request_data'],
                        "response": test['response_data']
                    })
        except Exception as e:
            print(f"Warning: Error in get_bug_information: {e}")
        return bugs

    def _parse_all_files(self):
        """Parse both faults and successes files."""
        self.test_data = {
            'faults': {'metadata': {}, 'tests': []},
            'successes': {'metadata': {}, 'tests': []}
        }
        
        if os.path.exists(self.faults_file):
            print("\nParsing faults file...")
            try:
                self.test_data['faults']['metadata'], self.test_data['faults']['tests'] = self._parse_python_file(self.faults_file)
                print(f"Found {len(self.test_data['faults']['tests'])} fault tests")
            except Exception as e:
                print(f"Warning: Error parsing faults file: {e}")
        
        if os.path.exists(self.successes_file):
            print("\nParsing successes file...")
            try:
                self.test_data['successes']['metadata'], self.test_data['successes']['tests'] = self._parse_python_file(self.successes_file)
                print(f"Found {len(self.test_data['successes']['tests'])} success tests")
            except Exception as e:
                print(f"Warning: Error parsing successes file: {e}")

    def get_status_code_distribution(self):
        """Get distribution of HTTP status codes."""
        if not self.test_data:
            self._parse_all_files()
        
        distribution = {
            "200": 0, "401": 0, "404": 0, "500": 0, "204": 0
        }
        
        try:
            for test in self.test_data['successes']['tests']:
                if test['status_code']:
                    status = str(test['status_code'])
                    if status in distribution:
                        distribution[status] += 1
            for test in self.test_data['faults']['tests']:
                if test['status_code']:
                    status = str(test['status_code'])
                    if status in distribution:
                        distribution[status] += 1
        except Exception as e:
            print(f"Warning: Error in get_status_code_distribution: {e}")
        
        return distribution

    def get_kpi(self):
        """Get Key Performance Indicators."""
        if not self.test_data:
            self._parse_all_files()
        
        total_requests = 0
        success_count = 0
        unique_endpoints = set()
        critical_errors = 0

        try:
            total_requests = len(self.test_data['faults']['tests']) + len(self.test_data['successes']['tests'])
            success_count = sum(1 for test in self.test_data['successes']['tests'] 
                              if test['status_code'] and 200 <= test['status_code'] < 300)
            critical_errors = sum(1 for test in self.test_data['faults']['tests'] 
                                 if test['status_code'] and test['status_code'] >= 500)
            for test_type in ['faults', 'successes']:
                for test in self.test_data[test_type]['tests']:
                    if test['endpoint']:
                        unique_endpoints.add(test['endpoint'])
        except Exception as e:
            print(f"Warning: Error in get_kpi: {e}")
        
        return {
            "total_requests": total_requests,
            "critical_errors": critical_errors,
            "unique_endpoints": len(unique_endpoints),
            "success_rate": round((success_count / total_requests * 100), 2) if total_requests > 0 else 0.0
        }

    def process_data(self):
        """Process all data and generate the final report."""
        try:
            self.extract_zip()
            
            if not self.test_data:
                self._parse_all_files()
            
            return {
                "metadata": self.get_metadata_statistics(),
                "endpoints": self.get_endpoint_information(),
                "coverage": self.get_coverage_statistics(),
                "status_codes": self.get_status_code_distribution(),
                "kpi": self.get_kpi(),
                "bugs": self.get_bug_information()
            }
        finally:
            if self.temp_dir and os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    zip_path = os.path.abspath(os.path.join(script_dir, '..', 'output-fuzzers', 'Evomaster', 'evomaster-results.zip'))
    try:
        with EvomasterParser(zip_path) as parser:
            report = parser.process_data()
            # Save JSON report in the same folder as the zip file
            output_path = os.path.join(os.path.dirname(zip_path), 'evomaster_report.json')
            with open(output_path, 'w') as f:
                json.dump(report, f, indent=2)
            print(f"Evomaster report saved to {output_path}")
    except Exception as e:
        print(f"Error parsing Evomaster results: {e}")
