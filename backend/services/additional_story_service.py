from database import db
from models import Post, AdditionalStory


def create_additional_story(post_id, title, content):
    post = db.session.get(Post, post_id)

    if not post:
        return None

    additional_story = AdditionalStory(
        post_id=post_id,
        title=title.strip(),
        content=content.strip()
    )

    try:
        db.session.add(additional_story)
        db.session.commit()
        return additional_story

    except Exception:
        db.session.rollback()
        raise


def get_additional_stories(post_id):
    post = db.session.get(Post, post_id)

    if not post:
        return None

    stories = (
        AdditionalStory.query
        .filter_by(post_id=post_id)
        .order_by(
            AdditionalStory.created_at.asc()
        )
        .all()
    )

    return stories