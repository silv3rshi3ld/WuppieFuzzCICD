"""Enhanced JSON chunking utility for handling large datasets."""

import os
import json
from typing import Any, Dict, List

class JsonChunker:
    """Handles chunking of JSON data into manageable files."""
    
    def __init__(self, base_dir: str, fuzzer_name: str, chunk_size: int = 50):
        """Initialize the chunker.
        
        Args:
            base_dir: Base directory for output files
            fuzzer_name: Name of the fuzzer (used for directory naming)
            chunk_size: Number of items per chunk file
        """
        self.base_dir = base_dir
        self.fuzzer_name = fuzzer_name.lower()
        self.chunk_size = chunk_size
        self.output_dir = os.path.join(base_dir, self.fuzzer_name)
        
        # Create directory structure
        self._setup_directories()
    
    def _setup_directories(self):
        """Create the required directory structure."""
        dirs = [
            self.output_dir,
            os.path.join(self.output_dir, 'endpoints'),
            os.path.join(self.output_dir, 'test_cases', 'success'),
            os.path.join(self.output_dir, 'test_cases', 'faults')
        ]
        for dir_path in dirs:
            os.makedirs(dir_path, exist_ok=True)
    
    def save_metadata(self, metadata: Dict[str, Any]):
        """Save metadata to a single file.
        
        Args:
            metadata: Dictionary containing metadata
        """
        file_path = os.path.join(self.output_dir, 'metadata.json')
        self._save_json(file_path, metadata)
    
    def chunk_endpoints(self, endpoints: List[Dict[str, Any]]) -> Dict[str, int]:
        """Save endpoints in chunks.
        
        Args:
            endpoints: List of endpoint dictionaries
        
        Returns:
            Dict containing total items and chunks created
        """
        return self._chunk_data(
            endpoints,
            os.path.join(self.output_dir, 'endpoints'),
            'endpoints'
        )
    
    def chunk_test_cases(self, test_cases: List[Dict[str, Any]]):
        """Split and save test cases by type.
        
        Args:
            test_cases: List of test case dictionaries
        """
        # Separate successful and fault test cases
        successes = [tc for tc in test_cases if tc.get('type') == 'success']
        faults = [tc for tc in test_cases if tc.get('type') == 'fault']
        
        # Chunk successful test cases
        success_info = self._chunk_data(
            successes,
            os.path.join(self.output_dir, 'test_cases', 'success'),
            'success'
        )
        
        # Chunk fault test cases
        fault_info = self._chunk_data(
            faults,
            os.path.join(self.output_dir, 'test_cases', 'faults'),
            'faults'
        )
        
        return {
            'success': success_info,
            'faults': fault_info
        }
    
    def _chunk_data(
        self,
        items: List[Dict[str, Any]],
        output_dir: str,
        prefix: str
    ) -> Dict[str, int]:
        """Chunk and save data to numbered files.
        
        Args:
            items: List of items to chunk
            output_dir: Directory to save chunks
            prefix: Prefix for chunk filenames
        
        Returns:
            Dict containing total items and chunks created
        """
        total_items = len(items)
        total_chunks = (total_items + self.chunk_size - 1) // self.chunk_size
        
        for i in range(total_chunks):
            start_idx = i * self.chunk_size
            end_idx = min(start_idx + self.chunk_size, total_items)
            chunk = items[start_idx:end_idx]
            
            chunk_file = os.path.join(output_dir, f'{prefix}_chunk_{i}.json')
            self._save_json(chunk_file, chunk)
        
        return {
            'total_items': total_items,
            'total_chunks': total_chunks
        }
    
    def _save_json(self, file_path: str, data: Any):
        """Save data as JSON with proper formatting.
        
        Args:
            file_path: Path to save the file
            data: Data to save
        """
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)