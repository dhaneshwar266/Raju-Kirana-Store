from http.server import BaseHTTPRequestHandler
import sys
import os
import traceback

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
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
            msg = f"SUCCESS: Imported app {app}"
            status = 200
        except Exception:
            msg = f"ERROR:\n{traceback.format_exc()}"
            status = 500

        self.send_response(status)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(msg.encode('utf-8'))
