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
    zip_path = os.path.join(project_root, 'output-fuzzers', 'Wuppiefuzz', 'fuzzing-report.zip')
    output_path = os.path.join(current_dir, 'wuppiefuzz_report.json')
    
    # Parse results and save to file
    try:
        report = parse_wuppiefuzz_results(zip_path, output_path)
        print("\nWuppieFuzz Parser Test Results:")
        print("===============================")
        print(f"Metadata:")
        print(f"- Duration: {report['metadata']['duration']}")
        print(f"- Total Requests: {report['metadata']['total_requests']}")
        print(f"- Unique Bugs: {report['metadata']['unique_bugs']}")
        print(f"- Critical Issues: {report['metadata']['critical_issues']}")
        
        print(f"\nEndpoints Tested: {report['kpi']['unique_endpoints']}")
        print(f"Success Rate: {report['kpi']['success_rate']}%")
        
        print("\nStatus Code Distribution:")
        for status, count in report['status_codes'].items():
            if count > 0:
                print(f"- {status}: {count}")
        
        print("\nBugs Found:", len(report['bugs']))
        for bug in report['bugs']:
            print(f"- {bug['method']} {bug['endpoint']} -> {bug['status_code']}")
        
        print(f"\nDetailed report saved to: {output_path}")
        return True
        
    except Exception as e:
        print(f"Error during testing: {e}")
        return False

if __name__ == "__main__":
    test_wuppiefuzz_parser()
