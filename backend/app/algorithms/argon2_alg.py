"""Argon2 password hashing educational simulator.

Argon2 (winner of the 2015 Password Hashing Competition) is a memory-hard
password-hashing function with three variants:
  * Argon2d  — data-dependent, best against GPU brute force
  * Argon2i  — data-independent, needs more passes (slightly slower)
  * Argon2id — hybrid (recommended default)

Uses the ``argon2-cffi`` package for the actual computation (the 
recommended Argon2 implementation, binding to the reference C library).
Argon2 produces a self-contained PHC-format string, so verification only
needs the stored hash. It is a PASSWORD HASH — NOT encryption.
"""

from __future__ import annotations

import secrets
from typing import Optional

from argon2 import PasswordHasher, Type as Argon2Type
from argon2.exceptions import VerifyMismatchError, InvalidHashError

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "argon2",
    "name": "Argon2",
    "category": "kdf",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "password + random salt + time/memory parallelism",
    "block_size": "—",
    "description": (
        "Argon2 is the modern memory-hard password-hashing winner of the "
        "2015 Password Hashing Competition. Argon2id combines data-dependent "
        "and data-independent passes and is the recommended default for new "
        "systems. It requires a tunable amount of memory (m) and CPU time "
        "(t), resisting GPU/ASIC brute force. It is NOT encryption."
    ),
}


def _phc_hash(password: str, time_cost: int = 3, memory_cost: int = 65536,
              parallelism: int = 2, hash_length: int = 32,
              salt_hex: Optional[str] = None, variant: str = "argon2id",
              random_salt: bool = True) -> dict:
    if password is None:
        raise ValidationError("Password is required", "missing_password")
    if variant not in ("argon2id", "argon2i", "argon2d"):
        raise ValidationError(
            "Variant must be 'argon2id', 'argon2i' or 'argon2d'",
            "invalid_variant")
    if not isinstance(time_cost, int) or time_cost < 1:
        raise ValidationError("Time cost (t) must be ≥ 1", "invalid_time_cost")
    if not isinstance(memory_cost, int) or memory_cost < 8:
        raise ValidationError("Memory cost (m) must be ≥ 8 KiB",
                              "invalid_memory_cost")
    if not isinstance(parallelism, int) or parallelism < 1:
        raise ValidationError("Parallelism (p) must be ≥ 1",
                              "invalid_parallelism")
    if not 1 <= hash_length <= 64:
        raise ValidationError("Hash length must be in [1, 64] bytes",
                              "invalid_hash_length")
    if memory_cost > 2 ** 20:
        raise ValidationError(
            "Memory cost too large for the simulator (m ≤ 2^20 KiB = 1 GiB)",
            "invalid_memory_cost")

    if salt_hex:
        try:
            salt_bytes = bytes.fromhex(salt_hex)
        except ValueError as exc:
            raise ValidationError("Salt must be valid hexadecimal",
                                  "invalid_salt") from exc
        salt_was_random = False
    elif random_salt:
        salt_bytes = secrets.token_bytes(16)
        salt_was_random = True
    else:
        salt_bytes = secrets.token_bytes(16)
        salt_was_random = True

    type_map = {
        "argon2id": Argon2Type.ID,
        "argon2i": Argon2Type.I,
        "argon2d": Argon2Type.D,
    }
    ph = PasswordHasher(
        time_cost=time_cost,
        memory_cost=memory_cost,
        parallelism=parallelism,
        hash_len=hash_length,
        type=type_map[variant],
    )
    # argon2-cffi expects a salt string; pass it in as a hex salt param.
    if not salt_was_random:
        # Build the hash with our explicit salt by encoding it.
        salt_str = salt_bytes.hex()
        hasher_hash = ph.hash(password, salt=salt_str)
    else:
        hasher_hash = ph.hash(password)

    memory_mib = memory_cost // 1024
    return {
        "hash": hasher_hash,
        "salt_hex": salt_bytes.hex(),
        "salt_random": salt_was_random,
        "variant": variant,
        "time_cost": time_cost,
        "memory_cost_mib": memory_mib,
        "memory_cost_kib": memory_cost,
        "parallelism": parallelism,
        "hash_length": hash_length,
    }


