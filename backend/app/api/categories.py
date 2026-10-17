import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.category import Category
from app.models.product import Product
from app.models.user import AdminUser
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryOut
from app.api.deps import get_current_admin

router = APIRouter(prefix="/categories", tags=["Categories"])


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


@router.get("", response_model=List[CategoryOut])
def list_categories(
    db: Session = Depends(get_db),
):
    # Query categories and calculate product count safely
    categories = db.query(Category).order_by(Category.sort_order.asc(), Category.name.asc()).all()
    results = []
    for cat in categories:
        count = db.query(func.count(Product.id)).filter(Product.category_id == cat.id).scalar() or 0
        cat_out = CategoryOut.model_validate(cat)
        cat_out.product_count = count
        results.append(cat_out)
    return results


@router.get("/{category_id}", response_model=CategoryOut)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {category_id} not found",
        )
    count = db.query(func.count(Product.id)).filter(Product.category_id == cat.id).scalar() or 0
    cat_out = CategoryOut.model_validate(cat)
    cat_out.product_count = count
    return cat_out


@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    # Check if category name exists
    existing = db.query(Category).filter(func.lower(Category.name) == category_in.name.strip().lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with name '{category_in.name}' already exists",
        )

    slug = category_in.slug.strip() if category_in.slug else slugify(category_in.name)
    # Ensure slug uniqueness
    existing_slug = db.query(Category).filter(Category.slug == slug).first()
    if existing_slug:
        slug = f"{slug}-{int(func.now().compile(db.bind).params.get('now', 1))}"

    category = Category(
        name=category_in.name.strip(),
        slug=slug,
        description=category_in.description,
        icon_name=category_in.icon_name or "ShoppingBag",
        sort_order=category_in.sort_order,
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    cat_out = CategoryOut.model_validate(category)
    cat_out.product_count = 0
    return cat_out


@router.put("/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: int,
    category_in: CategoryUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {category_id} not found",
        )

    if category_in.name is not None:
        name_clean = category_in.name.strip()
        existing = (
            db.query(Category)
            .filter(func.lower(Category.name) == name_clean.lower(), Category.id != category_id)
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Another category with name '{name_clean}' already exists",
            )
        cat.name = name_clean
        if not category_in.slug:
            cat.slug = slugify(name_clean)

    if category_in.slug is not None:
        cat.slug = slugify(category_in.slug)
    if category_in.description is not None:
        cat.description = category_in.description
    if category_in.icon_name is not None:
        cat.icon_name = category_in.icon_name
    if category_in.sort_order is not None:
        cat.sort_order = category_in.sort_order

    db.commit()
    db.refresh(cat)
    count = db.query(func.count(Product.id)).filter(Product.category_id == cat.id).scalar() or 0
    cat_out = CategoryOut.model_validate(cat)
    cat_out.product_count = count
    return cat_out


@router.delete("/{category_id}", status_code=status.HTTP_200_OK)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {category_id} not found",
        )

    product_count = db.query(func.count(Product.id)).filter(Product.category_id == category_id).scalar() or 0
    if product_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete category '{cat.name}' because it contains {product_count} product(s). Please reassign or delete these products first.",
        )

    db.delete(cat)
    db.commit()
    return {"message": f"Category '{cat.name}' deleted successfully"}
