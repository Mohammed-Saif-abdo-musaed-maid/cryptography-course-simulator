"""HKDF (HMAC-based Key Derivation Function) educational simulator.

HKDF (RFC 5869) derives one or more cryptographically strong sub-keys from
a uniform or non-uniform input key material (IKM), using HMAC as the PRF.
It has two phases:
  * Extract:  PRK = HMAC-Hash(salt, IKM)
  * Expand:   OKM = T(1) || T(2) || … where T(i) = HMAC-Hash(PRK, T(i-1) || info || byte(i))

Uses the ``cryptography`` library for the actual computation.
"""

from __future__ import annotations

import secrets
from base64 import b64encode
from typing import Optional

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF as _HKDF
from cryptography.hazmat.primitives.kdf.hkdf import HKDFExpand
from cryptography.hazmat.primitives import hmac as crypto_hmac

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "hkdf",
    "name": "HKDF",
    "category": "kdf",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "IKM (input key material) + salt + info context",
    "block_size": "HMAC-SHA256: 32-byte hash; HMAC-SHA512: 64-byte hash",
    "description": (
        "HKDF (RFC 5869) turns initial keying material into one or more "
        "independent, cryptographically strong sub-keys using HMAC as the "
        "pseudorandom function. The 'info' field binds the derived keys to "
        "their context (e.g. encryption, MAC, session). It is a KDF, not "
        "encryption."
    ),
}

VALID_ALGORITHMS = {"sha256": hashes.SHA256, "sha512": hashes.SHA512}


def _parse_hex(value: str, label: str, optional: bool = False) -> Optional[bytes]:
    if value is None or value == "":
        return None if optional else b""
    try:
        return bytes.fromhex(value)
    except ValueError as exc:
        raise ValidationError(f"{label} must be valid hexadecimal",
                              "invalid_hex") from exc


def derive(ikm: str, salt: str = "", info: str = "",
           length: int = 32, algorithm: str = "sha256",
           ikm_hex: Optional[str] = None, salt_hex: Optional[str] = None,
           info_hex: Optional[str] = None, random_salt: bool = True) -> dict:
    """Derive sub-keys from input key material using HKDF."""
    if algorithm not in VALID_ALGORITHMS:
        raise ValidationError(
            f"Algorithm must be one of {sorted(VALID_ALGORITHMS)}",
            "invalid_algorithm")
    if not isinstance(length, int) or length < 1:
        raise ValidationError("Length must be ≥ 1 byte", "invalid_length")

    # IKM: from hex, or UTF-8 of the text field.
    if ikm_hex:
        try:
            ikm_bytes = bytes.fromhex(ikm_hex)
        except ValueError as exc:
            raise ValidationError("IKM hex must be valid hexadecimal",
                                  "invalid_hex") from exc
    else:
        if not ikm:
            raise ValidationError("Input key material (IKM) is required",
                                  "missing_ikm")
        ikm_bytes = ikm.encode("utf-8")

    salt_was_random = False
    if salt_hex:
        try:
            salt_bytes = bytes.fromhex(salt_hex)
        except ValueError as exc:
            raise ValidationError("Salt hex must be valid hexadecimal",
                                  "invalid_hex") from exc
    elif random_salt or salt is None or salt == "":
        salt_bytes = secrets.token_bytes(16)
        salt_was_random = True
    else:
        salt_bytes = salt.encode("utf-8")

    if info_hex:
        try:
            info_bytes = bytes.fromhex(info_hex)
        except ValueError as exc:
            raise ValidationError("Info hex must be valid hexadecimal",
                                  "invalid_hex") from exc
    else:
        info_bytes = info.encode("utf-8") if info else b""

    hash_cls = VALID_ALGORITHMS[algorithm]
    hkdf = _HKDF(algorithm=hash_cls(), length=length, salt=salt_bytes,
                 info=info_bytes)
    derived = hkdf.derive(ikm_bytes)

    # Educational extract phase.
    prf_hasher = hashes.Hash(hash_cls())
    prf_hasher.update(salt_bytes)
    prf_hasher.update(ikm_bytes)
    extract_bytes = prf_hasher.finalize()  # informational only

    steps = [
        step(1, "Gather input key material (IKM)",
             "The IKM is the initial keying material being stretched. It can "
             "come from a shared secret, a password, or random bytes.",
             f"ikm = <{len(ikm_bytes)} bytes hidden>",
             f"{len(ikm_bytes)} bytes",
             {"ikm_length": len(ikm_bytes)}),
        step(2, "Extract phase: PRK = HMAC(salt, IKM)",
             "A pseudorandom key (PRK) is extracted using HMAC-%s with the "
             "salt. The salt is random here — it makes the output unique even "
             "when the same IKM is reused." % algorithm.upper(),
             f"salt = {salt_bytes.hex()}", f"PRK = <{len(extract_bytes)} bytes>",
             {"salt_hex": salt_bytes.hex(), "salt_random": salt_was_random,
              "info_context": info_bytes.hex()}),
        step(3, "Expand phase: OKM blocks",
             "The PRK is expanded into output key material via HMAC chaining; "
             "the optional 'info' context is mixed in to bind each sub-key "
             "to its purpose.",
             f"info = {info_bytes.hex()!r}", f"{length} output bytes",
             {"info_hex": info_bytes.hex(), "length": length}),
        step(4, "Produce the derived key",
             "The requested number of bytes is made available as the derived "
             "sub-key.",
             f"{length} bytes", derived.hex(), {"key_hex": derived.hex()}),
    ]

    return build_result(
        "hkdf", "derive", "<ikm hidden>",
        {"algorithm": algorithm, "length": length}, derived.hex(), steps,
        {
            "kdf": "HKDF-" + algorithm.upper(),
            "ikm_length": len(ikm_bytes),
            "salt_hex": salt_bytes.hex(),
            "salt_random": salt_was_random,
            "info_context": info_bytes.hex(),
            "length": length,
            "key_hex": derived.hex(),
            "key_base64": b64encode(derived).decode("ascii"),
            "not_encryption_note": (
                "HKDF derives sub-keys from input key material. It is NOT "
                "encryption and gives no confidentiality."
            ),
        })


def get_metadata() -> dict:
    return METADATA