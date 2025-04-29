import os
import json
import re
from datetime import datetime
import zipfile
import tempfile
import shutil
import traceback
import base64
from .base_parser import BaseFuzzerParser

class RestlerParser(BaseFuzzerParser):
    def __init__(self, zip_path, output_dir, chunk_size=100):
        """
        Initialize the Restler parser.
        
        Args:
            zip_path (str): Path to the zip file containing Restler results
            output_dir (str): Directory where the chunked output will be written
            chunk_size (int): Number of endpoints per chunk
        """
        super().__init__(output_dir, "Restler", chunk_size)
        self.zip_path = zip_path
        self.temp_dir = None
        self.results_dir = None
        self.bug_buckets_dir = None
        self.response_buckets_dir = None
        self.bugs_data = None
        self.response_data = None

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
        self.bug_buckets_dir = os.path.join(self.results_dir, 'RestlerResults', 'experiment135', 'bug_buckets')
        self.response_buckets_dir = os.path.join(self.results_dir, 'ResponseBuckets')
        self.experiment_dir = None # To store the found experiment directory

    def _find_experiment_dir(self):
        """Find the experiment directory containing logs/request_rendering.txt."""
        restler_results_path = os.path.join(self.results_dir, 'RestlerResults')
        if not os.path.exists(restler_results_path):
            print(f"Warning: RestlerResults directory not found at {restler_results_path}")
            return None

        for item in os.listdir(restler_results_path):
            item_path = os.path.join(restler_results_path, item)
            if os.path.isdir(item_path):
                logs_path = os.path.join(item_path, 'logs')
                request_rendering_path = os.path.join(logs_path, 'request_rendering.txt')
                if os.path.exists(request_rendering_path):
                    self.experiment_dir = item_path
                    print(f"Found experiment directory: {self.experiment_dir}")
                    return self.experiment_dir
        
        print("Warning: Could not find experiment directory with logs/request_rendering.txt")
        return None

    def _get_total_requests_from_logs(self):
        """Read request_rendering.txt and sum the rendered requests."""
        if not self.experiment_dir:
            self._find_experiment_dir()
            if not self.experiment_dir:
                return 0

        request_rendering_path = os.path.join(self.experiment_dir, 'logs', 'request_rendering.txt')
        if not os.path.exists(request_rendering_path):
            print(f"Warning: request_rendering.txt not found at {request_rendering_path}")
            return 0

        total_rendered_requests = 0
        try:
            with open(request_rendering_path, 'r') as f:
                for line in f:
                    match = re.search(r'Rendered requests: (\d+)', line)
                    if match:
                        total_rendered_requests += int(match.group(1))
        except Exception as e:
            print(f"Error reading or parsing {request_rendering_path}: {e}")
            return 0

        return total_rendered_requests

    def _load_bug_data(self):
        """Load and parse bug data from bug_buckets directory."""
        if self.bugs_data is None:
            self.bugs_data = {
                'bugs': [],
                'bug_details': {}
            }

            bugs_file = os.path.join(self.bug_buckets_dir, 'Bugs.json')
            if os.path.exists(bugs_file):
                try:
                    with open(bugs_file, 'r') as f:
                        self.bugs_data['bugs'] = json.load(f).get('bugs', [])
                except Exception as e:
                    print(f"Warning: Could not load or parse {bugs_file}: {e}")

            for bug in self.bugs_data['bugs']:
                bug_file = os.path.join(self.bug_buckets_dir, bug['filepath'])
                if os.path.exists(bug_file):
                    try:
                        with open(bug_file, 'r') as f:
                            self.bugs_data['bug_details'][bug['filepath']] = json.load(f)
                    except Exception as e:
                        print(f"Warning: Could not load or parse {bug_file}: {e}")

    def _load_response_data(self):
        """Load and parse response data from ResponseBuckets directory."""
        if self.response_data is None:
            self.response_data = {
                'summary': None,
                'errors': None
            }

            summary_file = os.path.join(self.response_buckets_dir, 'runSummary.json')
            if os.path.exists(summary_file):
                try:
                    with open(summary_file, 'r') as f:
                        self.response_data['summary'] = json.load(f)
                except Exception as e:
                    print(f"Warning: Could not load or parse {summary_file}: {e}")

            errors_file = os.path.join(self.response_buckets_dir, 'errorBuckets.json')
            if os.path.exists(errors_file):
                try:
                    with open(errors_file, 'r') as f:
                        self.response_data['errors'] = json.load(f)
                except Exception as e:
                    print(f"Warning: Could not load or parse {errors_file}: {e}")

    def process_metadata(self):
        """Process and write metadata."""
        self._load_bug_data()
        self._load_response_data()

        duration = "Unknown"
        unique_bugs = 0
        critical_issues = 0

        try:
            # Extract duration from engine output
            engine_out = os.path.join(self.results_dir, 'EngineStdOut.txt')
            if os.path.exists(engine_out):
                with open(engine_out, 'r') as f:
                    content = f.read()
                    start_match = re.search(r'Starting Fuzzing: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', content)
                    end_match = re.search(r'Fuzzing stopped: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', content)
                    if start_match and end_match:
                        start_time = datetime.strptime(start_match.group(1), '%Y-%m-%d %H:%M:%S')
                        end_time = datetime.strptime(end_match.group(1), '%Y-%m-%d %H:%M:%S')
                        duration = str(end_time - start_time)

            unique_bugs = len(self.bugs_data.get('bugs', []))
            critical_issues = sum(1 for bug in self.bugs_data.get('bugs', [])
                                if bug.get('error_code', '500').startswith('5'))

        except Exception as e:
            print(f"Warning: Error in process_metadata: {e}")

        # Get total requests from logs
        total_requests = self._get_total_requests_from_logs()

        metadata = {
            "duration": duration,
            "total_requests": total_requests,
            "unique_bugs": unique_bugs,
            "critical_issues": critical_issues
        }

        self.write_chunked_data(metadata, 'metadata')

    def process_coverage(self):
        """Process and write coverage data."""
        self._load_bug_data()
        self._load_response_data()

        status_dist = {'hits': 0, 'misses': 0, 'unspecified': 0}
        method_coverage = {}
        status_codes = []  # Added to store status codes

        try:
            # Process all endpoints to collect status codes
            all_endpoints = self.process_all_endpoints()
            
            for endpoint in all_endpoints:
                if endpoint.get('status_code'):
                    status_codes.append(endpoint['status_code'])
                    
                    # Update status distribution
                    if endpoint['type'] == 'hit':
                        status_dist['hits'] += 1
                    else:
                        status_dist['misses'] += 1
                        
                    # Update method coverage
                    method = endpoint.get('http_method', 'GET')
                    if method not in method_coverage:
                        method_coverage[method] = {'hits': 0, 'misses': 0, 'unspecified': 0}
                    
                    if endpoint['type'] == 'hit':
                        method_coverage[method]['hits'] += 1
                    else:
                        method_coverage[method]['misses'] += 1

        except Exception as e:
            print(f"Warning: Error in process_coverage: {e}")

        coverage_data = {
            "status_distribution": status_dist,
            "method_coverage": method_coverage,
            "status_codes": status_codes  # Added status_codes to coverage data
        }

        self.write_chunked_data(coverage_data, 'coverage')

    def _sanitize_url(self, url):
        """Sanitize URL by removing invalid characters and normalizing format."""
        if not url:
            return ''
        url = url.split('?')[0]
        url = re.sub(r'/{2,}', '/', url)
        url = re.sub(r'[^a-zA-Z0-9/_\-{}]', '', url)
        if not url.startswith('/'):
            url = '/' + url
        return url

    def _parse_http_message(self, message):
        """Parse HTTP request or response message into structured format."""
        if not message:
            return {}

        lines = message.split('\n')
        if not lines:
            return {}

        result = {}
        parts = lines[0].split()
        if len(parts) < 2:
            return {}

        # Parse request/response line
        if any(method in parts[0] for method in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']):
            result['method'] = parts[0]
            result['path'] = self._sanitize_url(parts[1])
        elif parts[0].startswith('HTTP/'):
            try:
                result['status_code'] = int(parts[1])
                result['status_text'] = ' '.join(parts[2:])
            except (IndexError, ValueError):
                pass

        # Parse headers and body
        headers = {}
        body = []
        in_body = False
        for line in lines[1:]:
            line = line.strip()
            if not line:
                in_body = True
                continue
            if not in_body:
                if ':' in line:
                    key, value = line.split(':', 1)
                    headers[key.strip().lower()] = value.strip()
            else:
                body.append(line)

        result['headers'] = headers
        result['body'] = '\n'.join(body)

        return result

    def process_all_endpoints(self):
        """Process all endpoints and return them as a list."""
        all_endpoints = []

        try:
            # Process bug data
            for details in self.bugs_data['bug_details'].values():
                if 'request_sequence' in details:
                    for req in details['request_sequence']:
                        request_data = self._parse_http_message(req.get('replay_request', ''))
                        response_data = self._parse_http_message(req.get('response', ''))

                        if request_data and 'path' in request_data:
                            endpoint_info = {
                                "path": request_data['path'],
                                "http_method": request_data.get('method', ''),
                                "status_code": response_data.get('status_code'),
                                "type": 'miss' if response_data.get('status_code', 0) >= 400 else 'hit',
                                "request_details": req.get('replay_request'),
                                "response_data": req.get('response')
                            }
                            all_endpoints.append(endpoint_info)

            # Process successful endpoints from summary
            if self.response_data and 'summary' in self.response_data:
                for endpoint, stats in self.response_data['summary'].get('endpointStats', {}).items():
                    for method, data in stats.get('methods', {}).items():
                        if data.get('successCount', 0) > 0:
                            endpoint_info = {
                                "path": endpoint,
                                "http_method": method,
                                "status_code": 200,
                                "type": 'hit',
                                "request_details": None,
                                "response_data": None
                            }
                            all_endpoints.append(endpoint_info)

        except Exception as e:
            print(f"Warning: Error in process_all_endpoints: {e}")

        return all_endpoints

    def process_endpoints(self):
        """Process and write endpoint data in chunks."""
        all_endpoints = self.process_all_endpoints()

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

# Add this main block to handle direct execution
if __name__ == "__main__":
    import os
    import sys
    
    # Get the base directory (project root)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = os.path.join(base_dir, 'dashboard', 'data')
    
    # Set up the parser with the correct paths
    zip_path = os.path.join(base_dir, 'output-fuzzers', 'Restler', 'restler-fuzz-results.zip')
    parser = RestlerParser(zip_path, os.path.join(output_dir, 'restler'))
    
    try:
        # Process the data
        parser.process_data()
        print("Restler data processed successfully")
    except Exception as e:
        print(f"Error processing Restler data: {e}")
        sys.exit(1)
