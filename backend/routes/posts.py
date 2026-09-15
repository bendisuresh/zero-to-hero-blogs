from flask import Blueprint, jsonify, request
from database import db
from datetime import datetime

from models import (
    Post,
    AdditionalStory,
    Comment
)
from routes.auth import admin_required
from utils.validators import (
    validate_post_data,
    sanitize_rich_text,
)

posts_bp = Blueprint("posts", __name__)


@posts_bp.route("/api/posts", methods=["GET"])
def get_posts():
    # Read optional category from query string
    category = request.args.get("category")

    query = Post.query

    # Filter posts by category if provided
    if category:
        query = query.filter_by(
            category=category
        )

    posts = (
        query
        .order_by(Post.created_at.desc())
        .all()
    )

    posts_data = []

    for post in posts:
        posts_data.append({
            "id": post.id,
            "title": post.title,
            "description": post.description,
            "category": post.category,
            "storyteller": post.storyteller,
            "storyteller_email": post.storyteller_email,
            "views": post.views or 0,
            "likes": post.likes or 0,
            "dislikes": post.dislikes or 0,
            "tags": post.tags
        })

    return posts_data, 200
@posts_bp.route(
    "/api/posts/<int:post_id>",
    methods=["GET"]
)
def get_post(post_id):
    post = db.session.get(
        Post,
        post_id
    )

    if post is None:
        return {
            "message": "Post not found"
        }, 404

    return {
        "id": post.id,
        "title": post.title,
        "description": post.description,
        "category": post.category,
        "storyteller": post.storyteller,
        "storyteller_email": post.storyteller_email,
        "starting_point": post.starting_point,
        "how_started": post.how_started,
        "financial_info": post.financial_info,
        "approach": post.approach,
        "life_changed": post.life_changed,
        "failures": post.failures,
        "lessons": post.lessons,
        "views": post.views or 0,
        "likes": post.likes or 0,
        "dislikes": post.dislikes or 0,
        "tags": post.tags
    }, 200
@posts_bp.route(
    "/api/admin/posts",
    methods=["POST"]
)
@admin_required()
def admin_create_post():
    data = request.get_json()

    # Validate post data
    validation_error = validate_post_data(data)

    if validation_error:
        return {
            "message": validation_error
        }, 400

    storyteller_email = data.get(
        "storyteller_email",
        ""
    ).strip()

    post = Post(
        title=data["title"].strip(),
        description=data["description"].strip(),
        category=data["category"].strip(),
        storyteller=data["storyteller"].strip(),
        storyteller_email=storyteller_email,
        starting_point=data["starting_point"].strip(),
        how_started=data["how_started"].strip(),
        financial_info=data["financial_info"].strip(),
        approach=data["approach"].strip(),
        life_changed=data["life_changed"].strip(),
        failures=data["failures"].strip(),

        # Sanitize Tiptap HTML before storing it
        lessons=sanitize_rich_text(
            data["lessons"]
        ),

        tags=data.get(
            "tags",
            ""
        ).strip()
    )

    db.session.add(post)
    db.session.commit()

    return {
        "message": "Story created successfully",
        "post_id": post.id
    }, 201

@posts_bp.route(
    "/api/admin/posts/<int:post_id>",
    methods=["PUT"]
)
@admin_required()
def update_post(post_id):
    post = db.session.get(
        Post,
        post_id
    )

    if not post:
        return {
            "message": "Post not found"
        }, 404

    data = request.get_json()

    # Validate data
    validation_error = validate_post_data(data)

    if validation_error:
        return {
            "message": validation_error
        }, 400

    storyteller_email = data.get(
        "storyteller_email",
        ""
    ).strip()

    post.title = data["title"].strip()
    post.description = data["description"].strip()
    post.category = data["category"].strip()
    post.storyteller = data["storyteller"].strip()
    post.storyteller_email = storyteller_email
    post.starting_point = data["starting_point"].strip()
    post.how_started = data["how_started"].strip()
    post.financial_info = data["financial_info"].strip()
    post.approach = data["approach"].strip()
    post.life_changed = data["life_changed"].strip()
    post.failures = data["failures"].strip()

    # Sanitize rich text before saving
    post.lessons = sanitize_rich_text(
        data["lessons"]
    )

    if "tags" in data:
        post.tags = data["tags"].strip()

    db.session.commit()

    return {
        "message": "Story updated successfully",
        "post_id": post.id
    }, 200

@posts_bp.route(
    "/api/admin/posts/<int:post_id>",
    methods=["DELETE"]
)
@admin_required()
def delete_post(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    # Story does not exist
    if not post:
        return jsonify({
            "message": "Story not found"
        }), 404

    # Check when the story was created
    created_at = post.created_at

    # Current time
    current_time = datetime.utcnow()

    # Calculate how old the story is
    age = current_time - created_at

    # Delete is allowed only within 24 hours
    if age.total_seconds() > 24 * 60 * 60:
        return jsonify({
            "message": (
                "Stories can only be deleted "
                "within 24 hours of creation."
            )
        }), 403

    try:

        # Delete related additional stories first
        AdditionalStory.query.filter_by(
            post_id=post.id
        ).delete()

        # Delete related comments
        Comment.query.filter_by(
            post_id=post.id
        ).delete()

        # Delete the main post
        db.session.delete(post)

        db.session.commit()

        return jsonify({
            "message": "Story deleted successfully"
        }), 200

    except Exception:

        db.session.rollback()

        return jsonify({
            "message": "Failed to delete story"
        }), 500




