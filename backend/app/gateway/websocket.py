from fastapi import WebSocket
from typing import Any
import json
import asyncio
import redis.asyncio as redis
from core.interfaces import WebSocketGateway


class RequestWebSocketGateway(WebSocketGateway[int, Any]):
    __slots__ = ("connections", "redis", "pubsub", "channel", "listener_task")

    def __init__(self, redis_url: str, channel: str) -> None:
        self.connections: dict[int, list[WebSocket]] = {}
        self.redis = redis.from_url(redis_url, decode_responses=True)
        self.pubsub = self.redis.pubsub()
        self.channel = channel
        self.listener_task: asyncio.Task | None = None

    async def start(self) -> None:
        await self.pubsub.subscribe(self.channel)
        self.listener_task = asyncio.create_task(self._reader())

    async def stop(self) -> None:
        if self.listener_task:
            self.listener_task.cancel()
        await self.pubsub.unsubscribe(self.channel)
        await self.redis.close()

    async def _reader(self) -> None:
        async for message in self.pubsub.listen():
            if message["type"] != "message":
                continue
            payload = json.loads(message["data"])
            key = payload["key"]
            data = payload["data"]
            for websocket in self.connections.get(key, []):
                try:
                    await websocket.send_json(data)
                except Exception:
                    self.disconnect(key, websocket)

    async def connect(self, key: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections.setdefault(key, []).append(websocket)

    def disconnect(self, key: int, websocket: WebSocket) -> None:
        connections = self.connections.get(key)
        if connections is None:
            return
        if websocket in connections:
            connections.remove(websocket)
        if not connections:
            del self.connections[key]

    async def broadcast(self, key: int, data: dict[str, Any]) -> None:
        await self.redis.publish(self.channel, json.dumps({"key": key, "data": data}))


class LocationWebSocketGateway(RequestWebSocketGateway):
    def __init__(self, redis_url: str) -> None:
        super().__init__(redis_url, "location_channel")


class PhotoWebSocketGateway(RequestWebSocketGateway):
    def __init__(self, redis_url: str) -> None:
        super().__init__(redis_url, "photo_channel")
