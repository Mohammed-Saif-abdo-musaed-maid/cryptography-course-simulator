"""BLAKE2 hash function educational simulator (RFC 7693).

Two variants share one module, selected by the 'variant' field:

    variant "512"  ->  BLAKE2b-512  (64-bit words, 12 rounds, 128-byte blocks)
    variant "256"  ->  BLAKE2s-256  (32-bit words, 10 rounds,  64-byte blocks)

BLAKE2 keeps the HAIFA counter and finalization flags of BLAKE over a
Simplified-Luby-Rackoff compression with two message halves permuted by a
fixed 12-column sigma table.

IMPORTANT: BLAKE2 is a cryptographic hash function, NOT encryption.
It is one-way — there is no decryption operation.
"""

from __future__ import annotations

from typing import List

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "blake2",
    "name": "BLAKE2",
    "category": "hashing",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "none (unkeyed hash)",
    "block_size": "128-byte blocks (BLAKE2b) / 64-byte (BLAKE2s)",
    "description": (
        "BLAKE2 (RFC 7693) is a fast, secure hash family. BLAKE2b-512 uses "
        "64-bit words, 12 compression rounds and 128-byte blocks; BLAKE2s-256 "
        "uses 32-bit words, 10 rounds and 64-byte blocks. Both feed a "
        "chained counter and finalization flags into the compression. "
        "ONE-WAY — it cannot be decrypted."
    ),
}

MAX = (1 << 64) - 1

#                                                                            word
#   IV for BLAKE2b is the SHA-512 IV; for BLAKE2s the SHA-256 IV.
IV_B2B = [
    0x6a09e667f3bcc908, 0xbb67ae8584caa73b, 0x3c6ef372fe94f82b,
    0xa54ff53a5f1d36f1, 0x510e527fade682d1, 0x9b05688c2b3e6c1f,
    0x1f83d9abfb41bd6b, 0x5be0cd19137e2179,
]
IV_B2S = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]

