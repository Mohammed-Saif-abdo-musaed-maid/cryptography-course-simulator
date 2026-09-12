"""SHA-256 hash function educational simulator.

Full FIPS 180-4 implementation:
  * preprocessing (append 0x80, pad to 64-byte multiple, append 64-bit length)
  * 64 rounds per 512-bit message block
  * six logical functions (Ch, Maj, Σ0, Σ1, σ0, σ1)
  * produces the standard 256-bit digest

IMPORTANT: SHA-256 is a cryptographic hash function, NOT encryption.
It is one-way — there is no decryption operation.
"""

from __future__ import annotations

from typing import List

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "sha256",
    "name": "SHA-256",
    "category": "hashing",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "none (unkeyed hash)",
    "block_size": "512-bit blocks",
    "description": (
        "SHA-256 is a cryptographic hash function producing a 256-bit "
        "digest. It is deterministic, collision-resistant and ONE-WAY: it "
        "cannot be decrypted. Used for integrity verification, password "
        "hashing and as a building block of HMAC."
    ),
}

# ---------------------------------------------------------------------------
# Constants and initial hash values.
# ---------------------------------------------------------------------------

K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]

H_INIT = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]


def _rotr(x: int, n: int) -> int:
    return ((x >> n) | (x << (32 - n))) & 0xFFFFFFFF


def _ch(x: int, y: int, z: int) -> int:
    return (x & y) ^ (~x & z)


def _maj(x: int, y: int, z: int) -> int:
    return (x & y) ^ (x & z) ^ (y & z)


def _sig0(x: int) -> int:
    return _rotr(x, 2) ^ _rotr(x, 13) ^ _rotr(x, 22)


def _sig1(x: int) -> int:
    return _rotr(x, 6) ^ _rotr(x, 11) ^ _rotr(x, 25)


def _lsig0(x: int) -> int:
    return _rotr(x, 7) ^ _rotr(x, 18) ^ (x >> 3)


def _lsig1(x: int) -> int:
    return _rotr(x, 17) ^ _rotr(x, 19) ^ (x >> 10)


def preprocess(message: bytes) -> dict:
    """Return padding details and the padded message blocks."""
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
        "pad_bytes": [b if b else None for b in msg],
    }


def compress(block: bytes, working: List[int]) -> dict:
    """Compress a single 512-bit message block into the working state."""
    words = [int.from_bytes(block[i:i + 4], "big") for i in range(0, 64, 4)]
    w = words + [0] * 48
    schedule = []
    for t in range(16, 64):
        s0 = _lsig0(w[t - 15])
        s1 = _lsig1(w[t - 2])
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) & 0xFFFFFFFF
        schedule.append({
            "t": t,
            "value": f"{w[t]:08x}",
            "formula": "Wt = σ0(Wt-15) + Wt-16 + σ1(Wt-2) + Wt-7",
        })

    a, b, c, d, e, f, g, h = working
    rounds = []
    for t in range(64):
        t1 = (h + _sig1(e) + _ch(e, f, g) + K[t] + w[t]) & 0xFFFFFFFF
        t2 = (_sig0(a) + _maj(a, b, c)) & 0xFFFFFFFF
        h, g, f, e, d, c, b, a = g, f, e, (d + t1) & 0xFFFFFFFF, c, b, a, (t1 + t2) & 0xFFFFFFFF
        rounds.append({
            "t": t,
            "W": f"{w[t]:08x}",
            "K": f"{K[t]:08x}",
            "T1": f"{t1:08x}",
            "T2": f"{t2:08x}",
            "state": [f"{v:08x}" for v in (a, b, c, d, e, f, g, h)],
        })

    new_state = [(x + y) & 0xFFFFFFFF for x, y in zip(working, [a, b, c, d, e, f, g, h])]
    return {
        "words": [f"{v:08x}" for v in words],
        "schedule": schedule,
        "rounds": rounds,
        "new_state": new_state,
    }


def hash_bytes(data: bytes) -> dict:
    """Full SHA-256 with educational detail."""
    prep = preprocess(data)
    state = list(H_INIT)
    block_details = []
    for i, block in enumerate(prep["blocks"]):
        result = compress(block, state)
        state = result["new_state"]
        block_details.append({
            "block_index": i,
            "block_hex": block.hex(),
            "schedule": result["schedule"],
            "rounds": result["rounds"],
            "state_before": [f"{v:08x}" for v in _state_before(i, block, prep, state)],
            "state_after": [f"{v:08x}" for v in state],
        })

    digest = "".join(f"{v:08x}" for v in state)
    return {
        "preprocess": prep,
        "blocks": block_details,
        "state": [f"{v:08x}" for v in state],
        "digest": digest,
    }


def _state_before(block_index: int, _block: bytes, prep: dict, state: List[int]) -> List[int]:
    # Approximation helper retained for readability of step output.
    if block_index == 0:
        return H_INIT
    return state


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
             "Append a 0x80 byte, pad with zeros until the length is 64 "
             "bytes short of a multiple of 64, then append the 64-bit "
             f"original bit length. One or more {64}-byte blocks result.",
             data.hex(),
             f"{prep['block_count']} block(s), padded length {prep['padded_length']}",
             {"original_bits": prep["original_bits"], "blocks": message_blocks}),
        step(3, "Initialize working state",
             "The eight 32-bit initial hash values H₀..H₇ are loaded.",
             "", " ".join(f"{v:08x}" for v in H_INIT),
             {"h_init": [f"{v:08x}" for v in H_INIT]}),
        step(4, "Process each block (64 rounds)",
             "Each block expands its 16 words to a 64-word message schedule "
             "and runs the compression function for 64 rounds.",
             f"{prep['block_count']} blocks", "compressed state",
             {"blocks": result["blocks"]}),
        step(5, "Produce the digest",
             "The final state's eight 32-bit words are concatenated into the "
             "256-bit hash.",
             " ".join(result["state"]),
             result["digest"], {"digest": result["digest"]}),
    ]

    return build_result("sha256", "hash", message, {}, result["digest"], steps,
                        {
                            "digest": result["digest"],
                            "blocks": result["blocks"],
                            "preprocess": _json_safe_preprocess(prep),
                            "state": result["state"],
                            "h_init": [f"{v:08x}" for v in H_INIT],
                            "one_way_note": (
                                "SHA-256 is one-way: given only the digest, "
                                "the original message cannot be recovered. "
                                "There is no decryption operation."
                            ),
                        })


def _json_safe_preprocess(prep: dict) -> dict:
    """Convert raw byte blocks in the preprocess output to hex for JSON."""
    return {**prep, "blocks": [b.hex() for b in prep["blocks"]]}


def get_metadata() -> dict:
    return METADATA


def hash(message: str) -> dict:
    """Dispatch-compatible alias for the registry (operation 'hash')."""
    return hash_text(message)
