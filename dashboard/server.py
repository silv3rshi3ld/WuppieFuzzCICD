"""Simple HTTP server for serving the dashboard files."""

import http.server
import socketserver
import os
import socket
from typing import Optional

DEFAULT_PORT = 8000
MAX_PORT_ATTEMPTS = 10

class DashboardHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def find_available_port(start_port: int, max_attempts: int) -> Optional[int]:
    """Find an available port starting from start_port.
    
    Args:
        start_port: Port to start trying from
        max_attempts: Maximum number of ports to try
        
    Returns:
        Available port number or None if no port found
    """
    for port in range(start_port, start_port + max_attempts):
        try:
            # Try to create a socket with the port
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                sock.bind(('', port))
                return port
        except OSError:
            continue
    return None

def run_server():
    # Change to the dashboard directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Find an available port
    port = find_available_port(DEFAULT_PORT, MAX_PORT_ATTEMPTS)
    if port is None:
        print(f"\nError: Could not find an available port in range {DEFAULT_PORT}-{DEFAULT_PORT + MAX_PORT_ATTEMPTS - 1}")
        return
    
    try:
        with socketserver.TCPServer(("", port), DashboardHandler) as httpd:
            print(f"\nServing dashboard at http://localhost:{port}")
            print("Press Ctrl+C to stop the server\n")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()
    except Exception as e:
        print(f"\nError starting server: {e}")

if __name__ == '__main__':
    run_server()
