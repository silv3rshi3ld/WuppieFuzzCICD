"""Handler for extracting and processing zip files."""

import os
import zipfile
import tempfile
import shutil
from typing import List, Optional

class ZipHandler:
    """Handles zip file extraction and cleanup."""
    
    def __init__(self, zip_path: str):
        """Initialize with path to zip file.
        
        Args:
            zip_path: Path to the zip file to process
        """
        self.zip_path = zip_path
        self.temp_dir = None
        
    def __enter__(self):
        """Context manager entry."""
        self.temp_dir = tempfile.mkdtemp(prefix='fuzzer_extract_')
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit with cleanup."""
        if self.temp_dir and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
            
    def extract_all(self) -> str:
        """Extract all contents of the zip file.
        
        Returns:
            Path to extracted contents
        """
        if not self.temp_dir:
            raise RuntimeError("ZipHandler must be used as context manager")
            
        with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
            zip_ref.extractall(self.temp_dir)
            
        return self.temp_dir
        
    def extract_files(self, file_patterns: List[str]) -> str:
        """Extract only files matching the given patterns.
        
        Args:
            file_patterns: List of glob patterns to match files against
            
        Returns:
            Path to directory containing extracted files
        """
        if not self.temp_dir:
            raise RuntimeError("ZipHandler must be used as context manager")
            
        import fnmatch
        
        with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
            # Get list of all files in zip
            all_files = zip_ref.namelist()
            print(f"\nAll files in zip: {all_files}")
            
            # Find files matching patterns
            files_to_extract = []
            for pattern in file_patterns:
                matching = fnmatch.filter(all_files, pattern)
                files_to_extract.extend(matching)
                print(f"Files matching pattern '{pattern}': {matching}")
                
            # Extract matched files
            for file in files_to_extract:
                zip_ref.extract(file, self.temp_dir)
                
        return self.temp_dir
        
    def extract_dir(self, dir_name: str) -> Optional[str]:
        """Extract a specific directory from the zip.
        
        Args:
            dir_name: Name of directory to extract
            
        Returns:
            Path to extracted directory or None if not found
        """
        if not self.temp_dir:
            raise RuntimeError("ZipHandler must be used as context manager")
            
        with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
            # Find all entries for the directory
            dir_entries = [
                name for name in zip_ref.namelist()
                if name.startswith(f"{dir_name}/")
            ]
            
            if not dir_entries:
                return None
                
            # Extract directory
            for entry in dir_entries:
                zip_ref.extract(entry, self.temp_dir)
                
        extracted_dir = os.path.join(self.temp_dir, dir_name)
        return extracted_dir if os.path.exists(extracted_dir) else None
        
    def list_contents(self) -> List[str]:
        """List all files in the zip.
        
        Returns:
            List of file paths in the zip
        """
        with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
            return zip_ref.namelist()
            
    def get_file(self, file_path: str) -> Optional[bytes]:
        """Get contents of a specific file from the zip.
        
        Args:
            file_path: Path to file within the zip
            
        Returns:
            File contents as bytes, or None if file not found
        """
        try:
            with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
                return zip_ref.read(file_path)
        except (KeyError, zipfile.BadZipFile):
            return None

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
            
        import fnmatch
        
        with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
            # List all files in zip
            all_files = zip_ref.namelist()
            print(f"\nAll files in zip: {all_files}")
            
            # If base_dir is empty, use all files
            if not base_dir:
                files_to_extract = []
                for pattern in file_patterns:
                    matching = fnmatch.filter(all_files, pattern)
                    files_to_extract.extend(matching)
                    print(f"Files matching pattern '{pattern}': {matching}")
            else:
                # Get all files under base_dir
                base_files = [
                    f for f in all_files
                    if f.startswith(f"{base_dir}/") or f == base_dir
                ]
                print(f"\nFiles under {base_dir}: {base_files}")
                
                # Find files matching patterns
                files_to_extract = []
                for pattern in file_patterns:
                    # Make pattern relative to base_dir if it's not already
                    if not pattern.startswith(base_dir):
                        pattern = os.path.join(base_dir, pattern)
                    pattern = pattern.replace('\\', '/')
                    
                    matching = fnmatch.filter(base_files, pattern)
                    files_to_extract.extend(matching)
                    print(f"Files matching pattern '{pattern}': {matching}")
                
            # Extract matched files
            print(f"\nExtracting files: {files_to_extract}")
            for file in files_to_extract:
                zip_ref.extract(file, self.temp_dir)
                
        extracted_dir = os.path.join(self.temp_dir, base_dir) if base_dir else self.temp_dir
        return extracted_dir if os.path.exists(extracted_dir) else self.temp_dir

def extract_zip(zip_path: str, dir_name: str) -> str:
    """Extract a directory from a zip file.
    
    Args:
        zip_path: Path to the zip file
        dir_name: Name of directory to extract
        
    Returns:
        Path to extracted directory
    """
    with ZipHandler(zip_path) as handler:
        extracted_path = handler.extract_dir(dir_name)
        if not extracted_path:
            # If directory not found, try extracting all and look for it
            handler.extract_all()
            extracted_path = os.path.join(handler.temp_dir, dir_name)
            if not os.path.exists(extracted_path):
                raise FileNotFoundError(f"Directory {dir_name} not found in {zip_path}")
        return extracted_path
