from flask import Blueprint, request

from database import db
from models import Post, Comment
from routes.auth import admin_required
from services.comment_service import (
    create_comment as create_comment_service,
    delete_comment as delete_comment_service,

    update_comment_status as update_comment_status_service
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
        "message": "Comment submitted for moderation",
        "comment_id": comment.id,
        "status": comment.status
    }, 201


# ============================================================
# GET APPROVED COMMENTS - PUBLIC
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
        .filter_by(
            post_id=post_id,
            status="approved"
        )
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
# GET ALL COMMENTS - ADMIN
# ============================================================

@comments_bp.route(
    "/api/admin/comments",
    methods=["GET"]
)
@admin_required()
def get_all_comments():

    rows = (
        db.session.query(
            Comment,
            Post.title
        )
        .join(
            Post,
            Comment.post_id == Post.id
        )
        .order_by(
            Comment.created_at.desc()
        )
        .all()
    )

    comments_data = []

    for comment, post_title in rows:
        comments_data.append({
            "id": comment.id,
            "post_id": comment.post_id,
            "post_title": post_title,
            "name": comment.name,
            "content": comment.content,
            "status": comment.status,
            "created_at": comment.created_at
        })

    return {
        "comments": comments_data,
        "total": len(comments_data)
    }, 200


# ============================================================
# UPDATE COMMENT STATUS - ADMIN
# ============================================================

@comments_bp.route(
    "/api/admin/comments/<int:comment_id>/status",
    methods=["PATCH"]
)
@admin_required()
def change_comment_status(comment_id):

    comment = db.session.get(
        Comment,
        comment_id
    )

    if not comment:
        return {
            "message": "Comment not found"
        }, 404

    data = request.get_json()

    if not data:
        return {
            "message": "Request body is required"
        }, 400

    status = data.get("status")

    allowed_statuses = [
        "pending",
        "approved",
        "rejected"
    ]

    if status not in allowed_statuses:
        return {
            "message": (
                "Status must be pending, approved, "
                "or rejected"
            )
        }, 400

    update_comment_status_service(
        comment,
        status
    )

    return {
        "message": "Comment status updated successfully",
        "comment_id": comment.id,
        "status": comment.status
    }, 200
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

    delete_comment_service(
        comment
    )

    return {
        "message": "Comment deleted successfully",
        "comment_id": comment_id
    }, 200
