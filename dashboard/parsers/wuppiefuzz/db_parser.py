"""Parser for WuppieFuzz SQLite database."""

import os
import sqlite3
from datetime import datetime

def parse_crashes_and_issues(db_path):
    """Parse crashes and issues from SQLite database.
    
    Args:
        db_path (str): Path to the report.db SQLite file
        
    Returns:
        dict: Dictionary containing crashes and issues data
        
    Raises:
        FileNotFoundError: If database file doesn't exist
        sqlite3.Error: If database queries fail
    """
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Database file not found at {db_path}")
        
    crashes = []
    issues = []
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get crashes
        cursor.execute("""
            SELECT 
                id,
                timestamp,
                endpoint,
                stack_trace,
                request_data,
                response_data
            FROM crashes
            ORDER BY timestamp DESC
        """)
        
        for row in cursor.fetchall():
            crash = {
                'id': row[0],
                'timestamp': datetime.fromtimestamp(row[1]).isoformat(),
                'endpoint': row[2],
                'stack_trace': row[3],
                'request': row[4],
                'response': row[5],
                'type': 'crash'
            }
            crashes.append(crash)
            
        # Get issues
        cursor.execute("""
            SELECT 
                id,
                timestamp,
                endpoint,
                severity,
                description,
                request_data,
                response_data
            FROM issues
            ORDER BY severity DESC, timestamp DESC
        """)
        
        for row in cursor.fetchall():
            issue = {
                'id': row[0],
                'timestamp': datetime.fromtimestamp(row[1]).isoformat(),
                'endpoint': row[2],
                'severity': row[3],
                'description': row[4],
                'request': row[5],
                'response': row[6],
                'type': 'issue'
            }
            issues.append(issue)
            
    except sqlite3.Error as e:
        raise sqlite3.Error(f"Database error: {str(e)}")
        
    finally:
        if conn:
            conn.close()
            
    return {
        'crashes': crashes,
        'issues': issues,
        'total_crashes': len(crashes),
        'total_issues': len(issues),
        'critical_issues': sum(1 for i in issues if i['severity'] == 'critical')
    }