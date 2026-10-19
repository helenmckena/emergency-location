from typing import Protocol
from schemas.sms import SmsResult
from core.enums import SmsStatus
from schemas.whatsapp import WhatsAppTemplate, WhatsAppSendResult
from fastapi import WebSocket


class SmsGateway(Protocol):
    async def send(self, phone: str, msg: str) -> SmsResult: ...

    async def get_status(self, msg_id: str, phone: str | None = None) -> SmsStatus: ...


class WhatsAppGateway(Protocol):
    async def send(
        self, phone: str, template: WhatsAppTemplate
    ) -> WhatsAppSendResult: ...


class FileStorageGateway(Protocol):
    @staticmethod
    def save_photo_share(content: bytes, request_id: int, mimetype: str) -> str: ...


class WebSocketGateway[T, V](Protocol):
    async def connect(self, key: T, websocket: WebSocket) -> None: ...

    def disconnect(self, key: T, websocket: WebSocket) -> None: ...

    async def broadcast(self, key: T, data: dict[str, V]) -> None: ...

    async def start(self) -> None: ...
    async def stop(self) -> None: ...
