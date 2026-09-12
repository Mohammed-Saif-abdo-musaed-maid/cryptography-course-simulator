"""PBKDF2 (Password-Based Key Derivation Function 2) educational simulator.

PBKDF2-HMAC-SHA256 as specified in RFC 8018 / PKCS#5. Derives a
cryptographic key from a password + salt by iterating HMAC many times,
slowing down brute-force attempts. Uses the ``cryptography`` library
for the actual computation.

A password hash (used to store/verify passwords) and key derivation
(expanding a password into key material for encryption) are different
purposes — this module can serve both, with a ``verify`` operation for
the password-storage use case.
"""

from __future__ import annotations

import secrets
from base64 import b64encode
from typing import Optional

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "pbkdf2",
    "name": "PBKDF2",
    "category": "kdf",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "password + salt + iterations",
    "block_size": "—",
    "description": (
        "PBKDF2 (RFC 8018) derives a cryptographic key from a password by "
        "hashing it with a random salt thousands of times. The iteration "
        "count deliberately makes each attempt slow, resisting brute-force "
        "attacks. Used for password storage (with a verify step) or to "
        "stretch a password into key material."
    ),
}

PRF_ALGORITHMS = {"sha256": hashes.SHA256, "sha512": hashes.SHA512}


def derive(password: str, salt: str = "", iterations: int = 100000,
           key_length: int = 32, algorithm: str = "sha256",
           salt_hex: Optional[str] = None, random_salt: bool = False) -> dict:
    """Derive key material from a password. Never store the plain password."""
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

    if algorithm not in PRF_ALGORITHMS:
        raise ValidationError(
            f"PRF must be one of {sorted(PRF_ALGORITHMS)}", "invalid_algorithm")
    if iterations < 1:
        raise ValidationError("Iterations must be ≥ 1", "invalid_iterations")
    if not 1 <= key_length <= 64:
        raise ValidationError("Key length must be in [1, 64] bytes",
                              "invalid_key_length")

    pw_bytes = password.encode("utf-8")
    kdf = PBKDF2HMAC(
        algorithm=PRF_ALGORITHMS[algorithm](),
        length=key_length,
        salt=salt_bytes,
        iterations=iterations,
    )
    derived = kdf.derive(pw_bytes)

    steps = [
        step(1, "Encode password and salt",
             "The password is UTF-8 encoded; the salt provides uniqueness so "
             "identical passwords produce different keys.",
             f"password = <{len(pw_bytes)} bytes hidden>",
             f"salt = {salt_bytes.hex()}",
             {"salt_hex": salt_bytes.hex(), "salt_random": salt_was_random,
              "salt_length": len(salt_bytes)}),
        step(2, "Configure HMAC-PRF",
             "The pseudorandom function PRF = %s-HMAC is applied repeatedly. "
             "Each iteration XORs HMAC(password, salt || block-index) into "
             "the output." % algorithm.upper(),
             f"iterations = {iterations}, length = {key_length} bytes",
             "PRF selected", {"prf": algorithm.upper()}),
        step(3, "Iterate the PRF",
             f"One PRF pass runs {algorithm.upper()} {iterations} times over "
             "the password and salt, making brute force expensive.",
             f"{iterations} iterations", "PRF output blocks",
             {"iterations": iterations}),
        step(4, "Concatenate blocks",
             "The derived blocks are concatenated and truncated to the "
             "requested key length.",
             f"{key_length} bytes", derived.hex(),
             {"key_hex": derived.hex()}),
    ]

    return build_result(
        "pbkdf2", "derive", "<password hidden>",
        {"iterations": iterations, "key_length": key_length,
         "algorithm": algorithm}, derived.hex(), steps,
        {
            "kdf": "PBKDF2-" + algorithm.upper(),
            "salt_hex": salt_bytes.hex(),
            "salt_random": salt_was_random,
            "iterations": iterations,
            "key_length": key_length,
            "key_hex": derived.hex(),
            "key_base64": b64encode(derived).decode("ascii"),
            "not_encryption_note": (
                "PBKDF2 derives keys or password hashes. It is NOT encryption "
                "and does not hide a password — do not store plaintext "
                "passwords."
            ),
        })


def verify(password: str, salt_hex: str, expected_key_hex: str,
           iterations: int = 100000, key_length: int = 32,
           algorithm: str = "sha256") -> dict:
    """Verify a password against a previously derived key/hash."""
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
    if algorithm not in PRF_ALGORITHMS:
        raise ValidationError(
            f"PRF must be one of {sorted(PRF_ALGORITHMS)}", "invalid_algorithm")

    pw_bytes = password.encode("utf-8")
    kdf = PBKDF2HMAC(
        algorithm=PRF_ALGORITHMS[algorithm](),
        length=key_length,
        salt=salt_bytes,
        iterations=iterations,
    )
    try:
        kdf.verify(pw_bytes, bytes.fromhex(expected_key_hex))
        valid = True
    except Exception:
        valid = False

    return build_result("pbkdf2", "verify", "<password hidden>",
                        {"iterations": iterations, "key_length": key_length},
                        valid, [],
                        {"valid": valid, "result": "VALID" if valid else "INVALID"})


def get_metadata() -> dict:
    return METADATA