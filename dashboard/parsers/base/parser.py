from abc import ABC, abstractmethod

class BaseParser(ABC):
    """Abstract base class for fuzzer result parsers."""
    
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
