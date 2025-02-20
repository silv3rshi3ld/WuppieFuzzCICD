import os
import json
import re
from datetime import datetime
from ..base import BaseParser

class RestlerParser(BaseParser):
    def __init__(self, results_dir):
        """
        Initialize the Restler parser.
        
        Args:
            results_dir (str): Path to the directory containing Restler results
        """
        self.results_dir = results_dir
        self.bug_buckets_dir = os.path.join(results_dir, 'RestlerResults', 'experiment135', 'bug_buckets')
        self.response_buckets_dir = os.path.join(results_dir, 'ResponseBuckets')
        self.bugs_data = None
        self.response_data = None

    def _load_bug_data(self):
        """Load and parse bug data from bug_buckets directory."""
        if self.bugs_data is None:
            self.bugs_data = {
                'bugs': [],
                'bug_details': {}
            }
            
            # Load main Bugs.json
            bugs_file = os.path.join(self.bug_buckets_dir, 'Bugs.json')
            if os.path.exists(bugs_file):
                with open(bugs_file, 'r') as f:
                    self.bugs_data['bugs'] = json.load(f)['bugs']
            
            # Load individual bug details
            for bug in self.bugs_data['bugs']:
                bug_file = os.path.join(self.bug_buckets_dir, bug['filepath'])
                if os.path.exists(bug_file):
                    with open(bug_file, 'r') as f:
                        self.bugs_data['bug_details'][bug['filepath']] = json.load(f)

    def _load_response_data(self):
        """Load and parse response data from ResponseBuckets directory."""
        if self.response_data is None:
            self.response_data = {
                'summary': None,
                'errors': None
            }
            
            # Load runSummary.json
            summary_file = os.path.join(self.response_buckets_dir, 'runSummary.json')
            if os.path.exists(summary_file):
                with open(summary_file, 'r') as f:
                    self.response_data['summary'] = json.load(f)
            
            # Load errorBuckets.json
            errors_file = os.path.join(self.response_buckets_dir, 'errorBuckets.json')
            if os.path.exists(errors_file):
                with open(errors_file, 'r') as f:
                    self.response_data['errors'] = json.load(f)

    def _sanitize_url(self, url):
        """Sanitize URL by removing invalid characters and normalizing format."""
        if not url:
            return ''
        # Remove any query parameters
        url = url.split('?')[0]
        # Replace multiple slashes with single slash
        url = re.sub(r'/{2,}', '/', url)
        # Remove special characters but keep allowed ones
        url = re.sub(r'[^a-zA-Z0-9/_\-{}]', '', url)
        # Ensure URL starts with /
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
            
        # Parse first line
        parts = lines[0].split()
        if len(parts) < 2:
            return {}
            
        result = {}
        
        # Parse request line
        if any(method in parts[0] for method in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']):
            result['method'] = parts[0]
            result['path'] = self._sanitize_url(parts[1])
        # Parse response line
        elif parts[0].startswith('HTTP/'):
            try:
                result['status_code'] = int(parts[1])
                result['status_text'] = ' '.join(parts[2:])
            except (IndexError, ValueError):
                pass
                
        # Parse headers
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
        
        # Extract date if present
        if 'date' in headers:
            try:
                result['timestamp'] = datetime.strptime(headers['date'], '%a, %d %b %Y %H:%M:%S GMT')
            except ValueError:
                pass
                
        return result

    def get_metadata_statistics(self):
        """Get metadata statistics about the fuzzing session."""
        self._load_bug_data()
        self._load_response_data()
        
        # Get timing information from response data summary
        summary = self.response_data.get('summary', {})
        
        # Calculate total requests from all sources
        total_requests = 0
        if summary:
            # Add successful requests
            for endpoint_stats in summary.get('endpointStats', {}).values():
                for method_stats in endpoint_stats.get('methods', {}).values():
                    total_requests += method_stats.get('successCount', 0)
                    total_requests += method_stats.get('failureCount', 0)
        
        # Add requests from bug buckets
        for details in self.bugs_data['bug_details'].values():
            if 'request_sequence' in details:
                total_requests += len(details['request_sequence'])
        
        # Get duration from engine output files
        duration = "Unknown"
        engine_out = os.path.join(self.results_dir, 'EngineStdOut.txt')
        if os.path.exists(engine_out):
            try:
                with open(engine_out, 'r') as f:
                    content = f.read()
                    # Extract timestamps from engine output
                    start_match = re.search(r'Starting Fuzzing: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', content)
                    end_match = re.search(r'Fuzzing stopped: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', content)
                    if start_match and end_match:
                        start_time = datetime.strptime(start_match.group(1), '%Y-%m-%d %H:%M:%S')
                        end_time = datetime.strptime(end_match.group(1), '%Y-%m-%d %H:%M:%S')
                        duration = str(end_time - start_time)
            except Exception:
                pass
        
        # Count bugs and critical issues
        unique_bugs = len(self.bugs_data.get('bugs', []))
        critical_issues = sum(1 for bug in self.bugs_data.get('bugs', [])
                            if bug.get('error_code', '500').startswith('5'))
        
        return {
            "duration": duration,
            "total_requests": total_requests,
            "unique_bugs": unique_bugs,
            "critical_issues": critical_issues
        }

    def get_endpoint_information(self):
        """Get detailed information about each endpoint."""
        self._load_bug_data()
        self._load_response_data()
        
        endpoints = []
        
        # Process bug buckets
        for details in self.bugs_data['bug_details'].values():
            if 'request_sequence' in details:
                for req in details['request_sequence']:
                    request_data = self._parse_http_message(req.get('replay_request', ''))
                    response_data = self._parse_http_message(req.get('response', ''))
                    
                    if request_data and 'path' in request_data:
                        endpoints.append({
                            "path": request_data['path'],
                            "http_method": request_data['method'],
                            "status_code": response_data.get('status_code'),
                            "type": 'miss' if response_data.get('status_code', 0) >= 400 else 'hit',
                            "request_details": json.dumps(request_data, default=str),
                            "response_data": json.dumps(response_data, default=str)
                        })
        
        # Add successful requests from response buckets
        if self.response_data and 'summary' in self.response_data:
            for endpoint, stats in self.response_data['summary'].get('endpointStats', {}).items():
                for method, data in stats.get('methods', {}).items():
                    if data.get('successCount', 0) > 0:
                        endpoints.append({
                            "path": endpoint,
                            "http_method": method,
                            "status_code": 200,
                            "type": 'hit',
                            "request_details": None,
                            "response_data": None
                        })
        
        return endpoints

    def get_coverage_statistics(self):
        """Get coverage statistics."""
        self._load_bug_data()
        self._load_response_data()
        
        status_dist = {'hits': 0, 'misses': 0, 'unspecified': 0}
        method_coverage = {}
        
        # Process successful requests from response buckets
        if self.response_data and 'summary' in self.response_data:
            summary = self.response_data['summary']
            for endpoint, stats in summary.get('endpointStats', {}).items():
                for method, data in stats.get('methods', {}).items():
                    success_count = data.get('successCount', 0)
                    fail_count = data.get('failureCount', 0)
                    
                    # Update status distribution
                    status_dist['hits'] += success_count
                    status_dist['misses'] += fail_count
                    
                    # Update method coverage
                    if method not in method_coverage:
                        method_coverage[method] = {'hits': 0, 'misses': 0, 'unspecified': 0}
                    method_coverage[method]['hits'] += success_count
                    method_coverage[method]['misses'] += fail_count
        
        # Process bug data
        for details in self.bugs_data['bug_details'].values():
            if 'request_sequence' in details:
                for req in details['request_sequence']:
                    request_data = self._parse_http_message(req.get('replay_request', ''))
                    response_data = self._parse_http_message(req.get('response', ''))
                    
                    if request_data and 'method' in request_data:
                        method = request_data['method']
                        status_code = response_data.get('status_code')
                        
                        if status_code:
                            # Update method coverage
                            if method not in method_coverage:
                                method_coverage[method] = {'hits': 0, 'misses': 0, 'unspecified': 0}
                            
                            # Only count if not already counted in response buckets
                            if status_code >= 500:  # These might not be in response buckets
                                status_dist['misses'] += 1
                                method_coverage[method]['misses'] += 1
        
        return {
            "status_distribution": status_dist,
            "method_coverage": method_coverage
        }

    def get_bug_information(self):
        """Get detailed information about bugs."""
        self._load_bug_data()
        
        bugs = []
        for bug in self.bugs_data['bugs']:
            details = self.bugs_data['bug_details'].get(bug['filepath'])
            if details:
                bugs.append({
                    "status_code": int(details.get('status_code', 500)),
                    "endpoint": details.get('endpoint', ''),
                    "method": details.get('verb', 'GET'),
                    "type": 'miss',
                    "request": str(details.get('request_sequence', [])),
                    "response": details.get('status_text', '')
                })
        
        return bugs

    def get_status_code_distribution(self):
        """Get distribution of HTTP status codes."""
        self._load_bug_data()
        self._load_response_data()
        
        distribution = {
            "200": 0, "401": 0, "404": 0, "500": 0, "204": 0
        }
        
        # Process response buckets
        if self.response_data and 'summary' in self.response_data:
            for endpoint_stats in self.response_data['summary'].get('endpointStats', {}).values():
                for method_stats in endpoint_stats.get('methods', {}).values():
                    for status, count in method_stats.get('statusCodeCounts', {}).items():
                        if status in distribution:
                            distribution[status] += count
        
        # Process bug buckets
        for details in self.bugs_data['bug_details'].values():
            if 'request_sequence' in details:
                for req in details['request_sequence']:
                    response_data = self._parse_http_message(req.get('response', ''))
                    status = str(response_data.get('status_code', ''))
                    if status in distribution:
                        distribution[status] += 1
        
        return distribution

    def get_kpi(self):
        """Get Key Performance Indicators."""
        self._load_bug_data()
        self._load_response_data()
        
        total_requests = 0
        success_count = 0
        unique_endpoints = set()
        
        # Process response buckets
        if self.response_data and 'summary' in self.response_data:
            for endpoint, stats in self.response_data['summary'].get('endpointStats', {}).items():
                unique_endpoints.add(endpoint)
                for method_stats in stats.get('methods', {}).values():
                    success_count += method_stats.get('successCount', 0)
                    total_requests += method_stats.get('successCount', 0)
                    total_requests += method_stats.get('failureCount', 0)
        
        # Process bug buckets
        for details in self.bugs_data['bug_details'].values():
            if 'request_sequence' in details:
                for req in details['request_sequence']:
                    request_data = self._parse_http_message(req.get('replay_request', ''))
                    if request_data and 'path' in request_data:
                        unique_endpoints.add(request_data['path'])
        
        return {
            "total_requests": total_requests,
            "critical_errors": len([b for b in self.bugs_data.get('bugs', []) 
                                  if b.get('error_code', '500').startswith('5')]),
            "unique_endpoints": len(unique_endpoints),
            "success_rate": round((success_count / total_requests * 100), 2) if total_requests > 0 else 0.0
        }

    def process_data(self):
        """Process all data and generate the final report."""
        return {
            "metadata": self.get_metadata_statistics(),
            "endpoints": self.get_endpoint_information(),
            "coverage": self.get_coverage_statistics(),
            "status_codes": self.get_status_code_distribution(),
            "kpi": self.get_kpi(),
            "bugs": self.get_bug_information()
        }

def parse_restler_results(results_dir, output_path=None):
    """
    Parse Restler results and optionally save to a file.
    
    Args:
        results_dir (str): Path to the directory containing Restler results
        output_path (str, optional): Path to save the JSON report
    
    Returns:
        dict: Parsed results in standardized format
    """
    parser = RestlerParser(results_dir)
    report = parser.process_data()
    
    if output_path:
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)
    
    return report
