import os
import sys

# Add project root to Python path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
sys.path.insert(0, project_root)

from dashboard.parsers.wuppiefuzz.parser import parse_wuppiefuzz_results

def test_wuppiefuzz_parser():
    # Get the absolute path to the zip file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
    # Test with the test_data directory first
    test_dir = os.path.join(project_root, 'test_data', 'wuppiefuzz', 'fuzzing-report')
    output_path = os.path.join(current_dir, 'wuppiefuzz_report.json')
    
    # Test directory parsing first
    try:
        print("\nTesting directory parsing...")
        raw_report, dashboard_data = parse_wuppiefuzz_results(test_dir)
        
        # If directory parsing works, test zip file
        print("\nTesting zip file parsing...")
        zip_path = os.path.join(project_root, 'output-fuzzers', 'Wuppiefuzz', 'fuzzing-report.zip')
        raw_report_zip, dashboard_data_zip = parse_wuppiefuzz_results(zip_path)
        print("\nWuppieFuzz Parser Test Results:")
        print("===============================")
        print(f"Metadata:")
        print(f"- Duration: {dashboard_data['metadata']['duration']}")
        print(f"- Total Requests: {dashboard_data['metadata']['total_requests']}")
        print(f"- Critical Issues: {dashboard_data['metadata']['critical_issues']}")
        
        print("\nCoverage Statistics:")
        coverage = dashboard_data['coverage']
        print(f"- Overall Coverage: {coverage['percentages']['overall']}%")
        print(f"- Line Coverage: {coverage['percentages']['lines']}%")
        print(f"- Function Coverage: {coverage['percentages']['functions']}%")
        
        print("\nStatus Distribution:")
        for status, percentage in coverage['status_distribution'].items():
            print(f"- {status}: {percentage}%")
        
        print("\nEndpoints:", len(dashboard_data['endpoints']))
        for endpoint in dashboard_data['endpoints']:
            print(f"- {endpoint['method']} {endpoint['path']} -> Success Rate: {endpoint['success_rate']}%")
        
        print("\nBugs Found:", len(dashboard_data['crashes']))
        for bug in dashboard_data['crashes']:
            print(f"- {bug['method']} {bug['endpoint']} -> {bug['status_code']} ({bug['severity']})")
        return True
        
    except Exception as e:
        print(f"Error during testing: {e}")
        return False

if __name__ == "__main__":
    test_wuppiefuzz_parser()
