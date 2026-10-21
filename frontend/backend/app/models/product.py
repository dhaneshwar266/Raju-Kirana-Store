from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), index=True, nullable=False)
    brand = Column(String(100), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False, index=True)
    description = Column(Text, nullable=True)
    pricing_type = Column(String(50), nullable=False, default="packaged")  # 'packaged', 'weight', 'small_quantity', 'custom_unit'
    image_url = Column(String(500), nullable=True)
    is_available = Column(Boolean, default=True, nullable=False, index=True)
    is_featured = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    category = relationship("Category", back_populates="products")
    price_options = relationship(
        "ProductPriceOption",
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductPriceOption.sort_order.asc(), ProductPriceOption.id.asc()",
    )
