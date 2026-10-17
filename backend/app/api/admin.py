from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.database import get_db
from app.models.product import Product
from app.models.category import Category
from app.models.user import AdminUser
from app.schemas.product import ProductOut
from app.api.deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])


@router.get("/overview")
def get_admin_dashboard_overview(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
) -> Dict[str, Any]:
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_categories = db.query(func.count(Category.id)).scalar() or 0
    in_stock_products = (
        db.query(func.count(Product.id)).filter(Product.is_available == True).scalar() or 0
    )
    out_of_stock_products = (
        db.query(func.count(Product.id)).filter(Product.is_available == False).scalar() or 0
    )

    recent_products = (
        db.query(Product)
        .options(joinedload(Product.category), joinedload(Product.price_options))
        .order_by(Product.updated_at.desc())
        .limit(6)
        .all()
    )

    return {
        "total_products": total_products,
        "total_categories": total_categories,
        "in_stock_products": in_stock_products,
        "out_of_stock_products": out_of_stock_products,
        "recent_products": [ProductOut.model_validate(p) for p in recent_products],
    }
