"""SHA-512 hash function educational simulator.

Full FIPS 180-4 implementation:
  * preprocessing (append 0x80, pad to 128-byte multiple, append 128-bit length)
  * 80 rounds per 1024-bit message block
  * 64-bit words; the same Merkle-Damgard structure as SHA-256
  * six logical functions (Ch, Maj, Sigma0, Sigma1, sigma0, sigma1)
  * produces the standard 512-bit digest

IMPORTANT: SHA-512 is a cryptographic hash function, NOT encryption.
It is one-way — there is no decryption operation.
"""

from __future__ import annotations

from typing import List

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "sha512",
    "name": "SHA-512",
    "category": "hashing",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "none (unkeyed hash)",
    "block_size": "1024-bit blocks",
    "description": (
        "SHA-512 is a SHA-2 hash producing a 512-bit digest. It chunks the "
        "message into 1024-bit blocks and runs 80 rounds of a compression "
        "function over 64-bit words. Deterministic, collision-resistant and "
        "ONE-WAY — it cannot be decrypted."
    ),
}

# ---------------------------------------------------------------------------
# Constants: fractional parts of the cube roots of the first 80 primes
# and of the square roots of the first 8 primes (FIPS 180-4).
# ---------------------------------------------------------------------------

K = [
    0x428a2f98d728ae22, 0x7137449123ef65cd,
    0xb5c0fbcfec4d3b2f, 0xe9b5dba58189dbbc,
    0x3956c25bf348b538, 0x59f111f1b605d019,
    0x923f82a4af194f9b, 0xab1c5ed5da6d8118,
    0xd807aa98a3030242, 0x12835b0145706fbe,
    0x243185be4ee4b28c, 0x550c7dc3d5ffb4e2,
    0x72be5d74f27b896f, 0x80deb1fe3b1696b1,
    0x9bdc06a725c71235, 0xc19bf174cf692694,
    0xe49b69c19ef14ad2, 0xefbe4786384f25e3,
    0x0fc19dc68b8cd5b5, 0x240ca1cc77ac9c65,
    0x2de92c6f592b0275, 0x4a7484aa6ea6e483,
    0x5cb0a9dcbd41fbd4, 0x76f988da831153b5,
    0x983e5152ee66dfab, 0xa831c66d2db43210,
    0xb00327c898fb213f, 0xbf597fc7beef0ee4,
    0xc6e00bf33da88fc2, 0xd5a79147930aa725,
    0x06ca6351e003826f, 0x142929670a0e6e70,
    0x27b70a8546d22ffc, 0x2e1b21385c26c926,
    0x4d2c6dfc5ac42aed, 0x53380d139d95b3df,
    0x650a73548baf63de, 0x766a0abb3c77b2a8,
    0x81c2c92e47edaee6, 0x92722c851482353b,
    0xa2bfe8a14cf10364, 0xa81a664bbc423001,
    0xc24b8b70d0f89791, 0xc76c51a30654be30,
    0xd192e819d6ef5218, 0xd69906245565a910,
    0xf40e35855771202a, 0x106aa07032bbd1b8,
    0x19a4c116b8d2d0c8, 0x1e376c085141ab53,
    0x2748774cdf8eeb99, 0x34b0bcb5e19b48a8,
    0x391c0cb3c5c95a63, 0x4ed8aa4ae3418acb,
    0x5b9cca4f7763e373, 0x682e6ff3d6b2b8a3,
    0x748f82ee5defb2fc, 0x78a5636f43172f60,
    0x84c87814a1f0ab72, 0x8cc702081a6439ec,
    0x90befffa23631e28, 0xa4506cebde82bde9,
    0xbef9a3f7b2c67915, 0xc67178f2e372532b,
    0xca273eceea26619c, 0xd186b8c721c0c207,
    0xeada7dd6cde0eb1e, 0xf57d4f7fee6ed178,
    0x06f067aa72176fba, 0x0a637dc5a2c898a6,
    0x113f9804bef90dae, 0x1b710b35131c471b,
    0x28db77f523047d84, 0x32caab7b40c72493,
    0x3c9ebe0a15c9bebc, 0x431d67c49c100d4c,
    0x4cc5d4becb3e42b6, 0x597f299cfc657e2a,
    0x5fcb6fab3ad6faec, 0x6c44198c4a475817,
]

H_INIT = [
    0x6a09e667f3bcc908, 0xbb67ae8584caa73b,
    0x3c6ef372fe94f82b, 0xa54ff53a5f1d36f1,
    0x510e527fade682d1, 0x9b05688c2b3e6c1f,
    0x1f83d9abfb41bd6b, 0x5be0cd19137e2179,
]

MASK = 0xFFFFFFFFFFFFFFFF


def _rotr(x: int, n: int) -> int:
    return ((x >> n) | (x << (64 - n))) & MASK


def _ch(x: int, y: int, z: int) -> int:
    return (x & y) ^ (~x & z)


def _maj(x: int, y: int, z: int) -> int:
    return (x & y) ^ (x & z) ^ (y & z)


