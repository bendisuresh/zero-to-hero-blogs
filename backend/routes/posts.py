from flask import Blueprint, jsonify, request

from serializers.post_serializer import (
    serialize_post,
    serialize_post_summary,
    serialize_admin_post
)

from services.post_service import (
    create_post as create_post_service,
    get_post_by_id,
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
        posts_data.append(
            serialize_post_summary(post)
        )

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
    post = get_post_by_id(post_id)

    if not post:
        return {
            "message": "Post not found"
        }, 404

    return serialize_post(post), 200


@posts_bp.route(
    "/api/admin/posts",
    methods=["GET"]
)
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
        posts_data.append(
            serialize_admin_post(post)
        )

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

    validation_error = validate_post(data)

    if validation_error:
        return {
            "message": validation_error
        }, 400

    data["lessons"] = sanitize_rich_text(
        data["lessons"]
    )

    post = create_post_service(data)

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
    post = get_post_by_id(
        post_id,
        include_drafts=True
    )

    if not post:
        return {
            "message": "Post not found"
        }, 404

    data = request.get_json()

    validation_error = validate_post(data)

    if validation_error:
        return {
            "message": validation_error
        }, 400

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
    post = get_post_by_id(
        post_id,
        include_drafts=True
    )

    if not post:
        return {
            "message": "Post not found"
        }, 404

    return serialize_admin_post(post), 200


@posts_bp.route(
    "/api/admin/posts/<int:post_id>",
    methods=["DELETE"]
)
@admin_required()
def delete_post(post_id):
    post = get_post_by_id(
        post_id,
        include_drafts=True
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