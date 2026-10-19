from core.interfaces import FileStorageGateway
from core.utils import get_photo_share_url
from repositories.photo import PhotoShareRepository
from schemas.common import File
from models.photo import PhotoShare
from services.image import ImageService
from loguru import logger
from core.interfaces import WebSocketGateway
from typing import Any


class UploadPhotoShareUseCase:
    __slots__ = ("_repo", "_gateway", "_ws_gateway")

    def __init__(
        self,
        repo: PhotoShareRepository,
        gateway: FileStorageGateway,
        ws_gateway: WebSocketGateway[int, Any],
    ):
        self._repo = repo
        self._gateway = gateway
        self._ws_gateway = ws_gateway

    async def execute(self, file: File, request_id: int) -> PhotoShare:
        # TODO: check request is active
        # TODO: Max allowed uploads — 20

        logger.info(f"Uploading photo share for request_id={request_id}")

        content = ImageService.convert_to_jpeg(data=file.data)
        logger.debug("Image converted to jpeg")

        filename = self._gateway.save_photo_share(
            content, request_id=request_id, mimetype="image/jpeg"
        )
        logger.info("Photo saved to storage: file={}", filename)

        photo_share = await self._repo.create(
            PhotoShare(request_id=request_id, filename=filename)
        )
        logger.info("Created photo share: id={}", photo_share.id)

        await self._broadcast(photo_share)

        return photo_share

    async def _broadcast(self, photo: PhotoShare) -> None:
        await self._ws_gateway.broadcast(
            photo.request_id,
            {"id": photo.id, "url": get_photo_share_url(photo.filename)},
        )
        logger.debug(
            "Photo share broadcasted: request_id={}, record_id={}",
            photo.request_id,
            photo.id,
        )


class GetPhotoShareUseCase:
    def __init__(self, repo: PhotoShareRepository):
        self._repo = repo

    async def execute(self, request_id: int) -> list[PhotoShare]:
        logger.info("Fetching photo shares: request_id={}", request_id)

        photo_shares = await self._repo.get_all(request_id=request_id)
        logger.debug("Fetched {} photos", len(photo_shares))

        return photo_shares
