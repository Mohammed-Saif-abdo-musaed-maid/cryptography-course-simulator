"""Educational Twofish block-cipher simulator.

A faithful implementation of Twofish (Schneier, Kelsey, Whiting, Wagner,
Hall, Ferguson — AES finalist), built from the public "clean room"
implementation of Matthew Skala / the Linux kernel:

  * 128-bit block, 16-round network
  * key sizes 128 / 192 / 256 bits (16 / 24 / 32 bytes)
  * key-dependent S-boxes built from the fixed q0/q1 permutations and a
    4x4 MDS matrix over GF(2^8) with polynomial 0x169
  * key schedule via the (12,8) Reed-Solomon code over GF(2^8) with
    polynomial 0x14D, producing 8 whitening keys + 40 round subkeys
  * round function g() = keyed S-boxes + MDS, a Pseudo-Hadamard Transform
    (PHT) and 1-bit rotations.

All round states shown are genuine intermediate values.
"""

from __future__ import annotations

from typing import List, Tuple

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "twofish",
    "name": "Twofish",
    "category": "symmetric",
    "security_status": "secure",
    "reversible": True,
    "key_kind": "128 / 192 / 256 bits (32 / 48 / 64 hex digits)",
    "block_size": "128 bits",
    "description": (
        "Block cipher by Bruce Schneier et al., a finalist of the NIST AES "
        "competition (1998). 128-bit block, 16 rounds, key-dependent S-boxes "
        "and an MDS matrix over GF(2^8). Unpatented and free; it remains "
        "conservative, fast on modern CPUs and unbroken."
    ),
}

_M32 = 0xFFFFFFFF


# ---------------------------------------------------------------------------
# q0 / q1 fixed permutations (from the reference twofish_common.c).
# ---------------------------------------------------------------------------

Q0 = [
    0xA9, 0x67, 0xB3, 0xE8, 0x04, 0xFD, 0xA3, 0x76, 0x9A, 0x92, 0x80, 0x78,
    0xE4, 0xDD, 0xD1, 0x38, 0x0D, 0xC6, 0x35, 0x98, 0x18, 0xF7, 0xEC, 0x6C,
    0x43, 0x75, 0x37, 0x26, 0xFA, 0x13, 0x94, 0x48, 0xF2, 0xD0, 0x8B, 0x30,
    0x84, 0x54, 0xDF, 0x23, 0x19, 0x5B, 0x3D, 0x59, 0xF3, 0xAE, 0xA2, 0x82,
    0x63, 0x01, 0x83, 0x2E, 0xD9, 0x51, 0x9B, 0x7C, 0xA6, 0xEB, 0xA5, 0xBE,
    0x16, 0x0C, 0xE3, 0x61, 0xC0, 0x8C, 0x3A, 0xF5, 0x73, 0x2C, 0x25, 0x0B,
    0xBB, 0x4E, 0x89, 0x6B, 0x53, 0x6A, 0xB4, 0xF1, 0xE1, 0xE6, 0xBD, 0x45,
    0xE2, 0xF4, 0xB6, 0x66, 0xCC, 0x95, 0x03, 0x56, 0xD4, 0x1C, 0x1E, 0xD7,
    0xFB, 0xC3, 0x8E, 0xB5, 0xE9, 0xCF, 0xBF, 0xBA, 0xEA, 0x77, 0x39, 0xAF,
    0x33, 0xC9, 0x62, 0x71, 0x81, 0x79, 0x09, 0xAD, 0x24, 0xCD, 0xF9, 0xD8,
    0xE5, 0xC5, 0xB9, 0x4D, 0x44, 0x08, 0x86, 0xE7, 0xA1, 0x1D, 0xAA, 0xED,
    0x06, 0x70, 0xB2, 0xD2, 0x41, 0x7B, 0xA0, 0x11, 0x31, 0xC2, 0x27, 0x90,
    0x20, 0xF6, 0x60, 0xFF, 0x96, 0x5C, 0xB1, 0xAB, 0x9E, 0x9C, 0x52, 0x1B,
    0x5F, 0x93, 0x0A, 0xEF, 0x91, 0x85, 0x49, 0xEE, 0x2D, 0x4F, 0x8F, 0x3B,
    0x47, 0x87, 0x6D, 0x46, 0xD6, 0x3E, 0x69, 0x64, 0x2A, 0xCE, 0xCB, 0x2F,
    0xFC, 0x97, 0x05, 0x7A, 0xAC, 0x7F, 0xD5, 0x1A, 0x4B, 0x0E, 0xA7, 0x5A,
    0x28, 0x14, 0x3F, 0x29, 0x88, 0x3C, 0x4C, 0x02, 0xB8, 0xDA, 0xB0, 0x17,
    0x55, 0x1F, 0x8A, 0x7D, 0x57, 0xC7, 0x8D, 0x74, 0xB7, 0xC4, 0x9F, 0x72,
    0x7E, 0x15, 0x22, 0x12, 0x58, 0x07, 0x99, 0x34, 0x6E, 0x50, 0xDE, 0x68,
    0x65, 0xBC, 0xDB, 0xF8, 0xC8, 0xA8, 0x2B, 0x40, 0xDC, 0xFE, 0x32, 0xA4,
    0xCA, 0x10, 0x21, 0xF0, 0xD3, 0x5D, 0x0F, 0x00, 0x6F, 0x9D, 0x36, 0x42,
    0x4A, 0x5E, 0xC1, 0xE0,
]

