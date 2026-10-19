from db.base import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, func, ForeignKey
from datetime import datetime


class LocationShareRequest(Base):
    __tablename__ = "location_share_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    phone: Mapped[str] = mapped_column(String(length=20))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    expired_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class LocationShareRecord(Base):
    __tablename__ = "location_share_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    request_id: Mapped[int] = mapped_column(
        ForeignKey("location_share_requests.id", ondelete="CASCADE")
    )
    latitude: Mapped[float] = mapped_column()
    longitude: Mapped[float] = mapped_column()
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
