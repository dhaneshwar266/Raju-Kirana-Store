from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import AdminUser
from app.schemas.auth import LoginRequest, TokenResponse, AdminUserOut
from app.core.security import verify_password, create_access_token
from app.core.rate_limiter import check_login_rate_limit, record_failed_attempt, reset_attempts
from app.api.deps import get_current_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(
    request: Request,
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):
    # Check rate limit to prevent brute force
    check_login_rate_limit(request)

    identifier = login_data.username_or_email.strip().lower()
    user = (
        db.query(AdminUser)
        .filter(
            or_(
                AdminUser.username.ilike(identifier),
                AdminUser.email.ilike(identifier),
            )
        )
        .first()
    )

    if not user or not verify_password(login_data.password, user.hashed_password):
        record_failed_attempt(request)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This administrator account has been deactivated.",
        )

    # Success: reset rate limiter and update login time
    reset_attempts(request)
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()

    access_token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=AdminUserOut.model_validate(user),
    )


@router.get("/me", response_model=AdminUserOut)
def get_current_user_profile(
    current_admin: AdminUser = Depends(get_current_admin),
):
    return AdminUserOut.model_validate(current_admin)


@router.post("/logout")
def logout(
    current_admin: AdminUser = Depends(get_current_admin),
):
    return {"message": "Logged out successfully"}
