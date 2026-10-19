import sys
from typing import Callable, Awaitable

from fastapi import FastAPI, Request, Response
from loguru import logger

from core.config import PROJECT_DIR
from core.utils import get_trace_id


def configure_logger(app: FastAPI) -> None:
    logger.remove()
    logger.level("INFO", color="<green>")

    log_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "{message} | <level>{extra}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan>"
    )

    logger.add(
        f"{PROJECT_DIR}/logs/info.log",
        level="INFO",
        format=log_format,
    )

    logger.add(
        f"{PROJECT_DIR}/logs/error.log",
        level="ERROR",
        format=log_format,
    )

    logger.add(
        sys.stderr,
        level="DEBUG",
        format=log_format,
    )

    @app.middleware("http")
    async def logging_middleware(
        request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        trace_id = get_trace_id()

        with logger.contextualize(trace_id=trace_id):
            response = await call_next(request)

            client_host = request.client.host if request.client else "-"

            logger.info(
                '{} "{} {}" -> {}',
                client_host,
                request.method,
                request.url.path,
                response.status_code,
            )

            return response

    # logger.debug("Logger configured")
