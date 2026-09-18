"""Add post publication status

Revision ID: 1450f5ee2830
Revises: 56f00c7b95ea
Create Date: 2026-09-18 08:24:06.581242

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "1450f5ee2830"
down_revision = "56f00c7b95ea"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "posts",
        sa.Column(
            "status",
            sa.String(length=20),
            nullable=False,
            server_default="published"
        ),
        schema="public"
    )

    op.add_column(
        "posts",
        sa.Column(
            "published_at",
            sa.DateTime(),
            nullable=True
        ),
        schema="public"
    )

    op.execute(
        """
        UPDATE public.posts
        SET published_at = created_at
        WHERE status = 'published'
        """
    )

    op.alter_column(
        "posts",
        "status",
        server_default=None,
        schema="public"
    )


def downgrade():
    op.drop_column(
        "posts",
        "published_at",
        schema="public"
    )

    op.drop_column(
        "posts",
        "status",
        schema="public"
    )