"""Main script for generating standardized JSON outputs from fuzzer results."""

import os
import sys
from typing import Dict, List

from dashboard.parsers.wuppiefuzz.parser import WuppieFuzzParser
from dashboard.parsers.restler.parser import RestlerParser
from dashboard.parsers.evomaster.parser import EvoMasterParser

def setup_output_directories(base_dir: str) -> Dict[str, str]:
    """Set up output directories for each fuzzer.
    
    Args:
        base_dir: Base directory for outputs
    
    Returns:
        Dictionary mapping fuzzer names to their output directories
    """
    fuzzer_dirs = {
        'wuppiefuzz': os.path.join(base_dir, 'wuppiefuzz'),
        'restler': os.path.join(base_dir, 'restler'),
        'evomaster': os.path.join(base_dir, 'evomaster')
    }
    
    for dir_path in fuzzer_dirs.values():
        os.makedirs(dir_path, exist_ok=True)
    
    return fuzzer_dirs

def process_fuzzer_outputs(input_base: str, output_base: str) -> List[str]:
    """Process outputs from all fuzzers.
    
    Args:
        input_base: Base directory containing fuzzer outputs
        output_base: Base directory for standardized JSON outputs
    
    Returns:
        List of error messages (empty if successful)
    """
    errors = []
    
    # Set up output directories
    output_dirs = setup_output_directories(output_base)
    
    # Process WuppieFuzz output
    print("\nProcessing WuppieFuzz output...")
    wuppiefuzz_input = os.path.join(input_base, 'Wuppiefuzz', 'fuzzing-report')
    if os.path.exists(wuppiefuzz_input):
        parser = WuppieFuzzParser(wuppiefuzz_input, output_dirs['wuppiefuzz'])
        if not parser.parse():
            errors.append("Failed to process WuppieFuzz output")
        else:
            print("✓ WuppieFuzz output processed successfully")
    else:
        errors.append(f"WuppieFuzz output directory not found at: {wuppiefuzz_input}")
    
    # Process RESTler output
    print("\nProcessing RESTler output...")
    restler_input = os.path.join(input_base, 'Restler', 'restler-fuzz-results')
    if os.path.exists(restler_input):
        parser = RestlerParser(restler_input, output_dirs['restler'])
        if not parser.parse():
            errors.append("Failed to process RESTler output")
        else:
            print("✓ RESTler output processed successfully")
    else:
        errors.append(f"RESTler output directory not found at: {restler_input}")
    
    # Process EvoMaster output
    print("\nProcessing EvoMaster output...")
    evomaster_input = os.path.join(input_base, 'Evomaster', 'evomaster-results')
    if os.path.exists(evomaster_input):
        parser = EvoMasterParser(evomaster_input, output_dirs['evomaster'])
        if not parser.parse():
            errors.append("Failed to process EvoMaster output")
        else:
            print("✓ EvoMaster output processed successfully")
    else:
        errors.append(f"EvoMaster output directory not found at: {evomaster_input}")
    
    return errors

def main():
    """Main entry point."""
    # Get the base directory (where this script is located)
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Set up input and output paths
    input_base = os.path.join(base_dir, 'output-fuzzers')
    output_base = os.path.join(base_dir, 'standardized-outputs')
    
    print(f"\nProcessing fuzzer outputs from: {input_base}")
    print(f"Generating standardized outputs in: {output_base}")
    
    # Process all fuzzer outputs
    errors = process_fuzzer_outputs(input_base, output_base)
    
    # Report results
    if errors:
        print("\n⚠ Some errors occurred during processing:")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)
    else:
        print("\n✓ All fuzzer outputs processed successfully")
        print(f"\nStandardized JSON outputs are available in: {output_base}")
        sys.exit(0)

if __name__ == '__main__':
    main()