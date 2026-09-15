from flask import Blueprint

from database import db
from models import Post


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
    if post.likes is None:
        post.likes = 0

    post.likes += 1

    db.session.commit()

    return {
        "message": "Post liked successfully",
        "likes": post.likes
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
    if post.dislikes is None:
        post.dislikes = 0

    post.dislikes += 1

    db.session.commit()

    return {
        "message": "Post disliked successfully",
        "dislikes": post.dislikes
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
    if post.views is None:
        post.views = 0

    post.views += 1

    db.session.commit()

    return {
        "message": "Post view recorded successfully",
        "views": post.views
    }, 200