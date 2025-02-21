import os
import sys

# Add project root to Python path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
sys.path.insert(0, project_root)

from dashboard.parsers.restler.parser import parse_restler_results

def test_restler_parser():
    # Get the absolute path to the results directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
    results_dir = os.path.join(project_root, 'output-fuzzers', 'Restler', 'restler-fuzz-results')
    output_path = os.path.join(current_dir, 'restler_report.json')
    
    # Debug: Print file paths
    bug_buckets_dir = os.path.join(results_dir, 'RestlerResults', 'experiment135', 'bug_buckets')
    response_buckets_dir = os.path.join(results_dir, 'ResponseBuckets')
    print("\nChecking files:")
    print(f"Bug buckets dir exists: {os.path.exists(bug_buckets_dir)}")
    print(f"Response buckets dir exists: {os.path.exists(response_buckets_dir)}")
    print(f"Bugs.json exists: {os.path.exists(os.path.join(bug_buckets_dir, 'Bugs.json'))}")
    print(f"runSummary.json exists: {os.path.exists(os.path.join(response_buckets_dir, 'runSummary.json'))}")
    
    # Parse results and save to file
    try:
        report = parse_restler_results(results_dir, output_path)
        print("\nRestler Parser Test Results:")
        print("===========================")
        print(f"Metadata:")
        print(f"- Duration: {report['metadata']['duration']}")
        print(f"- Total Requests: {report['metadata']['total_requests']}")
        print(f"- Unique Bugs: {report['metadata']['unique_bugs']}")
        print(f"- Critical Issues: {report['metadata']['critical_issues']}")
        
        print("\nEndpoint Coverage:")
        endpoints = {}
        for endpoint in report['endpoints']:
            key = f"{endpoint['http_method']} {endpoint['path']}"
            if key not in endpoints:
                endpoints[key] = {'hit': 0, 'miss': 0}
            if endpoint['type'] == 'hit':
                endpoints[key]['hit'] += 1
            else:
                endpoints[key]['miss'] += 1
        
        for endpoint, stats in endpoints.items():
            print(f"- {endpoint}:")
            print(f"  Hits: {stats['hit']}, Misses: {stats['miss']}")
        
        print("\nStatus Distribution:")
        for status, count in report['coverage']['status_distribution'].items():
            print(f"- {status}: {count}")
        
        print("\nMethod Coverage:")
        for method, stats in report['coverage']['method_coverage'].items():
            print(f"- {method}:")
            print(f"  Hits: {stats['hits']}, Misses: {stats['misses']}, Unspecified: {stats['unspecified']}")
        
        print("\nBugs Found:", len(report['bugs']))
        for bug in report['bugs']:
            print(f"- {bug['method']} {bug['endpoint']} -> {bug['status_code']}")
        
        print(f"\nDetailed report saved to: {output_path}")
        return True
        
    except Exception as e:
        print(f"Error during testing: {e}")
        return False

if __name__ == "__main__":
    test_restler_parser()
