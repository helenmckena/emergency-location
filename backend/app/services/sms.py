from core.enums import SmsStatus
from core.interfaces import SmsGateway
from schemas.sms import SmsResult
from services.phone import PhoneService


class SmsService:
    def __init__(self, gateway: SmsGateway):
        self._gateway = gateway

    async def send_location_share_request(self, phone: str, url: str) -> SmsResult:
        msg = f"Share location: {url}"
        result = await self.send_message(phone=phone, message=msg)
        return result

    async def send_message(self, phone: str, message: str) -> SmsResult:
        valid_phone = PhoneService.normalize(phone)
        return await self._gateway.send(phone=valid_phone, msg=message)

    async def get_status(self, msg_id: str) -> SmsStatus:
        status = await self._gateway.get_status(msg_id=msg_id)
        return status
