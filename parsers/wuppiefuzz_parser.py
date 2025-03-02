import sqlite3
import zipfile
import json
from datetime import datetime
import os
import tempfile
import shutil
from .base_parser import BaseFuzzerParser

class WuppieFuzzParser(BaseFuzzerParser):
    def __init__(self, zip_path, output_dir, chunk_size=100):
        """
        Initialize the WuppieFuzz parser.
        
        Args:
            zip_path (str): Path to the zip file containing WuppieFuzz results
            output_dir (str): Directory where the chunked output will be written
            chunk_size (int): Number of endpoints per chunk
        """
        super().__init__(output_dir, "WuppieFuzz", chunk_size)
        self.zip_path = zip_path
        self.temp_dir = None
        self.db_path = None
        self.conn = None
        self.cursor = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cleanup()

    def cleanup(self):
        """Clean up resources."""
        if self.cursor:
            self.cursor.close()
            self.cursor = None
        if self.conn:
            self.conn.close()
            self.conn = None
        if self.temp_dir and os.path.exists(self.temp_dir):
            try:
                shutil.rmtree(self.temp_dir)
                self.temp_dir = None
            except Exception as e:
                print(f"Warning: Error cleaning up temporary directory: {e}")

    def extract_zip(self):
        """Extract the zip file to a temporary directory."""
        self.temp_dir = tempfile.mkdtemp()
        with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
            zip_ref.extractall(self.temp_dir)
        
        # Find the report.db file
        for root, _, files in os.walk(self.temp_dir):
            if 'report.db' in files:
                self.db_path = os.path.join(root, 'report.db')
                break
        
        if not self.db_path:
            raise FileNotFoundError("report.db not found in zip file")

    def connect_db(self):
        """Connect to the SQLite database."""
        if self.conn:
            self.cleanup()
        self.conn = sqlite3.connect(self.db_path)
        self.cursor = self.conn.cursor()

    def process_metadata(self):
        """Process and write metadata."""
        query = """
        SELECT 
            MIN(r.timestamp) as start_time,
            MAX(r.timestamp) as end_time,
            COUNT(*) as total_requests,
            COUNT(DISTINCT CASE WHEN resp.status >= 500 THEN r.id END) as critical_issues
        FROM requests r
        LEFT JOIN responses resp ON r.id = resp.reqid
        """
        self.cursor.execute(query)
        start_time, end_time, total_requests, critical_issues = self.cursor.fetchone()
        
        # Calculate duration
        start = datetime.strptime(start_time.split('.')[0], '%Y-%m-%dT%H:%M:%S')
        end = datetime.strptime(end_time.split('.')[0], '%Y-%m-%dT%H:%M:%S')
        duration = end - start
        
        metadata = {
            "duration": str(duration),
            "total_requests": total_requests,
            "unique_bugs": critical_issues,
            "critical_issues": critical_issues
        }
        
        self.write_chunked_data(metadata, 'metadata')

    def process_coverage(self):
        """Process and write coverage data."""
        # Status distribution query
        query = """
        SELECT 
            CASE 
                WHEN resp.status BETWEEN 200 AND 299 THEN 'hits'
                WHEN resp.status >= 400 THEN 'misses'
                ELSE 'unspecified'
            END as result_type,
            COUNT(*) as count
        FROM requests r
        LEFT JOIN responses resp ON r.id = resp.reqid
        GROUP BY 
            CASE 
                WHEN resp.status BETWEEN 200 AND 299 THEN 'hits'
                WHEN resp.status >= 400 THEN 'misses'
                ELSE 'unspecified'
            END
        """
        self.cursor.execute(query)
        status_dist = dict(self.cursor.fetchall())
        
        # Method coverage query
        query = """
        SELECT 
            r.type as method,
            CASE 
                WHEN resp.status BETWEEN 200 AND 299 THEN 'hits'
                WHEN resp.status >= 400 THEN 'misses'
                ELSE 'unspecified'
            END as result_type,
            COUNT(*) as count
        FROM requests r
        LEFT JOIN responses resp ON r.id = resp.reqid
        GROUP BY r.type, 
            CASE 
                WHEN resp.status BETWEEN 200 AND 299 THEN 'hits'
                WHEN resp.status >= 400 THEN 'misses'
                ELSE 'unspecified'
            END
        """
        self.cursor.execute(query)
        method_coverage = {}
        for method, result_type, count in self.cursor.fetchall():
            if method not in method_coverage:
                method_coverage[method] = {"hits": 0, "misses": 0, "unspecified": 0}
            method_coverage[method][result_type] = count
        
        # Status codes query
        query = """
        SELECT 
            resp.status,
            COUNT(*) as count
        FROM requests r
        LEFT JOIN responses resp ON r.id = resp.reqid
        WHERE resp.status IS NOT NULL
        GROUP BY resp.status
        """
        self.cursor.execute(query)
        status_codes = []
        for status, count in self.cursor.fetchall():
            # Add each status code to the list count times
            status_codes.extend([status] * count)
        
        coverage_data = {
            "status_distribution": {
                "hits": status_dist.get("hits", 0),
                "misses": status_dist.get("misses", 0),
                "unspecified": status_dist.get("unspecified", 0)
            },
            "method_coverage": method_coverage,
            "status_codes": status_codes
        }
        
        self.write_chunked_data(coverage_data, 'coverage')

    def decode_if_bytes(self, value):
        """Decode bytes to string, handle None values."""
        if isinstance(value, bytes):
            try:
                return value.decode('utf-8')
            except UnicodeDecodeError:
                return str(value)
        return value if value is not None else ""

    def process_endpoints(self):
        """Process and write endpoint data in chunks."""
        query = """
        SELECT 
            r.path,
            r.type as http_method,
            resp.status,
            r.data as request_details,
            r.body as response_data
        FROM requests r
        LEFT JOIN responses resp ON r.id = resp.reqid
        """
        
        self.cursor.execute(query)
        chunk_count = 0
        
        while True:
            rows = self.cursor.fetchmany(self.chunk_size)
            if not rows:
                break
                
            chunk = []
            for row in rows:
                endpoint_info = {
                    "path": self.decode_if_bytes(row[0]),
                    "http_method": self.decode_if_bytes(row[1]),
                    "status_code": row[2],
                    "type": "hit" if row[2] and 200 <= row[2] < 300 else "miss",
                    "request_details": self.decode_if_bytes(row[3]),
                    "response_data": self.decode_if_bytes(row[4]),
                }
                chunk.append(endpoint_info)
            
            # Write this chunk
            self.write_chunked_data(chunk, f'endpoints/chunk_{chunk_count}')
            chunk_count += 1

    def process_data(self):
        """Process all data in chunks."""
        try:
            self.extract_zip()
            self.connect_db()
            
            # Process each data type
            self.process_metadata()
            self.process_coverage()
            self.process_endpoints()
            
        finally:
            self.cleanup()

# Add this main block to handle direct execution
if __name__ == "__main__":
    import os
    import sys
    
    # Get the base directory (project root)
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = os.path.join(base_dir, 'dashboard', 'data')
    
    # Set up the parser with the correct paths
    zip_path = os.path.join(base_dir, 'output-fuzzers', 'Wuppiefuzz', 'fuzzing-report.zip')
    parser = WuppieFuzzParser(zip_path, os.path.join(output_dir, 'wuppiefuzz'))
    
    try:
        # Process the data
        parser.process_data()
        print("WuppieFuzz data processed successfully")
    except Exception as e:
        print(f"Error processing WuppieFuzz data: {e}")
        sys.exit(1)
