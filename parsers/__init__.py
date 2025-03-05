"""
Fuzzer data parsers package.
Contains parsers for processing fuzzing results from different fuzzers.
"""

# Import only the base parser directly
from .base_parser import BaseFuzzerParser

# Use lazy imports for the specific parsers to avoid circular imports
__all__ = ['BaseFuzzerParser', 'WuppieFuzzParser', 'EvomasterParser', 'RestlerParser']

# Define lazy imports
def __getattr__(name):
    if name == 'WuppieFuzzParser':
        from .wuppiefuzz_parser import WuppieFuzzParser
        return WuppieFuzzParser
    elif name == 'EvomasterParser':
        from .evomaster_parser import EvomasterParser
        return EvomasterParser
    elif name == 'RestlerParser':
        from .restler_parser import RestlerParser
        return RestlerParser
    raise AttributeError(f"module 'parsers' has no attribute '{name}'")