import sys
import os
from .evomaster_parser import EvomasterParser
from .restler_parser import RestlerParser
from .wuppiefuzz_parser import WuppieFuzzParser

def main():
    """Main entry point for running parsers directly."""
    # Set up paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = os.path.join(base_dir, 'dashboard', 'data')
    
    # If no arguments are provided, run all parsers
    if len(sys.argv) < 2:
        print("Running all parsers...")
        
        # Run Evomaster parser
        try:
            zip_path = os.path.join(base_dir, 'output-fuzzers', 'Evomaster', 'evomaster-results.zip')
            if os.path.exists(zip_path):
                parser = EvomasterParser(zip_path, os.path.join(output_dir, 'evomaster'))
                parser.process_data()
                print("Evomaster data processed successfully")
            else:
                print(f"Evomaster results not found at {zip_path}")
        except Exception as e:
            print(f"Error processing Evomaster data: {e}")
        
        # Run Restler parser
        try:
            zip_path = os.path.join(base_dir, 'output-fuzzers', 'Restler', 'restler-fuzz-results.zip')
            if os.path.exists(zip_path):
                parser = RestlerParser(zip_path, os.path.join(output_dir, 'restler'))
                parser.process_data()
                print("Restler data processed successfully")
            else:
                print(f"Restler results not found at {zip_path}")
        except Exception as e:
            print(f"Error processing Restler data: {e}")
        
        # Run WuppieFuzz parser
        try:
            zip_path = os.path.join(base_dir, 'output-fuzzers', 'Wuppiefuzz', 'fuzzing-report.zip')
            if os.path.exists(zip_path):
                parser = WuppieFuzzParser(zip_path, os.path.join(output_dir, 'wuppiefuzz'))
                parser.process_data()
                print("WuppieFuzz data processed successfully")
            else:
                print(f"WuppieFuzz results not found at {zip_path}")
        except Exception as e:
            print(f"Error processing WuppieFuzz data: {e}")
        
        return
    
    # Get the parser name from the module being run
    parser_name = sys.argv[1].split('.')[-1]
    
    try:
        if parser_name == 'evomaster_parser':
            zip_path = os.path.join(base_dir, 'output-fuzzers', 'Evomaster', 'evomaster-results.zip')
            parser = EvomasterParser(zip_path, os.path.join(output_dir, 'evomaster'))
            parser.process_data()
            print("Evomaster data processed successfully")
            
        elif parser_name == 'restler_parser':
            zip_path = os.path.join(base_dir, 'output-fuzzers', 'Restler', 'restler-fuzz-results.zip')
            parser = RestlerParser(zip_path, os.path.join(output_dir, 'restler'))
            parser.process_data()
            print("Restler data processed successfully")
            
        elif parser_name == 'wuppiefuzz_parser':
            zip_path = os.path.join(base_dir, 'output-fuzzers', 'Wuppiefuzz', 'fuzzing-report.zip')
            parser = WuppieFuzzParser(zip_path, os.path.join(output_dir, 'wuppiefuzz'))
            parser.process_data()
            print("WuppieFuzz data processed successfully")
            
        else:
            print(f"Unknown parser: {parser_name}")
            sys.exit(1)
            
    except Exception as e:
        print(f"Error processing {parser_name}: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()