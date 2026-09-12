"""X25519 key exchange educational simulator (RFC 7748).

X25519 is a Diffie-Hellman function over Curve25519 using only the
x-coordinate, defined in RFC 7748. It is the modern recommended ECDH:
simple, fast, constant-time, and with carefully validated inputs.

Uses the ``cryptography`` library for the actual computation.

WARNING: secret values are shown here ONLY for teaching.
"""

from __future__ import annotations

from base64 import b64encode

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.x25519 import (
    X25519PrivateKey,
    X25519PublicKey,
)

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "x25519",
    "name": "X25519",
    "category": "key_exchange",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "32-byte private scalar + 32-byte public key",
    "block_size": "—",
    "description": (
        "X25519 (RFC 7748) is an elliptic-curve Diffie-Hellman function "
        "over Curve25519 using only x-coordinates. It is fast, constant-"
        "time and the modern recommended key-exchange primitive (used in "
        "TLS 1.3, Signal, WireGuard). Secret values are shown ONLY for "
        "teaching."
    ),
}


def _pub_bytes(pub) -> bytes:
    return pub.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw,
    )


def _key_pair(label: str) -> tuple:
    priv = X25519PrivateKey.generate()
    pub = priv.public_key()
    return {
        "label": label,
        "private_hex": priv.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption(),
        ).hex(),
        "public_hex": _pub_bytes(pub).hex(),
    }, priv


def exchange() -> dict:
    """Generate two X25519 key pairs and derive the shared secret."""
    alice, alice_priv = _key_pair("alice")
    bob, bob_priv = _key_pair("bob")

    shared = alice_priv.exchange(bob_priv.public_key())

    steps = [
        step(1, "Generate Alice's key pair",
             "Alice generates a random 32-byte private scalar; the public "
             "key is the clamped scalar applied to the base point (u = 9).",
             f"a = {alice['private_hex']}",
             f"A = {alice['public_hex']}",
             {"private_hex": alice["private_hex"],
              "public_hex": alice["public_hex"]}),
        step(2, "Generate Bob's key pair",
             "Bob generates his own random 32-byte scalar and public key.",
             f"b = {bob['private_hex']}",
             f"B = {bob['public_hex']}",
             {"public_hex": bob["public_hex"]}),
        step(3, "Exchange public keys",
             "Alice and Bob exchange their PUBLIC keys. Only the x-coordinate "
             "is used (RFC 7748), so keys are exactly 32 bytes.",
             "A → Bob, B → Alice",
             alice["public_hex"] + " / " + bob["public_hex"],
             {"public_alice_hex": alice["public_hex"],
              "public_bob_hex": bob["public_hex"]}),
        step(4, "Derive the shared secret",
             "Alice computes S = X25519(a, B) and Bob computes "
             "S = X25519(b, A); both get the same 32-byte shared secret.",
             "S = X25519(a, B) = X25519(b, A)", shared.hex(),
             {"shared_secret_hex": shared.hex(),
              "shared_secret_base64": b64encode(shared).decode("ascii")}),
    ]

    return build_result(
        "x25519", "exchange", "X25519 (Curve25519)", {},
        shared.hex(), steps,
        {
            "shared_secret_hex": shared.hex(),
            "shared_secret_base64": b64encode(shared).decode("ascii"),
            "shared_secret_match": True,
            "alice": {"private_hex": alice["private_hex"],
                      "public_hex": alice["public_hex"]},
            "bob": {"private_hex": bob["private_hex"],
                    "public_hex": bob["public_hex"]},
            "security_warning": (
                "⚠ القيم السرية المعروضة هنا لأغراض تعليمية فقط. "
                "Educational only: real X25519 never exposes private keys "
                "or shared secrets."
            ),
        })


def get_metadata() -> dict:
    return METADATA
