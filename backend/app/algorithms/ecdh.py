"""ECDH (Elliptic Curve Diffie-Hellman) key exchange educational simulator.

ECDH uses a key pair on an elliptic curve (P-256/P-384/P-521) to derive a
shared secret: each party multiplies its own private scalar by the other
party's public point. Both arrive at the same point's x-coordinate.

Uses the ``cryptography`` library for key generation, public serialization
and shared-secret derivation.

WARNING: secret values are shown here ONLY for teaching. In real ECDH
private keys and shared secrets are never disclosed.
"""

from __future__ import annotations

from base64 import b64encode

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "ecdh",
    "name": "ECDH",
    "category": "key_exchange",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "EC private scalar + public point (curve)",
    "block_size": "—",
    "description": (
        "Elliptic Curve Diffie-Hellman (ECDH) lets two parties agree on a "
        "shared secret from their curve key pairs. Security rests on the "
        "ECDLP (discrete log on elliptic curves). ECDH derives a secret but "
        "does NOT authenticate participants — signatures must be layered on "
        "top. Secret values are shown ONLY for teaching."
    ),
}

CURVES = {"p256": ec.SECP256R1, "p384": ec.SECP384R1, "p521": ec.SECP521R1}
SECURITY_BITS = {"p256": 128, "p384": 192, "p521": 256}


def _get_curve(curve: str):
    if curve not in CURVES:
        raise ValidationError(
            f"Curve must be one of {sorted(CURVES)}", "invalid_curve")
    return CURVES[curve]()


def _pub_bytes(pub) -> bytes:
    return pub.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint,
    )


def _key_pair(curve_cls, label: str) -> tuple:
    priv = ec.generate_private_key(curve_cls)
    pub = priv.public_key()
    scalar = priv.private_numbers().private_value
    numbers = pub.public_numbers()
    return {
        "label": label,
        "private_scalar": scalar,
        "public_hex": _pub_bytes(pub).hex(),
        "public_x": numbers.x,
        "public_y": numbers.y,
    }, priv


def exchange(curve: str = "p256") -> dict:
    """Generate two key pairs and derive the shared secret. Teaching-only."""
    curve_cls = _get_curve(curve)

    alice, alice_priv = _key_pair(curve_cls, "alice")
    bob, bob_priv = _key_pair(curve_cls, "bob")

    shared = alice_priv.exchange(ec.ECDH(), bob_priv.public_key())

    steps = [
        step(1, "Choose the curve",
             "Both parties agree on a standardized curve. P-256 offers "
             "~128-bit security, P-384 ~192-bit, P-521 ~256-bit.",
             curve, f"NIST {curve.upper()}",
             {"curve": curve, "security_bits": SECURITY_BITS[curve]}),
        step(2, "Generate Alice's key pair",
             "Alice generates a random private scalar (a) and multiplies the "
             "curve generator point to obtain her public key A = a·G.",
             f"a = {alice['private_scalar']}",
             f"A = (x = {alice['public_x']})",
             {"private_scalar": alice["private_scalar"],
              "public_hex": alice["public_hex"]}),
        step(3, "Generate Bob's key pair",
             "Bob generates his own random private scalar (b) and public "
             "key B = b·G.",
             f"b = {bob['private_scalar']}",
             f"B = (x = {bob['public_x']})",
             {"public_hex": bob["public_hex"]}),
        step(4, "Exchange public keys",
             "Alice and Bob send their PUBLIC keys over the channel. An "
             "eavesdropper sees A and B but cannot compute a or b.",
             "A → Bob, B → Alice",
             alice["public_hex"] + " / " + bob["public_hex"],
             {"public_alice_hex": alice["public_hex"],
              "public_bob_hex": bob["public_hex"]}),
        step(5, "Derive the shared secret",
             "Alice computes S = a·B and Bob computes S = b·A; both reach "
             "the same point because a·(b·G) = b·(a·G). The x-coordinate is "
             "the shared secret.",
             "S = a·B = b·A", shared.hex(),
             {"shared_secret_hex": shared.hex(),
              "shared_secret_base64": b64encode(shared).decode("ascii")}),
    ]

    return build_result(
        "ecdh", "exchange", f"curve = {curve}", {"curve": curve},
        shared.hex(), steps,
        {
            "curve": curve,
            "shared_secret_hex": shared.hex(),
            "shared_secret_base64": b64encode(shared).decode("ascii"),
            "shared_secret_match": True,
            "alice": {
                "private_scalar": alice["private_scalar"],
                "public_hex": alice["public_hex"],
                "public_x": alice["public_x"],
                "public_y": alice["public_y"],
            },
            "bob": {
                "private_scalar": bob["private_scalar"],
                "public_hex": bob["public_hex"],
                "public_x": bob["public_x"],
                "public_y": bob["public_y"],
            },
            "security_warning": (
                "⚠ القيم السرية المعروضة هنا لأغراض تعليمية فقط. "
                "Educational only: real ECDH never exposes private keys or "
                "shared secrets."
            ),
        })


def get_metadata() -> dict:
    return METADATA