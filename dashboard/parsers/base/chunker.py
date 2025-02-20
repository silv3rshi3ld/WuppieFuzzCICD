"""Base chunker for handling large datasets."""

import os
import json

class BaseChunker:
    def __init__(self, chunk_size=50):
        self.chunk_size = chunk_size
    
    def save_metadata(self, metadata, output_dir, fuzzer_name=None):
        """Save metadata as both JSON and JavaScript."""
        # Use fuzzer_name if provided, otherwise use directory name
        var_prefix = fuzzer_name or os.path.basename(output_dir)
        
        # Save JSON version
        with open(os.path.join(output_dir, 'metadata.json'), 'w') as f:
            json.dump(metadata, f, indent=2)
        
        # Save JavaScript version
        with open(os.path.join(output_dir, 'metadata.js'), 'w') as f:
            f.write(f'window.{var_prefix}Metadata = {json.dumps(metadata, indent=2)};')
    
    def save_coverage(self, coverage, output_dir, fuzzer_name=None):
        """Save coverage data as both JSON and JavaScript."""
        # Use fuzzer_name if provided, otherwise use directory name
        var_prefix = fuzzer_name or os.path.basename(output_dir)
        
        # Save JSON version
        with open(os.path.join(output_dir, 'coverage.json'), 'w') as f:
            json.dump(coverage, f, indent=2)
        
        # Save JavaScript version
        with open(os.path.join(output_dir, 'coverage.js'), 'w') as f:
            f.write(f'window.{var_prefix}Coverage = {json.dumps(coverage, indent=2)};')
    
    def chunk_endpoints(self, endpoints, output_dir, fuzzer_name=None):
        """Split endpoints into chunks and save as both JSON and JavaScript."""
        # Use fuzzer_name if provided, otherwise use directory name
        var_prefix = fuzzer_name or os.path.basename(output_dir)
        
        total_items = len(endpoints)
        total_chunks = (total_items + self.chunk_size - 1) // self.chunk_size
        
        for i in range(total_chunks):
            start = i * self.chunk_size
            end = min(start + self.chunk_size, total_items)
            chunk = endpoints[start:end]
            
            # Save JSON version
            with open(os.path.join(output_dir, f'endpoints_{i}.json'), 'w') as f:
                json.dump(chunk, f, indent=2)
            
            # Save JavaScript version
            with open(os.path.join(output_dir, f'endpoints_{i}.js'), 'w') as f:
                f.write(f'window.{var_prefix}Endpoints{i} = {json.dumps(chunk, indent=2)};')
        
        return {
            'total_items': total_items,
            'total_chunks': total_chunks
        }
