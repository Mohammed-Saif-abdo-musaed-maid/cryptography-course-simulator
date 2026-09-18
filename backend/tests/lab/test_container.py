"""Versioned container format tests."""

import json
import struct

import pytest

from backend.app.lab import container
from backend.app.lab.errors import LabCryptoError, LabValidationError


def _header(**overrides):
    base = container.new_header(
        mode="symmetric",
        algorithm="aes_gcm",
        kdf=None,
        kdf_params={},
        salt_b64=None,
        nonce_b64="AAAAAAAAAAAAAAAA",
        tag_b64="AAAAAAAAAAAAAAAAAAAAAA==",
        original_filename="a.txt",
        original_extension=".txt",
        original_mime_type="text/plain",
        original_size=3,
    )
    base.update(overrides)
    return base


def test_round_trip_preserves_header_and_payload():
    payload = b"\x00\xff\x10binary"
    package = container.serialize(_header(), payload)
    header, recovered = container.parse(package)
    assert recovered == payload
    assert header["ciphertext_length"] == len(payload)
    assert header["magic"] == "HCS"
    assert header["version"] == container.FORMAT_VERSION


def test_magic_is_prefix_and_version_byte_present():
    package = container.serialize(_header(), b"x")
    assert package[:3] == container.MAGIC
    assert package[3] == container.FORMAT_VERSION


def test_unknown_magic_rejected():
    package = bytearray(container.serialize(_header(), b"x"))
    package[0] = ord("X")
    with pytest.raises(LabCryptoError):
        container.parse(bytes(package))


def test_unsupported_version_rejected():
    package = bytearray(container.serialize(_header(), b"x"))
    package[3] = 99
    with pytest.raises(LabCryptoError):
        container.parse(bytes(package))


def test_truncated_payload_rejected():
    package = container.serialize(_header(original_size=5), b"12345")
    with pytest.raises(LabCryptoError):
        container.parse(package[:-1])


def test_bad_mode_rejected_by_serialize():
    with pytest.raises(LabCryptoError):
        container.serialize(_header(mode="rot13"), b"x")


def test_non_bytes_rejected():
    with pytest.raises(LabValidationError):
        container.parse("not-bytes")
    with pytest.raises(LabValidationError):
        container.serialize(_header(), "not-bytes")


def test_header_is_plain_json_after_prefix():
    package = container.serialize(_header(), b"abc")
    header_len = struct.unpack(">I", package[4:8])[0]
    parsed = json.loads(package[8:8 + header_len].decode("utf-8"))
    assert parsed["algorithm"] == "aes_gcm"
