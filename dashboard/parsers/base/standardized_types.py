"""Standardized data types for parser outputs."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Any

@dataclass
class StandardizedRequest:
    """Common request format across all parsers."""
    method: str
    path: str
    headers: Dict[str, str] = field(default_factory=dict)
    body: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert request to dictionary format.
        
        Returns:
            Dict containing request data
        """
        return {
            'method': self.method,
            'path': self.path,
            'headers': self.headers,
            'body': self.body
        }

@dataclass
class StandardizedResponse:
    """Common response format across all parsers."""
    status_code: int
    headers: Dict[str, str] = field(default_factory=dict)
    body: Optional[str] = None
    error_type: Optional[str] = None  # Basic error categorization

    def to_dict(self) -> Dict[str, Any]:
        """Convert response to dictionary format.
        
        Returns:
            Dict containing response data
        """
        return {
            'status_code': self.status_code,
            'headers': self.headers,
            'body': self.body,
            'error_type': self.error_type
        }

@dataclass
class TestMetadata:
    """Common test metadata across all parsers."""
    timestamp: datetime
    total_requests: int = 0
    success_count: int = 0
    failure_count: int = 0
    fuzzer_info: Dict[str, Any] = field(default_factory=lambda: {
        'name': '',
        'duration': '0',
        'critical_issues': 0
    })
    summary: Dict[str, Any] = field(default_factory=lambda: {
        'endpoints_tested': 0,
        'success_rate': 0.0,
        'coverage': {
            'lines': 0,
            'functions': 0,
            'branches': 0,
            'statements': 0
        }
    })

    def to_dict(self) -> Dict[str, Any]:
        """Convert metadata to dictionary format.
        
        Returns:
            Dict containing metadata
        """
        return {
            'timestamp': self.timestamp.isoformat(),
            'total_requests': self.total_requests,
            'success_count': self.success_count,
            'failure_count': self.failure_count,
            'fuzzer_info': self.fuzzer_info,
            'summary': self.summary
        }

@dataclass
class EndpointStatistics:
    """Statistics for a specific endpoint."""
    total_requests: int = 0
    success_count: int = 0
    failure_count: int = 0
    success_rate: float = 0.0
    status_codes: Dict[str, int] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert statistics to dictionary format.
        
        Returns:
            Dict containing statistics
        """
        return {
            'total_requests': self.total_requests,
            'success_count': self.success_count,
            'failure_count': self.failure_count,
            'success_rate': self.success_rate,
            'status_codes': self.status_codes
        }

@dataclass
class StandardizedTestCase:
    """Standardized test case format."""
    id: str
    name: str
    request: StandardizedRequest
    response: StandardizedResponse
    timestamp: Optional[datetime] = None
    type: str = 'unspecified'  # 'success', 'fault', or 'unspecified'

    def to_dict(self) -> Dict[str, Any]:
        """Convert test case to dictionary format.
        
        Returns:
            Dict containing test case data
        """
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'request': self.request.to_dict(),
            'response': self.response.to_dict()
        }

@dataclass
class StandardizedEndpoint:
    """Standardized endpoint information."""
    path: str
    method: str
    statistics: EndpointStatistics = field(default_factory=EndpointStatistics)
    test_cases: List[StandardizedTestCase] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        """Convert endpoint to dictionary format.
        
        Returns:
            Dict containing endpoint data
        """
        return {
            'path': self.path,
            'method': self.method,
            'statistics': self.statistics.to_dict(),
            'test_cases': [tc.to_dict() for tc in self.test_cases]
        }

@dataclass
class ParserOutput:
    """Complete standardized parser output."""
    metadata: TestMetadata
    endpoints: List[StandardizedEndpoint]
    test_cases: List[StandardizedTestCase]

    def to_dict(self) -> Dict[str, Any]:
        """Convert complete output to dictionary format.
        
        Returns:
            Dict containing all parser output data
        """
        return {
            'metadata': self.metadata.to_dict(),
            'endpoints': [ep.to_dict() for ep in self.endpoints],
            'test_cases': [tc.to_dict() for tc in self.test_cases]
        }