"""Utility module for handling ZIP file extraction."""

import os
import zipfile
import tempfile
import shutil

def extract_zip(zip_path, expected_dir_name):
    """Extract ZIP file and ensure correct directory structure.
    
    Args:
        zip_path (str): Path to the ZIP file
        expected_dir_name (str): Expected name of the directory inside the ZIP
        
    Returns:
        str: Path to the extracted directory
        
    Raises:
        zipfile.BadZipFile: If the ZIP file is invalid
        FileNotFoundError: If the ZIP file doesn't exist
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
        
        # Return path to extracted directory
        return os.path.join(temp_dir, expected_dir_name)
        
    except Exception as e:
        # Clean up temp directory if extraction fails
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise e
