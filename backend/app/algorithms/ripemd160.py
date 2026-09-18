"""RIPEMD-160 educational simulator.

RIPEMD-160 is a 160-bit hash designed by Dobbertin, Bosselaers and Preneel
(1996) as a European alternative to MD4/MD5 and SHA-1. It runs two parallel
40-round lines whose results are combined at the end. It is *not* broken in
practice, but it is legacy: it is no longer recommended for new designs
(prefer SHA-256/SHA-3) and is included here mainly for compatibility and
study (it is still widely used in Bitcoin addresses and OpenPGP).

The digest is computed with hashlib/OpenSSL when the 'ripemd160' algorithm
is available; otherwise the operation reports that the provider is missing
rather than inventing a result.
"""

from __future__ import annotations

import hashlib

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "ripemd160",
    "name": "RIPEMD-160",
    "category": "hashing",
    "security_status": "deprecated",
    "reversible": False,
    "key_kind": "none",
    "block_size": "512-bit blocks",
    "description": (
        "RIPEMD-160 is a 160-bit legacy hash with two parallel 40-round "
        "lines. It is not broken, but 160-bit digests and its age make it a "
        "compatibility choice rather than a modern recommendation."
    ),
    "formula": "two parallel 40-round lines, combined into a 160-bit digest",
}

BLOCK_BYTES = 64
LENGTH_BYTES = 8
DIGEST_BYTES = 20

# RIPEMD-160 initial value (5 little-endian 32-bit words).
IV = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]


def _available() -> bool:
    return "ripemd160" in hashlib.algorithms_available


def _digest(data: bytes) -> str:
    if not _available():
        raise ValidationError(
            "RIPEMD-160 is not provided by this OpenSSL build; no trusted "
            "implementation is available.",
            "algorithm_unavailable",
        )
    return hashlib.new("ripemd160", data).hexdigest()


def _padded_length(data: bytes) -> int:
    length = len(data) + 1
    while length % BLOCK_BYTES != BLOCK_BYTES - LENGTH_BYTES:
        length += 1
    return length + LENGTH_BYTES


def _padded_bytes(data: bytes) -> bytes:
    """The concrete bytes fed to the compression function (real padding)."""
    bit_len = len(data) * 8
    zeros = ((BLOCK_BYTES - LENGTH_BYTES) - (len(data) + 1) % BLOCK_BYTES) % BLOCK_BYTES
    return data + b"\x80" + b"\x00" * zeros + bit_len.to_bytes(LENGTH_BYTES, "little")


def _padded_blocks(data: bytes) -> list:
    padded = _padded_bytes(data)
    return [padded[i:i + BLOCK_BYTES].hex()
            for i in range(0, len(padded), BLOCK_BYTES)]


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
             "Append 0x80, zero-fill until 8 bytes remain in the final "
             "64-byte block, then append the 64-bit LITTLE-endian bit length "
             "(RIPEMD uses little-endian, unlike SHA).",
             data.hex(),
             f"{blocks} block(s) of 512 bits",
             {"padded_length": info["padded_length"], "block_count": blocks,
              "padded_message_blocks": info["padded_message_blocks"]}),
        step(3, "Initialize the state",
             "Five 32-bit words are loaded from the RIPEMD-160 initial value.",
             "", " ".join(f"{w:08x}" for w in IV),
             {"initial_value": [f"{w:08x}" for w in IV]}),
        step(4, "Process every block with two lines",
             "Each block is fed to two parallel lines (left and right) of 40 "
             "rounds with different constants and word orders; their states "
             "are combined after every block.",
             f"{blocks} block(s)", "final 160-bit state",
             {"rounds_per_line": 40, "lines": 2}),
        step(5, "Produce the digest",
             "The five final 32-bit words are serialized little-endian into "
             "the 160-bit digest.",
             "160-bit state", info["digest"],
             {"digest": info["digest"], "digest_bits": 160}),
    ]

    return build_result("ripemd160", "hash", message, {}, info["digest"], steps,
                        {
                            "digest": info["digest"],
                            "digest_size": DIGEST_BYTES,
                            "block_count": blocks,
                            "initial_value": [f"{w:08x}" for w in IV],
                            "padded_message_blocks": info["padded_message_blocks"],
                            "padded_length": info["padded_length"],
                            "security_note": (
                                "RIPEMD-160 is legacy/compatibility. For new "
                                "designs prefer SHA-256 or SHA-3."
                            ),
                        })


def get_metadata() -> dict:
    return METADATA
