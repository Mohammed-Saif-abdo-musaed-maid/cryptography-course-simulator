"""Reusable backend crypto services for the planned File / Signature labs.

This package is additive: it does not change any existing algorithm
implementation, route or API contract. Services:

* :class:`FileCryptoService`      - AES-GCM / ChaCha20-Poly1305 over bytes
* :class:`DigitalSignatureService`- RSA-PSS / ECDSA / Ed25519 sign & verify
* :class:`FileHashService`        - MD5/SHA-1/SHA-256/SHA-512/SHA-3/BLAKE2/BLAKE3
* :class:`HMACService`            - keyed MAC generate & verify
* :class:`MACService`             - HMAC / AES-CMAC / Poly1305 generate & verify
* :class:`HybridEncryptionService`- RSA-OAEP wrapped AEAD file encryption
* :class:`PKIService`             - real X.509 certificates & PKCS#10 CSRs
"""

from backend.app.lab.container import FORMAT_VERSION, MAGIC, parse, serialize
from backend.app.lab.errors import (
    LabAuthenticationError,
    LabCryptoError,
    LabValidationError,
)
from backend.app.lab.file_crypto import FileCryptoService
from backend.app.lab.file_hash import FileHashService
from backend.app.lab.hmac_svc import HMACService
from backend.app.lab.hybrid import HybridEncryptionService
from backend.app.lab.mac_svc import MACService
from backend.app.lab.pki import PKIService
from backend.app.lab.signatures import DigitalSignatureService

__all__ = [
    "FileCryptoService",
    "DigitalSignatureService",
    "FileHashService",
    "HMACService",
    "MACService",
    "HybridEncryptionService",
    "PKIService",
    "LabCryptoError",
    "LabValidationError",
    "LabAuthenticationError",
    "MAGIC",
    "FORMAT_VERSION",
    "serialize",
    "parse",
]
