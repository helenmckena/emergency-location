from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, ForeignKey, func
from datetime import datetime
from db.base import Base


class PhotoShare(Base):
    __tablename__ = "photo_shares"

    id: Mapped[int] = mapped_column(primary_key=True)
    request_id: Mapped[int] = mapped_column(
        ForeignKey("location_share_requests.id", ondelete="CASCADE")
    )

    filename: Mapped[str] = mapped_column(String(length=255), unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
