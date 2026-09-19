from database import db
from models import Comment


def create_comment(post_id, name, content):
    try:
        comment = Comment(
            post_id=post_id,
            name=name.strip(),
            content=content.strip(),
            status="pending"
        )

        db.session.add(comment)
        db.session.commit()

        return comment

    except Exception:
        db.session.rollback()
        raise


def update_comment_status(comment, status):
    try:
        comment.status = status

        db.session.commit()

        return comment

    except Exception:
        db.session.rollback()
        raise


def delete_comment(comment):
    try:
        db.session.delete(comment)
        db.session.commit()

    except Exception:
        db.session.rollback()
        raise