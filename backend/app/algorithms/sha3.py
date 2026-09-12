"""SHA-3 hash function educational simulator (FIPS 202).

Implements the Keccak-f[1600] permutation and the sponge construction with
the SHA-3 domain byte 0x06 and pad10*1:

    absorb  ->  squeeze

Variants (rate in bytes):
    SHA3-224  rate=144,  SHA3-256  rate=136,
    SHA3-384  rate=104,  SHA3-512  rate=72

IMPORTANT: SHA-3 is a cryptographic hash function, NOT encryption.
It is one-way — there is no decryption operation.
"""

from __future__ import annotations

from typing import List

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "sha3",
    "name": "SHA-3",
    "category": "hashing",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "none (unkeyed hash)",
    "block_size": "sponge — absorbs rate-sized blocks",
    "description": (
        "SHA-3 (FIPS 202) hashes messages through the Keccak sponge: blocks "
        "are XORed into a 1600-bit state, permuted 24 rounds, then squeezed "
        "into a digest. Variants 224/256/384/512 select the rate. ONE-WAY — "
        "it cannot be decrypted."
    ),
}

# ---------------------------------------------------------------------------
# Keccak-f[1600] constants.
# ---------------------------------------------------------------------------

ROT = [
    [0, 36, 3, 41, 18],
    [1, 44, 10, 45, 2],
    [62, 6, 43, 15, 61],
    [28, 55, 25, 21, 56],
    [27, 20, 39, 8, 14],
]

RC = [
    0x0000000000000001, 0x0000000000008082, 0x800000000000808A, 0x8000000080008000,
    0x000000000000808B, 0x0000000080000001, 0x8000000080008081, 0x8000000000008009,
    0x000000000000008A, 0x0000000000000088, 0x0000000080008009, 0x000000008000000A,
    0x000000008000808B, 0x800000000000008B, 0x8000000000008089, 0x8000000000008003,
    0x8000000000008002, 0x8000000000000080, 0x000000000000800A, 0x800000008000000A,
    0x8000000080008081, 0x8000000000008080, 0x0000000080000001, 0x8000000080008008,
]

VARIANT_RATES = {"224": 144, "256": 136, "384": 104, "512": 72}
DEFAULT_VARIANT = "256"


def _rotl(x: int, n: int) -> int:
    return ((x << n) | (x >> (64 - n))) & 0xFFFFFFFFFFFFFFFF


def keccak_f(state: List[int]) -> None:
    """Apply the 24-round Keccak-f[1600] permutation in place."""
    for rnd in range(24):
        # Theta: column parity diffusion.
        c = [state[x] ^ state[x + 5] ^ state[x + 10] ^ state[x + 15]
             ^ state[x + 20] for x in range(5)]
        d = [c[(x - 1) % 5] ^ _rotl(c[(x + 1) % 5], 1) for x in range(5)]
        for y in range(5):
            for x in range(5):
                state[x + 5 * y] ^= d[x]

        # Rho + Pi: rotate each lane, then permute lane positions.
        b = [0] * 25
        for y in range(5):
            for x in range(5):
                b[y + 5 * ((2 * x + 3 * y) % 5)] = _rotl(
                    state[x + 5 * y], ROT[x][y])

        # Chi: non-linear mixing inside each row.
        for y in range(5):
            for x in range(5):
                state[x + 5 * y] = (
                    b[x + 5 * y]
                    ^ ((~b[(x + 1) % 5 + 5 * y])
                       & b[(x + 2) % 5 + 5 * y])
                ) & 0xFFFFFFFFFFFFFFFF

        # Iota: XOR the round constant into lane (0,0).
        state[0] ^= RC[rnd]


def _pad_single(data: bytes, rate: int) -> bytes:
    """pad10*1 with the SHA-3 domain byte 0x06 (FIPS 202)."""
    pad_len = rate - (len(data) % rate)
    if pad_len == 1:
        return data + bytes([0x06 | 0x80])
    return data + bytes([0x06]) + bytes(pad_len - 2) + bytes([0x80])


