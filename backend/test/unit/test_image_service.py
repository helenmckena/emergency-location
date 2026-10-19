import pytest

from services.image import ImageService
from conftest import TEST_DIR
import io
from PIL import Image


def is_correct_jpg(data: bytes) -> bool:
    if not isinstance(data, bytes) or len(data) == 0:
        return False

    # 1. Magic Bytes JPEG: \xff\xd8\xff
    if not data.startswith(b"\xff\xd8\xff"):
        return False

    try:
        image = Image.open(io.BytesIO(data))
        if image.format != "JPEG":
            return False
        image.verify()
        return True
    except Exception:
        return False


def get_bytes(filename: str) -> bytes:
    with open(filename, mode="rb") as file:
        return file.read()


@pytest.mark.parametrize(
    "filename",
    ["images/image.jpg", "images/image.png", "images/image.webp", "images/image.heic"],
)
def test_convert_to_jpg(filename: str) -> None:
    data = get_bytes(TEST_DIR / filename)
    assert is_correct_jpg(ImageService.convert_to_jpeg(data))
