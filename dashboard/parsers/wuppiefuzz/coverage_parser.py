"""Parser for WuppieFuzz coverage data."""

import os
from bs4 import BeautifulSoup

def parse_coverage_data(index_path):
    """Parse coverage data from index.html file.
    
    Args:
        index_path (str): Path to the coverage index.html file
        
    Returns:
        dict: Coverage metrics including lines, functions, branches, and statements
        
    Raises:
        FileNotFoundError: If index.html doesn't exist
        ValueError: If coverage data can't be parsed
    """
    if not os.path.exists(index_path):
        raise FileNotFoundError(f"Coverage file not found at {index_path}")
        
    try:
        with open(index_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            
        # Find coverage summary div
        summary = soup.find('div', class_='coverage-summary')
        if not summary:
            raise ValueError("Could not find coverage summary in index.html")
            
        # Extract metrics from table
        metrics = {
            'lines': {'covered': 0, 'total': 0},
            'functions': {'covered': 0, 'total': 0},
            'branches': {'covered': 0, 'total': 0},
            'statements': {'covered': 0, 'total': 0}
        }
        
        # Parse table rows
        rows = summary.find_all('tr')
        for row in rows:
            # Skip header row
            if row.find('th'):
                continue
                
            # Get metric name and values
            cells = row.find_all('td')
            if len(cells) >= 4:  # Metric name, covered, total, percentage
                metric_name = cells[0].text.strip().lower()
                if metric_name in metrics:
                    try:
                        covered = int(cells[1].text.strip())
                        total = int(cells[2].text.strip())
                        metrics[metric_name]['covered'] = covered
                        metrics[metric_name]['total'] = total
                    except (ValueError, TypeError):
                        print(f"Warning: Could not parse coverage values for {metric_name}")
                        
        return metrics
        
    except Exception as e:
        raise ValueError(f"Error parsing coverage data: {str(e)}")