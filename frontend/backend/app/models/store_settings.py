from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


class StoreSettings(Base):
    __tablename__ = "store_settings"

    id = Column(Integer, primary_key=True, index=True)
    store_name = Column(String(200), default="Raju Kirana Store", nullable=False)
    tagline = Column(String(255), default="Aapki Apni Kirana Dukan", nullable=True)
    logo_url = Column(String(500), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    whatsapp_number = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    google_maps_url = Column(String(500), nullable=True)
    opening_hours = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    currency_symbol = Column(String(10), default="₹", nullable=False)
    currency_code = Column(String(10), default="INR", nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
