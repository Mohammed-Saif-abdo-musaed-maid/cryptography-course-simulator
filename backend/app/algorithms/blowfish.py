"""Educational Blowfish block-cipher simulator.

A faithful implementation of Bruce Schneier's Blowfish:

  * 64-bit block, variable-length key (32–448 bits)
  * 16-round Feistel network
  * P-array (18 words) and four 256-entry key-dependent S-boxes,
    initialized from the hexadecimal digits of pi (Circle-constant)
  * key expansion XORs key words into the P-array, then re-encrypts
    the all-zero block to randomize P and S
  * F(x) = ((S0[a] + S1[b]) XOR S2[c]) + S3[d]

Blowfish is a LEGACY algorithm. Its 64-bit block size makes modern
encryption modes (CBC/GCM) unsafe; deprecated in favour of AES.
Provided for education and historical analysis.
"""

from __future__ import annotations

import decimal
from typing import List, Tuple

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "blowfish",
    "name": "Blowfish",
    "category": "symmetric",
    "security_status": "deprecated",
    "reversible": True,
    "key_kind": "variable 32–448 bits (4–56 bytes hex)",
    "block_size": "64 bits",
    "description": (
        "Block cipher designed by Bruce Schneier (1993). 64-bit block with "
        "a 16-round Feistel network and a variable-length key. Famous for "
        "its fast, key-dependent S-boxes, but the 64-bit block size is too "
        "small for modern modes — deprecated, use AES."
    ),
}

# ---------------------------------------------------------------------------
# P-array / S-box initialization from the hexadecimal digits of pi.
# ---------------------------------------------------------------------------


def _pi_hex_digits(count: int) -> str:
    """Return the first `count` hexadecimal digits of pi's fractional part.

    Computed with the Chudnovsky binary-splitting series using Python's
    built-in decimal module — exact and deterministic for this precision.
    """
    # 4 hex bits approx 1.204 decimal digits; add slack for rounding.
    decimal_digits = int(count * 4 * 0.30103) + 120
    ctx = decimal.Context(prec=decimal_digits, Emax=999999999)
    C = 640320
    C3_24 = C ** 3 // 24

    def bs(a: int, b: int) -> Tuple[int, int, int]:
        if b - a == 1:
            if a == 0:
                pab = qab = 1
            else:
                pab = (6 * a - 5) * (2 * a - 1) * (6 * a - 1)
                qab = a * a * a * C3_24
            tab = pab * (13591409 + 545140134 * a)
            if a & 1:
                tab = -tab
            return pab, qab, tab
        m = (a + b) // 2
        pam, qam, tam = bs(a, m)
        pmb, qmb, tmb = bs(m, b)
        return pam * pmb, qam * qmb, qmb * tam + pam * tmb

    terms = decimal_digits // 14 + 2
    with decimal.localcontext() as dctx:
        dctx.prec = decimal_digits
        _P, _Q, T = bs(0, terms)
        sqrt_10005 = decimal.Decimal(10005).sqrt()
        pi = (_Q * 426880 * sqrt_10005) / T
        fraction = pi - int(pi)
        scaled = int(fraction * 16 ** count)
    return format(scaled, "x").rjust(count, "0")


def _initial_words(count: int) -> List[int]:
    """First `count` 32-bit words of the pi constants (8 hex digits each)."""
    digits = _pi_hex_digits(count * 8)
    return [int(digits[i * 8:i * 8 + 8], 16) for i in range(count)]


def _pi_boxes() -> Tuple[List[int], List[List[int]]]:
    """The 18-word P-array and 4×256 S-boxes derived from pi."""
    words = _initial_words(18 + 4 * 256)
    p = words[:18]
    s = [words[18 + b * 256: 18 + (b + 1) * 256] for b in range(4)]
    return p, s


_INIT_P, _INIT_S = _pi_boxes()

_PHI = 0x9E3779B9  # not used by Blowfish; kept for parity with position docs


