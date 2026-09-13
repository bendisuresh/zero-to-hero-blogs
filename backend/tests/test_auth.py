from flask_jwt_extended import create_access_token
def test_non_admin_cannot_create_post(client, app):
    with app.app_context():
        user_token = create_access_token(
            identity="user@test.com",
            additional_claims={"role": "user"}
        )

    response = client.post(
        "/api/admin/posts",
        headers={
            "Authorization": f"Bearer {user_token}"
        },
        json={
            "title": "Non Admin Post",
            "description": "This should fail",
            "category": "Business",
            "storyteller": "Test User",
            "storyteller_email": "user@test.com",
            "starting_point": "Test",
            "how_started": "Test",
            "financial_info": "Test",
            "approach": "Test",
            "life_changed": "Test",
            "failures": "Test",
            "lessons": "Test",
            "tags": "testing"
        }
    )

    assert response.status_code == 403
def test_admin_login_returns_token(client, admin):
    response = client.post(
        "/api/admin/login",
        json={
            "email": "admin@test.com",
            "password": "testpassword"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "access_token" in data


def test_anonymous_cannot_create_post(client):
    response = client.post(
        "/api/admin/posts",
        json={
            "title": "Unauthorized Post",
            "description": "This should fail",
            "category": "Test",
            "storyteller": "Anonymous",
            "storyteller_email": "anonymous@test.com",
            "starting_point": "Test",
            "how_started": "Test",
            "financial_info": "Test",
            "approach": "Test",
            "life_changed": "Test",
            "failures": "Test",
            "lessons": "Test",
        }
    )

    assert response.status_code == 401


def test_authenticated_admin_can_create_post(client, admin_token):
    response = client.post(
        "/api/admin/posts",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        json={
            "title": "Authenticated Test Post",
            "description": "Testing authenticated post creation",
            "category": "Business",
            "storyteller": "Test Storyteller",
            "storyteller_email": "story@test.com",
            "starting_point": "Started with an idea",
            "how_started": "Started building the project",
            "financial_info": "Initial investment",
            "approach": "Built step by step",
            "life_changed": "Improved technical skills",
            "failures": "Some initial failures",
            "lessons": "Learned from those failures",
            "tags": "python,flask,testing"
        }
    )

    assert response.status_code in [200, 201], response.get_json()

    data = response.get_json()

    assert data is not None