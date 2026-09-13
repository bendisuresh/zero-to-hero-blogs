def post_payload():
    return {
        "title": "Reaction Test Post",
        "description": "Post used for reaction testing",
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


def test_like_post(client, admin_token):
    post_id = create_test_post(client, admin_token)

    response = client.post(
        f"/api/posts/{post_id}/like"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Post liked successfully"
    assert data["likes"] == 1


def test_dislike_post(client, admin_token):
    post_id = create_test_post(client, admin_token)

    response = client.post(
        f"/api/posts/{post_id}/dislike"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Post disliked successfully"
    assert data["dislikes"] == 1


def test_like_missing_post(client):
    response = client.post(
        "/api/posts/9999/like"
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["message"] == "Post not found"


def test_dislike_missing_post(client):
    response = client.post(
        "/api/posts/9999/dislike"
    )

    assert response.status_code == 404

    data = response.get_json()

    assert data["message"] == "Post not found"