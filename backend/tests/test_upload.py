import io

from flask_jwt_extended import create_access_token


def test_admin_can_upload_image(client, admin_token):
    response = client.post(
        "/api/admin/upload",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        data={
            "image": (
                io.BytesIO(b"fake image content"),
                "test.jpg"
            )
        },
        content_type="multipart/form-data"
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["message"] == "Image uploaded successfully"
    assert "image_url" in data


def test_anonymous_cannot_upload_image(client):
    response = client.post(
        "/api/admin/upload",
        data={},
        content_type="multipart/form-data"
    )

    assert response.status_code == 401


def test_non_admin_cannot_upload_image(client, app):
    with app.app_context():
        user_token = create_access_token(
            identity="user@test.com",
            additional_claims={
                "role": "user"
            }
        )

    response = client.post(
        "/api/admin/upload",
        headers={
            "Authorization": f"Bearer {user_token}"
        },
        data={},
        content_type="multipart/form-data"
    )

    assert response.status_code == 403


def test_upload_without_image(client, admin_token):
    response = client.post(
        "/api/admin/upload",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        data={},
        content_type="multipart/form-data"
    )

    assert response.status_code == 400

    data = response.get_json()

    assert data["message"] == "No image file provided"


def test_upload_invalid_image_type(client, admin_token):
    response = client.post(
        "/api/admin/upload",
        headers={
            "Authorization": f"Bearer {admin_token}"
        },
        data={
            "image": (
                io.BytesIO(b"fake text content"),
                "test.txt"
            )
        },
        content_type="multipart/form-data"
    )

    assert response.status_code == 400

    data = response.get_json()

    assert "Invalid image type" in data["message"]