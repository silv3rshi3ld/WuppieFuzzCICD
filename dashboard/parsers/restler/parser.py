"""Parser for RESTler results."""

import json
import os

def parse_restler_results(input_path):
    """Parse RESTler results from a directory."""
    summary_file = os.path.join(input_path, 'testing_summary.json')
    
    if not os.path.exists(summary_file):
        raise FileNotFoundError(f"Summary file not found at {summary_file}")
    
    with open(summary_file, 'r') as f:
        report = json.load(f)
    
    # Transform the data into dashboard format
    dashboard_data = {
        'metadata': {
            'fuzzer': 'Restler',
            'total_requests': report['metadata']['total_requests'],
            'critical_issues': report['metadata']['critical_issues'],
            'duration': report['metadata']['duration']
        },
        'stats': {
            'statusDistribution': {
                'hits': sum(1 for e in report['endpoints'] if e['status_codes'].get('200', 0) > 0 or e['status_codes'].get('201', 0) > 0),
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
