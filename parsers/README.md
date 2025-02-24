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

### Running a Parser
Each parser can be run independently:

```python
from parsers.wuppiefuzz_parser import WuppieFuzzParser

with WuppieFuzzParser(
    zip_path='output-fuzzers/Wuppiefuzz/fuzzing-report.zip',
    output_dir='dashboard',
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

## Frontend Integration
The chunked data structure works with the existing frontend data loader, which supports:
- Progressive loading
- Chunk caching
- Error handling