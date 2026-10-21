import math
from typing import Optional, List
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, asc, desc, func

from app.database import get_db
from app.models.product import Product
from app.models.price_option import ProductPriceOption
from app.models.category import Category
from app.models.user import AdminUser
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductOut,
    ProductListResponse,
    PriceOptionCreate,
)
from app.api.deps import get_current_admin

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=ProductListResponse)
def list_products(
    search: Optional[str] = Query(None, description="Search by name, brand, or description"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    category_slug: Optional[str] = Query(None, description="Filter by category slug"),
    is_available: Optional[bool] = Query(None, description="Filter by availability status"),
    is_featured: Optional[bool] = Query(None, description="Filter by featured status"),
    sort_by: Optional[str] = Query("newest", description="Sort option: 'newest', 'name_asc', 'name_desc', 'price_asc', 'price_desc'"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(24, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Product)
        .options(joinedload(Product.category), joinedload(Product.price_options))
    )

    # Filter: Category
    if category_id is not None:
        query = query.filter(Product.category_id == category_id)
    elif category_slug:
        query = query.join(Category).filter(Category.slug == category_slug)

    # Filter: Availability
    if is_available is not None:
        query = query.filter(Product.is_available == is_available)

    # Filter: Featured
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)

    # Filter: Search keyword
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(term),
                Product.brand.ilike(term),
                Product.description.ilike(term),
            )
        )

    # Total count before pagination
    base_count_query = db.query(func.count(Product.id))
    if category_id is not None:
        base_count_query = base_count_query.filter(Product.category_id == category_id)
    elif category_slug:
        base_count_query = base_count_query.join(Category).filter(Category.slug == category_slug)
    if is_available is not None:
        base_count_query = base_count_query.filter(Product.is_available == is_available)
    if is_featured is not None:
        base_count_query = base_count_query.filter(Product.is_featured == is_featured)
    if search and search.strip():
        term = f"%{search.strip()}%"
        base_count_query = base_count_query.filter(
            or_(
                Product.name.ilike(term),
                Product.brand.ilike(term),
                Product.description.ilike(term),
            )
        )
    total = base_count_query.scalar() or 0

    # Sorting
    if sort_by == "name_asc":
        query = query.order_by(Product.name.asc())
    elif sort_by == "name_desc":
        query = query.order_by(Product.name.desc())
    elif sort_by == "price_asc":
        # Sort by minimum price among price options
        min_price_sub = (
            db.query(ProductPriceOption.product_id, func.min(ProductPriceOption.price).label("min_price"))
            .group_by(ProductPriceOption.product_id)
            .subquery()
        )
        query = query.outerjoin(min_price_sub, Product.id == min_price_sub.c.product_id).order_by(
            min_price_sub.c.min_price.asc().nullslast(), Product.name.asc()
        )
    elif sort_by == "price_desc":
        min_price_sub = (
            db.query(ProductPriceOption.product_id, func.min(ProductPriceOption.price).label("min_price"))
            .group_by(ProductPriceOption.product_id)
            .subquery()
        )
        query = query.outerjoin(min_price_sub, Product.id == min_price_sub.c.product_id).order_by(
            min_price_sub.c.min_price.desc().nullslast(), Product.name.asc()
        )
    else:  # newest
        query = query.order_by(Product.id.desc())

    offset = (page - 1) * size
    products = query.offset(offset).limit(size).all()
    pages = math.ceil(total / size) if size > 0 else 1

    return ProductListResponse(
        items=[ProductOut.model_validate(p) for p in products],
        total=total,
        page=page,
        size=size,
        pages=pages,
    )


