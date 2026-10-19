from fastapi import APIRouter
from api.v1.location import router as location_router
from api.v1.photo import router as photo_router
from core.config import settings

router = APIRouter()

router.include_router(
    location_router, prefix=settings.api_prefix.location, tags=["location"]
)
router.include_router(photo_router, prefix=settings.api_prefix.photo, tags=["photo"])
