"""Educational AES simulator (AES-128 / AES-192 / AES-256).

Faithful byte-level Rijndael implementation:
  * key expansion (Nk+1 round keys)
  * SubBytes (S-box)
  * ShiftRows
  * MixColumns (GF(2⁸) multiplication by {02},{03})
  * AddRoundKey
  * 10/12/14 rounds depending on key size

Produces genuine per-round state matrices. AES is the modern standard for
symmetric block encryption.
"""

from __future__ import annotations

from typing import List, Optional

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "aes",
    "name": "AES",
    "category": "symmetric",
    "security_status": "secure",
    "reversible": True,
    "key_kind": "128 / 192 / 256 bits (hex, 2·N bytes)",
    "block_size": "128 bits",
    "description": (
        "The Advanced Encryption Standard (Rijndael). A 128-bit block "
        "cipher with 128, 192 or 256-bit keys and 10, 12 or 14 rounds. "
        "Currently the recommended symmetric cipher."
    ),
}

# ---------------------------------------------------------------------------
# S-box and its inverse (standard Rijndael tables).
# ---------------------------------------------------------------------------

SBOX = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
]

INV_SBOX = [0] * 256
for _i, _v in enumerate(SBOX):
    INV_SBOX[_v] = _i

RCON = [
    0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36,
    0x6c, 0xd8, 0xab, 0x4d, 0x9a,
]

KEY_SIZE = {16: "AES-128", 24: "AES-192", 32: "AES-256"}
ROUNDS = {16: 10, 24: 12, 32: 14}


def _xtime(a: int) -> int:
    """Multiplication by {02} in GF(2⁸)."""
    a <<= 1
    if a & 0x100:
        a ^= 0x11B
    return a & 0xFF


def _gf2_mul(a: int, b: int) -> int:
    """General GF(2⁸) multiplication (via Russian-peasant-style xtime)."""
    result = 0
    for _ in range(8):
        if b & 1:
            result ^= a
        b >>= 1
        a = _xtime(a)
    return result & 0xFF


# ---------------------------------------------------------------------------
# Hex helpers.
# ---------------------------------------------------------------------------


def _parse_hex(value: str, label: str) -> bytes:
    try:
        raw = bytes.fromhex(value)
    except ValueError as exc:
        raise ValidationError(f"{label} must be valid hexadecimal", "invalid_hex") from exc
    return raw


def _state_from_bytes(block: bytes) -> List[List[int]]:
    """4 rows × 4 cols (column-major as per the AES spec)."""
    return [[block[r + 4 * c] for c in range(4)] for r in range(4)]


def _state_to_bytes(state: List[List[int]]) -> bytes:
    return bytes(state[r][c] for c in range(4) for r in range(4))


def _state_to_hex(state: List[List[int]]) -> str:
    return _state_to_bytes(state).hex()


def _hex_pairs(hex_str: str) -> str:
    s = hex_str.lower()
    return " ".join(s[i:i + 2] for i in range(0, len(s), 2))


# ---------------------------------------------------------------------------
# Key expansion.
# ---------------------------------------------------------------------------


def _rot_word(word: List[int]) -> List[int]:
    return word[1:] + word[:1]


def _sub_word(word: List[int]) -> List[int]:
    return [SBOX[b] for b in word]


