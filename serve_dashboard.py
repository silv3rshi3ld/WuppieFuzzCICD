import http.server
import socketserver
import os
import webbrowser
from urllib.parse import urlparse

# Configuration
PORT = 8000
DIRECTORY = "dashboard"

class DashboardHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler for the dashboard server."""
    
    def __init__(self, *args, **kwargs):
        # Set the directory to serve files from
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def do_GET(self):
        """Handle GET requests."""
        # Redirect root to index.html
        if self.path == '/':
            self.path = '/index.html'
        
        # Handle the request
        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def log_message(self, format, *args):
        """Log messages with a timestamp."""
        print(f"[{self.log_date_time_string()}] {args[0]} {args[1]} {args[2]}")

def main():
    """Main function to start the server."""
    # Change to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Ensure the dashboard directory exists
    if not os.path.exists(DIRECTORY):
        print(f"Error: Directory '{DIRECTORY}' not found.")
        return
    
    # Create the server
    handler = DashboardHandler
    httpd = socketserver.TCPServer(("", PORT), handler)
    
    # Print server information
    print(f"Starting dashboard server at http://localhost:{PORT}")
    print(f"Serving files from '{DIRECTORY}' directory")
    print("Press Ctrl+C to stop the server")
    
    # Open the browser
    webbrowser.open(f"http://localhost:{PORT}")
    
    # Start the server
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.shutdown()

if __name__ == "__main__":
    main()