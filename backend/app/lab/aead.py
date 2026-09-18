"""Shared, binary-safe AEAD primitive used by the lab crypto services.

The binary-safe AEAD algorithms exposed here are AES-256-GCM, AES-CCM and
ChaCha20-Poly1305. All come straight from the ``cryptography`` library already
present in the project; nothing is re-implemented here.

The AEAD output is split into ``ciphertext`` and a 16-byte authentication
``tag`` so callers can persist them as separate, explicit container fields.
"""

from __future__ import annotations

from typing import Tuple

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import (
    AESCCM,
    AESGCM,
    ChaCha20Poly1305,
)

from backend.app.lab.errors import LabAuthenticationError, LabValidationError

ALGORITHMS = ("aes_gcm", "aes_ccm", "chacha20_poly1305")
KEY_BYTES = 32
NONCE_BYTES = 12
TAG_BYTES = 16

_AAD = None


def generate_key() -> bytes:
    """Return a fresh 32-byte key from the OS CSPRNG."""
    import os

    return os.urandom(KEY_BYTES)


def _cipher(algorithm: str, key: bytes):
    if algorithm == "aes_gcm":
        return AESGCM(key)
    if algorithm == "aes_ccm":
        return AESCCM(key, tag_length=TAG_BYTES)
    if algorithm == "chacha20_poly1305":
        return ChaCha20Poly1305(key)
    raise LabValidationError(
        "Unsupported symmetric algorithm. Allowed: " + ", ".join(ALGORITHMS) + "."
    )


def _validate(algorithm: str, key: bytes, nonce: bytes) -> None:
    if algorithm not in ALGORITHMS:
        raise LabValidationError(
            "Unsupported symmetric algorithm. Allowed: " + ", ".join(ALGORITHMS) + "."
        )
    if not isinstance(key, (bytes, bytearray)) or len(key) != KEY_BYTES:
        raise LabValidationError("Symmetric key must be exactly 32 bytes.")
    if not isinstance(nonce, (bytes, bytearray)) or len(nonce) != NONCE_BYTES:
        raise LabValidationError("Nonce must be exactly 12 bytes.")


def encrypt(algorithm: str, key: bytes, nonce: bytes, data: bytes) -> Tuple[bytes, bytes]:
    """Encrypt raw bytes; returns ``(ciphertext, tag)``."""
    _validate(algorithm, key, nonce)
    if not isinstance(data, (bytes, bytearray)):
        raise LabValidationError("Data to encrypt must be bytes (binary-safe input).")
    blob = _cipher(algorithm, key).encrypt(nonce, bytes(data), _AAD)
    return blob[:-TAG_BYTES], blob[-TAG_BYTES:]


def decrypt(
    algorithm: str,
    key: bytes,
    nonce: bytes,
    tag: bytes,
    ciphertext: bytes,
) -> bytes:
    """Decrypt ``ciphertext`` with ``tag``; raises on any tampering."""
    _validate(algorithm, key, nonce)
    if not isinstance(tag, (bytes, bytearray)) or len(tag) != TAG_BYTES:
        raise LabValidationError("Authentication tag must be exactly 16 bytes.")
    if not isinstance(ciphertext, (bytes, bytearray)):
        raise LabValidationError("Ciphertext must be bytes.")
    try:
        return _cipher(algorithm, key).decrypt(nonce, bytes(ciphertext) + bytes(tag), _AAD)
    except InvalidTag as exc:
        raise LabAuthenticationError(
            "Authentication failed: wrong key/password or the data was modified."
        ) from exc
