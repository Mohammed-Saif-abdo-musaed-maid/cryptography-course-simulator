"""AES-GCM Authenticated Encryption educational simulator.

AES-GCM (Galois/Counter Mode) is an AEAD — Authenticated Encryption with
Associated Data. It simultaneously provides:
  * confidentiality (encryption via AES in counter mode)
  * integrity / authentication (authentication tag via GHASH over GF(2^128))
  * optional authenticity of cleartext "associated data" (AAD)

The cryptography library's AESGCM is used for the real computation. On
failed authentication the decrypt returns NO plaintext (it raises).

IMPORTANT: never reuse a (key, nonce) pair with AES-GCM.
"""

from __future__ import annotations

from base64 import b64encode
from typing import Optional

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM as _AESGCM

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "aes_gcm",
    "name": "AES-GCM",
    "category": "aead",
    "security_status": "secure",
    "reversible": True,
    "key_kind": "128 / 192 / 256-bit key + 96-bit nonce",
    "block_size": "128 bits (CTR mode)",
    "description": (
        "AES-GCM is an Authenticated Encryption (AEAD) mode: it encrypts "
        "the plaintext AND produces an authentication tag that proves "
        "integrity and origin. Decryption FAILS (returns no plaintext) if "
        "the tag does not match. The nonce must NEVER be reused under the "
        "same key."
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


def _key_bytes(key_hex: str) -> bytes:
    key = _parse_hex(key_hex, "Key")
    if len(key) not in (16, 24, 32):
        raise ValidationError(
            "AES-GCM key must be 128, 192 or 256 bits (16/24/32 bytes)",
            "invalid_key")
    return key


def _aad_bytes(aad: str) -> bytes:
    if aad is None or aad == "":
        return b""
    return aad.encode("utf-8")


def encrypt(plaintext: str, key_hex: str, nonce_hex: str,
            aad: str = "") -> dict:
    """AES-GCM encrypt. Returns hex ciphertext + hex tag."""
    if plaintext is None:
        raise ValidationError("Plaintext is required", "missing_input")
    key = _key_bytes(key_hex)
    nonce = _parse_hex(nonce_hex, "Nonce")
    if len(nonce) != 12:
        raise ValidationError(
            "AES-GCM nonce must be 96 bits (12 bytes / 24 hex digits)",
            "invalid_nonce")

    pt_bytes = plaintext.encode("utf-8")
    aad_bytes = _aad_bytes(aad)
    aesgcm = _AESGCM(key)
    ct = aesgcm.encrypt(nonce, pt_bytes, aad_bytes)
    ciphertext = ct[:-16]
    tag = ct[-16:]

    steps = [
        step(1, "Set up AES-GCM",
             "The %d-bit key and the 96-bit nonce configure AES-GCM. The "
             "nonce MUST be unique per key — reuse destroys all security." %
             (len(key) * 8),
             f"key = <{len(key) * 8}-bit hidden>, nonce = {nonce.hex()}",
             "AES-GCM context",
             {"key_size": len(key) * 8, "nonce_hex": nonce.hex()}),
        step(2, "Encrypt with AES in counter mode",
             "The plaintext is XORed with an AES-encrypted counter block to "
             "produce the ciphertext (confidentiality).",
             f"{len(pt_bytes)} plaintext bytes", ciphertext.hex(),
             {"ciphertext_hex": ciphertext.hex(),
              "plaintext_length": len(pt_bytes)}),
        step(3, "Compute the authentication tag",
             "GHASH over the ciphertext and the associated data (AAD) "
             "produces a 128-bit tag. AAD is authenticated but NOT "
             "encrypted.",
             f"aad = {aad_bytes.hex()!r}" if aad_bytes else "no AAD",
             f"tag = {tag.hex()}",
             {"tag_hex": tag.hex(), "aad_hex": aad_bytes.hex(),
              "has_aad": bool(aad_bytes)}),
    ]

    return build_result(
        "aes_gcm", "encrypt", plaintext,
        {"key": f"<{len(key) * 8}-bit hidden>", "nonce": nonce.hex()},
        {"ciphertext": ciphertext.hex() + tag.hex()}, steps,
        {
            "ciphertext_hex": ciphertext.hex(),
            "tag_hex": tag.hex(),
            "combined_hex": (ciphertext + tag).hex(),
            "combined_base64": b64encode(ciphertext + tag).decode("ascii"),
            "nonce_hex": nonce.hex(),
            "aad_hex": aad_bytes.hex(),
            "key_size": len(key) * 8,
            "aead_note": (
                "AES-GCM is Authenticated Encryption (AEAD). On decryption, "
                "if the tag does not match, NO plaintext is returned — the "
                "data is rejected."
            ),
        })


def decrypt(ciphertext_hex: str, key_hex: str, nonce_hex: str,
            aad: str = "") -> dict:
    """AES-GCM decrypt. Input is hex of ciphertext||tag. Auth fails → error."""
    if not ciphertext_hex:
        raise ValidationError("Ciphertext is required", "missing_input")
    key = _key_bytes(key_hex)
    nonce = _parse_hex(nonce_hex, "Nonce")
    if len(nonce) != 12:
        raise ValidationError(
            "AES-GCM nonce must be 96 bits (12 bytes / 24 hex digits)",
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

    aad_bytes = _aad_bytes(aad)
    aesgcm = _AESGCM(key)
    try:
        pt = aesgcm.decrypt(nonce, ct_bytes, aad_bytes)
        decrypted_ok = True
    except InvalidTag:
        raise ValidationError(
            "AUTHENTICATION FAILED: the ciphertext or tag was modified, or "
            "the key/nonce is wrong. No plaintext is returned.",
            "authentication_failed",
        ) from None

    try:
        plain = pt.decode("utf-8")
    except UnicodeDecodeError:
        plain = pt.hex()

    return build_result(
        "aes_gcm", "decrypt", ciphertext_hex,
        {"key": f"<{len(key) * 8}-bit hidden>", "nonce": nonce.hex()},
        plain, [],
        {
            "plaintext": plain,
            "plaintext_hex": pt.hex(),
            "authentication": "PASS",
            "aead_note": (
                "The authentication tag was verified successfully before "
                "any plaintext was returned."
            ),
        })


def get_metadata() -> dict:
    return METADATA