"""Pydantic schemas for the Phase-3 lab API (``/api/lab/*``).

These are transport-only DTOs. All cryptography is delegated to the tested
Phase-2 services in ``backend.app.lab`` — no logic lives here.
"""

from __future__ import annotations

from typing import Dict, List, Optional, Union

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# File encryption / decryption (symmetric AEAD).
# ---------------------------------------------------------------------------


class LabFileEncryptRequest(BaseModel):
    data_b64: str = Field(..., description="Raw file bytes, base64-encoded")
    filename: str = Field(default="", description="Original file name")
    mime_type: str = Field(default="", description="Original MIME type")
    algorithm: str = Field(default="aes_gcm", description="aes_gcm | chacha20_poly1305")
    password: Optional[str] = Field(default=None, description="Password (if no key supplied)")
    key_hex: Optional[str] = Field(default=None, description="32-byte key as hex")
    kdf: str = Field(default="pbkdf2_sha256", description="pbkdf2_sha256 | argon2id")


class LabFileDecryptRequest(BaseModel):
    container_b64: str = Field(..., description="Container (.hcs) bytes, base64-encoded")
    password: Optional[str] = Field(default=None)
    key_hex: Optional[str] = Field(default=None)


# ---------------------------------------------------------------------------
# Digital signatures.
# ---------------------------------------------------------------------------


class LabKeyGenRequest(BaseModel):
    algorithm: str = Field(..., description="rsa | ecdsa | ed25519")
    rsa_bits: int = Field(default=2048, description="2048 / 3072 / 4096 (RSA only)")
    curve: str = Field(default="p256", description="p256 | p384 | p521 (ECDSA only)")


class LabSignRequest(BaseModel):
    data_b64: str = Field(..., description="Raw bytes to sign, base64-encoded")
    algorithm: str = Field(..., description="rsa | ecdsa | ed25519")
    private_key_pem: str = Field(..., description="PEM private key")
    hash_algorithm: str = Field(default="sha256", description="sha256 | sha384 | sha512")


class LabVerifyRequest(BaseModel):
    data_b64: str
    signature_hex: str
    algorithm: str
    public_key_pem: str
    hash_algorithm: str = Field(default="sha256")


# ---------------------------------------------------------------------------
# File hashing / integrity.
# ---------------------------------------------------------------------------


class LabHashRequest(BaseModel):
    data_b64: str
    algorithm: str = Field(..., description="md5|sha1|sha256|sha512|sha3|blake2|blake3")
    variant: Optional[Union[str, int]] = Field(default=None)


class LabHashVerifyRequest(BaseModel):
    data_b64: str
    expected_hex: str
    algorithm: str
    variant: Optional[Union[str, int]] = Field(default=None)


# ---------------------------------------------------------------------------
# HMAC.
# ---------------------------------------------------------------------------


class LabHmacGenerateRequest(BaseModel):
    data_b64: str
    key: str = Field(..., description="Shared secret key (text)")
    algorithm: str = Field(default="sha256", description="sha256 | sha512")


class LabHmacVerifyRequest(BaseModel):
    data_b64: str
    key: str
    mac_hex: str
    algorithm: str = Field(default="sha256")


# ---------------------------------------------------------------------------
# General MAC lab (HMAC / AES-CMAC / Poly1305).
# ---------------------------------------------------------------------------


class LabMacGenerateRequest(BaseModel):
    data_b64: str
    key: str = Field(
        ...,
        description="HMAC text key, or hex-encoded AES/Poly1305 key",
    )
    algorithm: str = Field(
        default="hmac_sha256",
        description="hmac_sha256 | hmac_sha512 | cmac_aes128 | cmac_aes192 "
                    "| cmac_aes256 | poly1305",
    )


class LabMacVerifyRequest(BaseModel):
    data_b64: str
    key: str
    mac_hex: str
    algorithm: str = Field(default="hmac_sha256")


# ---------------------------------------------------------------------------
# Hybrid encryption.
# ---------------------------------------------------------------------------


class LabHybridEncryptRequest(BaseModel):
    data_b64: str
    public_key_pem: str
    symmetric_algorithm: str = Field(default="aes_gcm")
    hash_algorithm: str = Field(default="sha256")
    filename: str = Field(default="")
    mime_type: str = Field(default="")


class LabHybridDecryptRequest(BaseModel):
    container_b64: str
    private_key_pem: str


# ---------------------------------------------------------------------------
# X.509 certificates / PKI.
# ---------------------------------------------------------------------------


class LabSubject(BaseModel):
    common_name: str = Field(default="", description="X.509 common name (CN)")
    organization: Optional[str] = None
    organizational_unit: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    locality: Optional[str] = None
    email: Optional[str] = None


class LabSelfSignedRequest(BaseModel):
    algorithm: str = Field(..., description="rsa | ecdsa | ed25519")
    private_key_pem: str
    subject: LabSubject
    validity_days: int = Field(default=365, ge=1)
    is_ca: bool = False
    key_usage: Optional[Dict[str, bool]] = None
    extended_key_usage: Optional[List[str]] = None
    san_dns: Optional[List[str]] = None
    san_ip: Optional[List[str]] = None
    san_email: Optional[List[str]] = None
    san_uri: Optional[List[str]] = None
    hash_algorithm: str = Field(default="sha256")


class LabCaRequest(BaseModel):
    algorithm: str
    private_key_pem: str
    subject: LabSubject
    validity_days: int = Field(default=3650, ge=1)
    hash_algorithm: str = Field(default="sha256")


class LabCsrRequest(BaseModel):
    algorithm: str
    private_key_pem: str
    subject: LabSubject
    san_dns: Optional[List[str]] = None
    san_ip: Optional[List[str]] = None
    san_email: Optional[List[str]] = None
    san_uri: Optional[List[str]] = None
    hash_algorithm: str = Field(default="sha256")


class LabSignCertificateRequest(BaseModel):
    csr_pem: str
    ca_certificate_pem: str
    ca_private_key_pem: str
    validity_days: int = Field(default=365, ge=1)
    is_ca: bool = False
    key_usage: Optional[Dict[str, bool]] = None
    extended_key_usage: Optional[List[str]] = None
    san_dns: Optional[List[str]] = None
    san_ip: Optional[List[str]] = None
    san_email: Optional[List[str]] = None
    san_uri: Optional[List[str]] = None
    hash_algorithm: str = Field(default="sha256")


class LabCertificateRequest(BaseModel):
    certificate: str = Field(default="", description="PEM text (or DER base64 in certificate_b64)")
    certificate_b64: Optional[str] = Field(default=None, description="DER bytes, base64-encoded")


class LabCertificateVerifyRequest(LabCertificateRequest):
    ca_certificate: str = Field(default="", description="Optional issuer CA certificate (PEM)")
    expected_hostname: Optional[str] = None


class LabChainVerifyRequest(BaseModel):
    chain: List[str] = Field(..., description="Ordered chain, leaf first and root last")


class LabCertSignRequest(BaseModel):
    data_b64: str
    algorithm: str
    private_key_pem: str
    certificate: str
    hash_algorithm: str = Field(default="sha256")


class LabCertVerifyRequest(BaseModel):
    data_b64: str
    signature_hex: str
    algorithm: str
    certificate: str
    ca_certificate: str = Field(default="")
    expected_hostname: Optional[str] = None
    hash_algorithm: str = Field(default="sha256")
