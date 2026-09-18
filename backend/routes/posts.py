from flask import Blueprint, jsonify, request
from database import db

from models import (
    Post
)

from services.post_service import (
    create_post,
    get_posts as get_posts_service,
    update_post as update_post_service,
    delete_post as delete_post_service
)

from routes.auth import admin_required
from schemas.post_schema import validate_post
from utils.validators import sanitize_rich_text


posts_bp = Blueprint("posts", __name__)


@posts_bp.route("/api/posts", methods=["GET"])
def get_posts():
    category = request.args.get("category")

    tag = request.args.get(
        "tag",
        default=""
    ).strip()

    search = request.args.get(
        "search",
        default=""
    ).strip()
    sort = request.args.get(
        "sort",
        default="latest"
    ).lower()

    page = request.args.get(
        "page",
        default=1,
        type=int
    )
    limit = request.args.get(
        "limit",
        default=10,
        type=int
    )

    if page < 1:
        page = 1

    if limit < 1:
        limit = 10

    pagination = get_posts_service(
        category=category,
        search=search,
        tag=tag,
        sort=sort,
        page=page,
        limit=limit
    )

    posts_data = []

    for post in pagination.items:
        posts_data.append({
            "id": post.id,
            "title": post.title,
            "description": post.description,
            "category": post.category,
            "storyteller": post.storyteller,
            "storyteller_email": post.storyteller_email,
            "image_url": post.image_url,
            "created_at": post.created_at.isoformat() if post.created_at else None,
            "views": post.views or 0,
            "likes": post.likes or 0,
            "dislikes": post.dislikes or 0,
            "tags": post.tags
        })

    return {
        "posts": posts_data,
        "page": pagination.page,
        "total_pages": pagination.pages
    }, 200

@posts_bp.route(
    "/api/posts/<int:post_id>",
    methods=["GET"]
)
def get_post(post_id):
    post = db.session.get(
        Post,
        post_id
    )

    if post is None or post.status != "published":
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
        "image_url": post.image_url,
        "created_at": post.created_at.isoformat() if post.created_at else None,
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
@posts_bp.route("/api/admin/posts", methods=["GET"])
@admin_required()
def get_admin_posts():
    category = request.args.get("category")
    search = request.args.get(
        "search",
        default=""
    ).strip()
    sort = request.args.get(
        "sort",
        default="latest"
    ).lower()

    page = request.args.get(
        "page",
        default=1,
        type=int
    )
    limit = request.args.get(
        "limit",
        default=10,
        type=int
    )

    if page < 1:
        page = 1

    if limit < 1:
        limit = 10

    pagination = get_posts_service(
        category=category,
        search=search,
        sort=sort,
        page=page,
        limit=limit,
        include_drafts=True
    )

    posts_data = []

    for post in pagination.items:
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
            "tags": post.tags,
            "image_url": post.image_url,
            "created_at": (
                post.created_at.isoformat()
                if post.created_at
                else None
            ),
            "status": post.status,
            "published_at": (
                post.published_at.isoformat()
                if post.published_at
                else None
            )
        })

    return {
        "posts": posts_data,
        "page": pagination.page,
        "total_pages": pagination.pages
    }, 200

@posts_bp.route(
    "/api/admin/posts",
    methods=["POST"]
)
@admin_required()
def admin_create_post():
    data = request.get_json()

    # Validate post data
    validation_error = validate_post(data)

    if validation_error:
        return {
            "message": validation_error
        }, 400

    # Sanitize Tiptap HTML before storing it
    data["lessons"] = sanitize_rich_text(
        data["lessons"]
    )

    post = create_post(data)

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

    # Validate post data
    validation_error = validate_post(data)

    if validation_error:
        return {
            "message": validation_error
        }, 400

    # Sanitize rich text before saving
    data["lessons"] = sanitize_rich_text(
        data["lessons"]
    )

    post = update_post_service(
        post,
        data
    )

    return {
        "message": "Story updated successfully",
        "post_id": post.id
    }, 200
@posts_bp.route(
    "/api/admin/posts/<int:post_id>",
    methods=["GET"]
)
@admin_required()
def get_admin_post(post_id):
    post = db.session.get(
        Post,
        post_id
    )

    if not post:
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
        "image_url": post.image_url,
        "created_at": (
            post.created_at.isoformat()
            if post.created_at
            else None
        ),
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
        "tags": post.tags,
        "status": post.status,
        "published_at": (
            post.published_at.isoformat()
            if post.published_at
            else None
        )
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

    if not post:
        return jsonify({
            "message": "Story not found"
        }), 404

    deleted = delete_post_service(post)

    if not deleted:
        return jsonify({
            "message": (
                "Stories can only be deleted "
                "within 24 hours of creation."
            )
        }), 403

    return jsonify({
        "message": "Story deleted successfully"
    }), 200