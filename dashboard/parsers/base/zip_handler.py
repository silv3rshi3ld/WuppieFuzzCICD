"""Utility module for handling ZIP file extraction."""

import os
import re
import zipfile
import tempfile
import shutil
from typing import Optional, List

def find_timestamp_directory(base_dir: str) -> Optional[str]:
    """Find timestamp-formatted directory in the given path.
    
    Args:
        base_dir (str): Directory to search in
        
    Returns:
        Optional[str]: Path to timestamp directory if found, None otherwise
        
    Example timestamp format: 2025-02-19T135350.002Z
    """
    timestamp_pattern = re.compile(r'\d{4}-\d{2}-\d{2}T\d{6}\.\d{3}Z')
    
    # List all directories
    try:
        dirs = [d for d in os.listdir(base_dir) 
                if os.path.isdir(os.path.join(base_dir, d))]
        
        # Find directory matching timestamp pattern
        for dir_name in dirs:
            if timestamp_pattern.match(dir_name):
                return os.path.join(base_dir, dir_name)
    except OSError:
        return None
    
    return None

def validate_directory_structure(base_dir: str, required_paths: List[str]) -> bool:
    """Validate that required paths exist in directory structure.
    
    Args:
        base_dir (str): Base directory to check
        required_paths (List[str]): List of required relative paths
        
    Returns:
        bool: True if all required paths exist
    """
    for path in required_paths:
        full_path = os.path.join(base_dir, path)
        if not os.path.exists(full_path):
            return False
    return True

def extract_zip(zip_path: str, expected_dir_name: str, required_paths: Optional[List[str]] = None) -> str:
    """Extract ZIP file and ensure correct directory structure.
    
    Args:
        zip_path (str): Path to the ZIP file
        expected_dir_name (str): Expected name of the directory inside the ZIP
        required_paths (Optional[List[str]]): List of required paths to validate
        
    Returns:
        str: Path to the extracted directory
        
    Raises:
        zipfile.BadZipFile: If the ZIP file is invalid
        FileNotFoundError: If the ZIP file doesn't exist
        ValueError: If required directory structure is invalid
    """
    if not os.path.exists(zip_path):
        raise FileNotFoundError(f"ZIP file not found: {zip_path}")
    
    # Create temporary directory
    temp_dir = tempfile.mkdtemp()
    
    try:
        # Extract ZIP contents
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
        
        # Handle cleanup on program exit
        import atexit
        atexit.register(lambda: shutil.rmtree(temp_dir, ignore_errors=True))
        
        extracted_dir = os.path.join(temp_dir, expected_dir_name)
        
        # Handle WuppieFuzz timestamp directory
        if expected_dir_name == 'fuzzing-report':
            timestamp_dir = find_timestamp_directory(extracted_dir)
            if timestamp_dir:
                # For WuppieFuzz, we want to keep the timestamp directory in the path
                extracted_dir = os.path.dirname(timestamp_dir)
        
        # Validate directory structure if required paths provided
        if required_paths and not validate_directory_structure(extracted_dir, required_paths):
            raise ValueError(
                f"Invalid directory structure in {zip_path}. "
                f"Missing one or more required paths: {', '.join(required_paths)}"
            )
        
        return extracted_dir
        
    except Exception as e:
        # Clean up temp directory if extraction fails
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise e
