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

    # Validate and optimize image with Pillow
    try:
        raw_io = io.BytesIO(contents)
        image = Image.open(raw_io)
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
        # Resize if dimensions exceed 1200x1200
        image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
        out_io = io.BytesIO()
        image.save(out_io, format="JPEG", quality=82, optimize=True)
        optimized_contents = out_io.getvalue()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is not a valid or readable image.",
        )

    safe_filename = f"{uuid.uuid4().hex}.jpg"
    dest_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    with open(dest_path, "wb") as f:
        f.write(optimized_contents)

    return {
        "url": f"/uploads/{safe_filename}",
        "filename": safe_filename,
        "size": len(optimized_contents),
    }
