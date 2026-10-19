from httpx import AsyncClient


class AsyncClientProvider:
    def __init__(self) -> None:
        self._clients: dict[str, AsyncClient] = {}

    async def get_client(self, base_url: str = "") -> AsyncClient:
        if base_url not in self._clients:
            self._clients[base_url] = AsyncClient(base_url=base_url)
        return self._clients[base_url]

    async def close(self) -> None:
        for client in self._clients.values():
            await client.aclose()


client_provider = AsyncClientProvider()
