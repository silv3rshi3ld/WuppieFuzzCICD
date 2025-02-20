from abc import ABC, abstractmethod
import json

class BaseParser(ABC):
    """Abstract base class for fuzzer result parsers."""
    
    DASHBOARD_COLORS = {
        "hits": "#22c55e",      # Green
        "misses": "#ef4444",    # Red
        "unspecified": "#f59e0b" # Orange
    }
    
    @abstractmethod
    def process_data(self):
        """Process data into uniform format.
        
        Returns:
            dict: Processed data in uniform format containing:
                - metadata: Test duration, total requests, unique bugs
                - endpoints: List of endpoint information
                - coverage: Status code distribution and method coverage
                - bugs: List of bug information
        """
        pass

    def generate_dashboard_data(self):
        """Generate data in the format expected by the dashboard.
        
        Returns:
            dict: Data formatted for the dashboard containing:
                - metadata: Test metadata (duration, requests, bugs)
                - endpoints: Endpoint information grouped by path and method
                - stats: Coverage statistics and distributions
        """
        # Get the base report data
        report = self.process_data()
        
        # Transform endpoints into the dashboard format
        endpoints_by_path = {}
        for endpoint in report["endpoints"]:
            path = endpoint["path"]
            method = endpoint["http_method"]
            
            if path not in endpoints_by_path:
                endpoints_by_path[path] = {"path": path, "methods": {}}
            
            if method not in endpoints_by_path[path]["methods"]:
                endpoints_by_path[path]["methods"][method] = []
            
            endpoints_by_path[path]["methods"][method].append({
                "status": str(endpoint["status_code"]),
                "type": endpoint["type"],
                "request": endpoint.get("request_details"),
                "response": endpoint.get("response_data")
            })
        
        # Transform coverage stats into the dashboard format
        coverage = report["coverage"]
        status_dist = coverage["status_distribution"]
        method_cov = coverage["method_coverage"]
        
        dashboard_data = {
            "metadata": report["metadata"],
            "endpoints": list(endpoints_by_path.values()),
            "stats": {
                "statusDistribution": [
                    {"name": "Hits", "value": status_dist["hits"], "color": self.DASHBOARD_COLORS["hits"]},
                    {"name": "Misses", "value": status_dist["misses"], "color": self.DASHBOARD_COLORS["misses"]},
                    {"name": "Unspecified", "value": status_dist["unspecified"], "color": self.DASHBOARD_COLORS["unspecified"]}
                ],
                "methodCoverage": [
                    {
                        "method": method,
                        "hits": stats["hits"],
                        "misses": stats["misses"],
                        "unspecified": stats["unspecified"]
                    }
                    for method, stats in method_cov.items()
                ],
                "statusCodes": [
                    {"status": status, "count": count}
                    for status, count in report["status_codes"].items()
                ]
            }
        }
        
        return dashboard_data

    def save_dashboard_data(self, output_path):
        """Save dashboard data to a JSON file.
        
        Args:
            output_path (str): Path to save the dashboard JSON file
        """
        dashboard_data = self.generate_dashboard_data()
        with open(output_path, 'w') as f:
            json.dump(dashboard_data, f, indent=2)

    @abstractmethod
    def get_metadata_statistics(self):
        """Get metadata statistics about the fuzzing session.
        
        Returns:
            dict: Contains duration, total_requests, unique_bugs, critical_issues
        """
        pass

    @abstractmethod
    def get_endpoint_information(self):
        """Get detailed information about each endpoint.
        
        Returns:
            list: List of dictionaries containing endpoint details
        """
        pass

    @abstractmethod
    def get_coverage_statistics(self):
        """Get coverage statistics.
        
        Returns:
            dict: Contains status_distribution and method_coverage
        """
        pass

    @abstractmethod
    def get_bug_information(self):
        """Get detailed information about bugs.
        
        Returns:
            list: List of dictionaries containing bug details
        """
        pass
