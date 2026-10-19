from core.exceptions import WhatsAppSendError
from core.interfaces import WhatsAppGateway
from schemas.whatsapp import (
    WhatsAppSendResult,
    WhatsAppTemplate,
    WhatsAppTemplateLanguageCode,
)
from core.enums import TemplateName
from asyncio import sleep
from loguru import logger


class WhatsAppService:
    RETRY_SLEEP = 5

    def __init__(self, gateway: WhatsAppGateway):
        self._gateway = gateway

    async def send_location_share_request(
        self, phone: str, link: str
    ) -> WhatsAppSendResult:
        template = WhatsAppTemplate(
            name=TemplateName.LOCATION_SHARE_REQUEST,
            language=self._get_language_code(phone=phone),
            params={"location_link": link},
        )
        return await self._send_with_retry(phone=phone, template=template)

    async def _send_with_retry(
        self, phone: str, template: WhatsAppTemplate
    ) -> WhatsAppSendResult:
        try:
            return await self._gateway.send(phone=phone, template=template)
        except WhatsAppSendError:
            logger.info(
                "{} handled, retry sending after {} seconds",
                WhatsAppSendError.__name__,
                self.RETRY_SLEEP,
            )
            await sleep(self.RETRY_SLEEP)
            try:
                return await self._gateway.send(phone=phone, template=template)
            except WhatsAppSendError:
                logger.info("Error occured after retry, raising error")
                raise

    @staticmethod
    def _get_language_code(phone: str) -> WhatsAppTemplateLanguageCode:
        return WhatsAppTemplateLanguageCode.EN
