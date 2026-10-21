import sys
import os
import traceback
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

# Initialize test client and enter lifespan context
test_client = TestClient(app, raise_server_exceptions=False)
try:
    test_client.__enter__()
except Exception as e:
    print(f"Lifespan enter warning: {e}", flush=True)

def dispatch_to_fastapi(handler_instance, method: str):
    try:
        # Determine original requested URL
        matched = (
            handler_instance.headers.get("x-matched-path")
            or handler_instance.headers.get("x-vercel-matched-path")
        )
        path = handler_instance.path
        if matched and (path == "/api" or path == "/api/"):
            path = matched

        if not path.startswith("/api"):
            path = "/api" + path

        headers = dict(handler_instance.headers)
        content_length = int(headers.get("content-length", 0))
        body = handler_instance.rfile.read(content_length) if content_length > 0 else None

        response = test_client.request(
            method=method,
            url=path,
            content=body,
            headers={k: v for k, v in headers.items() if k.lower() not in ["host", "content-length"]},
        )
        body_content = response.content
        status_code = response.status_code
        resp_headers = dict(response.headers)
    except Exception:
        err = traceback.format_exc()
        print("Dispatch error:", err, flush=True)
        body_content = f"FastAPI Serverless Dispatch Error:\n\n{err}".encode("utf-8")
        status_code = 500
        resp_headers = {"content-type": "text/plain; charset=utf-8"}

    handler_instance.send_response(status_code)
    for k, v in resp_headers.items():
        if k.lower() not in ["content-length", "transfer-encoding", "content-encoding"]:
            handler_instance.send_header(k, v)
    handler_instance.send_header("Access-Control-Allow-Origin", "*")
    handler_instance.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
    handler_instance.send_header("Access-Control-Allow-Headers", "*")
    handler_instance.send_header("Content-Length", str(len(body_content)))
    handler_instance.end_headers()
    handler_instance.wfile.write(body_content)

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
