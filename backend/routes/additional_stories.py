from flask import Blueprint, request

from routes.auth import admin_required
from services.additional_story_service import (
    create_additional_story,
    get_additional_stories
)


additional_stories_bp = Blueprint(
    "additional_stories",
    __name__
)


# ============================================================
# ADD ADDITIONAL STORY
# ============================================================

@additional_stories_bp.route(
    "/api/admin/posts/<int:post_id>/additional-stories",
    methods=["POST"]
)
@admin_required()
def add_additional_story(post_id):

    data = request.get_json()

    if not data:
        return {
            "message": "Request body is required"
        }, 400

    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return {
            "message": "Title and content are required"
        }, 400

    additional_story = create_additional_story(
        post_id=post_id,
        title=title,
        content=content
    )

    if not additional_story:
        return {
            "message": "Post not found"
        }, 404

    return {
        "message": "Additional story added successfully",
        "additional_story_id": additional_story.id
    }, 201


# ============================================================
# GET ADDITIONAL STORIES
# ============================================================

@additional_stories_bp.route(
    "/api/posts/<int:post_id>/additional-stories",
    methods=["GET"]
)
def get_post_additional_stories(post_id):

    stories = get_additional_stories(post_id)

    if stories is None:
        return {
            "message": "Post not found"
        }, 404

    stories_data = []

    for story in stories:
        stories_data.append({
            "id": story.id,
            "title": story.title,
            "content": story.content,
            "created_at": story.created_at
        })

    return stories_data, 200