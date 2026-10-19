import uuid

from core.config import MEDIA_ROOT
from core.interfaces import FileStorageGateway
import mimetypes
from loguru import logger


class LocalFileStorageGateway(FileStorageGateway):
    @staticmethod
    def mimetype_to_extension(mimetype: str) -> str:
        result = mimetypes.guess_extension(mimetype)
        if result is None:
            raise ValueError(f"Unknown mimetype: {mimetype}")
        return result

    @staticmethod
    def save_photo_share(content: bytes, request_id: int, mimetype: str) -> str:
        ext = LocalFileStorageGateway.mimetype_to_extension(mimetype)
        filename = f"{request_id}/{uuid.uuid4()}{ext}"
        logger.debug("filename={}", filename)
        filepath = MEDIA_ROOT / filename
        filepath.parent.mkdir(exist_ok=True)
        filepath.write_bytes(content)

        return filename
