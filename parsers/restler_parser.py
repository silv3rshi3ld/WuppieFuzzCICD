import os
import json
import re
from datetime import datetime
import zipfile
import tempfile
import shutil
import traceback
import base64

class RestlerParser:
    def __init__(self, zip_path):
        """
        Initialize the Restler parser.

        Args:
            zip_path (str): Path to the zip file containing Restler results
        """
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

            # Load main Bugs.json
            bugs_file = os.path.join(self.bug_buckets_dir, 'Bugs.json')
            if os.path.exists(bugs_file):
                try:
                    with open(bugs_file, 'r') as f:
                        self.bugs_data['bugs'] = json.load(f).get('bugs', [])
                except (FileNotFoundError, json.JSONDecodeError):
                    print(f"Warning: Could not load or parse {bugs_file}")

            # Load individual bug details
            for bug in self.bugs_data['bugs']:
                bug_file = os.path.join(self.bug_buckets_dir, bug['filepath'])
                if os.path.exists(bug_file):
                    try:
                        with open(bug_file, 'r') as f:
                            self.bugs_data['bug_details'][bug['filepath']] = json.load(f)
                    except (FileNotFoundError, json.JSONDecodeError):
                        print(f"Warning: Could not load or parse {bug_file}")

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
                try:
                    with open(summary_file, 'r') as f:
                        self.response_data['summary'] = json.load(f)
                except (FileNotFoundError, json.JSONDecodeError):
                    print(f"Warning: Could not load or parse {summary_file}")

            # Load errorBuckets.json
            errors_file = os.path.join(self.response_buckets_dir, 'errorBuckets.json')
            if os.path.exists(errors_file):
                try:
                    with open(errors_file, 'r') as f:
                        self.response_data['errors'] = json.load(f)
                except (FileNotFoundError, json.JSONDecodeError):
                    print(f"Warning: Could not load or parse {errors_file}")

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

    def _extract_traceback(self, html_body):
        """Extract traceback information from HTML response."""
        try:
            # Extract the exception type
            title_match = re.search(r'<title>(.*?)</title>', html_body)
            exception_type = title_match.group(1) if title_match else "Unknown Exception"

            # Extract the error message
            error_message_match = re.search(r'<p class="errormsg">(.*?)</p>', html_body)
            error_message = error_message_match.group(1) if error_message_match else "No error message found"

            # Extract the traceback
            traceback_match = re.search(r'<textarea cols="50" rows="10" name="code" readonly>(.*?)</textarea>', html_body, re.DOTALL)
            traceback_text = traceback_match.group(1) if traceback_match else "No traceback found"

            return {
                "exception_type": exception_type,
                "error_message": error_message,
                "traceback": traceback_text.strip()
            }
        except Exception as e:
            print(f"Warning: Error extracting traceback: {e}")
            return {}

    def build_curl_command(self, request_data):
        """Build a reproducible curl command from request data."""
        host = request_data.get('headers', {}).get('host', 'localhost:5000')
        base_url = f"http://{host}"
        method = request_data.get('method', 'GET')
        path = request_data.get('path', '')
        headers = request_data.get('headers', {})
        body = request_data.get('body', '')
        if body:
            encoded_body = base64.b64encode(body.encode()).decode()
            cmd = (
                f"echo {encoded_body} | base64 --decode | \\\n"
                f"curl {base_url}{path} \\\n"
                f"    --request {method} \\\n"
            )
            if 'accept' in headers:
                cmd += f"    --header 'accept: {headers['accept']}' \\\n"
            if 'content-type' in headers:
                cmd += f"    --header 'content-type: {headers['content-type']}' \\\n"
            cmd += f"    --data @-"
            return cmd
        else:
            return f"curl {base_url}{path} --request {method}"

    def get_concise_response_data(self, response_data):
        """Return a concise representation of response data."""
        headers = response_data.get('headers', {})
        content_type = headers.get('content-type', '')
        body = response_data.get('body', '')
        if 'application/json' in content_type:
            try:
                parsed = json.loads(body)
                return json.dumps(parsed, separators=(',', ':'))
            except Exception:
                return body[:200]
        else:
            traceback_info = self._extract_traceback(body)
            concise = {
                "exception_type": traceback_info.get("exception_type"),
                "error_message": traceback_info.get("error_message")
            }
            return json.dumps(concise, separators=(',', ':'))

    def get_metadata_statistics(self):
        """Get metadata statistics about the fuzzing session."""
        print("Processing metadata statistics...")
        self._load_bug_data()
        self._load_response_data()

        duration = "Unknown"
        total_requests = 0
        unique_bugs = 0
        critical_issues = 0

        try:
            summary = self.response_data.get('summary', {})
            if summary:
                for endpoint_stats in summary.get('endpointStats', {}).values():
                    for method_stats in endpoint_stats.get('methods', {}).values():
                        total_requests += method_stats.get('successCount', 0)
                        total_requests += method_stats.get('failureCount', 0)
            for details in self.bugs_data['bug_details'].values():
                if 'request_sequence' in details:
                    total_requests += len(details['request_sequence'])
            engine_out = os.path.join(self.results_dir, 'EngineStdOut.txt')
            if os.path.exists(engine_out):
                try:
                    with open(engine_out, 'r') as f:
                        content = f.read()
                        start_match = re.search(r'Starting Fuzzing: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', content)
                        end_match = re.search(r'Fuzzing stopped: (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})', content)
                        if start_match and end_match:
                            start_time = datetime.strptime(start_match.group(1), '%Y-%m-%d %H:%M:%S')
                            end_time = datetime.strptime(end_match.group(1), '%Y-%m-%d %H:%M:%S')
                            duration = str(end_time - start_time)
                except Exception as e:
                    print(f"Warning: Error extracting duration: {e}")
            unique_bugs = len(self.bugs_data.get('bugs', []))
            critical_issues = sum(1 for bug in self.bugs_data.get('bugs', [])
                                if bug.get('error_code', '500').startswith('5'))
        except Exception as e:
            print(f"Warning: Error in get_metadata_statistics: {e}")

        print(f"Metadata statistics processed: duration={duration}, total_requests={total_requests}, unique_bugs={unique_bugs}, critical_issues={critical_issues}")
        return {
            "duration": duration,
            "total_requests": total_requests,
            "unique_bugs": unique_bugs,
            "critical_issues": critical_issues
        }

    def get_endpoint_information(self):
        """Get detailed information about each endpoint."""
        print("Processing endpoint information...")
        self._load_bug_data()
        self._load_response_data()

        endpoints = []

        try:
            for details in self.bugs_data['bug_details'].values():
                if 'request_sequence' in details:
                    for req in details['request_sequence']:
                        request_data = self._parse_http_message(req.get('replay_request', ''))
                        response_data = self._parse_http_message(req.get('response', ''))

                        if request_data and 'path' in request_data:
                            endpoints.append({
                                "path": request_data['path'],
                                "http_method": request_data.get('method', ''),
                                "status_code": response_data.get('status_code'),
                                "type": 'miss' if response_data.get('status_code', 0) >= 400 else 'hit',
                                "request_details": self.build_curl_command(request_data),
                                "response_data": self.get_concise_response_data(response_data)
                            })

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
        except Exception as e:
            print(f"Warning: Error in get_endpoint_information: {e}")

        print(f"Found {len(endpoints)} endpoints.")
        return endpoints

    def get_bug_information(self):
        """Get concise bug information."""
        print("Processing bug information...")
        self._load_bug_data()
        bugs = []
        try:
            for details in self.bugs_data['bug_details'].values():
                if 'request_sequence' in details:
                    for req in details['request_sequence']:
                        request_data = self._parse_http_message(req.get('replay_request', ''))
                        response_data = self._parse_http_message(req.get('response', ''))
                        if request_data:
                            bug_entry = {
                                "endpoint": request_data.get('path', ''),
                                "method": request_data.get('method', 'GET'),
                                "type": 'miss' if response_data.get('status_code', 0) >= 400 else 'hit',
                                "request": self.build_curl_command(request_data),
                                "response": self.get_concise_response_data(response_data)
                            }
                            bugs.append(bug_entry)
        except Exception as e:
            print(f"Warning: Error in get_bug_information: {e}")
        print(f"Found {len(bugs)} bugs.")
        return bugs

    def get_coverage_statistics(self):
        """Get coverage statistics."""
        print("Processing coverage statistics...")
        self._load_bug_data()
        self._load_response_data()
        coverage = {
            "endpoints_tested": len(self.response_data.get('summary', {}).get('endpointStats', {}))
        }
        print(f"Coverage statistics processed: endpoints_tested={coverage['endpoints_tested']}")
        return coverage

    def get_status_code_distribution(self):
        """Get distribution of HTTP status codes."""
        print("Processing status code distribution...")
        self._load_bug_data()
        self._load_response_data()

        distribution = {
            "200": 0, "401": 0, "404": 0, "500": 0, "204": 0
        }

        try:
            if self.response_data and 'summary' in self.response_data:
                for endpoint_stats in self.response_data['summary'].get('endpointStats', {}).values():
                    for method_stats in endpoint_stats.get('methods', {}).values():
                        for status, count in method_stats.get('statusCodeCounts', {}).items():
                            if status in distribution:
                                distribution[status] += count
            for details in self.bugs_data['bug_details'].values():
                if 'request_sequence' in details:
                    for req in details['request_sequence']:
                        response_data = self._parse_http_message(req.get('response', ''))
                        status = str(response_data.get('status_code', ''))
                        if status in distribution:
                            distribution[status] += 1
        except Exception as e:
            print(f"Warning: Error in get_status_code_distribution: {e}")

        print(f"Status code distribution processed: {distribution}")
        return distribution

    def get_kpi(self):
        """Get Key Performance Indicators."""
        print("Processing KPI...")
        self._load_bug_data()
        self._load_response_data()

        total_requests = 0
        success_count = 0
        unique_endpoints = set()

        try:
            if self.response_data and 'summary' in self.response_data:
                for endpoint, stats in self.response_data['summary'].get('endpointStats', {}).items():
                    unique_endpoints.add(endpoint)
                    for method_stats in stats.get('methods', {}).values():
                        success_count += method_stats.get('successCount', 0)
                        total_requests += method_stats.get('successCount', 0)
                        total_requests += method_stats.get('failureCount', 0)
            for details in self.bugs_data['bug_details'].values():
                if 'request_sequence' in details:
                    for req in details['request_sequence']:
                        request_data = self._parse_http_message(req.get('replay_request', ''))
                        if request_data and 'path' in request_data:
                            unique_endpoints.add(request_data['path'])
        except Exception as e:
            print(f"Warning: Error in get_kpi: {e}")

        print(f"KPI processed: total_requests={total_requests}, success_count={success_count}, unique_endpoints={len(unique_endpoints)}")
        return {
            "total_requests": total_requests,
            "critical_errors": len([b for b in self.bugs_data.get('bugs', [])
                                  if b.get('error_code', '500').startswith('5')]),
            "unique_endpoints": len(unique_endpoints),
            "success_rate": round((success_count / total_requests * 100), 2) if total_requests > 0 else 0.0
        }

    def process_data(self):
        """Process all data and generate the final report."""
        try:
            print("Starting Restler data processing...")
            self.extract_zip()
            print(f"Extracted Restler results to {self.temp_dir}")

            report = {
                "metadata": self.get_metadata_statistics(),
                "endpoints": self.get_endpoint_information(),
                "coverage": self.get_coverage_statistics(),
                "status_codes": self.get_status_code_distribution(),
                "kpi": self.get_kpi(),
                "bugs": self.get_bug_information()
            }

            print("Restler data processing complete.")
            return report
        finally:
            if self.temp_dir and os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)

if __name__ == '__main__':
    zip_path = 'output-fuzzers/Restler/restler-fuzz-results.zip'
    try:
        with RestlerParser(zip_path) as parser:
            report = parser.process_data()
            # Save JSON report in the same folder as the zip file
            output_path = os.path.join(os.path.dirname(zip_path), 'restler_report.json')
            with open(output_path, 'w') as f:
                json.dump(report, f, indent=2)
            print(f"Restler report saved to {output_path}")
    except Exception as e:
        print(f"Error parsing Restler results: {e}")