def hash_bytes(data: bytes, variant: str = DEFAULT_VARIANT) -> dict:
    """Full Keccak sponge for a SHA-3 variant."""
    rate = VARIANT_RATES[variant]
    digest_bytes = int(variant) // 8
    padded = _pad_single(data, rate)

    absorb_bytes = []
    state = [0] * 25
    block_count = len(padded) // rate
    for i in range(block_count):
        block = padded[i * rate:(i + 1) * rate]
        lanes_before = list(state[:rate // 8])
        for j in range(rate // 8):
            lane = int.from_bytes(block[j * 8:(j + 1) * 8], "little")
            state[j] ^= lane
        phases = []
        if i < block_count - 1:
            keccak_f(state)
            phases = ["permute"]
        absorb_bytes.append({
            "block_index": i,
            "block_hex": block.hex(),
            "lanes_before": [f"{v:016x}" for v in lanes_before],
            "lanes_xor": [f"{v:016x}" for v in state[:rate // 8]],
            "permuted": "permute" in phases,
        })

    keccak_f(state)
    absorb_bytes[-1]["permuted"] = True

    state_bytes = b"".join(x.to_bytes(8, "little") for x in state)
    digest = state_bytes[:digest_bytes].hex()

    return {
        "variant": variant,
        "rate_bytes": rate,
        "digest_bytes": digest_bytes,
        "padded_hex": padded.hex(),
        "block_count": block_count,
        "absorb": absorb_bytes,
        "state": [f"{v:016x}" for v in state],
        "digest": digest,
    }


def hash_text(message: str, variant: str = DEFAULT_VARIANT) -> dict:
    if message is None or not isinstance(message, str):
        raise ValidationError("Message must not be empty", "empty_input")
    if str(variant) not in VARIANT_RATES:
        raise ValidationError(
            f"SHA-3 variant must be one of {sorted(VARIANT_RATES)}",
            "invalid_variant")
    data = message.encode("utf-8")
    result = hash_bytes(data, str(variant))
    rate = result["rate_bytes"]

    steps = [
        step(1, "Encode message",
             "The message is UTF-8 encoded as bytes.",
             message, data.hex(),
             {"bytes": data.hex(), "length_bits": len(data) * 8}),
        step(2, "Sponge padding (pad10*1 + domain 0x06)",
             f"The message is padded with the SHA-3 domain byte 0x06 and the "
             f"pad10*1 rule so its length is a multiple of {rate} bytes.",
             data.hex(), result["padded_hex"],
             {"rate_bytes": rate, "padded_bytes": len(result["padded_hex"]) // 2}),
        step(3, "Initialize the 1600-bit state",
             "All 25 lanes of the state are set to zero.",
             "", "0x00 × 25",
             {"state": [f"{v:016x}" for v in [0] * 25]}),
        step(4, f"Absorb {result['block_count']} rate block(s)",
             "Each rate-sized block is XORed into the rate lanes of the "
             "state and the Keccak-f[1600] permutation runs 24 rounds "
             "between blocks.",
             f"{result['block_count']} block(s)", "absorbed state",
             {"blocks": result["absorb"]}),
        step(5, "Final permutation",
             "One last Keccak-f[1600] permutation is applied before reading "
             "the digest.",
             "absorbed state", "permuted state",
             {"state": result["state"]}),
        step(6, "Squeeze the digest",
             f"The first {result['digest_bytes']} bytes of the state are read "
             f"as the SHA-3-{result['variant']} digest.",
             "state bytes", result["digest"], {"digest": result["digest"]}),
    ]

    return build_result(
        "sha3", "hash", message, {"variant": str(variant)}, result["digest"],
        steps,
        {
            "digest": result["digest"],
            "variant": str(variant),
            "absorb": result["absorb"],
            "state": result["state"],
            "rate_bytes": rate,
            "digest_bits": result["digest_bytes"] * 8,
            "one_way_note": (
                "SHA-3 is one-way: given only the digest, the original "
                "message cannot be recovered. There is no decryption "
                "operation."
            ),
        })


def get_metadata() -> dict:
    return METADATA


def hash(message: str, variant: str = DEFAULT_VARIANT) -> dict:
    """Dispatch-compatible alias for the registry (operation 'hash')."""
    return hash_text(message, variant)