import sys
import os
from http.server import BaseHTTPRequestHandler

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_candidates = [
    os.path.join(current_dir, "backend"),
    os.path.join(current_dir, "..", "backend"),
    os.path.join(current_dir, "..", "frontend", "backend"),
]
for b in backend_candidates:
    if os.path.exists(b) and b not in sys.path:
        sys.path.insert(0, b)

from app.main import app
from fastapi.testclient import TestClient

# Pre-initialize test client with app lifespan
test_client = TestClient(app)

def dispatch_to_fastapi(handler_instance, method: str):
    # Determine the target endpoint path
    path = handler_instance.path
    if not path.startswith("/api"):
        path = "/api" + path

    headers = dict(handler_instance.headers)
    content_length = int(headers.get("content-length", 0))
    body = handler_instance.rfile.read(content_length) if content_length > 0 else None

    # Forward to FastAPI app via TestClient
    response = test_client.request(
        method=method,
        url=path,
        content=body,
        headers={k: v for k, v in headers.items() if k.lower() not in ["host", "content-length"]},
    )

    handler_instance.send_response(response.status_code)
    for k, v in response.headers.items():
        if k.lower() not in ["content-length", "transfer-encoding", "content-encoding"]:
            handler_instance.send_header(k, v)
    handler_instance.send_header("Access-Control-Allow-Origin", "*")
    handler_instance.send_header("Content-Length", str(len(response.content)))
    handler_instance.end_headers()
    handler_instance.wfile.write(response.content)

class handler(BaseHTTPRequestHandler):
    def do_GET(self): dispatch_to_fastapi(self, "GET")
    def do_POST(self): dispatch_to_fastapi(self, "POST")
    def do_PUT(self): dispatch_to_fastapi(self, "PUT")
    def do_DELETE(self): dispatch_to_fastapi(self, "DELETE")
    def do_PATCH(self): dispatch_to_fastapi(self, "PATCH")
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Content-Length", "0")
        self.end_headers()
