"""Parser for WuppieFuzz results."""

import os
import json
import sqlite3
from typing import Dict, List, Any, Optional
from datetime import datetime

from ..base.parser import BaseParser
from ..base.zip_handler import ZipHandler

class WuppieFuzzParser(BaseParser):
    """Parser for WuppieFuzz results."""
    
    def __init__(self):
        """Initialize the parser."""
        super().__init__()
        self.data["metadata"]["name"] = "WuppieFuzz"
        self.conn = None
        self.cursor = None
        self.handler = None  # Keep reference to ZipHandler
    
    def get_file_patterns(self) -> List[str]:
        """Get list of file patterns to extract from zip.
        
        Returns:
            List of glob patterns
        """
        return [
            "**/grafana/report.db",
            "**/endpointcoverage/index.html"
        ]
    
    def parse_zip(self, zip_path: str) -> Dict[str, Any]:
        """Parse WuppieFuzz results directly from ZIP file.
        
        Args:
            zip_path: Path to the ZIP file
            
        Returns:
            Dictionary containing parsed data
        """
        self.handler = ZipHandler(zip_path)
        self.handler.keep_alive()  # Keep temp directory until parsing is done
        
        with self.handler:
            # Extract required files
            files = self.handler.extract_fuzzer_data('wuppiefuzz')
            
            if 'db' not in files:
                raise FileNotFoundError("Required database file not found in ZIP")
                
            # Parse the extracted data
            try:
                return self.parse_results(os.path.dirname(os.path.dirname(files['db'])))
            finally:
                # Clean up temp directory
                self.handler.cleanup()
                self.handler = None
    
    def parse_results(self, input_path: str) -> Dict[str, Any]:
        """Parse WuppieFuzz results from a directory.
        
        Args:
            input_path: Path to directory containing extracted files
            
        Returns:
            Dictionary containing parsed data
        """
        print(f"Parsing WuppieFuzz results from: {input_path}")
        
        try:
            # Find and parse SQLite database
            db_path = os.path.join(input_path, "grafana", "report.db")
            if not os.path.exists(db_path):
                raise FileNotFoundError(f"Report database not found at {db_path}")
                
            # Open database connection
            self.conn = sqlite3.connect(db_path)
            self.cursor = self.conn.cursor()
            
            # Get latest run ID and metadata
            self.cursor.execute("""
                SELECT id, timestamp
                FROM runs
                ORDER BY timestamp DESC 
                LIMIT 1
            """)
            run_id, timestamp = self.cursor.fetchone()
            print(f"Found run ID: {run_id} timestamp: {timestamp}")
            
            # Calculate duration from request timestamps
            duration = "00:00:00"
            try:
                self.cursor.execute("""
                    SELECT MIN(timestamp), MAX(timestamp)
                    FROM requests
                    WHERE runid = ?
                """, (run_id,))
                min_time, max_time = self.cursor.fetchone()
                if min_time and max_time:
                    try:
                        start = datetime.fromisoformat(min_time)
                        end = datetime.fromisoformat(max_time)
                        duration = str(end - start)
                    except ValueError:
                        pass
            except sqlite3.Error:
                pass
            
            # Update metadata
            self.data["metadata"].update({
                "timestamp": timestamp,
                "duration": duration,
                "fuzzer": "WuppieFuzz"
            })
            
            # Get coverage data
            self.cursor.execute("""
                SELECT line_coverage, line_coverage_total,
                       endpoint_coverage, endpoint_coverage_total
                FROM coverage 
                WHERE runid = ?
            """, (run_id,))
            coverage = self.cursor.fetchone()
            if coverage:
                print(f"Coverage data: {coverage}")
                line_coverage, line_total, endpoint_coverage, endpoint_total = coverage
                
                # Update coverage metrics
                self.update_coverage_metrics(
                    line_covered=line_coverage or 0,
                    line_total=line_total or 100,
                    func_covered=endpoint_coverage or 0,
                    func_total=endpoint_total or 100
                )
            
            # Get request data
            self.cursor.execute("""
                SELECT path, type, body, data, url, testcase,
                       (SELECT COUNT(*) FROM requests r2 
                        WHERE r2.path = r1.path 
                        AND r2.type = r1.type 
                        AND r2.runid = ?) as endpoint_requests
                FROM requests r1
                WHERE runid = ? AND body IS NOT NULL
            """, (run_id, run_id))
            requests = self.cursor.fetchall()
            print(f"Found {len(requests)} requests")
            
            # Process requests
            endpoint_stats = {}
            total_requests = 0
            method_counts = {"GET": 0, "POST": 0, "PUT": 0, "DELETE": 0}
            status_counts = {}
            hits = 0
            misses = 0
            
            for path, method, response_body, request_data, url, testcase, endpoint_reqs in requests:
                try:
                    # Safely decode data
                    response_str = self._safe_decode(response_body)
                    request_str = self._safe_decode(request_data)
                    
                    # Try to parse request data
                    try:
                        request_json = json.loads(request_str) if request_str else {}
                    except json.JSONDecodeError:
                        request_json = {
                            "method": method,
                            "path": path,
                            "url": url
                        }
                    
                    status_code = self._extract_status_code(response_str)
                    
                    # Update method counts
                    if method.upper() in method_counts:
                        method_counts[method.upper()] += 1
                    
                    # Update status code counts
                    str_status = str(status_code)
                    if str_status not in status_counts:
                        status_counts[str_status] = {"status": str_status, "count": 0}
                    status_counts[str_status]["count"] += 1
                    
                    # Update hits/misses
                    if 200 <= status_code < 300:
                        hits += 1
                    else:
                        misses += 1
                    
                    # Create endpoint key
                    endpoint_key = f"{method}:{path}"
                    if endpoint_key not in endpoint_stats:
                        endpoint_stats[endpoint_key] = {
                            "path": path,
                            "method": method,
                            "total_requests": endpoint_reqs,
                            "success_requests": 0,
                            "status_codes": {},
                            "responses": {},
                            "severity_counts": {
                                "critical": 0,
                                "high": 0,
                                "medium": 0,
                                "low": 0
                            }
                        }
                    
                    endpoint = endpoint_stats[endpoint_key]
                    total_requests += 1
                    
                    # Update status code counts
                    if str_status not in endpoint["status_codes"]:
                        endpoint["status_codes"][str_status] = 0
                    endpoint["status_codes"][str_status] += 1
                    
                    # Store response example
                    if str_status not in endpoint["responses"]:
                        try:
                            response_json = json.loads(response_str)
                            endpoint["responses"][str_status] = json.dumps(response_json, indent=2)
                        except json.JSONDecodeError:
                            endpoint["responses"][str_status] = response_str
                    
                    # Update success requests
                    if 200 <= status_code < 300:
                        endpoint["success_requests"] += 1
                    
                    # Update severity counts
                    severity = "low"
                    if status_code >= 500:
                        error_msg, has_stack_trace = self._extract_error_details(response_str)
                        if has_stack_trace:
                            severity = "critical"
                        else:
                            severity = "high"
                    elif status_code >= 400:
                        severity = "medium"
                    
                    endpoint["severity_counts"][severity] += 1
                    
                except Exception as e:
                    print(f"Error processing request: {e}")
                    continue
            
            # Add endpoints to data
            for endpoint_data in endpoint_stats.values():
                self.add_endpoint(endpoint_data)
            
            # Update stats
            self.data["stats"].update({
                "total_requests": total_requests,
                "critical_issues": sum(1 for e in endpoint_stats.values() 
                                    if e["severity_counts"]["critical"] > 0),
                "unique_endpoints": len(endpoint_stats),
                "methodCoverage": method_counts,
                "statusDistribution": {
                    "hits": hits,
                    "misses": misses,
                    "unspecified": 0
                },
                "statusCodes": list(status_counts.values())
            })
            
            return self.data
                
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            raise
            
        finally:
            # Close database connection
            if self.cursor:
                self.cursor.close()
            if self.conn:
                self.conn.close()
    
    def _safe_decode(self, data: Optional[bytes]) -> str:
        """Safely decode data to string."""
        if data is None:
            return ""
        if isinstance(data, bytes):
            return data.decode('utf-8', errors='ignore')
        return str(data)
    
    def _extract_status_code(self, response_str: str) -> int:
        """Extract status code from response string."""
        try:
            response = json.loads(response_str)
            if isinstance(response, dict):
                # Try different common status code fields
                status = response.get('status_code') or response.get('status') or response.get('code')
                if status is not None:
                    return int(status)
                
                # Check for success indicators
                if response.get('success') is True:
                    return 200
                if response.get('error') is None and response.get('data') is not None:
                    return 200
                
                # Look for error indicators
                if response.get('error') or response.get('errors'):
                    return 400
                
                # Default to 200 if response looks valid
                return 200
            
            # If response is a list or other valid JSON, assume success
            return 200
            
        except json.JSONDecodeError:
            # Try to find status code in raw response
            import re
            
            # Look for status code patterns
            status_patterns = [
                r'status["\s:]+(\d{3})',
                r'HTTP/\d\.\d\s+(\d{3})',
                r'code["\s:]+(\d{3})'
            ]
            
            for pattern in status_patterns:
                status_match = re.search(pattern, response_str)
                if status_match:
                    return int(status_match.group(1))
            
            # Look for success/error indicators in raw response
            if any(s in response_str.lower() for s in ['success', 'ok', '200 ok']):
                return 200
            if any(s in response_str.lower() for s in ['error', 'fail', 'exception']):
                return 500
            
            # Default to 200 if response exists and no error indicators
            return 200
    
    def _extract_error_details(self, response_str: str) -> tuple[str, bool]:
        """Extract error details from response string."""
        has_stack_trace = False
        error_msg = "Server Error"
        
        try:
            response = json.loads(response_str)
            if isinstance(response, dict):
                error_msg = (
                    response.get('error') or 
                    response.get('message') or 
                    response.get('detail') or 
                    error_msg
                )
                
                stack_trace = (
                    response.get('stack_trace') or 
                    response.get('stackTrace') or 
                    response.get('traceback') or
                    ''
                )
                has_stack_trace = bool(stack_trace)
                if has_stack_trace:
                    error_msg = f"{error_msg}\n{stack_trace}"
                    
        except json.JSONDecodeError:
            if any(pattern in response_str for pattern in [
                'Traceback', 'Stack trace:', 'at ', 'Exception in', 'Error:'
            ]):
                has_stack_trace = True
                error_msg = response_str
                
        return error_msg, has_stack_trace

def parse_wuppiefuzz_results(input_path: str) -> tuple[dict, dict]:
    """Parse WuppieFuzz results and return report and dashboard data.
    
    Args:
        input_path: Path to directory containing extracted files
        
    Returns:
        Tuple of (report, dashboard) dictionaries
    """
    parser = WuppieFuzzParser()
    
    # Handle both ZIP and directory input
    if input_path.endswith('.zip'):
        dashboard = parser.parse_zip(input_path)
    else:
        dashboard = parser.parse_results(input_path)
        
    # For now, return the same data as both report and dashboard
    # Can be modified later if report needs different structure
    return dashboard, dashboard
