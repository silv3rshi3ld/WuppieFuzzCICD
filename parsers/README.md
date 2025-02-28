# Fuzzer Data Parsers

This directory contains parsers for processing fuzzing results from different fuzzers (Evomaster, Restler, WuppieFuzz). The parsers use a chunking system to handle large JSON data efficiently.

## Architecture

### Base Parser
All parsers inherit from `BaseFuzzerParser` which provides common chunking functionality:
- Metadata processing
- Coverage data handling
- Chunked endpoint processing

### Output Structure
Each parser generates data in the following structure:
```
dashboard/data/[fuzzer]/
  ├── metadata.js      # Basic fuzzer information
  ├── coverage.js      # Coverage statistics
  └── endpoints/       # Chunked endpoint data
      ├── chunk_0.js   # First chunk of endpoints
      ├── chunk_1.js   # Second chunk of endpoints
      └── ...         # Additional chunks as needed
```

## Usage

### Running Parsers as Modules

The parsers in this project are designed to be run as Python modules, not as standalone scripts. This ensures proper package imports and relative path resolution.

#### Running All Parsers

To run all parsers at once:

```bash
python -m parsers
```

#### Running a Specific Parser

To run a specific parser:

```bash
python -m parsers.wuppiefuzz_parser
python -m parsers.restler_parser
python -m parsers.evomaster_parser
```

#### Common Import Errors

If you try to run a parser script directly (e.g., `python parsers/wuppiefuzz_parser.py`), you may encounter import errors like:

```
ModuleNotFoundError: No module named 'parsers'
```

This happens because the script is trying to import from the `parsers` package, but when run directly, Python doesn't recognize it as part of a package. Always use the module approach (`python -m parsers.wuppiefuzz_parser`) to avoid these issues.

### Using Parser Classes Programmatically

Each parser can be used programmatically:

```python
from parsers.wuppiefuzz_parser import WuppieFuzzParser

with WuppieFuzzParser(
    zip_path='output-fuzzers/Wuppiefuzz/fuzzing-report.zip',
    output_dir='dashboard/data/wuppiefuzz',
    chunk_size=100  # Optional, defaults to 100
) as parser:
    parser.process_data()
```

### Chunk Size Configuration
- Default chunk size: 100 endpoints per chunk
- Can be configured per parser instance
- Adjust based on memory constraints and performance needs

## Parser-Specific Details

### WuppieFuzz Parser
- Source: SQLite database (report.db)
- Processes SQL data in chunks
- Handles binary data decoding

### Evomaster Parser
- Source: Python test files
- Processes test cases incrementally
- Extracts metadata from test comments

### Restler Parser
- Source: Multiple JSON files
- Processes bug buckets and response data
- Handles HTTP message parsing

## Error Handling
- Each parser implements robust error handling
- Failed chunks don't stop entire process
- Detailed error logging for debugging

## Performance Considerations
- Memory efficient processing
- Progressive data loading
- Configurable chunk sizes

## Adding New Parsers

1. Create a new parser class inheriting from `BaseFuzzerParser`:
```python
from .base_parser import BaseFuzzerParser

class NewFuzzerParser(BaseFuzzerParser):
    def __init__(self, source_path, output_dir, chunk_size=100):
        super().__init__(output_dir, "NewFuzzer", chunk_size)
        self.source_path = source_path

    def process_metadata(self):
        # Process and write metadata
        metadata = {
            "duration": "...",
            "total_requests": 0,
            "unique_bugs": 0,
            "critical_issues": 0
        }
        self.write_chunked_data(metadata, 'metadata')

    def process_coverage(self):
        # Process and write coverage data
        coverage = {
            "status_distribution": {...},
            "method_coverage": {...}
        }
        self.write_chunked_data(coverage, 'coverage')

    def process_endpoints(self):
        # Process endpoints in chunks
        chunk = []
        for endpoint in self.get_endpoints():
            chunk.append(endpoint)
            if len(chunk) >= self.chunk_size:
                self.write_chunked_data(chunk, f'endpoints/chunk_{len(chunk)}')
                chunk = []
        if chunk:  # Write remaining endpoints
            self.write_chunked_data(chunk, f'endpoints/chunk_{len(chunk)}')
```

2. Implement required methods:
   - `process_metadata()`
   - `process_coverage()`
   - `process_endpoints()`

3. Add error handling and logging

4. Test with various data sizes

5. Update the `__init__.py` file to include your new parser:
```python
from .new_fuzzer_parser import NewFuzzerParser
__all__ = [..., 'NewFuzzerParser']
```

## Frontend Integration
The chunked data structure works with the existing frontend data loader, which supports:
- Progressive loading
- Chunk caching
- Error handling