Q1 = [
    0x75, 0xF3, 0xC6, 0xF4, 0xDB, 0x7B, 0xFB, 0xC8, 0x4A, 0xD3, 0xE6, 0x6B,
    0x45, 0x7D, 0xE8, 0x4B, 0xD6, 0x32, 0xD8, 0xFD, 0x37, 0x71, 0xF1, 0xE1,
    0x30, 0x0F, 0xF8, 0x1B, 0x87, 0xFA, 0x06, 0x3F, 0x5E, 0xBA, 0xAE, 0x5B,
    0x8A, 0x00, 0xBC, 0x9D, 0x6D, 0xC1, 0xB1, 0x0E, 0x80, 0x5D, 0xD2, 0xD5,
    0xA0, 0x84, 0x07, 0x14, 0xB5, 0x90, 0x2C, 0xA3, 0xB2, 0x73, 0x4C, 0x54,
    0x92, 0x74, 0x36, 0x51, 0x38, 0xB0, 0xBD, 0x5A, 0xFC, 0x60, 0x62, 0x96,
    0x6C, 0x42, 0xF7, 0x10, 0x7C, 0x28, 0x27, 0x8C, 0x13, 0x95, 0x9C, 0xC7,
    0x24, 0x46, 0x3B, 0x70, 0xCA, 0xE3, 0x85, 0xCB, 0x11, 0xD0, 0x93, 0xB8,
    0xA6, 0x83, 0x20, 0xFF, 0x9F, 0x77, 0xC3, 0xCC, 0x03, 0x6F, 0x08, 0xBF,
    0x40, 0xE7, 0x2B, 0xE2, 0x79, 0x0C, 0xAA, 0x82, 0x41, 0x3A, 0xEA, 0xB9,
    0xE4, 0x9A, 0xA4, 0x97, 0x7E, 0xDA, 0x7A, 0x17, 0x66, 0x94, 0xA1, 0x1D,
    0x3D, 0xF0, 0xDE, 0xB3, 0x0B, 0x72, 0xA7, 0x1C, 0xEF, 0xD1, 0x53, 0x3E,
    0x8F, 0x33, 0x26, 0x5F, 0xEC, 0x76, 0x2A, 0x49, 0x81, 0x88, 0xEE, 0x21,
    0xC4, 0x1A, 0xEB, 0xD9, 0xC5, 0x39, 0x99, 0xCD, 0xAD, 0x31, 0x8B, 0x01,
    0x18, 0x23, 0xDD, 0x1F, 0x4E, 0x2D, 0xF9, 0x48, 0x4F, 0xF2, 0x65, 0x8E,
    0x78, 0x5C, 0x58, 0x19, 0x8D, 0xE5, 0x98, 0x57, 0x67, 0x7F, 0x05, 0x64,
    0xAF, 0x63, 0xB6, 0xFE, 0xF5, 0xB7, 0x3C, 0xA5, 0xCE, 0xE9, 0x68, 0x44,
    0xE0, 0x4D, 0x43, 0x69, 0x29, 0x2E, 0xAC, 0x15, 0x59, 0xA8, 0x0A, 0x9E,
    0x6E, 0x47, 0xDF, 0x34, 0x35, 0x6A, 0xCF, 0xDC, 0x22, 0xC9, 0xC0, 0x9B,
    0x89, 0xD4, 0xED, 0xAB, 0x12, 0xA2, 0x0D, 0x52, 0xBB, 0x02, 0x2F, 0xA9,
    0xD7, 0x61, 0x1E, 0xB4, 0x50, 0x04, 0xF6, 0xC2, 0x16, 0x25, 0x86, 0x56,
    0x55, 0x09, 0xBE, 0x91,
]


