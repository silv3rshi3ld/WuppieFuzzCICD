import json
import os
from datetime import datetime
from collections import defaultdict

def extract_js_data(content):
    """Extract JSON data from JavaScript file content."""
    try:
        # Find the data between the variable assignment and semicolon
        start = content.find('=') + 1
        end = content.rfind(';')
        if start > 0 and end > start:
            json_str = content[start:end].strip()
            return json.loads(json_str)
    except Exception as e:
        print(f"Error extracting data from JavaScript: {e}")
    return None

def read_chunked_data(fuzzer_dir):
    """
    Read chunked data from the fuzzer's data directory.
    
    Args:
        fuzzer_dir (str): Path to the fuzzer's data directory
    
    Returns:
        dict: The combined data from all chunks
    """
    data = {
        'metadata': None,
        'coverage': None,
        'endpoints': []
    }
    
    try:
        # Read metadata
        metadata_file = os.path.join(fuzzer_dir, 'metadata.js')
        if os.path.exists(metadata_file):
            with open(metadata_file, 'r') as f:
                data['metadata'] = extract_js_data(f.read())
        
        # Read coverage
        coverage_file = os.path.join(fuzzer_dir, 'coverage.js')
        if os.path.exists(coverage_file):
            with open(coverage_file, 'r') as f:
                data['coverage'] = extract_js_data(f.read())
        
        # Read endpoint chunks
        endpoints_dir = os.path.join(fuzzer_dir, 'endpoints')
        if os.path.exists(endpoints_dir):
            chunk_index = 0
            while True:
                chunk_file = os.path.join(endpoints_dir, f'chunk_{chunk_index}.js')
                if not os.path.exists(chunk_file):
                    break
                with open(chunk_file, 'r') as f:
                    chunk_data = extract_js_data(f.read())
                    if chunk_data:
                        data['endpoints'].extend(chunk_data)
                chunk_index += 1
    except Exception as e:
        print(f"Error reading data from {fuzzer_dir}: {e}")
    
    return data

def validate_fuzzer_data(data):
    """Validate fuzzer data structure."""
    if not data or not isinstance(data, dict):
        return False
    
    required_fields = {
        'metadata': ['total_requests', 'critical_issues'],
        'coverage': ['status_distribution', 'method_coverage'],
        'endpoints': None  # Can be empty but must exist
    }
    
    for section, fields in required_fields.items():
        if section not in data:
            print(f"Missing section: {section}")
            return False
        if fields and not all(field in (data[section] or {}) for field in fields):
            print(f"Missing required fields in {section}")
            return False
    
    return True

def calculate_success_rate(data):
    """Calculate success rate from coverage data."""
    if not data or not data.get('coverage'):
        return 0
    
    status_dist = data['coverage'].get('status_distribution', {})
    hits = status_dist.get('hits', 0)
    total = hits + status_dist.get('misses', 0)
    return round((hits / total * 100) if total > 0 else 0, 2)

def generate_fuzzer_card(name, data):
    """Generate HTML for a fuzzer card."""
    if not data or not data.get('metadata'):
        return ""
        
    metadata = data['metadata']
    success_rate = calculate_success_rate(data)
    
    return f"""
                <a href="pages/{name.lower()}.html" class="fuzzer-card">
                    <h3 class="text-lg font-semibold mb-4">{name} Results</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Total Requests</span>
                            <span class="font-medium">{metadata.get('total_requests', 0)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Critical Issues</span>
                            <span class="font-medium {' text-red-600' if metadata.get('critical_issues', 0) > 0 else ' text-gray-600'}">{metadata.get('critical_issues', 0)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Success Rate</span>
                            <span class="font-medium">{success_rate}%</span>
                        </div>
                    </div>
                </a>
            """

