from database import db


class Post(db.Model):
    __tablename__ = "posts"
    __table_args__ = {"schema": "public"}

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    storyteller = db.Column(db.String(100), nullable=False)
    storyteller_email = db.Column(db.String(255))

    starting_point = db.Column(db.Text, nullable=False)
    how_started = db.Column(db.Text, nullable=False)
    financial_info = db.Column(db.Text, nullable=False)
    approach = db.Column(db.Text, nullable=False)
    life_changed = db.Column(db.Text, nullable=False)
    failures = db.Column(db.Text, nullable=False)
    lessons = db.Column(db.Text, nullable=False)

    views = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    dislikes = db.Column(db.Integer, default=0)
    tags = db.Column(db.String(300), default="")

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        nullable=False
    )


class Admin(db.Model):
    __tablename__ = "admins"
    __table_args__ = {"schema": "public"}

    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )


class AdditionalStory(db.Model):
    __tablename__ = "additional_stories"
    __table_args__ = {"schema": "public"}

    id = db.Column(db.Integer, primary_key=True)

    post_id = db.Column(
        db.Integer,
        db.ForeignKey("public.posts.id"),
        nullable=False
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    content = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


class Comment(db.Model):
    __tablename__ = "comments"
    __table_args__ = {"schema": "public"}

    id = db.Column(db.Integer, primary_key=True)

    post_id = db.Column(
        db.Integer,
        db.ForeignKey("public.posts.id"),
        nullable=False
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    content = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )