import base64
import json
import os
import webbrowser
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
import requests
import subprocess
from dotenv import load_dotenv
import shutil

load_dotenv()

# Get credentials from .env
CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
REDIRECT_URI = 'http://localhost:8080'
AUTH_CODE = None

def check_turso_cli():
    if not shutil.which('turso'):
        print("Error: Turso CLI is not installed.")
        print("\nTo install Turso CLI:")
        if sys.platform == "darwin":  # macOS
            print("Run: brew install tursodatabase/tap/turso")
        elif sys.platform == "linux":
            print("Run: curl -sSfL https://get.tur.so/install.sh | bash")
        elif sys.platform == "win32":
            print("Run: scoop bucket add turso https://github.com/tursodatabase/scoop-bucket.git")
            print("Then: scoop install turso")
        print("\nAfter installing, run 'turso auth login' and try again.")
        sys.exit(1)
    
    try:
        # Test if user is authenticated
        subprocess.run(['turso', 'db', 'list'], check=True, capture_output=True)
    except subprocess.CalledProcessError:
        print("Error: You need to authenticate with Turso first.")
        print("Run: turso auth login")
        sys.exit(1)

class AuthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global AUTH_CODE
        
        # Parse the authorization code from the callback
        if self.path.startswith('/'):
            query_components = parse_qs(urlparse(self.path).query)
            AUTH_CODE = query_components['code'][0]
            
            # Send success response
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b"Authorization successful! You can close this window.")
            
            # Stop the server
            def shutdown():
                self.server.shutdown()
            import threading
            threading.Thread(target=shutdown).start()

    def log_message(self, format, *args):
        # Suppress logging
        return

def get_refresh_token():
    # Start local server to handle the OAuth callback
    server = HTTPServer(('localhost', 8080), AuthHandler)
    
    # Construct authorization URL
    auth_url = (
        'https://accounts.spotify.com/authorize'
        f'?client_id={CLIENT_ID}'
        '&response_type=code'
        f'&redirect_uri={REDIRECT_URI}'
        '&scope=user-top-read%20user-read-recently-played'
    )
    
    print("Opening browser for Spotify authorization...")
    webbrowser.open(auth_url)
    
    # Wait for the callback
    server.serve_forever()
    
    if not AUTH_CODE:
        raise Exception("Failed to get authorization code")
    
    # Exchange authorization code for refresh token
    auth_header = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    
    response = requests.post(
        'https://accounts.spotify.com/api/token',
        headers={
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': f'Basic {auth_header}'
        },
        data={
            'grant_type': 'authorization_code',
            'code': AUTH_CODE,
            'redirect_uri': REDIRECT_URI
        }
    )
    
    if response.status_code != 200:
        raise Exception(f"Token request failed: {response.text}")
    
    return response.json()['refresh_token']

def setup_database():
    print("Creating spotify_token table...")
    create_table_cmd = """
    CREATE TABLE IF NOT EXISTS spotify_token (
        id INTEGER PRIMARY KEY,
        refresh_token TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """
    subprocess.run(['turso', 'db', 'shell', 'spotify'], input=create_table_cmd.encode(), check=True)

def store_refresh_token(refresh_token):
    print("Storing refresh token in database...")
    store_token_cmd = f"""
    DELETE FROM spotify_token;
    INSERT INTO spotify_token (refresh_token) VALUES ('{refresh_token}');
    """
    subprocess.run(['turso', 'db', 'shell', 'spotify'], input=store_token_cmd.encode(), check=True)

def main():
    if not CLIENT_ID or not CLIENT_SECRET:
        raise Exception("Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your .env file")
    
    try:
        check_turso_cli()
        setup_database()
        refresh_token = get_refresh_token()
        store_refresh_token(refresh_token)
        print("Setup completed successfully!")
        
        # Verify the token was stored
        print("\nVerifying token storage...")
        subprocess.run(['turso', 'db', 'shell', 'spotify', 'SELECT * FROM spotify_token;'], check=True)
        
    except Exception as e:
        print(f"Error during setup: {str(e)}")

if __name__ == "__main__":
    main() 