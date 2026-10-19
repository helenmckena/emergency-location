from PIL import Image, UnidentifiedImageError, ImageOps
from io import BytesIO

from loguru import logger

from core.exceptions import InvalidImageError
from pillow_heif import register_heif_opener  # type: ignore


register_heif_opener()


class ImageService:
    @staticmethod
    def convert_to_jpeg(data: bytes, quality: int = 80) -> bytes:
        try:
            img = Image.open(BytesIO(data))
        except UnidentifiedImageError as e:
            logger.error("Failed to load image: {}", e)
            raise InvalidImageError("Invalid image data") from e

        img = ImageOps.exif_transpose(img)
        converted = img.convert("RGB")
        output = BytesIO()
        converted.save(output, format="JPEG", quality=quality, optimize=True)
        return output.getvalue()