# BLAKE2s = rows 0..9, BLAKE2b = rows 0..11 (rows 10,11 repeat rows 0,1).
SIGMA = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
    [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
    [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
    [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
    [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9],
    [12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11],
    [13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10],
    [6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5],
    [10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
]

# (G rotation pairs per variant) -> (r1, r2, r3, r4)
ROTS = {"512": (32, 24, 16, 63), "256": (16, 12, 8, 7)}

VARIANT_CONFIG = {
    "512": {
        "block_bytes": 128,
        "rounds": 12,
        "digest_bytes": 64,
        "mask": MAX,
        "iv": IV_B2B,
        "param_xor": 0x01010040,
        "digest_name": "blake2b-512",
    },
    "256": {
        "block_bytes": 64,
        "rounds": 10,
        "digest_bytes": 32,
        "mask": 0xFFFFFFFF,
        "iv": IV_B2S,
        "param_xor": 0x01010020,
        "digest_name": "blake2s-256",
    },
}
DEFAULT_VARIANT = "512"


def _rotr(x: int, n: int, mask: int, bits: int) -> int:
    return ((x >> n) | (x << (bits - n))) & mask


def _g(v: List[int], a: int, b: int, c: int, d: int,
       x: int, y: int, r: tuple, mask: int, bits: int) -> None:
    v[a] = (v[a] + v[b] + x) & mask
    v[d] = _rotr(v[d] ^ v[a], r[0], mask, bits)
    v[c] = (v[c] + v[d]) & mask
    v[b] = _rotr(v[b] ^ v[c], r[1], mask, bits)
    v[a] = (v[a] + v[b] + y) & mask
    v[d] = _rotr(v[d] ^ v[a], r[2], mask, bits)
    v[c] = (v[c] + v[d]) & mask
    v[b] = _rotr(v[b] ^ v[c], r[3], mask, bits)


def compress(block: bytes, h: List[int], counter: bytes, final: bool,
             cfg: dict) -> List[int]:
    """Compress one block. Returns the new hash state (8 words)."""
    bits = 64 if cfg["bits"] == 64 else 32
    mask = cfg["mask"]
    block_size = cfg["block_bytes"]
    words = [int.from_bytes(block[i:i + (bits // 8)], "little")
             for i in range(0, block_size, bits // 8)]

    v = list(h) + list(cfg["iv"])
    t = int.from_bytes(counter, "little")
    v[12] ^= t & mask
    v[13] ^= (t >> bits) if bits == 64 else (t >> 32)
    if final:
        v[14] ^= mask

    rounds = cfg["rounds"]
    r = ROTS[cfg["rid"]]
    for round_i in range(rounds):
        s = SIGMA[round_i % 10] if cfg["rid"] == "256" else SIGMA[round_i % 12]
        _g(v, 0, 4, 8, 12, words[s[0]], words[s[1]], r, mask, bits)
        _g(v, 1, 5, 9, 13, words[s[2]], words[s[3]], r, mask, bits)
        _g(v, 2, 6, 10, 14, words[s[4]], words[s[5]], r, mask, bits)
        _g(v, 3, 7, 11, 15, words[s[6]], words[s[7]], r, mask, bits)
        _g(v, 0, 5, 10, 15, words[s[8]], words[s[9]], r, mask, bits)
        _g(v, 1, 6, 11, 12, words[s[10]], words[s[11]], r, mask, bits)
        _g(v, 2, 7, 8, 13, words[s[12]], words[s[13]], r, mask, bits)
        _g(v, 3, 4, 9, 14, words[s[14]], words[s[15]], r, mask, bits)

    return [(h[i] ^ v[i] ^ v[i + 8]) & mask for i in range(8)]


def hash_bytes(data: bytes, variant: str = DEFAULT_VARIANT) -> dict:
    cfg = VARIANT_CONFIG[variant]
    cfg["bits"] = 64 if variant == "512" else 32
    cfg["rid"] = variant

    h = list(cfg["iv"])
    h[0] ^= cfg["param_xor"]

    blocks = [data[i:i + cfg["block_bytes"]]
              for i in range(0, len(data), cfg["block_bytes"])]
    if not blocks:
        blocks = [b""]

    t = 0
    block_details = []
    for i, block in enumerate(blocks):
        final = (i == len(blocks) - 1)
        t += len(block)
        t_bytes = t.to_bytes(16, "little")
        before = list(h)
        h = compress(block, h, t_bytes, final, cfg)
        block_details.append({
            "block_index": i,
            "block_hex": block.hex(),
            "counter": t,
            "final": final,
            "state_before": [f"{x:016x}" if variant == "512" else f"{x:08x}"
                             for x in before],
            "state_after": [f"{x:016x}" if variant == "512" else f"{x:08x}"
                            for x in h],
        })

    digest = "".join(
        (x.to_bytes(64 // 8 if variant == "512" else 4, "little").hex()
         for x in h))
    return {
        "variant": variant,
        "digest_name": cfg["digest_name"],
        "blocks": block_details,
        "state": [f"{x:016x}" if variant == "512" else f"{x:08x}" for x in h],
        "digest": digest,
    }


def hash_text(message: str, variant: str = DEFAULT_VARIANT) -> dict:
    if message is None or not isinstance(message, str):
        raise ValidationError("Message must not be empty", "empty_input")
    if str(variant) not in VARIANT_CONFIG:
        raise ValidationError(
            "BLAKE2 variant must be '256' (BLAKE2s) or '512' (BLAKE2b)",
            "invalid_variant")
    variant = str(variant)
    data = message.encode("utf-8")
    result = hash_bytes(data, variant)
    cfg = VARIANT_CONFIG[variant]
    bits = 64 if variant == "512" else 32
    fmt = "016x" if variant == "512" else "08x"

    steps = [
        step(1, "Encode message",
             "The message is UTF-8 encoded as bytes.",
             message, data.hex(),
             {"bytes": data.hex(), "length_bits": len(data) * 8}),
        step(2, "Initialize internal state (parameter block)",
             f"h[0] is XORed with the unkeyed parameter "
             f"0x{cfg['param_xor']:08x} (digest length 0x"
             f"{cfg['digest_bytes']:02x}, fanout 1, depth 1); the rest of "
             f"the 8-word hash state comes from the IV.",
             "", " ".join(f"{x:{fmt}}" for x in h_init_txt(variant, cfg)),
             {"param_xor": f"0x{cfg['param_xor']:08x}",
              "h_init": [f"{x:{fmt}}" for x in h_init_txt(variant, cfg)]}),
        step(3, "Process each block (HAIFA counter + flags)",
             f"Each {cfg['block_bytes']}-byte block is compressed with "
             f"{cfg['rounds']} rounds. The running byte counter t and the "
             f"finalization flag ff enter the working buffer v[12]/v[13] "
             f"/v[14].",
             f"{len(result['blocks'])} block(s)", "compressed state",
             {"blocks": result["blocks"]}),
        step(4, "Finalization",
             "The last block is compressed with the final flag set, then the "
             "words of the last state are XORed with their counterparts to "
             "produce the hash state.",
             "", "final state",
             {"state": result["state"]}),
        step(5, "Produce the digest",
             f"The {cfg['digest_bytes']}-byte digest is the little-endian "
             f"serialization of the final hash state.",
             " ".join(result["state"]),
             result["digest"], {"digest": result["digest"]}),
    ]

    return build_result(
        "blake2", "hash", message, {"variant": variant}, result["digest"],
        steps,
        {
            "digest": result["digest"],
            "variant": variant,
            "blocks": result["blocks"],
            "state": result["state"],
            "digest_bits": cfg["digest_bytes"] * 8,
            "digest_name": cfg["digest_name"],
            "param_xor": f"0x{cfg['param_xor']:08x}",
            "one_way_note": (
                "BLAKE2 is one-way: given only the digest, the original "
                "message cannot be recovered. There is no decryption "
                "operation."
            ),
        })


def h_init_txt(variant: str, cfg: dict) -> List[int]:
    h = list(cfg["iv"])
    h[0] ^= cfg["param_xor"]
    return h


def get_metadata() -> dict:
    return METADATA


def hash(message: str, variant: str = DEFAULT_VARIANT) -> dict:
    """Dispatch-compatible alias for the registry (operation 'hash')."""
    return hash_text(message, variant)
