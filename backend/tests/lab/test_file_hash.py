"""FileHashService: known vectors, oracle cross-checks, binary data."""

import hashlib

import pytest

from backend.app.algorithms.blake3 import hash_bytes as project_blake3
from backend.app.lab import FileHashService
from backend.app.lab.errors import LabValidationError

KNOWN_ABC = {
    "md5": "900150983cd24fb0d6963f7d28e17f72",
    "sha1": "a9993e364706816aba3e25717850c26c9cd0d89d",
    "sha256": "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    "sha224": "23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7",
    "sha384": "cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed"
              "8086072ba1e7cc2358baeca134c825a7",
    "ripemd160": "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc",
}

ORACLE = ["md5", "sha1", "sha256", "sha512", "sha224", "sha384",
          "sha3", "blake2", "ripemd160"]


@pytest.mark.parametrize("algorithm,expected", KNOWN_ABC.items())
def test_known_vectors(algorithm, expected):
    assert FileHashService.hash_bytes(b"abc", algorithm)["digest_hex"] == expected


@pytest.mark.parametrize("algorithm", ORACLE)
def test_matches_hashlib_on_binary(algorithm, binary_sample):
    _, _, data = binary_sample
    result = FileHashService.hash_bytes(data, algorithm)
    oracle = hashlib.new(result["variant"])
    oracle.update(data)
    assert result["digest_hex"] == oracle.hexdigest()
    assert result["input_size"] == len(data)


def test_sha3_variants():
    for variant in ("sha3_224", "sha3_256", "sha3_384", "sha3_512"):
        result = FileHashService.hash_bytes(b"data", "sha3", variant=variant)
        assert result["digest_size"] == int(variant.split("_")[1]) // 8


def test_blake2_variants_and_default():
    assert FileHashService.hash_bytes(b"data", "blake2")["digest_size"] == 64
    assert FileHashService.hash_bytes(b"data", "blake2", variant="blake2s")["digest_size"] == 32


def test_blake3_matches_project_implementation(binary_sample):
    _, _, data = binary_sample
    result = FileHashService.hash_bytes(data, "blake3")
    assert result["digest_hex"] == project_blake3(data, 32)["digest"]
    assert result["digest_size"] == 32


def test_blake3_length_variant():
    result = FileHashService.hash_bytes(b"data", "blake3", variant=64)
    assert result["digest_size"] == 64
    assert len(result["digest_hex"]) == 128


def test_empty_input_round_trip():
    assert (
        FileHashService.hash_bytes(b"", "sha256")["digest_hex"]
        == hashlib.sha256(b"").hexdigest()
    )


def test_deterministic(binary_sample):
    _, _, data = binary_sample
    assert (
        FileHashService.hash_bytes(data, "sha256")["digest_hex"]
        == FileHashService.hash_bytes(data, "sha256")["digest_hex"]
    )


def test_verify_true_and_false_with_binary():
    data = bytes(range(256))
    digest = FileHashService.hash_bytes(data, "sha256")["digest_hex"]
    assert FileHashService.verify(digest, data, "sha256")
    assert not FileHashService.verify(digest, data + b"\x00", "sha256")
    assert not FileHashService.verify("00" * 32, data, "sha256")


def test_no_text_conversion_of_binary():
    # A payload that is invalid UTF-8 must hash identically to its raw bytes.
    data = b"\xff\xfe\x00\x80\x81"
    assert (
        FileHashService.hash_bytes(data, "sha256")["digest_hex"]
        == hashlib.sha256(data).hexdigest()
    )


def test_unsupported_algorithm_rejected():
    with pytest.raises(LabValidationError):
        FileHashService.hash_bytes(b"data", "crc32")


def test_non_bytes_rejected():
    with pytest.raises(LabValidationError):
        FileHashService.hash_bytes("text", "sha256")


def test_invalid_expected_digest_rejected():
    with pytest.raises(LabValidationError):
        FileHashService.verify("zz-not-hex", b"data", "sha256")
