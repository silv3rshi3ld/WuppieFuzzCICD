"""Base parser implementation for fuzzer outputs."""

import logging
import os
import json
from abc import ABC, abstractmethod
from typing import Dict, List, Any

from .json_chunker import JsonChunker
from .json_validator import JsonValidator
from .standardized_types import (
    TestMetadata,
    StandardizedTestCase,
    StandardizedEndpoint,
    ParserOutput
)

class BaseParser(ABC):
    """Abstract base class for all fuzzer parsers."""
    
    def __init__(self, input_path: str, output_dir: str, fuzzer_name: str):
        """Initialize parser.
        
        Args:
            input_path: Path to fuzzer output directory
            output_dir: Directory to save parsed results
            fuzzer_name: Name of the fuzzer (used for directory naming)
        """
        self.input_path = input_path
        self.output_dir = output_dir
        self.fuzzer_name = fuzzer_name
        self.chunker = JsonChunker(output_dir, fuzzer_name)
        self.validator = JsonValidator()
        self.logger = self._setup_logger()

    def parse(self) -> bool:
        """Parse fuzzer results and generate standardized output.
        
        This template method defines the parsing workflow:
        1. Load raw data
        2. Transform to standardized format
        3. Validate output
        4. Save results
        
        Returns:
            bool: True if parsing was successful
        """
        try:
            self.logger.info("Starting %s parsing", self.fuzzer_name)
            
            # Load and validate raw data
            raw_data = self._load_raw_data()
            if not self._validate_raw_data(raw_data):
                return False
            
            # Transform raw data into standardized format
            metadata = self._transform_metadata(raw_data)
            endpoints = self._transform_endpoints(raw_data)
            test_cases = self._transform_test_cases(raw_data)
            
            # Create parser output
            output = ParserOutput(
                metadata=metadata,
                endpoints=endpoints,
                test_cases=test_cases
            )
            
            # Validate output
            if not self._validate_output(output):
                return False
            
            # Save results
            return self._save_output(output)
            
        except (ValueError, IOError, json.JSONDecodeError) as e:
            self._handle_error("Parsing failed", e)
            return False

    @abstractmethod
    def _load_raw_data(self) -> Dict[str, Any]:
        """Load raw data from fuzzer output.
        
        Returns:
            Dict containing raw fuzzer output data
            
        Raises:
            FileNotFoundError: If required files are missing
            json.JSONDecodeError: If JSON parsing fails
            ValueError: If data is invalid
        """
        raise NotImplementedError

    @abstractmethod
    def _transform_metadata(self, raw_data: Dict[str, Any]) -> TestMetadata:
        """Transform fuzzer metadata to standard format.
        
        Args:
            raw_data: Raw fuzzer output data
            
        Returns:
            Standardized test metadata
            
        Raises:
            ValueError: If metadata transformation fails
        """
        raise NotImplementedError

    @abstractmethod
    def _transform_endpoints(self, raw_data: Dict[str, Any]) -> List[StandardizedEndpoint]:
        """Transform endpoint data to standard format.
        
        Args:
            raw_data: Raw fuzzer output data
            
        Returns:
            List of standardized endpoints
            
        Raises:
            ValueError: If endpoint transformation fails
        """
        raise NotImplementedError

    @abstractmethod
    def _transform_test_cases(self, raw_data: Dict[str, Any]) -> List[StandardizedTestCase]:
        """Transform test cases to standard format.
        
        Args:
            raw_data: Raw fuzzer output data
            
        Returns:
            List of standardized test cases
            
        Raises:
            ValueError: If test case transformation fails
        """
        raise NotImplementedError

    def _validate_raw_data(self, data: Dict[str, Any]) -> bool:
        """Validate raw data structure.
        
        Args:
            data: Raw data to validate
            
        Returns:
            bool: True if data is valid
        """
        try:
            if not isinstance(data, dict):
                raise ValueError("Raw data must be a dictionary")
            return True
        except ValueError as e:
            self._handle_error("Raw data validation failed", e)
            return False

    def _validate_output(self, output: ParserOutput) -> bool:
        """Validate standardized output.
        
        Args:
            output: Standardized parser output to validate
            
        Returns:
            bool: True if output is valid
        """
        try:
            # Validate metadata
            if not output.metadata.timestamp:
                raise ValueError("Missing timestamp in metadata")
            if output.metadata.total_requests < 0:
                raise ValueError("Invalid total_requests count")
                
            # Validate endpoints
            endpoint_paths = set()
            for endpoint in output.endpoints:
                if not endpoint.path:
                    raise ValueError("Missing endpoint path")
                if not endpoint.method:
                    raise ValueError("Missing HTTP method")
                endpoint_paths.add((endpoint.path, endpoint.method))
                
            # Validate test cases
            for test_case in output.test_cases:
                if not test_case.id:
                    raise ValueError("Missing test case ID")
                if not test_case.request.method:
                    raise ValueError("Missing HTTP method in request")
                if not test_case.request.path:
                    raise ValueError("Missing path in request")
                if test_case.response.status_code <= 0:
                    raise ValueError("Invalid status code in response")
                    
            return True
            
        except ValueError as e:
            self._handle_error("Output validation failed", e)
            return False

    def _save_output(self, output: ParserOutput) -> bool:
        """Save standardized output using chunker.
        
        Args:
            output: Standardized parser output to save
            
        Returns:
            bool: True if save was successful
        """
        try:
            # Save metadata
            self.chunker.save_metadata(output.metadata.to_dict())
            
            # Save endpoints in chunks
            self.chunker.chunk_endpoints([ep.to_dict() for ep in output.endpoints])
            
            # Save test cases in chunks
            self.chunker.chunk_test_cases([tc.to_dict() for tc in output.test_cases])
            
            return True
            
        except (IOError, json.JSONDecodeError) as e:
            self._handle_error("Failed to save output", e)
            return False

    def _setup_logger(self) -> logging.Logger:
        """Configure parser-specific logger.
        
        Returns:
            Configured logger instance
        """
        logger = logging.getLogger(self.__class__.__name__)
        handler = logging.FileHandler(
            os.path.join(self.output_dir, f"{self.fuzzer_name.lower()}.log")
        )
        handler.setFormatter(
            logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        )
        logger.addHandler(handler)
        return logger

    def _handle_error(self, message: str, error: Exception) -> None:
        """Standardized error handling.
        
        Args:
            message: Error message
            error: Exception instance
        """
        error_details = {
            "message": message,
            "error_type": type(error).__name__,
            "error_message": str(error)
        }
        self.logger.error(json.dumps(error_details, indent=2))