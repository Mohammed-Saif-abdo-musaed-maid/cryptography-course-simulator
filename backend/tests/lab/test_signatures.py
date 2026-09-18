"""DigitalSignatureService: RSA-PSS / ECDSA / Ed25519 over binary data."""

import pytest

from backend.app.lab import DigitalSignatureService
from backend.app.lab.errors import LabValidationError

ALGORITHMS = ["rsa", "ecdsa", "ed25519"]


def _keypair(name, request):
    return request.getfixturevalue(name)


@pytest.mark.parametrize("algorithm", ALGORITHMS)
def test_sign_verify_round_trip(algorithm, binary_sample, request):
    _, _, data = binary_sample
    keys = _keypair(f"{algorithm}_keypair", request)
    result = DigitalSignatureService.sign(
        data, algorithm=algorithm, private_key_pem=keys["private_key_pem"]
    )
    assert result["algorithm"] == algorithm
    assert DigitalSignatureService.verify(
        data,
        result["signature_hex"],
        algorithm=algorithm,
        public_key_pem=keys["public_key_pem"],
    )


@pytest.mark.parametrize("algorithm", ALGORITHMS)
def test_tampered_data_fails_verification(algorithm, request):
    keys = _keypair(f"{algorithm}_keypair", request)
    signed = DigitalSignatureService.sign(
        b"original bytes", algorithm=algorithm, private_key_pem=keys["private_key_pem"]
    )
    assert not DigitalSignatureService.verify(
        b"modified bytes",
        signed["signature_hex"],
        algorithm=algorithm,
        public_key_pem=keys["public_key_pem"],
    )


@pytest.mark.parametrize("algorithm", ALGORITHMS)
def test_tampered_signature_fails_verification(algorithm, request):
    keys = _keypair(f"{algorithm}_keypair", request)
    signed = DigitalSignatureService.sign(
        b"payload", algorithm=algorithm, private_key_pem=keys["private_key_pem"]
    )
    signature = bytearray(bytes.fromhex(signed["signature_hex"]))
    signature[0] ^= 0x01
    assert not DigitalSignatureService.verify(
        b"payload",
        bytes(signature).hex(),
        algorithm=algorithm,
        public_key_pem=keys["public_key_pem"],
    )


@pytest.mark.parametrize("algorithm", ALGORITHMS)
def test_wrong_public_key_fails_verification(algorithm, request):
    keys = _keypair(f"{algorithm}_keypair", request)
    other = DigitalSignatureService.generate_keys(
        algorithm, rsa_bits=2048, curve="p256"
    )
    signed = DigitalSignatureService.sign(
        b"payload", algorithm=algorithm, private_key_pem=keys["private_key_pem"]
    )
    assert not DigitalSignatureService.verify(
        b"payload",
        signed["signature_hex"],
        algorithm=algorithm,
        public_key_pem=other["public_key_pem"],
    )


def test_rsa_pss_signature_matches_modulus_size(rsa_keypair):
    signed = DigitalSignatureService.sign(
        b"data", algorithm="rsa", private_key_pem=rsa_keypair["private_key_pem"]
    )
    assert signed["signature_size"] == rsa_keypair["key_size"] // 8


@pytest.mark.parametrize("curve", ["p256", "p384", "p521"])
def test_ecdsa_curves_round_trip(curve):
    keys = DigitalSignatureService.generate_keys("ecdsa", curve=curve)
    signed = DigitalSignatureService.sign(
        b"curve test", algorithm="ecdsa", private_key_pem=keys["private_key_pem"]
    )
    assert DigitalSignatureService.verify(
        b"curve test",
        signed["signature_hex"],
        algorithm="ecdsa",
        public_key_pem=keys["public_key_pem"],
    )


def test_invalid_signature_hex_rejected(ed25519_keypair):
    with pytest.raises(LabValidationError):
        DigitalSignatureService.verify(
            b"data",
            "not-hex",
            algorithm="ed25519",
            public_key_pem=ed25519_keypair["public_key_pem"],
        )


def test_key_type_mismatch_rejected(ed25519_keypair, rsa_keypair):
    with pytest.raises(LabValidationError):
        DigitalSignatureService.sign(
            b"data", algorithm="rsa", private_key_pem=ed25519_keypair["private_key_pem"]
        )
    with pytest.raises(LabValidationError):
        DigitalSignatureService.verify(
            b"data",
            "00",
            algorithm="ed25519",
            public_key_pem=rsa_keypair["public_key_pem"],
        )


def test_unsupported_algorithm_rejected(rsa_keypair):
    with pytest.raises(LabValidationError):
        DigitalSignatureService.sign(
            b"data", algorithm="dsa", private_key_pem=rsa_keypair["private_key_pem"]
        )


def test_bad_pem_rejected():
    with pytest.raises(LabValidationError):
        DigitalSignatureService.sign(
            b"data", algorithm="rsa", private_key_pem="not a pem"
        )
