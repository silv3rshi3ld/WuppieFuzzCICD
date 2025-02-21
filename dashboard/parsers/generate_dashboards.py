"""Generate dashboard data and pages from fuzzer results."""

import os
import sys
import json
import shutil
from dashboard.parsers.wuppiefuzz.parser import parse_wuppiefuzz_results
from dashboard.parsers.restler.parser import parse_restler_results
from dashboard.parsers.evomaster.parser import parse_evomaster_results
from dashboard.parsers.base.chunker import BaseChunker
from dashboard.parsers.base.zip_handler import extract_zip

def validate_fuzzer_name(name):
    """Validate fuzzer name format."""
    if not name:
        raise ValueError("Fuzzer name cannot be empty")
    if not isinstance(name, str):
        raise ValueError("Fuzzer name must be a string")
    if not name[0].isupper():
        raise ValueError("Fuzzer name must start with an uppercase letter")
    if " " in name:
        raise ValueError("Fuzzer name cannot contain spaces")
    return True

def save_fuzzer_data(dashboard_data, output_dir, fuzzer_name):
    """Save fuzzer data in a chunked format."""
    # Validate fuzzer name
    validate_fuzzer_name(fuzzer_name)
    
    # Create directory using lowercase name
    fuzzer_dir = os.path.join(output_dir, fuzzer_name.lower())
    os.makedirs(fuzzer_dir, exist_ok=True)
    
    try:
        # Initialize chunker
        chunker = BaseChunker(chunk_size=50)
        
        # Save metadata with original case
        chunker.save_metadata(dashboard_data['metadata'], fuzzer_dir, fuzzer_name)
        
        # Save coverage data with original case
        coverage_data = {
            'status_distribution': dashboard_data['stats']['statusDistribution'],
            'method_coverage': dashboard_data['stats']['methodCoverage'],
            'status_codes': dashboard_data['stats']['statusCodes']
        }
        chunker.save_coverage(coverage_data, fuzzer_dir, fuzzer_name)
        
        # Save endpoints in chunks with original case
        chunk_info = chunker.chunk_endpoints(dashboard_data['endpoints'], fuzzer_dir, fuzzer_name)
        
        # Update metadata with chunk information
        metadata_path = os.path.join(fuzzer_dir, 'metadata.json')
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        metadata.update({
            'total_endpoints': chunk_info['total_items'],
            'total_chunks': chunk_info['total_chunks']
        })
        
        # Save both JSON and JS versions with original case
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        with open(os.path.join(fuzzer_dir, 'metadata.js'), 'w') as f:
            f.write(f'window.{fuzzer_name}Metadata = {json.dumps(metadata, indent=2)};')
            
    except Exception as e:
        print(f"Error saving data for {fuzzer_name}: {str(e)}")
        raise

def generate_fuzzer_page(template_path, output_path, fuzzer_name, fuzzer_id):
    """Generate a fuzzer-specific page from template."""
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
            
    except Exception as e:
        print(f"Error generating page for {fuzzer_name}: {str(e)}")
        raise

