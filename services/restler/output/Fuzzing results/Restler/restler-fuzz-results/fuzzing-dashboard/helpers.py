import json
import re

def parse_grammar_file(grammar_file):
    """
    Parse the grammar file to extract endpoint details.
    """
    endpoints = []
    with open(grammar_file, 'r', encoding='utf-8') as f:
        grammar_content = f.read()

    # Use regex to extract endpoint definitions
    endpoint_regex = r'def\s+(\w+)\(.*?\):'
    for match in re.finditer(endpoint_regex, grammar_content):
        endpoint_name = match.group(1)
        endpoints.append({
            'name': endpoint_name,
            'methods': []
        })

    return endpoints

def parse_status_distribution(logs_dir):
    """
    Parse the logs directory to extract status distribution stats.
    """
    status_distribution = {}
    testing_summary_file = logs_dir.get('testing_summary.json')
    if testing_summary_file:
        with open(testing_summary_file, 'r', encoding='utf-8') as f:
            testing_summary = json.load(f)
            status_distribution = testing_summary.get('status_distribution', {})

    return status_distribution

def parse_method_coverage(logs_dir):
    """
    Parse the logs directory to extract method coverage stats.
    """
    method_coverage = {}
    testing_summary_file = logs_dir.get('testing_summary.json')
    if testing_summary_file:
        with open(testing_summary_file, 'r', encoding='utf-8') as f:
            testing_summary = json.load(f)
            method_coverage = testing_summary.get('method_coverage', {})

    return method_coverage

def parse_bug_file(bug_file):
    """
    Parse the bug file to extract bug details.
    """
    bug_data = {}
    with open(bug_file, 'r', encoding='utf-8') as f:
        bug_data = json.load(f)

    return bug_data