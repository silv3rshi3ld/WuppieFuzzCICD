"""Parser for WuppieFuzz results."""

import os
import json
import sqlite3
import re
from datetime import datetime
from collections import defaultdict

def extract_error_message(html_response):
    """Extract error message from HTML error page."""
    if not html_response:
        return "No error details available"
        
    # Try to find the error message in the title tag
    title_match = re.search(r'<title>(.*?)</title>', html_response)
    if title_match:
        # Clean up the title to get just the error message
        title = title_match.group(1)
        if '//' in title:
            title = title.split('//')[0].strip()
        return title
        
    return "No error details available"

def parse_wuppiefuzz_results(input_path):
    """Parse WuppieFuzz results from a directory."""
    # Get database path
    db_path = os.path.join(input_path, 'grafana', 'report.db')
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Database file not found at {db_path}")

    # Connect to database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Get latest coverage data
        cursor.execute("""
            SELECT 
                line_coverage,
                line_coverage_total,
                endpoint_coverage,
                endpoint_coverage_total
            FROM coverage 
            ORDER BY timestamp DESC 
            LIMIT 1
        """)
        coverage_row = cursor.fetchone()
        
        # Get request statistics
        cursor.execute("""
            SELECT 
                r.type as method,
                r.path,
                s.status,
                COUNT(*) as count
            FROM requests r
            LEFT JOIN responses s ON r.id = s.reqid
            GROUP BY r.type, r.path, s.status
        """)
        
        # Process requests data
        endpoints = defaultdict(lambda: {'success': 0, 'total': 0})
        method_coverage = defaultdict(int)
        status_codes = defaultdict(int)
        total_requests = 0
        
        for row in cursor.fetchall():
            method, path, status, count = row
            if not method or not path:
                continue
                
            key = (method, path)
            endpoints[key]['total'] += count
            if status and status < 400:
                endpoints[key]['success'] += count
            if status:
                status_codes[str(status)] += count
            method_coverage[method] += 1
            total_requests += count

        # Format endpoints data
        endpoints_list = []
        for (method, path), counts in endpoints.items():
            success_rate = (counts['success'] / counts['total'] * 100) if counts['total'] > 0 else 0
            endpoints_list.append({
                'path': path,
                'method': method,
                'total_requests': counts['total'],
                'success_rate': success_rate,
                'type': 'hit' if success_rate > 80 else 'miss'
            })

        # Get crashes (responses with 5xx status codes)
        cursor.execute("""
            SELECT 
                r.id,
                r.timestamp,
                r.path,
                r.type as method,
                s.status,
                s.error,
                r.data as request_data,
                s.data as response_data,
                COUNT(*) as occurrence_count
            FROM requests r
            JOIN responses s ON r.id = s.reqid
            WHERE s.status >= 500
            GROUP BY r.path, r.type, s.status, s.error
            ORDER BY r.timestamp DESC
        """)
        
        crashes = []
        for row in cursor.fetchall():
            error_msg = extract_error_message(row[7].decode('utf-8') if isinstance(row[7], bytes) else row[7])
            severity = 'Critical' if row[4] >= 500 else 'High'
            
            # Determine category based on error message
            category = 'Server Error'
            if 'IntegrityError' in error_msg:
                category = 'Database Error'
            elif 'OperationalError' in error_msg:
                category = 'SQL Error'
            elif 'NullPointerException' in error_msg:
                category = 'Null Reference'
            elif 'TimeoutError' in error_msg:
                category = 'Timeout'
            
            crashes.append({
                'id': row[0],
                'timestamp': row[1],
                'endpoint': row[2],
                'method': row[3],
                'status_code': row[4],
                'severity': severity,
                'category': category,
                'stack_trace': error_msg,
                'request': row[6],
                'response': row[7],
                'type': 'crash',
                'occurrence_count': row[8],
                'last_seen': row[1],
                'first_seen': row[1],
                'evidence': {
                    'stack_trace': error_msg,
                    'error_message': error_msg,
                    'pattern_matches': []
                },
                'reproduction': {
                    'prerequisites': [],
                    'steps': [
                        f"Send {row[3]} request to {row[2]}",
                        "Observe server error response"
                    ],
                    'curl_command': f"curl -X {row[3]} http://localhost:8080{row[2]}"
                }
            })

        # Calculate run duration
        cursor.execute("""
            SELECT 
                MIN(timestamp) as start_time,
                MAX(timestamp) as end_time
            FROM runs
        """)
        time_row = cursor.fetchone()
        if time_row and time_row[0] and time_row[1]:
            start = datetime.strptime(time_row[0], '%Y-%m-%dT%H:%M:%S.%fZ')
            end = datetime.strptime(time_row[1], '%Y-%m-%dT%H:%M:%S.%fZ')
            duration = str(end - start)
        else:
            duration = '0s'

        # Calculate coverage percentages
        line_coverage = coverage_row[0] if coverage_row else 0
        line_total = coverage_row[1] if coverage_row else 1  # Avoid division by zero
        function_coverage = coverage_row[2] if coverage_row else 0
        function_total = coverage_row[3] if coverage_row else 1

        # Transform data into dashboard format
        dashboard_data = {
            'metadata': {
                'fuzzer': 'WuppieFuzz',
                'total_requests': total_requests,
                'critical_issues': len([c for c in crashes if c['severity'] == 'Critical']),
                'duration': duration
            },
            'stats': {
                'statusDistribution': {
                    'hits': sum(1 for e in endpoints_list if e['type'] == 'hit'),
                    'misses': sum(1 for e in endpoints_list if e['type'] == 'miss'),
                    'unspecified': 0
                },
                'methodCoverage': {
                    'GET': method_coverage.get('GET', 0),
                    'POST': method_coverage.get('POST', 0),
                    'PUT': method_coverage.get('PUT', 0),
                    'DELETE': method_coverage.get('DELETE', 0)
                },
                'statusCodes': [
                    {'status': status, 'count': count}
                    for status, count in status_codes.items()
                ],
                'total_requests': total_requests,
                'critical_issues': len([c for c in crashes if c['severity'] == 'Critical']),
                'unique_endpoints': len(endpoints_list),
                'total_crashes': len(crashes),
                'total_issues': len(crashes)
            },
            'coverage': {
                'lines': {
                    'covered': line_coverage,
                    'total': line_total,
                    'percentage': (line_coverage / line_total) * 100 if line_total > 0 else 0
                },
                'functions': {
                    'covered': function_coverage,
                    'total': function_total,
                    'percentage': (function_coverage / function_total) * 100 if function_total > 0 else 0
                },
                'branches': {
                    'covered': 0,
                    'total': 0,
                    'percentage': 0
                },
                'statements': {
                    'covered': 0,
                    'total': 0,
                    'percentage': 0
                }
            },
            'bugs': crashes,  # Changed from crashes to bugs to match dashboard.js
            'endpoints': endpoints_list
        }

        return {'total_requests': total_requests}, dashboard_data

    finally:
        conn.close()
