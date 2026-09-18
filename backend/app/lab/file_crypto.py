"""FileCryptoService - binary-safe symmetric file encryption.

Files/bytes are NEVER converted to UTF-8 text before encryption. The only
symmetric algorithms exposed are the two verified as binary-safe in Phase 1:
AES-256-GCM and ChaCha20-Poly1305.

Key material is either:

* supplied directly as a 32-byte hex key, or
* derived from a user password with PBKDF2-HMAC-SHA256 or Argon2id.

Salt (16 bytes), nonce (12 bytes) and keys are always generated with the OS
CSPRNG - never hardcoded, never reused.
"""

from __future__ import annotations

import base64
import os
from pathlib import PurePosixPath
from typing import Any, Dict, Optional

from backend.app.lab import aead, container
from backend.app.lab.errors import LabCryptoError, LabValidationError
from backend.app.lab.kdf import DEFAULT_KDF, KDFS, derive_key

SALT_BYTES = 16
KEY_HEX_LEN = aead.KEY_BYTES * 2


def _b64e(raw: Optional[bytes]) -> Optional[str]:
    return None if raw is None else base64.b64encode(raw).decode("ascii")


def _b64d(value: str, field: str) -> bytes:
    try:
        return base64.b64decode(value.encode("ascii"), validate=True)
    except (ValueError, UnicodeEncodeError) as exc:
        raise LabCryptoError(f"Malformed container field: {field}.") from exc


def _key_from_hex(key_hex: str) -> bytes:
    if not isinstance(key_hex, str):
        raise LabValidationError("Hex key must be a string.")
    cleaned = "".join(key_hex.split())
    if len(cleaned) != KEY_HEX_LEN:
        raise LabValidationError(
            f"Hex key must be exactly {KEY_HEX_LEN} characters (32 bytes)."
        )
    try:
        return bytes.fromhex(cleaned)
    except ValueError as exc:
        raise LabValidationError("Hex key contains non-hexadecimal characters.") from exc


def _file_meta(filename: str) -> Dict[str, str]:
    name = filename or ""
    suffix = PurePosixPath(name.replace("\\", "/")).suffix.lower()
    return {"original_filename": name, "original_extension": suffix}


class FileCryptoService:
    """Reusable binary-safe file encryption/decryption."""

    algorithms = aead.ALGORITHMS
    kdfs = KDFS

    @staticmethod
    def encrypt(
        data: bytes,
        *,
        algorithm: str = "aes_gcm",
        password: Optional[str] = None,
        key_hex: Optional[str] = None,
        kdf: str = DEFAULT_KDF,
        filename: str = "",
        mime_type: str = "",
    ) -> bytes:
        """Encrypt bytes and return a versioned container."""
        if not isinstance(data, (bytes, bytearray)):
            raise LabValidationError("Input data must be bytes (binary-safe).")
        data = bytes(data)
        if algorithm not in aead.ALGORITHMS:
            raise LabValidationError(
                "Unsupported symmetric algorithm. Allowed: aes_gcm, chacha20_poly1305."
            )

        salt: Optional[bytes] = None
        kdf_name: Optional[str] = None
        kdf_params: Dict[str, Any] = {}

        if key_hex is not None:
            key = _key_from_hex(key_hex)
        else:
            if not password:
                raise LabValidationError(
                    "A password or a 32-byte hex key is required for encryption."
                )
            if kdf not in KDFS:
                raise LabValidationError(f"Unsupported KDF: {kdf}")
            salt = os.urandom(SALT_BYTES)
            key = derive_key(kdf, password, salt, aead.KEY_BYTES)
            kdf_name = kdf
            if kdf == "pbkdf2_sha256":
                from backend.app.lab.kdf import PBKDF2_ITERATIONS

                kdf_params = {"iterations": PBKDF2_ITERATIONS}

        nonce = os.urandom(aead.NONCE_BYTES)
        ciphertext, tag = aead.encrypt(algorithm, key, nonce, data)

        meta = _file_meta(filename)
        header = container.new_header(
            mode="symmetric",
            algorithm=algorithm,
            kdf=kdf_name,
            kdf_params=kdf_params,
            salt_b64=_b64e(salt),
            nonce_b64=_b64e(nonce) or "",
            tag_b64=_b64e(tag) or "",
            original_filename=meta["original_filename"],
            original_extension=meta["original_extension"],
            original_mime_type=mime_type or "",
            original_size=len(data),
        )
        return container.serialize(header, ciphertext)

    @staticmethod
    def decrypt(
        package: bytes,
        *,
        password: Optional[str] = None,
        key_hex: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Decrypt a container; returns ``{data, header}``."""
        header, ciphertext = container.parse(package)
        algorithm = header["algorithm"]
        if algorithm not in aead.ALGORITHMS:
            raise LabCryptoError(
                "Unsupported symmetric algorithm in container."
            )

        if header["kdf"]:
            if not password:
                raise LabValidationError("A password is required for this container.")
            salt = _b64d(header["salt_b64"], "salt_b64")
            key = derive_key(
                header["kdf"],
                password,
                salt,
                aead.KEY_BYTES,
                params=header.get("kdf_params") or {},
            )
        else:
            if key_hex is None:
                raise LabValidationError("A 32-byte hex key is required for this container.")
            key = _key_from_hex(key_hex)

        nonce = _b64d(header["nonce_b64"], "nonce_b64")
        tag = _b64d(header["tag_b64"], "tag_b64")
        try:
            data = aead.decrypt(algorithm, key, nonce, tag, ciphertext)
        except LabCryptoError:
            raise
        if len(data) != header["original_size"]:
            raise LabCryptoError(
                "Decrypted size does not match the container metadata."
            )
        return {"data": data, "header": header}
