"""DigitalSignatureService - real public-key signatures over bytes.

Supported (Phase 1 verified) algorithms:

* ``rsa``     - RSA-PSS with MGF1 + SHA-256 (never raw/textbook RSA)
* ``ecdsa``   - ECDSA on P-256 / P-384 / P-521
* ``ed25519`` - Ed25519 (EdDSA)

Keys are exchanged as standard PEM (PKCS#8 private / SubjectPublicKeyInfo
public). Files are signed by passing their raw bytes to the same
``sign``/``verify`` methods used for text - no separate crypto path.
"""

from __future__ import annotations

from typing import Any, Dict, Optional

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec, ed25519, padding, rsa

from backend.app.lab.errors import LabValidationError

ALGORITHMS = ("rsa", "ecdsa", "ed25519")
RSA_SIZES = (2048, 3072, 4096)
CURVES = {
    "p256": ec.SECP256R1,
    "p384": ec.SECP384R1,
    "p521": ec.SECP521R1,
}
HASHES = {
    "sha256": hashes.SHA256,
    "sha384": hashes.SHA384,
    "sha512": hashes.SHA512,
}

_PUBLIC_FORMAT = serialization.PublicFormat.SubjectPublicKeyInfo
_PRIVATE_FORMAT = serialization.PrivateFormat.PKCS8


def _hash(name: str):
    if name not in HASHES:
        raise LabValidationError("Unsupported hash algorithm for signatures.")
    return HASHES[name]()


def _pss_padding(name: str) -> padding.PSS:
    return padding.PSS(mgf=padding.MGF1(_hash(name)), salt_length=padding.PSS.MAX_LENGTH)


class DigitalSignatureService:
    """Sign and verify bytes with RSA-PSS, ECDSA or Ed25519."""

    algorithms = ALGORITHMS

    @staticmethod
    def generate_keys(
        algorithm: str,
        *,
        rsa_bits: int = 2048,
        curve: str = "p256",
    ) -> Dict[str, Any]:
        if algorithm == "rsa":
            if rsa_bits not in RSA_SIZES:
                raise LabValidationError("RSA key size must be 2048, 3072 or 4096 bits.")
            private = rsa.generate_private_key(public_exponent=65537, key_size=rsa_bits)
            return {
                "algorithm": "rsa",
                "key_size": rsa_bits,
                "private_key_pem": _pem_private(private),
                "public_key_pem": _pem_public(private.public_key()),
            }
        if algorithm == "ecdsa":
            if curve not in CURVES:
                raise LabValidationError("ECDSA curve must be p256, p384 or p521.")
            private = ec.generate_private_key(CURVES[curve]())
            return {
                "algorithm": "ecdsa",
                "curve": curve,
                "private_key_pem": _pem_private(private),
                "public_key_pem": _pem_public(private.public_key()),
            }
        if algorithm == "ed25519":
            private = ed25519.Ed25519PrivateKey.generate()
            return {
                "algorithm": "ed25519",
                "private_key_pem": _pem_private(private),
                "public_key_pem": _pem_public(private.public_key()),
            }
        raise LabValidationError("Unsupported signature algorithm.")

    @staticmethod
    def sign(
        data: bytes,
        *,
        algorithm: str,
        private_key_pem: str,
        hash_algorithm: str = "sha256",
    ) -> Dict[str, Any]:
        """Sign raw bytes; returns hex signature plus metadata."""
        if not isinstance(data, (bytes, bytearray)):
            raise LabValidationError("Data to sign must be bytes.")
        private = _load_private(algorithm, private_key_pem)
        payload = bytes(data)

        if algorithm == "rsa":
            signature = private.sign(payload, _pss_padding(hash_algorithm), _hash(hash_algorithm))
        elif algorithm == "ecdsa":
            signature = private.sign(payload, ec.ECDSA(_hash(hash_algorithm)))
        else:  # ed25519
            signature = private.sign(payload)

        return {
            "algorithm": algorithm,
            "hash_algorithm": hash_algorithm if algorithm != "ed25519" else None,
            "signature_hex": signature.hex(),
            "signature_size": len(signature),
            "data_size": len(payload),
        }

    @staticmethod
    def verify(
        data: bytes,
        signature_hex: str,
        *,
        algorithm: str,
        public_key_pem: str,
        hash_algorithm: str = "sha256",
    ) -> bool:
        """Return ``True`` for a valid signature, ``False`` otherwise."""
        if not isinstance(data, (bytes, bytearray)):
            raise LabValidationError("Data to verify must be bytes.")
        if not isinstance(signature_hex, str) or not signature_hex:
            raise LabValidationError("Signature must be a non-empty hex string.")
        try:
            signature = bytes.fromhex("".join(signature_hex.split()))
        except ValueError as exc:
            raise LabValidationError("Signature is not valid hexadecimal.") from exc

        public = _load_public(algorithm, public_key_pem)
        payload = bytes(data)
        try:
            if algorithm == "rsa":
                public.verify(signature, payload, _pss_padding(hash_algorithm), _hash(hash_algorithm))
            elif algorithm == "ecdsa":
                public.verify(signature, payload, ec.ECDSA(_hash(hash_algorithm)))
            else:  # ed25519
                public.verify(signature, payload)
            return True
        except InvalidSignature:
            return False


def _pem_private(key) -> str:
    return key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=_PRIVATE_FORMAT,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode("ascii")


def _pem_public(key) -> str:
    return key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=_PUBLIC_FORMAT,
    ).decode("ascii")


def _load_private(algorithm: str, pem: str):
    if algorithm not in ALGORITHMS:
        raise LabValidationError("Unsupported signature algorithm.")
    if not isinstance(pem, str) or "PRIVATE KEY" not in pem:
        raise LabValidationError("A PEM-encoded private key is required.")
    try:
        key = serialization.load_pem_private_key(pem.encode("utf-8"), password=None)
    except Exception as exc:  # noqa: BLE001 - normalize library errors
        raise LabValidationError("Could not load the private key (invalid PEM).") from exc
    if not _matches(algorithm, key):
        raise LabValidationError("Private key type does not match the chosen algorithm.")
    return key


def _load_public(algorithm: str, pem: str):
    if algorithm not in ALGORITHMS:
        raise LabValidationError("Unsupported signature algorithm.")
    if not isinstance(pem, str) or "PUBLIC KEY" not in pem:
        raise LabValidationError("A PEM-encoded public key is required.")
    try:
        key = serialization.load_pem_public_key(pem.encode("utf-8"))
    except Exception as exc:  # noqa: BLE001 - normalize library errors
        raise LabValidationError("Could not load the public key (invalid PEM).") from exc
    if not _matches(algorithm, key):
        raise LabValidationError("Public key type does not match the chosen algorithm.")
    return key


def _matches(algorithm: str, key) -> bool:
    if algorithm == "rsa":
        return isinstance(key, rsa.RSAPrivateKey) or isinstance(key, rsa.RSAPublicKey)
    if algorithm == "ecdsa":
        return isinstance(key, ec.EllipticCurvePrivateKey) or isinstance(
            key, ec.EllipticCurvePublicKey
        )
    if algorithm == "ed25519":
        return isinstance(key, ed25519.Ed25519PrivateKey) or isinstance(
            key, ed25519.Ed25519PublicKey
        )
    return False
