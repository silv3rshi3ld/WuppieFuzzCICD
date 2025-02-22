"""Standardized data loader for processing fuzzer outputs."""

import os
import json
import glob
from collections import defaultdict
from typing import Dict, List, Any, Optional

class StandardizedDataLoader:
    """Loads and processes standardized fuzzer output data."""
    
    def __init__(self, base_dir: str):
        """Initialize the loader.
        
        Args:
            base_dir: Base directory containing standardized outputs
        """
        self.base_dir = base_dir
        
    def classify_severity(self, status_code: int) -> Dict[str, str]:
        """Classify the severity of an issue based on status code.
        
        Args:
            status_code: HTTP status code
            
        Returns:
            Dictionary containing severity level, description, and CSS class
        """
        if status_code >= 500:
            return {
                "level": "Critical",
                "description": "Server Error - Potential crash or unhandled exception",
                "class": "bg-red-100 text-red-800"
            }
        elif status_code in [401, 403]:
            return {
                "level": "Medium-High",
                "description": "Security-related client error",
                "class": "bg-orange-100 text-orange-800"
            }
        elif status_code == 400:
            return {
                "level": "Medium",
                "description": "Bad Request - Potential security implication",
                "class": "bg-yellow-100 text-yellow-800"
            }
        elif status_code >= 400:
            return {
                "level": "Low",
                "description": "Expected client error",
                "class": "bg-blue-100 text-blue-800"
            }
        elif status_code >= 300:
            return {
                "level": "Informational",
                "description": "Redirect - Check for security implications",
                "class": "bg-gray-100 text-gray-800"
            }
        else:
            return {
                "level": "Medium",
                "description": "Success - Check for unexpected behavior",
                "class": "bg-green-100 text-green-800"
            }

    def load_test_cases(self, directory: str) -> List[Dict[str, Any]]:
        """Load test cases from a directory.
        
        Args:
            directory: Directory containing test case chunks
            
        Returns:
            List of test cases
        """
        test_cases = []
        if os.path.exists(directory):
            chunk_files = glob.glob(os.path.join(directory, "*_chunk_*.json"))
            for file in sorted(chunk_files):
                try:
                    with open(file, 'r') as f:
                        chunk_data = json.load(f)
                        test_cases.extend(chunk_data)
                except (IOError, json.JSONDecodeError) as e:
                    print(f"Error loading test cases from {file}: {str(e)}")
        return test_cases

    def load_fuzzer_data(self, fuzzer_name: str) -> Optional[Dict[str, Any]]:
        """Load all data for a specific fuzzer.
        
        Args:
            fuzzer_name: Name of the fuzzer
            
        Returns:
            Dictionary containing fuzzer data or None if loading fails
        """
        try:
            fuzzer_dir = os.path.join(self.base_dir, fuzzer_name.lower(), fuzzer_name.lower())
            
            # Load metadata
            metadata_path = os.path.join(fuzzer_dir, "metadata.json")
            if not os.path.exists(metadata_path):
                print(f"Metadata file not found for {fuzzer_name}")
                return None
                
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            
            # Load endpoints
            endpoints = []
            endpoints_dir = os.path.join(fuzzer_dir, "endpoints")
            if os.path.exists(endpoints_dir):
                chunk_files = glob.glob(os.path.join(endpoints_dir, "endpoints_chunk_*.json"))
                for file in sorted(chunk_files):
                    with open(file, 'r') as f:
                        chunk_data = json.load(f)
                        endpoints.extend(chunk_data)
            
            # Load test cases
            test_cases = {
                "faults": self.load_test_cases(os.path.join(fuzzer_dir, "test_cases", "faults")),
                "success": self.load_test_cases(os.path.join(fuzzer_dir, "test_cases", "success"))
            }
            
            return {
                "metadata": metadata,
                "endpoints": endpoints,
                "test_cases": test_cases
            }
            
        except (IOError, json.JSONDecodeError) as e:
            print(f"Error loading data for {fuzzer_name}: {str(e)}")
            return None
        except KeyError as e:
            print(f"Missing required data field for {fuzzer_name}: {str(e)}")
            return None

    def process_dashboard_data(self, fuzzer_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process fuzzer data into dashboard format.
        
        Args:
            fuzzer_data: Raw fuzzer data
            
        Returns:
            Processed dashboard data
        """
        # Calculate severity distributions
        severity_stats = defaultdict(int)
        critical_issues = []
        
        # Process fault test cases
        for case in fuzzer_data["test_cases"]["faults"]:
            status_code = case["response"]["status_code"]
            severity = self.classify_severity(status_code)
            severity_stats[severity["level"]] += 1
            
            # Track critical issues
            if status_code >= 500:
                critical_issues.append({
                    "endpoint": case["endpoint"],
                    "method": case["method"],
                    "status_code": status_code,
                    "severity": severity,
                    "request": case["request"],
                    "response": case["response"]
                })
        
        # Process endpoints
        endpoint_stats = defaultdict(lambda: defaultdict(int))
        processed_endpoints = []
        
        for endpoint in fuzzer_data.get("endpoints", []):
            try:
                # Process endpoint statistics
                stats = endpoint.get("statistics", {})
                method = endpoint.get("method", "UNKNOWN")
                path = endpoint.get("path", "unknown")
                
                # Add to endpoint stats
                for status, count in stats.get("status_codes", {}).items():
                    severity = self.classify_severity(int(status))
                    endpoint_stats[path][severity["level"]] += count
                
                # Create processed endpoint
                processed_endpoint = {
                    "path": path,
                    "method": method,
                    "statistics": {
                        "total_requests": stats.get("total_requests", 0),
                        "success_rate": stats.get("success_rate", 0),
                        "status_codes": stats.get("status_codes", {})
                    }
                }
                processed_endpoints.append(processed_endpoint)
                
            except (KeyError, TypeError, ValueError) as e:
                print(f"Warning: Error processing endpoint {endpoint.get('path', 'unknown')}: {str(e)}")
                continue
        
        return {
            "metadata": fuzzer_data["metadata"],
            "severity_distribution": dict(severity_stats),
            "endpoints": processed_endpoints,
            "endpoint_stats": [{
                "path": path,
                "severity_counts": dict(counts)
            } for path, counts in endpoint_stats.items()],
            "critical_issues": critical_issues
        }

    def load_all_fuzzers(self) -> List[Dict[str, Any]]:
        """Load and process data for all fuzzers.
        
        Returns:
            List of processed dashboard data for each fuzzer
        """
        dashboards = []
        fuzzers = ["WuppieFuzz", "Restler", "Evomaster"]
        
        for fuzzer_name in fuzzers:
            fuzzer_data = self.load_fuzzer_data(fuzzer_name)
            if fuzzer_data:
                dashboard_data = self.process_dashboard_data(fuzzer_data)
                dashboards.append(dashboard_data)
                print(f"✓ Processed {fuzzer_name} data")
            else:
                print(f"✗ Failed to process {fuzzer_name} data")
        
        return dashboards