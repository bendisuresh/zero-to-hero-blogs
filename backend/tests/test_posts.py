from flask_jwt_extended import create_access_token


def post_payload():
    return {
        "title": "Test Blog Post",
        "description": "A test blog post for API testing",
        "category": "Business",
        "storyteller": "Test Storyteller",
        "storyteller_email": "story@test.com",
        "starting_point": "Started with an idea",
        "how_started": "Started building the project",
        "financial_info": "Initial investment",
        "approach": "Built step by step",
        "life_changed": "Improved technical skills",
        "failures": "Made some mistakes",
        "lessons": "Learned from those mistakes",
        "tags": "python,flask,testing"
    }


def create_test_post(client, admin_token):
    response = client.post(
        "/api/admin/posts",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json=post_payload()
    )

    assert response.status_code == 201, response.get_json()

    return response.get_json()["post_id"]


def test_admin_can_update_post(client, admin_token):
    post_id = create_test_post(client, admin_token)

    updated_data = post_payload()
    updated_data["title"] = "Updated Test Blog Post"
    updated_data["description"] = "Updated description"

    response = client.put(
        f"/api/admin/posts/{post_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json=updated_data
    )

    assert response.status_code == 200
    data = response.get_json()

    assert data["message"] == "Story updated successfully"
    assert data["post_id"] == post_id

    # Verify the update actually happened
    get_response = client.get(
        f"/api/posts/{post_id}"
    )

    assert get_response.status_code == 200

    post = get_response.get_json()

    assert post["title"] == "Updated Test Blog Post"
    assert post["description"] == "Updated description"


