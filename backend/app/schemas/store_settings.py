from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class StoreSettingsBase(BaseModel):
    store_name: str = Field(default="Raju Kirana Store", min_length=2, max_length=200)
    tagline: Optional[str] = Field(default="Aapki Apni Kirana Dukan", max_length=255)
    logo_url: Optional[str] = None
    contact_phone: Optional[str] = Field(None, max_length=50)
    whatsapp_number: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = None
    google_maps_url: Optional[str] = Field(None, max_length=500)
    opening_hours: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    currency_symbol: str = Field(default="₹", max_length=10)
    currency_code: str = Field(default="INR", max_length=10)


class StoreSettingsUpdate(BaseModel):
    store_name: Optional[str] = Field(None, min_length=2, max_length=200)
    tagline: Optional[str] = None
    logo_url: Optional[str] = None
    contact_phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    address: Optional[str] = None
    google_maps_url: Optional[str] = None
    opening_hours: Optional[str] = None
    description: Optional[str] = None
    currency_symbol: Optional[str] = None
    currency_code: Optional[str] = None


class StoreSettingsOut(StoreSettingsBase):
    id: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
