from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.http import client_provider
from db.helper import db_helper
from gateway.file_storage import LocalFileStorageGateway
from gateway.sms.twilio import SmsTwilioGateway
from gateway.websocket import LocationWebSocketGateway, PhotoWebSocketGateway
from gateway.whatsapp import WhatsAppGraphApiGateway
from repositories.location import (
    LocationShareRequestRepository,
    LocationShareRecordRepository,
)
from repositories.photo import PhotoShareRepository
from services.sms import SmsService
from services.whatsapp import WhatsAppService
from usecases.location import (
    CreateLocationShareRequestUseCase,
    SubmitLocationShareRecordUseCase,
    GetLocationShareRecordsUseCase,
)
from core.config import settings
from twilio.rest import Client as TwilioClient
from usecases.photo import UploadPhotoShareUseCase, GetPhotoShareUseCase
from twilio.http.async_http_client import AsyncTwilioHttpClient
import asyncio


class Dependency:
    _location_ws_gateway: LocationWebSocketGateway | None = None
    _photo_ws_gateway: PhotoWebSocketGateway | None = None

    _location_lock = asyncio.Lock()
    _photo_lock = asyncio.Lock()

    async def location_ws_gateway(self) -> LocationWebSocketGateway:
        if self._location_ws_gateway is None:
            async with self._location_lock:
                if self._location_ws_gateway is None:
                    self._location_ws_gateway = LocationWebSocketGateway(
                        settings.redis.url
                    )
                    await self._location_ws_gateway.start()

        return self._location_ws_gateway

    async def photo_ws_gateway(self) -> PhotoWebSocketGateway:
        if self._photo_ws_gateway is None:
            async with self._photo_lock:
                if self._photo_ws_gateway is None:
                    self._photo_ws_gateway = PhotoWebSocketGateway(settings.redis.url)
                    await self._photo_ws_gateway.start()

        return self._photo_ws_gateway

    @staticmethod
    async def submit_location_share_record_usecase(
        session: AsyncSession = Depends(db_helper.session_getter),
    ) -> SubmitLocationShareRecordUseCase:
        request_repo = LocationShareRequestRepository(session)
        record_repo = LocationShareRecordRepository(session)
        return SubmitLocationShareRecordUseCase(
            request_repo=request_repo,
            record_repo=record_repo,
            ws_gateway=await dependency.location_ws_gateway(),
        )

    @staticmethod
    def get_location_share_record_use_case(
        session: AsyncSession = Depends(db_helper.session_getter),
    ) -> GetLocationShareRecordsUseCase:
        repo = LocationShareRecordRepository(session)
        return GetLocationShareRecordsUseCase(repo)

    @staticmethod
    async def _sms_service() -> SmsService:
        return SmsService(
            gateway=SmsTwilioGateway(
                TwilioClient(
                    settings.sms.twilio.account_sid,
                    settings.sms.twilio.auth_token,
                    http_client=AsyncTwilioHttpClient(),
                )
            )
        )

    async def create_location_share_request_usecase(
        self,
        session: AsyncSession = Depends(db_helper.session_getter),
    ) -> CreateLocationShareRequestUseCase:
        repo = LocationShareRequestRepository(session)
        return CreateLocationShareRequestUseCase(
            repository=repo,
            sms_service=await self._sms_service(),
            wa_service=await self.whatsapp_service(),
        )

    @staticmethod
    async def _whatsapp_graph_api_gateway() -> WhatsAppGraphApiGateway:
        client = await client_provider.get_client(
            base_url=settings.whatsapp.graph_api.url
        )
        return WhatsAppGraphApiGateway(
            client=client,
            phone_number_id=settings.whatsapp.graph_api.phone_number_id,
            access_token=settings.whatsapp.graph_api.access_token,
        )

    async def whatsapp_service(self) -> WhatsAppService:
        return WhatsAppService(gateway=await self._whatsapp_graph_api_gateway())

    @staticmethod
    async def photo_share_upload_usecase(
        session: AsyncSession = Depends(db_helper.session_getter),
    ) -> UploadPhotoShareUseCase:
        return UploadPhotoShareUseCase(
            repo=PhotoShareRepository(session),
            gateway=LocalFileStorageGateway(),
            ws_gateway=await dependency.photo_ws_gateway(),
        )

    @staticmethod
    async def get_photo_share_usecase(
        session: AsyncSession = Depends(db_helper.session_getter),
    ) -> GetPhotoShareUseCase:
        return GetPhotoShareUseCase(repo=PhotoShareRepository(session))


dependency = Dependency()
