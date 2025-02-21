"""Dashboard parsers package."""

from .generate_dashboards import (
    save_fuzzer_data,
    generate_fuzzer_page,
    generate_summary,
    generate_index_page,
    main
)

__all__ = [
    'save_fuzzer_data',
    'generate_fuzzer_page',
    'generate_summary',
    'generate_index_page',
    'main'
]
