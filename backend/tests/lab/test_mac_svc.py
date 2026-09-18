"""MACService: HMAC / AES-CMAC / Poly1305 known vectors and behaviour."""

import pytest

from backend.app.lab import MACService
from backend.app.lab.errors import LabValidationError

CMAC_KEY = "2b7e151628aed2a6abf7158809cf4f3c"
RFC4493_MSG = bytes.fromhex("6bc1bee22e409f96e93d7e117393172a")
POLY_KEY = "85d6be7857556d337f4452fe42d506a80103808afb0db2fd4abff6af4149f51b"


def test_hmac_sha256_rfc4231_vector():
    result = MACService.generate(
        b"what do ya want for nothing?", "Jefe", "hmac_sha256"
    )
    assert result["mac_hex"] == (
        "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843"
    )
    assert result["mac_size"] == 32


def test_hmac_sha512_rfc4231_vector():
    result = MACService.generate(
        b"what do ya want for nothing?", "Jefe", "hmac_sha512"
    )
    assert result["mac_size"] == 64


def test_cmac_rfc4493_empty_vector():
    # NIST/RFC 4493: AES-128-CMAC of the empty message.
    result = MACService.generate(b"", CMAC_KEY, "cmac_aes128")
    assert result["mac_hex"] == "bb1d6929e95937287fa37d129b756746"
    assert result["mac_size"] == 16


def test_cmac_rfc4493_single_block_vector():
    result = MACService.generate(RFC4493_MSG, CMAC_KEY, "cmac_aes128")
    assert result["mac_hex"] == "070a16b46b4d4144f79bdd9dd04a287c"


def test_poly1305_rfc8439_vector():
    result = MACService.generate(
        b"Cryptographic Forum Research Group", POLY_KEY, "poly1305"
    )
    assert result["mac_hex"] == "a8061dc1305136c6c22b8baf0c0127a9"
    assert result["mac_size"] == 16


@pytest.mark.parametrize(
    "algorithm,key",
    [
        ("hmac_sha256", "secret"),
        ("hmac_sha512", "secret"),
        ("cmac_aes128", CMAC_KEY),
        ("cmac_aes192", "2b7e151628aed2a6abf7158809cf4f3c" + "00" * 8),
        ("cmac_aes256", "2b7e151628aed2a6abf7158809cf4f3c" + "00" * 16),
        ("poly1305", POLY_KEY),
    ],
)
def test_generate_and_verify_roundtrip(algorithm, key):
    tag = MACService.generate(b"binary \x00\xff data", key, algorithm)["mac_hex"]
    assert MACService.verify(b"binary \x00\xff data", key, tag, algorithm)
    assert not MACService.verify(b"tampered", key, tag, algorithm)


def test_wrong_key_fails_verification():
    tag = MACService.generate(b"message", CMAC_KEY, "cmac_aes128")["mac_hex"]
    assert not MACService.verify(b"message", "00" * 16, tag, "cmac_aes128")


def test_cmac_requires_correct_key_size():
    with pytest.raises(LabValidationError):
        MACService.generate(b"data", "00" * 15, "cmac_aes128")


def test_poly1305_requires_32_byte_key():
    with pytest.raises(LabValidationError):
        MACService.generate(b"data", "00" * 16, "poly1305")


def test_non_hex_cmac_key_rejected():
    with pytest.raises(LabValidationError):
        MACService.generate(b"data", "not-hex", "cmac_aes128")


def test_unsupported_algorithm_rejected():
    with pytest.raises(LabValidationError):
        MACService.generate(b"data", "key", "md5_mac")


def test_non_bytes_data_rejected():
    with pytest.raises(LabValidationError):
        MACService.generate("text", "key", "hmac_sha256")


def test_empty_hmac_key_rejected():
    with pytest.raises(LabValidationError):
        MACService.generate(b"data", "", "hmac_sha256")


def test_invalid_mac_hex_rejected():
    with pytest.raises(LabValidationError):
        MACService.verify(b"data", "key", "zz", "hmac_sha256")
