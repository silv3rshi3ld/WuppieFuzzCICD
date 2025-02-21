import os
import sys

# Add project root to Python path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
sys.path.insert(0, project_root)

from dashboard.parsers.restler.parser import parse_restler_results, RestlerParser

def test_restler_parser():
    """Test Restler parser in phases to avoid memory issues."""
    try:
        # Setup paths
        current_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
        results_dir = os.path.join(project_root, 'output-fuzzers', 'Restler', 'restler-fuzz-results')
        
        # Phase 1: Test Metadata
        print("\nPhase 1: Testing Metadata")
        print("=========================")
        test_metadata(results_dir)
        
        # Phase 2: Test Network Log Processing
        print("\nPhase 2: Testing Network Log")
        print("============================")
        test_network_log(results_dir)
        
        # Phase 3: Test Bug Processing
        print("\nPhase 3: Testing Bug Processing")
        print("==============================")
        test_bugs(results_dir)
        
        return True
        
    except Exception as e:
        print(f"Error during testing: {e}")
        return False

def test_metadata(results_dir: str):
    """Test metadata processing phase."""
    parser = RestlerParser()
    testing_summary_path = os.path.join(results_dir, 'RestlerResults', 'experiment135', 'logs', 'testing_summary.json')
    
    print(f"Reading metadata from: {testing_summary_path}")
    if not os.path.exists(testing_summary_path):
        raise FileNotFoundError(f"Testing summary not found: {testing_summary_path}")
        
    metadata = parser._process_metadata(results_dir)
    print("\nMetadata Statistics:")
    print(f"- Total Requests: {metadata['metadata']['total_requests']:,}")
    print(f"- Coverage Lines: {metadata['coverage']['lines']:,} / {metadata['coverage']['total_lines']:,} ({metadata['coverage']['lines']/metadata['coverage']['total_lines']*100:.1f}%)")
    
    # Validate metadata structure
    assert metadata['metadata']['total_requests'] > 0, "No requests found"
    assert metadata['coverage']['lines'] <= metadata['coverage']['total_lines'], "Invalid coverage numbers"
    
    return metadata

def test_network_log(results_dir: str, chunk_size: int = 8192):
    """Test network log processing phase."""
    parser = RestlerParser()
    network_log_path = os.path.join(results_dir, 'RestlerResults', 'experiment135', 'logs', 'network.testing.140072145913600.1.txt')
    
    print(f"Processing network log in {chunk_size} byte chunks")
    if not os.path.exists(network_log_path):
        raise FileNotFoundError(f"Network log not found: {network_log_path}")
        
    endpoint_stats = parser._process_network_log(network_log_path, chunk_size)
    print("\nEndpoint Statistics:")
    print(f"Total unique endpoints: {len(endpoint_stats):,}")
    
    # Validate endpoint stats
    total_requests = sum(e['total_requests'] for e in endpoint_stats.values())
    print(f"Total requests across endpoints: {total_requests:,}")
    
    # Sample a few endpoints for verification
    sample_size = min(3, len(endpoint_stats))
    print(f"\nSample of {sample_size} endpoints:")
    for i, (key, endpoint) in enumerate(list(endpoint_stats.items())[:sample_size]):
        print(f"{i+1}. {endpoint['method']} {endpoint['path']}")
        print(f"   Total Requests: {endpoint['total_requests']:,}")
        success_rate = sum(count for code, count in endpoint['status_codes'].items() if 200 <= int(code) < 300) / endpoint['total_requests'] * 100 if endpoint['total_requests'] > 0 else 0
        print(f"   Success Rate: {success_rate:.1f}%")
        print(f"   Status Codes: {dict(sorted(endpoint['status_codes'].items()))}")
    
    return endpoint_stats

def test_bugs(results_dir: str):
    """Test bug processing phase."""
    parser = RestlerParser()
    bug_buckets_path = os.path.join(results_dir, 'RestlerResults', 'experiment135', 'bug_buckets', 'Bugs.json')
    
    print(f"Processing bugs from: {bug_buckets_path}")
    if not os.path.exists(bug_buckets_path):
        raise FileNotFoundError(f"Bug buckets not found: {bug_buckets_path}")
        
    crashes = parser._process_bugs(results_dir)
    print(f"\nBug Statistics:")
    print(f"Total bugs found: {len(crashes):,}")
    
    # Analyze bug severity
    severity_counts = {'critical': 0, 'warning': 0, 'info': 0}
    for bug in crashes:
        severity_counts[bug['severity']] += 1
    
    print("\nSeverity Distribution:")
    for severity, count in severity_counts.items():
        print(f"- {severity.title()}: {count:,}")
    
    if crashes:
        print("\nSample bug details:")
        bug = crashes[0]
        print(f"- Endpoint: {bug['method']} {bug['endpoint']}")
        print(f"- Status: {bug['status_code']} ({bug['severity']})")
        print(f"- Stack Trace: {bug['stack_trace'][:100] + '...' if len(bug['stack_trace']) > 100 else bug['stack_trace']}")
    
    return crashes

if __name__ == "__main__":
    test_restler_parser()
