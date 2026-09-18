"""HMACService - message authentication codes over binary data.

HMAC is a *symmetric* keyed MAC (integrity + authenticity between parties
sharing a secret key) and is deliberately kept separate from digital
signatures, which use asymmetric key pairs.

Backed by ``cryptography.hazmat.primitives.hmac`` - the same library the
project's educational HMAC module already uses.
"""

from __future__ import annotations

from secrets import compare_digest
from typing import Any, Dict, Union

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import hmac as crypto_hmac

from backend.app.lab.errors import LabValidationError

ALGORITHMS = ("sha256", "sha512")
_HASHES = {"sha256": hashes.SHA256, "sha512": hashes.SHA512}

KeyLike = Union[bytes, bytearray, str]


def _normalize_key(key: KeyLike) -> bytes:
    if isinstance(key, str):
        key = key.encode("utf-8")
    if not isinstance(key, (bytes, bytearray)) or len(key) == 0:
        raise LabValidationError("HMAC key must be a non-empty bytes value.")
    return bytes(key)


def _algorithm(name: str):
    if name not in _HASHES:
        raise LabValidationError("Unsupported HMAC hash. Allowed: sha256, sha512.")
    return _HASHES[name]()


class HMACService:
    """Generate and verify HMAC tags."""

    algorithms = ALGORITHMS

    @staticmethod
    def generate(data: bytes, key: KeyLike, algorithm: str = "sha256") -> Dict[str, Any]:
        if not isinstance(data, (bytes, bytearray)):
            raise LabValidationError("Data must be bytes.")
        key_bytes = _normalize_key(key)
        mac = crypto_hmac.HMAC(key_bytes, _algorithm(algorithm))
        mac.update(bytes(data))
        tag = mac.finalize()
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
        algorithm: str = "sha256",
    ) -> bool:
        if not isinstance(mac_hex, str) or not mac_hex:
            raise LabValidationError("MAC must be a non-empty hex string.")
        expected = "".join(mac_hex.split()).lower()
        try:
            bytes.fromhex(expected)
        except ValueError as exc:
            raise LabValidationError("MAC is not valid hexadecimal.") from exc
        actual = HMACService.generate(data, key, algorithm)["mac_hex"]
        return compare_digest(actual, expected)
