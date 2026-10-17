import os
import uuid
from PIL import Image
import io
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from app.config import settings
from app.models.user import AdminUser
from app.api.deps import get_current_admin

router = APIRouter(prefix="/upload", tags=["Uploads"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    current_admin: AdminUser = Depends(get_current_admin),
):
    # Validate content type
    if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image type '{file.content_type}'. Allowed types: JPG, PNG, WEBP, AVIF.",
        )

    # Read content
    contents = await file.read()
    if len(contents) > settings.MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Image file size exceeds maximum limit of 5 MB.",
        )

    # Validate image with Pillow to ensure it's not corrupt or malicious
    try:
        image = Image.open(io.BytesIO(contents))
        image.verify()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is not a valid or readable image.",
        )

    # Determine extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp", ".avif"]:
        ext = ".webp" if file.content_type == "image/webp" else ".jpg"

    safe_filename = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    with open(dest_path, "wb") as f:
        f.write(contents)

    return {
        "url": f"/uploads/{safe_filename}",
        "filename": safe_filename,
        "size": len(contents),
    }
