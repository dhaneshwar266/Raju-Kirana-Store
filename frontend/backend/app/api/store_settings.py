from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.store_settings import StoreSettings
from app.models.user import AdminUser
from app.schemas.store_settings import StoreSettingsUpdate, StoreSettingsOut
from app.api.deps import get_current_admin

router = APIRouter(prefix="/store-settings", tags=["Store Settings"])


def get_or_create_settings(db: Session) -> StoreSettings:
    settings = db.query(StoreSettings).first()
    if not settings:
        settings = StoreSettings(
            store_name="Raju Kirana Store",
            tagline="Aapki Apni Kirana Dukan — Daily Essentials & Fresh Groceries",
            logo_url=None,
            contact_phone=None,
            whatsapp_number=None,
            address=None,
            google_maps_url=None,
            opening_hours=None,
            description="Welcome to Raju Kirana Store. Your trusted neighbourhood kirana store for quality staples, pulses, spices, oils, and daily household needs at honest prices.",
            currency_symbol="₹",
            currency_code="INR",
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("", response_model=StoreSettingsOut)
def get_store_settings(db: Session = Depends(get_db)):
    settings = get_or_create_settings(db)
    return StoreSettingsOut.model_validate(settings)


@router.put("", response_model=StoreSettingsOut)
def update_store_settings(
    settings_in: StoreSettingsUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    settings = get_or_create_settings(db)

    update_data = settings_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(settings, field, value.strip() if isinstance(value, str) else value)

    db.commit()
    db.refresh(settings)
    return StoreSettingsOut.model_validate(settings)
