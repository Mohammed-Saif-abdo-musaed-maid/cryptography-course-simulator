"""CMAC (Cipher-based MAC) educational simulator.

CMAC (NIST SP 800-38B, RFC 4493) is a message authentication code built from
a block cipher. It is the modern replacement for CBC-MAC: two secret subkeys
K1 and K2 are derived from the cipher key and used to mask the final block,
which fixes CBC-MAC's length-extension weaknesses. This module uses
AES-CMAC, the most common instantiation.

It authenticates data with a shared symmetric key; it is not a digital
signature and does not encrypt.
"""

from __future__ import annotations

import math
from base64 import b64decode, b64encode

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import cmac
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "cmac",
    "name": "CMAC",
    "category": "mac",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "128 / 192 / 256-bit AES key (hex)",
    "block_size": "128 bits (AES)",
    "description": (
        "CMAC (NIST SP 800-38B) is a block-cipher-based MAC. It derives "
        "subkeys K1/K2 and applies CBC-MAC with a masked final block, "
        "avoiding the length-extension flaws of plain CBC-MAC. It proves "
        "integrity and authenticity with a shared key."
    ),
    "formula": "M_last ⊕ K1/K2 → CBC-MAC → tag (AES: 128 bits)",
}

BLOCK_BYTES = 16
RB = 0x87  # GF(2^128) reduction constant for AES-128 blocks.


def _aes_ecb_block(key: bytes, block: bytes) -> bytes:
    return Cipher(algorithms.AES(key), modes.ECB()).encryptor().update(block)


def _cmac_trace(key: bytes, data: bytes) -> dict:
    """Real CMAC internals (NIST SP 800-38B) replayed with the AES primitive.

    Subkeys K1/K2 come from a genuine AES-ECB call on 0^128 and the GF(2^128)
    doubling rules; every MAC state is E_K(prev ⊕ block). The final state must
    equal the MAC produced by the ``cmac`` library — the fidelity tests assert
    exactly that.
    """
    l = _aes_ecb_block(key, b"\x00" * BLOCK_BYTES)

    def dbl(block: bytes, rb: int) -> bytes:
        n = int.from_bytes(block, "big")
        shifted = (n << 1) & ((1 << (BLOCK_BYTES * 8)) - 1)
        if n >> (BLOCK_BYTES * 8 - 1):
            shifted ^= rb
        return shifted.to_bytes(BLOCK_BYTES, "big")

    k1 = dbl(l, RB)
    k2 = dbl(k1, RB)

    blocks = [data[i:i + BLOCK_BYTES] for i in range(0, len(data), BLOCK_BYTES)]
    if not blocks:
        blocks = [b""]
    full = blocks[:-1]
    last = blocks[-1]
    if len(last) == BLOCK_BYTES:
        mask_name = "K1"
        last_masked = bytes(a ^ b for a, b in zip(last, k1))
    else:
        padded_last = last + b"\x80" + b"\x00" * (BLOCK_BYTES - len(last) - 1)
        mask_name = "K2"
        last_masked = bytes(a ^ b for a, b in zip(padded_last, k2))

    state = b"\x00" * BLOCK_BYTES
    states: list[str] = []
    for block in full:
        state = _aes_ecb_block(key, bytes(a ^ b for a, b in zip(state, block)))
        states.append(state.hex())
    final_state = _aes_ecb_block(
        key, bytes(a ^ b for a, b in zip(state, last_masked)))
    states.append(final_state.hex())

    return {
        "l_hex": l.hex(),
        "k1_hex": k1.hex(),
        "k2_hex": k2.hex(),
        "mask": mask_name,
        "block_count": len(blocks),
        "state_before_final": state.hex(),
        "final_block_hex": last_masked.hex(),
        "mac_states": states,
        "tag_hex": final_state.hex(),
    }


def _key(key_hex: str) -> bytes:
    try:
        key = bytes.fromhex("".join(str(key_hex).split()))
    except (ValueError, AttributeError) as exc:
        raise ValidationError("Key must be valid hexadecimal",
                              "invalid_hex") from exc
    if len(key) not in (16, 24, 32):
        raise ValidationError(
            "CMAC-AES key must be 128, 192 or 256 bits (16/24/32 bytes)",
            "invalid_key")
    return key


