from sqlalchemy import select

from typing import TYPE_CHECKING
from models.photo import PhotoShare

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession


class PhotoShareRepository:
    def __init__(self, session: "AsyncSession"):
        self._session = session

    async def create(self, instance: PhotoShare) -> PhotoShare:
        self._session.add(instance)
        await self._session.commit()
        await self._session.refresh(instance)

        return instance

    async def get_all(
        self, request_id: int, order_by: str | None = None, limit: int | None = None
    ) -> list[PhotoShare]:
        query = select(PhotoShare).where(PhotoShare.request_id == request_id)

        # TODO: duplicates to separate static method
        if order_by is not None:
            if not hasattr(PhotoShare, order_by.lstrip("-")):
                raise ValueError(f"Invalid order_by field: {order_by}")

            order_column = getattr(PhotoShare, order_by.lstrip("-"))
            asc = not order_by.startswith("-")
            query = query.order_by(order_column.asc() if asc else order_column.desc())

        if limit:
            query = query.limit(limit)

        result = await self._session.execute(query)
        return list(result.scalars().all())
