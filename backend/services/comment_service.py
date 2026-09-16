from database import db
from models import Comment


def create_comment(post_id, name, content):
    try:
        comment = Comment(
            post_id=post_id,
            name=name.strip(),
            content=content.strip()
        )

        db.session.add(comment)
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
