import os
import uuid
from datetime import datetime
from functools import wraps

import bleach
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory, Response
from flask_cors import CORS
from routes.auth import auth_bp, admin_required
from routes.posts import posts_bp
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
from werkzeug.utils import secure_filename

from database import db
from models import Post, Admin, AdditionalStory, Comment


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

@app.route(
    "/api/admin/posts/<int:post_id>/additional-stories",
    methods=["POST"]
)
@admin_required()
def add_additional_story(post_id):

    data = request.get_json()

    if not data:

        return {
            "message": "Request body is required"
        }, 400

    title = data.get("title")

    content = data.get("content")

    if not title or not content:

        return {
            "message": "Title and content are required"
        }, 400

    post = db.session.get(
        Post,
        post_id
    )

    if not post:

        return {
            "message": "Post not found"
        }, 404

    additional_story = AdditionalStory(

        post_id=post_id,

        title=title.strip(),

        content=content.strip()
    )

    db.session.add(
        additional_story
    )

    db.session.commit()

    return {
        "message": "Additional story added successfully",
        "additional_story_id": additional_story.id
    }, 201


# ============================================================
# GET ADDITIONAL STORIES
# ============================================================

@app.route(
    "/api/posts/<int:post_id>/additional-stories",
    methods=["GET"]
)
def get_additional_stories(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    if not post:

        return {
            "message": "Post not found"
        }, 404

    stories = (
        AdditionalStory.query
        .filter_by(post_id=post_id)
        .order_by(
            AdditionalStory.created_at.asc()
        )
        .all()
    )

    stories_data = []

    for story in stories:

        stories_data.append({
            "id": story.id,
            "title": story.title,
            "content": story.content,
            "created_at": story.created_at
        })

    return stories_data, 200


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

@app.route(
    "/api/posts/<int:post_id>/comments",
    methods=["POST"]
)
def create_comment(post_id):

    data = request.get_json()

    if not data:

        return {
            "message": "Request body is required"
        }, 400

    name = data.get("name")

    content = data.get("content")

    if not name or not content:

        return {
            "message": "Name and content are required"
        }, 400

    if len(name.strip()) > 100:

        return {
            "message": "Name must be 100 characters or less"
        }, 400

    post = db.session.get(
        Post,
        post_id
    )

    if not post:

        return {
            "message": "Post not found"
        }, 404

    comment = Comment(

        post_id=post_id,

        name=name.strip(),

        content=content.strip()
    )

    db.session.add(comment)

    db.session.commit()

    return {
        "message": "Comment added successfully",
        "comment_id": comment.id
    }, 201


# ============================================================
# GET COMMENTS
# ============================================================

@app.route(
    "/api/posts/<int:post_id>/comments",
    methods=["GET"]
)
def get_comments(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    if not post:

        return {
            "message": "Post not found"
        }, 404

    comments = (
        Comment.query
        .filter_by(post_id=post_id)
        .order_by(
            Comment.created_at.asc()
        )
        .all()
    )

    comments_data = []

    for comment in comments:

        comments_data.append({
            "id": comment.id,
            "name": comment.name,
            "content": comment.content,
            "created_at": comment.created_at
        })

    return comments_data, 200


# ============================================================
# DELETE COMMENT - ADMIN
# ============================================================

@app.route(
    "/api/admin/comments/<int:comment_id>",
    methods=["DELETE"]
)
@admin_required()
def delete_comment(comment_id):

    comment = db.session.get(
        Comment,
        comment_id
    )

    if not comment:

        return {
            "message": "Comment not found"
        }, 404

    db.session.delete(comment)

    db.session.commit()

    return {
        "message": "Comment deleted successfully"
    }, 200


# ============================================================
# LIKE POST
# ============================================================

@app.route(
    "/api/posts/<int:post_id>/like",
    methods=["POST"]
)
def like_post(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    if not post:

        return {
            "message": "Post not found"
        }, 404

    # Protect against old NULL database values
    if post.likes is None:
        post.likes = 0

    post.likes += 1

    db.session.commit()

    return {
        "message": "Post liked successfully",
        "likes": post.likes
    }, 200


# ============================================================
# DISLIKE POST
# ============================================================

@app.route(
    "/api/posts/<int:post_id>/dislike",
    methods=["POST"]
)
def dislike_post(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    if not post:

        return {
            "message": "Post not found"
        }, 404

    # Protect against old NULL database values
    if post.dislikes is None:
        post.dislikes = 0

    post.dislikes += 1

    db.session.commit()

    return {
        "message": "Post disliked successfully",
        "dislikes": post.dislikes
    }, 200


# ============================================================
# RECORD POST VIEW
# ============================================================

@app.route(
    "/api/posts/<int:post_id>/view",
    methods=["POST"]
)
def view_post(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    if not post:

        return {
            "message": "Post not found"
        }, 404

    # Protect against old NULL database values
    if post.views is None:
        post.views = 0

    post.views += 1

    db.session.commit()

    return {
        "message": "Post view recorded successfully",
        "views": post.views
    }, 200


# ============================================================
# IMAGE UPLOAD
# ============================================================

@app.route(
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
        app.config["UPLOAD_FOLDER"],
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

@app.route(
    "/uploads/<path:filename>"
)
def uploaded_file(filename):

    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )


# ============================================================
# RSS FEED
# ============================================================

@app.route(
    "/api/rss",
    methods=["GET"]
)
def rss_feed():

    # Get latest 20 posts
    posts = (
        Post.query
        .order_by(
            Post.created_at.desc()
        )
        .limit(20)
        .all()
    )

    # Frontend URL comes from environment
    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://127.0.0.1:5173"
    )

    rss_items = []

    for post in posts:

        # Create one RSS item for every blog post
        rss_items.append(
            f"""
            <item>
                <title><![CDATA[{post.title}]]></title>

                <description><![CDATA[
                    {post.description}
                ]]></description>

                <link>
                    {frontend_url}/post/{post.id}
                </link>

                <guid>
                    {frontend_url}/post/{post.id}
                </guid>

                <category><![CDATA[
                    {post.category}
                ]]></category>

                <pubDate>
                    {post.created_at.strftime(
                        "%a, %d %b %Y %H:%M:%S GMT"
                    )}
                </pubDate>
            </item>
            """
        )

    # Create complete RSS document
    rss_content = f"""<?xml version="1.0" encoding="UTF-8"?>

<rss version="2.0">

    <channel>

        <title>Zero to Hero Blogs</title>

        <description>
            Real stories of journeys from zero to success.
        </description>

        <link>
            {frontend_url}/
        </link>

        <language>en</language>

        {"".join(rss_items)}

    </channel>

</rss>
"""

    return Response(
        rss_content,
        mimetype="application/rss+xml"
    )


# ============================================================
# START FLASK SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )