from pydantic import BaseModel, ConfigDict

from schemas.common import ListResponseSchema


class PhotoUploadSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str


class PhotoShareSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str


class PhotoShareListSchema(ListResponseSchema[PhotoShareSchema]):
    pass
