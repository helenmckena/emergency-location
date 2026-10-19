class InvalidPhoneFormatError(Exception): ...


class NotFoundError(Exception): ...


class SmsSendError(Exception): ...


class WhatsAppSendError(Exception): ...


class InvalidImageError(Exception): ...


class PreviousRequestStillActive(Exception):
    __slots__ = ("retry_after",)

    def __init__(self, retry_after: int) -> None:
        self.retry_after = retry_after
        super().__init__(
            f"Previous request is still active. Try again in {retry_after} seconds."
        )
