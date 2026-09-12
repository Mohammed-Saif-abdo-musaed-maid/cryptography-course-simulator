"""Educational DES simulator.

A complete, faithful implementation of the Data Encryption Standard
(64-bit block, 56-bit effective key, 16 Feistel rounds, IP/FP, E-expansion,
S-boxes, P-permutation). Produces genuine round-by-round states.

DES is DEPRECATED / INSECURE for modern use. It is provided purely for
education and historical analysis.

Known test vectors are provided in tests/.
"""

from __future__ import annotations

from typing import List

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "des",
    "name": "DES",
    "category": "symmetric",
    "security_status": "deprecated",
    "reversible": True,
    "key_kind": "8 bytes (56-bit effective key)",
    "block_size": "64 bits",
    "description": (
        "The Data Encryption Standard, a 64-bit block Feistel cipher using "
        "a 56-bit key over 16 rounds. Widely used from 1977 until it was "
        "formally withdrawn due to its small key size. Educational and "
        "historical only — NOT secure for modern data."
    ),
}

# ---------------------------------------------------------------------------
# Permutation tables (1-indexed bit positions).
# ---------------------------------------------------------------------------

IP = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7,
]

FP = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25,
]

E = [
    32, 1, 2, 3, 4, 5,
    4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13,
    12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21,
    20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29,
    28, 29, 30, 31, 32, 1,
]

P = [
    16, 7, 20, 21, 29, 12, 28, 17,
    1, 15, 23, 26, 5, 18, 31, 10,
    2, 8, 24, 14, 32, 27, 3, 9,
    19, 13, 30, 6, 22, 11, 4, 25,
]

PC1 = [
    57, 49, 41, 33, 25, 17, 9,
    1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27,
    19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15,
    7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4,
]

PC2 = [
    14, 17, 11, 24, 1, 5,
    3, 28, 15, 6, 21, 10,
    23, 19, 12, 4, 26, 8,
    16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55,
    30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53,
    46, 42, 50, 36, 29, 32,
]

SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1]

SBOXES = [
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
    ],
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
    ],
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
    ],
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
    ],
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
    ],
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
    ],
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
    ],
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
    ],
]

# ---------------------------------------------------------------------------
# Bit helpers.
# ---------------------------------------------------------------------------


def _hex_to_bits(hex_str: str, label: str) -> List[int]:
    try:
        raw = int(hex_str, 16)
    except ValueError as exc:
        raise ValidationError(f"{label} must be valid hexadecimal", "invalid_hex") from exc
    if raw < 0 or len(hex_str) % 2 != 0:
        raise ValidationError(f"{label} length must be an even number of hex digits", "invalid_hex")
    byte_len = len(hex_str) // 2
    bits = [(raw >> i) & 1 for i in range(byte_len * 8 - 1, -1, -1)]
    return bits


def _bits_to_hex(bits: List[int]) -> str:
    width_bits = len(bits)
    value = 0
    for b in bits:
        value = (value << 1) | b
    hex_digits = (width_bits + 3) // 4
    return format(value, "0{}x".format(hex_digits))


def _int_to_bits(value: int, width: int) -> List[int]:
    return [(value >> i) & 1 for i in range(width - 1, -1, -1)]


def _apply_perm(bits: List[int], table) -> List[int]:
    return [bits[i - 1] for i in table]


def _left_rotate(bits: List[int], n: int) -> List[int]:
    return bits[n:] + bits[:n]


def _xor(a: List[int], b: List[int]) -> List[int]:
    return [x ^ y for x, y in zip(a, b)]


# ---------------------------------------------------------------------------
# Key schedule.
# ---------------------------------------------------------------------------


def _key_bits(hex_key: str) -> List[int]:
    bits = _hex_to_bits(hex_key, "Key")
    if len(bits) != 64:
        raise ValidationError("DES key must be exactly 8 bytes (16 hex digits)",
                              "invalid_key")
    return bits


def key_schedule(hex_key: str) -> List[List[int]]:
    """Return the sixteen 48-bit round keys (as bit lists)."""
    key_bits = _key_bits(hex_key)
    permuted = _apply_perm(key_bits, PC1)
    c = permuted[:28]
    d = permuted[28:]
    round_keys = []
    for shift in SHIFTS:
        c = _left_rotate(c, shift)
        d = _left_rotate(d, shift)
        combined = c + d
        round_keys.append(_apply_perm(combined, PC2))
    return round_keys


# ---------------------------------------------------------------------------
# Round function f(R, K).
# ---------------------------------------------------------------------------


