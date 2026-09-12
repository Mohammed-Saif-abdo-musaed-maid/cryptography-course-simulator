"""scrypt password hashing / KDF educational simulator.

scrypt (RFC 7914) is a password-based key derivation function designed by
Colin Percival. Unlike PBKDF2 it is also *memory-hard*: it requires a
large block of memory (N · r · 128 bytes), which makes dedicated GPU/ASIC
brute force much more expensive.

Uses the ``cryptography`` library for the actual computation.
scrypt is a PASSWORD HASH / KDF — it is NOT encryption.
"""

from __future__ import annotations

import secrets
from base64 import b64encode
from typing import Optional

from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from cryptography.exceptions import InvalidKey

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "scrypt",
    "name": "scrypt",
    "category": "kdf",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "password + salt + N, r, p parameters",
    "block_size": "—",
    "description": (
        "scrypt (RFC 7914) is a memory-hard password-based KDF. It stresses "
        "memory (N × r × 128 bytes) in addition to CPU, making large-scale "
        "brute force far more expensive than with PBKDF2. Widely used for "
        "password storage. It is NOT encryption."
    ),
}


def derive(password: str, salt: str = "", n: int = 2 ** 14, r: int = 8,
           p: int = 1, key_length: int = 32,
           salt_hex: Optional[str] = None, random_salt: bool = False) -> dict:
    """Derive key material from a password using scrypt."""
    if password is None:
        raise ValidationError("Password is required", "missing_password")

    salt_was_random = False
    if salt_hex:
        try:
            salt_bytes = bytes.fromhex(salt_hex)
        except ValueError as exc:
            raise ValidationError("Salt must be valid hexadecimal",
                                  "invalid_salt") from exc
    elif random_salt or salt is None or salt == "":
        salt_bytes = secrets.token_bytes(16)
        salt_was_random = True
    else:
        salt_bytes = str(salt).encode("utf-8")

    if not isinstance(n, int) or n < 2 or (n & (n - 1)) != 0:
        raise ValidationError("N must be a power of 2 ≥ 2", "invalid_n")
    if not isinstance(r, int) or r < 1:
        raise ValidationError("r must be ≥ 1", "invalid_r")
    if not isinstance(p, int) or p < 1:
        raise ValidationError("p must be ≥ 1", "invalid_p")
    if not 1 <= key_length <= 128:
        raise ValidationError("Key length must be in [1, 128] bytes",
                              "invalid_key_length")
    if n > 2 ** 20 or r > 64 or p > 16:
        raise ValidationError(
            "Parameters too large for the simulator (N ≤ 2^20, r ≤ 64, p ≤ 16)",
            "invalid_parameters")

    pw_bytes = password.encode("utf-8")
    memory_kb = (128 * n * r) // 1024
    kdf = Scrypt(salt=salt_bytes, length=key_length, n=n, r=r, p=p)
    derived = kdf.derive(pw_bytes)

    steps = [
        step(1, "Encode password and salt",
             "The password is UTF-8 encoded and mixed with a random or "
             "user-supplied salt. A fresh salt per password is essential.",
             "<password hidden>", f"salt = {salt_bytes.hex()}",
             {"salt_hex": salt_bytes.hex(), "salt_random": salt_was_random}),
        step(2, "Choose memory-hard parameters",
             f"N = {n}, r = {r}, p = {p} → the computation requires "
             f"~{memory_kb} KiB of memory (N × r × 128 bytes). This is what "
             "makes scrypt resistant to GPU/ASIC brute force.",
             f"N={n}, r={r}, p={p}", f"~{memory_kb} KiB memory",
             {"n": n, "r": r, "p": p, "memory_kib": memory_kb}),
        step(3, "Run the PBKDF2/RoMix mixing",
             "scrypt expands the block with PBKDF2-HMAC-SHA256, then applies "
             "the memory-hard ROMix mixing function over N blocks, and "
             "finishes with another PBKDF2 pass.",
             f"{n} mixing rounds", "derived key",
             {"memory_kib": memory_kb}),
        step(4, "Produce the output key",
             "The final bytes are truncated to the requested key length.",
             f"{key_length} bytes", derived.hex(), {"key_hex": derived.hex()}),
    ]

    return build_result(
        "scrypt", "derive", "<password hidden>",
        {"n": n, "r": r, "p": p, "key_length": key_length},
        derived.hex(), steps,
        {
            "kdf": "scrypt",
            "salt_hex": salt_bytes.hex(),
            "salt_random": salt_was_random,
            "n": n, "r": r, "p": p,
            "memory_kib": memory_kb,
            "key_length": key_length,
            "key_hex": derived.hex(),
            "key_base64": b64encode(derived).decode("ascii"),
            "not_encryption_note": (
                "scrypt derives key material or password hashes. It is NOT "
                "encryption: the original password cannot be recovered."
            ),
        })


def verify(password: str, salt_hex: str, expected_key_hex: str,
           n: int = 2 ** 14, r: int = 8, p: int = 1,
           key_length: int = 32) -> dict:
    """Verify a password against a previously derived scrypt key."""
    if not salt_hex:
        raise ValidationError("Salt is required for verification",
                              "missing_salt")
    if not expected_key_hex:
        raise ValidationError("Expected key is required", "missing_expected")
    try:
        salt_bytes = bytes.fromhex(salt_hex)
    except ValueError as exc:
        raise ValidationError("Salt must be valid hexadecimal",
                              "invalid_salt") from exc

    pw_bytes = password.encode("utf-8")
    kdf = Scrypt(salt=salt_bytes, length=key_length, n=n, r=r, p=p)
    try:
        kdf.verify(pw_bytes, bytes.fromhex(expected_key_hex))
        valid = True
    except (InvalidKey, ValueError):
        valid = False

    return build_result("scrypt", "verify", "<password hidden>",
                        {"n": n, "r": r, "p": p}, valid, [],
                        {"valid": valid,
                         "result": "VALID" if valid else "INVALID"})


def get_metadata() -> dict:
    return METADATA