def _encode(tag: bytes, output_format: str) -> str:
    if output_format == "base64":
        return b64encode(tag).decode("ascii")
    return tag.hex()


def sign(message: str, key_hex: str, output_format: str = "hex") -> dict:
    if message is None or message == "":
        raise ValidationError("Message is required", "missing_input")
    if output_format not in ("hex", "base64"):
        raise ValidationError("Output encoding must be 'hex' or 'base64'",
                              "invalid_encoding")
    key = _key(key_hex)
    data = message.encode("utf-8")
    mac = cmac.CMAC(algorithms.AES(key))
    mac.update(data)
    tag = mac.finalize()
    output = _encode(tag, output_format)
    trace = _cmac_trace(key, data)
    trace["trace_match"] = trace["tag_hex"] == tag.hex()
    block_count = trace["block_count"]

    steps = [
        step(1, "Set up AES and derive subkeys",
             "CMAC runs AES in CBC-MAC mode. Two subkeys K1 and K2 are "
             "derived from the AES key by doubling in GF(2^128).",
             f"key = <{len(key) * 8}-bit hidden>", "K1, K2 derived",
             {"key_size": len(key) * 8,
              "subkeys": {"K1": trace["k1_hex"], "K2": trace["k2_hex"]},
              "l_hex": trace["l_hex"]}),
        step(2, "Process full blocks",
             "The message is split into 16-byte blocks and chained through "
             "AES: Xᵢ = E_K(Xᵢ₋₁ ⊕ Mᵢ).",
             f"{len(data)} bytes",
             f"{block_count} block(s)",
             {"block_count": block_count,
              "mac_states": trace["mac_states"]}),
        step(3, "Mask the final block",
             "A complete final block is XORed with K1 (an incomplete one is "
             "padded with 0x80‖0 and XORed with K2) before the last AES call.",
             "last block", "masked final block",
             {"mask": trace["mask"],
              "state_before_final": trace["state_before_final"],
              "final_block_hex": trace["final_block_hex"]}),
        step(4, "Output the tag",
             "The final AES output is the CMAC tag (128 bits for AES).",
             "final state", output,
             {"tag_hex": tag.hex(), "tag_size": len(tag),
              "trace_match": trace["trace_match"]}),
    ]

    return build_result(
        "cmac", "sign", message,
        {"key": f"<{len(key) * 8}-bit hidden>", "output_format": output_format},
        output, steps,
        {"mac": output, "mac_hex": tag.hex(), "output_format": output_format,
         "mac_size": len(tag), "key_size": len(key) * 8,
         "k1_hex": trace["k1_hex"], "k2_hex": trace["k2_hex"],
         "l_hex": trace["l_hex"], "mask": trace["mask"],
         "block_count": block_count,
         "state_before_final": trace["state_before_final"],
         "final_block_hex": trace["final_block_hex"],
         "mac_states": trace["mac_states"],
         "trace_match": trace["trace_match"],
         "not_encryption_note": (
             "CMAC authenticates a message but does NOT hide its content."
         )},
    )


def verify(message: str, key_hex: str, mac: str, output_format: str = "hex") -> dict:
    if not mac:
        raise ValidationError("MAC value is required for verification",
                              "missing_mac")
    key = _key(key_hex)
    data = message.encode("utf-8")
    computed = cmac.CMAC(algorithms.AES(key))
    computed.update(data)
    try:
        expected = (b64decode(mac.encode("ascii")) if output_format == "base64"
                    else bytes.fromhex("".join(mac.split())))
        computed.verify(expected)
        valid = True
    except (InvalidSignature, ValueError):
        valid = False
    return build_result(
        "cmac", "verify", message, {"key": f"<{len(key) * 8}-bit hidden>"},
        valid, [], {"valid": valid, "result": "VALID" if valid else "INVALID"},
    )


def get_metadata() -> dict:
    return METADATA
