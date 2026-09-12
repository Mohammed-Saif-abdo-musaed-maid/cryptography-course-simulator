"""Application configuration.

Settings are loaded from environment variables (see .env.example).
Pydantic-settings validates and exposes typed configuration to the app.
"""

from functools import lru_cache
from typing import List, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict

# Origins always allowed so the local development workflow keeps working with
# no extra configuration (documented in README / .env.example).
DEV_ORIGINS = {
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
}


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

    # Comma-separated list of allowed browser origins (production frontend,
    # staging, etc.). Local dev origins are appended automatically.
    cors_origins: Optional[str] = None

    @property
    def allowed_origins(self) -> List[str]:
        """The full CORS allow-list: configured origins + local dev origins."""
        configured = {
            origin.strip().rstrip("/")
            for origin in (self.cors_origins or "").split(",")
            if origin.strip()
        }
        return sorted(configured | DEV_ORIGINS)


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance."""
    return Settings()


settings = get_settings()