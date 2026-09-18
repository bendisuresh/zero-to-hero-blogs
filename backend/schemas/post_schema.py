ALLOWED_CATEGORIES = {
    "Business",
    "Job",
    "Investment",
    "Other"
}

REQUIRED_FIELDS = [
    "title",
    "description",
    "category",
    "storyteller",
    "starting_point",
    "how_started",
    "financial_info",
    "approach",
    "life_changed",
    "failures",
    "lessons"
]


def validate_post(data):
    """
    Validate the request data required to create or update a post.

    Returns:
        None if valid.
        Error message if invalid.
    """

    if not data:
        return "Request body is required"
    status = data.get(
        "status",
        "published"
    )

    if status not in {"draft", "published"}:
        return "Invalid status"

    if data.get("category") not in ALLOWED_CATEGORIES:
        return "Invalid category"

    for field in REQUIRED_FIELDS:
        value = data.get(field)

        if not isinstance(value, str):
            return f"{field} is required"

        if not value.strip():
            return f"{field} is required"

    storyteller_email = data.get(
        "storyteller_email",
        ""
    )

    if storyteller_email is None:
        storyteller_email = ""

    if not isinstance(storyteller_email, str):
        return "Storyteller email must be text"

    storyteller_email = storyteller_email.strip()

    if len(storyteller_email) > 255:
        return (
            "Storyteller email must be "
            "255 characters or less"
        )

    if len(data["title"].strip()) > 200:
        return "Title must be 200 characters or less"

    if len(data["category"].strip()) > 50:
        return "Category must be 50 characters or less"

    if len(data["storyteller"].strip()) > 100:
        return (
            "Storyteller must be "
            "100 characters or less"
        )

    if len(data["financial_info"].strip()) > 1000:
        return (
            "Financial info must be "
            "1000 characters or less"
        )

    if len(data.get("tags", "").strip()) > 300:
        return "Tags must be 300 characters or less"
    image_url = data.get(
        "image_url",
        ""
    )

    if image_url is None:
        image_url = ""

    if not isinstance(image_url, str):
        return "Image URL must be text"

    if len(image_url.strip()) > 500:
        return (
            "Image URL must be "
            "500 characters or less"
        )

    return None