"""DSA (Digital Signature Algorithm) educational simulator.

DSA is the U.S. federal digital-signature standard (FIPS 186) based on the
discrete-logarithm problem in a prime-order subgroup of Z_p*. Signatures are
the pair (r, s). It provides authentication and integrity, never
confidentiality. Modern deployments increasingly prefer EdDSA or ECDSA
because DSA keys and signatures are large and random per-message k must be
handled carefully.

The ``cryptography`` library performs the real key generation, signing and
verification. Private keys are returned only for teaching.
"""

from __future__ import annotations

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import dsa
from cryptography.hazmat.primitives.asymmetric.utils import decode_dss_signature

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "dsa",
    "name": "DSA",
    "category": "signature",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "p, q, g parameters + private x + public y",
    "block_size": "—",
    "description": (
        "Digital Signature Algorithm (FIPS 186): signs a message hash using "
        "discrete logarithms modulo a public prime. It authenticates data; "
        "it does not encrypt. Prefer ECDSA/EdDSA for new systems."
    ),
    "formula": "r = (gᵏ mod p) mod q; s = k⁻¹(H(m) + x·r) mod q",
}

_HASHES = {"sha256": hashes.SHA256, "sha384": hashes.SHA384,
           "sha512": hashes.SHA512}
VALID_KEY_SIZES = (1024, 2048, 3072, 4096)


def _hash(hash_algorithm: str):
    if hash_algorithm not in _HASHES:
        raise ValidationError(
            "DSA hash must be one of sha256, sha384, sha512", "invalid_algorithm")
    return _HASHES[hash_algorithm]()


def _message_digest_hex(message: str, hash_algorithm: str) -> str:
    hasher = hashes.Hash(_hash(hash_algorithm))
    hasher.update(message.encode("utf-8"))
    return hasher.finalize().hex()


def _r_s(signature: bytes) -> tuple:
    try:
        return decode_dss_signature(signature)
    except Exception:  # noqa: BLE001 - malformed foreign signature
        return 0, 0


def _load_private(pem: str):
    try:
        key = serialization.load_pem_private_key(pem.encode("utf-8"),
                                                 password=None)
    except Exception as exc:  # noqa: BLE001 - normalize library errors
        raise ValidationError("Could not load the DSA private key (PEM)",
                              "invalid_key") from exc
    if not isinstance(key, dsa.DSAPrivateKey):
        raise ValidationError("The provided PEM is not a DSA private key",
                              "invalid_key")
    return key


def _load_public(pem: str):
    try:
        key = serialization.load_pem_public_key(pem.encode("utf-8"))
    except Exception as exc:  # noqa: BLE001
        raise ValidationError("Could not load the DSA public key (PEM)",
                              "invalid_key") from exc
    if not isinstance(key, dsa.DSAPublicKey):
        raise ValidationError("The provided PEM is not a DSA public key",
                              "invalid_key")
    return key


def _private_pem(key) -> str:
    return key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode("ascii")


def _public_pem(key) -> str:
    return key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode("ascii")


def generate_keys(key_size: int = 2048) -> dict:
    if int(key_size) not in VALID_KEY_SIZES:
        raise ValidationError(
            f"DSA key size must be one of {VALID_KEY_SIZES}", "invalid_key_size")
    key = dsa.generate_private_key(key_size=int(key_size))
    private_pem = _private_pem(key)
    public_pem = _public_pem(key)
    return build_result(
        "dsa", "generate_keys", f"DSA-{key_size}", {"key_size": int(key_size)},
        {"public_key_pem": public_pem}, [
            step(1, "Choose domain parameters",
                 "A prime p and a prime divisor q are generated, together "
                 "with a generator g of the order-q subgroup. This is the "
                 "slow part of DSA.",
                 f"{key_size}-bit modulus", "p, q, g",
                 {"key_size": int(key_size)}),
            step(2, "Choose the private key x",
                 "A random secret x in [1, q-1] is selected.",
                 "", "x (hidden)", {}),
            step(3, "Compute the public key y",
                 "The public value is y = g^x mod p.",
                 f"x = {key_size}-bit secret", public_pem,
                 {"public_key_pem": public_pem}),
        ],
        {"private_key_pem": private_pem, "public_key_pem": public_pem,
         "key_size": int(key_size)},
    )


