from database import db
from models import Post


def create_test_post():
    post = Post(
        title="Test Story",
        description="Test description",
        category="Business",
        storyteller="Test User",
        storyteller_email="test@example.com",
        starting_point="Starting point",
        how_started="How it started",
        financial_info="Financial information",
        approach="Approach",
        life_changed="Life changed",
        failures="Failures",
        lessons="Lessons",
        status="published"
    )

    db.session.add(post)
    db.session.commit()

    return post


def test_admin_can_create_additional_story(
    client,
    admin_token,
    app
):
    with app.app_context():
        post = create_test_post()

        response = client.post(
            f"/api/admin/posts/{post.id}/additional-stories",
            json={
                "title": "My Additional Story",
                "content": "Additional story content."
            },
            headers={
                "Authorization": f"Bearer {admin_token}"
            }
        )

    assert response.status_code == 201

    data = response.get_json()

    assert data["message"] == (
        "Additional story added successfully"
    )

    assert "additional_story_id" in data


def test_anonymous_cannot_create_additional_story(
    client,
    app
):
    with app.app_context():
        post = create_test_post()

        response = client.post(
            f"/api/admin/posts/{post.id}/additional-stories",
            json={
                "title": "Unauthorized Story",
                "content": "Unauthorized content."
            }
        )

    assert response.status_code == 401


def test_admin_cannot_create_additional_story_without_body(
    client,
    admin_token,
    app
):
    with app.app_context():
        post = create_test_post()

        response = client.post(
            f"/api/admin/posts/{post.id}/additional-stories",
            headers={
                "Authorization": f"Bearer {admin_token}"
            }
        )

    assert response.status_code == 415


def test_admin_cannot_create_additional_story_without_title(
    client,
    admin_token,
    app
):
    with app.app_context():
        post = create_test_post()

        response = client.post(
            f"/api/admin/posts/{post.id}/additional-stories",
            json={
                "content": "Content without title."
            },
            headers={
                "Authorization": f"Bearer {admin_token}"
            }
        )

    assert response.status_code == 400

    data = response.get_json()

    assert data["message"] == (
        "Title and content are required"
    )


def test_admin_cannot_create_additional_story_without_content(
    client,
    admin_token,
    app
):
    with app.app_context():
        post = create_test_post()

        response = client.post(
            f"/api/admin/posts/{post.id}/additional-stories",
            json={
                "title": "Title without content"
            },
            headers={
                "Authorization": f"Bearer {admin_token}"
            }
        )

    assert response.status_code == 400

    data = response.get_json()

    assert data["message"] == (
        "Title and content are required"
    )


def test_admin_cannot_create_additional_story_for_missing_post(
    client,
    admin_token
):
    response = client.post(
        "/api/admin/posts/99999/additional-stories",
        json={
            "title": "Missing Post Story",
            "content": "Some content."
        },
        headers={
            "Authorization": f"Bearer {admin_token}"
        }
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["message"] == "Post not found"


def test_public_can_get_additional_stories(
    client,
    admin_token,
    app
):
    with app.app_context():
        post = create_test_post()

        create_response = client.post(
            f"/api/admin/posts/{post.id}/additional-stories",
            json={
                "title": "Additional Story",
                "content": "Additional content."
            },
            headers={
                "Authorization": f"Bearer {admin_token}"
            }
        )

        assert create_response.status_code == 201

        response = client.get(
            f"/api/posts/{post.id}/additional-stories"
        )

    assert response.status_code == 200

    data = response.get_json()

    assert len(data) == 1
    assert data[0]["title"] == "Additional Story"
    assert data[0]["content"] == "Additional content."


def test_public_get_returns_stories_in_creation_order(
    client,
    admin_token,
    app
):
    with app.app_context():
        post = create_test_post()

        first_response = client.post(
            f"/api/admin/posts/{post.id}/additional-stories",
            json={
                "title": "First Story",
                "content": "First content."
            },
            headers={
                "Authorization": f"Bearer {admin_token}"
            }
        )

        second_response = client.post(
            f"/api/admin/posts/{post.id}/additional-stories",
            json={
                "title": "Second Story",
                "content": "Second content."
            },
            headers={
                "Authorization": f"Bearer {admin_token}"
            }
        )

        assert first_response.status_code == 201
        assert second_response.status_code == 201

        response = client.get(
            f"/api/posts/{post.id}/additional-stories"
        )

    assert response.status_code == 200

    data = response.get_json()

    assert len(data) == 2
    assert data[0]["title"] == "First Story"
    assert data[1]["title"] == "Second Story"


def test_public_get_additional_stories_for_missing_post(
    client
):
    response = client.get(
        "/api/posts/99999/additional-stories"
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["message"] == "Post not found"