def _key_expansion(key: bytes, nk: int) -> List[List[int]]:
    """Return (nr+1) round keys, each a list of 4 words (16 bytes)."""
    nr = ROUNDS[len(key)]
    expanded: List[List[int]] = []
    for i in range(nk):
        expanded.append([key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]])
    for i in range(nk, 4 * (nr + 1)):
        temp = list(expanded[i - 1])
        if i % nk == 0:
            temp = _sub_word(_rot_word(temp))
            temp[0] ^= RCON[i // nk - 1]
        elif nk > 6 and i % nk == 4:
            temp = _sub_word(temp)
        expanded.append([
            temp[0] ^ expanded[i - nk][0],
            temp[1] ^ expanded[i - nk][1],
            temp[2] ^ expanded[i - nk][2],
            temp[3] ^ expanded[i - nk][3],
        ])
    round_keys = [expanded[i:i + 4] for i in range(0, 4 * (nr + 1), 4)]
    return round_keys


# ---------------------------------------------------------------------------
# Round transforms.
# ---------------------------------------------------------------------------


def _add_round_key(state: List[List[int]], round_key: List[List[int]]) -> None:
    for c in range(4):
        for r in range(4):
            state[r][c] ^= round_key[c][r]


def _sub_bytes(state: List[List[int]]) -> None:
    for r in range(4):
        for c in range(4):
            state[r][c] = SBOX[state[r][c]]


def _inv_sub_bytes(state: List[List[int]]) -> None:
    for r in range(4):
        for c in range(4):
            state[r][c] = INV_SBOX[state[r][c]]


def _shift_rows(state: List[List[int]]) -> None:
    for r in range(1, 4):
        state[r] = state[r][r:] + state[r][:r]


def _inv_shift_rows(state: List[List[int]]) -> None:
    for r in range(1, 4):
        state[r] = state[r][4 - r:] + state[r][:4 - r]


def _mix_columns(state: List[List[int]]) -> None:
    for c in range(4):
        a0, a1, a2, a3 = state[0][c], state[1][c], state[2][c], state[3][c]
        state[0][c] = _xtime(a0) ^ (_gf2_mul(a1, 3)) ^ a2 ^ a3
        state[1][c] = _xtime(a1) ^ (_gf2_mul(a2, 3)) ^ a3 ^ a0
        state[2][c] = _xtime(a2) ^ (_gf2_mul(a3, 3)) ^ a0 ^ a1
        state[3][c] = _xtime(a3) ^ (_gf2_mul(a0, 3)) ^ a1 ^ a2


def _inv_mix_columns(state: List[List[int]]) -> None:
    for c in range(4):
        a0, a1, a2, a3 = state[0][c], state[1][c], state[2][c], state[3][c]
        state[0][c] = _gf2_mul(a0, 14) ^ _gf2_mul(a1, 11) ^ _gf2_mul(a2, 13) ^ _gf2_mul(a3, 9)
        state[1][c] = _gf2_mul(a0, 9) ^ _gf2_mul(a1, 14) ^ _gf2_mul(a2, 11) ^ _gf2_mul(a3, 13)
        state[2][c] = _gf2_mul(a0, 13) ^ _gf2_mul(a1, 9) ^ _gf2_mul(a2, 14) ^ _gf2_mul(a3, 11)
        state[3][c] = _gf2_mul(a0, 11) ^ _gf2_mul(a1, 13) ^ _gf2_mul(a2, 9) ^ _gf2_mul(a3, 14)


# ---------------------------------------------------------------------------
# Cipher core.
# ---------------------------------------------------------------------------


def _aes_encrypt_block(block: bytes, key: bytes) -> tuple:
    nk = len(key) // 4
    nr = ROUNDS[len(key)]
    round_keys = _key_expansion(key, nk)
    state = _state_from_bytes(block)
    _add_round_key(state, round_keys[0])

    round_states = [{
        "round": 0,
        "name": "Initial AddRoundKey",
        "state": _state_to_hex(state),
        "state_matrix": [[f"{v:02x}" for v in row] for row in state],
    }]

    for rnd in range(1, nr):
        _sub_bytes(state)
        _shift_rows(state)
        _mix_columns(state)
        _add_round_key(state, round_keys[rnd])
        round_states.append({
            "round": rnd,
            "name": f"Round {rnd} (SubBytes, ShiftRows, MixColumns, AddRoundKey)",
            "state": _state_to_hex(state),
            "state_matrix": [[f"{v:02x}" for v in row] for row in state],
        })

    _sub_bytes(state)
    _shift_rows(state)
    _add_round_key(state, round_keys[nr])
    round_states.append({
        "round": nr,
        "name": f"Final round {nr} (SubBytes, ShiftRows, AddRoundKey — no MixColumns)",
        "state": _state_to_hex(state),
        "state_matrix": [[f"{v:02x}" for v in row] for row in state],
    })
    return _state_to_bytes(state), round_keys, round_states


def _aes_decrypt_block(block: bytes, key: bytes) -> tuple:
    nk = len(key) // 4
    nr = ROUNDS[len(key)]
    round_keys = _key_expansion(key, nk)
    state = _state_from_bytes(block)
    _add_round_key(state, round_keys[nr])

    round_states = [{
        "round": 0,
        "name": "Initial AddRoundKey (K{})".format(nr),
        "state": _state_to_hex(state),
        "state_matrix": [[f"{v:02x}" for v in row] for row in state],
    }]

    for rnd in range(nr - 1, 0, -1):
        _inv_shift_rows(state)
        _inv_sub_bytes(state)
        _add_round_key(state, round_keys[rnd])
        _inv_mix_columns(state)
        round_states.append({
            "round": nr - rnd,
            "name": f"Decryption round {nr - rnd}: InvShiftRows, InvSubBytes, "
                    f"AddRoundKey, InvMixColumns",
            "state": _state_to_hex(state),
            "state_matrix": [[f"{v:02x}" for v in row] for row in state],
        })

    _inv_shift_rows(state)
    _inv_sub_bytes(state)
    _add_round_key(state, round_keys[0])
    round_states.append({
        "round": nr,
        "name": f"Final decryption round {nr}",
        "state": _state_to_hex(state),
        "state_matrix": [[f"{v:02x}" for v in row] for row in state],
    })
    return _state_to_bytes(state), round_keys, round_states


# ---------------------------------------------------------------------------
# Public API.
# ---------------------------------------------------------------------------


def _validate(key_hex: str, block_hex: str) -> tuple:
    key = _parse_hex(key_hex, "Key")
    if len(key) not in (16, 24, 32):
        raise ValidationError(
            "AES key size must be 128, 192 or 256 bits (16, 24 or 32 bytes)",
            "invalid_key",
        )
    block = _parse_hex(block_hex, "Block")
    if len(block) != 16:
        raise ValidationError("AES block must be exactly 128 bits (32 hex digits)",
                              "invalid_block")
    return key, block


def encrypt(hex_block: str, hex_key: str) -> dict:
    key, block = _validate(hex_key, hex_block)
    nk = len(key) // 4
    nr = ROUNDS[len(key)]
    ciphertext, round_keys, round_states = _aes_encrypt_block(block, key)
    result_hex = _hex_pairs(ciphertext.hex())

    round_key_list = [
        {"round": r, "hex": "".join(f"{b:02x}" for w in round_keys[r] for b in w)}
        for r in range(nr + 1)
    ]

    steps = [
        step(1, "Key expansion",
             f"The {len(key) * 8}-bit key (Nk = {nk}) is expanded into "
             f"{nr + 1} round keys of 128 bits each.",
             hex_key, f"{nr + 1} round keys",
             {"round_keys": round_key_list, "nk": nk, "rounds": nr}),
        step(2, "Initial AddRoundKey",
             "The 128-bit plaintext block is placed column-major in the 4×4 "
             "state matrix and XORed with round key 0.",
             block.hex(), "state after round 0",
             {"state": round_states[0]["state_matrix"], "hex": round_states[0]["state"]}),
        step(3, "%d main rounds" % (nr - 1),
             "Each round applies SubBytes (S-box), ShiftRows (row rotation), "
             "MixColumns (GF(2⁸) multiplication) and AddRoundKey.",
             "", "", {"rounds": round_states[1:-1]}),
        step(4, "Final round",
             "The final round omits MixColumns: SubBytes, ShiftRows and "
             "AddRoundKey produce the ciphertext block.",
             "", ciphertext.hex(), {"state": round_states[-1]["state_matrix"]}),
    ]
    return build_result("aes", "encrypt", hex_block, {"key": hex_key},
                        result_hex, steps,
                        {"result": result_hex, "block_size": 128,
                         "key_size": len(key) * 8, "rounds": nr,
                         "round_states": round_states,
                         "round_keys": round_key_list,
                         "security_note": "AES is the recommended symmetric cipher."})


def decrypt(hex_block: str, hex_key: str) -> dict:
    key, block = _validate(hex_key, hex_block)
    nr = ROUNDS[len(key)]
    plaintext, round_keys, round_states = _aes_decrypt_block(block, key)
    result_hex = _hex_pairs(plaintext.hex())
    steps = [
        step(1, "Reverse key schedule",
             "Decryption performs the round functions in reverse, with "
             "inverse S-box and inverse shift rows.",
             hex_key, f"{nr + 1} round keys", {}),
        step(2, "Initial AddRoundKey with the last key",
             "The ciphertext state is XORed with round key number %d." % nr,
             block.hex(), "state", {"state": round_states[0]["state_matrix"]}),
        step(3, "Inverse rounds",
             "InvShiftRows, InvSubBytes, AddRoundKey and InvMixColumns are "
             "applied for each round in reverse order.",
             "", plaintext.hex(), {"rounds": round_states}),
    ]
    return build_result("aes", "decrypt", hex_block, {"key": hex_key},
                        result_hex, steps,
                        {"result": result_hex, "block_size": 128,
                         "key_size": len(key) * 8, "rounds": nr,
                         "round_states": round_states})


def get_metadata() -> dict:
    return METADATA


# Optional public helpers for tests.
def gf2_mul(a: int, b: int) -> int:
    return _gf2_mul(a, b)


def key_expansion_words(key_hex: str) -> List[List[int]]:
    return _key_expansion(_parse_hex(key_hex, "Key"), len(bytes.fromhex(key_hex)) // 4)