def test_admin_can_delete_post(client, admin_token):
    post_id = create_test_post(client, admin_token)

    response = client.delete(
        f"/api/admin/posts/{post_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Story deleted successfully"

    # Verify the post no longer exists
    get_response = client.get(
        f"/api/posts/{post_id}"
    )

    assert get_response.status_code == 404


def test_anonymous_cannot_update_post(client):
    response = client.put(
        "/api/admin/posts/1",
        json=post_payload()
    )

    assert response.status_code == 401


def test_anonymous_cannot_delete_post(client):
    response = client.delete(
        "/api/admin/posts/1"
    )

    assert response.status_code == 401


def test_non_admin_cannot_update_post(client, app):
    with app.app_context():
        user_token = create_access_token(
            identity="user@test.com",
            additional_claims={
                "role": "user"
            }
        )

    response = client.put(
        "/api/admin/posts/1",
        headers={
            "Authorization": f"Bearer {user_token}"
        },
        json=post_payload()
    )

    assert response.status_code == 403


def test_non_admin_cannot_delete_post(client, app):
    with app.app_context():
        user_token = create_access_token(
            identity="user@test.com",
            additional_claims={
                "role": "user"
            }
        )

    response = client.delete(
        "/api/admin/posts/1",
        headers={
            "Authorization": f"Bearer {user_token}"
        }
    )

    assert response.status_code == 403


def test_admin_cannot_create_post_with_invalid_category(
    client,
    admin_token
):
    data = post_payload()
    data["category"] = "Technology"

    response = client.post(
        "/api/admin/posts",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json=data
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["message"] == "Invalid category"


def test_admin_cannot_create_post_without_required_field(
    client,
    admin_token
):
    data = post_payload()

    del data["title"]

    response = client.post(
        "/api/admin/posts",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json=data
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["message"] == "title is required"


def test_admin_cannot_update_post_with_invalid_category(
    client,
    admin_token
):
    post_id = create_test_post(client, admin_token)

    data = post_payload()
    data["category"] = "Technology"

    response = client.put(
        f"/api/admin/posts/{post_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json=data
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["message"] == "Invalid category"


def test_get_posts_returns_paginated_response(
    client,
    admin_token
):
    for index in range(15):
        data = post_payload()
        data["title"] = f"Test Post {index}"

        response = client.post(
            "/api/admin/posts",
            headers={
                "Authorization": (
                    f"Bearer {admin_token}"
                )
            },
            json=data
        )

        assert response.status_code == 201

    response = client.get(
        "/api/posts?page=1&limit=10"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "posts" in data
    assert "page" in data
    assert "total_pages" in data

    assert data["page"] == 1
    assert data["total_pages"] == 2
    assert len(data["posts"]) == 10


def test_get_posts_returns_second_page(
    client,
    admin_token
):
    for index in range(15):
        data = post_payload()
        data["title"] = f"Test Post {index}"

        response = client.post(
            "/api/admin/posts",
            headers={
                "Authorization": (
                    f"Bearer {admin_token}"
                )
            },
            json=data
        )

        assert response.status_code == 201

    response = client.get(
        "/api/posts?page=2&limit=10"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["page"] == 2
    assert data["total_pages"] == 2
    assert len(data["posts"]) == 5


def test_get_posts_handles_invalid_pagination_values(
    client,
    admin_token
):
    for index in range(3):
        data = post_payload()
        data["title"] = f"Test Post {index}"

        response = client.post(
            "/api/admin/posts",
            headers={
                "Authorization": (
                    f"Bearer {admin_token}"
                )
            },
            json=data
        )

        assert response.status_code == 201

    response = client.get(
        "/api/posts?page=0&limit=0"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["page"] == 1
    assert data["total_pages"] == 1
    assert len(data["posts"]) == 3


def test_get_posts_supports_category_with_pagination(
    client,
    admin_token
):
    categories = [
        "Business",
        "Business",
        "Business",
        "Job",
        "Job"
    ]

    for index, category in enumerate(categories):
        data = post_payload()
        data["title"] = f"Category Test Post {index}"
        data["category"] = category

        response = client.post(
            "/api/admin/posts",
            headers={
                "Authorization": (
                    f"Bearer {admin_token}"
                )
            },
            json=data
        )

        assert response.status_code == 201

    response = client.get(
        "/api/posts"
        "?category=Business&page=1&limit=2"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["page"] == 1
    assert data["total_pages"] == 2
    assert len(data["posts"]) == 2

    for post in data["posts"]:
        assert post["category"] == "Business"
def test_get_posts_supports_latest_sort(
    client,
    admin_token
):
    for index in range(3):
        data = post_payload()
        data["title"] = f"Latest Test Post {index}"

        response = client.post(
            "/api/admin/posts",
            headers={
                "Authorization": f"Bearer {admin_token}"
            },
            json=data
        )

        assert response.status_code == 201

    response = client.get(
        "/api/posts?sort=latest"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["posts"][0]["title"] == "Latest Test Post 2"
    assert data["posts"][1]["title"] == "Latest Test Post 1"
    assert data["posts"][2]["title"] == "Latest Test Post 0"


def test_get_posts_supports_popular_sort(
    client,
    admin_token,
    app
):
    post_ids = []

    for index in range(3):
        data = post_payload()
        data["title"] = f"Popular Test Post {index}"

        response = client.post(
            "/api/admin/posts",
            headers={
                "Authorization": f"Bearer {admin_token}"
            },
            json=data
        )

        assert response.status_code == 201
        post_ids.append(response.get_json()["post_id"])

    with app.app_context():
        from models import Post
        from database import db

        post_1 = db.session.get(Post, post_ids[0])
        post_2 = db.session.get(Post, post_ids[1])
        post_3 = db.session.get(Post, post_ids[2])

        post_1.views = 10
        post_1.likes = 2
        post_1.dislikes = 0

        post_2.views = 30
        post_2.likes = 5
        post_2.dislikes = 1

        post_3.views = 20
        post_3.likes = 1
        post_3.dislikes = 0

        db.session.commit()

    response = client.get(
        "/api/posts?sort=popular"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["posts"][0]["title"] == "Popular Test Post 1"
    assert data["posts"][1]["title"] == "Popular Test Post 2"
    assert data["posts"][2]["title"] == "Popular Test Post 0"