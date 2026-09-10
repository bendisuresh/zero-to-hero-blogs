import os
import uuid
from datetime import datetime
from functools import wraps

import bleach
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory, Response
from flask_cors import CORS
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
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


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


def admin_required():
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()

            if claims.get("role") != "admin":
                return jsonify({
                    "message": "Admin access required"
                }), 403

            return fn(*args, **kwargs)

        return wrapper

    return decorator


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

with app.app_context():
    db.create_all()


# ============================================================
# RICH TEXT SANITIZATION
# ============================================================

def sanitize_rich_text(html):
    """
    Allow only the HTML formatting used by our Tiptap editor.

    Dangerous HTML such as <script> is removed.
    """

    allowed_tags = [
        "p",
        "h2",
        "h3",
        "strong",
        "em",
        "ul",
        "ol",
        "li",
        "a",
        "img"
    ]

    allowed_attributes = {
        "a": [
            "href",
            "target",
            "rel"
        ],
        "img": [
            "src",
            "alt",
            "title"
        ]
    }

    return bleach.clean(
        html,
        tags=allowed_tags,
        attributes=allowed_attributes,
        protocols=[
            "http",
            "https"
        ],
        strip=True
    )


# ============================================================
# POST VALIDATION
# ============================================================

def validate_post_data(data):
    """
    Validate the basic fields required for a blog post.

    Returns:
        None if valid
        Error message if invalid
    """

    # Make sure request body exists
    if not data:
        return "Request body is required"

    allowed_categories = {
        "Business",
        "Job",
        "Investment",
        "Other"
    }

    # Check category
    if data.get("category") not in allowed_categories:
        return "Invalid category"

    required_fields = [
        "title",
        "description",
        "category",
        "storyteller",
        "starting_point",
        "how_started",
        "financial_info",
        "approach",
        "life_changed",
        "failures",
        "lessons"
    ]

    # Check required fields
    for field in required_fields:

        value = data.get(field)

        if not isinstance(value, str):
            return f"{field} is required"

        if not value.strip():
            return f"{field} is required"

    # Storyteller email is optional
    storyteller_email = data.get(
        "storyteller_email",
        ""
    )

    # Prevent None from causing .strip() error
    if storyteller_email is None:
        storyteller_email = ""

    if not isinstance(storyteller_email, str):
        return "Storyteller email must be text"

    storyteller_email = storyteller_email.strip()

    if len(storyteller_email) > 255:
        return "Storyteller email must be 255 characters or less"

    # Check field lengths
    if len(data["title"].strip()) > 200:
        return "Title must be 200 characters or less"

    if len(data["category"].strip()) > 50:
        return "Category must be 50 characters or less"

    if len(data["storyteller"].strip()) > 100:
        return "Storyteller must be 100 characters or less"

    if len(data["financial_info"].strip()) > 1000:
        return "Financial info must be 1000 characters or less"

    if len(data.get("tags", "").strip()) > 300:
        return "Tags must be 300 characters or less"

    return None


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

@app.route(
    "/api/posts",
    methods=["GET"]
)
def get_posts():

    # Read optional category from query string
    category = request.args.get("category")

    query = Post.query

    # Filter posts by category if provided
    if category:
        query = query.filter_by(
            category=category
        )

    posts = (
        query
        .order_by(Post.created_at.desc())
        .all()
    )

    posts_data = []

    for post in posts:

        posts_data.append({
            "id": post.id,
            "title": post.title,
            "description": post.description,
            "category": post.category,
            "storyteller": post.storyteller,
            "storyteller_email": post.storyteller_email,
            "views": post.views or 0,
            "likes": post.likes or 0,
            "dislikes": post.dislikes or 0,
            "tags": post.tags
        })

    return posts_data, 200


# ============================================================
# GET ONE POST
# ============================================================

