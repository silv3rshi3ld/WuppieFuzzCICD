"""Base classes for fuzzer result parsing."""

import os
import json
import zipfile
import tempfile
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple

class BaseParser(ABC):
    """Base parser class for fuzzer results."""

    def __init__(self):
        self.data = {
            "metadata": {
                "name": "",
                "version": "1.0.0",
                "timestamp": datetime.now().isoformat(),
                "duration": "00:00:00"
            },
            "stats": {
                "total_requests": 0,
                "critical_issues": 0,
                "unique_endpoints": 0,
                "code_coverage": 0,
                "execution_speed": 0
            },
            "coverage": {
                "lines": {
                    "covered": 0,
                    "total": 0,
                    "percentage": 0
                },
                "functions": {
                    "covered": 0,
                    "total": 0,
                    "percentage": 0
                },
                "branches": {
                    "covered": 0,
                    "total": 0,
                    "percentage": 0
                }
            },
            "endpoints": [],
            "crashes": []
        }

    def parse_zip(self, zip_path: str) -> Tuple[str, Dict[str, Any]]:
        """Parse fuzzer results from zip file.
        
        Args:
            zip_path: Path to the zip file containing fuzzer results
            
        Returns:
            Tuple of (temp directory path, parsed data dictionary)
        """
        # Create temp directory for extraction
        temp_dir = tempfile.mkdtemp(prefix='fuzzer_extract_')
        
        try:
            # Extract zip contents
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                # Get list of files
                all_files = zip_ref.namelist()
                print(f"\nAll files in zip: {all_files}")
                
                # Get relevant files based on patterns
                files_to_extract = self.get_relevant_files(all_files)
                print(f"\nExtracting files: {files_to_extract}")
                
                # Extract only needed files
                for file in files_to_extract:
                    zip_ref.extract(file, temp_dir)
                
            # Process extracted files
            print(f"\nExamining directory: {temp_dir}")
            print(f"Directory contents: {os.listdir(temp_dir)}")
            
            # Parse contents
            self.parse_contents(temp_dir)
            
            return temp_dir, self.data
            
        except Exception as e:
            print(f"Error parsing zip file: {e}")
            raise

    @abstractmethod
    def get_relevant_files(self, all_files: List[str]) -> List[str]:
        """Get list of relevant files to extract from zip.
        
        Args:
            all_files: List of all files in zip
            
        Returns:
            List of files to extract
        """
        pass

    @abstractmethod
    def parse_contents(self, temp_dir: str) -> None:
        """Parse extracted contents into standardized format.
        
        Args:
            temp_dir: Path to directory containing extracted files
        """
        pass

    def classify_crash_severity(self, crash_data: Dict[str, Any]) -> str:
        """Classify crash severity based on type and impact.
        
        Args:
            crash_data: Dictionary containing crash information
            
        Returns:
            Severity level: critical, high, medium, or low
        """
        # Default to medium severity
        severity = "medium"
        
        # Check for critical conditions
        if any(critical in str(crash_data).lower() for critical in [
            "buffer overflow",
            "null pointer",
            "segmentation fault",
            "memory leak",
            "use after free"
        ]):
            severity = "critical"
            
        # Check for high severity conditions
        elif any(high in str(crash_data).lower() for high in [
            "assertion failure",
            "unhandled exception",
            "deadlock",
            "resource exhaustion"
        ]):
            severity = "high"
            
        # Check for low severity conditions
        elif any(low in str(crash_data).lower() for low in [
            "timeout",
            "connection reset",
            "validation error"
        ]):
            severity = "low"
            
        return severity

    def calculate_coverage(self, covered: int, total: int) -> Dict[str, Any]:
        """Calculate coverage metrics.
        
        Args:
            covered: Number of covered items
            total: Total number of items
            
        Returns:
            Dictionary with coverage metrics
        """
        percentage = (covered / total * 100) if total > 0 else 0
        return {
            "covered": covered,
            "total": total,
            "percentage": round(percentage, 2)
        }

    def process_crash(self, crash_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process crash information into standardized format.
        
        Args:
            crash_data: Raw crash data
            
        Returns:
            Standardized crash information
        """
        # Generate unique crash ID
        crash_id = f"crash-{len(self.data['crashes']) + 1}"
        
        # Classify severity
        severity = self.classify_crash_severity(crash_data)
        
        # Extract stack trace if available
        stack_trace = crash_data.get("stack_trace", "")
        if not stack_trace and "error" in crash_data:
            stack_trace = str(crash_data["error"])
            
        return {
            "id": crash_id,
            "severity": severity,
            "type": crash_data.get("type", "unknown"),
            "endpoint": crash_data.get("endpoint", ""),
            "method": crash_data.get("method", ""),
            "status_code": crash_data.get("status_code", 500),
            "timestamp": crash_data.get("timestamp", datetime.now().isoformat()),
            "details": {
                "stack_trace": stack_trace,
                "request": crash_data.get("request", ""),
                "response": crash_data.get("response", "")
            }
        }

    def add_endpoint(self, endpoint_data: Dict[str, Any]) -> None:
        """Add endpoint data to the results.
        
        Args:
            endpoint_data: Endpoint information
        """
        # Check if endpoint already exists
        existing = next(
            (e for e in self.data["endpoints"] 
             if e["path"] == endpoint_data["path"] and 
             e["method"] == endpoint_data["method"]),
            None
        )
        
        if existing:
            # Update existing endpoint
            existing["total_requests"] += endpoint_data.get("total_requests", 0)
            existing["success_requests"] += endpoint_data.get("success_requests", 0)
            
            # Update status codes
            for code, count in endpoint_data.get("status_codes", {}).items():
                if code in existing["status_codes"]:
                    existing["status_codes"][code] += count
                else:
                    existing["status_codes"][code] = count
                    
            # Recalculate success rate
            if existing["total_requests"] > 0:
                existing["success_rate"] = round(
                    (existing["success_requests"] / existing["total_requests"]) * 100,
                    2
                )
        else:
            # Add new endpoint
            self.data["endpoints"].append(endpoint_data)
            
        # Update unique endpoints count
        self.data["stats"]["unique_endpoints"] = len(self.data["endpoints"])

    def save_data(self, output_dir: str, fuzzer_name: str) -> None:
        """Save parsed data to JSON files.
        
        Args:
            output_dir: Directory to save files
            fuzzer_name: Name of the fuzzer
        """
        # Create fuzzer directory
        fuzzer_dir = os.path.join(output_dir, fuzzer_name.lower())
        os.makedirs(fuzzer_dir, exist_ok=True)
        
        # Save main data file
        with open(os.path.join(fuzzer_dir, 'data.js'), 'w') as f:
            f.write(f"window.{fuzzer_name}Data = {json.dumps(self.data, indent=2)};")
            
        # Save coverage data
        with open(os.path.join(fuzzer_dir, 'coverage.js'), 'w') as f:
            f.write(f"window.{fuzzer_name}Coverage = {json.dumps(self.data['coverage'], indent=2)};")
            
        # Save metadata
        with open(os.path.join(fuzzer_dir, 'metadata.js'), 'w') as f:
            metadata = {
                **self.data['metadata'],
                **self.data['stats']
            }
            f.write(f"window.{fuzzer_name}Metadata = {json.dumps(metadata, indent=2)};")
            
        # Save endpoints data
        with open(os.path.join(fuzzer_dir, 'endpoints_meta.js'), 'w') as f:
            endpoints_data = {
                "endpoints": self.data['endpoints']
            }
            f.write(f"window.{fuzzer_name}EndpointsMeta = {json.dumps(endpoints_data, indent=2)};")
