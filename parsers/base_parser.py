import os
import json
from abc import ABC, abstractmethod
from typing import Dict, List, Set, Any

class BaseFuzzerParser(ABC):
    """
    Base class for fuzzer parsers that implements common chunking functionality.
    All fuzzer-specific parsers should inherit from this class.
    """
    def __init__(self, output_dir, fuzzer_name, chunk_size=100):
        """
        Initialize the base parser.
        
        Args:
            output_dir (str): Directory where the chunked output will be written
            fuzzer_name (str): Name of the fuzzer (e.g., 'Wuppiefuzz', 'Evomaster')
            chunk_size (int): Number of endpoints per chunk
        """
        self.output_dir = output_dir
        self.fuzzer_name = fuzzer_name
        self.chunk_size = chunk_size
        self.data_dir = output_dir

    def ensure_output_dirs(self):
        """Create necessary output directories if they don't exist."""
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(os.path.join(self.data_dir, 'endpoints'), exist_ok=True)

    def calculate_success_rate(self, successful_requests: int, total_requests: int) -> float:
        """
        Calculate the success rate as a percentage.
        
        Args:
            successful_requests (int): Number of successful requests
            total_requests (int): Total number of requests
            
        Returns:
            float: Success rate as a percentage
        """
        return round((successful_requests / total_requests) * 100, 2) if total_requests > 0 else 0

    def count_unique_endpoints(self, endpoints: List[Dict[str, Any]]) -> int:
        """
        Count unique endpoints based on their paths.
        
        Args:
            endpoints (list): List of endpoint dictionaries
            
        Returns:
            int: Number of unique endpoints
        """
        unique_paths: Set[str] = set()
        for endpoint in endpoints:
            if 'path' in endpoint:
                unique_paths.add(endpoint['path'])
        return len(unique_paths)

    def classify_error(self, status_code: int) -> str:
        """
        Classify an error based on its status code.
        
        Args:
            status_code (int): HTTP status code
            
        Returns:
            str: Error classification ('critical', 'high', 'medium', 'low', or 'info')
        """
        if status_code >= 500:
            return 'critical'
        elif status_code in [401, 403]:
            return 'high'
        elif status_code == 400:
            return 'medium'
        elif status_code == 404:
            return 'low'
        elif 300 <= status_code < 400:
            return 'info'
        return 'info'

    def classify_errors(self, endpoints: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        """
        Classify errors from endpoints into categories.
        
        Args:
            endpoints (list): List of endpoint dictionaries
            
        Returns:
            dict: Error classification with counts and examples
        """
        classification = {
            "critical": {"count": 0, "examples": []},
            "high": {"count": 0, "examples": []},
            "medium": {"count": 0, "examples": []},
            "low": {"count": 0, "examples": []},
            "info": {"count": 0, "examples": []}
        }
        
        for endpoint in endpoints:
            status_code = endpoint.get('status_code', 0)
            if status_code > 0:  # Only process valid status codes
                severity = self.classify_error(status_code)
                classification[severity]["count"] += 1
                if len(classification[severity]["examples"]) < 5:  # Keep up to 5 examples
                    example = {
                        "path": endpoint.get('path', ''),
                        "method": endpoint.get('http_method', ''),
                        "status_code": status_code,
                        "details": endpoint.get('response_data', '')
                    }
                    classification[severity]["examples"].append(example)
        
        return classification

    def analyze_status_codes(self, endpoints: List[Dict[str, Any]]) -> Dict[str, int]:
        """
        Analyze status code distribution.
        
        Args:
            endpoints (list): List of endpoint dictionaries
            
        Returns:
            dict: Status code counts
        """
        status_codes: Dict[str, int] = {}
        for endpoint in endpoints:
            status = str(endpoint.get('status_code', 0))
            if status != '0':
                status_codes[status] = status_codes.get(status, 0) + 1
        return status_codes

    def write_chunked_data(self, data, category):
        """
        Write data in chunks based on category.
        
        Args:
            data: The data to write
            category (str): Category of data ('endpoints', 'metadata', 'coverage')
                          or a path like 'endpoints/chunk_0'
        """
        self.ensure_output_dirs()
        
        # Handle base categories
        if category in ['metadata', 'coverage']:
            self._write_js_file(category, data)
        # Handle endpoint chunks
        elif category.startswith('endpoints/chunk_'):
            self._write_js_file(category, data)
        # Handle full endpoints data
        elif category == 'endpoints':
            self._write_endpoint_chunks(data)
        else:
            raise ValueError(f"Unknown category: {category}")

    def _write_endpoint_chunks(self, endpoints):
        """
        Write endpoints in chunks.
        
        Args:
            endpoints (list): List of endpoint data to chunk
        """
        for i in range(0, len(endpoints), self.chunk_size):
            chunk = endpoints[i:i + self.chunk_size]
            chunk_num = i // self.chunk_size
            self._write_js_file(f'endpoints/chunk_{chunk_num}', chunk)
            print(f"Wrote chunk {chunk_num} with {len(chunk)} endpoints")

    def _write_js_file(self, name, data):
        """
        Write data as a JavaScript file.
        
        Args:
            name (str): Name of the file (without .js extension)
            data: Data to write
        """
        # Convert name to camelCase for variable name
        var_parts = name.replace('/', '_').split('_')
        var_name = var_parts[0] + ''.join(p.capitalize() for p in var_parts[1:])
        var_name = f"{self.fuzzer_name}{var_name}"

        # Create the JavaScript content
        content = f"window.{var_name} = {json.dumps(data, indent=2)};"
        
        # Write to file
        file_path = os.path.join(self.data_dir, f"{name}.js")
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Wrote {file_path}")

    @abstractmethod
    def process_metadata(self):
        """Process and write metadata. Must be implemented by subclasses."""
        pass

    @abstractmethod
    def process_coverage(self):
        """Process and write coverage data. Must be implemented by subclasses."""
        pass

    @abstractmethod
    def process_endpoints(self):
        """Process and write endpoint data. Must be implemented by subclasses."""
        pass

    def process_data(self):
        """
        Process all data in chunks.
        This is the main entry point that should be called to process the data.
        """
        print(f"Processing {self.fuzzer_name} data...")
        
        # Process small files first
        self.process_metadata()
        self.process_coverage()
        
        # Process large endpoint data in chunks
        self.process_endpoints()
        
        print(f"Completed processing {self.fuzzer_name} data")