import os
import json
from typing import Dict, List, Any
from dashboard.parsers.base.standardized_loader import StandardizedDataLoader

def validate_fuzzer_name(name: str) -> bool:
    """Validate fuzzer name format.
    
    Args:
        name: The fuzzer name to validate
        
    Returns:
        True if the name is valid
        
    Raises:
        ValueError: If the name is invalid
    """
    if not name:
        raise ValueError("Fuzzer name cannot be empty")
    if not isinstance(name, str):
        raise ValueError("Fuzzer name must be a string")
    if not name[0].isupper():
        raise ValueError("Fuzzer name must start with an uppercase letter")
    if " " in name:
        raise ValueError("Fuzzer name cannot contain spaces")
    return True

def save_fuzzer_data(dashboard_data: Dict[str, Any], output_dir: str, fuzzer_name: str) -> None:
    """Save fuzzer data in a chunked format.
    
    Args:
        dashboard_data: The dashboard data to save
        output_dir: Directory to save the data in
        fuzzer_name: Name of the fuzzer
        
    Raises:
        ValueError: If the fuzzer name is invalid
        IOError: If there are file operation errors
        KeyError: If required data fields are missing
    """
    # Validate fuzzer name
    validate_fuzzer_name(fuzzer_name)
    
    # Create directory using lowercase name
    fuzzer_dir = os.path.join(output_dir, fuzzer_name.lower())
    os.makedirs(fuzzer_dir, exist_ok=True)
    
    try:
        # Process metadata
        metadata = {
            'fuzzer': dashboard_data['metadata']['fuzzer'],
            'summary': dashboard_data['metadata']['summary'],
            'total_endpoints': len(dashboard_data.get('endpoints', [])),
            'total_chunks': 1  # We'll save all endpoints in one chunk for now
        }
        
        # Save metadata
        with open(os.path.join(fuzzer_dir, 'metadata.json'), 'w') as f:
            json.dump(metadata, f, indent=2)
        with open(os.path.join(fuzzer_dir, 'metadata.js'), 'w') as f:
            f.write(f'window.{fuzzer_name}Metadata = {json.dumps(metadata, indent=2)};')
        
        # Process coverage data
        coverage_data = {
            'status_distribution': {
                'hits': metadata['summary'].get('endpoints_tested', 0),
                'misses': 0,  # Not available in standardized format
                'unspecified': 0  # Not available in standardized format
            },
            'method_coverage': {},
            'status_codes': []
        }
        
        # Calculate method coverage and status codes from endpoints
        method_counts = {}
        status_counts = {}
        
        # Process endpoints
        endpoints = dashboard_data.get('endpoints', [])
        if endpoints:
            for endpoint in endpoints:
                try:
                    # Method coverage
                    method = endpoint.get('method', 'UNKNOWN')
                    requests = endpoint.get('statistics', {}).get('total_requests', 0)
                    method_counts[method] = method_counts.get(method, 0) + requests
                    
                    # Status codes
                    status_codes = endpoint.get('statistics', {}).get('status_codes', {})
                    for status, count in status_codes.items():
                        status_counts[status] = status_counts.get(status, 0) + count
                except (KeyError, TypeError) as e:
                    print(f"Warning: Skipping malformed endpoint data: {str(e)}")
                    continue
        
        coverage_data['method_coverage'] = method_counts
        coverage_data['status_codes'] = [
            {'status': status, 'count': count}
            for status, count in status_counts.items()
        ]
        
        # Save coverage data
        with open(os.path.join(fuzzer_dir, 'coverage.json'), 'w') as f:
            json.dump(coverage_data, f, indent=2)
        with open(os.path.join(fuzzer_dir, 'coverage.js'), 'w') as f:
            f.write(f'window.{fuzzer_name}Coverage = {json.dumps(coverage_data, indent=2)};')
        
        # Process and save endpoints
        processed_endpoints = []
        for endpoint in endpoints:
            try:
                # Handle both flattened and nested statistics
                if 'statistics' in endpoint:
                    stats = endpoint['statistics']
                    total_requests = stats.get('total_requests', 0)
                    success_rate = stats.get('success_rate', 0)
                    status_codes = stats.get('status_codes', {})
                else:
                    total_requests = endpoint.get('total_requests', 0)
                    success_rate = endpoint.get('success_rate', 0)
                    status_codes = endpoint.get('status_codes', {})

                # Calculate type based on success rate
                if total_requests == 0:
                    endpoint_type = 'unspecified'
                elif success_rate == 100:
                    endpoint_type = 'hit'
                elif success_rate == 0:
                    endpoint_type = 'miss'
                else:
                    endpoint_type = 'partial'

                processed_endpoint = {
                    'path': endpoint.get('path', ''),
                    'method': endpoint.get('method', 'UNKNOWN'),
                    'total_requests': total_requests,
                    'success_rate': success_rate,
                    'type': endpoint_type,
                    'status_codes': status_codes
                }
                processed_endpoints.append(processed_endpoint)
            except (KeyError, TypeError) as e:
                print(f"Warning: Error processing endpoint for JS: {str(e)}")
                continue

        # Save endpoints
        with open(os.path.join(fuzzer_dir, 'endpoints_0.json'), 'w') as f:
            json.dump({
                'endpoints': processed_endpoints,
                'total': len(processed_endpoints)
            }, f, indent=2)
        with open(os.path.join(fuzzer_dir, 'endpoints_0.js'), 'w') as f:
            f.write(f'window.{fuzzer_name}Endpoints0 = {json.dumps(processed_endpoints, indent=2)};')
            
    except (IOError, json.JSONDecodeError) as e:
        print(f"Error saving data for {fuzzer_name}: {str(e)}")
        raise
    except KeyError as e:
        print(f"Missing required data field for {fuzzer_name}: {str(e)}")
        raise

