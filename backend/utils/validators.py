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