"""RSA-PSS educational simulator.

RSA-PSS (Probabilistic Signature Scheme, RFC 8017 / PKCS#1 v2.2) is the
modern, provably-secure RSA signature padding. Unlike the older PKCS#1 v1.5
scheme it is randomized and has a formal security proof in the random-oracle
model. It is the recommended RSA signature scheme (used in TLS 1.3, code
signing and certificates).

This module models RSA-PSS as a *signature scheme*: it does NOT provide RSA
encryption. Keys may be supplied as PEM or generated on demand.
"""

from __future__ import annotations

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "rsa_pss",
    "name": "RSA-PSS",
    "category": "signature",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "RSA key pair (2048 / 3072 / 4096 bits)",
    "block_size": "—",
    "description": (
        "RSA with the Probabilistic Signature Scheme (RFC 8017). A hash is "
        "randomly salted into the PSS encoding, then signed with the RSA "
        "private operation. Modern and provably secure; unlike PKCS#1 v1.5 "
        "it is randomized."
    ),
    "formula": "s = (EMSA-PSS-encode(H(m), salt))ᵈ mod n; verify: encode and compare",
}

_HASHES = {"sha256": hashes.SHA256, "sha384": hashes.SHA384,
           "sha512": hashes.SHA512}
_HASH_BYTES = {"sha256": 32, "sha384": 48, "sha512": 64}
VALID_KEY_SIZES = (2048, 3072, 4096)


def _hash(hash_algorithm: str):
    if hash_algorithm not in _HASHES:
        raise ValidationError(
            "RSA-PSS hash must be one of sha256, sha384, sha512",
            "invalid_algorithm")
    return _HASHES[hash_algorithm]()


def _pss(digest):
    return padding.PSS(mgf=padding.MGF1(digest), salt_length=padding.PSS.MAX_LENGTH)


def _message_digest_hex(message: str, hash_algorithm: str) -> str:
    hasher = hashes.Hash(_hash(hash_algorithm))
    hasher.update(message.encode("utf-8"))
    return hasher.finalize().hex()


def _recover_em(signature: bytes, public_key) -> dict:
    """The encoded message EM of the real RSA-PSS signature.

    PSS verification reconstructs EM = s^e mod n from the public key; that
    same value is recovered here so the simulator can show the genuine
    encoded message (trailer byte 0xBC and message-hash column) that the
    signature actually carries.
    """
    numbers = public_key.public_numbers()
    size = (numbers.n.bit_length() + 7) // 8
    em = pow(int.from_bytes(signature, "big"), numbers.e, numbers.n)
    em = em.to_bytes(size, "big")
    return {
        "em_hex": em.hex(),
        "em_byte_len": size,
        "em_trailer_checked": len(em) > 0 and em[-1] == 0xBC,
    }


def _load_private(pem: str):
    try:
        key = serialization.load_pem_private_key(pem.encode("utf-8"), password=None)
    except Exception as exc:  # noqa: BLE001
        raise ValidationError("Could not load the RSA private key (PEM)",
                              "invalid_key") from exc
    if not isinstance(key, rsa.RSAPrivateKey):
        raise ValidationError("The provided PEM is not an RSA private key",
                              "invalid_key")
    return key


