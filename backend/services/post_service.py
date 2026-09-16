from datetime import datetime, timezone

from database import db
from models import (
    Post,
    AdditionalStory,
    Comment
)

def create_post(data):
    try:
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
            lessons=data["lessons"],
            tags=data.get(
                "tags",
                ""
            ).strip()
        )

        db.session.add(post)
        db.session.commit()

        return post

    except Exception:
        db.session.rollback()
        raise


def update_post(post, data):
    try:
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
        post.lessons = data["lessons"]

        if "tags" in data:
            post.tags = data["tags"].strip()

        db.session.commit()

        return post

    except Exception:
        db.session.rollback()
        raise

def delete_post(post):
    try:
        current_time = datetime.now(timezone.utc)

        created_at = post.created_at

        if created_at.tzinfo is None:
            created_at = created_at.replace(
                tzinfo=timezone.utc
            )

        age = current_time - created_at

        if age.total_seconds() > 24 * 60 * 60:
            return False

        AdditionalStory.query.filter_by(
            post_id=post.id
        ).delete()

        Comment.query.filter_by(
            post_id=post.id
        ).delete()

        db.session.delete(post)
        db.session.commit()

        return True

    except Exception:
        db.session.rollback()
        raise

def get_posts(
    category=None,
    search="",
    sort="latest",
    page=1,
    limit=10
):
    query = Post.query

    if category:
        query = query.filter_by(
            category=category
        )

    if search:
        search_pattern = f"%{search}%"

        query = query.filter(
            db.or_(
                Post.title.ilike(search_pattern),
                Post.description.ilike(search_pattern),
                Post.storyteller.ilike(search_pattern),
                Post.category.ilike(search_pattern),
                Post.tags.ilike(search_pattern)
            )
        )

    if sort == "popular":
        query = query.order_by(
            (
                db.func.coalesce(Post.views, 0)
                + db.func.coalesce(Post.likes, 0)
                - db.func.coalesce(Post.dislikes, 0)
            ).desc()
        )
    else:
        query = query.order_by(
            Post.created_at.desc()
        )

    pagination = (
        query
        .paginate(
            page=page,
            per_page=limit,
            error_out=False
        )
    )

    return pagination