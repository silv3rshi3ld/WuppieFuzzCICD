"""Base parser implementation for fuzzer results."""

import os
import json
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Tuple, Optional
from .zip_handler import ZipHandler

class BaseParser(ABC):
    """Abstract base class for fuzzer result parsers."""
    
    DASHBOARD_COLORS = {
        "hits": "#22c55e",      # Green
        "misses": "#ef4444",    # Red
        "unspecified": "#f59e0b" # Orange
    }
    
    def __init__(self):
        """Initialize parser with default data structure."""
        self.data = {
            "metadata": {
                "name": "",
                "version": "1.0.0",
                "timestamp": "",
                "duration": "00:00:00"
            },
            "stats": {
                "total_requests": 0,
                "critical_issues": 0,
                "unique_endpoints": 0,
                "code_coverage": 0,
                "statusDistribution": {
                    "hits": 0,
                    "misses": 0,
                    "unspecified": 0
                },
                "methodCoverage": {
                    "GET": 0,
                    "POST": 0,
                    "PUT": 0,
                    "DELETE": 0
                },
                "statusCodes": []
            },
            "coverage": {
                "lines": {"covered": 0, "total": 0, "percentage": 0},
                "functions": {"covered": 0, "total": 0, "percentage": 0},
                "branches": {"covered": 0, "total": 0, "percentage": 0},
                "statements": {"covered": 0, "total": 0, "percentage": 0}
            },
            "endpoints": [],
            "crashes": []
        }

    def parse_zip(self, zip_path: str) -> Tuple[str, Dict[str, Any]]:
        """Parse fuzzer results from a zip file.
        
        Args:
            zip_path: Path to the zip file
            
        Returns:
            Tuple of (temp directory path, parsed data dictionary)
        """
        print(f"Parsing zip file: {zip_path}")
        
        with ZipHandler(zip_path) as handler:
            # Extract files based on patterns
            temp_dir = handler.extract_files(self.get_file_patterns())
            print(f"Extracted to: {temp_dir}")
            print(f"Directory contents: {os.listdir(temp_dir)}")
            
            # Parse extracted contents
            return temp_dir, self.parse_results(temp_dir)

    @abstractmethod
    def get_file_patterns(self) -> List[str]:
        """Get list of file patterns to extract from zip.
        
        Returns:
            List of glob patterns
        """
        pass

    @abstractmethod
    def parse_results(self, input_path: str) -> Dict[str, Any]:
        """Parse fuzzer results from extracted directory.
        
        Args:
            input_path: Path to directory containing extracted files
            
        Returns:
            Dictionary containing parsed data
        """
        pass

    def update_coverage_metrics(self, 
                              line_covered: int, 
                              line_total: int,
                              func_covered: Optional[int] = None,
                              func_total: Optional[int] = None,
                              branch_covered: Optional[int] = None,
                              branch_total: Optional[int] = None,
                              stmt_covered: Optional[int] = None,
                              stmt_total: Optional[int] = None) -> None:
        """Update coverage metrics with provided values.
        
        Args:
            line_covered: Number of covered lines
            line_total: Total number of lines
            func_covered: Number of covered functions (optional)
            func_total: Total number of functions (optional)
            branch_covered: Number of covered branches (optional)
            branch_total: Total number of branches (optional)
            stmt_covered: Number of covered statements (optional)
            stmt_total: Total number of statements (optional)
        """
        # Update line coverage
        self.data["coverage"]["lines"] = self.calculate_coverage(line_covered, line_total)
        
        # Update function coverage
        if func_covered is not None and func_total is not None:
            self.data["coverage"]["functions"] = self.calculate_coverage(func_covered, func_total)
        else:
            # Estimate function coverage from line coverage
            self.data["coverage"]["functions"] = self.calculate_coverage(
                int(line_covered * 0.9),  # Functions typically have higher coverage
                int(line_total * 0.9)
            )
        
        # Update branch coverage
        if branch_covered is not None and branch_total is not None:
            self.data["coverage"]["branches"] = self.calculate_coverage(branch_covered, branch_total)
        else:
            # Estimate branch coverage from line coverage
            self.data["coverage"]["branches"] = self.calculate_coverage(
                int(line_covered * 0.7),  # Branches typically have lower coverage
                int(line_total * 0.7)
            )
        
        # Update statement coverage
        if stmt_covered is not None and stmt_total is not None:
            self.data["coverage"]["statements"] = self.calculate_coverage(stmt_covered, stmt_total)
        else:
            # Estimate statement coverage from line coverage
            self.data["coverage"]["statements"] = self.calculate_coverage(
                int(line_covered * 0.85),  # Statements typically between lines and functions
                int(line_total * 0.85)
            )
        
        # Calculate overall code coverage as average of all metrics
        coverage_values = [
            self.data["coverage"][metric]["percentage"]
            for metric in ["lines", "functions", "branches", "statements"]
        ]
        self.data["stats"]["code_coverage"] = round(
            sum(coverage_values) / len(coverage_values),
            2
        )

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

    def add_endpoint(self, endpoint_data: Dict[str, Any]) -> None:
        """Add endpoint data to results.
        
        Args:
            endpoint_data: Dictionary containing endpoint information
        """
        # Ensure required fields
        required_fields = ["path", "method", "total_requests"]
        if not all(field in endpoint_data for field in required_fields):
            print(f"Warning: Missing required fields in endpoint data: {endpoint_data}")
            return
            
        # Calculate success rate if not provided
        if "success_rate" not in endpoint_data and "success_requests" in endpoint_data:
            success_rate = (
                (endpoint_data["success_requests"] / endpoint_data["total_requests"] * 100)
                if endpoint_data["total_requests"] > 0
                else 0
            )
            endpoint_data["success_rate"] = round(success_rate, 2)
            
        # Add status codes if not present
        if "status_codes" not in endpoint_data:
            endpoint_data["status_codes"] = {}
            
        # Add severity counts if not present
        if "severity_counts" not in endpoint_data:
            endpoint_data["severity_counts"] = {
                "critical": 0,
                "high": 0,
                "medium": 0,
                "low": 0
            }
            
        # Add responses if not present
        if "responses" not in endpoint_data:
            endpoint_data["responses"] = {}
            
        self.data["endpoints"].append(endpoint_data)
        self.data["stats"]["unique_endpoints"] = len(self.data["endpoints"])

    def process_crash(self, crash_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process crash information into standardized format.
        
        Args:
            crash_data: Raw crash data
            
        Returns:
            Standardized crash information
        """
        # Ensure required fields
        required_fields = ["endpoint", "method", "status_code"]
        if not all(field in crash_data for field in required_fields):
            print(f"Warning: Missing required fields in crash data: {crash_data}")
            return crash_data
            
        # Add severity if not present
        if "severity" not in crash_data:
            crash_data["severity"] = self.determine_severity(crash_data)
            
        # Add type if not present
        if "type" not in crash_data:
            crash_data["type"] = "server_error" if crash_data["status_code"] >= 500 else "client_error"
            
        # Update critical issues count
        if crash_data["severity"] == "critical":
            self.data["stats"]["critical_issues"] += 1
            
        # Add crash to list
        self.data["crashes"].append(crash_data)
            
        return crash_data

    def determine_severity(self, crash_data: Dict[str, Any]) -> str:
        """Determine crash severity based on various factors.
        
        Args:
            crash_data: Dictionary containing crash information
            
        Returns:
            Severity level string
        """
        status_code = crash_data.get("status_code", 500)
        error = str(crash_data.get("error", "")).lower()
        has_stack_trace = crash_data.get("has_stack_trace", False)
        
        # Critical: 500 errors with stack traces or serious issues
        if status_code >= 500 and (has_stack_trace or any(term in error for term in [
            "memory leak", "buffer overflow", "null pointer", "segmentation fault"
        ])):
            return "critical"
            
        # High: Other 500 errors or potential security issues
        if status_code >= 500 or any(term in error for term in [
            "injection", "overflow", "memory", "violation"
        ]):
            return "high"
            
        # Medium: 400 errors with potential security implications
        if status_code >= 400 and any(term in error for term in [
            "sql", "database", "auth", "permission", "access denied"
        ]):
            return "medium"
            
        # Low: Other issues
        return "low"

    def validate_data(self) -> bool:
        """Validate parsed data structure.
        
        Returns:
            True if data is valid, False otherwise
        """
        required_sections = ["metadata", "stats", "coverage", "endpoints"]
        if not all(section in self.data for section in required_sections):
            print(f"Error: Missing required sections in data: {self.data.keys()}")
            return False
            
        # Validate coverage data
        coverage = self.data["coverage"]
        coverage_metrics = ["lines", "functions", "branches", "statements"]
        for metric in coverage_metrics:
            if metric not in coverage:
                print(f"Error: Missing coverage metric: {metric}")
                return False
            if not all(key in coverage[metric] for key in ["covered", "total", "percentage"]):
                print(f"Error: Invalid coverage data for {metric}: {coverage[metric]}")
                return False
                
        return True
