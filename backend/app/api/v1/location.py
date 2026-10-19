from fastapi import APIRouter, Depends, WebSocket
from fastapi.websockets import WebSocketDisconnect

from api.dependencies import dependency
from core.config import settings
from gateway.websocket import LocationWebSocketGateway
from schemas.location import (
    LocationShareRequestSchema,
    LocationShareRecordSchema,
    LocationShareRecordListSchema,
)
from usecases.location import (
    CreateLocationShareRequestUseCase,
    SubmitLocationShareRecordUseCase,
    GetLocationShareRecordsUseCase,
)
from fastapi import Body
from loguru import logger
from models.location import LocationShareRequest, LocationShareRecord

router = APIRouter(prefix=settings.api_prefix.location_shares)


@router.websocket(settings.api_path.ws_location_updates)
async def location_updates_ws(
    websocket: WebSocket,
    request_id: int,
    gateway: LocationWebSocketGateway = Depends(dependency.location_ws_gateway),
) -> None:
    await gateway.connect(request_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        gateway.disconnect(request_id, websocket)


@router.post(
    settings.api_path.create_location_share_request,
    response_model=LocationShareRequestSchema,
    status_code=201,
)
async def create_location_share_request(
    phone: str = Body(..., embed=True),
    usecase: CreateLocationShareRequestUseCase = Depends(
        dependency.create_location_share_request_usecase
    ),
) -> LocationShareRequest:
    logger.info("Creating location share request: phone={!r}", phone)
    result = await usecase.execute(phone)
    return result


@router.post(
    settings.api_path.submit_location_record,
    response_model=LocationShareRecordSchema,
    status_code=201,
)
async def submit_location_record(
    request_id: int,
    latitude: float = Body(..., embed=True),
    longitude: float = Body(..., embed=True),
    usecase: SubmitLocationShareRecordUseCase = Depends(
        dependency.submit_location_share_record_usecase
    ),
) -> LocationShareRecord:
    logger.info(
        "Submitting location record: request_id={}, latitude={}, longitude={}",
        request_id,
        latitude,
        longitude,
    )

    result = await usecase.execute(request_id, latitude, longitude)

    logger.info("Location record submitted")

    return result


@router.get(
    settings.api_path.get_location_records,
    response_model=LocationShareRecordListSchema,
    status_code=200,
)
async def get_location_records(
    request_id: int,
    include_all: bool = False,
    usecase: GetLocationShareRecordsUseCase = Depends(
        dependency.get_location_share_record_use_case
    ),
) -> LocationShareRecordListSchema:
    logger.info(
        "Getting location records: request_id={}, include_all={}",
        request_id,
        include_all,
    )

    result = await usecase.execute(request_id, include_all)

    logger.info("Location records retrieved")

    return LocationShareRecordListSchema(
        items=[LocationShareRecordSchema.model_validate(r) for r in result]
    )
