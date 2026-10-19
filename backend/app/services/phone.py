from phonenumbers import (
    PhoneNumber,
    NumberParseException,
    parse,
    is_valid_number,
    format_number,
    PhoneNumberFormat,
)
from core.exceptions import InvalidPhoneFormatError
import re
from loguru import logger


class PhoneService:
    NATIONAL_PREFIX_RULES: dict[str, tuple[str, str]] = {
        "KZ": (r"^8(\d{10})$", r"+7\1"),
        "RU": (r"^8(\d{10})$", r"+7\1"),
    }

    @classmethod
    def parse(cls, phone: str, region: str | None = None) -> PhoneNumber:
        """:raises InvalidPhoneFormatError: If phone number specified in the wrong format."""
        if not phone.startswith("+"):
            raise InvalidPhoneFormatError(
                "Phone number must be in international format, e.g. +77071234567"
            )

        try:
            return parse(phone, region)
        except NumberParseException as e:
            raise InvalidPhoneFormatError(str(e)) from e

    @classmethod
    def is_valid(cls, phone: str, region: str | None = None) -> bool:
        try:
            return is_valid_number(cls.parse(phone, region))
        except InvalidPhoneFormatError:
            return False

    @classmethod
    def normalize(cls, phone: str, region: str | None = None) -> str:
        phone = phone.replace(" ", "")
        phone = cls._replace_national_prefix(phone)
        parsed = cls.parse(phone, region)
        return format_number(parsed, PhoneNumberFormat.E164)

    @classmethod
    def _replace_national_prefix(cls, phone: str) -> str:
        for pattern, repl in cls.NATIONAL_PREFIX_RULES.values():
            new_phone = re.sub(pattern, repl, phone)
            if new_phone != phone:
                logger.debug("National prefix replaced: new_phone={}", new_phone)
                return new_phone
        return phone
