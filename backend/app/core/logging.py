"""Structured logging configuration for the application."""

import logging
import sys

from app.core.config import settings

_configured = False


def setup_logging() -> None:
    """Configure root + application loggers once."""
    global _configured
    if _configured:
        return

    level = getattr(logging, settings.log_level.upper(), logging.INFO)
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(settings.log_format))

    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(level)

    # Requests from uvicorn deserve at least INFO; be quiet for sub-libraries.
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

    _configured = True


def get_logger(name: str) -> logging.Logger:
    """Return a namespaced logger, e.g. app.algorithms.caesar."""
    setup_logging()
    return logging.getLogger(name)