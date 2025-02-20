"""Dashboard parsers package."""

from .wuppiefuzz.parser import parse_wuppiefuzz_results
from .restler.parser import parse_restler_results
from .evomaster.parser import parse_evomaster_results

__all__ = [
    'parse_wuppiefuzz_results',
    'parse_restler_results',
    'parse_evomaster_results'
]
