from enum import StrEnum


class SmsStatus(StrEnum):
    QUEUED = "queued"
    SENDING = "sending"
    SENT = "sent"
    FAILED = "failed"
    DELIVERED = "delivered"
    UNDELIVERED = "undelivered"
    RECEIVING = "receiving"
    RECEIVED = "received"
    ACCEPTED = "accepted"
    SCHEDULED = "scheduled"
    READ = "read"
    PARTIALLY_DELIVERED = "partially_delivered"
    CANCELED = "canceled"

    PENDING = "pending"
    UNKNOWN = "unkown"


class TemplateName(StrEnum):
    HELLO_WORLD = "hello_world"
    LOCATION_SHARE_REQUEST = "share_geolocation_request"