def generate_fuzzer_page(template_path: str, output_path: str, fuzzer_name: str) -> None:
    """Generate a fuzzer-specific page from template.
    
    Args:
        template_path: Path to the template file
        output_path: Path where the page should be written
        fuzzer_name: Name of the fuzzer
    """
    # Validate fuzzer name
    validate_fuzzer_name(fuzzer_name)
    
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            template = f.read()
        
        # Replace template variables, using lowercase for directory paths
        content = template.replace('{{fuzzer_name}}', fuzzer_name)
        content = content.replace('{{fuzzer_id}}', fuzzer_name.lower())
        
        # Write the page
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
    except IOError as e:
        print(f"Error generating page for {fuzzer_name}: {str(e)}")
        raise

def generate_summary(dashboards: List[Dict[str, Any]], output_dir: str) -> Dict[str, Any]:
    """Generate summary data from standardized dashboard data.
    
    Args:
        dashboards: List of dashboard data from standardized outputs
        output_dir: Directory to save summary files
        
    Returns:
        Dictionary containing summary data
        
    Raises:
        IOError: If there are file operation errors
        KeyError: If required data fields are missing
        ValueError: If data validation fails
    """
    try:
        # Initialize summary
        summary = {
            'total_requests': 0,
            'critical_issues': 0,
            'unique_endpoints': 0,
            'success_rate': 0,
            'hits': 0,
            'misses': 0,
            'unspecified': 0,
            'get_hits': 0,
            'post_hits': 0,
            'put_hits': 0,
            'delete_hits': 0,
            'status_2xx': 0,
            'status_4xx': 0,
            'status_5xx': 0,
            'fuzzers': []
        }

        # Process each fuzzer's data
        for dashboard in dashboards:
            try:
                fuzzer_meta = dashboard['metadata']['fuzzer']
                fuzzer_summary = dashboard['metadata']['summary']
                
                # Add fuzzer data
                fuzzer_name = fuzzer_meta['name']
                validate_fuzzer_name(fuzzer_name)
                
                fuzzer_data = {
                    'name': fuzzer_name,
                    'id': fuzzer_name.lower(),
                    'total_requests': fuzzer_meta.get('total_requests', 0),
                    'critical_issues': fuzzer_meta.get('critical_issues', 0),
                    'unique_endpoints': fuzzer_summary.get('endpoints_tested', 0),
                    'duration': fuzzer_meta.get('duration', '0s')
                }
                summary['fuzzers'].append(fuzzer_data)
                
                # Update summary totals from fuzzer metadata
                summary['total_requests'] += fuzzer_meta.get('total_requests', 0)
                summary['critical_issues'] += fuzzer_meta.get('critical_issues', 0)
                summary['unique_endpoints'] += fuzzer_summary.get('endpoints_tested', 0)
                summary['hits'] += fuzzer_summary.get('endpoints_tested', 0)
                
                # Process endpoints for method and status code distributions
                endpoints = dashboard.get('endpoints', [])
                if endpoints:
                    for endpoint in endpoints:
                        try:
                            # Method coverage
                            method = endpoint.get('method', '').upper()
                            if method:
                                method_key = f"{method.lower()}_hits"
                                if method_key in summary:
                                    requests = endpoint.get('statistics', {}).get('total_requests', 0)
                                    summary[method_key] += requests
                            
                            # Status code distribution
                            status_codes = endpoint.get('statistics', {}).get('status_codes', {})
                            for status, count in status_codes.items():
                                try:
                                    code = int(status)
                                    if 200 <= code < 300:
                                        summary['status_2xx'] += count
                                    elif 400 <= code < 500:
                                        summary['status_4xx'] += count
                                    elif 500 <= code < 600:
                                        summary['status_5xx'] += count
                                except ValueError:
                                    print(f"Warning: Invalid status code {status}")
                                    continue
                        except (KeyError, TypeError, AttributeError) as e:
                            print(f"Warning: Error processing endpoint {endpoint.get('path', 'unknown')}: {str(e)}")
                            continue
            except (KeyError, TypeError) as e:
                print(f"Warning: Error processing fuzzer data: {str(e)}")
                continue
        
        # Calculate overall success rate using 2xx responses
        if summary['total_requests'] > 0:
            summary['success_rate'] = round((summary['status_2xx'] / summary['total_requests']) * 100)
        
        # Save summary data
        with open(os.path.join(output_dir, 'summary.json'), 'w') as f:
            json.dump(summary, f, indent=2)
        
        # Save JavaScript version
        with open(os.path.join(output_dir, 'summary.js'), 'w') as f:
            f.write(f'window.summaryData = {json.dumps(summary, indent=2)};')
            
        return summary
            
    except (IOError, json.JSONDecodeError) as e:
        print(f"Error generating summary: {str(e)}")
        raise
    except KeyError as e:
        print(f"Missing required summary data field: {str(e)}")
        raise
    except ValueError as e:
        print(f"Invalid data in summary generation: {str(e)}")
        raise

