"""Application configuration.

Settings are loaded from environment variables (see .env.example).
Pydantic-settings validates and exposes typed configuration to the app.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed application settings loaded from environment / .env."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    app_name: str = "Cryptography & Information Security Simulator"
    app_version: str = "1.0.0"
    description: str = (
        "Educational simulator for the Cryptography & Information Security course."
    )

    backend_host: str = "127.0.0.1"
    backend_port: int = 8000
    debug: bool = False

    log_level: str = "INFO"
    log_format: str = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"

    max_input_length: int = 4096
    max_math_int: int = 1_000_000_000


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()


settings = get_settings()