def generate_summary(dashboards, output_dir):
    """Generate summary data."""
    try:
        summary = {
            'total_requests': sum(d['stats'].get('total_requests', 0) for d in dashboards),  # Changed from metadata to stats
            'critical_issues': sum(d['stats'].get('critical_issues', 0) for d in dashboards),  # Changed from metadata to stats
            'unique_endpoints': sum(d['stats'].get('unique_endpoints', 0) for d in dashboards),  # Changed from metadata to stats
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
        
        # Calculate overall success rate
        total_success = sum(
            sum(s['count'] for s in d['stats']['statusCodes'] if 200 <= int(s['status']) < 300)
            for d in dashboards
        )
        total_requests = summary['total_requests']
        if total_requests > 0:
            summary['success_rate'] = round((total_success / total_requests) * 100)
        
        # Calculate method and status code distributions
        for dashboard in dashboards:
            # Add fuzzer data
            fuzzer_name = dashboard['metadata']['fuzzer']
            validate_fuzzer_name(fuzzer_name)
            
            fuzzer_data = {
                'name': fuzzer_name,
                'id': fuzzer_name.lower(),
                'total_requests': dashboard['stats'].get('total_requests', 0),  # Changed from metadata to stats
                'critical_issues': dashboard['stats'].get('critical_issues', 0),  # Changed from metadata to stats
                'unique_endpoints': dashboard['stats'].get('unique_endpoints', 0),  # Changed from metadata to stats
                'duration': dashboard['metadata'].get('duration', '0s')
            }
            summary['fuzzers'].append(fuzzer_data)
            
            # Add to method coverage
            method_coverage = dashboard['stats']['methodCoverage']
            for method in ['GET', 'POST', 'PUT', 'DELETE']:
                method_key = f"{method.lower()}_hits"
                if method in method_coverage:
                    summary[method_key] += int(method_coverage[method])
            
            # Add to status code distribution
            for status in dashboard['stats']['statusCodes']:
                code = int(status['status'])
                if 200 <= code < 300:
                    summary['status_2xx'] += status['count']
                elif 400 <= code < 500:
                    summary['status_4xx'] += status['count']
                elif 500 <= code < 600:
                    summary['status_5xx'] += status['count']
            
            # Add to coverage distribution
            dist = dashboard['stats']['statusDistribution']
            summary['hits'] += int(dist.get('hits', 0))
            summary['misses'] += int(dist.get('misses', 0))
            summary['unspecified'] += int(dist.get('unspecified', 0))
        
        # Save summary data
        with open(os.path.join(output_dir, 'summary.json'), 'w') as f:
            json.dump(summary, f, indent=2)
        
        # Save JavaScript version
        with open(os.path.join(output_dir, 'summary.js'), 'w') as f:
            f.write(f'window.summaryData = {json.dumps(summary, indent=2)};')
            
        return summary
            
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        raise

def generate_index_page(template_path, output_path, summary_data):
    """Generate the main index page from template."""
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
            
    except Exception as e:
        print(f"Error generating index page: {str(e)}")
        raise

def setup_directory_structure(base_dir):
    """Set up the directory structure for the dashboard."""
    dirs = [
        os.path.join(base_dir, 'dashboard', 'data'),
        os.path.join(base_dir, 'dashboard', 'pages'),
        os.path.join(base_dir, 'dashboard', 'js', 'core'),
        os.path.join(base_dir, 'dashboard', 'js', 'components')
    ]
    for dir_path in dirs:
        os.makedirs(dir_path, exist_ok=True)

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    output_dir = os.path.join(base_dir, 'output-fuzzers')  # Changed from 'test_data' to 'output-fuzzers'
    data_dir = os.path.join(base_dir, 'dashboard', 'data')
    pages_dir = os.path.join(base_dir, 'dashboard', 'pages')
    fuzzer_template_path = os.path.join(base_dir, 'dashboard', 'templates', 'fuzzer.html')
    index_template_path = os.path.join(base_dir, 'dashboard', 'templates', 'index.template.html')
    
    # Set up directory structure
    setup_directory_structure(base_dir)
    
    dashboards = []
    
    # Process each fuzzer with consistent case
    fuzzers = [
        {
            'name': 'WuppieFuzz',
            'parser': parse_wuppiefuzz_results,
            'zip_name': 'fuzzing-report.zip',
            'dir_name': 'fuzzing-report'
        },
        {
            'name': 'Restler',
            'parser': parse_restler_results,
            'zip_name': 'restler-fuzz-results.zip',
            'dir_name': 'restler-fuzz-results'
        },
        {
            'name': 'Evomaster',
            'parser': parse_evomaster_results,
            'zip_name': 'evomaster-results.zip',
            'dir_name': 'evomaster-results'
        }
    ]
    
    for fuzzer in fuzzers:
        name = fuzzer['name']
        print(f"\nProcessing {name} results...")
        
        # Try ZIP file first
        zip_path = os.path.join(output_dir, name, fuzzer['zip_name'])  # Changed from name.lower() to name
        dir_path = os.path.join(output_dir, name, fuzzer['dir_name'])  # Changed from name.lower() to name
        
        input_path = None
        temp_dir = None
        
        if os.path.exists(zip_path):
            try:
                input_path = extract_zip(zip_path, fuzzer['dir_name'])
                temp_dir = os.path.dirname(input_path)
                print(f"✓ Extracted {fuzzer['zip_name']}")
            except Exception as e:
                print(f"Warning: Failed to extract ZIP {zip_path}: {e}")
        
        # Fall back to directory if ZIP not found or extraction failed
        if not input_path and os.path.exists(dir_path):
            input_path = dir_path
            print(f"✓ Using extracted directory {fuzzer['dir_name']}")
        
        if not input_path:
            print(f"✗ {name} results not found")
            continue
            
        try:
            # Validate fuzzer name
            validate_fuzzer_name(name)
            
            report, dashboard = fuzzer['parser'](input_path)
            
            # Add fuzzer name to metadata
            if "metadata" not in dashboard:
                dashboard["metadata"] = {}
            dashboard['metadata']['fuzzer'] = name
            dashboards.append(dashboard)
            
            # Save chunked fuzzer data
            save_fuzzer_data(dashboard, data_dir, name)
            
            # Generate fuzzer page
            generate_fuzzer_page(
                fuzzer_template_path,
                os.path.join(pages_dir, f"{name.lower()}.html"),
                name,
                name  # Pass original name
            )
            
            print(f"✓ {name} data processed and page generated")
        except Exception as e:
            print(f"✗ Error processing {name} data: {str(e)}")
        finally:
            # Clean up temp directory if we extracted a ZIP
            if temp_dir:
                shutil.rmtree(temp_dir, ignore_errors=True)
    
    if not dashboards:
        print("\n⚠ No fuzzer results were found or processed successfully")
        return
    
    try:
        # Generate summary data
        summary = generate_summary(dashboards, data_dir)
        
        # Generate index page
        generate_index_page(
            index_template_path,
            os.path.join(base_dir, 'dashboard', 'index.html'),
            summary
        )
        
        print("\n✓ Dashboard generated with embedded data")
        print("\nDashboard is ready! Open index.html in your browser to view the results.")
    except Exception as e:
        print(f"\n✗ Error generating dashboard: {str(e)}")

if __name__ == '__main__':
    main()
