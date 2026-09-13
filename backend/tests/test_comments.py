def post_payload():
    return {
        "title": "Comment Test Post",
        "description": "Post used for comment testing",
        "category": "Business",
        "storyteller": "Test Storyteller",
        "storyteller_email": "story@test.com",
        "starting_point": "Started with an idea",
        "how_started": "Started building",
        "financial_info": "Initial investment",
        "approach": "Built step by step",
        "life_changed": "Learned new skills",
        "failures": "Made some mistakes",
        "lessons": "Learned from mistakes",
        "tags": "testing"
    }


def create_test_post(client, admin_token):
    response = client.post(
        "/api/admin/posts",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json=post_payload()
    )

    assert response.status_code == 201

    return response.get_json()["post_id"]


def test_create_comment(client, admin_token):
    post_id = create_test_post(client, admin_token)

    response = client.post(
        f"/api/posts/{post_id}/comments",
        json={
            "name": "Test User",
            "content": "This is a test comment"
        }
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["message"] == "Comment added successfully"
    assert "comment_id" in data


def test_get_comments(client, admin_token):
    post_id = create_test_post(client, admin_token)

    client.post(
        f"/api/posts/{post_id}/comments",
        json={
            "name": "Test User",
            "content": "This is a test comment"
        }
    )

    response = client.get(
        f"/api/posts/{post_id}/comments"
    )

    assert response.status_code == 200

    comments = response.get_json()

    assert len(comments) == 1
    assert comments[0]["name"] == "Test User"
    assert comments[0]["content"] == "This is a test comment"


def test_create_comment_without_name(client, admin_token):
    post_id = create_test_post(client, admin_token)

    response = client.post(
        f"/api/posts/{post_id}/comments",
        json={
            "content": "Comment without a name"
        }
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["message"] == "Name and content are required"


def test_create_comment_for_missing_post(client):
    response = client.post(
        "/api/posts/9999/comments",
        json={
            "name": "Test User",
            "content": "Comment for missing post"
        }
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["message"] == "Post not found"


def create_test_comment(client, admin_token):
    post_id = create_test_post(client, admin_token)

    response = client.post(
        f"/api/posts/{post_id}/comments",
        json={
            "name": "Test User",
            "content": "Comment to be deleted"
        }
    )

    assert response.status_code == 201

    return response.get_json()["comment_id"]


def test_anonymous_cannot_delete_comment(client, admin_token):
    comment_id = create_test_comment(client, admin_token)

    response = client.delete(
        f"/api/admin/comments/{comment_id}"
    )

    assert response.status_code == 401


def test_non_admin_cannot_delete_comment(client, app, admin_token):
    comment_id = create_test_comment(client, admin_token)

    from flask_jwt_extended import create_access_token

    with app.app_context():
        user_token = create_access_token(
            identity="user@test.com",
            additional_claims={
                "role": "user"
            }
        )

    response = client.delete(
        f"/api/admin/comments/{comment_id}",
        headers={
            "Authorization": f"Bearer {user_token}"
        }
    )

    assert response.status_code == 403


def test_admin_can_delete_comment(client, admin_token):
    comment_id = create_test_comment(client, admin_token)

    response = client.delete(
        f"/api/admin/comments/{comment_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Comment deleted successfully"