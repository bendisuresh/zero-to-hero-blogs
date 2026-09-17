from flask import Blueprint

from routes.auth import admin_required
from services.dashboard_service import (
    get_dashboard_summary
)


dashboard_bp = Blueprint(
    "dashboard",
    __name__
)


@dashboard_bp.route(
    "/api/admin/summary",
    methods=["GET"]
)
@admin_required()
def admin_summary():
    summary = get_dashboard_summary()

    return summary, 200