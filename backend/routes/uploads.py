

from flask import Blueprint, request, send_from_directory, current_app
from routes.auth import admin_required
from services.upload_service import (
    allowed_file,
    upload_image as upload_image_service
)

uploads_bp = Blueprint(
    "uploads",
    __name__
)


# ============================================================
# IMAGE FILE VALIDATION
# ============================================================



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
    image_url = upload_image_service(image)

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