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


def create_test_comment(client, admin_token):
    post_id = create_test_post(client, admin_token)

    response = client.post(
        f"/api/posts/{post_id}/comments",
        json={
            "name": "Test User",
            "content": "Comment to be moderated"
        }
    )

    assert response.status_code == 201

    return post_id, response.get_json()["comment_id"]


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

    assert data["message"] == "Comment submitted for moderation"
    assert "comment_id" in data
    assert data["status"] == "pending"


def test_pending_comment_is_not_publicly_visible(
    client,
    admin_token
):
    post_id, comment_id = create_test_comment(
        client,
        admin_token
    )

    assert comment_id is not None

    response = client.get(
        f"/api/posts/{post_id}/comments"
    )

    assert response.status_code == 200

    comments = response.get_json()

    assert comments == []


def test_approved_comment_is_publicly_visible(
    client,
    admin_token
):
    post_id, comment_id = create_test_comment(
        client,
        admin_token
    )

    approve_response = client.patch(
        f"/api/admin/comments/{comment_id}/status",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json={
            "status": "approved"
        }
    )

    assert approve_response.status_code == 200

    response = client.get(
        f"/api/posts/{post_id}/comments"
    )

    assert response.status_code == 200

    comments = response.get_json()

    assert len(comments) == 1
    assert comments[0]["name"] == "Test User"
    assert comments[0]["content"] == "Comment to be moderated"


def test_rejected_comment_is_not_publicly_visible(
    client,
    admin_token
):
    post_id, comment_id = create_test_comment(
        client,
        admin_token
    )

    reject_response = client.patch(
        f"/api/admin/comments/{comment_id}/status",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json={
            "status": "rejected"
        }
    )

    assert reject_response.status_code == 200

    response = client.get(
        f"/api/posts/{post_id}/comments"
    )

    assert response.status_code == 200

    comments = response.get_json()

    assert comments == []


