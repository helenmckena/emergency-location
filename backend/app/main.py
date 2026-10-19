from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi.middleware.cors import CORSMiddleware

from api import router as api_router
from core.config import settings, MEDIA_ROOT
from fastapi import FastAPI
from core.log import configure_logger

from core.exception_handler import register_exception_handlers
from db import db_helper
import uvicorn
from fastapi.staticfiles import StaticFiles
from loguru import logger


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    yield
    await db_helper.dispose()


main_app = FastAPI(lifespan=lifespan)
main_app.mount(
    settings.api_prefix.media, StaticFiles(directory=MEDIA_ROOT), name="media"
)

main_app.include_router(api_router, prefix=settings.api_prefix.self)
register_exception_handlers(main_app)
configure_logger(main_app)

main_app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # local Vite
        "http://127.0.0.1:5173",  # localVite
        "https://emergency-location.com",
        "https://www.emergency-location.com",
        "capacitor://localhost",  # iOS — Capacitor
        "http://localhost",  # Android — Capacitor
        "https://localhost",  # HTTPS-schema in Capacitor
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def main() -> None:
    logger.info("Run main")
    uvicorn.run(
        "main:main_app",
        host=settings.run.host,
        port=settings.run.port,
        reload=settings.run.reload,
        workers=settings.run.workers,
        log_config=None,
    )


if __name__ == "__main__":
    main()
