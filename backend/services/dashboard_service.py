from database import db
from models import Post, Comment


def get_dashboard_summary():
    total_stories = db.session.query(
        db.func.count(Post.id)
    ).scalar()

    total_comments = db.session.query(
        db.func.count(Comment.id)
    ).scalar()

    total_views = db.session.query(
        db.func.coalesce(
            db.func.sum(Post.views),
            0
        )
    ).scalar()

    total_likes = db.session.query(
        db.func.coalesce(
            db.func.sum(Post.likes),
            0
        )
    ).scalar()

    return {
        "total_stories": total_stories or 0,
        "total_comments": total_comments or 0,
        "total_views": total_views or 0,
        "total_likes": total_likes or 0,
    }