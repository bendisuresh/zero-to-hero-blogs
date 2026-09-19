"""add comment moderation status

Revision ID: 19545432f770
Revises: 1450f5ee2830
Create Date: 2026-09-18 20:52:47.103260

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "19545432f770"
down_revision = "1450f5ee2830"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "comments",
        sa.Column(
            "status",
            sa.String(length=20),
            nullable=False,
            server_default="pending",
        ),
    )

    op.create_index(
        "ix_public_comments_status",
        "comments",
        ["status"],
        unique=False,
    )

    op.alter_column(
        "comments",
        "status",
        server_default=None,
    )


def downgrade():
    op.drop_index(
        "ix_public_comments_status",
        table_name="comments",
    )

    op.drop_column(
        "comments",
        "status",
    )