"""SHA-384 educational simulator (FIPS 180-4).

SHA-384 is a 384-bit truncated variant of SHA-512. It uses the same 64-bit
compression function and 1024-bit blocks as SHA-512 but starts from a
different initial value and outputs only the first six 64-bit words. The
actual digest is computed with hashlib (OpenSSL).
"""

from __future__ import annotations

import hashlib

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "sha384",
    "name": "SHA-384",
    "category": "hashing",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "none",
    "block_size": "1024-bit blocks",
    "description": (
        "SHA-384 (FIPS 180-4) is a 384-bit truncated SHA-2 hash built on the "
        "SHA-512 64-bit compression function with a distinct initial value. "
        "It offers a larger digest and 192-bit collision resistance."
    ),
    "formula": "SHA-512 compression (80 rounds), 64-bit state truncated to 384 bits",
}

BLOCK_BYTES = 128
LENGTH_BYTES = 16
DIGEST_BYTES = 48

# SHA-384 initial hash value (FIPS 180-4 §5.3.4).
IV = [
    0xCBBB9D5DC1059ED8, 0x629A292A367CD507, 0x9159015A3070DD17,
    0x152FECD8F70E5939, 0x67332667FFC00B31, 0x8EB44A8768581511,
    0xDB0C2E0D64F98FA7, 0x47B5481DBEFA4FA4,
]


def _padded_length(data: bytes) -> int:
    length = len(data) + 1
    while length % BLOCK_BYTES != BLOCK_BYTES - LENGTH_BYTES:
        length += 1
    return length + LENGTH_BYTES


def _padded_bytes(data: bytes) -> bytes:
    """The concrete bytes fed to the compression function (real padding)."""
    bit_len = len(data) * 8
    zeros = ((BLOCK_BYTES - LENGTH_BYTES) - (len(data) + 1) % BLOCK_BYTES) % BLOCK_BYTES
    return data + b"\x80" + b"\x00" * zeros + bit_len.to_bytes(LENGTH_BYTES, "big")


def _padded_blocks(data: bytes) -> list:
    padded = _padded_bytes(data)
    return [padded[i:i + BLOCK_BYTES].hex()
            for i in range(0, len(padded), BLOCK_BYTES)]


def _digest(data: bytes) -> str:
    return hashlib.sha384(data).hexdigest()


def hash_bytes(data: bytes) -> dict:
    if not isinstance(data, (bytes, bytearray)):
        raise ValidationError("Input must be bytes", "invalid_input")
    payload = bytes(data)
    digest = _digest(payload)
    padded = _padded_length(payload)
    return {
        "digest": digest,
        "digest_size": DIGEST_BYTES,
        "padded_length": padded,
        "block_count": padded // BLOCK_BYTES,
        "original_bits": len(payload) * 8,
        "padded_message_blocks": _padded_blocks(payload),
    }


def hash(message: str) -> dict:
    if message is None or not isinstance(message, str):
        raise ValidationError("Message must not be empty", "empty_input")
    data = message.encode("utf-8")
    info = hash_bytes(data)
    blocks = info["block_count"]

    steps = [
        step(1, "Encode the message",
             "The message is UTF-8 encoded as bytes.",
             message, data.hex(),
             {"bytes": data.hex(), "length_bits": info["original_bits"]}),
        step(2, "Padding",
             "Append 0x80, zero-fill until 16 bytes remain in the final "
             "128-byte block, then append the 128-bit big-endian bit length.",
             data.hex(),
             f"{blocks} block(s) of 1024 bits",
             {"padded_length": info["padded_length"], "block_count": blocks,
              "padded_message_blocks": info["padded_message_blocks"]}),
        step(3, "Initialize the state",
             "Eight 64-bit words are loaded from the SHA-384 initial value "
             "(distinct from SHA-512's H₀).",
             "", " ".join(f"{w:016x}" for w in IV),
             {"initial_value": [f"{w:016x}" for w in IV]}),
        step(4, "Process every block",
             "Each 1024-bit block is expanded into 80 words and runs 80 "
             "compression rounds on the 64-bit state.",
             f"{blocks} block(s)", "final 512-bit state",
             {"rounds_per_block": 80}),
        step(5, "Truncate to the digest",
             "The final state's first six 64-bit words form the 384-bit "
             "digest.",
             "512-bit state", info["digest"],
             {"digest": info["digest"], "digest_bits": 384}),
    ]

    return build_result("sha384", "hash", message, {}, info["digest"], steps,
                        {
                            "digest": info["digest"],
                            "digest_size": DIGEST_BYTES,
                            "block_count": blocks,
                            "initial_value": [f"{w:016x}" for w in IV],
                            "padded_message_blocks": info["padded_message_blocks"],
                            "padded_length": info["padded_length"],
                            "one_way_note": (
                                "Hashing is one-way: the digest cannot be "
                                "turned back into the message."
                            ),
                        })


def get_metadata() -> dict:
    return METADATA
