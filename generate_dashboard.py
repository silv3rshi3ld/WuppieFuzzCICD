import json
import os
from datetime import datetime

def read_json_data(directory):
    """Reads JSON data from files in the specified directory."""
    data = {}
    report_file = os.path.join(directory, f"{os.path.basename(directory).lower()}_report.json")
    if os.path.exists(report_file):
        try:
            with open(report_file, "r") as f:
                data = json.load(f)
                print(f"Successfully loaded {report_file}")
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON in {report_file}: {e}")
        except Exception as e:
            print(f"Error reading {report_file}: {e}")
    else:
        print(f"Report file not found: {report_file}")
    return data

def normalize_method_name(method):
    """Normalize HTTP method names to uppercase."""
    return method.upper() if method else "GET"

def process_endpoint_data(endpoint):
    """Process individual endpoint data to match frontend expectations."""
    if not isinstance(endpoint, dict):
        return None

    # Extract status codes
    status_codes = endpoint.get('status_codes', {})
    if not isinstance(status_codes, dict):
        status_codes = {}
    
    # Calculate success rate
    total_responses = sum(status_codes.values())
    success_responses = sum(count for code, count in status_codes.items() 
                          if str(code).startswith('2'))
    success_rate = (success_responses / total_responses * 100) if total_responses > 0 else 0
    
    return {
        "path": endpoint.get('path', ''),
        "method": normalize_method_name(endpoint.get('method', 'GET')),
        "total_requests": total_responses,
        "success_rate": round(success_rate, 2),
        "status_codes": status_codes,
        "response_data": endpoint.get('response_data', None)
    }

def process_fuzzer_data(data, fuzzer_name):
    """Process data from any fuzzer's JSON report."""
    if not data:
        print(f"No data found for {fuzzer_name}")
        return None

    print(f"Processing {fuzzer_name} data...")
    
    # Process endpoints
    raw_endpoints = data.get("endpoints", [])
    processed_endpoints = []
    for ep in raw_endpoints:
        processed_ep = process_endpoint_data(ep)
        if processed_ep:
            processed_endpoints.append(processed_ep)
    
    # Calculate coverage statistics
    total_requests = sum(ep["total_requests"] for ep in processed_endpoints)
    critical_errors = sum(
        count
        for ep in processed_endpoints
        for code, count in ep["status_codes"].items()
        if str(code).startswith('5')
    )
    
    # Calculate success rate
    total_success = sum(
        count
        for ep in processed_endpoints
        for code, count in ep["status_codes"].items()
        if str(code).startswith('2')
    )
    success_rate = (total_success / total_requests * 100) if total_requests > 0 else 0
    
    # Get coverage data
    coverage_data = data.get("coverage", {})
    method_coverage = coverage_data.get("method_coverage", {})
    
    # Ensure all methods are present
    for method in ['GET', 'POST', 'PUT', 'DELETE']:
        if method not in method_coverage:
            method_coverage[method] = {"hits": 0, "misses": 0}
    
    # Convert status codes to array format
    status_codes = []
    for code, count in data.get("status_codes", {}).items():
        status_codes.append({"status": str(code), "count": count})
    
    # Build the simplified data structure
    return {
        "metadata": {
            "name": fuzzer_name,
            "total_requests": total_requests,
            "critical_issues": critical_errors,
            "unique_endpoints": len(processed_endpoints),
            "success_rate": round(success_rate, 2),
            "duration": data.get("metadata", {}).get("duration", "0:00:00")
        },
        "coverage": {
            "statusDistribution": {
                "hits": coverage_data.get("status_distribution", {}).get("hits", 0),
                "misses": coverage_data.get("status_distribution", {}).get("misses", 0),
                "unspecified": coverage_data.get("status_distribution", {}).get("unspecified", 0)
            },
            "methodCoverage": method_coverage,
            "statusCodes": status_codes
        },
        "endpoints": processed_endpoints
    }

def generate_fuzzer_card(name, data):
    """Generate HTML for a fuzzer card."""
    if not data:  # Skip if fuzzer data is missing
        return ""
        
    metadata = data["metadata"]
    return f"""
                <a href="pages/{name.lower()}.html" class="fuzzer-card">
                    <h3 class="text-lg font-semibold mb-4">{name} Results</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Total Requests</span>
                            <span class="font-medium">{metadata['total_requests']}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Critical Issues</span>
                            <span class="font-medium {' text-red-600' if metadata['critical_issues'] > 0 else ' text-gray-600'}">{metadata['critical_issues']}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Duration</span>
                            <span class="font-medium">{metadata['duration']}</span>
                        </div>
                    </div>
                </a>
            """

def generate_fuzzer_page(fuzzer_name, data, template_path, output_path):
    """Generate a fuzzer-specific page."""
    try:
        with open(template_path, 'r') as f:
            template = f.read()
        
        # Replace template variables
        content = template.replace('{{fuzzer_name}}', fuzzer_name)
        content = content.replace('{{embedded_data}}', json.dumps(data, indent=2))
        
        metadata = data["metadata"]
        content = content.replace('{{duration}}', metadata["duration"])
        content = content.replace('{{total_requests}}', str(metadata["total_requests"]))
        content = content.replace('{{critical_issues}}', str(metadata["critical_issues"]))
        content = content.replace('{{unique_endpoints}}', str(metadata["unique_endpoints"]))
        content = content.replace('{{success_rate}}', str(metadata["success_rate"]))
        
        # Write the file
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w') as f:
            f.write(content)
            
        print(f"Generated {fuzzer_name} page at {output_path}")
        
    except Exception as e:
        print(f"Error generating {fuzzer_name} page: {e}")

def update_index_html(evomaster_data, restler_data, wuppiefuzz_data):
    """Updates the main index.html file."""
    try:
        # Read template
        with open("dashboard/templates/index.template.html", "r") as f:
            template_content = f.read()

        # Calculate summary data
        total_requests = sum(data["metadata"]["total_requests"] for data in [evomaster_data, restler_data, wuppiefuzz_data] if data)
        critical_issues = sum(data["metadata"]["critical_issues"] for data in [evomaster_data, restler_data, wuppiefuzz_data] if data)
        unique_endpoints = sum(data["metadata"]["unique_endpoints"] for data in [evomaster_data, restler_data, wuppiefuzz_data] if data)
        
        # Calculate average success rate
        success_rates = [data["metadata"]["success_rate"] for data in [evomaster_data, restler_data, wuppiefuzz_data] if data]
        avg_success_rate = sum(success_rates) / len(success_rates) if success_rates else 0

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
        html_content = html_content.replace("{{unique_endpoints}}", str(unique_endpoints))
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
        output_fuzzers_dir = "output-fuzzers"
        
        print("Reading and processing fuzzer data...")
        # Process each fuzzer's data
        evomaster_data = process_fuzzer_data(
            read_json_data(os.path.join(output_fuzzers_dir, "Evomaster")),
            "Evomaster"
        )
        restler_data = process_fuzzer_data(
            read_json_data(os.path.join(output_fuzzers_dir, "Restler")),
            "Restler"
        )
        wuppiefuzz_data = process_fuzzer_data(
            read_json_data(os.path.join(output_fuzzers_dir, "Wuppiefuzz")),
            "Wuppiefuzz"
        )

        print("Generating fuzzer pages...")
        # Generate fuzzer pages
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
        # Update main index.html
        update_index_html(evomaster_data, restler_data, wuppiefuzz_data)
        
        print("Dashboard generation completed successfully")
        
    except Exception as e:
        print(f"Error generating dashboard: {e}")

if __name__ == "__main__":
    main()