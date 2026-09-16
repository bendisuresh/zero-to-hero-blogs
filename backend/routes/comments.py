from flask import Blueprint, request

from database import db
from models import Post, Comment
from routes.auth import admin_required
from services.comment_service import (
    create_comment as create_comment_service,
    delete_comment as delete_comment_service
)


comments_bp = Blueprint(
    "comments",
    __name__
)


# ============================================================
# CREATE COMMENT
# ============================================================

@comments_bp.route(
    "/api/posts/<int:post_id>/comments",
    methods=["POST"]
)
def create_comment(post_id):

    data = request.get_json()

    if not data:
        return {
            "message": "Request body is required"
        }, 400

    name = data.get("name")
    content = data.get("content")

    if not name or not content:
        return {
            "message": "Name and content are required"
        }, 400

    if len(name.strip()) > 100:
        return {
            "message": "Name must be 100 characters or less"
        }, 400

    post = db.session.get(
        Post,
        post_id
    )

    if not post:
        return {
            "message": "Post not found"
        }, 404

    comment = create_comment_service(
    post_id,
    name,
    content
)

    return {
        "message": "Comment added successfully",
        "comment_id": comment.id
    }, 201


# ============================================================
# GET COMMENTS
# ============================================================

@comments_bp.route(
    "/api/posts/<int:post_id>/comments",
    methods=["GET"]
)
def get_comments(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    if not post:
        return {
            "message": "Post not found"
        }, 404

    comments = (
        Comment.query
        .filter_by(post_id=post_id)
        .order_by(
            Comment.created_at.asc()
        )
        .all()
    )

    comments_data = []

    for comment in comments:
        comments_data.append({
            "id": comment.id,
            "name": comment.name,
            "content": comment.content,
            "created_at": comment.created_at
        })

    return comments_data, 200


# ============================================================
# DELETE COMMENT - ADMIN
# ============================================================

@comments_bp.route(
    "/api/admin/comments/<int:comment_id>",
    methods=["DELETE"]
)
@admin_required()
def delete_comment(comment_id):

    comment = db.session.get(
        Comment,
        comment_id
    )

    if not comment:
        return {
            "message": "Comment not found"
        }, 404

    delete_comment_service(comment)

    return {
        "message": "Comment deleted successfully"
    }, 200