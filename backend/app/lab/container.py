"""Versioned binary container format for lab crypto artifacts.

Layout
------
::

    +--------+---------+----------------+--------------+-------------------+
    | MAGIC  | VERSION | HEADER_LENGTH  | HEADER       | PAYLOAD           |
    | 3 B    | 1 B     | 4 B big-endian | UTF-8 JSON   | ciphertext bytes   |
    +--------+---------+----------------+--------------+-------------------+

* ``MAGIC``   = ``b"HCS"`` (Hybrid/Crypto Simulator)
* ``VERSION`` = ``1`` (single byte, bumped only on breaking changes)
* ``PAYLOAD`` = raw ciphertext **without** the AEAD tag; the tag is a header
  field so the authentication information is explicit and inspectable.

Header object (JSON)
--------------------
======================== =============================================
``magic``                ``"HCS"``
``version``              integer container version
``mode``                 ``"symmetric"`` | ``"hybrid"``
``algorithm``            ``"aes_gcm"`` | ``"chacha20_poly1305"``
``kdf``                  ``None`` | ``"pbkdf2_sha256"`` | ``"argon2id"``
``kdf_params``           parameters required to reproduce the KDF
``salt_b64``             base64 salt or ``None``
``nonce_b64``            base64 12-byte nonce
``tag_b64``              base64 16-byte AEAD authentication tag
``wrapped_key_b64``      base64 RSA-OAEP-wrapped symmetric key, or ``None``
``key_algorithm``        ``None`` | ``"rsa"``
``key_size``             RSA modulus size in bits, or ``None``
``original_filename``    original file name (empty for raw data)
``original_extension``   lower-case extension including the dot
``original_mime_type``   MIME type if known, else ``""``
``original_size``        original payload size in bytes
``ciphertext_length``    payload length in bytes (integrity-checked)
======================== =============================================

Consumers MUST reject an unknown ``VERSION`` rather than guessing, so the
format can evolve safely.
"""

from __future__ import annotations

import json
import struct
from typing import Any, Dict, Tuple

from backend.app.lab.errors import LabCryptoError, LabValidationError

MAGIC = b"HCS"
MAGIC_TEXT = "HCS"
FORMAT_VERSION = 1

_PREFIX = 8  # magic (3) + version (1) + header length (4)
_VALID_MODES = ("symmetric", "hybrid")
_REQUIRED_FIELDS = (
    "magic",
    "version",
    "mode",
    "algorithm",
    "kdf",
    "kdf_params",
    "salt_b64",
    "nonce_b64",
    "tag_b64",
    "wrapped_key_b64",
    "key_algorithm",
    "key_size",
    "original_filename",
    "original_extension",
    "original_mime_type",
    "original_size",
    "ciphertext_length",
)


def _validate_header(header: Any) -> None:
    if not isinstance(header, dict):
        raise LabCryptoError("Malformed container header.")
    for field in _REQUIRED_FIELDS:
        if field not in header:
            raise LabCryptoError(f"Container header is missing field '{field}'.")
    if header["magic"] != MAGIC_TEXT:
        raise LabCryptoError("Container magic mismatch.")
    if header["version"] != FORMAT_VERSION:
        raise LabCryptoError("Unsupported container version.")
    if header["mode"] not in _VALID_MODES:
        raise LabCryptoError("Unsupported container mode.")
    if not isinstance(header["algorithm"], str) or not header["algorithm"]:
        raise LabCryptoError("Malformed container header.")
    for int_field in ("original_size", "ciphertext_length"):
        value = header[int_field]
        if not isinstance(value, int) or isinstance(value, bool) or value < 0:
            raise LabCryptoError("Malformed container header.")


def serialize(header: Dict[str, Any], ciphertext: bytes) -> bytes:
    """Serialize ``header`` + ``ciphertext`` into the versioned container."""
    if not isinstance(ciphertext, (bytes, bytearray)):
        raise LabValidationError("Ciphertext must be bytes.")
    enriched = {**header, "magic": MAGIC_TEXT, "version": FORMAT_VERSION,
                "ciphertext_length": len(ciphertext)}
    _validate_header(enriched)
    raw = json.dumps(
        enriched, ensure_ascii=False, separators=(",", ":"), sort_keys=True
    ).encode("utf-8")
    return MAGIC + bytes([FORMAT_VERSION]) + struct.pack(">I", len(raw)) + raw + bytes(ciphertext)


def parse(package: bytes) -> Tuple[Dict[str, Any], bytes]:
    """Validate a container and return ``(header, ciphertext)``."""
    if not isinstance(package, (bytes, bytearray)):
        raise LabValidationError("Container must be bytes.")
    package = bytes(package)
    if len(package) < _PREFIX:
        raise LabCryptoError("Container is truncated or empty.")
    if package[:3] != MAGIC:
        raise LabCryptoError("Unrecognized container format.")
    if package[3] != FORMAT_VERSION:
        raise LabCryptoError("Unsupported container version.")
    header_len = struct.unpack(">I", package[4:_PREFIX])[0]
    if header_len == 0 or _PREFIX + header_len > len(package):
        raise LabCryptoError("Malformed container header.")
    try:
        header = json.loads(package[_PREFIX:_PREFIX + header_len].decode("utf-8"))
    except (ValueError, UnicodeDecodeError) as exc:
        raise LabCryptoError("Malformed container header.") from exc
    _validate_header(header)
    ciphertext = package[_PREFIX + header_len:]
    if len(ciphertext) != header["ciphertext_length"]:
        raise LabCryptoError(
            "Container payload length mismatch; the file may be corrupted or truncated."
        )
    return header, ciphertext


def new_header(
    *,
    mode: str,
    algorithm: str,
    kdf: Any,
    kdf_params: Dict[str, Any],
    salt_b64: Any,
    nonce_b64: str,
    tag_b64: str,
    wrapped_key_b64: Any = None,
    key_algorithm: Any = None,
    key_size: Any = None,
    original_filename: str = "",
    original_extension: str = "",
    original_mime_type: str = "",
    original_size: int = 0,
) -> Dict[str, Any]:
    """Build a fully-populated header dict for :func:`serialize`."""
    return {
        "magic": MAGIC_TEXT,
        "version": FORMAT_VERSION,
        "mode": mode,
        "algorithm": algorithm,
        "kdf": kdf,
        "kdf_params": kdf_params,
        "salt_b64": salt_b64,
        "nonce_b64": nonce_b64,
        "tag_b64": tag_b64,
        "wrapped_key_b64": wrapped_key_b64,
        "key_algorithm": key_algorithm,
        "key_size": key_size,
        "original_filename": original_filename,
        "original_extension": original_extension,
        "original_mime_type": original_mime_type,
        "original_size": original_size,
        "ciphertext_length": 0,
    }