def generate_fuzzer_page(fuzzer_name, data, template_path, output_path):
    """Generate a fuzzer-specific page."""
    try:
        if not validate_fuzzer_data(data):
            print(f"Invalid data structure for {fuzzer_name}")
            return

        with open(template_path, 'r') as f:
            template = f.read()
        
        # Calculate success rate
        success_rate = calculate_success_rate(data)
        
        # Replace template variables
        content = template.replace('{{fuzzer_name}}', fuzzer_name)
        
        # Properly escape JSON for JavaScript
        json_str = json.dumps(data)
        # Escape any HTML special characters in the JSON string
        json_str = json_str.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        # Escape quotes for JavaScript string literal
        json_str = json_str.replace('\\', '\\\\').replace('"', '\\"')
        content = content.replace('{{embedded_data}}', json_str)
        
        metadata = data['metadata']
        content = content.replace('{{total_requests}}', str(metadata.get('total_requests', 0)))
        content = content.replace('{{critical_issues}}', str(metadata.get('critical_issues', 0)))
        content = content.replace('{{unique_endpoints}}', str(len(data.get('endpoints', []))))
        content = content.replace('{{success_rate}}', str(success_rate))
        
        # Write the file
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            f.write(content)
            
        print(f"Generated {fuzzer_name} page at {output_path}")
        
    except Exception as e:
        print(f"Error generating {fuzzer_name} page: {e}")

def generate_summary_js(evomaster_data, restler_data, wuppiefuzz_data):
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
            "status_distribution": {"hits": 0, "misses": 0, "unspecified": 0},
            "method_coverage": {
                "GET": {"hits": 0, "misses": 0, "unspecified": 0},
                "POST": {"hits": 0, "misses": 0, "unspecified": 0},
                "PUT": {"hits": 0, "misses": 0, "unspecified": 0},
                "DELETE": {"hits": 0, "misses": 0, "unspecified": 0}
            },
            "status_codes": []  # Added to store aggregated status codes
        }
        
        # Process each fuzzer's data
        for data in [evomaster_data, restler_data, wuppiefuzz_data]:
            if not validate_fuzzer_data(data):
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
            status_dist = coverage.get('status_distribution', {})
            for key in ['hits', 'misses', 'unspecified']:
                aggregated_coverage['status_distribution'][key] += status_dist.get(key, 0)
            
            # Aggregate method coverage
            method_coverage = coverage.get('method_coverage', {})
            for method in ['GET', 'POST', 'PUT', 'DELETE']:
                if method in method_coverage:
                    for key in ['hits', 'misses', 'unspecified']:
                        aggregated_coverage['method_coverage'][method][key] += (
                            method_coverage[method].get(key, 0)
                        )
            
            # Aggregate status codes
            if 'status_codes' in coverage:
                aggregated_coverage['status_codes'].extend(coverage['status_codes'])
        
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
            "coverage": aggregated_coverage
        }
        
        # Ensure the dashboard/data directory exists
        os.makedirs("dashboard/data", exist_ok=True)
        
        # Write the summary.js file
        with open("dashboard/data/summary.js", "w") as f:
            f.write(f"window.summaryData = {json.dumps(summary_data, indent=2)};")
            
        print("Generated summary.js with aggregated data")
        
    except Exception as e:
        print(f"Error generating summary.js: {e}")

def update_index_html(evomaster_data, restler_data, wuppiefuzz_data):
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
        
        for data in [evomaster_data, restler_data, wuppiefuzz_data]:
            if not validate_fuzzer_data(data):
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
        if wuppiefuzz_data:
            fuzzer_cards += generate_fuzzer_card("WuppieFuzz", wuppiefuzz_data)
        if restler_data:
            fuzzer_cards += generate_fuzzer_card("Restler", restler_data)
        if evomaster_data:
            fuzzer_cards += generate_fuzzer_card("Evomaster", evomaster_data)
        
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
        evomaster_data = read_chunked_data("dashboard/data/evomaster")
        restler_data = read_chunked_data("dashboard/data/restler")
        wuppiefuzz_data = read_chunked_data("dashboard/data/wuppiefuzz")
        
        print("Generating summary.js...")
        generate_summary_js(evomaster_data, restler_data, wuppiefuzz_data)
        
        print("Generating fuzzer pages...")
        template_path = "dashboard/templates/simple_fuzzer.html"
        fuzzer_pages = [
            ("WuppieFuzz", wuppiefuzz_data),
            ("Restler", restler_data),
            ("Evomaster", evomaster_data)
        ]
        
        for fuzzer_name, data in fuzzer_pages:
            if data:  # Only generate page if we have data
                output_path = f"dashboard/pages/{fuzzer_name.lower()}.html"
                generate_fuzzer_page(fuzzer_name, data, template_path, output_path)
        
        print("Updating index HTML...")
        update_index_html(evomaster_data, restler_data, wuppiefuzz_data)
        
        print("Dashboard generation completed successfully")
        
    except Exception as e:
        print(f"Error generating dashboard: {e}")

if __name__ == "__main__":
    main()