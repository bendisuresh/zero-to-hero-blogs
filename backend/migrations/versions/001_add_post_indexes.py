"""add indexes for post queries"""

from alembic import op


revision = "001_add_post_indexes"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_index(
        "ix_posts_category",
        "posts",
        ["category"],
        schema="public"
    )

    op.create_index(
        "ix_posts_created_at",
        "posts",
        ["created_at"],
        schema="public"
    )


def downgrade():
    op.drop_index(
        "ix_posts_created_at",
        table_name="posts",
        schema="public"
    )

    op.drop_index(
        "ix_posts_category",
        table_name="posts",
        schema="public"
    )