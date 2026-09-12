"""Educational ChaCha20 stream-cipher simulator (IETF / RFC 8439).

Faithful implementation of the ChaCha20 stream cipher as standardized in
RFC 8439:

  * 256-bit key + 96-bit nonce + 32-bit block counter
  * 16-word 32-bit state: constants, key, counter, nonce
  * quarter round (add/mod 2^32, XOR, rotation)
  * 20 rounds = 10 double rounds (column + diagonal)
  * keystream = working state added to the initial state
  * ciphertext = plaintext XOR keystream (identical for encryption/decryption)

ChaCha20 is the modern, hardware-friendly stream cipher used by TLS 1.3
and the AEAD construction ChaCha20-Poly1305.
"""

from __future__ import annotations

from typing import List, Tuple

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "chacha20",
    "name": "ChaCha20",
    "category": "symmetric",
    "security_status": "secure",
    "reversible": True,
    "key_kind": "256-bit key (32 bytes hex) + 96-bit nonce (12 bytes hex)",
    "block_size": "stream cipher (64-byte keystream blocks)",
    "description": (
        "A modern stream cipher standardized in RFC 8439. It generates a "
        "pseudorandom keystream from a 256-bit key, a 96-bit nonce and a "
        "counter; the keystream is XORed with the plaintext. TLS 1.3 uses "
        "it in the ChaCha20-Poly1305 AEAD construction."
    ),
}

CONSTANTS = "expand 32-byte k"
# Little-endian 32-bit words of the ASCII constant "expand 32-byte k".
CONSTANT_WORDS = [0x61707865, 0x3320646E, 0x79622D32, 0x6B206574]
WORD_MASK = 0xFFFFFFFF


# ---------------------------------------------------------------------------
# Core 32-bit helpers.
# ---------------------------------------------------------------------------


def _rotl(value: int, shift: int) -> int:
    """Circular left rotation of a 32-bit word."""
    return ((value << shift) | (value >> (32 - shift))) & WORD_MASK


def _to_words(data: bytes) -> List[int]:
    """Little-endian bytes → list of 32-bit words."""
    return [
        int.from_bytes(data[i:i + 4], "little")
        for i in range(0, len(data), 4)
    ]


def _from_words(words: List[int]) -> bytes:
    """List of 32-bit words → little-endian bytes."""
    return b"".join(w.to_bytes(4, "little") for w in words)


def _parse_hex(value: str, label: str) -> bytes:
    try:
        return bytes.fromhex(value)
    except ValueError as exc:
        raise ValidationError(f"{label} must be valid hexadecimal", "invalid_hex") from exc


def _hex_pairs(hex_str: str) -> str:
    hex_str = hex_str.lower()
    return " ".join(hex_str[i:i + 2] for i in range(0, len(hex_str), 2))


# ---------------------------------------------------------------------------
# Quarter round and round functions.
# ---------------------------------------------------------------------------


def quarter_round(state: List[int], a: int, b: int, c: int, d: int) -> None:
    """Apply the ChaCha20 quarter round to state words a, b, c, d."""
    state[a] = (state[a] + state[b]) & WORD_MASK
    state[d] = _rotl(state[d] ^ state[a], 16)
    state[c] = (state[c] + state[d]) & WORD_MASK
    state[b] = _rotl(state[b] ^ state[c], 12)
    state[a] = (state[a] + state[b]) & WORD_MASK
    state[d] = _rotl(state[d] ^ state[a], 8)
    state[c] = (state[c] + state[d]) & WORD_MASK
    state[b] = _rotl(state[b] ^ state[c], 7)


def _column_round(state: List[int]) -> None:
    for a, b, c, d in ((0, 4, 8, 12), (1, 5, 9, 13), (2, 6, 10, 14), (3, 7, 11, 15)):
        quarter_round(state, a, b, c, d)


def _diagonal_round(state: List[int]) -> None:
    for a, b, c, d in ((0, 5, 10, 15), (1, 6, 11, 12), (2, 7, 8, 13), (3, 4, 9, 14)):
        quarter_round(state, a, b, c, d)