# ---------------------------------------------------------------------------
# Core cipher.
# ---------------------------------------------------------------------------


def _f(x: int, sbox: List[List[int]]) -> int:
    """The Blowfish F-function over the four S-boxes.

    F(x) = ((S0[a] + S1[b]) XOR S2[c]) + S3[d]  (mod 2^32)
    """
    a = (x >> 24) & 0xFF
    b = (x >> 16) & 0xFF
    c = (x >> 8) & 0xFF
    d = x & 0xFF
    return ((((sbox[0][a] + sbox[1][b]) & 0xFFFFFFFF) ^ sbox[2][c]) + sbox[3][d]) & 0xFFFFFFFF


def _encrypt_state(L: int, R: int, p: List[int], s: List[List[int]]) -> Tuple[int, int]:
    """Full encrypt of one 64-bit state with the current P/S tables."""
    L ^= p[0]
    for i in range(16):
        R ^= _f(L, s) ^ p[i + 1]
        L, R = R, L
    R ^= p[17]
    return R, L


def _decrypt_state(L: int, R: int, p: List[int], s: List[List[int]]) -> Tuple[int, int]:
    """Full decrypt of one 64-bit state (inverse of _encrypt_state)."""
    x = R
    y = L ^ p[17]
    for k in range(16, 0, -1):
        x, y = y, (x ^ _f(y, s) ^ p[k]) & 0xFFFFFFFF
    x ^= p[0]
    return x, y


def _parse_hex(value: str, label: str) -> bytes:
    try:
        return bytes.fromhex(value)
    except ValueError as exc:
        raise ValidationError(f"{label} must be valid hexadecimal", "invalid_hex") from exc


def _hex_pairs(hex_str: str) -> str:
    hex_str = hex_str.lower()
    return " ".join(hex_str[i:i + 2] for i in range(0, len(hex_str), 2))


def _validate(hex_key: str, hex_block: str) -> Tuple[bytes, bytes]:
    key = _parse_hex(hex_key, "Key")
    if not 4 <= len(key) <= 56:
        raise ValidationError(
            "Blowfish key length must be between 4 and 56 bytes "
            "(8–112 hex digits)", "invalid_key")
    block = _parse_hex(hex_block, "Block")
    if len(block) != 8:
        raise ValidationError(
            "Blowfish block must be exactly 64 bits (16 hex digits)",
            "invalid_block")
    return key, block


# ---------------------------------------------------------------------------
# Key schedule.
# ---------------------------------------------------------------------------


def key_schedule_boxes(keys_bytes: bytes) -> Tuple[List[int], List[List[int]]]:
    """Expand a key into the final P-array and S-boxes."""
    p = list(_INIT_P)
    s = [list(row) for row in _INIT_S]
    j = 0
    n = len(keys_bytes)
    for i in range(18):
        word = 0
        for _ in range(4):
            word = (word << 8) | keys_bytes[j]
            j = (j + 1) % n
        p[i] ^= word
    L = R = 0
    for i in range(0, 18, 2):
        L, R = _encrypt_state(L, R, p, s)
        p[i] = L
        p[i + 1] = R
    for box in s:
        for i in range(0, 256, 2):
            L, R = _encrypt_state(L, R, p, s)
            box[i] = L
            box[i + 1] = R
    return p, s


# ---------------------------------------------------------------------------
# Public API.
# ---------------------------------------------------------------------------


