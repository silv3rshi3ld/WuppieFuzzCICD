"""Simple HTTP server for serving the dashboard files."""

import http.server
import socketserver
import os

PORT = 8000

class DashboardHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server():
    # Change to the dashboard directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), DashboardHandler) as httpd:
        print(f"\nServing dashboard at http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server\n")
        httpd.serve_forever()

if __name__ == '__main__':
    run_server()
