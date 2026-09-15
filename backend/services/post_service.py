from database import db
from models import Post


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
    