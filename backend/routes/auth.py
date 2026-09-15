from flask import Blueprint, request
from functools import wraps
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt
)
from werkzeug.security import check_password_hash

from models import Admin

auth_bp = Blueprint("auth", __name__)
def admin_required():
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()

            if claims.get("role") != "admin":
                return {
                    "message": "Admin access required"
                }, 403

            return fn(*args, **kwargs)

        return wrapper

    return decorator


@auth_bp.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()

    if not data:
        return {
            "message": "Request body is required"
        }, 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {
            "message": "Email and password are required"
        }, 400

    admin = Admin.query.filter_by(
        email=email
    ).first()

    if not admin:
        return {
            "message": "Invalid email or password"
        }, 401

    if not check_password_hash(
        admin.password_hash,
        password
    ):
        return {
            "message": "Invalid email or password"
        }, 401

    access_token = create_access_token(
        identity=admin.email,
        additional_claims={
            "role": "admin"
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token
    }, 200