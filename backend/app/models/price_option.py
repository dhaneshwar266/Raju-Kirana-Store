from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ProductPriceOption(Base):
    __tablename__ = "product_price_options"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    unit_label = Column(String(100), nullable=False)  # e.g., "1 pav (250 g)", "1 kg", "500 g packet", "1 Dozen"
    quantity_value = Column(Numeric(10, 3), nullable=True)  # normalized quantity numeric
    quantity_unit = Column(String(50), nullable=True)  # "g", "kg", "packet", "piece", "dozen", "bottle", "litre"
    price = Column(Numeric(10, 2), nullable=False)  # Decimal-safe monetary price
    is_default = Column(Boolean, default=False, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    product = relationship("Product", back_populates="price_options")