def generate_index_page(template_path: str, output_path: str, summary_data: Dict[str, Any]) -> None:
    """Generate the main index page from template.
    
    Args:
        template_path: Path to the template file
        output_path: Path where the page should be written
        summary_data: Summary data for the dashboard
        
    Raises:
        IOError: If there are file operation errors
        KeyError: If required summary data fields are missing
    """
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            template = f.read()
        
        # Generate fuzzer cards HTML
        fuzzer_cards = []
        for fuzzer in summary_data['fuzzers']:
            card = f'''
                <a href="pages/{fuzzer['id']}.html" class="fuzzer-card">
                    <h3 class="text-lg font-semibold mb-4">{fuzzer['name']} Results</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Total Requests</span>
                            <span class="font-medium">{fuzzer['total_requests']}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Critical Issues</span>
                            <span class="font-medium {' text-red-600' if fuzzer['critical_issues'] > 0 else ' text-gray-600'}">{fuzzer['critical_issues']}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Duration</span>
                            <span class="font-medium">{fuzzer['duration']}</span>
                        </div>
                    </div>
                </a>
            '''
            fuzzer_cards.append(card)
        
        # Replace template variables
        content = template
        content = content.replace('{{total_requests}}', str(summary_data['total_requests']))
        content = content.replace('{{critical_issues}}', str(summary_data['critical_issues']))
        content = content.replace('{{unique_endpoints}}', str(summary_data['unique_endpoints']))
        content = content.replace('{{success_rate}}', str(summary_data['success_rate']))
        content = content.replace('{{fuzzer_cards}}', '\n'.join(fuzzer_cards))
        
        # Write the page
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
    except IOError as e:
        print(f"Error generating index page: {str(e)}")
        raise
    except KeyError as e:
        print(f"Missing required summary data field: {str(e)}")
        raise