# ---------------------------------------------------------------------------
# GF(2^8) arithmetic: MDS field poly 0x169, RS field poly 0x14D.
# ---------------------------------------------------------------------------


def _gf_mul(a: int, b: int, poly: int) -> int:
    """Multiply two GF(2^8) elements (reduce by irreducible `poly`)."""
    result = 0
    while b:
        if b & 1:
            result ^= a
        a <<= 1
        if a & 0x100:
            a ^= poly
        b >>= 1
    return result & 0xFF


# MDS matrix from the Twofish paper.
_MDS = [
    [0x01, 0xEF, 0x5B, 0x5B],
    [0x5B, 0xEF, 0xEF, 0x01],
    [0xEF, 0x5B, 0x01, 0xEF],
    [0xEF, 0x01, 0xEF, 0x5B],
]


def _mds_word(pos: int, value: int) -> int:
    """32-bit value of reference table mds[pos][value].

    The reference tables are pre-composed with q: mds[0][i] = MDS(q1[i],0,0,0)^T
    for even positions (q0 for odd positions), applied over GF(2^8)/0x169.
    ``value`` is the table INDEX, the q permutation happens inside.
    """
    q = Q1 if pos % 2 == 0 else Q0
    v = q[value]
    out = 0
    for r in range(4):
        out |= _gf_mul(_MDS[r][pos], v, 0x169) << (8 * r)
    return out


# RS matrix columns (each 4-row output for one key byte), from the paper.
_RS_COLS = [
    (0x01, 0xA4, 0x02, 0xA4), (0xA4, 0x56, 0xA1, 0x55),
    (0x55, 0x82, 0xFC, 0x87), (0x87, 0xF3, 0xC1, 0x5A),
    (0x5A, 0x1E, 0x47, 0x58), (0x58, 0xC6, 0xAE, 0xDB),
    (0xDB, 0x68, 0x3D, 0x9E), (0x9E, 0xE5, 0x19, 0x03),
]


def _rs_word(key: bytes, base: int) -> int:
    """One 32-bit word of the RS key schedule transform over key[base:base+8]."""
    out = [0, 0, 0, 0]
    for i in range(8):
        k = key[base + i]
        if k == 0:
            continue
        col = _RS_COLS[i]
        for r in range(4):
            out[r] ^= _gf_mul(col[r], k, 0x14D)
    return (out[0] << 24) | (out[1] << 16) | (out[2] << 8) | out[3]


def _s_vector_bytes(key: bytes) -> List[int]:
    """The 8..16 S-vector bytes sa..sp used to key the S-boxes."""
    words = [_rs_word(key, 0), _rs_word(key, 8)]
    if len(key) >= 24:
        words.append(_rs_word(key, 16))
    if len(key) == 32:
        words.append(_rs_word(key, 24))
    out = []
    for w in words:
        out += [w >> 24 & 0xFF, w >> 16 & 0xFF, w >> 8 & 0xFF, w & 0xFF]
    return out + [0] * (16 - len(out))


def _rotl32(v: int, n: int) -> int:
    return ((v << n) | (v >> (32 - n))) & _M32


def _ror32(v: int, n: int) -> int:
    return ((v >> n) | (v << (32 - n))) & _M32


def _parse_hex(value: str, label: str) -> bytes:
    try:
        return bytes.fromhex(value)
    except ValueError as exc:
        raise ValidationError(f"{label} must be valid hexadecimal", "invalid_hex") from exc


def _hex_pairs(hex_str: str) -> str:
    hex_str = hex_str.lower()
    return " ".join(hex_str[i:i + 2] for i in range(0, len(hex_str), 2))


# ---------------------------------------------------------------------------
# Key-dependent S-boxes.
# ---------------------------------------------------------------------------


def _make_sboxes(key: bytes) -> List[List[int]]:
    """Four key-dependent S-boxes of 256 entries each (MDS-combined)."""
    sv = _s_vector_bytes(key)
    (sa, sb, sc, sd, se, sf, sg, sh,
     si, sj, sk, sl, sm, sn, so_, sp) = sv[:16]

    s = [[0] * 256 for _ in range(4)]
    klen = len(key)
    for i in range(256):
        a, b = Q0[i], Q1[i]
        if klen == 16:
            s[0][i] = _mds_word(0, Q0[(a ^ sa) & 0xFF] ^ se)
            s[1][i] = _mds_word(1, Q0[(b ^ sb) & 0xFF] ^ sf)
            s[2][i] = _mds_word(2, Q1[(a ^ sc) & 0xFF] ^ sg)
            s[3][i] = _mds_word(3, Q1[(b ^ sd) & 0xFF] ^ sh)
        elif klen == 24:
            s[0][i] = _mds_word(0, Q0[Q0[(b ^ sa) & 0xFF] ^ se] ^ si)
            s[1][i] = _mds_word(1, Q0[Q1[(b ^ sb) & 0xFF] ^ sf] ^ sj)
            s[2][i] = _mds_word(2, Q1[Q0[(a ^ sc) & 0xFF] ^ sg] ^ sk)
            s[3][i] = _mds_word(3, Q1[Q1[(a ^ sd) & 0xFF] ^ sh] ^ sl)
        else:
            s[0][i] = _mds_word(0, Q0[Q0[Q1[(b ^ sa) & 0xFF] ^ se] ^ si] ^ sm)
            s[1][i] = _mds_word(1, Q0[Q1[Q1[(a ^ sb) & 0xFF] ^ sf] ^ sj] ^ sn)
            s[2][i] = _mds_word(2, Q1[Q0[Q0[(a ^ sc) & 0xFF] ^ sg] ^ sk] ^ so_)
            s[3][i] = _mds_word(3, Q1[Q1[Q0[(b ^ sd) & 0xFF] ^ sh] ^ sl] ^ sp)
    return s


# ---------------------------------------------------------------------------
# Key schedule: whitening keys w[0..7] and round subkeys k[0..39].
# ---------------------------------------------------------------------------


def _calc_k2(a: int, b: int, c: int, d: int, j: int, key: bytes) -> int:
    """Kernel CALC_K_2: last h() stage over key[j..j+3] and key[j+8..j+11]."""
    return (_mds_word(0, Q0[(a ^ key[j + 8]) & 0xFF] ^ key[j])
            ^ _mds_word(1, Q0[(b ^ key[j + 9]) & 0xFF] ^ key[j + 1])
            ^ _mds_word(2, Q1[(c ^ key[j + 10]) & 0xFF] ^ key[j + 2])
            ^ _mds_word(3, Q1[(d ^ key[j + 11]) & 0xFF] ^ key[j + 3]))


def _calc_k3(a: int, b: int, c: int, d: int, j: int, key: bytes) -> int:
    """Kernel CALC_K192_2: adds a second q stage with key[j+16..j+19]."""
    return _calc_k2(Q0[(a ^ key[j + 16]) & 0xFF],
                    Q1[(b ^ key[j + 17]) & 0xFF],
                    Q0[(c ^ key[j + 18]) & 0xFF],
                    Q1[(d ^ key[j + 19]) & 0xFF], j, key)


def _calc_k4(a: int, b: int, j: int, key: bytes) -> int:
    """Kernel CALC_K256_2: adds a third q stage with key[j+24..j+27]."""
    return _calc_k3(Q1[(b ^ key[j + 24]) & 0xFF],
                    Q1[(a ^ key[j + 25]) & 0xFF],
                    Q0[(a ^ key[j + 26]) & 0xFF],
                    Q0[(b ^ key[j + 27]) & 0xFF], j, key)


