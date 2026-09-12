"""Educational simulator security helpers.

This module implements the non-cryptographic concerns of the backend:
safe request limits and sanitisation. Passwords, secrets or user data are
never persisted. No environment secrets are used by the simulator.
"""

from backend.app.core.config import settings


def validate_input_length(value: str, field: str = "input") -> None:
    """Reject inputs that exceed the configured safety limit."""
    if value is None:
        raise ValueError(f"{field} must not be empty")
    if len(value) > settings.max_input_length:
        raise ValueError(
            f"{field} exceeds the maximum allowed length "
            f"({settings.max_input_length} characters)"
        )


def strip_controls(value: str) -> str:
    """Remove control characters while preserving letters, digits, spaces
    and common punctuation. Never trust raw network input."""
    if not value:
        return value
    return "".join(ch for ch in value if ch == "\n" or ch == "\t" or ch >= " ")
