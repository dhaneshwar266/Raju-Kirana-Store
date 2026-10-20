import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, Base, engine
from app.models.product import Product
from app.models.price_option import ProductPriceOption


def clear_all_products():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        count = db.query(Product).count()
        db.query(ProductPriceOption).delete()
        db.query(Product).delete()
        db.commit()
        print(f"✅ Successfully removed all {count} products and their pricing options.")
        print("Now the store is clean and ready for your own custom products!")
    except Exception as e:
        db.rollback()
        print(f"❌ Error while clearing products: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    clear_all_products()
