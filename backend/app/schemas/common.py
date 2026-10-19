from pydantic import BaseModel


class ListResponseSchema[T](BaseModel):
    items: list[T]
    total: int = 0
    limit: int = 0
    offset: int = 0


class File(BaseModel):
    filename: str | None
    content_type: str | None
    data: bytes
