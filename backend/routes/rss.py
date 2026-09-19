from flask import Blueprint, Response

from services.rss_service import generate_rss_feed


rss_bp = Blueprint(
    "rss",
    __name__
)


# ============================================================
# RSS FEED
# ============================================================

@rss_bp.route(
    "/api/rss",
    methods=["GET"]
)
def rss_feed():

    rss_content = generate_rss_feed()

    return Response(
        rss_content,
        mimetype="application/rss+xml"
    )