"""bcrypt password hashing educational simulator.

bcrypt (Provos & Mazières, 1999) is a deliberately slow password-hashing
scheme based on the Blowfish key schedule. It embeds a random salt in the
output hash string, so identical passwords produce different hashes, and
verification is done by re-deriving the hash with the stored salt and cost.

Uses the well-reviewed ``bcrypt`` package for the actual computation.
bcrypt is a PASSWORD HASH — it is NOT encryption.
"""

from __future__ import annotations

from typing import Optional

import bcrypt as bcrypt_lib

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "bcrypt",
    "name": "bcrypt",
    "category": "kdf",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "password + random salt + cost factor",
    "block_size": "—",
    "description": (
        "bcrypt is a slow, salted password-hashing function (KDF-like cost "
        "function). It derives a 184-bit hash string that includes the salt "
        "and cost factor, so verification only needs the hash itself. "
        "DELIBERATELY slow to resist brute force. It is NOT encryption."
    ),
}


def _check_rounds(rounds: int) -> int:
    if rounds is None:
        return 12
    if not isinstance(rounds, int) or not 4 <= rounds <= 31:
        raise ValidationError("Rounds (cost) must be an integer in [4, 31]",
                              "invalid_rounds")
    return rounds


def _password_bytes(password: str) -> bytes:
    if password is None:
        raise ValidationError("Password is required", "missing_password")
    pw = password
    if len(pw.encode("utf-8")) > 72:
        raise ValidationError(
            "bcrypt only supports passwords up to 72 bytes", "password_too_long"
        )
    return pw.encode("utf-8")


def hash_password(password: str, rounds: int = 12) -> dict:
    """Hash a password, producing a self-contained bcrypt hash string."""
    cost = _check_rounds(rounds)
    pw_bytes = _password_bytes(password)

    salt = bcrypt_lib.gensalt(rounds=cost)
    hashed = bcrypt_lib.hashpw(pw_bytes, salt)

    steps = [
        step(1, "Generate a random salt",
             "A 128-bit random salt is generated with a cryptographically "
             "secure generator (CSPRNG).",
             "<random>", salt.decode("utf-8"),
             {"salt": salt.decode("utf-8"),
              "salt_random": True}),
        step(2, "Run the Blowfish-based key schedule",
             f"The password and salt feed the Blowfish key schedule with a "
             f"cost factor of 2^{cost} ({2 ** cost} iterations) — this is "
             "what makes brute force expensive.",
             f"cost = {cost}", "expanded key schedule",
             {"rounds": 2 ** cost, "cost": cost}),
        step(3, "Produce the hash string",
             "The final ciphertext of the magic string 'OrpheanBeholderScry"
             "Doubt' becomes the 184-bit hash, stored together with the salt "
             "and cost prefix.",
             "", hashed.decode("utf-8"), {"hash": hashed.decode("utf-8")}),
    ]

    return build_result(
        "bcrypt", "hash_password", "<password hidden>", {"rounds": cost},
        hashed.decode("utf-8"), steps,
        {
            "hash": hashed.decode("utf-8"),
            "algorithm": "bcrypt",
            "rounds": cost,
            "salt": salt.decode("utf-8"),
            "password_hidden": True,
            "not_encryption_note": (
                "bcrypt produces a one-way PASSWORD HASH. It is NOT "
                "encryption: the password cannot be recovered, and the hash "
                "is only used to verify a guessed password at login time."
            ),
        })


def verify(password: str, hash_str: str) -> dict:
    """Verify a password against a bcrypt hash string."""
    if not hash_str:
        raise ValidationError("bcrypt hash is required", "missing_hash")
    pw_bytes = _password_bytes(password)
    try:
        stored = hash_str.encode("utf-8")
        valid = bcrypt_lib.checkpw(pw_bytes, stored)
    except ValueError as exc:
        raise ValidationError("Invalid bcrypt hash string", "invalid_hash") from exc

    return build_result(
        "bcrypt", "verify", "<password hidden>", {},
        valid, [],
        {"valid": valid, "result": "VALID" if valid else "INVALID",
         "hash_prefix": hash_str[:29] if len(hash_str) >= 29 else hash_str,
         "password_hidden": True})


def get_metadata() -> dict:
    return METADATA