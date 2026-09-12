"""MD5 hash function educational simulator.

Full RFC 1321 implementation:
  * preprocessing (append 0x80, pad to 56 mod 64, append 64-bit length)
  * 64 steps across 4 rounds of 16 steps each
  * 4-word little-endian working state (A, B, C, D)
  * K table = floor(2^32 * |sin(i+1)|), circular per-step shifts
  * produces the standard 128-bit digest

SECURITY NOTICE: MD5 is broken. Collisions can be forged in seconds and it
is unsuitable for signatures or certificates.

IMPORTANT: MD5 is a cryptographic hash function, NOT encryption.
It is one-way — there is no decryption operation.
"""

from __future__ import annotations

import math
from typing import List

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "md5",
    "name": "MD5",
    "category": "hashing",
    "security_status": "broken",
    "reversible": False,
    "key_kind": "none (unkeyed hash)",
    "block_size": "512-bit blocks",
    "description": (
        "MD5 produces a 128-bit digest from 512-bit blocks using four rounds "
        "of nonlinear mixing over 32-bit little-endian words. Extremely fast, "
        "but collision-broken in practice. ONE-WAY — it cannot be decrypted."
    ),
}

# K[i] = floor(2^32 * |sin(i+1)|) exactly as used in the reference implementation.
K = [int(2**32 * abs(math.sin(i + 1))) & 0xFFFFFFFF for i in range(64)]

SHIFTS = [
    [7, 12, 17, 22],
    [5, 9, 14, 20],
    [4, 11, 16, 23],
    [6, 10, 15, 21],
]

# Message-word index tables per round: i, (5i+1)%16, (3i+5)%16, (7i)%16.
INDICES = [
    lambda i: i,
    lambda i: (5 * i + 1) % 16,
    lambda i: (3 * i + 5) % 16,
    lambda i: (7 * i) % 16,
]


def preprocess(message: bytes) -> dict:
    """Return padding details and padded message blocks (64 bytes each)."""
    original_len_bits = len(message) * 8
    msg = bytearray(message)
    msg.append(0x80)
    while len(msg) % 64 != 56:
        msg.append(0x00)
    msg.extend(original_len_bits.to_bytes(8, "little"))
    blocks = [bytes(msg[i:i + 64]) for i in range(0, len(msg), 64)]
    return {
        "original_bytes": len(message),
        "original_bits": original_len_bits,
        "padded_length": len(msg),
        "block_count": len(blocks),
        "blocks": blocks,
    }


def _rotate_left(x: int, n: int) -> int:
    return ((x << n) | (x >> (32 - n))) & 0xFFFFFFFF


def compress(block: bytes, working: List[int]) -> dict:
    """Compress one 512-bit block with the 64-step MD5 round function."""
    words = [int.from_bytes(block[i:i + 4], "little") for i in range(0, 64, 4)]
    a, b, c, d = working
    steps = []
    for round_i in range(4):
        shifts = SHIFTS[round_i]
        index_fn = INDICES[round_i]
        for i in range(16):
            g = index_fn(i)
            if round_i == 0:
                f = (b & c) | (~b & d)
                name, formula = "F(x,y,z) = (x∧y) ∨ (¬x∧z)", "(B∧C) ∨ (¬B∧D)"
            elif round_i == 1:
                f = (d & b) | (~d & c)
                name, formula = "G(x,y,z) = (x∧z) ∨ (¬z∧y)", "(D∧B) ∨ (¬D∧C)"
            elif round_i == 2:
                f = b ^ c ^ d
                name, formula = "H(x,y,z) = x⊕y⊕z", "B⊕C⊕D"
            else:
                f = c ^ (b | ~d)
                name, formula = "I(x,y,z) = y⊕(x∨¬z)", "C⊕(B∨¬D)"

            k = K[round_i * 16 + i]
            s = shifts[i % 4]
            f_val = (f + a + k + words[g]) & 0xFFFFFFFF
            a, d, c, b = d, c, b, (b + _rotate_left(f_val, s)) & 0xFFFFFFFF
            steps.append({
                "round": round_i + 1,
                "step": i + 1,
                "function": name,
                "formula": formula,
                "g": g,
                "K": f"{k:08x}",
                "shift": s,
                "state": [f"{v:08x}" for v in (a, b, c, d)],
            })

    new_state = [(x + y) & 0xFFFFFFFF for x, y in zip(working, [a, b, c, d])]
    return {
        "words": [f"{v:08x}" for v in words],
        "steps": steps,
        "new_state": new_state,
    }


def hash_bytes(data: bytes) -> dict:
    prep = preprocess(data)
    state = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476]
    block_details = []
    for i, block in enumerate(prep["blocks"]):
        before = list(state)
        result = compress(block, state)
        state = result["new_state"]
        block_details.append({
            "block_index": i,
            "block_hex": block.hex(),
            "steps": result["steps"],
            "state_before": [f"{v:08x}" for v in before],
            "state_after": [f"{v:08x}" for v in state],
        })

    # MD5 outputs each 32-bit register in LITTLE-endian byte order.
    digest = "".join(v.to_bytes(4, "little").hex() for v in state)
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

    steps = [
        step(1, "Encode message",
             "The message is UTF-8 encoded as bytes.",
             message, data.hex(),
             {"bytes": data.hex(), "length_bits": prep["original_bits"]}),
        step(2, "Preprocessing (padding)",
             "Append a 0x80 byte, pad with zeros until the length is 56 "
             "bytes short of a multiple of 64, then append the 64-bit "
             "original length in LITTLE-endian order.",
             data.hex(),
             f"{prep['block_count']} block(s), padded length {prep['padded_length']}",
             {"original_bits": prep["original_bits"]}),
        step(3, "Initialize working state",
             "The four 32-bit registers A, B, C, D are loaded with the "
             "standard initial values.",
             "", " ".join(f"{v:08x}" for v in [0x67452301, 0xEFCDAB89,
                                               0x98BADCFE, 0x10325476]),
             {"h_init": [f"{v:08x}" for v in [0x67452301, 0xEFCDAB89,
                                               0x98BADCFE, 0x10325476]]}),
        step(4, "Process each block (4 rounds × 16 steps)",
             "Each block runs four rounds of 16 steps, each applying a "
             "nonlinear function (F/G/H/I), one K constant and a shift.",
             f"{prep['block_count']} blocks", "compressed state",
             {"blocks": result["blocks"]}),
        step(5, "Produce the digest",
             "The final registers are concatenated (little-endian words) into "
             "the 128-bit hash.",
             " ".join(result["state"]),
             result["digest"], {"digest": result["digest"]}),
    ]

    return build_result(
        "md5", "hash", message, {}, result["digest"], steps,
        {
            "digest": result["digest"],
            "blocks": result["blocks"],
            "preprocess": {**prep, "blocks": [b.hex() for b in prep["blocks"]]},
            "state": result["state"],
            "h_init": ["67452301", "efcdab89", "98badcfe", "10325476"],
            "digest_bits": 128,
            "one_way_note": (
                "MD5 is one-way: given only the digest, the original message "
                "cannot be recovered. There is no decryption operation."
            ),
            "security_note": (
                "MD5 is broken: collisions are trivially forgeable and it "
                "must not be used for security purposes."
            ),
        })


def get_metadata() -> dict:
    return METADATA


def hash(message: str) -> dict:
    """Dispatch-compatible alias for the registry (operation 'hash')."""
    return hash_text(message)
