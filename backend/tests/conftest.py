import os
import sys
from pathlib import Path

import pytest
from werkzeug.security import generate_password_hash

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
os.environ["TESTING"] = "1"


@pytest.fixture
def app():
    from app import app

    app.config["TESTING"] = True

    from database import db

    with app.app_context():
        db.drop_all()
        db.create_all()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def admin(app):
    from database import db
    from models import Admin

    with app.app_context():
        admin = Admin(
            email="admin@test.com",
            password_hash=generate_password_hash("testpassword")
        )

        db.session.add(admin)
        db.session.commit()

        return admin


@pytest.fixture
def admin_token(client, admin):
    response = client.post(
        "/api/admin/login",
        json={
            "email": "admin@test.com",
            "password": "testpassword"
        }
    )

    assert response.status_code == 200

    return response.get_json()["access_token"]