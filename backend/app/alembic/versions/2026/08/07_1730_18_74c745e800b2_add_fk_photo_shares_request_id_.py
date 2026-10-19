"""Add FK photo_shares.request_id references to location_share_requests.id

Revision ID: 74c745e800b2
Revises: 0b7c916298ed
Create Date: 2026-08-07 17:30:18.232840

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "74c745e800b2"
down_revision: Union[str, Sequence[str], None] = "0b7c916298ed"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("photo_shares", sa.Column("request_id", sa.Integer(), nullable=False))
    op.create_foreign_key(
        op.f("fk_photo_shares_request_id_location_share_requests"),
        "photo_shares",
        "location_share_requests",
        ["request_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(
        op.f("fk_photo_shares_request_id_location_share_requests"),
        "photo_shares",
        type_="foreignkey",
    )
    op.drop_column("photo_shares", "request_id")
