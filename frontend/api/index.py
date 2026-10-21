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

from app.main import app
