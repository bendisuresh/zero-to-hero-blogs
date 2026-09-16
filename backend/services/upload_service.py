import os
import uuid

from flask import current_app
from werkzeug.utils import secure_filename


ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp"
}


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


def upload_image(image):
    original_filename = secure_filename(
        image.filename
    )

    file_extension = os.path.splitext(
        original_filename
    )[1].lower()

    filename = (
        f"{uuid.uuid4().hex}"
        f"{file_extension}"
    )

    image_path = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        filename
    )

    image.save(image_path)

    backend_url = os.getenv(
        "BACKEND_URL",
        "http://127.0.0.1:5000"
    )

    image_url = (
        f"{backend_url}/uploads/{filename}"
    )

    return image_url