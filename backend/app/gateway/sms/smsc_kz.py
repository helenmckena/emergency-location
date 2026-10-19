"""
SMS gateway integration with smsc.kz.
https://smsc.kz/api/http/
"""

from core.enums import SmsStatus
from schemas.sms import SmsResult
from core.interfaces import SmsGateway
from core.config import settings
from httpx import AsyncClient

# More about statuses: https://smsc.kz/api/http/status_messages/statuses
SMSC_STATUS_MAP: dict[int, SmsStatus] = {
    -3: SmsStatus.FAILED,
    -2: SmsStatus.FAILED,
    -1: SmsStatus.PENDING,
    0: SmsStatus.SENT,
    1: SmsStatus.DELIVERED,
    2: SmsStatus.DELIVERED,
    3: SmsStatus.FAILED,
    4: SmsStatus.FAILED,
    20: SmsStatus.FAILED,
    22: SmsStatus.FAILED,
    23: SmsStatus.FAILED,
    24: SmsStatus.FAILED,
    25: SmsStatus.FAILED,
}


def map_smsc_status(code: int) -> SmsStatus:
    return SMSC_STATUS_MAP.get(code, SmsStatus.UNKNOWN)


class SmsKzGateway(SmsGateway):
    SEND_URL: str = "https://smsc.kz/rest/send/"
    STATUS_URL: str = "https://smsc.kz/sys/status.php"

    def __init__(self, client: AsyncClient):
        self._client = client

    @staticmethod
    def map_smsc_status(code: int) -> SmsStatus:
        return SMSC_STATUS_MAP.get(code, SmsStatus.UNKNOWN)

    async def send(self, phone: str, msg: str) -> SmsResult:
        response = await self._client.post(
            self.SEND_URL,
            json={
                "login": settings.sms.sms_kz.login,
                "psw": settings.sms.sms_kz.password,
                "sender": settings.sms.sender,
                "phones": phone,
                "mes": msg,
                "fmt": 3,
            },
        )
        result = SmsResult(
            message_id=str(response.json()["id"]),
            status=self.map_smsc_status(response.json().get("status", "N/A")),
        )
        return result

    async def get_status(self, msg_id: str, phone: str | None = None) -> SmsStatus:
        response = await self._client.post(
            self.STATUS_URL,
            data={
                "id": msg_id,
                "phone": phone or "",
                "login": settings.sms.sms_kz.login,
                "psw": settings.sms.sms_kz.password,
                "fmt": 3,
            },
        )
        status = self.map_smsc_status(response.json()["status"])
        return SmsStatus(status)
