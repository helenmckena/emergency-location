from fastapi import FastAPI, Request
from core.exceptions import (
    NotFoundError,
    InvalidPhoneFormatError,
    InvalidImageError,
    PreviousRequestStillActive,
)
from fastapi.responses import JSONResponse


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(NotFoundError)
    async def not_found_error_exception_handler(
        request: Request, exc: NotFoundError
    ) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(InvalidPhoneFormatError)
    async def invalid_phone_handler(
        request: Request, exc: InvalidPhoneFormatError
    ) -> JSONResponse:
        return JSONResponse(status_code=400, content={"detail": str(exc)})

    @app.exception_handler(InvalidImageError)
    async def invalid_image_handler(
        request: Request, exc: InvalidImageError
    ) -> JSONResponse:
        return JSONResponse(status_code=400, content={"detail": str(exc)})

    @app.exception_handler(PreviousRequestStillActive)
    async def previous_request_still_active_handler(
        request: Request, exc: PreviousRequestStillActive
    ) -> JSONResponse:
        return JSONResponse(
            status_code=429,
            content={"detail": str(exc)},
            headers={"Retry-After": str(exc.retry_after)},
        )