@router.get("/{product_id}", response_model=ProductOut)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = (
        db.query(Product)
        .options(joinedload(Product.category), joinedload(Product.price_options))
        .filter(Product.id == product_id)
        .first()
    )
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )
    return ProductOut.model_validate(product)


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    # Verify category exists
    category = db.query(Category).filter(Category.id == product_in.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with ID {product_in.category_id} does not exist",
        )

    if not product_in.price_options:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one pricing option is required for a product",
        )

    product = Product(
        name=product_in.name.strip(),
        brand=product_in.brand.strip() if product_in.brand else None,
        category_id=product_in.category_id,
        description=product_in.description.strip() if product_in.description else None,
        pricing_type=product_in.pricing_type,
        image_url=product_in.image_url,
        is_available=product_in.is_available,
        is_featured=product_in.is_featured,
    )
    db.add(product)
    db.flush()  # get product.id

    # Determine the single default option (exactly one option must be default)
    true_indices = [i for i, o in enumerate(product_in.price_options) if o.is_default]
    if len(true_indices) > 1 and any(i > 0 for i in true_indices):
        default_idx = next(i for i in true_indices if i > 0)
    elif len(true_indices) == 1:
        default_idx = true_indices[0]
    else:
        default_idx = 0

    for idx, opt in enumerate(product_in.price_options):
        price_opt = ProductPriceOption(
            product_id=product.id,
            unit_label=opt.unit_label.strip(),
            quantity_value=opt.quantity_value,
            quantity_unit=opt.quantity_unit.strip() if opt.quantity_unit else None,
            price=opt.price,
            is_default=(idx == default_idx),
            sort_order=opt.sort_order if opt.sort_order != 0 else idx,
        )
        db.add(price_opt)

    db.commit()
    db.refresh(product)
    return ProductOut.model_validate(product)


@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    product = (
        db.query(Product)
        .options(joinedload(Product.category), joinedload(Product.price_options))
        .filter(Product.id == product_id)
        .first()
    )
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )

    if product_in.category_id is not None:
        cat = db.query(Category).filter(Category.id == product_in.category_id).first()
        if not cat:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with ID {product_in.category_id} does not exist",
            )
        product.category_id = product_in.category_id

    if product_in.name is not None:
        product.name = product_in.name.strip()
    if product_in.brand is not None:
        product.brand = product_in.brand.strip() if product_in.brand else None
    if product_in.description is not None:
        product.description = product_in.description.strip() if product_in.description else None
    if product_in.pricing_type is not None:
        product.pricing_type = product_in.pricing_type
    if product_in.image_url is not None:
        product.image_url = product_in.image_url
    if product_in.is_available is not None:
        product.is_available = product_in.is_available
    if product_in.is_featured is not None:
        product.is_featured = product_in.is_featured

    # Update pricing options if provided
    if product_in.price_options is not None:
        if len(product_in.price_options) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one pricing option is required for a product",
            )
        # Remove old options
        db.query(ProductPriceOption).filter(ProductPriceOption.product_id == product.id).delete()
        # Insert new options
        # Determine the single default option (exactly one option must be default)
        true_indices = [i for i, o in enumerate(product_in.price_options) if o.is_default]
        if len(true_indices) > 1 and any(i > 0 for i in true_indices):
            default_idx = next(i for i in true_indices if i > 0)
        elif len(true_indices) == 1:
            default_idx = true_indices[0]
        else:
            default_idx = 0

        for idx, opt in enumerate(product_in.price_options):
            price_opt = ProductPriceOption(
                product_id=product.id,
                unit_label=opt.unit_label.strip(),
                quantity_value=opt.quantity_value,
                quantity_unit=opt.quantity_unit.strip() if opt.quantity_unit else None,
                price=opt.price,
                is_default=(idx == default_idx),
                sort_order=opt.sort_order if opt.sort_order != 0 else idx,
            )
            db.add(price_opt)

    db.commit()
    db.refresh(product)
    return ProductOut.model_validate(product)


@router.delete("/clear-all", status_code=status.HTTP_200_OK)
@router.post("/clear-all", status_code=status.HTTP_200_OK)
def clear_all_products(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    count = db.query(Product).count()
    db.query(ProductPriceOption).delete()
    db.query(Product).delete()
    db.commit()
    return {"message": f"Successfully removed all {count} products"}


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found",
        )
    product_name = product.name
    db.delete(product)
    db.commit()
    return {"message": f"Product '{product_name}' deleted successfully"}
