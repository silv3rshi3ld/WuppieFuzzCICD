"""Parser for EvoMaster results."""

import os
import re

def parse_test_file(file_path):
    """Parse a Python test file and extract test information."""
    tests = []
    current_test = None
    
    with open(file_path, 'r') as f:
        lines = f.readlines()
        
    for line in lines:
        # Start of a test method
        if line.strip().startswith('def test_'):
            if current_test:
                tests.append(current_test)
            current_test = {
                'name': line.strip().split('def ')[1].split('(')[0],
                'method': None,
                'endpoint': None,
                'status': None,
                'type': None
            }
        
        # Look for HTTP method and endpoint in comments
        if current_test and '# (' in line and ')' in line:
            match = re.search(r'# \((\d+)\) (GET|POST|PUT|DELETE):([^\s]+)', line)
            if match:
                status, method, endpoint = match.groups()
                current_test['method'] = method
                current_test['endpoint'] = endpoint
                current_test['status'] = int(status)
                current_test['type'] = 'hit' if int(status) < 400 else 'miss'
    
    if current_test:
        tests.append(current_test)
    
    return tests

def parse_evomaster_results(input_path):
    """Parse EvoMaster results from a directory."""
    successes_file = os.path.join(input_path, 'EvoMaster_successes_Test.py')
    faults_file = os.path.join(input_path, 'EvoMaster_faults_Test.py')
    
    if not os.path.exists(successes_file) or not os.path.exists(faults_file):
        raise FileNotFoundError("Required test files not found")
    
    # Parse both test files
    success_tests = parse_test_file(successes_file)
    fault_tests = parse_test_file(faults_file)
    
    # Combine all tests
    all_tests = success_tests + fault_tests
    
    # Calculate statistics
    total_requests = len(all_tests)
    critical_issues = sum(1 for t in all_tests if t['status'] >= 500)
    
    # Create report data
    report = {
        'metadata': {
            'total_requests': total_requests,
            'critical_issues': critical_issues,
            'duration': '0:10:00'  # Example duration
        },
        'tests': all_tests
    }
    
    # Create dashboard data
    dashboard_data = {
        'metadata': {
            'fuzzer': 'Evomaster',
            'total_requests': total_requests,
            'critical_issues': critical_issues,
            'duration': '0:10:00'
        },
        'stats': {
            'statusDistribution': {
                'hits': sum(1 for t in all_tests if t['status'] < 400),
                'misses': sum(1 for t in all_tests if t['status'] >= 400),
                'unspecified': 0
            },
            'methodCoverage': {
                method: sum(1 for t in all_tests if t['method'] == method)
                for method in ['GET', 'POST', 'PUT', 'DELETE']
            },
            'statusCodes': [
                {'status': str(status), 'count': sum(1 for t in all_tests if t['status'] == status)}
                for status in {t['status'] for t in all_tests}
            ]
        },
        'endpoints': [
            {
                'path': test['endpoint'],
                'method': test['method'],
                'status_code': test['status'],
                'type': test['type'],
                'name': test['name']
            }
            for test in all_tests
        ]
    }
    
    return report, dashboard_data