def _run(hex_key: str, hex_block: str, operation: str, boxes=None) -> dict:
    key, block = _validate(hex_key, hex_block)
    p, s = (key_schedule_boxes(key) if boxes is None else boxes)
    L = int.from_bytes(block[:4], "big")
    R = int.from_bytes(block[4:], "big")

    round_states = []
    if operation == "encrypt":
        x = L ^ p[0]
        y = R
        for i in range(16):
            y ^= _f(x, s) ^ p[i + 1]
            x, y = y, x
            round_states.append({
                "round": i + 1,
                "L": f"{x:08x}",
                "R": f"{y:08x}",
            })
        y ^= p[17]
        final_L, final_R = y, x
    else:
        x = R
        y = L ^ p[17]
        for k in range(16, 0, -1):
            x, y = y, (x ^ _f(y, s) ^ p[k]) & 0xFFFFFFFF
            round_states.append({
                "round": 17 - k,
                "L": f"{x:08x}",
                "R": f"{y:08x}",
            })
        x ^= p[0]
        final_L, final_R = x, y

    cipher_bytes = (final_L.to_bytes(4, "big") + final_R.to_bytes(4, "big"))
    out_hex = _hex_pairs(cipher_bytes.hex())

    steps = [
        step(1, "Key expansion (P-array)",
             "Each P-array word is XORed with a 4-byte big-endian key word "
             "assembled from the key bytes, cycling the key until all 18 "
             "words are mixed. The all-zero block is then re-encrypted to "
             "replace P[0..17].",
             "key length: %d bits (variable)" % (len(key) * 8),
             "18 randomized P words",
             {"p_array": [f"{w:08x}" for w in p]}),
        step(2, "Key-dependent S-boxes",
             "The four 256-entry S-boxes are generated next by encrypting "
             "zero blocks with the evolving P-array and S-boxes.",
             "S0..S3 initialized from pi", "4 × 256 randomized words",
             {"s0": [f"{w:08x}" for w in s[0][:8]], "count": 4}),
        step(3, "Input whitening (P[0])",
             "The 64-bit block is split into two 32-bit halves L and R "
             "(big-endian word loading) and the left half is XORed with "
             "P[0].",
             f"L = {L:08x}  R = {R:08x}", f"L = {L ^ p[0]:08x}",
             {"whitening": "L ^= P[0]"}),
        step(4, "Rounds 1–16 (Feistel network)",
             "Each round: R ^= F(L) XOR P[i] using the key-dependent "
             "S-boxes (F = ((S0[a]+S1[b]) XOR S2[c]) + S3[d]); then swap L "
             "and R.",
             "16 rounds", "L, R swapped each round",
             {"rounds": round_states, "f_function": "F(x) = ((S0[a]+S1[b]) ^ S2[c]) + S3[d]"}),
        step(5, "Final transformation",
             "After the 16th round the left word is XORed with P[17] to "
             "yield the final |L|R\n state, which is serialized to the "
             "64-bit output block.",
             "", cipher_bytes.hex(),
             {"p16": f"{p[16]:08x}", "p17": f"{p[17]:08x}"}),
        step(6, "Output",
             "The two 32-bit halves are serialized back to 8 bytes "
             "(big-endian word order) to form the 64-bit ciphertext block.",
             "", cipher_bytes.hex(), {}),
    ]

    extra = {
        "block_size": 64,
        "key_size": len(key) * 8,
        "rounds": 16,
        "round_states": round_states,
        "p_array": [f"{w:08x}" for w in p],
        "s_box_heads": [[f"{w:08x}" for w in s[b][:4]] for b in range(4)],
        "deprecated_warning": True,
        "security_note": (
            "Blowfish is legacy: its 64-bit block size permits birthday "
            "attacks in long-lived connections and it is not NIST-"
            "approved. Use AES with a 128-bit block instead."
        ),
    }
    return build_result("blowfish", operation, hex_block,
                        {"key": hex_key}, out_hex, steps, extra)


def encrypt(hex_block: str, hex_key: str) -> dict:
    return _run(hex_key, hex_block, "encrypt")


def decrypt(hex_block: str, hex_key: str) -> dict:
    return _run(hex_key, hex_block, "decrypt")


def get_metadata() -> dict:
    return METADATA


# Public helpers for tests.
def pi_words(count: int) -> List[int]:
    return _initial_words(count)


def f_function(x: int, sbox: List[List[int]] | None = None) -> int:
    return _f(x, _INIT_S if sbox is None else sbox)
