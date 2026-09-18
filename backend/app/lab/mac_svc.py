"""MACService - symmetric message authentication codes over binary data.

A MAC proves integrity and authenticity between parties that share a secret
key. This service covers three real, library-backed MACs:

* ``hmac_sha256`` / ``hmac_sha512`` - keyed hashes (arbitrary text key).
* ``cmac_aes128`` / ``cmac_aes192`` / ``cmac_aes256`` - AES-CMAC
  (NIST SP 800-38B); the key is a hex-encoded AES key.
* ``poly1305`` - the one-time authenticator (RFC 8439); the key is a
  hex-encoded 256-bit (32-byte) one-time key that must never be reused.

None of these encrypt data, and none are digital signatures.
"""

from __future__ import annotations

import warnings
from secrets import compare_digest
from typing import Any, Dict, Union

from cryptography.hazmat.primitives import cmac, hashes
from cryptography.hazmat.primitives import hmac as crypto_hmac
from cryptography.hazmat.primitives.ciphers import algorithms

with warnings.catch_warnings():
    warnings.simplefilter("ignore", DeprecationWarning)
    from cryptography.hazmat.primitives import poly1305

from backend.app.lab.errors import LabValidationError

ALGORITHMS = (
    "hmac_sha256",
    "hmac_sha512",
    "cmac_aes128",
    "cmac_aes192",
    "cmac_aes256",
    "poly1305",
)

_HMAC_HASHES = {"hmac_sha256": hashes.SHA256, "hmac_sha512": hashes.SHA512}
_CMAC_KEY_BYTES = {"cmac_aes128": 16, "cmac_aes192": 24, "cmac_aes256": 32}
_POLY1305_KEY_BYTES = 32

KeyLike = Union[bytes, bytearray, str]


def _algorithm(name: str) -> str:
    if name not in ALGORITHMS:
        raise LabValidationError(
            "Unsupported MAC algorithm. Allowed: " + ", ".join(ALGORITHMS) + "."
        )
    return name


def _text_key(key: KeyLike) -> bytes:
    if isinstance(key, str):
        key = key.encode("utf-8")
    if not isinstance(key, (bytes, bytearray)) or len(key) == 0:
        raise LabValidationError("MAC key must be a non-empty bytes value.")
    return bytes(key)


def _hex_key(key: KeyLike, expected_bytes: int, label: str) -> bytes:
    if isinstance(key, (bytes, bytearray)):
        raw = bytes(key)
    elif isinstance(key, str):
        try:
            raw = bytes.fromhex("".join(key.split()))
        except ValueError as exc:
            raise LabValidationError(f"{label} must be valid hexadecimal.") from exc
    else:
        raise LabValidationError(f"{label} must be a hex string.")
    if len(raw) != expected_bytes:
        raise LabValidationError(
            f"{label} must be exactly {expected_bytes} bytes "
            f"({expected_bytes * 2} hex digits)."
        )
    return raw


def _compute(algorithm: str, data: bytes, key: KeyLike) -> bytes:
    if algorithm in _HMAC_HASHES:
        mac = crypto_hmac.HMAC(_text_key(key), _HMAC_HASHES[algorithm]())
        mac.update(data)
        return mac.finalize()
    if algorithm in _CMAC_KEY_BYTES:
        n = _CMAC_KEY_BYTES[algorithm]
        mac = cmac.CMAC(algorithms.AES(_hex_key(key, n, "CMAC key")))
        mac.update(data)
        return mac.finalize()
    # poly1305
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        mac = poly1305.Poly1305(
            _hex_key(key, _POLY1305_KEY_BYTES, "Poly1305 one-time key")
        )
        mac.update(data)
        return mac.finalize()


class MACService:
    """Generate and verify symmetric MACs (HMAC, AES-CMAC, Poly1305)."""

    algorithms = ALGORITHMS

    @staticmethod
    def generate(data: bytes, key: KeyLike, algorithm: str = "hmac_sha256") -> Dict[str, Any]:
        algorithm = _algorithm(algorithm)
        if not isinstance(data, (bytes, bytearray)):
            raise LabValidationError("Data must be bytes.")
        tag = _compute(algorithm, bytes(data), key)
        return {
            "algorithm": algorithm,
            "mac_hex": tag.hex(),
            "mac_size": len(tag),
            "data_size": len(data),
        }

    @staticmethod
    def verify(
        data: bytes,
        key: KeyLike,
        mac_hex: str,
        algorithm: str = "hmac_sha256",
    ) -> bool:
        algorithm = _algorithm(algorithm)
        if not isinstance(mac_hex, str) or not mac_hex:
            raise LabValidationError("MAC must be a non-empty hex string.")
        expected = "".join(mac_hex.split()).lower()
        try:
            bytes.fromhex(expected)
        except ValueError as exc:
            raise LabValidationError("MAC is not valid hexadecimal.") from exc
        actual = MACService.generate(data, key, algorithm)["mac_hex"]
        return compare_digest(actual, expected)
