"""HMACService: oracle cross-checks, verification and inputs."""

import hashlib
import hmac as stdlib_hmac

import pytest

from backend.app.lab import HMACService
from backend.app.lab.errors import LabValidationError

KEY = b"super-secret-shared-key"


@pytest.mark.parametrize("algorithm", ["sha256", "sha512"])
def test_matches_hashlib_oracle(algorithm, binary_sample):
    _, _, data = binary_sample
    result = HMACService.generate(data, KEY, algorithm)
    oracle = stdlib_hmac.new(KEY, data, getattr(hashlib, algorithm)).hexdigest()
    assert result["mac_hex"] == oracle
    assert result["algorithm"] == algorithm


def test_verify_true():
    result = HMACService.generate(b"message", KEY)
    assert HMACService.verify(b"message", KEY, result["mac_hex"])


def test_tampered_message_fails():
    result = HMACService.generate(b"message", KEY)
    assert not HMACService.verify(b"message!", KEY, result["mac_hex"])


def test_tampered_mac_fails():
    result = HMACService.generate(b"message", KEY)
    tampered = ("0" if result["mac_hex"][0] != "0" else "1") + result["mac_hex"][1:]
    assert not HMACService.verify(b"message", KEY, tampered)


def test_wrong_key_fails():
    result = HMACService.generate(b"message", KEY)
    assert not HMACService.verify(b"message", b"different-key", result["mac_hex"])


def test_algorithm_changes_mac():
    sha256 = HMACService.generate(b"message", KEY, "sha256")["mac_hex"]
    sha512 = HMACService.generate(b"message", KEY, "sha512")["mac_hex"]
    assert sha256 != sha512


def test_string_key_supported():
    assert HMACService.generate(b"m", "key")["mac_hex"] == HMACService.generate(b"m", b"key")["mac_hex"]


def test_invalid_mac_hex_rejected():
    with pytest.raises(LabValidationError):
        HMACService.verify(b"m", KEY, "not-hex")


def test_empty_key_rejected():
    with pytest.raises(LabValidationError):
        HMACService.generate(b"m", b"")


def test_unsupported_algorithm_rejected():
    with pytest.raises(LabValidationError):
        HMACService.generate(b"m", KEY, "md5")
