import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Raju Kirana Store API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # Database (supports Vercel Postgres POSTGRES_URL and DATABASE_URL)
    DATABASE_URL: str = (
        os.getenv("POSTGRES_URL")
        or os.getenv("DATABASE_URL")
        or os.getenv("POSTGRES_PRISMA_URL")
        or "sqlite:///./raju_kirana.db"
    )

    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "raju-kirana-super-secure-production-ready-jwt-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5176",
        "http://localhost:5177",
        "http://127.0.0.1:5177",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ]

    # Persistent uploads directory
    UPLOAD_DIR: str = os.getenv(
        "UPLOAD_DIR",
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads")),
    )
    MAX_IMAGE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB maximum safety limit
    ALLOWED_IMAGE_TYPES: List[str] = [
        "image/jpeg",
        "image/jpg",
        "image/pjpeg",
        "image/png",
        "image/webp",
        "image/avif",
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
