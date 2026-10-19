from secrets import token_hex

from loguru import logger

from core.config import settings


def get_trace_id() -> str:
    """
    Produces a compact 12-character string.

    48 bits of entropy is enough for a request ID: at up to 1M requests
    the collision probability is ~0.18%, and for small apps
    """
    return token_hex(6)


def _format_base_domain(domain: str) -> str:
    domain = domain.rstrip("/")
    if not domain.startswith("https://"):
        return f"https://{domain}"
    return domain


def get_photo_share_url(filename: str) -> str:
    return settings.server.domain + settings.api_prefix.media + "/" + filename


def get_share_request_url(request_id: int) -> str:
    domain = _format_base_domain(settings.server.domain)
    url = f"{domain}/request/{request_id}"
    logger.debug("share_link={}", url)
    return url
