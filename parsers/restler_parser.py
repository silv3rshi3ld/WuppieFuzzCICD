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
        total_requests = 0
        unique_bugs = 0
        critical_issues = 0

        try:
            # Calculate total requests
            summary = self.response_data.get('summary', {})
            if summary:
                for endpoint_stats in summary.get('endpointStats', {}).values():
                    for method_stats in endpoint_stats.get('methods', {}).values():
                        total_requests += method_stats.get('successCount', 0)
                        total_requests += method_stats.get('failureCount', 0)

            # Add requests from bug sequences
            for details in self.bugs_data['bug_details'].values():
                if 'request_sequence' in details:
                    total_requests += len(details['request_sequence'])

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

        try:
            if self.response_data and 'summary' in self.response_data:
                for endpoint_stats in self.response_data['summary'].get('endpointStats', {}).values():
                    for method, stats in endpoint_stats.get('methods', {}).items():
                        success_count = stats.get('successCount', 0)
                        failure_count = stats.get('failureCount', 0)

                        status_dist['hits'] += success_count
                        status_dist['misses'] += failure_count

                        if method not in method_coverage:
                            method_coverage[method] = {'hits': 0, 'misses': 0, 'unspecified': 0}
                        method_coverage[method]['hits'] += success_count
                        method_coverage[method]['misses'] += failure_count

        except Exception as e:
            print(f"Warning: Error in process_coverage: {e}")

        coverage_data = {
            "status_distribution": status_dist,
            "method_coverage": method_coverage
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

    def process_endpoints(self):
        """Process and write endpoint data in chunks."""
        self._load_bug_data()
        self._load_response_data()

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

            # Write endpoints in chunks
            for i in range(0, len(all_endpoints), self.chunk_size):
                chunk = all_endpoints[i:i + self.chunk_size]
                self.write_chunked_data(chunk, f'endpoints/chunk_{i//self.chunk_size}')

        except Exception as e:
            print(f"Warning: Error in process_endpoints: {e}")

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
