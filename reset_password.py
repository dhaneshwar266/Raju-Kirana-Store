#!/usr/bin/env python3
"""
Simple script to reset Raju Kirana Store admin password directly.
Usage:
  backend/venv/bin/python reset_password.py "YourNewPassword123"
"""
import sys
import os

# Load environment
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from app.database import SessionLocal, Base, engine
from app.models.user import AdminUser
from app.core.security import get_password_hash

def reset_password(new_password):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin = db.query(AdminUser).first()
        if not admin:
            print("No admin user found. Creating new admin user...")
            admin = AdminUser(
                username="admin",
                email="admin@rajukirana.local",
                hashed_password=get_password_hash(new_password),
                full_name="Raju Kirana Owner",
                is_active=True,
            )
            db.add(admin)
        else:
            print(f"Resetting password for admin user: '{admin.username}'...")
            admin.hashed_password = get_password_hash(new_password)
        db.commit()
        print(f"SUCCESS: Admin password has been updated successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        pwd = sys.argv[1].strip()
    else:
        pwd = input("Enter new password (min 6 characters): ").strip()
    
    if len(pwd) < 6:
        print("Error: Password must be at least 6 characters.")
        sys.exit(1)
    reset_password(pwd)