def hash_password(password: str, time_cost: int = 3,
                  memory_cost: int = 65536, parallelism: int = 2,
                  hash_length: int = 32, variant: str = "argon2id",
                  salt_hex: Optional[str] = None,
                  random_salt: bool = True) -> dict:
    """Hash a password with Argon2 producing a PHC-format hash string."""
    data = _phc_hash(password, time_cost, memory_cost, parallelism,
                     hash_length, salt_hex, variant, random_salt)

    steps = [
        step(1, "Generate a random salt",
             "A 128-bit salt is generated with a cryptographically secure "
             "random generator (CSPRNG). Every hash gets a unique salt.",
             "<random>", data["salt_hex"],
             {"salt_hex": data["salt_hex"], "salt_random": data["salt_random"]}),
        step(2, "Choose Argon2 parameters",
             f"Variant = {variant}, time cost t = {data['time_cost']}, "
             f"memory cost m = {data['memory_cost_kib']} KiB "
             f"(~{data['memory_cost_mib']} MiB), parallelism p = "
             f"{data['parallelism']}. The memory footprint is what defeats "
             "GPU/ASIC brute force.",
             f"t={data['time_cost']}, m={data['memory_cost_kib']}, "
             f"p={data['parallelism']}, variant={variant}",
             f"~{data['memory_cost_mib']} MiB memory",
             {"time_cost": data["time_cost"],
              "memory_cost_kib": data["memory_cost_kib"],
              "parallelism": data["parallelism"], "variant": variant}),
        step(3, "Run the Argon2 blocks",
             "The memory-hard core mixes the password and salt over "
             "the allocated memory using BLAKE2b as the compression "
             "function.",
             f"t={data['time_cost']} passes over "
             f"{data['memory_cost_kib']} KiB",
             "filled memory blocks",
             {"hash_length": hash_length}),
        step(4, "Produce the PHC string",
             "The result is serialized into the PHC format "
             "'$argon2id$v=19$m=…,t=…,p=…$<salt>$<hash>', which embeds all "
             "parameters needed for later verification.",
             "", data["hash"], {"hash": data["hash"]}),
    ]

    return build_result(
        "argon2", "hash_password", "<password hidden>",
        {"time_cost": data["time_cost"], "memory_cost": data["memory_cost_kib"],
         "parallelism": data["parallelism"], "variant": variant},
        data["hash"], steps,
        {
            "hash": data["hash"],
            "algorithm": "argon2-" + variant,
            "variant": variant,
            "salt_hex": data["salt_hex"],
            "salt_random": data["salt_random"],
            "time_cost": data["time_cost"],
            "memory_cost_kib": data["memory_cost_kib"],
            "memory_cost_mib": data["memory_cost_mib"],
            "parallelism": data["parallelism"],
            "hash_length": hash_length,
            "password_hidden": True,
            "not_encryption_note": (
                "Argon2 produces a one-way PASSWORD HASH. It is NOT "
                "encryption: the password cannot be recovered, and the hash "
                "is only used to verify a guessed password at login time."
            ),
        })


def verify(password: str, hash_str: str) -> dict:
    """Verify a password against an Argon2 PHC-format hash string."""
    if not hash_str:
        raise ValidationError("Argon2 hash is required", "missing_hash")
    ph = PasswordHasher()
    try:
        ph.verify(hash_str, password)
        valid = True
    except VerifyMismatchError:
        valid = False
    except (InvalidHashError, TypeError):
        raise ValidationError("Invalid Argon2 hash string", "invalid_hash")

    return build_result(
        "argon2", "verify", "<password hidden>", {},
        valid, [],
        {"valid": valid, "result": "VALID" if valid else "INVALID",
         "hash_prefix": hash_str[:19] if len(hash_str) >= 19 else hash_str,
         "password_hidden": True})


def get_metadata() -> dict:
    return METADATA