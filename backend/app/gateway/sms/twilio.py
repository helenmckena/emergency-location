from core.enums import SmsStatus
from core.interfaces import SmsGateway
from schemas.sms import SmsResult
from twilio.rest import Client as TwilioClient
from twilio.base.exceptions import TwilioRestException
from core.config import settings
from loguru import logger
from typing import cast
from core.exceptions import SmsSendError


class SmsTwilioGateway(SmsGateway):
    def __init__(self, client: TwilioClient):
        self._client = client

    async def send(self, phone: str, msg: str) -> SmsResult:
        try:
            message = await self._client.messages.create_async(
                to=phone, from_=settings.sms.twilio.from_phone, body=msg
            )
        except TwilioRestException as e:
            logger.error(e)
            raise SmsSendError(f"Unexpected error: {e}")

        logger.debug("Message created: id={}, status={}", message.sid, message.status)
        return SmsResult(
            message_id=cast(str, message.sid),
            status=SmsStatus(message.status),
        )

    async def get_status(self, msg_id: str, phone: str | None = None) -> SmsStatus:
        logger.debug("Fetching message status: msg_id={}", msg_id)
        try:
            message = await self._client.messages(msg_id).fetch_async()
            logger.info("Message fetched: status={}", message.status)
        except TwilioRestException as e:
            logger.error(e)
            raise SmsSendError(f"Unexpected error: {e}")

        return SmsStatus(message.status)
