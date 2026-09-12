"""ChaCha20-Poly1305 Authenticated Encryption educational simulator.

ChaCha20-Poly1305 (RFC 8439 §2.8) is an AEAD construction that combines
the ChaCha20 stream cipher (confidentiality) with the Poly1305 one-time
authenticator (integrity + authentication tag). It is used by TLS 1.3.

The cryptography library's ChaCha20Poly1305 is used for the real
computation. On failed authentication the decrypt returns NO plaintext.
"""

from __future__ import annotations

from base64 import b64encode
from typing import Optional

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import (
    ChaCha20Poly1305 as _ChaCha20Poly1305,
)

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "chacha20_poly1305",
    "name": "ChaCha20-Poly1305",
    "category": "aead",
    "security_status": "secure",
    "reversible": True,
    "key_kind": "256-bit key + 96-bit nonce",
    "block_size": "stream cipher / 128-bit tag",
    "description": (
        "ChaCha20-Poly1305 is an Authenticated Encryption (AEAD) scheme: "
        "the ChaCha20 stream cipher provides confidentiality while the "
        "Poly1305 authenticator produces a 128-bit tag proving integrity "
        "and origin. AAD is authenticated but not encrypted. The nonce "
        "must NEVER be reused under the same key."
    ),
}


def _parse_hex(value: str, label: str, bytes_len: Optional[int] = None) -> bytes:
    try:
        raw = bytes.fromhex(value)
    except ValueError as exc:
        raise ValidationError(f"{label} must be valid hexadecimal",
                              "invalid_hex") from exc
    if bytes_len is not None and len(raw) != bytes_len:
        raise ValidationError(f"{label} must be exactly {bytes_len} bytes",
                             "invalid_length")
    return raw


def encrypt(plaintext: str, key_hex: str, nonce_hex: str,
            aad: str = "") -> dict:
    if plaintext is None:
        raise ValidationError("Plaintext is required", "missing_input")
    key = _parse_hex(key_hex, "Key")
    if len(key) != 32:
        raise ValidationError(
            "ChaCha20-Poly1305 key must be 256 bits (32 bytes / 64 hex)",
            "invalid_key")
    nonce = _parse_hex(nonce_hex, "Nonce")
    if len(nonce) != 12:
        raise ValidationError(
            "ChaCha20-Poly1305 nonce must be 96 bits (12 bytes / 24 hex)",
            "invalid_nonce")

    pt_bytes = plaintext.encode("utf-8")
    aad_bytes = aad.encode("utf-8") if aad else b""
    chacha = _ChaCha20Poly1305(key)
    ct = chacha.encrypt(nonce, pt_bytes, aad_bytes)
    ciphertext = ct[:-16]
    tag = ct[-16:]

    steps = [
        step(1, "Set up ChaCha20-Poly1305",
             "The 256-bit key and the 96-bit nonce initialize the "
             "construction (RFC 8439). Nonce reuse under the same key is "
             "catastrophic.",
             f"key = <256-bit hidden>, nonce = {nonce.hex()}",
             "ChaCha20 + Poly1305 context",
             {"key_size": 256, "nonce_hex": nonce.hex()}),
        step(2, "Encrypt with ChaCha20",
             "The ChaCha20 keystream is XORed with the plaintext to produce "
             "the ciphertext (RFC 8439 section 2.4).",
             f"{len(pt_bytes)} plaintext bytes", ciphertext.hex(),
             {"ciphertext_hex": ciphertext.hex(),
              "plaintext_length": len(pt_bytes)}),
        step(3, "Compute the Poly1305 tag",
             "Poly1305 authenticates the ciphertext and the AAD, producing "
             "a 128-bit tag. AAD is authenticated but NOT encrypted.",
             f"aad = {aad_bytes.hex()!r}" if aad_bytes else "no AAD",
             f"tag = {tag.hex()}",
             {"tag_hex": tag.hex(), "aad_hex": aad_bytes.hex(),
              "has_aad": bool(aad_bytes)}),
    ]

    return build_result(
        "chacha20_poly1305", "encrypt", plaintext,
        {"key": "<256-bit hidden>", "nonce": nonce.hex()},
        {"ciphertext": ciphertext.hex() + tag.hex()}, steps,
        {
            "ciphertext_hex": ciphertext.hex(),
            "tag_hex": tag.hex(),
            "combined_hex": (ciphertext + tag).hex(),
            "combined_base64": b64encode(ciphertext + tag).decode("ascii"),
            "nonce_hex": nonce.hex(),
            "aad_hex": aad_bytes.hex(),
            "aead_note": (
                "ChaCha20-Poly1305 is Authenticated Encryption (AEAD). On "
                "decryption, if the tag does not match, NO plaintext is "
                "returned — the data is rejected."
            ),
        })


def decrypt(ciphertext_hex: str, key_hex: str, nonce_hex: str,
            aad: str = "") -> dict:
    if not ciphertext_hex:
        raise ValidationError("Ciphertext is required", "missing_input")
    key = _parse_hex(key_hex, "Key")
    if len(key) != 32:
        raise ValidationError(
            "ChaCha20-Poly1305 key must be 256 bits (32 bytes / 64 hex)",
            "invalid_key")
    nonce = _parse_hex(nonce_hex, "Nonce")
    if len(nonce) != 12:
        raise ValidationError(
            "ChaCha20-Poly1305 nonce must be 96 bits (12 bytes / 24 hex)",
            "invalid_nonce")
    try:
        ct_bytes = bytes.fromhex(ciphertext_hex)
    except ValueError as exc:
        raise ValidationError("Ciphertext must be valid hexadecimal",
                              "invalid_hex") from exc
    if len(ct_bytes) < 16:
        raise ValidationError(
            "Ciphertext must include the 16-byte tag (≥ 32 hex digits)",
            "invalid_ciphertext")

    aad_bytes = aad.encode("utf-8") if aad else b""
    chacha = _ChaCha20Poly1305(key)
    try:
        pt = chacha.decrypt(nonce, ct_bytes, aad_bytes)
    except InvalidTag:
        raise ValidationError(
            "AUTHENTICATION FAILED: the ciphertext, tag or AAD was modified, "
            "or the key/nonce is wrong. No plaintext is returned.",
            "authentication_failed",
        ) from None

    try:
        plain = pt.decode("utf-8")
    except UnicodeDecodeError:
        plain = pt.hex()

    return build_result(
        "chacha20_poly1305", "decrypt", ciphertext_hex,
        {"key": "<256-bit hidden>", "nonce": nonce.hex()},
        plain, [],
        {
            "plaintext": plain,
            "plaintext_hex": pt.hex(),
            "authentication": "PASS",
            "aead_note": (
                "The Poly1305 tag was verified successfully before any "
                "plaintext was returned."
            ),
        })


def get_metadata() -> dict:
    return METADATA
