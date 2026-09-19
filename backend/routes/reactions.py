from flask import Blueprint

from services.reaction_service import (
    get_post,
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

    post = get_post(post_id)

    if not post:
        return {
            "message": "Post not found"
        }, 404

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

    post = get_post(post_id)

    if not post:
        return {
            "message": "Post not found"
        }, 404

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

    post = get_post(post_id)

    if not post:
        return {
            "message": "Post not found"
        }, 404

    views = record_view(post)

    return {
        "message": "Post view recorded successfully",
        "views": views
    }, 200