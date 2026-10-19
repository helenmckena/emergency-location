from typing import Any

from core.config import settings
from core.utils import get_share_request_url
from repositories.location import (
    LocationShareRequestRepository,
    LocationShareRecordRepository,
)
from models.location import LocationShareRequest, LocationShareRecord
from services.phone import PhoneService
from datetime import datetime, UTC, timedelta
from core.exceptions import NotFoundError, PreviousRequestStillActive
from loguru import logger

from services.sms import SmsService
from services.whatsapp import WhatsAppService
from core.interfaces import WebSocketGateway


class CreateLocationShareRequestUseCase:
    __slots__ = ("_repo", "_sms_service", "_wa_service")

    def __init__(
        self,
        repository: LocationShareRequestRepository,
        sms_service: SmsService,
        wa_service: WhatsAppService,
    ):
        self._repo = repository
        self._sms_service = sms_service
        self._wa_service = wa_service

    async def execute(self, phone: str) -> LocationShareRequest:
        phone = PhoneService.normalize(phone)
        last_request = await self._get_last_request(phone=phone)

        if last_request:
            self._check_cooldown(last_request)

            if last_request.expired_at > datetime.now(tz=UTC):
                logger.info(
                    "Previous request with id={} is still active until {}, resending sms",
                    last_request.id,
                    last_request.expired_at,
                )
                await self._send_notifications(last_request)
                return last_request

        share_request = await self._create_share_request(phone=phone)
        await self._send_notifications(share_request)

        return share_request

    @staticmethod
    def _check_cooldown(last_request: LocationShareRequest) -> None:
        """:raises PreviousRequestStillActive:"""
        cooldown_until = last_request.created_at + timedelta(
            seconds=settings.location.next_request_wait
        )
        now = datetime.now(tz=UTC)
        if cooldown_until > now:
            logger.info(
                "Previous request with id={} is on cooldown until {}",
                last_request.id,
                cooldown_until,
            )
            raise PreviousRequestStillActive(retry_after=(cooldown_until - now).seconds)

    async def _send_notifications(self, request: LocationShareRequest) -> None:
        share_url = get_share_request_url(request.id)

        sms = await self._sms_service.send_location_share_request(
            phone=request.phone, url=share_url
        )
        logger.info("Request sms sent: sms_id={}", sms.message_id)

        wa_msg = await self._wa_service.send_location_share_request(
            phone=request.phone, link=share_url
        )
        logger.info("Request whatsapp message sent: msg_id={}", wa_msg.message_id)

    async def _create_share_request(self, phone: str) -> LocationShareRequest:
        expired_at = datetime.now(tz=UTC) + timedelta(
            seconds=settings.location.request_ttl
        )
        share_request_instance = LocationShareRequest(
            phone=phone, expired_at=expired_at
        )
        logger.debug("Location share request initialized")
        share_request = await self._repo.create(share_request_instance)
        logger.info("Share request created")
        return share_request

    async def _get_last_request(self, phone: str) -> None | LocationShareRequest:
        last_request = None
        last_request_lst = await self._repo.get_all(
            phone=phone, order_by="-expired_at", limit=1
        )
        if last_request_lst:
            last_request = last_request_lst[0]
        logger.debug("last_request={}", last_request)
        return last_request


class SubmitLocationShareRecordUseCase:
    __slots__ = ("_request_repo", "_record_repo", "_ws_gateway")

    def __init__(
        self,
        request_repo: LocationShareRequestRepository,
        record_repo: LocationShareRecordRepository,
        ws_gateway: WebSocketGateway[int, Any],
    ):
        self._request_repo = request_repo
        self._record_repo = record_repo
        self._ws_gateway = ws_gateway

    async def execute(
        self, request_id: int, latitude: float, longitude: float
    ) -> LocationShareRecord:
        """:raises NotFoundError:"""

        location_request = await self._request_repo.get(request_id=request_id)
        if location_request is None:
            raise NotFoundError("Location share request not found.")

        location_record = LocationShareRecord(
            request_id=request_id, latitude=latitude, longitude=longitude
        )
        location_record = await self._record_repo.create(location_record)

        await self._broadcast(location_record)

        return location_record

    async def _broadcast(self, record: LocationShareRecord) -> None:
        await self._ws_gateway.broadcast(
            record.request_id,
            {
                "id": record.id,
                "latitude": record.latitude,
                "longitude": record.longitude,
            },
        )
        logger.debug(
            "Location record broadcasted: request_id={}, record_id={}",
            record.request_id,
            record.id,
        )


class GetLocationShareRecordsUseCase:
    __slots__ = ("_repo",)

    def __init__(self, repo: LocationShareRecordRepository):
        self._repo = repo

    async def execute(
        self, request_id: int, include_all: bool
    ) -> list[LocationShareRecord]:
        if include_all:
            return await self._repo.get_all_by_request_id(request_id=request_id)

        return await self._repo.get_all_by_request_id(request_id=request_id, limit=1)
