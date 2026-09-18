"""Camellia educational simulator.

Camellia is a 128-bit block cipher with a Feistel structure designed by
Mitsuru Matsui et al. (NTT and Mitsubishi, 2000). It was selected as a
CRYPTREC and NESSIE recommended cipher and is standardized in RFC 3713 and
ISO/IEC 18033-3; it is used in TLS (RFC 5932/6367) and some Japanese
e-Government systems. Like AES it supports 128/192/256-bit keys.

This module exposes only the raw block cipher (one 128-bit block at a time).
A mode of operation (CBC/CTR/GCM) is required to process messages longer
than one block and is deliberately not implemented here.

The real permutation is computed by the ``cryptography`` library.
"""

from __future__ import annotations

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "camellia",
    "name": "Camellia",
    "category": "symmetric",
    "security_status": "secure",
    "reversible": True,
    "key_kind": "128 / 192 / 256 bits (hex)",
    "block_size": "128 bits",
    "description": (
        "Camellia is a 128-bit Feistel block cipher (RFC 3713) with "
        "128/192/256-bit keys and 18 or 24 rounds. Recommended by NESSIE and "
        "CRYPTREC and used in TLS; it is a peer of AES rather than a "
        "replacement. Only a single block is shown here."
    ),
    "formula": "Feistel network: F = S-boxes (S1..S4) then P: (y1..y8) ⊕= y1 | F",
}

BLOCK_BYTES = 16


def _parse_hex(value: str, label: str) -> bytes:
    try:
        return bytes.fromhex("".join(str(value).split()))
    except (ValueError, AttributeError) as exc:
        raise ValidationError(f"{label} must be valid hexadecimal",
                              "invalid_hex") from exc


def _block(hex_block: str) -> bytes:
    block = _parse_hex(hex_block, "Block")
    if len(block) != BLOCK_BYTES:
        raise ValidationError(
            "Camellia block must be exactly 128 bits (32 hex digits)",
            "invalid_block")
    return block


def _key(hex_key: str) -> bytes:
    key = _parse_hex(hex_key, "Key")
    if len(key) not in (16, 24, 32):
        raise ValidationError(
            "Camellia key must be 128, 192 or 256 bits (16/24/32 bytes)",
            "invalid_key")
    return key


def _rounds(key: bytes) -> int:
    return 18 if len(key) == 16 else 24


def _permute(block: bytes, key: bytes, encrypting: bool) -> bytes:
    cipher = Cipher(algorithms.Camellia(key), modes.ECB())
    transform = cipher.encryptor() if encrypting else cipher.decryptor()
    return transform.update(block) + transform.finalize()


def encrypt(hex_block: str, hex_key: str) -> dict:
    block = _block(hex_block)
    key = _key(hex_key)
    output = _permute(block, key, True)
    rounds = _rounds(key)

    steps = [
        step(1, "Load the block and key",
             "Camellia processes one 128-bit block. The %d-bit key determines "
             "the number of rounds." % (len(key) * 8),
             f"block = {block.hex()}", f"{rounds} rounds",
             {"key_size": len(key) * 8, "rounds": rounds}),
        step(2, "Key schedule (KL, KA)",
             "The key schedule derives two 128-bit subkeys KL and KA via "
             "rotations and constant XORs, then produces the round subkeys.",
             f"{len(key) * 8}-bit key", "round subkeys derived",
             {"subkeys": ["KL", "KA"]}),
        step(3, "Feistel rounds",
             "Each round applies the SP-function F (four S-boxes S1..S4 "
             "followed by the linear layer P) and the FL/FL⁻¹ functions at "
             "fixed positions.",
             block.hex(), output.hex(),
             {"rounds": rounds, "F": "S1..S4 then P"}),
        step(4, "Output the cipher block",
             "The two halves are combined into the 128-bit ciphertext block.",
             "L16 ‖ R16", output.hex(),
             {"ciphertext_block": output.hex()}),
    ]

    return build_result("camellia", "encrypt", hex_block, {"key": "<hidden>"},
                        output.hex(), steps,
                        {"ciphertext_block": output.hex(),
                         "key_size": len(key) * 8, "rounds": rounds})


def decrypt(hex_block: str, hex_key: str) -> dict:
    block = _block(hex_block)
    key = _key(hex_key)
    output = _permute(block, key, False)
    rounds = _rounds(key)
    return build_result("camellia", "decrypt", hex_block, {"key": "<hidden>"},
                        output.hex(), [], {"plaintext_block": output.hex(),
                                           "key_size": len(key) * 8,
                                           "rounds": rounds})


def get_metadata() -> dict:
    return METADATA
