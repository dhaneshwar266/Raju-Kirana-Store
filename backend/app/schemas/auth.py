from typing import Optional
from pydantic import BaseModel, ConfigDict


class LoginRequest(BaseModel):
    username_or_email: str
    password: str


class AdminUserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AdminUserOut
