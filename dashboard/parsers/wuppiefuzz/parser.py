import sqlite3
import zipfile
import json
from datetime import datetime
import os
import tempfile
import shutil
from ..base import BaseParser

class WuppieFuzzParser(BaseParser):
    def __init__(self, zip_path):
        self.zip_path = zip_path
        self.temp_dir = None
        self.db_path = None
        self.conn = None
        self.cursor = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.conn:
            self.conn.close()
        if self.temp_dir and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)

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
        self.conn = sqlite3.connect(self.db_path)
        self.cursor = self.conn.cursor()

    def get_metadata_statistics(self):
        """Get metadata statistics about the fuzzing session."""
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
        # Handle ISO format with timezone
        start = datetime.strptime(start_time.split('.')[0], '%Y-%m-%dT%H:%M:%S')
        end = datetime.strptime(end_time.split('.')[0], '%Y-%m-%dT%H:%M:%S')
        duration = end - start
        
        return {
            "duration": str(duration),
            "total_requests": total_requests,
            "unique_bugs": critical_issues,  # Using 500+ status codes as bugs
            "critical_issues": critical_issues
        }

    def decode_if_bytes(self, value):
        """Decode bytes to string, handle None values."""
        if isinstance(value, bytes):
            try:
                return value.decode('utf-8')
            except UnicodeDecodeError:
                return str(value)
        return value if value is not None else ""

    def get_endpoint_information(self):
        """Get detailed information about each endpoint."""
        query = """
        SELECT 
            r.path,
            r.type as http_method,
            resp.status,
            r.data as request_details,
            r.body as response_data,
            CASE 
                WHEN resp.status BETWEEN 200 AND 299 THEN 'hit'
                WHEN resp.status >= 400 THEN 'miss'
                ELSE 'unspecified'
            END as result_type
        FROM requests r
        LEFT JOIN responses resp ON r.id = resp.reqid
        """
        self.cursor.execute(query)
        endpoints = []
        for row in self.cursor.fetchall():
            endpoints.append({
                "path": self.decode_if_bytes(row[0]),
                "http_method": self.decode_if_bytes(row[1]),
                "status_code": row[2],
                "type": self.decode_if_bytes(row[5]),
                "request_details": self.decode_if_bytes(row[3]),
                "response_data": self.decode_if_bytes(row[4])
            })
        return endpoints

    def get_coverage_statistics(self):
        """Get coverage statistics."""
        # Status distribution
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
        
        # Method coverage
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
        
        return {
            "status_distribution": {
                "hits": status_dist.get("hits", 0),
                "misses": status_dist.get("misses", 0),
                "unspecified": status_dist.get("unspecified", 0)
            },
            "method_coverage": method_coverage
        }

    def get_status_code_distribution(self):
        """Get distribution of HTTP status codes."""
        query = """
        SELECT status, COUNT(*) as count
        FROM responses
        GROUP BY status
        """
        self.cursor.execute(query)
        distribution = {
            "200": 0, "401": 0, "404": 0, "500": 0, "204": 0
        }
        for status, count in self.cursor.fetchall():
            if str(status) in distribution:
                distribution[str(status)] = count
        return distribution

    def get_kpi(self):
        """Get Key Performance Indicators."""
        query = """
        SELECT 
            COUNT(*) as total_requests,
            COUNT(DISTINCT CASE WHEN resp.status >= 500 THEN r.id END) as critical_errors,
            COUNT(DISTINCT r.path) as unique_endpoints,
            CAST(COUNT(CASE WHEN resp.status BETWEEN 200 AND 299 THEN 1 END) AS FLOAT) / 
            CAST(COUNT(*) AS FLOAT) * 100 as success_rate
        FROM requests r
        LEFT JOIN responses resp ON r.id = resp.reqid
        """
        self.cursor.execute(query)
        total, critical, unique, success_rate = self.cursor.fetchone()
        return {
            "total_requests": total,
            "critical_errors": critical,
            "unique_endpoints": unique,
            "success_rate": round(success_rate, 2) if success_rate else 0.0
        }

    def get_bug_information(self):
        """Get detailed information about bugs (500+ status codes)."""
        query = """
        SELECT 
            resp.status,
            r.path,
            r.type as method,
            CASE 
                WHEN resp.status BETWEEN 200 AND 299 THEN 'hit'
                WHEN resp.status >= 400 THEN 'miss'
                ELSE 'unspecified'
            END as result_type,
            r.data as request_details,
            r.body as response_details
        FROM requests r
        JOIN responses resp ON r.id = resp.reqid
        WHERE resp.status >= 500
        """
        self.cursor.execute(query)
        bugs = []
        for row in self.cursor.fetchall():
            # Decode any bytes objects and handle None values
            bugs.append({
                "status_code": row[0],
                "endpoint": self.decode_if_bytes(row[1]),
                "method": self.decode_if_bytes(row[2]),
                "type": self.decode_if_bytes(row[3]),
                "request": self.decode_if_bytes(row[4]),
                "response": self.decode_if_bytes(row[5])
            })
        return bugs

    def process_data(self):
        """Process all data and generate the final report."""
        try:
            self.extract_zip()
            self.connect_db()
            
            report = {
                "metadata": self.get_metadata_statistics(),
                "endpoints": self.get_endpoint_information(),
                "coverage": self.get_coverage_statistics(),
                "status_codes": self.get_status_code_distribution(),
                "kpi": self.get_kpi(),
                "bugs": self.get_bug_information()
            }
            
            return report
        finally:
            if self.conn:
                self.conn.close()
            if self.temp_dir and os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)

def parse_wuppiefuzz_results(zip_path, output_path=None):
    """
    Parse WuppieFuzz results and optionally save to a file.
    
    Args:
        zip_path (str): Path to the WuppieFuzz results zip file
        output_path (str, optional): Path to save the JSON report
    
    Returns:
        dict: Parsed results in standardized format
    """
    with WuppieFuzzParser(zip_path) as parser:
        report = parser.process_data()
        
        if output_path:
            with open(output_path, 'w') as f:
                json.dump(report, f, indent=2)
        
        return report
