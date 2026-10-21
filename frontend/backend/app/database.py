import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool
from app.config import settings

db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

is_serverless = bool(os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"))

from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

# On serverless (Vercel), use pure-Python pg8000 to avoid missing libpq C-library crashes
if db_url.startswith("postgresql://") and "+pg8000" not in db_url:
    if is_serverless:
        db_url = db_url.replace("postgresql://", "postgresql+pg8000://", 1)
    else:
        try:
            import psycopg2
        except Exception:
            db_url = db_url.replace("postgresql://", "postgresql+pg8000://", 1)

# Clean up libpq-only parameters that pg8000 does not accept
if "+pg8000" in db_url:
    try:
        parsed = urlparse(db_url)
        q = parse_qs(parsed.query)
        unsupported = ["channel_binding", "endpoint", "sslrootcert"]
        for param in unsupported:
            q.pop(param, None)
        db_url = urlunparse(parsed._replace(query=urlencode(q, doseq=True)))
    except Exception as e:
        print(f"URL sanitize warning: {e}", flush=True)

connect_args = {}
engine_kwargs = {}

if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False
else:
    engine_kwargs["pool_pre_ping"] = True
    if is_serverless:
        engine_kwargs["poolclass"] = NullPool

engine = create_engine(
    db_url,
    connect_args=connect_args,
    **engine_kwargs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
