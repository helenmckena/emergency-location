from pydantic import BaseModel, ConfigDict
from datetime import datetime

from schemas.common import ListResponseSchema


class LocationShareRequestSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    phone: str
    created_at: datetime
    expired_at: datetime


class LocationShareRecordSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    request_id: int
    latitude: float
    longitude: float
    created_at: datetime


class LocationShareRecordListSchema(ListResponseSchema[LocationShareRecordSchema]):
    pass
