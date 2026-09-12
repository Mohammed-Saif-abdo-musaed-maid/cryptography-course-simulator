"""ECDSA (Elliptic Curve Digital Signature Algorithm) educational simulator.

ECDSA (ANSI X9.62 / FIPS 186-4) provides *digital signatures*: proving a
message's authenticity and integrity with a key pair, WITHOUT encrypting
the message. The curve order n ties the signature r,s to the private key.

Uses the ``cryptography`` library for key generation, signing (SHA-256)
and verification. Signing is a separate operation from encryption.
"""

from __future__ import annotations

from base64 import b64encode
from typing import Optional

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec, utils

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "ecdsa",
    "name": "ECDSA",
    "category": "signature",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "EC private scalar + public point (curve)",
    "block_size": "—",
    "description": (
        "ECDSA is a digital signature algorithm on elliptic curves "
        "(FIPS 186-4). A signature (r, s) proves that the holder of the "
        "private key signed the message. It does NOT encrypt anything — "
        "ciphers encrypt, signatures authenticate."
    ),
}

CURVES = {"p256": ec.SECP256R1, "p384": ec.SECP384R1, "p521": ec.SECP521R1}
CURVE_NAMES = {"p256": "P-256", "p384": "P-384", "p521": "P-521"}


def _get_curve(curve: str):
    if curve not in CURVES:
        raise ValidationError(
            f"Curve must be one of {sorted(CURVES)}", "invalid_curve")
    return CURVES[curve]()


def _message_digest(message: str) -> bytes:
    h = hashes.Hash(hashes.SHA256())
    h.update(message.encode("utf-8"))
    return h.finalize()


def generate_keys(curve: str = "p256") -> dict:
    """Generate an ECDSA key pair (private scalar + public point)."""
    curve_cls = _get_curve(curve)
    priv = ec.generate_private_key(curve_cls)
    pub = priv.public_key()
    pub_bytes = pub.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint,
    )
    numbers = pub.public_numbers()

    return {
        "algorithm": "ECDSA",
        "curve": curve,
        "curve_name": CURVE_NAMES[curve],
        "hash": "SHA-256",
        "private_scalar": priv.private_numbers().private_value,
        "private_hex": hex(priv.private_numbers().private_value),
        "public_x": numbers.x,
        "public_y": numbers.y,
        "public_hex": pub_bytes.hex(),
        "public_bytes": len(pub_bytes),
    }


def sign(message: str, curve: str = "p256",
         private_scalar: Optional[int] = None) -> dict:
    """Sign a message, producing a DER-encoded signature.

    A fresh key pair is generated per call unless private_scalar is given;
    the returned result includes the private scalar and public key so the
    signature can be verified later.
    """
    if private_scalar is None:
        keys = generate_keys(curve)
        scalar = keys["private_scalar"]
        pub_hex = keys["public_hex"]
        pub_x = keys["public_x"]
        pub_y = keys["public_y"]
    else:
        curve_cls = _get_curve(curve)
        priv = ec.derive_private_key(int(private_scalar), curve_cls)
        scalar = int(private_scalar)
        pub = priv.public_key()
        pub_hex = pub.public_bytes(
            encoding=serialization.Encoding.X962,
            format=serialization.PublicFormat.UncompressedPoint,
        ).hex()
        numbers = pub.public_numbers()
        pub_x, pub_y = numbers.x, numbers.y

    curve_cls = _get_curve(curve)
    priv = ec.derive_private_key(scalar, curve_cls)
    msg_bytes = message.encode("utf-8")
    sig = priv.sign(msg_bytes, ec.ECDSA(hashes.SHA256()))
    r, s = utils.decode_dss_signature(sig)
    digest = _message_digest(message)

    steps = [
        step(1, "Prepare the ECDSA key pair",
             "The private scalar d and its public point Q = d·G on %s are "
             "ready. Only Q is public." % CURVE_NAMES[curve],
             f"d = {scalar}", f"Q = (x = {pub_x})",
             {"private_scalar": scalar, "public_hex": pub_hex}),
        step(2, "Hash the message",
             "The message is hashed with SHA-256 to a 256-bit digest z, "
             "truncated to the bit length of the curve order.",
             message, digest.hex(),
             {"digest_hex": digest.hex(), "message_bytes": len(msg_bytes)}),
        step(3, "Compute the signature",
             "ECDSA picks a random per-message k and computes "
             "r = (k·G).x mod n and s = k⁻¹(z + r·d) mod n. The signature "
             "is (r, s), encoded in DER.",
             "r, s values", sig.hex(),
             {"r": r, "s": s, "signature_der": sig.hex(),
              "signature_base64": b64encode(sig).decode("ascii")}),
    ]

    return build_result(
        "ecdsa", "sign", message, {"curve": curve}, sig.hex(), steps,
        {
            "signature_hex": sig.hex(),
            "signature_base64": b64encode(sig).decode("ascii"),
            "r": r, "s": s,
            "curve": curve,
            "hash": "SHA-256",
            "private_scalar": scalar,
            "public_hex": pub_hex,
            "public_x": pub_x,
            "public_y": pub_y,
            "signature_note": (
                "ECDSA signs (authenticates) — it does NOT encrypt the "
                "message. The message remains readable; only its origin and "
                "integrity are proven."
            ),
        })


def verify(message: str, signature_hex: str, public_x: Optional[int] = None,
           public_y: Optional[int] = None, curve: str = "p256",
           public_hex: Optional[str] = None) -> dict:
    """Verify an ECDSA signature against a message and public key."""
    if not signature_hex:
        raise ValidationError("Signature is required", "missing_signature")
    curve_cls = _get_curve(curve)
    try:
        sig = bytes.fromhex(signature_hex)
    except ValueError as exc:
        raise ValidationError("Signature must be valid hexadecimal",
                              "invalid_hex") from exc

    try:
        if public_hex:
            pub_bytes = bytes.fromhex(public_hex)
            pub = ec.EllipticCurvePublicKey.from_encoded_point(
                curve_cls, pub_bytes)
        elif public_x is not None and public_y is not None:
            pub = ec.EllipticCurvePublicNumbers(
                int(public_x), int(public_y), curve_cls
            ).public_key()
        else:
            raise ValidationError(
                "Public key is required (public_x/public_y or public_hex)",
                "missing_public_key")
    except (ValueError, TypeError) as exc:
        raise ValidationError("Invalid public key for the chosen curve",
                              "invalid_public_key") from exc

    msg_bytes = message.encode("utf-8")
    try:
        pub.verify(sig, msg_bytes, ec.ECDSA(hashes.SHA256()))
        valid = True
    except (InvalidSignature, ValueError):
        valid = False

    return build_result(
        "ecdsa", "verify", message,
        {"curve": curve, "public_x": pub.public_numbers().x,
         "public_y": pub.public_numbers().y},
        valid, [],
        {
            "valid": valid, "result": "VALID" if valid else "INVALID",
            "curve": curve,
            "hash": "SHA-256",
            "signature_note": (
                "Verification recomputes the ECDSA equation with the public "
                "key. If the message, signature or public key was altered, "
                "verification fails."
            ),
        })


def get_metadata() -> dict:
    return METADATA