"""Password-to-key derivation for the lab crypto services.

Uses real, vetted primitives only:

* ``hashlib.pbkdf2_hmac`` (stdlib) for PBKDF2-HMAC-SHA256.
* ``argon2-cffi`` (already a project dependency) for Argon2id.

The chosen KDF and its parameters are persisted in the container header so a
future reader can reproduce the key derivation exactly.
"""

from __future__ import annotations

import hashlib
from typing import Any, Dict, Optional

from argon2.low_level import Type, hash_secret_raw

from backend.app.lab.errors import LabValidationError

PBKDF2_ITERATIONS = 200_000
ARGON2_DEFAULTS: Dict[str, int] = {
    "time_cost": 3,
    "memory_cost": 65536,
    "parallelism": 2,
}
KDFS = ("pbkdf2_sha256", "argon2id")
DEFAULT_KDF = "pbkdf2_sha256"


def derive_key(
    kdf: str,
    password: str,
    salt: bytes,
    length: int = 32,
    params: Optional[Dict[str, Any]] = None,
) -> bytes:
    """Derive ``length`` bytes from ``password`` and ``salt``."""
    if not isinstance(password, str) or password == "":
        raise LabValidationError("Password must be a non-empty string.")
    if not isinstance(salt, (bytes, bytearray)) or len(salt) < 8:
        raise LabValidationError("KDF salt must be at least 8 random bytes.")
    if not isinstance(length, int) or length < 16 or length > 64:
        raise LabValidationError("Derived key length must be between 16 and 64 bytes.")

    params = params or {}

    if kdf == "pbkdf2_sha256":
        iterations = int(params.get("iterations", PBKDF2_ITERATIONS))
        if iterations < 1000:
            raise LabValidationError("PBKDF2 iteration count is too low.")
        return hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), bytes(salt), iterations, dklen=length
        )

    if kdf == "argon2id":
        merged = {**ARGON2_DEFAULTS, **params}
        return hash_secret_raw(
            secret=password.encode("utf-8"),
            salt=bytes(salt),
            time_cost=int(merged["time_cost"]),
            memory_cost=int(merged["memory_cost"]),
            parallelism=int(merged["parallelism"]),
            hash_len=length,
            type=Type.ID,
        )

    raise LabValidationError(f"Unsupported KDF: {kdf}")
