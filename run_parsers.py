#!/usr/bin/env python3
"""
Script to run all parsers and regenerate the dashboard data.
"""

import os
import sys
import subprocess
from pathlib import Path

def run_parser(parser_name):
    """Run a specific parser module."""
    print(f"Running {parser_name} parser...")
    try:
        result = subprocess.run(
            [sys.executable, "-m", f"parsers.{parser_name}"],
            check=True,
            capture_output=True,
            text=True
        )
        print(f"Success: {result.stdout}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")
        return False

def generate_dashboard():
    """Run the dashboard generation script."""
    print("Generating dashboard...")
    try:
        result = subprocess.run(
            [sys.executable, "generate_dashboard.py"],
            check=True,
            capture_output=True,
            text=True
        )
        print(f"Success: {result.stdout}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")
        return False

def main():
    """Main function to run all parsers and generate the dashboard."""
    # Ensure we're in the project root directory
    project_root = Path(__file__).parent.absolute()
    os.chdir(project_root)
    
    # Run each parser
    parsers = ["wuppiefuzz_parser", "restler_parser", "evomaster_parser"]
    success = True
    
    for parser in parsers:
        if not run_parser(parser):
            success = False
    
    # Generate the dashboard
    if success:
        generate_dashboard()
    else:
        print("Warning: Some parsers failed. Dashboard may be incomplete.")
        generate_dashboard()
    
    print("Done!")

if __name__ == "__main__":
    main()