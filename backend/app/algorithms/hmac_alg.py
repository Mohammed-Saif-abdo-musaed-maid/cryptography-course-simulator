"""HMAC (Keyed-Hash Message Authentication Code) educational simulator.

HMAC = hash(key XOR opad || hash(key XOR ipad || message))

Uses the well-reviewed ``cryptography`` library for the actual MAC
computation (HMAC-SHA256 and HMAC-SHA512), with educational step-by-step
explanations. HMAC provides message *authentication* (integrity + origin),
NOT encryption — it does not hide the message content.
"""

from __future__ import annotations

from base64 import b64decode, b64encode
from typing import Optional

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import hashes, hmac as crypto_hmac

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "hmac",
    "name": "HMAC",
    "category": "mac",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "secret key (any length)",
    "block_size": "HMAC-SHA256: 64-byte blocks; HMAC-SHA512: 128-byte blocks",
    "description": (
        "Keyed-Hash Message Authentication Code (RFC 2104). HMAC verifies "
        "message integrity AND authenticity using a shared secret key. "
        "It is NOT encryption — the message itself stays visible."
    ),
}

VALID_ALGORITHMS = {"sha256": hashes.SHA256, "sha512": hashes.SHA512}
DIGEST_LENGTHS = {"sha256": 32, "sha512": 64}


def _parse_key(key: str) -> bytes:
    if key is None:
        raise ValidationError("Secret key is required", "missing_key")
    return str(key).encode("utf-8")


def _compute_hmac(message: str, key: str, algorithm: str,
                  output_format: str) -> dict:
    if algorithm not in VALID_ALGORITHMS:
        raise ValidationError(
            f"HMAC algorithm must be one of {sorted(VALID_ALGORITHMS)}",
            "invalid_algorithm")
    if output_format not in ("hex", "base64"):
        raise ValidationError(
            "Output encoding must be 'hex' or 'base64'", "invalid_encoding")

    msg_bytes = message.encode("utf-8")
    key_bytes = _parse_key(key)
    hash_cls = VALID_ALGORITHMS[algorithm]
    block_size = 64 if algorithm == "sha256" else 128

    # The actual HMAC computation via the cryptography library.
    h = crypto_hmac.HMAC(key_bytes, hash_cls())
    h.update(msg_bytes)
    mac_bytes = h.finalize()

    # Educational derivation of the padding keys (ipad/opad).
    if len(key_bytes) > block_size:
        k = crypto_hmac.HMAC(b"", hash_cls())
        k.update(key_bytes)
        # Cannot access internal digest; recompute via hashes.Hash.
        hasher = hashes.Hash(hash_cls())
        hasher.update(key_bytes)
        k0 = hasher.finalize()
        key_note = (
            f"Key length ({len(key_bytes)} bytes) exceeds the {block_size}-byte "
            f"block size; the key is first hashed to {DIGEST_LENGTHS[algorithm]} bytes."
        )
    else:
        k0 = key_bytes
        key_note = (
            f"Key length ({len(key_bytes)} bytes) ≤ {block_size}; used directly."
        )

    ipad = bytes(b ^ 0x36 for b in k0 + bytes(block_size - len(k0)))
    opad = bytes(b ^ 0x5C for b in k0 + bytes(block_size - len(k0)))

    # Inner hash: H(K XOR ipad || message)
    inner_hasher = hashes.Hash(hash_cls())
    inner_hasher.update(ipad)
    inner_hasher.update(msg_bytes)
    inner_digest = inner_hasher.finalize()

    # Outer hash: H(K XOR opad || inner)
    outer_hasher = hashes.Hash(hash_cls())
    outer_hasher.update(opad)
    outer_hasher.update(inner_digest)
    outer_digest = outer_hasher.finalize()

    if output_format == "base64":
        output = b64encode(mac_bytes).decode("ascii")
    else:
        output = mac_bytes.hex()

    steps = [
        step(1, "Encode message and key",
             "Both the message and the secret key are UTF-8 encoded as bytes.",
             f"message = {message!r}", f"{len(msg_bytes)} message bytes, "
             f"{len(key_bytes)} key bytes",
             {"message_bytes": msg_bytes.hex(),
              "key_bytes": key_bytes.hex(), "key_note": key_note}),
        step(2, "Pad the key",
             "If the key is longer than the hash block size it is hashed "
             "first; otherwise it is zero-padded to the block size. The "
             "padded key K0 has the same length as the hash block.",
             f"key = {key_bytes.hex()}", f"K0 = {len(k0)} bytes",
             {"ipad": ipad.hex(), "opad": opad.hex()}),
        step(3, "Compute the inner hash",
             "The padded key is XORed with the constant ipad (0x36) and "
             "prepended to the message; the %s hash is computed." %
             algorithm.upper(),
             "K0 XOR ipad || message", inner_digest.hex(),
             {"inner_hash": inner_digest.hex()}),
        step(4, "Compute the outer hash",
             "The padded key is XORed with the constant opad (0x5c) and "
             "prepended to the inner hash; the %s hash of this is the MAC." %
             algorithm.upper(),
             "K0 XOR opad || inner_hash", output,
             {"outer_hash": outer_digest.hex()}),
    ]

    return build_result(
        "hmac", "sign", message,
        {"key": f"<{len(key_bytes)} bytes hidden>", "algorithm": algorithm,
         "output_format": output_format},
        output, steps,
        {
            "mac": output,
            "algorithm": algorithm,
            "output_format": output_format,
            "digest_length": DIGEST_LENGTHS[algorithm],
            "message_bytes": len(msg_bytes),
            "key_bytes": len(key_bytes),
            "ipad_hex": ipad.hex(),
            "opad_hex": opad.hex(),
            "inner_hash": inner_digest.hex(),
            "outer_hash": outer_digest.hex(),
            "not_encryption_note": (
                "HMAC authenticates a message (integrity + origin) but does "
                "NOT hide its content. It is a Message Authentication Code, "
                "not encryption."
            ),
        })


def sign(message: str, key: str, algorithm: str = "sha256",
         output_format: str = "hex") -> dict:
    """Compute an HMAC for the message. Key is hidden from the result."""
    return _compute_hmac(message, key, algorithm, output_format)


def verify(message: str, key: str, mac: str, algorithm: str = "sha256",
           output_format: str = "hex") -> dict:
    """Verify a MAC. Accepts hex or base64 MACs matching the output format."""
    if not mac:
        raise ValidationError("MAC value is required for verification",
                              "missing_mac")
    msg_bytes = message.encode("utf-8")
    key_bytes = _parse_key(key)
    hash_cls = VALID_ALGORITHMS.get(algorithm)
    if hash_cls is None:
        raise ValidationError(
            f"HMAC algorithm must be one of {sorted(VALID_ALGORITHMS)}",
            "invalid_algorithm")

    h = crypto_hmac.HMAC(key_bytes, hash_cls())
    h.update(msg_bytes)
    try:
        if output_format == "base64":
            expected = b64decode(mac.encode("ascii"))
        else:
            expected = bytes.fromhex(mac)
        h.verify(expected)
        valid = True
    except (InvalidSignature, ValueError):
        valid = False

    return build_result(
        "hmac", "verify", message,
        {"key": f"<{len(key_bytes)} bytes hidden>", "algorithm": algorithm},
        valid, [],
        {
            "valid": valid,
            "algorithm": algorithm,
            "message_bytes": len(msg_bytes),
            "result": "VALID" if valid else "INVALID",
        })


def get_metadata() -> dict:
    return METADATA