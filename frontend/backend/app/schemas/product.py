from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, field_validator, ConfigDict


class PriceOptionBase(BaseModel):
    unit_label: str = Field(..., min_length=1, max_length=100, description="Display unit, e.g. '1 pav (250 g)', '1 kg', '500 g packet'")
    quantity_value: Optional[Decimal] = Field(None, description="Numeric quantity value e.g. 250, 500, 1000, 1")
    quantity_unit: Optional[str] = Field(None, max_length=50, description="Unit type e.g. 'g', 'kg', 'packet', 'piece'")
    price: Decimal = Field(..., ge=0, description="Actual decimal-safe selling price in INR")
    is_default: bool = False
    sort_order: int = 0

    @field_validator("price")
    @classmethod
    def validate_price(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError("Price must be a non-negative number.")
        # Round to 2 decimal places to maintain currency precision
        return v.quantize(Decimal("0.01"))

    @field_validator("quantity_value")
    @classmethod
    def validate_quantity_value(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        if v is not None and v <= 0:
            raise ValueError("Quantity must be greater than zero.")
        return v


class PriceOptionCreate(PriceOptionBase):
    pass


class PriceOptionUpdate(PriceOptionBase):
    id: Optional[int] = None


class PriceOptionOut(PriceOptionBase):
    id: int
    product_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    brand: Optional[str] = Field(None, max_length=100)
    category_id: int
    description: Optional[str] = None
    pricing_type: str = Field(..., description="Pricing model: 'packaged', 'weight', 'small_quantity', 'custom_unit'")
    image_url: Optional[str] = None
    is_available: bool = True
    is_featured: bool = False

    @field_validator("pricing_type")
    @classmethod
    def validate_pricing_type(cls, v: str) -> str:
        valid_types = {"packaged", "weight", "small_quantity", "custom_unit"}
        if v not in valid_types:
            raise ValueError(f"Invalid pricing type '{v}'. Must be one of {valid_types}")
        return v


class ProductCreate(ProductBase):
    price_options: List[PriceOptionCreate] = Field(..., min_length=1, description="At least one price option is required")


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    brand: Optional[str] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    pricing_type: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None
    price_options: Optional[List[PriceOptionCreate]] = None

    @field_validator("pricing_type")
    @classmethod
    def validate_pricing_type(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            valid_types = {"packaged", "weight", "small_quantity", "custom_unit"}
            if v not in valid_types:
                raise ValueError(f"Invalid pricing type '{v}'. Must be one of {valid_types}")
        return v


class CategorySimple(BaseModel):
    id: int
    name: str
    slug: str

    model_config = ConfigDict(from_attributes=True)


class ProductOut(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[CategorySimple] = None
    price_options: List[PriceOptionOut] = []

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(BaseModel):
    items: List[ProductOut]
    total: int
    page: int
    size: int
    pages: int
