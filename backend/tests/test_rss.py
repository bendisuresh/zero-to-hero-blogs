from database import db
from models import Post


def create_test_post(
    title="Test RSS Story",
    status="published"
):
    post = Post(
        title=title,
        description="RSS test description",
        category="Business",
        storyteller="RSS Test User",
        storyteller_email="rss@example.com",
        starting_point="Starting point",
        how_started="How it started",
        financial_info="Financial information",
        approach="Approach",
        life_changed="Life changed",
        failures="Failures",
        lessons="Lessons",
        status=status
    )

    db.session.add(post)
    db.session.commit()

    return post


def test_rss_feed_returns_successful_response(
    client
):
    response = client.get("/api/rss")

    assert response.status_code == 200


def test_rss_feed_returns_rss_content_type(
    client
):
    response = client.get("/api/rss")

    assert response.status_code == 200
    assert "application/rss+xml" in response.content_type


def test_rss_feed_contains_rss_structure(
    client
):
    response = client.get("/api/rss")

    data = response.data.decode("utf-8")

    assert '<?xml version="1.0" encoding="UTF-8"?>' in data
    assert '<rss version="2.0">' in data
    assert "<channel>" in data
    assert "</channel>" in data
    assert "</rss>" in data


def test_rss_feed_contains_published_post(
    client,
    app
):
    with app.app_context():
        post = create_test_post(
            title="Published RSS Story",
            status="published"
        )

        response = client.get("/api/rss")

    assert response.status_code == 200

    data = response.data.decode("utf-8")

    assert "Published RSS Story" in data
    assert "RSS test description" in data
    assert "Business" in data
    assert f"/post/{post.id}" in data


def test_rss_feed_excludes_draft_post(
    client,
    app
):
    with app.app_context():
        create_test_post(
            title="Draft RSS Story",
            status="draft"
        )

        response = client.get("/api/rss")

    assert response.status_code == 200

    data = response.data.decode("utf-8")

    assert "Draft RSS Story" not in data


def test_rss_feed_includes_published_post_and_excludes_draft(
    client,
    app
):
    with app.app_context():
        create_test_post(
            title="Visible Published Story",
            status="published"
        )

        create_test_post(
            title="Hidden Draft Story",
            status="draft"
        )

        response = client.get("/api/rss")

    data = response.data.decode("utf-8")

    assert "Visible Published Story" in data
    assert "Hidden Draft Story" not in data


def test_rss_feed_contains_post_guid_and_link(
    client,
    app
):
    with app.app_context():
        post = create_test_post(
            title="RSS Link Story",
            status="published"
        )

        response = client.get("/api/rss")

    data = response.data.decode("utf-8")

    expected_url = f"/post/{post.id}"

    assert expected_url in data


def test_rss_feed_contains_category(
    client,
    app
):
    with app.app_context():
        create_test_post(
            title="Category RSS Story",
            status="published"
        )

        response = client.get("/api/rss")

    data = response.data.decode("utf-8")

    assert "Business" in data


def test_rss_feed_contains_language(
    client
):
    response = client.get("/api/rss")

    data = response.data.decode("utf-8")

    assert "<language>en</language>" in data