def _double_round(state: List[int]) -> None:
    """10 double rounds = 20 total rounds."""
    _column_round(state)
    _diagonal_round(state)


# ---------------------------------------------------------------------------
# State construction and keystream.
# ---------------------------------------------------------------------------


def _initial_state(hex_key: str, hex_nonce: str, counter: int) -> List[int]:
    key = _parse_hex(hex_key, "Key")
    nonce = _parse_hex(hex_nonce, "Nonce")
    if len(key) != 32:
        raise ValidationError(
            "ChaCha20 key must be 256 bits (64 hex digits)", "invalid_key"
        )
    if len(nonce) != 12:
        raise ValidationError(
            "ChaCha20 nonce must be 96 bits (24 hex digits)", "invalid_nonce"
        )
    if not 0 <= counter <= WORD_MASK:
        raise ValidationError(
            "ChaCha20 counter must be a 32-bit unsigned integer", "invalid_counter"
        )
    key_words = _to_words(key)
    nonce_words = _to_words(nonce)
    return CONSTANT_WORDS + key_words + [counter & WORD_MASK, *nonce_words]


def chacha_block(hex_key: str, hex_nonce: str, counter: int) -> Tuple[List[int], List[int]]:
    """Generate one 64-byte keystream block.

    Returns (working_state_after_20_rounds, keystream_words).
    """
    init = _initial_state(hex_key, hex_nonce, counter)
    working = list(init)
    round_states: List[dict] = []
    for rnd in range(1, 11):
        _double_round(working)
        round_states.append({
            "round": rnd * 2,
            "words": [f"{w:08x}" for w in working],
        })
    keystream = [(init[i] + working[i]) & WORD_MASK for i in range(16)]
    return working, keystream


