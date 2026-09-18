"""SHA-224 educational simulator (FIPS 180-4).

SHA-224 is the 224-bit truncated variant of the SHA-2 family. It uses the
same 32-bit compression function as SHA-256 but starts from a *different*
initial value and discards the last 32-bit word of the final state. The
actual digest is computed with Python's hashlib (OpenSSL), never fabricated.
"""

from __future__ import annotations

import hashlib

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "sha224",
    "name": "SHA-224",
    "category": "hashing",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "none",
    "block_size": "512-bit blocks",
    "description": (
        "SHA-224 (FIPS 180-4) is a 224-bit truncated SHA-2 hash. It reuses "
        "the SHA-256 compression function with a different initial value and "
        "outputs only 224 bits, giving a smaller, cheaper digest."
    ),
    "formula": "SHA-256 compression (64 rounds), 32-bit state truncated to 224 bits",
}

BLOCK_BYTES = 64
LENGTH_BYTES = 8
DIGEST_BYTES = 28

# SHA-224 initial hash value (FIPS 180-4 §5.3.2).
IV = [
    0xC1059ED8, 0x367CD507, 0x3070DD17, 0xF70E5939,
    0xFFC00B31, 0x68581511, 0x64F98FA7, 0xBEFA4FA4,
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
    return hashlib.sha224(data).hexdigest()


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
    """Dispatch-compatible hash operation (operation name 'hash')."""
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
        step(2, "Padding (Merkle–Damgård strengthening)",
             "Append a 0x80 byte, pad with zeros until 8 bytes remain in the "
             "final 64-byte block, then append the 64-bit big-endian original "
             "bit length.",
             data.hex(),
             f"{blocks} block(s) of 512 bits",
             {"padded_length": info["padded_length"], "block_count": blocks,
              "padded_message_blocks": info["padded_message_blocks"]}),
        step(3, "Initialize the state",
             "Eight 32-bit words are loaded from the SHA-224 initial value "
             "(distinct from SHA-256's H₀).",
             "", " ".join(f"{w:08x}" for w in IV),
             {"initial_value": [f"{w:08x}" for w in IV]}),
        step(4, "Process every block",
             "Each 512-bit block is expanded into 64 words and runs the "
             "compression function for 64 rounds, updating the chaining state.",
             f"{blocks} block(s)", "final 256-bit state",
             {"rounds_per_block": 64}),
        step(5, "Truncate to the digest",
             "The final state's first seven 32-bit words form the 224-bit "
             "digest (the eighth word is discarded).",
             "256-bit state", info["digest"],
             {"digest": info["digest"], "digest_bits": 224}),
    ]

    return build_result("sha224", "hash", message, {}, info["digest"], steps,
                        {
                            "digest": info["digest"],
                            "digest_size": DIGEST_BYTES,
                            "block_count": blocks,
                            "initial_value": [f"{w:08x}" for w in IV],
                            "padded_message_blocks": info["padded_message_blocks"],
                            "padded_length": info["padded_length"],
                            "one_way_note": (
                                "Hashing is one-way: the digest cannot be "
                                "turned back into the message."
                            ),
                        })


def get_metadata() -> dict:
    return METADATA
