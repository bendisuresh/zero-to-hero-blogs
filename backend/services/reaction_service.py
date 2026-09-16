from database import db


def like_post(post):
    try:
        if post.likes is None:
            post.likes = 0

        post.likes += 1

        db.session.commit()

        return post.likes

    except Exception:
        db.session.rollback()
        raise


def dislike_post(post):
    try:
        if post.dislikes is None:
            post.dislikes = 0

        post.dislikes += 1

        db.session.commit()

        return post.dislikes

    except Exception:
        db.session.rollback()
        raise


def record_view(post):
    try:
        if post.views is None:
            post.views = 0

        post.views += 1

        db.session.commit()

        return post.views

    except Exception:
        db.session.rollback()
        raise