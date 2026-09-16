from flask import Blueprint

from database import db
from models import Post
from services.reaction_service import (
    like_post as like_post_service,
    dislike_post as dislike_post_service,
    record_view
)


reactions_bp = Blueprint(
    "reactions",
    __name__
)


# ============================================================
# LIKE POST
# ============================================================

@reactions_bp.route(
    "/api/posts/<int:post_id>/like",
    methods=["POST"]
)
def like_post(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    if not post:
        return {
            "message": "Post not found"
        }, 404

    # Protect against old NULL database values
    likes = like_post_service(post)

    return {
        "message": "Post liked successfully",
        "likes": likes
    }, 200


# ============================================================
# DISLIKE POST
# ============================================================

@reactions_bp.route(
    "/api/posts/<int:post_id>/dislike",
    methods=["POST"]
)
def dislike_post(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    if not post:
        return {
            "message": "Post not found"
        }, 404

    # Protect against old NULL database values
    dislikes = dislike_post_service(post)

    return {
        "message": "Post disliked successfully",
        "dislikes": dislikes
    }, 200


# ============================================================
# RECORD POST VIEW
# ============================================================

@reactions_bp.route(
    "/api/posts/<int:post_id>/view",
    methods=["POST"]
)
def view_post(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    if not post:
        return {
            "message": "Post not found"
        }, 404

    # Protect against old NULL database values
    views = record_view(post)

    return {
        "message": "Post view recorded successfully",
        "views": views
    }, 200 