@app.route(
    "/api/posts/<int:post_id>",
    methods=["GET"]
)
def get_post(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    if post is None:

        return {
            "message": "Post not found"
        }, 404

    return {
        "id": post.id,
        "title": post.title,
        "description": post.description,
        "category": post.category,
        "storyteller": post.storyteller,
        "storyteller_email": post.storyteller_email,
        "starting_point": post.starting_point,
        "how_started": post.how_started,
        "financial_info": post.financial_info,
        "approach": post.approach,
        "life_changed": post.life_changed,
        "failures": post.failures,
        "lessons": post.lessons,
        "views": post.views or 0,
        "likes": post.likes or 0,
        "dislikes": post.dislikes or 0,
        "tags": post.tags
    }, 200


# ============================================================
# CREATE POST
# ============================================================

# ============================================================
# ADMIN LOGIN
# ============================================================

@app.route(
    "/api/admin/login",
    methods=["POST"]
)
def admin_login():

    data = request.get_json()

    if not data:

        return {
            "message": "Request body is required"
        }, 400

    email = data.get("email")

    password = data.get("password")

    if not email or not password:

        return {
            "message": "Email and password are required"
        }, 400

    admin = Admin.query.filter_by(
        email=email
    ).first()

    if not admin:

        return {
            "message": "Invalid email or password"
        }, 401

    if not check_password_hash(
        admin.password_hash,
        password
    ):

        return {
            "message": "Invalid email or password"
        }, 401

    access_token = create_access_token(
        identity=admin.email,
        additional_claims={
            "role": "admin"
        }
    )

    return {
        "message": "Login successful",
        "access_token": access_token
    }, 200


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

@app.route(
    "/api/admin/posts",
    methods=["POST"]
)
@admin_required()
def admin_create_post():

    data = request.get_json()

    # Validate post data
    validation_error = validate_post_data(data)

    if validation_error:

        return {
            "message": validation_error
        }, 400

    storyteller_email = data.get(
        "storyteller_email",
        ""
    ).strip()

    post = Post(

        title=data["title"].strip(),

        description=data["description"].strip(),

        category=data["category"].strip(),

        storyteller=data["storyteller"].strip(),

        storyteller_email=storyteller_email,

        starting_point=data["starting_point"].strip(),

        how_started=data["how_started"].strip(),

        financial_info=data["financial_info"].strip(),

        approach=data["approach"].strip(),

        life_changed=data["life_changed"].strip(),

        failures=data["failures"].strip(),

        # Sanitize Tiptap HTML before storing it
        lessons=sanitize_rich_text(
            data["lessons"]
        ),

        tags=data.get(
            "tags",
            ""
        ).strip()
    )

    db.session.add(post)

    db.session.commit()

    return {
        "message": "Story created successfully",
        "post_id": post.id
    }, 201


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

@app.route(
    "/api/admin/posts/<int:post_id>",
    methods=["PUT"]
)
@admin_required()
def update_post(post_id):

    post = db.session.get(
        Post,
        post_id
    )

    if not post:

        return {
            "message": "Post not found"
        }, 404

    data = request.get_json()

    # Validate data
    validation_error = validate_post_data(data)

    if validation_error:

        return {
            "message": validation_error
        }, 400

    storyteller_email = data.get(
        "storyteller_email",
        ""
    ).strip()

    post.title = data["title"].strip()

    post.description = data["description"].strip()

    post.category = data["category"].strip()

    post.storyteller = data["storyteller"].strip()

    post.storyteller_email = storyteller_email

    post.starting_point = data["starting_point"].strip()

    post.how_started = data["how_started"].strip()

    post.financial_info = data["financial_info"].strip()

    post.approach = data["approach"].strip()

    post.life_changed = data["life_changed"].strip()

    post.failures = data["failures"].strip()

    # Sanitize rich text before saving
    post.lessons = sanitize_rich_text(
        data["lessons"]
    )

    if "tags" in data:

        post.tags = data["tags"].strip()

    db.session.commit()

    return {
        "message": "Story updated successfully",
        "post_id": post.id
    }, 200


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