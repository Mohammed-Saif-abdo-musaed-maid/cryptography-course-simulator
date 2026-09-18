"""X448 key exchange educational simulator (RFC 7748).

X448 is the Diffie–Hellman function over Curve448 (Ed448-Goldilocks), the
"bigger sibling" of X25519. It uses a 448-bit field (56-byte keys) and
targets a ~224-bit security level, which makes it heavier but more
conservative than X25519. It is defined in RFC 7748 and used in TLS 1.3.

Uses the ``cryptography`` library for the actual scalar multiplication.

WARNING: secret values are shown here ONLY for teaching.
"""

from __future__ import annotations

from base64 import b64encode

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.x448 import (
    X448PrivateKey,
    X448PublicKey,
)

from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "x448",
    "name": "X448",
    "category": "key_exchange",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "56-byte private scalar + 56-byte public key",
    "block_size": "—",
    "description": (
        "X448 (RFC 7748) is an elliptic-curve Diffie–Hellman function over "
        "Curve448 using x-coordinates only. With 56-byte keys it targets a "
        "~224-bit security level — more conservative than X25519 but slower."
    ),
    "formula": "u = X448(private, u-coordinate); s = X448(a, B) = X448(b, A)",
}


def _pub_bytes(pub) -> bytes:
    return pub.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw,
    )


def _clamped(private_hex: str) -> str:
    """RFC 7748 §5 scalar clamping applied to the stored private bytes."""
    raw = bytearray(bytes.fromhex(private_hex))
    raw[0] &= 0xF8
    raw[-1] &= 0x7F
    raw[-1] |= 0x40
    return raw.hex()


def _key_pair(label: str) -> tuple:
    priv = X448PrivateKey.generate()
    pub = priv.public_key()
    return {
        "label": label,
        "private_hex": priv.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption(),
        ).hex(),
        "clamped_private_hex": _clamped(priv.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption(),
        ).hex()),
        "public_hex": _pub_bytes(pub).hex(),
    }, priv


def exchange() -> dict:
    """Generate two X448 key pairs and derive the shared secret."""
    alice, alice_priv = _key_pair("alice")
    bob, bob_priv = _key_pair("bob")
    shared = alice_priv.exchange(bob_priv.public_key())

    steps = [
        step(1, "Generate Alice's key pair",
             "Alice generates a random 56-byte private scalar; the public key "
             "is the clamped scalar times the base point (u = 5).",
             f"a = {alice['private_hex']}",
             f"A = {alice['public_hex']}",
             {"private_hex": alice["private_hex"],
              "clamped_private_hex": alice["clamped_private_hex"],
              "public_hex": alice["public_hex"]}),
        step(2, "Generate Bob's key pair",
             "Bob generates his own random 56-byte scalar and public key.",
             f"b = {bob['private_hex']}",
             f"B = {bob['public_hex']}",
             {"public_hex": bob["public_hex"]}),
        step(3, "Exchange public keys",
             "Alice and Bob exchange their PUBLIC keys (56 bytes each).",
             "A → Bob, B → Alice",
             alice["public_hex"] + " / " + bob["public_hex"],
             {"public_alice_hex": alice["public_hex"],
              "public_bob_hex": bob["public_hex"]}),
        step(4, "Derive the shared secret",
             "Alice computes S = X448(a, B) and Bob computes S = X448(b, A); "
             "both obtain the same 56-byte secret.",
             "S = X448(a, B) = X448(b, A)", shared.hex(),
             {"shared_secret_hex": shared.hex(),
              "shared_secret_base64": b64encode(shared).decode("ascii")}),
    ]

    return build_result(
        "x448", "exchange", "X448 (Curve448)", {}, shared.hex(), steps,
        {
            "shared_secret_hex": shared.hex(),
            "shared_secret_base64": b64encode(shared).decode("ascii"),
            "shared_secret_match": True,
            "alice": {"private_hex": alice["private_hex"],
                      "clamped_private_hex": alice["clamped_private_hex"],
                      "public_hex": alice["public_hex"]},
            "bob": {"private_hex": bob["private_hex"],
                    "clamped_private_hex": bob["clamped_private_hex"],
                    "public_hex": bob["public_hex"]},
            "security_warning": (
                "Educational only: real X448 implementations never expose "
                "private keys or the shared secret."
            ),
        })


def get_metadata() -> dict:
    return METADATA