def test_admin_can_approve_comment(
    client,
    admin_token
):
    post_id, comment_id = create_test_comment(
        client,
        admin_token
    )

    response = client.patch(
        f"/api/admin/comments/{comment_id}/status",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json={
            "status": "approved"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == (
        "Comment status updated successfully"
    )
    assert data["comment_id"] == comment_id
    assert data["status"] == "approved"


def test_admin_can_reject_comment(
    client,
    admin_token
):
    post_id, comment_id = create_test_comment(
        client,
        admin_token
    )

    response = client.patch(
        f"/api/admin/comments/{comment_id}/status",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json={
            "status": "rejected"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["comment_id"] == comment_id
    assert data["status"] == "rejected"


def test_admin_can_reset_comment_to_pending(
    client,
    admin_token
):
    post_id, comment_id = create_test_comment(
        client,
        admin_token
    )

    approve_response = client.patch(
        f"/api/admin/comments/{comment_id}/status",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json={
            "status": "approved"
        }
    )

    assert approve_response.status_code == 200

    pending_response = client.patch(
        f"/api/admin/comments/{comment_id}/status",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json={
            "status": "pending"
        }
    )

    assert pending_response.status_code == 200

    data = pending_response.get_json()

    assert data["status"] == "pending"


def test_admin_cannot_set_invalid_comment_status(
    client,
    admin_token
):
    post_id, comment_id = create_test_comment(
        client,
        admin_token
    )

    response = client.patch(
        f"/api/admin/comments/{comment_id}/status",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json={
            "status": "invalid"
        }
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["message"] == (
        "Status must be pending, approved, "
        "or rejected"
    )


def test_anonymous_cannot_change_comment_status(
    client,
    admin_token
):
    post_id, comment_id = create_test_comment(
        client,
        admin_token
    )

    response = client.patch(
        f"/api/admin/comments/{comment_id}/status",
        json={
            "status": "approved"
        }
    )

    assert response.status_code == 401


def test_non_admin_cannot_change_comment_status(
    client,
    app,
    admin_token
):
    post_id, comment_id = create_test_comment(
        client,
        admin_token
    )

    from flask_jwt_extended import create_access_token

    with app.app_context():
        user_token = create_access_token(
            identity="user@test.com",
            additional_claims={
                "role": "user"
            }
        )

    response = client.patch(
        f"/api/admin/comments/{comment_id}/status",
        headers={
            "Authorization": f"Bearer {user_token}"
        },
        json={
            "status": "approved"
        }
    )

    assert response.status_code == 403


def test_admin_can_get_all_comments(
    client,
    admin_token
):
    comment_id = create_test_comment(
        client,
        admin_token
    )[1]

    response = client.get(
        "/api/admin/comments",
        headers={
            "Authorization": f"Bearer {admin_token}"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "comments" in data
    assert "total" in data
    assert data["total"] == 1
    assert len(data["comments"]) == 1
    assert data["comments"][0]["id"] == comment_id
    assert data["comments"][0]["post_title"] == (
        "Comment Test Post"
    )
    assert data["comments"][0]["name"] == "Test User"
    assert data["comments"][0]["content"] == (
        "Comment to be moderated"
    )
    assert data["comments"][0]["status"] == "pending"


def test_anonymous_cannot_get_all_comments(
    client,
    admin_token
):
    create_test_comment(
        client,
        admin_token
    )

    response = client.get(
        "/api/admin/comments"
    )

    assert response.status_code == 401


def test_non_admin_cannot_get_all_comments(
    client,
    app,
    admin_token
):
    create_test_comment(
        client,
        admin_token
    )

    from flask_jwt_extended import create_access_token

    with app.app_context():
        user_token = create_access_token(
            identity="user@test.com",
            additional_claims={
                "role": "user"
            }
        )

    response = client.get(
        "/api/admin/comments",
        headers={
            "Authorization": f"Bearer {user_token}"
        }
    )

    assert response.status_code == 403


def test_anonymous_cannot_delete_comment(
    client,
    admin_token
):
    comment_id = create_test_comment(
        client,
        admin_token
    )[1]

    response = client.delete(
        f"/api/admin/comments/{comment_id}"
    )

    assert response.status_code == 401


def test_non_admin_cannot_delete_comment(
    client,
    app,
    admin_token
):
    comment_id = create_test_comment(
        client,
        admin_token
    )[1]

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


def test_admin_can_delete_comment(
    client,
    admin_token
):
    comment_id = create_test_comment(
        client,
        admin_token
    )[1]

    response = client.delete(
        f"/api/admin/comments/{comment_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["message"] == "Comment deleted successfully"


def test_deleted_comment_no_longer_appears_in_admin_moderation(
    client,
    admin_token
):
    comment_id = create_test_comment(
        client,
        admin_token
    )[1]

    delete_response = client.delete(
        f"/api/admin/comments/{comment_id}",
        headers={
            "Authorization": f"Bearer {admin_token}"
        }
    )

    assert delete_response.status_code == 200

    comments_response = client.get(
        "/api/admin/comments",
        headers={
            "Authorization": f"Bearer {admin_token}"
        }
    )

    assert comments_response.status_code == 200

    data = comments_response.get_json()

    assert data["total"] == 0
    assert data["comments"] == []


def test_admin_comment_count_matches_comments_returned(
    client,
    admin_token
):
    post_id = create_test_post(
        client,
        admin_token
    )

    first_response = client.post(
        f"/api/posts/{post_id}/comments",
        json={
            "name": "First User",
            "content": "First moderation comment"
        }
    )

    second_response = client.post(
        f"/api/posts/{post_id}/comments",
        json={
            "name": "Second User",
            "content": "Second moderation comment"
        }
    )

    assert first_response.status_code == 201
    assert second_response.status_code == 201

    response = client.get(
        "/api/admin/comments",
        headers={
            "Authorization": f"Bearer {admin_token}"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["total"] == 2
    assert len(data["comments"]) == 2