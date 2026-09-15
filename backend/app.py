import os
from datetime import datetime
from functools import wraps

import bleach
from dotenv import load_dotenv
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from routes.auth import auth_bp, admin_required
from routes.posts import posts_bp
from routes.comments import comments_bp
from routes.reactions import reactions_bp
from routes.uploads import uploads_bp
from routes.rss import rss_bp
from routes.additional_stories import additional_stories_bp
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from werkzeug.security import (
    check_password_hash,
    generate_password_hash
)


from database import db
from models import Post, Admin,AdditionalStory , Comment


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# CREATE FLASK APPLICATION
# ============================================================

app = Flask(__name__)


# ============================================================
# IMAGE UPLOAD CONFIGURATION
# ============================================================

# Folder where uploaded images will be stored
UPLOAD_FOLDER = os.path.join(
    app.root_path,
    "uploads"
)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# Allowed image extensions
ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp"
}


# Create uploads folder if it does not already exist
os.makedirs(
    app.config["UPLOAD_FOLDER"],
    exist_ok=True
)


# ============================================================
# CORS
# ============================================================

# Local frontend URLs
# Production frontend URL comes from .env
frontend_url = os.getenv("FRONTEND_URL")

allowed_origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173"
]

if frontend_url:
    allowed_origins.append(frontend_url)

CORS(
    app,
    origins=allowed_origins
)


# ============================================================
# DATABASE CONFIGURATION
# ============================================================

# Database URL comes from .env
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

if os.getenv("TESTING") == "1":
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"


# ============================================================
# JWT CONFIGURATION
# ============================================================

app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY"
)


# ============================================================
# INITIALIZE EXTENSIONS
# ============================================================

db.init_app(app)

jwt = JWTManager(app)
app.register_blueprint(auth_bp)
app.register_blueprint(posts_bp)
app.register_blueprint(additional_stories_bp)
app.register_blueprint(comments_bp)
app.register_blueprint(reactions_bp)
app.register_blueprint(uploads_bp)
app.register_blueprint(rss_bp)

# ============================================================
# CREATE DATABASE TABLES
# ============================================================

with app.app_context():
    db.create_all()


# ============================================================
# RICH TEXT SANITIZATION
# ============================================================

# ============================================================
# IMAGE FILE VALIDATION
# ============================================================




# ============================================================
# HOME
# ============================================================

@app.route("/")
def home():

    return {
        "message": "Zero to Hero Blogs API is running!"
    }


# ============================================================
# GET ALL POSTS
# ============================================================



# ============================================================
# GET ONE POST
# ============================================================



# ============================================================
# CREATE POST
# ============================================================

# ============================================================
# ADMIN LOGIN
# ============================================================

# ============================================================
# ADMIN DASHBOARD
# ============================================================

@app.route(
    "/api/admin/dashboard",
    methods=["GET"]
)
@admin_required()
def admin_dashboard():

    current_admin = get_jwt_identity()

    return {
        "message": "Welcome to the admin dashboard",
        "admin": current_admin
    }, 200


# ============================================================
# ADMIN CREATE POST
# ============================================================



# ============================================================
# ADDITIONAL STORY
# ============================================================


# ============================================================
# DELETE POST
# ============================================================

@app.route(
    "/api/admin/posts/<int:post_id>",
    methods=["DELETE"]
)
@admin_required()
def delete_post(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    # Story does not exist
    if not post:

        return jsonify({
            "message": "Story not found"
        }), 404

    # Check when the story was created
    created_at = post.created_at

    # Current time
    current_time = datetime.utcnow()

    # Calculate how old the story is
    age = current_time - created_at

    # Delete is allowed only within 24 hours
    if age.total_seconds() > 24 * 60 * 60:

        return jsonify({
            "message": (
                "Stories can only be deleted "
                "within 24 hours of creation."
            )
        }), 403

    try:

        # Delete related additional stories first
        AdditionalStory.query.filter_by(
            post_id=post.id
        ).delete()

        # Delete related comments
        Comment.query.filter_by(
            post_id=post.id
        ).delete()

        # Delete the main post
        db.session.delete(post)

        db.session.commit()

        return jsonify({
            "message": "Story deleted successfully"
        }), 200

    except Exception:

        db.session.rollback()

        return jsonify({
            "message": "Failed to delete story"
        }), 500


# ============================================================
# UPDATE POST
# ============================================================



# ============================================================
# CREATE COMMENT
# ============================================================



# ============================================================
# LIKE POST
# ============================================================



# ============================================================
# IMAGE UPLOAD
# ============================================================



# ============================================================
# RSS FEED
# ============================================================



# ============================================================
# START FLASK SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )