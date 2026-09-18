"""HybridEncryptionService: RSA-OAEP key wrapping + AEAD."""

import base64

import pytest

from backend.app.lab import HybridEncryptionService, container
from backend.app.lab.errors import (
    LabAuthenticationError,
    LabCryptoError,
    LabValidationError,
)

SYMMETRIC = ["aes_gcm", "chacha20_poly1305"]


@pytest.mark.parametrize("symmetric_algorithm", SYMMETRIC)
def test_round_trip(symmetric_algorithm, binary_sample, rsa_keypair):
    filename, mime, data = binary_sample
    package = HybridEncryptionService.encrypt(
        data,
        rsa_keypair["public_key_pem"],
        symmetric_algorithm=symmetric_algorithm,
        filename=filename,
        mime_type=mime,
    )
    result = HybridEncryptionService.decrypt(package, rsa_keypair["private_key_pem"])
    assert result["data"] == data
    assert result["header"]["mode"] == "hybrid"
    assert result["header"]["key_algorithm"] == "rsa"
    assert result["header"]["algorithm"] == symmetric_algorithm
    assert result["header"]["original_filename"] == filename
    assert result["header"]["original_mime_type"] == mime


def test_container_has_wrapped_key_and_metadata(rsa_keypair):
    package = HybridEncryptionService.encrypt(b"data", rsa_keypair["public_key_pem"])
    header = container.parse(package)[0]
    assert header["wrapped_key_b64"]
    assert header["key_size"] == 2048
    assert header["kdf"] is None
    assert header["salt_b64"] is None


def test_tampered_ciphertext_fails_authentication(rsa_keypair):
    package = HybridEncryptionService.encrypt(b"important data", rsa_keypair["public_key_pem"])
    header, ciphertext = container.parse(package)
    tampered = bytearray(ciphertext)
    tampered[-1] ^= 0x01
    broken = container.serialize(header, bytes(tampered))
    with pytest.raises(LabAuthenticationError):
        HybridEncryptionService.decrypt(broken, rsa_keypair["private_key_pem"])


def test_swapped_wrapped_key_fails(rsa_keypair):
    first = HybridEncryptionService.encrypt(b"data", rsa_keypair["public_key_pem"])
    second = HybridEncryptionService.encrypt(b"data", rsa_keypair["public_key_pem"])
    header_a, ciphertext_a = container.parse(first)
    header_b, _ = container.parse(second)
    header_a["wrapped_key_b64"] = header_b["wrapped_key_b64"]
    mixed = container.serialize(header_a, ciphertext_a)
    with pytest.raises(LabCryptoError):
        HybridEncryptionService.decrypt(mixed, rsa_keypair["private_key_pem"])


def test_wrong_private_key_fails(rsa_keypair):
    from backend.app.lab import DigitalSignatureService

    other = DigitalSignatureService.generate_keys("rsa", rsa_bits=2048)
    package = HybridEncryptionService.encrypt(b"data", rsa_keypair["public_key_pem"])
    with pytest.raises(LabCryptoError):
        HybridEncryptionService.decrypt(package, other["private_key_pem"])


def test_non_rsa_key_rejected(ecdsa_keypair):
    with pytest.raises(LabValidationError):
        HybridEncryptionService.encrypt(b"data", ecdsa_keypair["public_key_pem"])


def test_undersized_rsa_key_rejected():
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.asymmetric import rsa

    try:
        small = rsa.generate_private_key(public_exponent=65537, key_size=512)
    except ValueError:
        pytest.skip("512-bit RSA generation not supported by this build.")
    public_pem = small.public_key().public_bytes(
        serialization.Encoding.PEM,
        serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode("ascii")
    with pytest.raises(LabValidationError):
        HybridEncryptionService.encrypt(b"data", public_pem)


def test_non_bytes_rejected(rsa_keypair):
    with pytest.raises(LabValidationError):
        HybridEncryptionService.encrypt("text", rsa_keypair["public_key_pem"])


def test_symmetric_only_container_rejected(rsa_keypair):
    from backend.app.lab import FileCryptoService

    symmetric = FileCryptoService.encrypt(b"data", key_hex="11" * 32)
    with pytest.raises(LabCryptoError):
        HybridEncryptionService.decrypt(symmetric, rsa_keypair["private_key_pem"])
