import json
import os
from datetime import datetime
from collections import defaultdict

def extract_js_data(content):
    """Extract JSON data from JavaScript file content."""
    try:
        start = content.find('=') + 1
        end = content.rfind(';')
        if start > 0 and end > start:
            json_str = content[start:end].strip()
            return json.loads(json_str)
    except Exception as e:
        print(f"Error extracting data from JavaScript: {e}")
    return None

def read_fuzzer_report(fuzzer_name):
    """Read the fuzzer's report JSON file."""
    report_path = os.path.join('output-fuzzers', fuzzer_name, f'{fuzzer_name.lower()}_report.json')
    try:
        with open(report_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {fuzzer_name} report: {e}")
        return None

def process_fuzzer_data(fuzzer_name):
    """Process fuzzer data from report file."""
    report_data = read_fuzzer_report(fuzzer_name)
    if not report_data:
        return None

    # Extract metadata
    metadata = {
        'total_requests': report_data.get('total_requests', 0),
        'critical_issues': len([e for e in report_data.get('endpoints', []) 
                              if e.get('status_code', 0) >= 500]),
        'duration': report_data.get('duration', '0:01:00')
    }

    # Process coverage data
    coverage = {
        'status_distribution': defaultdict(int),
        'method_coverage': defaultdict(lambda: {'hits': 0, 'misses': 0})
    }

    endpoints = report_data.get('endpoints', [])
    for endpoint in endpoints:
        status = endpoint.get('status_code', 0)
        method = endpoint.get('http_method', 'GET')

        # Update status distribution
        if status >= 500:
            coverage['status_distribution']['errors'] += 1
        elif status >= 400:
            coverage['status_distribution']['client_errors'] += 1
        elif status >= 300:
            coverage['status_distribution']['redirects'] += 1
        elif status >= 200:
            coverage['status_distribution']['success'] += 1
        
        # Update method coverage
        if status < 400:
            coverage['method_coverage'][method]['hits'] += 1
        else:
            coverage['method_coverage'][method]['misses'] += 1

    # Process endpoints with request/response data
    processed_endpoints = []
    for endpoint in endpoints:
        processed_endpoint = {
            'path': endpoint.get('path', ''),
            'http_method': endpoint.get('http_method', 'GET'),
            'status_code': endpoint.get('status_code', 200),
            'request_details': endpoint.get('request', {}),
            'response_data': endpoint.get('response', {})
        }
        processed_endpoints.append(processed_endpoint)

    return {
        'metadata': metadata,
        'coverage': coverage,
        'endpoints': processed_endpoints
    }

def generate_fuzzer_card(name, data):
    """Generate HTML for a fuzzer card."""
    if not data or not data.get('metadata'):
        return ""
        
    metadata = data['metadata']
    success_rate = calculate_success_rate(data)
    critical_issues = metadata.get('critical_issues', 0)
    
    return f"""
        <a href="pages/{name.lower()}.html" class="card p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-semibold text-gray-900">{name} Results</h3>
                <i data-feather="chevron-right" class="h-5 w-5 text-gray-400"></i>
            </div>
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Total Requests</span>
                    <span class="font-medium text-primary">{metadata.get('total_requests', 0)}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Critical Issues</span>
                    <span class="font-medium {' text-red-600' if critical_issues > 0 else 'text-gray-900'}">{critical_issues}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Success Rate</span>
                    <span class="font-medium text-primary">{success_rate}%</span>
                </div>
            </div>
        </a>
    """

def calculate_success_rate(data):
    """Calculate success rate from coverage data."""
    if not data or not data.get('coverage'):
        return 0
    
    coverage = data['coverage']
    total_success = coverage['status_distribution'].get('success', 0)
    total_requests = sum(coverage['status_distribution'].values())
    
    return round((total_success / total_requests * 100) if total_requests > 0 else 0, 2)

def generate_fuzzer_page(fuzzer_name, data, template_path, output_path):
    """Generate a fuzzer-specific page."""
    try:
        if not data:
            print(f"No data available for {fuzzer_name}")
            return

        with open(template_path, 'r') as f:
            template = f.read()
        
        # Calculate success rate
        success_rate = calculate_success_rate(data)
        
        # Replace template variables
        content = template.replace('{{fuzzer_name}}', fuzzer_name)
        content = content.replace('{{fuzzer_name.lower}}', fuzzer_name.lower())
        
        metadata = data['metadata']
        content = content.replace('{{total_requests}}', str(metadata.get('total_requests', 0)))
        content = content.replace('{{critical_issues}}', str(metadata.get('critical_issues', 0)))
        content = content.replace('{{unique_endpoints}}', str(len(data.get('endpoints', []))))
        content = content.replace('{{success_rate}}', str(success_rate))
        
        # Write data files
        data_dir = os.path.join(os.path.dirname(output_path), 'data', fuzzer_name.lower())
        os.makedirs(data_dir, exist_ok=True)
        
        # Write metadata
        with open(os.path.join(data_dir, 'metadata.js'), 'w') as f:
            f.write(f"window.{fuzzer_name.lower()}Data = {json.dumps(data, indent=2)};")
        
        # Write the HTML file
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            f.write(content)
            
        print(f"Generated {fuzzer_name} page at {output_path}")
        
    except Exception as e:
        print(f"Error generating {fuzzer_name} page: {e}")

def generate_summary_js(fuzzer_data):
    """Generate the summary.js file with aggregated data from all fuzzers."""
    try:
        # Calculate aggregated metrics
        total_requests = 0
        critical_issues = 0
        unique_endpoints = set()
        weighted_success_rates = []
        total_weighted_requests = 0
        
        # Initialize aggregated coverage data
        aggregated_coverage = {
            "status_distribution": defaultdict(int),
            "method_coverage": defaultdict(lambda: defaultdict(int))
        }
        
        # Process each fuzzer's data
        for name, data in fuzzer_data.items():
            if not data:
                continue

            metadata = data['metadata']
            requests = metadata.get('total_requests', 0)
            total_requests += requests
            critical_issues += metadata.get('critical_issues', 0)
            
            # Track unique endpoints
            for endpoint in data.get('endpoints', []):
                unique_endpoints.add(endpoint.get('path', ''))
            
            # Calculate weighted success rate
            if requests > 0:
                success_rate = calculate_success_rate(data)
                weighted_success_rates.append(success_rate * requests)
                total_weighted_requests += requests
            
            # Aggregate coverage data
            coverage = data.get('coverage', {})
            for key, value in coverage.get('status_distribution', {}).items():
                aggregated_coverage['status_distribution'][key] += value
            
            # Aggregate method coverage
            for method, stats in coverage.get('method_coverage', {}).items():
                for key, value in stats.items():
                    aggregated_coverage['method_coverage'][method][key] += value
        
        # Calculate final success rate
        avg_success_rate = (
            sum(weighted_success_rates) / total_weighted_requests 
            if total_weighted_requests > 0 else 0
        )
        
        # Create the summary data object
        summary_data = {
            "total_requests": total_requests,
            "critical_issues": critical_issues,
            "unique_endpoints": len(unique_endpoints),
            "success_rate": round(avg_success_rate, 2),
            "coverage": {
                "status_distribution": dict(aggregated_coverage['status_distribution']),
                "method_coverage": dict(aggregated_coverage['method_coverage'])
            }
        }
        
        # Write the summary.js file
        os.makedirs("dashboard/data", exist_ok=True)
        with open("dashboard/data/summary.js", "w") as f:
            f.write(f"window.summaryData = {json.dumps(summary_data, indent=2)};")
            
        print("Generated summary.js with aggregated data")
        
    except Exception as e:
        print(f"Error generating summary.js: {e}")

def update_index_html(fuzzer_data):
    """Updates the main index.html file."""
    try:
        # Read template
        with open("dashboard/templates/index.template.html", "r") as f:
            template_content = f.read()
        
        # Calculate summary data
        total_requests = 0
        critical_issues = 0
        unique_endpoints = set()
        weighted_success_rates = []
        total_weighted_requests = 0
        
        # Process each fuzzer's data
        for name, data in fuzzer_data.items():
            if not data:
                continue

            metadata = data['metadata']
            requests = metadata.get('total_requests', 0)
            total_requests += requests
            critical_issues += metadata.get('critical_issues', 0)
            
            # Track unique endpoints
            for endpoint in data.get('endpoints', []):
                unique_endpoints.add(endpoint.get('path', ''))
            
            # Calculate weighted success rate
            if requests > 0:
                success_rate = calculate_success_rate(data)
                weighted_success_rates.append(success_rate * requests)
                total_weighted_requests += requests
        
        # Calculate weighted average success rate
        avg_success_rate = (
            sum(weighted_success_rates) / total_weighted_requests 
            if total_weighted_requests > 0 else 0
        )
        
        # Generate fuzzer cards
        fuzzer_cards = ""
        for name, data in fuzzer_data.items():
            if data:
                fuzzer_cards += generate_fuzzer_card(name, data)
        
        # Replace template variables
        html_content = template_content.replace("{{total_requests}}", str(total_requests))
        html_content = html_content.replace("{{critical_issues}}", str(critical_issues))
        html_content = html_content.replace("{{unique_endpoints}}", str(len(unique_endpoints)))
        html_content = html_content.replace("{{success_rate}}", str(round(avg_success_rate, 2)))
        html_content = html_content.replace("{{fuzzer_cards}}", fuzzer_cards)
        
        # Write the final HTML
        with open("dashboard/index.html", "w") as f:
            f.write(html_content)
        print("Index HTML updated")
    except Exception as e:
        print(f"Error updating index HTML: {e}")

def main():
    """Main function to orchestrate the dashboard generation."""
    try:
        print("Reading and processing fuzzer data...")
        
        # Process each fuzzer's data
        fuzzer_data = {
            'WuppieFuzz': process_fuzzer_data('Wuppiefuzz'),
            'Restler': process_fuzzer_data('Restler'),
            'Evomaster': process_fuzzer_data('Evomaster')
        }
        
        print("Generating summary.js...")
        generate_summary_js(fuzzer_data)
        
        print("Generating fuzzer pages...")
        template_path = "dashboard/templates/fuzzer.html"
        
        for fuzzer_name, data in fuzzer_data.items():
            if data:  # Only generate page if we have data
                output_path = f"dashboard/pages/{fuzzer_name.lower()}.html"
                generate_fuzzer_page(fuzzer_name, data, template_path, output_path)
        
        print("Updating index HTML...")
        update_index_html(fuzzer_data)
        
        print("Dashboard generation completed successfully")
        
    except Exception as e:
        print(f"Error generating dashboard: {e}")

if __name__ == "__main__":
    main()