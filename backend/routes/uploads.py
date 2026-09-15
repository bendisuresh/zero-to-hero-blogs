import os
import uuid

from flask import Blueprint, request, send_from_directory, current_app
from routes.auth import admin_required
from werkzeug.utils import secure_filename


uploads_bp = Blueprint(
    "uploads",
    __name__
)


# ============================================================
# IMAGE FILE VALIDATION
# ============================================================

ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp"
}


def allowed_file(filename):
    """
    Check whether the uploaded file has an allowed extension.
    """
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# ============================================================
# IMAGE UPLOAD
# ============================================================

@uploads_bp.route(
    "/api/admin/upload",
    methods=["POST"]
)
@admin_required()
def upload_image():

    # Check whether request contains an image
    if "image" not in request.files:
        return {
            "message": "No image file provided"
        }, 400

    image = request.files["image"]

    # Check whether a file was selected
    if image.filename == "":
        return {
            "message": "No image selected"
        }, 400

    # Check file extension
    if not allowed_file(image.filename):
        return {
            "message": (
                "Invalid image type. "
                "Allowed: png, jpg, jpeg, gif, webp"
            )
        }, 400

    # Make original filename safe
    original_filename = secure_filename(
        image.filename
    )

    # Extract extension
    file_extension = os.path.splitext(
        original_filename
    )[1].lower()

    # Generate unique filename
    filename = (
        f"{uuid.uuid4().hex}"
        f"{file_extension}"
    )

    # Create complete file path
    image_path = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        filename
    )

    # Save image
    image.save(image_path)

    # Backend URL comes from environment
    backend_url = os.getenv(
        "BACKEND_URL",
        "http://127.0.0.1:5000"
    )

    # Create URL for frontend
    image_url = (
        f"{backend_url}/uploads/{filename}"
    )

    return {
        "message": "Image uploaded successfully",
        "image_url": image_url
    }, 201


# ============================================================
# SERVE UPLOADED IMAGES
# ============================================================

@uploads_bp.route(
    "/uploads/<path:filename>"
)
def uploaded_file(filename):

    return send_from_directory(
        current_app.config["UPLOAD_FOLDER"],
        filename
    )