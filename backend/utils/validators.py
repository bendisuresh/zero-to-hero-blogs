import bleach


# ============================================================
# RICH TEXT SANITIZATION
# ============================================================

def sanitize_rich_text(html):
    """
    Allow only the HTML formatting used by our Tiptap editor.
    Dangerous HTML such as <script> is removed.
    """

    allowed_tags = [
        "p",
        "h2",
        "h3",
        "strong",
        "em",
        "ul",
        "ol",
        "li",
        "a",
        "img"
    ]

    allowed_attributes = {
        "a": [
            "href",
            "target",
            "rel"
        ],
        "img": [
            "src",
            "alt",
            "title"
        ]
    }

    return bleach.clean(
        html,
        tags=allowed_tags,
        attributes=allowed_attributes,
        protocols=[
            "http",
            "https"
        ],
        strip=True
    )


# ============================================================
# POST VALIDATION
# ============================================================

def validate_post_data(data):
    """
    Validate the basic fields required for a blog post.

    Returns:
        None if valid
        Error message if invalid
    """

    # Make sure request body exists
    if not data:
        return "Request body is required"

    allowed_categories = {
        "Business",
        "Job",
        "Investment",
        "Other"
    }

    # Check category
    if data.get("category") not in allowed_categories:
        return "Invalid category"

    required_fields = [
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

    # Check required fields
    for field in required_fields:

        value = data.get(field)

        if not isinstance(value, str):
            return f"{field} is required"

        if not value.strip():
            return f"{field} is required"

    # Storyteller email is optional
    storyteller_email = data.get(
        "storyteller_email",
        ""
    )

    # Prevent None from causing .strip() error
    if storyteller_email is None:
        storyteller_email = ""

    if not isinstance(storyteller_email, str):
        return "Storyteller email must be text"

    storyteller_email = storyteller_email.strip()

    if len(storyteller_email) > 255:
        return "Storyteller email must be 255 characters or less"

    # Check field lengths
    if len(data["title"].strip()) > 200:
        return "Title must be 200 characters or less"

    if len(data["category"].strip()) > 50:
        return "Category must be 50 characters or less"

    if len(data["storyteller"].strip()) > 100:
        return "Storyteller must be 100 characters or less"

    if len(data["financial_info"].strip()) > 1000:
        return "Financial info must be 1000 characters or less"

    if len(data.get("tags", "").strip()) > 300:
        return "Tags must be 300 characters or less"

    return None