from flask import Blueprint
from flask_jwt_extended import get_jwt_identity

from routes.auth import admin_required
from services.dashboard_service import (
    get_dashboard_summary
)


dashboard_bp = Blueprint(
    "dashboard",
    __name__
)


@dashboard_bp.route(
    "/api/admin/dashboard",
    methods=["GET"]
)
@admin_required()
def admin_dashboard():
    current_admin = get_jwt_identity()

    return {
        "message": "Welcome to the admin dashboard",
        "admin": current_admin
    }, 200


@dashboard_bp.route(
    "/api/admin/summary",
    methods=["GET"]
)
@admin_required()
def admin_summary():
    summary = get_dashboard_summary()

    return summary, 200