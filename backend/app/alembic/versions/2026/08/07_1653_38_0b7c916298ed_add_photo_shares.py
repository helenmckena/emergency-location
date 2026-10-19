"""Add photo_shares

Revision ID: 0b7c916298ed
Revises: 356f6d2e408d
Create Date: 2026-08-07 16:53:38.761532

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0b7c916298ed"
down_revision: Union[str, Sequence[str], None] = "356f6d2e408d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "photo_shares",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_photo_shares")),
        sa.UniqueConstraint("filename", name=op.f("uq_photo_shares_filename")),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("photo_shares")
