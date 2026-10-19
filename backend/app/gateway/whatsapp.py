from typing import Any

from httpx import AsyncClient, HTTPStatusError

from core.exceptions import WhatsAppSendError
from core.interfaces import WhatsAppGateway
from schemas.whatsapp import WhatsAppTemplate, WhatsAppSendResult
from loguru import logger


class WhatsAppGraphApiGateway(WhatsAppGateway):
    def __init__(self, client: AsyncClient, phone_number_id: str, access_token: str):
        """
        client is expected to be configured with base_url set to the Graph API version
        (e.g. https://graph.facebook.com/v21.0).
        """
        self._client = client
        self._phone_number_id = phone_number_id
        self._access_token = access_token

    async def send(self, phone: str, template: WhatsAppTemplate) -> WhatsAppSendResult:
        """
        :raises WhatsAppSendError:
        """
        payload: dict[str, Any] = {
            "messaging_product": "whatsapp",
            "to": phone,
            "type": "template",
            "template": {
                "name": template.name,
                "language": {"code": template.language},
            },
        }
        if template.params is not None:
            payload["template"]["components"] = self._get_components(template.params)

        response = await self._client.post(
            f"/{self._phone_number_id}/messages",
            headers={"Authorization": f"Bearer {self._access_token}"},
            json=payload,
        )
        respone_data = response.json()

        try:
            response.raise_for_status()  # here
        except HTTPStatusError as e:
            logger.error(e)
            raise WhatsAppSendError from e

        return WhatsAppSendResult(message_id=respone_data["messages"][0]["id"])

    @staticmethod
    def _get_components(
        params: list[str] | dict[str, str],
    ) -> list[dict[str, str | list[dict[str, str]]]]:
        if isinstance(params, dict):
            parameters = [
                {"type": "text", "parameter_name": key, "text": value}
                for key, value in params.items()
            ]

        else:
            parameters = [{"type": "text", "text": value} for value in params]
        return [
            {
                "type": "body",
                "parameters": parameters,
            }
        ]
