"""Poly1305 one-time authenticator educational simulator.

Poly1305 is a fast universal-hash message authentication code designed by
Daniel J. Bernstein. It evaluates a polynomial modulo the prime 2¹³⁰ − 5
using a 256-bit key split into a 128-bit "r" and a 128-bit "s". It is
extremely fast in software and is used together with ChaCha20 in the AEAD
ChaCha20-Poly1305 (RFC 8439) and with XChaCha20.

CRITICAL: Poly1305 is a ONE-TIME authenticator. The (r, s) key must NEVER be
reused for two different messages; RFC 8439 derives a fresh key per message.
Here we expose the raw primitive for study.

The real computation uses the ``cryptography`` library's Poly1305.
"""

from __future__ import annotations

import warnings
from base64 import b64decode, b64encode

from cryptography.exceptions import InvalidSignature

with warnings.catch_warnings():
    warnings.simplefilter("ignore", DeprecationWarning)
    from cryptography.hazmat.primitives import poly1305

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "poly1305",
    "name": "Poly1305",
    "category": "mac",
    "security_status": "secure_with_auth",
    "reversible": False,
    "key_kind": "256-bit one-time key (32 bytes hex = r ‖ s)",
    "block_size": "16-byte message blocks",
    "description": (
        "Poly1305 is a one-time message authenticator built on polynomial "
        "evaluation mod 2¹³⁰ − 5. It is used inside ChaCha20-Poly1305 "
        "(RFC 8439). The 32-byte key must be unique per message — reusing it "
        "breaks security completely."
    ),
    "formula": "tag = ((Σ (mᵢ + 2¹²⁸)·rⁱ mod 2¹³⁰−5) + s) mod 2¹²⁸",
}

KEY_BYTES = 32
TAG_BYTES = 16
BLOCK_BYTES = 16
PRIME = (1 << 130) - 5
CLAMP_MASK = 0x0FFFFFFC0FFFFFFC0FFFFFFC0FFFFFFF


def _key(key_hex: str) -> bytes:
    try:
        key = bytes.fromhex("".join(str(key_hex).split()))
    except (ValueError, AttributeError) as exc:
        raise ValidationError("Key must be valid hexadecimal",
                              "invalid_hex") from exc
    if len(key) != KEY_BYTES:
        raise ValidationError(
            "Poly1305 requires a 256-bit (32-byte / 64 hex digit) key",
            "invalid_key")
    return key


def _encode(tag: bytes, output_format: str) -> str:
    if output_format == "base64":
        return b64encode(tag).decode("ascii")
    return tag.hex()


def _poly1305_trace(data: bytes, key: bytes) -> dict:
    """Real Poly1305 polynomial evaluation mod 2¹³⁰ − 5 (RFC 8439 §2.5).

    The accumulator chain is exactly the arithmetic the ``cryptography``
    library performs; the trailing (acc + s) mod 2¹²⁸ must equal the library
    tag — the fidelity tests assert that equality.
    """
    r = int.from_bytes(key[:16], "little") & CLAMP_MASK
    s = int.from_bytes(key[16:32], "little")

    blocks = [data[i:i + BLOCK_BYTES] for i in range(0, len(data), BLOCK_BYTES)]
    if not blocks:
        blocks = [b""]

    acc = 0
    states: list[dict] = []
    for i, block in enumerate(blocks):
        block_rfc = block + b"\x01"
        acc = (acc + int.from_bytes(block_rfc, "little")) * r % PRIME
        states.append({
            "block": i + 1,
            "block_hex": block_rfc.hex(),
            "acc_truncated": (acc & ((1 << 128) - 1)).to_bytes(16, "little").hex(),
        })

    tag = (acc + s) % (1 << 128)
    return {
        "r_hex": key[:16].hex(),
        "s_hex": key[16:].hex(),
        "r_clamped_hex": r.to_bytes(16, "little").hex(),
        "accumulator_states": states,
        "acc_final_truncated": (acc & ((1 << 128) - 1)).to_bytes(16, "little").hex(),
        "tag_hex": tag.to_bytes(16, "little").hex(),
    }


