import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager, get_jwt_identity
from flask_migrate import Migrate
from database import db
from routes.auth import auth_bp, admin_required
from routes.dashboard import dashboard_bp
from routes.posts import posts_bp
from routes.comments import comments_bp
from routes.reactions import reactions_bp
from routes.uploads import uploads_bp
from routes.rss import rss_bp
from routes.additional_stories import additional_stories_bp


load_dotenv()

app = Flask(__name__)


# Upload configuration
UPLOAD_FOLDER = os.path.join(
    app.root_path,
    "uploads"
)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(
    app.config["UPLOAD_FOLDER"],
    exist_ok=True
)


# CORS configuration
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


# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

if os.getenv("TESTING") == "1":
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"


# JWT configuration
app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY"
)


db.init_app(app)
migrate=Migrate(app,db)
jwt = JWTManager(app)



# Register application routes
app.register_blueprint(auth_bp)
app.register_blueprint(posts_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(additional_stories_bp)
app.register_blueprint(comments_bp)
app.register_blueprint(reactions_bp)
app.register_blueprint(uploads_bp)
app.register_blueprint(rss_bp)


if os.getenv("TESTING") == "1":
    with app.app_context():
        db.create_all()

@app.route("/")
def home():
    return {
        "message": "Zero to Hero Blogs API is running!"
    }


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


if __name__ == "__main__":
    app.run(
        debug=True
    )