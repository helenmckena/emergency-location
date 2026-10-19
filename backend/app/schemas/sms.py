from pydantic import BaseModel

from core.enums import SmsStatus


class SmsResult(BaseModel):
    message_id: str
    status: SmsStatus