def _compute(data: bytes, key: bytes) -> bytes:
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        mac = poly1305.Poly1305(key)
        mac.update(data)
        return mac.finalize()


def sign(message: str, key_hex: str, output_format: str = "hex") -> dict:
    if message is None or message == "":
        raise ValidationError("Message is required", "missing_input")
    if output_format not in ("hex", "base64"):
        raise ValidationError("Output encoding must be 'hex' or 'base64'",
                              "invalid_encoding")
    key = _key(key_hex)
    r, s = key[:16], key[16:]
    data = message.encode("utf-8")
    tag = _compute(data, key)
    output = _encode(tag, output_format)
    trace = _poly1305_trace(data, key)
    trace["trace_match"] = trace["tag_hex"] == tag.hex()
    block_count = len(trace["accumulator_states"])

    steps = [
        step(1, "Split the key",
             "The 32-byte key is split into r (first 16 bytes) and s (last 16 "
             "bytes). r is clamped to control the polynomial.",
             f"key = {key.hex()}", f"r = {r.hex()}, s = {s.hex()}",
             {"r_hex": r.hex(), "s_hex": s.hex(),
              "r_clamped_hex": trace["r_clamped_hex"]}),
        step(2, "Split the message into blocks",
             "The message is processed in 16-byte blocks; each block is "
             "interpreted as a little-endian integer with an extra 2¹²⁸ bit.",
             f"{len(data)} bytes", f"{block_count} block(s)",
             {"block_count": block_count}),
        step(3, "Polynomial evaluation mod 2¹³⁰−5",
             "An accumulator is updated as acc = (acc + block)·r mod (2¹³⁰−5) "
             "for every block.",
             "blocks + r", "accumulator",
             {"modulus": "2^130 - 5",
              "accumulator_states": trace["accumulator_states"],
              "acc_final_truncated": trace["acc_final_truncated"],
              "trace_match": trace["trace_match"]}),
        step(4, "Add s and truncate",
             "The final tag is (acc + s) mod 2¹²⁸, giving 16 bytes.",
             "acc + s", output, {"tag_hex": tag.hex(), "tag_size": len(tag)}),
    ]

    return build_result(
        "poly1305", "sign", message, {"key": "<256-bit one-time key hidden>",
                                      "output_format": output_format},
        output, steps,
        {"mac": output, "mac_hex": tag.hex(), "output_format": output_format,
         "mac_size": len(tag), "key_bytes": KEY_BYTES,
         "r_hex": r.hex(), "s_hex": s.hex(),
         "r_clamped_hex": trace["r_clamped_hex"],
         "accumulator_states": trace["accumulator_states"],
         "acc_final_truncated": trace["acc_final_truncated"],
         "block_count": block_count,
         "trace_match": trace["trace_match"],
         "one_time_warning": (
             "Poly1305 keys are ONE-TIME. Reusing a key for two messages "
             "allows forgery. RFC 8439 derives a fresh key per message."
         )},
    )


def verify(message: str, key_hex: str, mac: str, output_format: str = "hex") -> dict:
    if not mac:
        raise ValidationError("MAC value is required for verification",
                              "missing_mac")
    key = _key(key_hex)
    data = message.encode("utf-8")
    try:
        expected = (b64decode(mac.encode("ascii")) if output_format == "base64"
                    else bytes.fromhex("".join(mac.split())))
        valid = _compute(data, key) == expected
    except (ValueError, Exception):  # noqa: BLE001 - normalize any parse error
        valid = False
    return build_result(
        "poly1305", "verify", message, {"key": "<one-time key hidden>"},
        valid, [], {"valid": valid, "result": "VALID" if valid else "INVALID"},
    )


def get_metadata() -> dict:
    return METADATA
