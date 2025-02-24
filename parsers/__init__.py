"""
Fuzzer data parsers package.
Contains parsers for processing fuzzing results from different fuzzers.
"""

from .base_parser import BaseFuzzerParser
from .wuppiefuzz_parser import WuppieFuzzParser
from .evomaster_parser import EvomasterParser
from .restler_parser import RestlerParser

__all__ = ['BaseFuzzerParser', 'WuppieFuzzParser', 'EvomasterParser', 'RestlerParser']