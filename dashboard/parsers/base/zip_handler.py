"""Handler for extracting and processing zip files."""

import os
import re
import zipfile
import tempfile
import shutil
import fnmatch
from typing import List, Optional, Dict, Set

class ZipHandler:
    """Handles zip file extraction and cleanup."""
    
    def __init__(self, zip_path: str):
        """Initialize with path to zip file.
        
        Args:
            zip_path: Path to the zip file to process
        """
        self.zip_path = zip_path
        self.temp_dir = None
        self._keep_alive = False
        
    def __enter__(self):
        """Context manager entry."""
        self.temp_dir = tempfile.mkdtemp(prefix='fuzzer_extract_')
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit with cleanup."""
        if self.temp_dir and os.path.exists(self.temp_dir) and not self._keep_alive:
            shutil.rmtree(self.temp_dir)
            
    def keep_alive(self):
        """Keep the temporary directory alive after context exit."""
        self._keep_alive = True
            
    def cleanup(self):
        """Clean up the temporary directory."""
        if self.temp_dir and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
            self.temp_dir = None
            
    def list_contents(self) -> List[str]:
        """List all files in the zip.
        
        Returns:
            List of file paths in the zip
        """
        with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
            return zip_ref.namelist()

    def find_timestamp_dir(self) -> Optional[str]:
        """Find timestamp-formatted directory in the ZIP.
        
        Returns:
            Name of timestamp directory if found, None otherwise
        """
        with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
            for name in zip_ref.namelist():
                if re.match(r'\d{4}-\d{2}-\d{2}T\d{6}\.\d{3}Z/', name):
                    return name.rstrip('/')
        return None

    def extract_fuzzer_data(self, fuzzer_type: str) -> Dict[str, str]:
        """Extract fuzzer-specific data files.
        
        Args:
            fuzzer_type: Type of fuzzer ('wuppiefuzz', 'restler', or 'evomaster')
            
        Returns:
            Dictionary mapping file types to their extracted paths
        """
        if not self.temp_dir:
            raise RuntimeError("ZipHandler must be used as context manager")

        # List all files in ZIP for debugging
        all_files = self.list_contents()
        print(f"\nZIP contents ({len(all_files)} files):")
        for file in all_files:
            print(f"  {file}")

        # Extract all files to maintain structure
        with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
            zip_ref.extractall(self.temp_dir)

        extracted_files = {}
        
        if fuzzer_type == 'wuppiefuzz':
            # Find the required files in the extracted structure
            for root, dirs, files in os.walk(self.temp_dir):
                for file in files:
                    if file == 'report.db':
                        extracted_files['db'] = os.path.join(root, file)
                    elif file == 'index.html' and 'endpointcoverage' in root:
                        extracted_files['coverage'] = os.path.join(root, file)
            
            print("\nExtracted WuppieFuzz files:")
            for file_type, path in extracted_files.items():
                print(f"  {file_type}: {path}")
                
        elif fuzzer_type == 'restler':
            # Find required files
            for root, dirs, files in os.walk(self.temp_dir):
                if 'testing_summary.json' in files:
                    extracted_files['summary'] = os.path.join(root, 'testing_summary.json')
                elif 'errorBuckets.json' in files:
                    extracted_files['errors'] = os.path.join(root, 'errorBuckets.json')
                elif 'bug_buckets' in dirs:
                    # Get all JSON files in bug_buckets except replay files
                    bug_dir = os.path.join(root, 'bug_buckets')
                    for file in os.listdir(bug_dir):
                        if file.endswith('.json') and not file.endswith('.replay.json'):
                            extracted_files['bugs'] = os.path.join(bug_dir, file)
                            break
            
            print("\nExtracted Restler files:")
            for file_type, path in extracted_files.items():
                print(f"  {file_type}: {path}")
                
        elif fuzzer_type == 'evomaster':
            # Find Python test files
            for root, dirs, files in os.walk(self.temp_dir):
                for file in files:
                    if file.endswith('_Test.py'):
                        if 'tests' not in extracted_files:
                            extracted_files['tests'] = os.path.join(root, file)
            
            print("\nExtracted Evomaster files:")
            for file_type, path in extracted_files.items():
                print(f"  {file_type}: {path}")
        
        return extracted_files

    def extract_with_structure(self, base_dir: str, file_patterns: List[str]) -> str:
        """Extract files maintaining directory structure relative to base_dir.
        
        Args:
            base_dir: Base directory path in zip to start from
            file_patterns: List of glob patterns to match files against
            
        Returns:
            Path to extracted contents
        """
        if not self.temp_dir:
            raise RuntimeError("ZipHandler must be used as context manager")
            
        # Extract all files to maintain structure
        with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
            zip_ref.extractall(self.temp_dir)
            
        print(f"\nExtracted to: {self.temp_dir}")
        print("Contents:")
        for root, dirs, files in os.walk(self.temp_dir):
            level = root.replace(self.temp_dir, '').count(os.sep)
            indent = ' ' * 4 * level
            print(f"{indent}{os.path.basename(root)}/")
            subindent = ' ' * 4 * (level + 1)
            for f in files:
                print(f"{subindent}{f}")
        
        return self.temp_dir

def extract_zip(zip_path: str, dir_name: str) -> str:
    """Extract a directory from a zip file.
    
    Args:
        zip_path: Path to the zip file
        dir_name: Name of directory to extract
        
    Returns:
        Path to extracted directory
    """
    handler = ZipHandler(zip_path)
    handler.keep_alive()  # Keep temp directory until parser is done
    
    with handler:
        # Extract all files to maintain structure
        handler.extract_with_structure("", ["**"])
        return handler.temp_dir
