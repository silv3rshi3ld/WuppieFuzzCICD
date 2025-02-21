"""Base chunker for handling large datasets."""

import os
import json

class BaseChunker:
    def __init__(self, chunk_size=50):
        self.chunk_size = chunk_size

    def save_metadata(self, metadata, output_dir, fuzzer_name):
        """Save metadata in both JSON and JS formats."""
        # Save JSON
        with open(os.path.join(output_dir, 'metadata.json'), 'w') as f:
            json.dump(metadata, f, indent=2)
            
        # Save JS
        with open(os.path.join(output_dir, 'metadata.js'), 'w') as f:
            f.write(f'window.{fuzzer_name}Metadata = {json.dumps(metadata, indent=2)};')

    def save_coverage(self, coverage_data, output_dir, fuzzer_name):
        """Save coverage data in both JSON and JS formats."""
        # Save JSON
        with open(os.path.join(output_dir, 'coverage.json'), 'w') as f:
            json.dump(coverage_data, f, indent=2)
            
        # Save JS
        with open(os.path.join(output_dir, 'coverage.js'), 'w') as f:
            f.write(f'window.{fuzzer_name}Coverage = {json.dumps(coverage_data, indent=2)};')

    def save_data(self, data, output_dir, fuzzer_name):
        """Save general data in both JSON and JS formats."""
        # Save JSON
        with open(os.path.join(output_dir, 'data.json'), 'w') as f:
            json.dump(data, f, indent=2)
            
        # Save JS
        with open(os.path.join(output_dir, 'data.js'), 'w') as f:
            f.write(f'window.{fuzzer_name}Data = {json.dumps(data, indent=2)};')

    def chunk_endpoints(self, endpoints, output_dir, fuzzer_name):
        """Chunk endpoints data and save in both JSON and JS formats."""
        total_items = len(endpoints)
        total_chunks = (total_items + self.chunk_size - 1) // self.chunk_size
        
        for i in range(total_chunks):
            start = i * self.chunk_size
            end = min(start + self.chunk_size, total_items)
            chunk = endpoints[start:end]
            
            # Save JSON
            with open(os.path.join(output_dir, f'endpoints_{i}.json'), 'w') as f:
                json.dump(chunk, f, indent=2)
                
            # Save JS
            with open(os.path.join(output_dir, f'endpoints_{i}.js'), 'w') as f:
                f.write(f'window.{fuzzer_name}Endpoints{i} = {json.dumps(chunk, indent=2)};')
                
        return {
            'total_items': total_items,
            'total_chunks': total_chunks
        }

    def save_endpoints_meta(self, endpoints_meta, output_dir, fuzzer_name):
        """Save endpoints metadata in both JSON and JS formats."""
        # Save JSON
        with open(os.path.join(output_dir, 'endpoints_meta.json'), 'w') as f:
            json.dump(endpoints_meta, f, indent=2)
            
        # Save JS
        with open(os.path.join(output_dir, 'endpoints_meta.js'), 'w') as f:
            f.write(f'window.{fuzzer_name}EndpointsMeta = {json.dumps(endpoints_meta, indent=2)};')
