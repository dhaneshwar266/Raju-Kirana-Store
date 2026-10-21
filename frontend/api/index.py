import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
root_candidates = [
    os.path.abspath(os.path.join(current_dir, "..")),
    os.path.abspath(os.path.join(current_dir, "..", "..")),
    current_dir,
]

for r in root_candidates:
    backend_path = os.path.join(r, "backend")
    if os.path.exists(backend_path) and backend_path not in sys.path:
        sys.path.insert(0, backend_path)
    if os.path.exists(r) and r not in sys.path:
        sys.path.insert(0, r)

import traceback

try:
    from app.main import app
except Exception as e:
    err_tb = traceback.format_exc()
    print("FATAL IMPORT ERROR IN frontend/api/index.py:", err_tb, flush=True)
    try:
        from fastapi import FastAPI, Response
        app = FastAPI()
        @app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
        async def catch_all(full_path: str):
            return Response(content=f"Backend Startup Exception:\n\n{err_tb}", media_type="text/plain", status_code=500)
    except Exception:
        def app(environ, start_response):
            data = f"Backend Startup Exception:\n\n{err_tb}".encode("utf-8")
            start_response("500 Internal Server Error", [
                ("Content-Type", "text/plain; charset=utf-8"),
                ("Content-Length", str(len(data)))
            ])
            return [data]