def setup_directory_structure(base_dir: str) -> None:
    """Set up the directory structure for the dashboard.
    
    Args:
        base_dir: Base directory for the dashboard
        
    Raises:
        IOError: If directory creation fails
    """
    dirs = [
        os.path.join(base_dir, 'dashboard', 'data'),
        os.path.join(base_dir, 'dashboard', 'pages'),
        os.path.join(base_dir, 'dashboard', 'js', 'core'),
        os.path.join(base_dir, 'dashboard', 'js', 'components')
    ]
    try:
        for dir_path in dirs:
            os.makedirs(dir_path, exist_ok=True)
    except IOError as e:
        print(f"Error creating directory structure: {str(e)}")
        raise

def main() -> None:
    """Main entry point."""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    standardized_dir = os.path.join(base_dir, 'standardized-outputs')
    data_dir = os.path.join(base_dir, 'dashboard', 'data')
    pages_dir = os.path.join(base_dir, 'dashboard', 'pages')
    fuzzer_template_path = os.path.join(base_dir, 'dashboard', 'templates', 'fuzzer.html')
    index_template_path = os.path.join(base_dir, 'dashboard', 'templates', 'index.template.html')
    
    # Set up directory structure
    setup_directory_structure(base_dir)
    
    # Initialize data loader
    loader = StandardizedDataLoader(standardized_dir)
    
    try:
        # Load and process all fuzzer data
        print("\nLoading fuzzer data from standardized outputs...")
        dashboards = loader.load_all_fuzzers()
        
        if not dashboards:
            print("\n⚠ No fuzzer results were found or processed successfully")
            return
            
        # Process each fuzzer's data
        for dashboard in dashboards:
            name = dashboard["metadata"]["fuzzer"]["name"]
            print(f"\nProcessing {name} dashboard...")
            
            try:
                # Save chunked fuzzer data
                save_fuzzer_data(dashboard, data_dir, name)
                
                # Generate fuzzer page
                generate_fuzzer_page(
                    fuzzer_template_path,
                    os.path.join(pages_dir, f"{name.lower()}.html"),
                    name
                )
                
                print(f"✓ {name} dashboard generated")
                
            except (IOError, KeyError, ValueError) as e:
                print(f"✗ Error processing {name} dashboard: {str(e)}")
                continue
        
        # Generate summary and index page
        try:
            summary = generate_summary(dashboards, data_dir)
            generate_index_page(
                index_template_path,
                os.path.join(base_dir, 'dashboard', 'index.html'),
                summary
            )
            print("\n✓ Dashboard generated successfully")
            print("\nDashboard is ready! Open index.html in your browser to view the results.")
            
        except (IOError, KeyError, ValueError) as e:
            print(f"\n✗ Error generating summary and index: {str(e)}")
            
    except (IOError, json.JSONDecodeError) as e:
        print(f"\n✗ Error loading fuzzer data: {str(e)}")

if __name__ == '__main__':
    main()