def sign(message: str, hash_algorithm: str = "sha256",
         private_key_pem: str = None, key_size: int = 2048) -> dict:
    if message is None or message == "":
        raise ValidationError("Message is required", "missing_input")
    digest = _hash(hash_algorithm)
    generated = False
    if private_key_pem:
        key = _load_private(private_key_pem)
    else:
        key = dsa.generate_private_key(key_size=int(key_size))
        generated = True
    public_pem = _public_pem(key)
    try:
        signature = key.sign(message.encode("utf-8"), digest)
    except Exception as exc:  # noqa: BLE001
        raise ValidationError(
            "DSA signing failed (hash/key-size combination not allowed)",
            "invalid_parameters") from exc
    digest_hex = _message_digest_hex(message, hash_algorithm)
    r, s = _r_s(signature)

    steps = [
        step(1, "Hash the message",
             "DSA signs a digest, not the raw message.",
             message, f"{hash_algorithm} digest",
             {"hash": hash_algorithm, "message_bytes": len(message.encode('utf-8')),
              "digest_hex": digest_hex}),
        step(2, "Choose a per-message nonce k",
             "A fresh random k is chosen. Reusing k across two signatures "
             "reveals the private key — a famous DSA failure mode.",
             "", "k (secret, unique per message)", {}),
        step(3, "Compute (r, s)",
             "r = (g^k mod p) mod q and s = k⁻¹(H(m) + x·r) mod q.",
             f"x = <{key_size}-bit hidden>", f"signature = {signature.hex()}",
             {"signature_hex": signature.hex(), "generated_key": generated,
              "digest_hex": digest_hex, "r": r, "s": s,
              "r_hex": f"{r:x}", "s_hex": f"{s:x}"}),
    ]
    return build_result(
        "dsa", "sign", message,
        {"hash": hash_algorithm, "key_size": int(key_size)},
        {"signature_hex": signature.hex(), "public_key_pem": public_pem},
        steps,
        {"signature_hex": signature.hex(), "public_key_pem": public_pem,
         "hash": hash_algorithm, "generated_key": generated,
         "signature_der_hex": signature.hex(),
         "digest_hex": digest_hex, "r": r, "s": s,
         "r_hex": f"{r:x}", "s_hex": f"{s:x}",
         "note": "DSA signatures are DER-encoded (r, s) values."},
    )


def verify(message: str, signature_hex: str, hash_algorithm: str = "sha256",
           public_key_pem: str = None) -> dict:
    if not signature_hex:
        raise ValidationError("Signature is required", "missing_signature")
    if not public_key_pem:
        raise ValidationError(
            "A public key (PEM) is required to verify a DSA signature",
            "missing_key")
    digest = _hash(hash_algorithm)
    key = _load_public(public_key_pem)
    try:
        signature = bytes.fromhex("".join(signature_hex.split()))
    except ValueError as exc:
        raise ValidationError("Signature must be valid hexadecimal",
                              "invalid_hex") from exc
    digest_hex = _message_digest_hex(message, hash_algorithm)
    r, s = _r_s(signature)
    try:
        key.verify(signature, message.encode("utf-8"), digest)
        valid = True
    except InvalidSignature:
        valid = False
    except Exception:  # noqa: BLE001
        valid = False
    steps = [
        step(1, "Hash the message again",
             "The verifier recomputes the digest of the claimed message "
             "with the same hash algorithm.",
             message, f"{hash_algorithm} digest",
             {"hash": hash_algorithm, "message_bytes": len(message.encode("utf-8")),
              "digest_hex": digest_hex}),
        step(2, "Recompute the verification value",
             "w = s⁻¹ mod q, u₁ = H(m)·w, u₂ = r·w and v = ((g^u₁)·(y^u₂) "
             "mod p) mod q are computed; the signature holds when v ≡ r (mod q).",
             f"(r, s) from the signature", "VALID" if valid else "INVALID",
             {"r": r, "s": s, "r_hex": f"{r:x}", "s_hex": f"{s:x}",
              "valid": valid}),
    ]
    return build_result(
        "dsa", "verify", message, {"hash": hash_algorithm}, valid, steps,
        {"valid": valid, "hash": hash_algorithm,
         "result": "VALID" if valid else "INVALID",
         "digest_hex": digest_hex, "r": r, "s": s,
         "r_hex": f"{r:x}", "s_hex": f"{s:x}"},
    )


def get_metadata() -> dict:
    return METADATA
