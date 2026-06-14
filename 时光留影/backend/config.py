from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "时光留影"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DATABASE_URL: str = "mysql+aiomysql://user:password@localhost/shiguang"
    REDIS_URL: str = "redis://localhost:6379/0"
    JWT_SECRET: str = "your-jwt-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION: int = 86400
    WX_APP_ID: str = "your-wechat-app-id"
    WX_APP_SECRET: str = "your-wechat-app-secret"
    WX_MCH_ID: str = "your-merchant-id"
    WX_API_KEY: str = "your-wechat-pay-api-key"
    STORAGE_BUCKET: str = "shiguang-photos"
    STORAGE_ACCESS_KEY: str = "your-storage-access-key"
    STORAGE_SECRET_KEY: str = "your-storage-secret-key"
    STORAGE_DOMAIN: str = "https://cdn.shiguangliuying.com"
    AI_SERVICE_URL: str = "http://localhost:8001"
    AI_SERVICE_TIMEOUT: int = 120
    PRICE_SINGLE: float = 3.9
    PRICE_MONTH: float = 14.9
    PRICE_QUARTER: float = 34.9
    PRICE_YEAR: float = 99.0
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
