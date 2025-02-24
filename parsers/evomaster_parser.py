import os
import ast
import json
from datetime import datetime, timedelta
import re
import zipfile
import tempfile
import shutil
from .base_parser import BaseFuzzerParser

class EvomasterParser(BaseFuzzerParser):
    def __init__(self, zip_path, output_dir, chunk_size=100):
        """
        Initialize the Evomaster parser.
        
        Args:
            zip_path (str): Path to the zip file containing Evomaster results
            output_dir (str): Directory where the chunked output will be written
            chunk_size (int): Number of endpoints per chunk
        """
        super().__init__(output_dir, "Evomaster", chunk_size)
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
            if isinstance(node, ast.Constant) and isinstance(node.value, str):
                if 'Covered targets:' in node.value:
                    metadata['covered_targets'] = int(node.value.split(': ')[1])
                elif 'Used time:' in node.value:
                    metadata['used_time'] = node.value.split(': ')[1].strip()
                elif 'Needed budget:' in node.value:
                    metadata['needed_budget'] = node.value.split(': ')[1].strip()
        
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
                comment_lines = content.split('\n')[node.lineno-5:node.lineno]
                for line in comment_lines:
                    line = line.strip()
                    if line.startswith('# ('):
                        # Parse lines like "# (401) DELETE:/users/v1/{username}"
                        match = re.match(r'#\s*\((\d+)\)\s*([A-Z]+):(.+)', line)
                        if match:
                            test_case['status_code'] = int(match.group(1))
                            test_case['method'] = match.group(2)
                            test_case['endpoint'] = match.group(3).strip()
                
                # Extract request and response details
                for child in ast.walk(node):
                    if isinstance(child, ast.Assert):
                        assertion_text = ast.unparse(child).strip()
                        test_case['assertions'].append(assertion_text)
                        if 'json()' in assertion_text:
                            test_case['response_data'] = assertion_text
                    elif isinstance(child, ast.Assign):
                        if isinstance(child.targets[0], ast.Name):
                            var_name = child.targets[0].id
                            if var_name == 'headers' or var_name == 'body':
                                if test_case['request_data'] is None:
                                    test_case['request_data'] = ''
                                test_case['request_data'] += ast.unparse(child.value).strip() + '\n'
                
                if test_case['status_code'] is not None:
                    test_info.append(test_case)
        
        return metadata, test_info

    def _parse_all_files(self):
        """Parse both faults and successes files."""
        if self.test_data is None:
            self.test_data = {
                'faults': {'metadata': {}, 'tests': []},
                'successes': {'metadata': {}, 'tests': []}
            }
            
            if os.path.exists(self.faults_file):
                self.test_data['faults']['metadata'], self.test_data['faults']['tests'] = self._parse_python_file(self.faults_file)
            
            if os.path.exists(self.successes_file):
                self.test_data['successes']['metadata'], self.test_data['successes']['tests'] = self._parse_python_file(self.successes_file)

    def process_metadata(self):
        """Process and write metadata."""
        self._parse_all_files()
        
        duration = "Unknown"
        try:
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
                duration = str(timedelta(hours=hours, minutes=minutes, seconds=seconds))
        except Exception as e:
            print(f"Warning: Error extracting duration: {e}")
        
        # Count statistics
        total_requests = len(self.test_data['faults']['tests']) + len(self.test_data['successes']['tests'])
        critical_issues = sum(1 for test in self.test_data['faults']['tests']
                            if test['status_code'] and test['status_code'] >= 500)
        
        metadata = {
            "duration": duration,
            "total_requests": total_requests,
            "unique_bugs": len(self.test_data['faults']['tests']),
            "critical_issues": critical_issues
        }
        
        self.write_chunked_data(metadata, 'metadata')

    def process_coverage(self):
        """Process and write coverage data."""
        self._parse_all_files()
        
        status_dist = {'hits': 0, 'misses': 0, 'unspecified': 0}
        method_coverage = {}
        status_codes = []
        
        # Process successes
        for test in self.test_data['successes']['tests']:
            if test['status_code']:
                status_dist['hits'] += 1
                status_codes.append(test['status_code'])
                method = test['method'] if test['method'] else 'GET'
                if method not in method_coverage:
                    method_coverage[method] = {'hits': 0, 'misses': 0, 'unspecified': 0}
                method_coverage[method]['hits'] += 1
        
        # Process faults
        for test in self.test_data['faults']['tests']:
            if test['status_code']:
                status_dist['misses'] += 1
                status_codes.append(test['status_code'])
                method = test['method'] if test['method'] else 'GET'
                if method not in method_coverage:
                    method_coverage[method] = {'hits': 0, 'misses': 0, 'unspecified': 0}
                method_coverage[method]['misses'] += 1
        
        coverage_data = {
            "status_distribution": status_dist,
            "method_coverage": method_coverage,
            "status_codes": status_codes
        }
        
        self.write_chunked_data(coverage_data, 'coverage')

    def process_endpoints(self):
        """Process and write endpoint data in chunks."""
        self._parse_all_files()
        
        all_endpoints = []
        
        # Process both faults and successes
        for test_type in ['faults', 'successes']:
            for test in self.test_data[test_type]['tests']:
                if test['endpoint'] and test['status_code']:
                    endpoint_info = {
                        "path": test['endpoint'],
                        "http_method": test['method'] if test['method'] else 'GET',
                        "status_code": test['status_code'],
                        "type": 'miss' if test_type == 'faults' else 'hit',
                        "request_details": test['request_data'],
                        "response_data": test['response_data']
                    }
                    all_endpoints.append(endpoint_info)
        
        # Write endpoints in chunks
        for i in range(0, len(all_endpoints), self.chunk_size):
            chunk = all_endpoints[i:i + self.chunk_size]
            self.write_chunked_data(chunk, f'endpoints/chunk_{i//self.chunk_size}')

    def process_data(self):
        """Process all data in chunks."""
        try:
            self.extract_zip()
            
            # Process each data type
            self.process_metadata()
            self.process_coverage()
            self.process_endpoints()
            
        finally:
            if self.temp_dir and os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)
