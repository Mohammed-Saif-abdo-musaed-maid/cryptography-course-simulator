"""Ed25519 digital signature educational simulator (RFC 8032).

Ed25519 is a modern digital signature scheme based on the twisted Edwards
curve Curve25519. It is deterministic (a given message always produces the
same signature), fast, constant-time, and simple to implement safely. 
Designed by Daniel J. Bernstein.

Uses the ``cryptography`` library for key generation, signing and
verification. Signing is separate from encryption.
"""

from __future__ import annotations

from base64 import b64encode
from typing import Optional

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "ed25519",
    "name": "Ed25519",
    "category": "signature",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "32-byte private key + 32-byte public key",
    "block_size": "—",
    "description": (
        "Ed25519 (RFC 8032) is a modern, deterministic digital signature "
        "scheme over the Ed25519 twisted Edwards curve. Keys are 32 bytes, "
        "signatures 64 bytes, and the design is side-channel resistant. It "
        "signs (authenticates) — it does NOT encrypt."
    ),
}


def _priv_bytes(priv) -> bytes:
    return priv.private_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PrivateFormat.Raw,
        encryption_algorithm=serialization.NoEncryption(),
    )


def _pub_bytes(pub) -> bytes:
    return pub.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw,
    )


def generate_keys() -> dict:
    """Generate an Ed25519 key pair (32-byte private key + public key)."""
    priv = Ed25519PrivateKey.generate()
    pub = priv.public_key()
    return {
        "algorithm": "Ed25519",
        "curve": "Ed25519",
        "private_hex": _priv_bytes(priv).hex(),
        "public_hex": _pub_bytes(pub).hex(),
        "private_bytes": 32,
        "public_bytes": 32,
    }


def sign(message: str, private_hex: Optional[str] = None) -> dict:
    """Sign a message with Ed25519, producing a 64-byte signature."""
    if private_hex is None:
        keys = generate_keys()
        priv_bytes = bytes.fromhex(keys["private_hex"])
        pub_hex = keys["public_hex"]
    else:
        try:
            priv_bytes = bytes.fromhex(private_hex)
        except ValueError as exc:
            raise ValidationError("Private key must be valid hexadecimal",
                                  "invalid_hex") from exc
        if len(priv_bytes) != 32:
            raise ValidationError(
                "Ed25519 private key must be 32 bytes (64 hex digits)",
                "invalid_key")
        priv = Ed25519PrivateKey.from_private_bytes(priv_bytes)
        pub_hex = _pub_bytes(priv.public_key()).hex()

    priv = Ed25519PrivateKey.from_private_bytes(priv_bytes)
    msg_bytes = message.encode("utf-8")
    sig = priv.sign(msg_bytes)

    steps = [
        step(1, "Prepare the key pair",
             "Ed25519 private keys are 32 random bytes; the public key is "
             "derived by scalar multiplication on the Ed25519 curve.",
             f"private = {priv_bytes.hex()}", f"public = {pub_hex}",
             {"public_hex": pub_hex, "private_bytes": 32}),
        step(2, "Hash the message and key parts",
             "Ed25519 hashes the private key prefix with SHA-512 to derive "
             "the nonce and scalar (deterministic RFC 8032 scheme).",
             f"{len(msg_bytes)} message bytes", "SHA-512 digest",
             {"message_bytes": len(msg_bytes)}),
        step(3, "Produce the signature",
             "The resulting 64-byte signature is R (32 bytes) concatenated "
             "with S (32 bytes). Ed25519 is deterministic: the same message "
             "always signs identically.",
             "R || S", sig.hex(),
             {"signature_hex": sig.hex(),
              "signature_base64": b64encode(sig).decode("ascii")}),
    ]

    return build_result(
        "ed25519", "sign", message, {}, sig.hex(), steps,
        {
            "signature_hex": sig.hex(),
            "signature_base64": b64encode(sig).decode("ascii"),
            "signature_bytes": 64,
            "private_hex": priv_bytes.hex(),
            "public_hex": pub_hex,
            "signature_note": (
                "Ed25519 signs (authenticates) — it does NOT encrypt the "
                "message. Verifying with the public key proves origin and "
                "integrity."
            ),
        })


def verify(message: str, signature_hex: str,
           public_hex: Optional[str] = None) -> dict:
    """Verify an Ed25519 signature (64-byte signature, raw 32-byte key)."""
    if not signature_hex:
        raise ValidationError("Signature is required", "missing_signature")
    if not public_hex:
        raise ValidationError("Public key is required", "missing_public_key")
    try:
        sig = bytes.fromhex(signature_hex)
        pub_bytes_raw = bytes.fromhex(public_hex)
    except ValueError as exc:
        raise ValidationError("Signature/public key must be valid hexadecimal",
                              "invalid_hex") from exc
    if len(pub_bytes_raw) != 32:
        raise ValidationError(
            "Ed25519 public key must be 32 bytes (64 hex digits)",
            "invalid_public_key")

    try:
        pub = Ed25519PublicKey.from_public_bytes(pub_bytes_raw)
        pub.verify(sig, message.encode("utf-8"))
        valid = True
    except (InvalidSignature, ValueError):
        valid = False

    return build_result(
        "ed25519", "verify", message, {}, valid, [],
        {
            "valid": valid, "result": "VALID" if valid else "INVALID",
            "public_hex": public_hex,
            "signature_note": (
                "Verification recomputes the Ed25519 equation with the "
                "public key. Any change to the message, signature or key "
                "fails verification."
            ),
        })


def get_metadata() -> dict:
    return METADATA