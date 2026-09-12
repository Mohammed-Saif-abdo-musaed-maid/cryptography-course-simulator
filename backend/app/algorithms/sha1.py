"""SHA-1 hash function educational simulator.

Full RFC 3174 implementation:
  * preprocessing (append 0x80, pad to 64-byte multiple, append 64-bit length)
  * 80 rounds per 512-bit message block
  * 5-word (160-bit) working state, modular additions and bit rotations
  * produces the standard 160-bit digest

SECURITY NOTICE: SHA-1 is broken/deprecated. A chosen-prefix collision
(SHAtter, 2017) demonstrated that SHA-1 is not collision-resistant.

IMPORTANT: SHA-1 is a cryptographic hash function, NOT encryption.
It is one-way — there is no decryption operation.
"""

from __future__ import annotations

from typing import List

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "sha1",
    "name": "SHA-1",
    "category": "hashing",
    "security_status": "broken_deprecated",
    "reversible": False,
    "key_kind": "none (unkeyed hash)",
    "block_size": "512-bit blocks",
    "description": (
        "SHA-1 produces a 160-bit digest. It works like a simpler SHA-2 with "
        "80 rounds of linear mixing and a 5-word working buffer. Broken in "
        "practice since 2017 (SHAtter chosen-prefix collision) and deprecated "
        "everywhere. ONE-WAY — it cannot be decrypted."
    ),
}

H_INIT = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]

K = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6]


def _rotl(x: int, n: int) -> int:
    return ((x << n) | (x >> (32 - n))) & 0xFFFFFFFF


def preprocess(message: bytes) -> dict:
    """Return padding details and padded message blocks (64 bytes each)."""
    original_len_bits = len(message) * 8
    msg = bytearray(message)
    msg.append(0x80)
    while len(msg) % 64 != 56:
        msg.append(0x00)
    msg.extend(original_len_bits.to_bytes(8, "big"))
    blocks = [bytes(msg[i:i + 64]) for i in range(0, len(msg), 64)]
    return {
        "original_bytes": len(message),
        "original_bits": original_len_bits,
        "padded_length": len(msg),
        "block_count": len(blocks),
        "blocks": blocks,
    }


def compress(block: bytes, working: List[int]) -> dict:
    """Compress a single 512-bit block. Returns new state + round detail."""
    words = [int.from_bytes(block[i:i + 4], "big") for i in range(0, 64, 4)]
    w = words + [0] * 64
    for t in range(16, 80):
        w[t] = _rotl(
            w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16], 1)

    a, b, c, d, e = working
    rounds = []
    for t in range(80):
        if t < 20:
            f = (b & c) | (~b & d)
            k = K[0]
        elif t < 40:
            f = b ^ c ^ d
            k = K[1]
        elif t < 60:
            f = (b & c) | (b & d) | (c & d)
            k = K[2]
        else:
            f = b ^ c ^ d
            k = K[3]
        temp = (_rotl(a, 5) + f + e + k + w[t]) & 0xFFFFFFFF
        e, d, c, b, a = d, c, _rotl(b, 30), a, temp
        rounds.append({
            "t": t,
            "W": f"{w[t]:08x}",
            "K": f"{k:08x}",
            "f": f"{f:08x}",
            "temp": f"{temp:08x}",
            "state": [f"{v:08x}" for v in (a, b, c, d, e)],
        })

    new_state = [(x + y) & 0xFFFFFFFF for x, y in zip(working, [a, b, c, d, e])]
    return {
        "words": [f"{v:08x}" for v in words],
        "rounds": rounds,
        "new_state": new_state,
    }


def hash_bytes(data: bytes) -> dict:
    prep = preprocess(data)
    state = list(H_INIT)
    block_details = []
    for i, block in enumerate(prep["blocks"]):
        before = list(state)
        result = compress(block, state)
        state = result["new_state"]
        block_details.append({
            "block_index": i,
            "block_hex": block.hex(),
            "rounds": result["rounds"],
            "state_before": [f"{v:08x}" for v in before],
            "state_after": [f"{v:08x}" for v in state],
        })

    digest = "".join(f"{v:08x}" for v in state)
    return {
        "preprocess": prep,
        "blocks": block_details,
        "state": [f"{v:08x}" for v in state],
        "digest": digest,
    }


def hash_text(message: str) -> dict:
    if message is None or not isinstance(message, str):
        raise ValidationError("Message must not be empty", "empty_input")
    data = message.encode("utf-8")
    result = hash_bytes(data)
    prep = result["preprocess"]

    message_blocks = []
    for i, block in enumerate(prep["blocks"]):
        message_blocks.append({
            "index": i,
            "hex": block.hex(),
            "ascii": "".join(chr(b) if 32 <= b < 127 else "." for b in block),
        })

    steps = [
        step(1, "Encode message",
             "The message is UTF-8 encoded as bytes.",
             message, data.hex(),
             {"bytes": data.hex(), "length_bits": prep["original_bits"]}),
        step(2, "Preprocessing (padding)",
             "Append a 0x80 byte, pad with zeros until the length is 56 "
             "bytes short of a multiple of 64, then append the 64-bit "
             "original bit length. One or more 64-byte blocks result.",
             data.hex(),
             f"{prep['block_count']} block(s), padded length {prep['padded_length']}",
             {"original_bits": prep["original_bits"], "blocks": message_blocks}),
        step(3, "Initialize working state",
             "The five 32-bit initial values (A..E) are loaded.",
             "", " ".join(f"{v:08x}" for v in H_INIT),
             {"h_init": [f"{v:08x}" for v in H_INIT]}),
        step(4, "Process each block (80 rounds)",
             "Each block expands its 16 words to an 80-word message schedule "
             "and runs 80 rounds with alternating boolean functions "
             "Ch / Parity / Maj.",
             f"{prep['block_count']} blocks", "compressed state",
             {"blocks": result["blocks"]}),
        step(5, "Produce the digest",
             "The final working state is concatenated to form the 160-bit hash.",
             " ".join(result["state"]),
             result["digest"], {"digest": result["digest"]}),
    ]

    return build_result(
        "sha1", "hash", message, {}, result["digest"], steps,
        {
            "digest": result["digest"],
            "blocks": result["blocks"],
            "preprocess": {**prep, "blocks": [b.hex() for b in prep["blocks"]]},
            "state": result["state"],
            "h_init": [f"{v:08x}" for v in H_INIT],
            "digest_bits": 160,
            "one_way_note": (
                "SHA-1 is one-way: given only the digest, the original message "
                "cannot be recovered. There is no decryption operation."
            ),
            "security_note": (
                "SHA-1 is broken for collision resistance (SHAtter, 2017). "
                "Do not use it for new designs; prefer SHA-2, SHA-3 or BLAKE2."
            ),
        })


def get_metadata() -> dict:
    return METADATA


def hash(message: str) -> dict:
    """Dispatch-compatible alias for the registry (operation 'hash')."""
    return hash_text(message)
