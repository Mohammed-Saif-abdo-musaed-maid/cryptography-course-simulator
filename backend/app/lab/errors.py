"""User-safe domain errors for the reusable lab crypto services."""

from typing import Optional


class LabCryptoError(Exception):
    """Base class for lab-crypto failures.

    Messages are intentionally generic and never include secrets, plaintext,
    passwords or key material.
    """

    status_code = 422
    code = "lab_crypto_error"

    def __init__(self, message: str, code: Optional[str] = None):
        super().__init__(message)
        self.message = message
        self.code = code or self.code


class LabValidationError(LabCryptoError):
    """Invalid input (bad algorithm, malformed key, empty data...)."""

    code = "validation_error"


class LabAuthenticationError(LabCryptoError):
    """AEAD / signature integrity check failed."""

    code = "authentication_failed"
