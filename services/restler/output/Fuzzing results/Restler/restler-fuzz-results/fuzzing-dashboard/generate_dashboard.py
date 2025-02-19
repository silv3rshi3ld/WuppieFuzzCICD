import os
import zipfile
import json
from jinja2 import Environment, FileSystemLoader

# Load configuration
from config import CONFIG

# Import helper functions
from helpers import parse_grammar_file, parse_status_distribution, parse_method_coverage, parse_bug_file

# Set up Jinja2 environment for template rendering
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(SCRIPT_DIR, 'templates')
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

def extract_zip(zip_path):
    """
    Extract the contents of the fuzzing result zip file.
    Returns a dictionary containing the extracted data.
    """
    extracted_data = {}
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        for file_path in zip_ref.namelist():
            if file_path.endswith('.json') or file_path.endswith('.py'):
                file_data = zip_ref.read(file_path)
                extracted_data[file_path] = file_data

    return extracted_data

def generate_dashboard(zip_path, output_dir):
    """
    Generate the dashboard files from the fuzzing result zip file.
    """
    # Create output directory if it doesn't exist
    output_dir = os.path.abspath(output_dir)
    os.makedirs(output_dir, exist_ok=True)

    # Extract data from the zip file
    extracted_data = extract_zip(zip_path)

    # Process the extracted data
    processed_data = {
        'metadata': extract_metadata(extracted_data),
        'endpoints': extract_endpoints(extracted_data),
        'stats': extract_stats(extracted_data),
        'bugs': extract_bugs(extracted_data)
    }

    # Render the dashboard templates
    index_template = env.get_template('index.html')
    index_html = index_template.render(data=processed_data)

    dashboard_template = env.get_template('dashboard.js')
    dashboard_js = dashboard_template.render(data=processed_data)

    styles_template = env.get_template('styles.css')
    styles_css = styles_template.render()

    # Write the rendered files to the output directory
    with open(os.path.join(output_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(index_html)

    with open(os.path.join(output_dir, 'dashboard.js'), 'w', encoding='utf-8') as f:
        f.write(dashboard_js)

    with open(os.path.join(output_dir, 'styles.css'), 'w', encoding='utf-8') as f:
        f.write(styles_css)

    print(f"Dashboard generated successfully in {output_dir}")

# Helper functions to extract specific data from the extracted zip contents
def extract_metadata(extracted_data):
    metadata = {}
    for experiment_dir in extracted_data.get('RestlerResults', {}).values():
        logs_dir = experiment_dir.get('logs', {})
        metadata.update({
            'total_requests': logs_dir.get('testing_summary.json', {}).get('total_requests', 0),
            'failed_requests': logs_dir.get('testing_summary.json', {}).get('failed_requests', 0),
            'bug_count': len(experiment_dir.get('bug_buckets', {}).keys())
        })
    return metadata

def extract_endpoints(extracted_data):
    endpoints = []
    for experiment_dir in extracted_data.get('RestlerResults', {}).values():
        grammar_file = experiment_dir.get('restler_grammar_grammar_*.py')
        if grammar_file:
            endpoints.extend(parse_grammar_file(grammar_file))
    return endpoints

def extract_stats(extracted_data):
    stats = {}
    for experiment_dir in extracted_data.get('RestlerResults', {}).values():
        logs_dir = experiment_dir.get('logs', {})
        stats.update({
            'status_distribution': parse_status_distribution(logs_dir),
            'method_coverage': parse_method_coverage(logs_dir)
        })
    return stats

def extract_bugs(extracted_data):
    bugs = []
    for experiment_dir in extracted_data.get('RestlerResults', {}).values():
        bug_buckets_dir = experiment_dir.get('bug_buckets', {})
        for bug_file in bug_buckets_dir.values():
            bug_data = parse_bug_file(bug_file)
            bugs.append(bug_data)
    return bugs

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate a dashboard from fuzzing results.")
    parser.add_argument("zip_path", help="Path to the fuzzing result zip file")
    parser.add_argument("-o", "--output", default="output", help="Output directory for the generated dashboard files")

    args = parser.parse_args()

    generate_dashboard(os.path.abspath(args.zip_path), args.output)