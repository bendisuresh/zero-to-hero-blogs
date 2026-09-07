import os

from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

from app import app
from database import db
from models import Admin


load_dotenv()


admin_email = os.getenv("ADMIN_EMAIL")
admin_password = os.getenv("ADMIN_PASSWORD")


with app.app_context():

    existing_admin = Admin.query.filter_by(email=admin_email).first()

    if existing_admin:
        print("Admin already exists.")
    else:
        password_hash = generate_password_hash(admin_password)

        admin = Admin(
            email=admin_email,
            password_hash=password_hash
        )

        db.session.add(admin)
        db.session.commit()

        print("Admin created successfully.")