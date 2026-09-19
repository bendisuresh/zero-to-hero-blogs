def serialize_post(post):
    return {
        "id": post.id,
        "title": post.title,
        "description": post.description,
        "category": post.category,
        "storyteller": post.storyteller,
        "storyteller_email": post.storyteller_email,
        "image_url": post.image_url,
        "created_at": (
            post.created_at.isoformat()
            if post.created_at
            else None
        ),
        "starting_point": post.starting_point,
        "how_started": post.how_started,
        "financial_info": post.financial_info,
        "approach": post.approach,
        "life_changed": post.life_changed,
        "failures": post.failures,
        "lessons": post.lessons,
        "views": post.views or 0,
        "likes": post.likes or 0,
        "dislikes": post.dislikes or 0,
        "tags": post.tags
    }


def serialize_post_summary(post):
    return {
        "id": post.id,
        "title": post.title,
        "description": post.description,
        "category": post.category,
        "storyteller": post.storyteller,
        "storyteller_email": post.storyteller_email,
        "image_url": post.image_url,
        "created_at": (
            post.created_at.isoformat()
            if post.created_at
            else None
        ),
        "views": post.views or 0,
        "likes": post.likes or 0,
        "dislikes": post.dislikes or 0,
        "tags": post.tags
    }


def serialize_admin_post(post):
    data = serialize_post(post)

    data["status"] = post.status

    data["published_at"] = (
        post.published_at.isoformat()
        if post.published_at
        else None
    )

    return data