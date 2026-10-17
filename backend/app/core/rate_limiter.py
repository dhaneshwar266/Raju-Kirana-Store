from datetime import datetime, timedelta, timezone
from collections import defaultdict
from typing import Dict, List
from fastapi import HTTPException, status, Request

# In-memory rate limiting for authentication attempts: IP -> list of timestamps
_login_attempts: Dict[str, List[datetime]] = defaultdict(list)
MAX_ATTEMPTS = 5
WINDOW_MINUTES = 15


def check_login_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(minutes=WINDOW_MINUTES)

    # Filter out timestamps older than the window
    attempts = [t for t in _login_attempts[client_ip] if t > cutoff]
    _login_attempts[client_ip] = attempts

    if len(attempts) >= MAX_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please try again after 15 minutes.",
        )


def record_failed_attempt(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    _login_attempts[client_ip].append(datetime.now(timezone.utc))


def reset_attempts(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    if client_ip in _login_attempts:
        del _login_attempts[client_ip]