def _sig0(x: int) -> int:
    return _rotr(x, 28) ^ _rotr(x, 34) ^ _rotr(x, 39)


def _sig1(x: int) -> int:
    return _rotr(x, 14) ^ _rotr(x, 18) ^ _rotr(x, 41)


def _lsig0(x: int) -> int:
    return _rotr(x, 1) ^ _rotr(x, 8) ^ (x >> 7)


def _lsig1(x: int) -> int:
    return _rotr(x, 19) ^ _rotr(x, 61) ^ (x >> 6)


def preprocess(message: bytes) -> dict:
    """Return padding details and the padded message blocks (128 bytes each)."""
    original_len_bits = len(message) * 8
    msg = bytearray(message)
    msg.append(0x80)
    while len(msg) % 128 != 112:
        msg.append(0x00)
    msg.extend(original_len_bits.to_bytes(16, "big"))
    blocks = [bytes(msg[i:i + 128]) for i in range(0, len(msg), 128)]
    return {
        "original_bytes": len(message),
        "original_bits": original_len_bits,
        "padded_length": len(msg),
        "block_count": len(blocks),
        "blocks": blocks,
        "pad_bytes": [b if b else None for b in msg],
    }


def compress(block: bytes, working: List[int]) -> dict:
    """Compress a single 1024-bit block into the working state."""
    words = [int.from_bytes(block[i:i + 8], "big") for i in range(0, 128, 8)]
    w = words + [0] * 64
    schedule = []
    for t in range(16, 80):
        s0 = _lsig0(w[t - 15])
        s1 = _lsig1(w[t - 2])
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) & MASK
        schedule.append({
            "t": t,
            "value": f"{w[t]:016x}",
            "formula": "Wt = σ0(Wt-15) + Wt-16 + σ1(Wt-2) + Wt-7",
        })

    a, b, c, d, e, f, g, h = working
    rounds = []
    for t in range(80):
        t1 = (h + _sig1(e) + _ch(e, f, g) + K[t] + w[t]) & MASK
        t2 = (_sig0(a) + _maj(a, b, c)) & MASK
        h, g, f, e, d, c, b, a = g, f, e, (d + t1) & MASK, c, b, a, (t1 + t2) & MASK
        rounds.append({
            "t": t,
            "W": f"{w[t]:016x}",
            "K": f"{K[t]:016x}",
            "T1": f"{t1:016x}",
            "T2": f"{t2:016x}",
            "state": [f"{v:016x}" for v in (a, b, c, d, e, f, g, h)],
        })

    new_state = [(x + y) & MASK for x, y in zip(working, [a, b, c, d, e, f, g, h])]
    return {
        "words": [f"{v:016x}" for v in words],
        "schedule": schedule,
        "rounds": rounds,
        "new_state": new_state,
    }


def hash_bytes(data: bytes) -> dict:
    """Full SHA-512 with educational detail."""
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
            "schedule": result["schedule"],
            "rounds": result["rounds"],
            "state_before": [f"{v:016x}" for v in before],
            "state_after": [f"{v:016x}" for v in state],
        })

    digest = "".join(f"{v:016x}" for v in state)
    return {
        "preprocess": prep,
        "blocks": block_details,
        "state": [f"{v:016x}" for v in state],
        "digest": digest,
    }


def hash_text(message: str) -> dict:
    if message is None or not isinstance(message, str):
        raise ValidationError("Message must be a non-empty string", "empty_input")
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
             "Append a 0x80 byte, pad with zeros until the length is 112 "
             "bytes short of a multiple of 128, then append the 128-bit "
             f"original bit length. One or more {128}-byte blocks result.",
             data.hex(),
             f"{prep['block_count']} block(s), padded length {prep['padded_length']}",
             {"original_bits": prep["original_bits"], "blocks": message_blocks}),
        step(3, "Initialize working state",
             "The eight 64-bit initial hash values H₀..H₇ are loaded.",
             "", " ".join(f"{v:016x}" for v in H_INIT),
             {"h_init": [f"{v:016x}" for v in H_INIT]}),
        step(4, "Process each block (80 rounds)",
             "Each block expands its 16 words to an 80-word message schedule "
             "and runs the compression function for 80 rounds over 64-bit words.",
             f"{prep['block_count']} blocks", "compressed state",
             {"blocks": result["blocks"]}),
        step(5, "Produce the digest",
             "The final state's eight 64-bit words are concatenated into the "
             "512-bit hash.",
             " ".join(result["state"]),
             result["digest"], {"digest": result["digest"]}),
    ]

    return build_result("sha512", "hash", message, {}, result["digest"], steps,
                        {
                            "digest": result["digest"],
                            "blocks": result["blocks"],
                            "preprocess": _json_safe_preprocess(prep),
                            "state": result["state"],
                            "h_init": [f"{v:016x}" for v in H_INIT],
                            "digest_bits": 512,
                            "one_way_note": (
                                "SHA-512 is one-way: given only the digest, "
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
