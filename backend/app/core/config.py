from pydantic import BaseModel, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

PROJECT_DIR = Path(__file__).parent.parent.parent
SECRETS_DIR = PROJECT_DIR / "secrets"
ENV_DIR = PROJECT_DIR / "env"

MEDIA_ROOT = Path(PROJECT_DIR / "media")
MEDIA_ROOT.mkdir(exist_ok=True)


class Server(BaseModel):
    # публичный адрес бэкенда (по нему отдаются фото); для локального запуска так
    domain: str = "http://localhost:8000"
    # адрес сайта (фронтенда): в WhatsApp уходит ссылка на него; пусто = как domain
    frontend_url: str = ""


class RunConfig(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = False
    workers: int = 1


class ApiPrefix(BaseModel):
    media: str = "/media"
    self: str = "/api"
    version: str = "/v1"
    location: str = "/location"
    location_shares: str = "/location-shares"
    photo: str = "/photo"
    photo_shares: str = "/photo-shares"


class ApiPath(BaseModel):
    create_location_share_request: str = ""
    submit_location_record: str = "/{request_id}/records"
    get_location_records: str = "/{request_id}/records"
    ws_location_updates: str = "/ws/{request_id}"

    upload_photo_shares: str = ""
    get_photo_shares: str = "/{request_id}/photos"
    ws_photo_updates: str = "/ws/{request_id}"


class DatabaseConfig(BaseModel):
    # Для бесплатного запуска без Docker: DB__DSN=sqlite+aiosqlite:///./local.db
    dsn: str | None = None

    user: str = ""
    name: str = ""
    host: str = ""
    port: int = 5432
    password_file: str = ""

    echo: bool = False
    echo_pool: bool = False
    pool_size: int = 5
    max_overflow: int = 10

    @property
    def is_sqlite(self) -> bool:
        return bool(self.dsn) and str(self.dsn).startswith("sqlite")

    @property
    def url(self) -> PostgresDsn | str:
        if self.dsn:
            return self.dsn
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=self.user,
            password=self.get_password(),
            host=self.host,
            port=self.port,
            path=self.name,
        )

    def get_password(self) -> str:
        return Path(PROJECT_DIR / self.password_file).read_text()


class PhoneConfig(BaseModel):
    default_region: str = "KZ"


class LocationConfig(BaseModel):
    request_ttl: int = 3600
    next_request_wait: int = 3 * 30


class SmsConfig(BaseModel):
    sender: str = ""

    class SmsKzConfig(BaseModel):
        login: str = ""
        password: str = ""

    class TwilioConfig(BaseModel):
        account_sid: str = ""
        auth_token: str = ""
        from_phone: str = ""

    sms_kz: SmsKzConfig = SmsKzConfig()
    twilio: TwilioConfig = TwilioConfig()


class WhatsAppConfig(BaseModel):
    class GraphApi(BaseModel):
        url: str = "https://graph.facebook.com/v21.0"
        phone_number_id: str = ""
        access_token: str = ""

    graph_api: GraphApi = GraphApi()
    # шаблон должен быть создан и одобрен в WhatsApp Manager
    template_name: str = "share_geolocation_request"
    template_language: str = "en"


class DeliveryConfig(BaseModel):
    """Платные каналы доставки ссылки. По умолчанию выключены:
    оператор отправляет ссылку сам (Telegram, WhatsApp, SMS с телефона)."""

    sms: bool = False
    whatsapp: bool = False


class Redis(BaseModel):
    # пусто = WebSocket работает внутри одного процесса, Redis не нужен
    url: str = ""


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(ENV_DIR / ".env.template", ENV_DIR / ".env"),
        case_sensitive=False,
        env_nested_delimiter="__",
    )
    server: Server = Server()
    run: RunConfig = RunConfig()
    db: DatabaseConfig = DatabaseConfig()
    phone: PhoneConfig = PhoneConfig()
    location: LocationConfig = LocationConfig()
    sms: SmsConfig = SmsConfig()
    whatsapp: WhatsAppConfig = WhatsAppConfig()
    delivery: DeliveryConfig = DeliveryConfig()
    api_prefix: ApiPrefix = ApiPrefix()
    api_path: ApiPath = ApiPath()
    redis: Redis = Redis()


settings = Settings()  # type: ignore
