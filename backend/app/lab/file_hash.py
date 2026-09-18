"""FileHashService - message digests over arbitrary binary data.

Supported (verified) algorithms: MD5, SHA-1, SHA-224, SHA-256, SHA-384,
SHA-512, SHA-3, BLAKE2, BLAKE3 and RIPEMD-160.

All stdlib-backed algorithms are computed by streaming fixed-size chunks, so
large files are never fully loaded into RAM. BLAKE3 is not available in this
Python's ``hashlib`` and is therefore delegated to the project's own verified
implementation (pure Python, bounded input - see ``MAX_BLAKE3_BYTES``).
"""

from __future__ import annotations

from secrets import compare_digest
from typing import Any, Dict, Optional

from backend.app.algorithms.blake3 import hash_bytes as _blake3_hash_bytes
from backend.app.lab.errors import LabValidationError

CHUNK_BYTES = 1 << 20

ALGORITHMS = ("md5", "sha1", "sha256", "sha512", "sha224", "sha384",
              "sha3", "blake2", "blake3", "ripemd160")

_SHA3_VARIANTS = {
    "sha3_224": "sha3_224",
    "sha3_256": "sha3_256",
    "sha3_384": "sha3_384",
    "sha3_512": "sha3_512",
}
_BLAKE2_VARIANTS = {"blake2b": "blake2b", "blake2s": "blake2s"}
_DEFAULT_SHA3 = "sha3_256"
_DEFAULT_BLAKE2 = "blake2b"
_BLAKE3_BYTES = 32
MAX_BLAKE3_BYTES = 64 << 20  # 64 MiB in-memory ceiling for the pure-Python BLAKE3


def _resolve_stdlib(algorithm: str, variant: Optional[str]):
    if algorithm in ("md5", "sha1", "sha256", "sha512", "sha224", "sha384",
                     "ripemd160"):
        if variant is not None:
            raise LabValidationError(f"Algorithm '{algorithm}' does not take a variant.")
        return algorithm
    if algorithm == "sha3":
        name = variant or _DEFAULT_SHA3
        if name not in _SHA3_VARIANTS:
            raise LabValidationError("SHA-3 variant must be sha3_224/256/384/512.")
        return name
    if algorithm == "blake2":
        name = variant or _DEFAULT_BLAKE2
        if name not in _BLAKE2_VARIANTS:
            raise LabValidationError("BLAKE2 variant must be blake2b or blake2s.")
        return name
    return None


class FileHashService:
    """Compute and compare cryptographic digests of bytes."""

    algorithms = ALGORITHMS

    @staticmethod
    def hash_bytes(data: bytes, algorithm: str, variant: Optional[str] = None) -> Dict[str, Any]:
        if not isinstance(data, (bytes, bytearray)):
            raise LabValidationError("Input data must be bytes.")
        if algorithm not in ALGORITHMS:
            raise LabValidationError(
                "Unsupported hash algorithm. Allowed: " + ", ".join(ALGORITHMS) + "."
            )
        payload = bytes(data)

        if algorithm == "blake3":
            length = variant if variant is not None else _BLAKE3_BYTES
            if not isinstance(length, int) or not (1 <= length <= 64):
                raise LabValidationError("BLAKE3 digest length must be 1-64 bytes.")
            if len(payload) > MAX_BLAKE3_BYTES:
                raise LabValidationError(
                    f"BLAKE3 input exceeds the {MAX_BLAKE3_BYTES // (1 << 20)} MiB "
                    "bounded limit of the pure-Python implementation."
                )
            digest_hex = _blake3_hash_bytes(payload, length)["digest"]
            return {
                "algorithm": "blake3",
                "variant": f"blake3-{length * 8}",
                "digest_size": length,
                "digest_hex": digest_hex,
                "input_size": len(payload),
            }

        stdlib_name = _resolve_stdlib(algorithm, variant)
        digest_hex = _stream_digest(stdlib_name, payload)
        digest_size = len(digest_hex) // 2
        return {
            "algorithm": algorithm,
            "variant": stdlib_name,
            "digest_size": digest_size,
            "digest_hex": digest_hex,
            "input_size": len(payload),
        }

    @staticmethod
    def verify(
        expected_hex: str,
        data: bytes,
        algorithm: str,
        variant: Optional[str] = None,
    ) -> bool:
        """Constant-time comparison of ``data``'s digest against ``expected_hex``."""
        if not isinstance(expected_hex, str) or not expected_hex:
            raise LabValidationError("Expected digest must be a non-empty hex string.")
        cleaned = "".join(expected_hex.split()).lower()
        try:
            bytes.fromhex(cleaned)
        except ValueError as exc:
            raise LabValidationError("Expected digest is not valid hexadecimal.") from exc
        actual = FileHashService.hash_bytes(data, algorithm, variant)["digest_hex"]
        return compare_digest(actual, cleaned)


def _stream_digest(stdlib_name: str, data: bytes) -> str:
    import hashlib

    hasher = hashlib.new(stdlib_name)
    for offset in range(0, len(data), CHUNK_BYTES):
        hasher.update(data[offset:offset + CHUNK_BYTES])
    return hasher.hexdigest()
