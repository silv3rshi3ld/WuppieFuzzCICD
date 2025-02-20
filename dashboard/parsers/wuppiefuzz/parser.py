"""Parser for WuppieFuzz results."""

import json
import os
from dashboard.parsers.base.parser import BaseParser

def parse_wuppiefuzz_results(input_path):
    """Parse WuppieFuzz results from a directory."""
    report_file = os.path.join(input_path, 'report.json')
    
    if not os.path.exists(report_file):
        raise FileNotFoundError(f"Report file not found at {report_file}")
    
    with open(report_file, 'r') as f:
        report = json.load(f)
    
    # Transform the data into dashboard format
    dashboard_data = {
        'metadata': {
            'fuzzer': 'WuppieFuzz',
            'total_requests': report['metadata']['total_requests'],
            'critical_issues': report['metadata']['critical_issues'],
            'duration': report['metadata']['duration']
        },
        'stats': {
            'statusDistribution': {
                'hits': sum(1 for e in report['endpoints'] if e['status_codes'].get('200', 0) > 0),
                'misses': sum(1 for e in report['endpoints'] if e['status_codes'].get('500', 0) > 0),
                'unspecified': 0
            },
            'methodCoverage': {
                'GET': sum(1 for e in report['endpoints'] if e['method'] == 'GET'),
                'POST': sum(1 for e in report['endpoints'] if e['method'] == 'POST')
            },
            'statusCodes': [
                {'status': status, 'count': count}
                for endpoint in report['endpoints']
                for status, count in endpoint['status_codes'].items()
            ]
        },
        'endpoints': [
            {
                'path': endpoint['path'],
                'method': endpoint['method'],
                'total_requests': endpoint['total_requests'],
                'success_rate': endpoint['success_rate'],
                'type': 'hit' if endpoint['success_rate'] > 80 else 'miss'
            }
            for endpoint in report['endpoints']
        ]
    }
    
    return report, dashboard_data
