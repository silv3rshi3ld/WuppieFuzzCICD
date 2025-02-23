import json
import os

def read_json_data(directory):
    """Reads JSON data from files in the specified directory."""
    data = {}
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            filepath = os.path.join(directory, filename)
            with open(filepath, "r") as f:
                try:
                    data[filename] = json.load(f)
                except json.JSONDecodeError:
                    print(f"Error decoding JSON in {filename}")
    return data

def process_evomaster_data(data):
    """Processes Evomaster data."""
    report = data.get("evomaster_report.json", {})
    total_requests = report.get("total_requests", 0)
    critical_issues = 0  # Replace with actual logic to extract critical issues
    return {"total_requests": total_requests, "critical_issues": critical_issues}

def process_restler_data(data):
    """Processes Restler data."""
    report = data.get("restler_report.json", {})
    total_requests = report.get("total_requests", 0)
    critical_issues = 11  # Replace with actual logic to extract critical issues
    return {"total_requests": total_requests, "critical_issues": critical_issues}

def process_wuppiefuzz_data(data):
    """Processes Wuppiefuzz data."""
    report = data.get("wuppiefuzz_report.json", {})
    total_requests = report.get("total_requests", 0)
    critical_issues = 0  # Replace with actual logic to extract critical issues
    return {"total_requests": total_requests, "critical_issues": critical_issues}

def update_html_files(evomaster_data, restler_data, wuppiefuzz_data):
    """Updates the HTML files with the processed data."""
    with open("dashboard/index.html", "r") as f:
        html_content = f.read()

    # Update the HTML content with the processed data
    html_content = html_content.replace("{{evomaster_total_requests}}", str(evomaster_data["total_requests"]))
    html_content = html_content.replace("{{evomaster_critical_issues}}", str(evomaster_data["critical_issues"]))
    html_content = html_content.replace("{{restler_total_requests}}", str(restler_data["total_requests"]))
    html_content = html_content.replace("{{restler_critical_issues}}", str(restler_data["critical_issues"]))
    html_content = html_content.replace("{{wuppiefuzz_total_requests}}", str(wuppiefuzz_data["total_requests"]))
    html_content = html_content.replace("{{wuppiefuzz_critical_issues}}", str(wuppiefuzz_data["critical_issues"]))

    with open("dashboard/index.html", "w") as f:
        f.write(html_content)
    print("HTML files updated")

def main():
    """Main function to orchestrate the dashboard generation."""
    output_fuzzers_dir = "output-fuzzers"
    evomaster_dir = os.path.join(output_fuzzers_dir, "Evomaster")
    restler_dir = os.path.join(output_fuzzers_dir, "Restler")
    wuppiefuzz_dir = os.path.join(output_fuzzers_dir, "Wuppiefuzz")

    evomaster_data = read_json_data(evomaster_dir)
    restler_data = read_json_data(restler_dir)
    wuppiefuzz_data = read_json_data(wuppiefuzz_dir)

    processed_evomaster_data = process_evomaster_data(evomaster_data)
    processed_restler_data = process_restler_data(restler_data)
    processed_wuppiefuzz_data = process_wuppiefuzz_data(wuppiefuzz_data)

    update_html_files(processed_evomaster_data, processed_restler_data, processed_wuppiefuzz_data)

if __name__ == "__main__":
    main()