def keystream_of(hex_key: str, hex_nonce: str, counter: int,
                 length: int) -> bytes:
    """Produce `length` bytes of keystream (one 64-byte block per counter)."""
    out = bytearray()
    for block in range(length // 64 + 1):
        _, words = chacha_block(hex_key, hex_nonce, counter + block)
        out += _from_words(words)
    return bytes(out[:length])


# ---------------------------------------------------------------------------
# Public API.
# ---------------------------------------------------------------------------


def _run(message: bytes, hex_key: str, hex_nonce: str, counter: int,
         operation: str) -> dict:
    key = _parse_hex(hex_key, "Key")
    nonce = _parse_hex(hex_nonce, "Nonce")
    if len(key) != 32:
        raise ValidationError(
            "ChaCha20 key must be 256 bits (64 hex digits)", "invalid_key"
        )
    if len(nonce) != 12:
        raise ValidationError(
            "ChaCha20 nonce must be 96 bits (24 hex digits)", "invalid_nonce"
        )
    if not 0 <= counter <= WORD_MASK:
        raise ValidationError(
            "ChaCha20 counter must be a 32-bit unsigned integer", "invalid_counter"
        )

    init = _initial_state(hex_key, hex_nonce, counter)
    # Steps capture at most the first 64-byte block for legibility.
    keystream_parts = b""
    plain_parts = b""
    cipher_parts = b""
    working_state = None
    block_states = []
    produced = 0
    idx = 0
    while produced < len(message):
        working, words = chacha_block(hex_key, hex_nonce, counter + idx)
        if idx == 0:
            working_state = working
        ks = _from_words(words)
        chunk = message[produced:produced + 64]
        xored = bytes(a ^ b for a, b in zip(chunk, ks))
        keystream_parts += ks
        if operation == "encrypt":
            cipher_parts += xored
            plain_parts += chunk
        else:
            plain_parts += xored
            cipher_parts += chunk
        block_states.append({
            "block": idx, "counter": counter + idx,
            "keystream": ks.hex(),
        })
        produced += 64
        idx += 1

    result_hex = (cipher_parts if operation == "encrypt" else plain_parts).hex()
    result_pairs = _hex_pairs(result_hex)

    steps = [
        step(1, "Initial state",
             "The 16-word state is assembled from four constants, the 256-bit "
             "key (8 words), the 32-bit counter and the 96-bit nonce (3 words).",
             f"key = {hex_key}\nnonce = {hex_nonce}\ncounter = {counter}",
             "16 words × 32 bits",
             {"state": [f"{w:08x}" for w in init]}),
        step(2, "Quarter round",
             "The core operation: two 32-bit additions mod 2^32 and two XORs "
             "with rotations by 16, 12, 8 and 7. Example: quarter_round applied "
             "to state words 0, 4, 8, 12.",
             "state[0], state[4], state[8], state[12]",
             "4 updated words",
             {"rotation_shifts": [16, 12, 8, 7],
              "add_mod_2_32": "yes", "xor": "yes"}),
        step(3, "Double round",
             "One double round = one column round (4 quarter rounds) followed "
             "by one diagonal round (4 quarter rounds).",
             "words 0-15", "words 0-15 permuted via 8 quarter rounds",
             {"column_round": "(0,4,8,12) (1,5,9,13) (2,6,10,14) (3,7,11,15)",
              "diagonal_round": "(0,5,10,15) (1,6,11,12) (2,7,8,13) (3,4,9,14)"}),
        step(4, "20 rounds (10 double rounds)",
             "The double round is repeated 10 times, giving 20 rounds of "
             "diffusion over the whole state.",
             "initial state", "working state after 20 rounds",
             {"round_states": block_states[:1] or [],
              "final_state": [f"{w:08x}" for w in (working_state or [])]}),
        step(5, "Keystream block",
             "The keystream word k = working word + initial word (mod 2^32). "
             "Each 64-byte keystream block is XORed onto 64 bytes of data.",
             "initial state + working state", "64-byte keystream block",
             {"keystream_hex": keystream_parts[:64].hex()}),
        step(6, "XOR with data",
             "Stream XOR: ciphertext = plaintext XOR keystream (encrypt) or "
             "plaintext = ciphertext XOR keystream (decrypt). The identical "
             "operation makes ChaCha20 symmetric.",
             "data length: %d bytes" % len(message),
             "processed %d block(s)" % idx,
             {"keystream_hex": keystream_parts.hex(),
              "plain_hex": plain_parts.hex(),
              "cipher_hex": cipher_parts.hex(),
              "blocks": block_states}),
    ]

    extra = {
        "key_hex": hex_key.lower(),
        "nonce_hex": hex_nonce.lower(),
        "counter": counter,
        "initial_state": [f"{w:08x}" for w in init],
        "keystream_hex": keystream_parts.hex(),
        "plaintext_hex": plain_parts.hex(),
        "ciphertext_hex": cipher_parts.hex(),
        "blocks": block_states,
        "stream_cipher": True,
        "security_note": (
            "ChaCha20 is a modern stream cipher (RFC 8439). It MUST be used "
            "with a unique nonce per key; the same key+nonce pair must never "
            "be reused."
        ),
    }
    return build_result("chacha20", operation, message.hex(), {"key": hex_key}, result_pairs, steps, extra)


def encrypt(message: str, hex_key: str, hex_nonce: str, counter: int = 1) -> dict:
    """Encrypt a UTF-8 plaintext: result is space-separated hex ciphertext."""
    return _run(message.encode("utf-8"), hex_key, hex_nonce, counter, "encrypt")


def decrypt(message_hex: str, hex_key: str, hex_nonce: str, counter: int = 1) -> dict:
    """Decrypt a hex ciphertext, recovering the plaintext bytes."""
    try:
        cipher_bytes = bytes.fromhex(message_hex)
    except ValueError:
        raise ValidationError(
            "Ciphertext must be valid hexadecimal", "invalid_hex"
        ) from None
    result = _run(cipher_bytes, hex_key, hex_nonce, counter, "decrypt")
    plain = bytes.fromhex(result["extra"]["plaintext_hex"])
    try:
        result["result"] = plain.decode("utf-8")
    except UnicodeDecodeError:
        # Keep the hex representation for non-UTF-8 plaintexts.
        result["result"] = result["extra"]["plaintext_hex"]
    return result


def get_metadata() -> dict:
    return METADATA