def _f(right: List[int], round_key: List[int]) -> tuple:
    expanded = _apply_perm(right, E)
    xored = _xor(expanded, round_key)
    sbox_out = []
    sbox_details = []
    for i in range(8):
        chunk = xored[i * 6:(i + 1) * 6]
        row = (chunk[0] << 1) | chunk[5]
        col = (chunk[1] << 3) | (chunk[2] << 2) | (chunk[3] << 1) | chunk[4]
        value = SBOXES[i][row][col]
        bits = _int_to_bits(value, 4)
        sbox_out.extend(bits)
        sbox_details.append({
            "sbox": i + 1,
            "six_bits": "".join(str(b) for b in chunk),
            "row": row,
            "col": col,
            "value": value,
            "four_bits": "".join(str(b) for b in bits),
        })
    permuted = _apply_perm(sbox_out, P)
    return permuted, expanded, xored, sbox_details


# ---------------------------------------------------------------------------
# Full cipher.
# ---------------------------------------------------------------------------


def _des_core(block_bits: List[int], round_keys: List[List[int]]) -> tuple:
    """Run the Feistel network; return (output_block_bits, round_states)."""
    permuted = _apply_perm(block_bits, IP)
    left = permuted[:32]
    right = permuted[32:]
    round_states = [{"round": 0, "L": _bits_to_hex(left),
                     "R": _bits_to_hex(right)}]
    f_details = []
    for r in range(16):
        right_new, expanded, xored, sbox_detail = _f(right, round_keys[r])
        left_new = _xor(left, right_new)
        f_details.append({
            "round": r + 1,
            "key": _bits_to_hex(round_keys[r]),
            "expanded": _bits_to_hex(expanded),
            "xor": _bits_to_hex(xored),
            "sboxes": sbox_detail,
        })
        left, right = right, left_new
        round_states.append({
            "round": r + 1,
            "L": _bits_to_hex(left),
            "R": _bits_to_hex(right),
        })
    preoutput = right + left
    output = _apply_perm(preoutput, FP)
    return output, round_states, f_details


def _validate_block(hex_block: str, label: str) -> List[int]:
    bits = _hex_to_bits(hex_block, label)
    if len(bits) != 64:
        raise ValidationError(f"{label} must be exactly 64 bits (16 hex digits)",
                              "invalid_block")
    return bits


def _hex_pairs(hex_str: str) -> str:
    s = hex_str.lower()
    return " ".join(s[i:i + 2] for i in range(0, len(s), 2))


def run(hex_block: str, hex_key: str, decrypt_mode: bool = False) -> dict:
    """Full simulation returning complete intermediate state."""
    block_bits = _validate_block(hex_block, "Block")
    round_keys = key_schedule(hex_key)

    if decrypt_mode:
        keys = list(reversed(round_keys))
    else:
        keys = round_keys

    output, round_states, f_details = _des_core(block_bits, keys)
    result_hex = _hex_pairs(_bits_to_hex(output))
    steps = [
        step(1, "Key schedule (PC-1 → split → rotate → PC-2)",
             "The 64-bit key (8 parity bits removed by PC-1) yields two 28-bit "
             "halves C and D, rotated 1 or 2 positions per round to derive "
             "sixteen 48-bit round keys.",
             hex_key, ", ".join(_bits_to_hex(k) for k in round_keys),
             {"round_keys": [_bits_to_hex(k) for k in round_keys],
              "shifts": SHIFTS}),
        step(2, "Initial permutation (IP)",
             "The 64-bit block is permuted and split into L₀ (left 32 bits) "
             "and R₀ (right 32 bits) — the start of the Feistel network.",
             "16 hex chars block", str(round_states[0]),
             {"L0": round_states[0]["L"], "R0": round_states[0]["R"]}),
        step(3, "Sixteen Feistel rounds",
             "Each round: E-expand R → XOR round key → 8 S-boxes → P → "
             "XOR with L. The old R becomes the new L.",
             f"L₀,R₀ = {round_states[0]['L']},{round_states[0]['R']}",
             f"L₁₆,R₁₆ = {round_states[-1]['L']},{round_states[-1]['R']}",
             {"rounds": round_states, "f_details": f_details}),
        step(4, "Final permutation (FP = IP⁻¹)",
             "After round 16 the halves are swapped (R₁₆L₁₆) and the final "
             "permutation yields the 64-bit ciphertext block.",
             f"{round_states[-1]['L']}{round_states[-1]['R']}",
             result_hex, {"cipher_bits": _bits_to_hex(output)}),
    ]
    return build_result(
        "des",
        "decrypt" if decrypt_mode else "encrypt",
        hex_block,
        {"key": hex_key, "rounds": 16, "mode": "ECB block (educational)"},
        result_hex,
        steps,
        {
            "result": result_hex,
            "round_states": round_states,
            "round_keys": [_bits_to_hex(k) for k in round_keys],
            "f_details": f_details,
            "key_schedule": {"pc1": len(PC1), "pc2": len(PC2),
                             "shifts": SHIFTS},
            "deprecated_warning": True,
        },
    )


def encrypt(hex_block: str, hex_key: str) -> dict:
    return run(hex_block, hex_key, decrypt_mode=False)


def decrypt(hex_block: str, hex_key: str) -> dict:
    return run(hex_block, hex_key, decrypt_mode=True)


def get_metadata() -> dict:
    return METADATA