def _calc_k(k: int, l: int, m: int, n: int, key: bytes,
            depth: int) -> Tuple[int, int]:
    """Compute one subkey pair (CALC_K / CALC_K192 / CALC_K256).

    x derives from index 2i (bytes k,l), y from index 2i+1 (bytes m,n).
    """
    klen = len(key)
    if klen == 16:
        x = _calc_k2(k, l, k, l, 0, key)
        y = _calc_k2(m, n, m, n, 4, key)
    elif klen == 24:
        x = _calc_k3(l, l, k, k, 0, key)
        y = _calc_k3(n, n, m, m, 4, key)
    else:
        x = _calc_k4(k, l, 0, key)
        y = _calc_k4(m, n, 4, key)
    y = _rotl32(y, 8)
    x = (x + y) & _M32
    y = (y + x) & _M32
    return x, _rotl32(y, 9)


def _subkeys(key: bytes) -> Tuple[List[int], List[int]]:
    """whitening keys w[0..7] and round subkeys k[0..39]."""
    w = [0] * 8
    k = [0] * 40
    for i in range(0, 8, 2):
        w[i], w[i + 1] = _calc_k(Q0[i], Q1[i], Q0[i + 1], Q1[i + 1], key, 1)
    for i in range(0, 32, 2):
        k[i], k[i + 1] = _calc_k(Q0[i + 8], Q1[i + 8], Q0[i + 9], Q1[i + 9], key, 1)
    return w, k


# ---------------------------------------------------------------------------
# g() function.
# ---------------------------------------------------------------------------


def _g0(x: int, s: List[List[int]]) -> int:
    return (s[0][x & 0xFF] ^ s[1][(x >> 8) & 0xFF]
            ^ s[2][(x >> 16) & 0xFF] ^ s[3][x >> 24])


def _g1(x: int, s: List[List[int]]) -> int:
    return (s[1][x & 0xFF] ^ s[2][(x >> 8) & 0xFF]
            ^ s[3][(x >> 16) & 0xFF] ^ s[0][x >> 24])


# ---------------------------------------------------------------------------
# Block transforms.
# ---------------------------------------------------------------------------


def _encrypt_state(a: int, b: int, c: int, d: int, s: List[List[int]],
                   k: List[int]) -> Tuple[int, int, int, int]:
    for i in range(8):
        x = (_g0(a, s) + _g1(b, s)) & _M32
        y = (_g1(b, s) + x + k[4 * i + 1]) & _M32
        c = (c ^ ((x + k[4 * i]) & _M32)) & _M32
        c = _ror32(c, 1)
        d = (_rotl32(d, 1) ^ y) & _M32

        x = (_g0(c, s) + _g1(d, s)) & _M32
        y = (_g1(d, s) + x + k[4 * i + 3]) & _M32
        a = (a ^ ((x + k[4 * i + 2]) & _M32)) & _M32
        a = _ror32(a, 1)
        b = (_rotl32(b, 1) ^ y) & _M32
    return a, b, c, d


def _decrypt_state(a: int, b: int, c: int, d: int, s: List[List[int]],
                   k: List[int]) -> Tuple[int, int, int, int]:
    for i in range(7, -1, -1):
        x = (_g0(c, s) + _g1(d, s)) & _M32
        y = (_g1(d, s) + x) & _M32
        a = (_rotl32(a, 1) ^ ((x + k[4 * i + 2]) & _M32)) & _M32
        b = (b ^ ((y + k[4 * i + 3]) & _M32)) & _M32
        b = _ror32(b, 1)

        x = (_g0(a, s) + _g1(b, s)) & _M32
        y = (_g1(b, s) + x) & _M32
        c = (_rotl32(c, 1) ^ ((x + k[4 * i]) & _M32)) & _M32
        d = (d ^ ((y + k[4 * i + 1]) & _M32)) & _M32
        d = _ror32(d, 1)
    return a, b, c, d


def _word(byte4: bytes) -> int:
    return int.from_bytes(byte4, "little")