def _load_public(pem: str):
    try:
        key = serialization.load_pem_public_key(pem.encode("utf-8"))
    except Exception as exc:  # noqa: BLE001
        raise ValidationError("Could not load the RSA public key (PEM)",
                              "invalid_key") from exc
    if not isinstance(key, rsa.RSAPublicKey):
        raise ValidationError("The provided PEM is not an RSA public key",
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
            f"RSA key size must be one of {VALID_KEY_SIZES}", "invalid_key_size")
    key = rsa.generate_private_key(public_exponent=65537, key_size=int(key_size))
    private_pem = _private_pem(key)
    public_pem = _public_pem(key)
    return build_result(
        "rsa_pss", "generate_keys", f"RSA-{key_size}", {"key_size": int(key_size)},
        {"public_key_pem": public_pem}, [
            step(1, "Generate two large primes",
                 "Two random primes p and q of about %d bits each are "
                 "generated and n = p·q computed." % (int(key_size) // 2),
                 f"{key_size}-bit modulus", "n = p·q",
                 {"key_size": int(key_size)}),
            step(2, "Choose the public exponent",
                 "The standard exponent e = 65537 is used.",
                 "", "e = 65537", {}),
            step(3, "Compute the private exponent",
                 "d = e⁻¹ mod λ(n) is derived; d is the signing secret.",
                 "", "d (hidden)", {}),
            step(4, "Export the key pair",
                 "The public key is returned as PEM so signatures can be "
                 "verified.",
                 "", public_pem, {"public_key_pem": public_pem}),
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
        key = rsa.generate_private_key(public_exponent=65537, key_size=int(key_size))
        generated = True
    public_pem = _public_pem(key)
    data = message.encode("utf-8")
    signature = key.sign(data, _pss(digest), digest)
    digest_hex = _message_digest_hex(message, hash_algorithm)
    em = _recover_em(signature, key.public_key())
    salt_length = em["em_byte_len"] - _HASH_BYTES[hash_algorithm] - 2

    steps = [
        step(1, "Hash the message",
             "PSS signs a digest of the message.",
             message, f"{hash_algorithm} digest",
             {"hash": hash_algorithm, "message_bytes": len(data),
              "digest_hex": digest_hex}),
        step(2, "PSS encode (EMSA-PSS)",
             "The digest is combined with a random salt and a special trailer "
             "into an encoded message EM of the same size as the modulus. "
             "The random salt makes the signature non-deterministic.",
             "digest + random salt", "EM (encoded message)",
             {"salt_length": "maximum", "encoding": "EMSA-PSS",
              "salt_length_bytes": salt_length,
              "em_hex": em["em_hex"],
              "em_trailer_checked": em["em_trailer_checked"]}),
        step(3, "RSA private operation",
             "The encoded message is raised to the private exponent: "
             "s = EMᵈ mod n.",
             "EM", f"signature = {signature.hex()}",
             {"signature_hex": signature.hex(), "generated_key": generated}),
    ]
    return build_result(
        "rsa_pss", "sign", message,
        {"hash": hash_algorithm, "key_size": int(key_size)},
        {"signature_hex": signature.hex(), "public_key_pem": public_pem},
        steps,
        {"signature_hex": signature.hex(), "public_key_pem": public_pem,
         "hash": hash_algorithm, "generated_key": generated,
         "salt_length": "maximum",
         "digest_hex": digest_hex,
         "salt_length_bytes": salt_length,
         "em_hex": em["em_hex"],
         "em_byte_len": em["em_byte_len"],
         "em_trailer_checked": em["em_trailer_checked"],
         "note": ("RSA-PSS needs the PUBLIC key, the hash and the salt policy "
                  "to verify — the salt travels inside the signature.")},
    )


def verify(message: str, signature_hex: str, hash_algorithm: str = "sha256",
           public_key_pem: str = None) -> dict:
    if not signature_hex:
        raise ValidationError("Signature is required", "missing_signature")
    if not public_key_pem:
        raise ValidationError(
            "A public key (PEM) is required to verify an RSA-PSS signature",
            "missing_key")
    digest = _hash(hash_algorithm)
    key = _load_public(public_key_pem)
    try:
        signature = bytes.fromhex("".join(signature_hex.split()))
    except ValueError as exc:
        raise ValidationError("Signature must be valid hexadecimal",
                              "invalid_hex") from exc
    digest_hex = _message_digest_hex(message, hash_algorithm)
    em = _recover_em(signature, key)
    salt_length = em["em_byte_len"] - _HASH_BYTES[hash_algorithm] - 2
    try:
        key.verify(signature, message.encode("utf-8"), _pss(digest), digest)
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
        step(2, "Recover the encoded message",
             "The RSA public operation EM′ = sᵉ mod n extracts the encoded "
             "message carried by the signature; the 0xBC trailer is checked.",
             "signature (hex)", "EM′ = sᵉ mod n",
             {"em_hex": em["em_hex"], "em_byte_len": em["em_byte_len"],
              "em_trailer_checked": em["em_trailer_checked"]}),
        step(3, "Verify the encoding",
             "The recovered EM is decoded against the recomputed digest "
             "(salt, maskedDB and the H column) and the trailer byte.",
             "EM′ + H(m)", "VALID" if valid else "INVALID",
             {"valid": valid, "salt_length_bytes": salt_length}),
    ]
    return build_result(
        "rsa_pss", "verify", message, {"hash": hash_algorithm}, valid, steps,
        {"valid": valid, "hash": hash_algorithm,
         "result": "VALID" if valid else "INVALID",
         "digest_hex": digest_hex,
         "salt_length_bytes": salt_length,
         "em_hex": em["em_hex"],
         "em_byte_len": em["em_byte_len"],
         "em_trailer_checked": em["em_trailer_checked"]},
    )


def get_metadata() -> dict:
    return METADATA
