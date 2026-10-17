import sys
import os
import argparse
from getpass import getpass

# Add app to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, Base, engine
from app.models.user import AdminUser
from app.core.security import get_password_hash


def create_or_update_admin(username, email, password, full_name="Store Owner"):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = (
            db.query(AdminUser)
            .filter((AdminUser.username == username) | (AdminUser.email == email))
            .first()
        )
        if existing:
            print(f"Admin user '{existing.username}' already exists. Updating password...")
            existing.hashed_password = get_password_hash(password)
            existing.full_name = full_name
            existing.is_active = True
            db.commit()
            print("Password updated successfully.")
            return

        new_admin = AdminUser(
            username=username,
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            is_active=True,
        )
        db.add(new_admin)
        db.commit()
        print(f"Administrator '{username}' created successfully!")
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="Create or update Raju Kirana Store administrator account")
    parser.add_argument("--username", help="Admin username")
    parser.add_argument("--email", help="Admin email address")
    parser.add_argument("--password", help="Admin password")
    parser.add_argument("--name", default="Store Owner", help="Full name of store owner")

    args = parser.parse_args()

    username = args.username or input("Enter admin username: ").strip()
    email = args.email or input("Enter admin email: ").strip()
    if not args.password:
        password = getpass("Enter admin password: ").strip()
        confirm = getpass("Confirm password: ").strip()
        if password != confirm:
            print("Error: Passwords do not match!")
            sys.exit(1)
    else:
        password = args.password

    if not username or not email or not password:
        print("Error: Username, email, and password cannot be empty.")
        sys.exit(1)

    create_or_update_admin(username, email, password, args.name)


if __name__ == "__main__":
    main()