def _state_hex(a: int, b: int, c: int, d: int) -> Tuple[str, str, str, str]:
    return (f"{a:08x}", f"{b:08x}", f"{c:08x}", f"{d:08x}")


# ---------------------------------------------------------------------------
# Full simulation.
# ---------------------------------------------------------------------------


def _validate(hex_key: str, hex_block: str) -> tuple:
    key = _parse_hex(hex_key, "Key")
    if len(key) not in (16, 24, 32):
        raise ValidationError(
            "Twofish key size must be 128, 192 or 256 bits (16, 24 or 32 bytes)",
            "invalid_key",
        )
    block = _parse_hex(hex_block, "Block")
    if len(block) != 16:
        raise ValidationError(
            "Twofish block must be exactly 128 bits (32 hex digits)",
            "invalid_block",
        )
    return key, block


def run(hex_block: str, hex_key: str, decrypt_mode: bool = False) -> dict:
    """Full simulation returning complete intermediate state."""
    key, block = _validate(hex_key, hex_block)
    klen = len(key)

    s = _make_sboxes(key)
    w, k = _subkeys(key)

    m0 = _word(block[0:4])
    m1 = _word(block[4:8])
    m2 = _word(block[8:12])
    m3 = _word(block[12:16])

    round_states = []

    if not decrypt_mode:
        a = m0 ^ w[0]
        b = m1 ^ w[1]
        c = m2 ^ w[2]
        d = m3 ^ w[3]

        for i in range(8):
            raw = (a, b)
            x = (_g0(raw[0], s) + _g1(raw[1], s)) & _M32
            y = (_g1(raw[1], s) + x + k[4 * i + 1]) & _M32
            c = (c ^ ((x + k[4 * i]) & _M32)) & _M32
            c = _ror32(c, 1)
            d = (_rotl32(d, 1) ^ y) & _M32
            ah, bh, ch, dh = _state_hex(a, b, c, d)
            round_states.append({
                "round": 2 * i + 1,
                "a": ah, "b": bh, "c": ch, "d": dh,
                "g_a": f"{_g0(a, s):08x}", "g_b": f"{_g1(b, s):08x}",
            })

            raw = (c, d)
            x = (_g0(raw[0], s) + _g1(raw[1], s)) & _M32
            y = (_g1(raw[1], s) + x + k[4 * i + 3]) & _M32
            a = (a ^ ((x + k[4 * i + 2]) & _M32)) & _M32
            a = _ror32(a, 1)
            b = (_rotl32(b, 1) ^ y) & _M32
            ah, bh, ch, dh = _state_hex(a, b, c, d)
            round_states.append({
                "round": 2 * i + 2,
                "a": ah, "b": bh, "c": ch, "d": dh,
                "g_c": f"{_g0(c, s):08x}", "g_d": f"{_g1(d, s):08x}",
            })

        out0 = c ^ w[4]
        out1 = d ^ w[5]
        out2 = a ^ w[6]
        out3 = b ^ w[7]

    else:
        c = m0 ^ w[4]
        d = m1 ^ w[5]
        a = m2 ^ w[6]
        b = m3 ^ w[7]

        for i in range(7, -1, -1):
            raw = (c, d)
            x = (_g0(raw[0], s) + _g1(raw[1], s)) & _M32
            y = (_g1(raw[1], s) + x) & _M32
            a = (_rotl32(a, 1) ^ ((x + k[4 * i + 2]) & _M32)) & _M32
            b = (b ^ ((y + k[4 * i + 3]) & _M32)) & _M32
            b = _ror32(b, 1)
            ah, bh, ch, dh = _state_hex(a, b, c, d)
            round_states.append({
                "round": 16 - 2 * i - 1,
                "a": ah, "b": bh, "c": ch, "d": dh,
                "g_c": f"{_g0(c, s):08x}", "g_d": f"{_g1(d, s):08x}",
            })

            raw = (a, b)
            x = (_g0(raw[0], s) + _g1(raw[1], s)) & _M32
            y = (_g1(raw[1], s) + x) & _M32
            c = (_rotl32(c, 1) ^ ((x + k[4 * i]) & _M32)) & _M32
            d = (d ^ ((y + k[4 * i + 1]) & _M32)) & _M32
            d = _ror32(d, 1)
            ah, bh, ch, dh = _state_hex(a, b, c, d)
            round_states.append({
                "round": 16 - 2 * i,
                "a": ah, "b": bh, "c": ch, "d": dh,
                "g_a": f"{_g0(a, s):08x}", "g_b": f"{_g1(b, s):08x}",
            })

        round_states.reverse()

        out0 = a ^ w[0]
        out1 = b ^ w[1]
        out2 = c ^ w[2]
        out3 = d ^ w[3]

    result_block = (out0.to_bytes(4, "little") + out1.to_bytes(4, "little")
                    + out2.to_bytes(4, "little") + out3.to_bytes(4, "little"))
    result_hex = _hex_pairs(result_block.hex())

    ws = [f"{v:08x}" for v in w]
    ks = [f"{v:08x}" for v in k]

    steps = [
        step(1, "Key expansion — RS + h()",
             f"The {klen * 8}-bit key is expanded: the (12,8) Reed-Solomon "
             f"code over GF(2^8) creates the S-vector, then h() with the "
             f"q0/q1 permutations builds 8 whitening keys and 40 round "
             f"subkeys.",
             hex_key, "w[0:8] = " + " ".join(ws),
             {"whitening_keys": ws, "round_subkeys": ks, "key_size": klen * 8}),
        step(2, "Key-dependent S-boxes",
             "Four 256-entry S-boxes are built from q0/q1 and the keyed "
             "S-vector; each entry combines the MDS matrix against GF(2^8) "
             "bytes.",
             "S vector: " + " ".join(f"{v:02x}" for v in _s_vector_bytes(key)),
             f"S[0][0] = {s[0][0] & 0xFF:02x} …",
             {"sbox_heads": [[f"{s[r][i]:08x}" for i in (0, 1, 2, 3)]
                             for r in range(4)]}),
        step(3, "Input whitening",
             "The 128-bit block is split into four little-endian 32-bit "
             "words a, b, c, d, each XORed with a whitening key "
             "(w[0]..w[3] encrypting, w[4]..w[7] decrypting).",
             block.hex(), "a b c d",
             {"a": f"{a:08x}", "b": f"{b:08x}", "c": f"{c:08x}", "d": f"{d:08x}"}),
        step(4, "Sixteen rounds (g() + PHT + rotations)",
             "Each round runs g() twice (keyed S-boxes + MDS), then a "
             "Pseudo-Hadamard Transform with a subkey, and 1-bit word "
             "rotations; the halves swap every two rounds.",
             f"a = {round_states[0]['a']}…",
             f"final = {result_hex}",
             {"rounds": round_states}),
        step(5, "Output whitening and result",
             "The four words are XORed with whitening keys w[4]..w[7] "
             "(encryption; decrypt uses w[0]..w[3]) and written back as "
             "little-endian bytes.",
             "", result_hex, {}),
    ]
    return build_result(
        "twofish",
        "decrypt" if decrypt_mode else "encrypt",
        hex_block,
        {"key": hex_key},
        result_hex,
        steps,
        {
            "result": result_hex,
            "round_states": round_states,
            "whitening_keys": ws,
            "round_subkeys": ks,
            "sboxes": [[f"{s[r][i]:08x}" for i in range(256)] for r in range(4)],
            "block_size": 128,
            "key_size": klen * 8,
            "rounds": 16,
            "security_note": "Twofish is an AES finalist and remains unbroken.",
        },
    )


def encrypt(hex_block: str, hex_key: str) -> dict:
    return run(hex_block, hex_key, decrypt_mode=False)


def decrypt(hex_block: str, hex_key: str) -> dict:
    return run(hex_block, hex_key, decrypt_mode=True)


def get_metadata() -> dict:
    return METADATA


# Optional public helpers for tests.
def s_boxes(hex_key: str) -> List[List[int]]:
    return _make_sboxes(_parse_hex(hex_key, "Key"))


def subkeys_words(hex_key: str) -> List[int]:
    return list(_subkeys(_parse_hex(hex_key, "Key"))[1])


def gf2_mul_mds(a: int, b: int) -> int:
    return _gf_mul(a, b, 0x169)
