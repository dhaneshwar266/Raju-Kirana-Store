import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, SessionLocal, Base
import app.models  # ensure all models are registered
from app.utils.initial_data import seed_database
from app.api import auth, categories, products, store_settings, uploads, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed initial store data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown logic if any


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-ready REST API for Raju Kirana Store — Local Indian grocery catalogue with flexible pricing models.",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# Persistent uploads directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

from fastapi.responses import FileResponse
from app.models.uploaded_file import UploadedFile
from app.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException


@app.get("/uploads/{filename}")
async def serve_uploaded_image(filename: str, db: Session = Depends(get_db)):
    # 1. Fast local disk check
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)

    # 2. Database persistent fallback (survives cloud container restarts)
    db_file = db.query(UploadedFile).filter(UploadedFile.filename == filename).first()
    if db_file:
        try:
            with open(file_path, "wb") as f:
                f.write(db_file.data)
        except Exception:
            pass
        return Response(content=db_file.data, media_type=db_file.content_type)

    raise HTTPException(status_code=404, detail="Image not found")


app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers under /api
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(categories.router, prefix=settings.API_V1_STR)
app.include_router(products.router, prefix=settings.API_V1_STR)
app.include_router(store_settings.router, prefix=settings.API_V1_STR)
app.include_router(uploads.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)


@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }
