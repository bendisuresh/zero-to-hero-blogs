from flask import Blueprint, request

from database import db
from models import Post, AdditionalStory
from routes.auth import admin_required


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

    post = db.session.get(
        Post,
        post_id
    )

    if not post:
        return {
            "message": "Post not found"
        }, 404

    additional_story = AdditionalStory(
        post_id=post_id,
        title=title.strip(),
        content=content.strip()
    )

    db.session.add(
        additional_story
    )

    db.session.commit()

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
def get_additional_stories(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    if not post:
        return {
            "message": "Post not found"
        }, 404

    stories = (
        AdditionalStory.query
        .filter_by(post_id=post_id)
        .order_by(
            AdditionalStory.created_at.asc()
        )
        .all()
    )

    stories_data = []

    for story in stories:
        stories_data.append({
            "id": story.id,
            "title": story.title,
            "content": story.content,
            "created_at": story.created_at
        })

    return stories_data, 200