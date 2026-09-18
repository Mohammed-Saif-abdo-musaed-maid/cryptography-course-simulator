"""FileCryptoService: binary-safe round-trips, tampering and key handling."""

import base64

import pytest

from backend.app.lab import FileCryptoService, container
from backend.app.lab.errors import LabAuthenticationError, LabValidationError

ALGORITHMS = ["aes_gcm", "chacha20_poly1305"]
KEY_HEX = "11" * 32


@pytest.mark.parametrize("algorithm", ALGORITHMS)
def test_key_round_trip(algorithm, binary_sample):
    filename, mime, data = binary_sample
    package = FileCryptoService.encrypt(
        data, algorithm=algorithm, key_hex=KEY_HEX, filename=filename, mime_type=mime
    )
    result = FileCryptoService.decrypt(package, key_hex=KEY_HEX)
    assert result["data"] == data
    assert result["header"]["original_filename"] == filename
    assert result["header"]["original_mime_type"] == mime
    assert result["header"]["original_size"] == len(data)


@pytest.mark.parametrize("algorithm", ALGORITHMS)
def test_password_round_trip(algorithm, binary_sample):
    filename, mime, data = binary_sample
    package = FileCryptoService.encrypt(
        data,
        algorithm=algorithm,
        password="correct horse battery staple",
        filename=filename,
        mime_type=mime,
    )
    result = FileCryptoService.decrypt(package, password="correct horse battery staple")
    assert result["data"] == data
    assert result["header"]["kdf"] == "pbkdf2_sha256"


def test_argon2id_password_round_trip(binary_sample):
    _, _, data = binary_sample
    package = FileCryptoService.encrypt(data, password="s3cret", kdf="argon2id")
    assert container.parse(package)[0]["kdf"] == "argon2id"
    assert FileCryptoService.decrypt(package, password="s3cret")["data"] == data


def test_wrong_password_fails_authentication():
    package = FileCryptoService.encrypt(b"top secret", password="right")
    with pytest.raises(LabAuthenticationError):
        FileCryptoService.decrypt(package, password="wrong")


def test_wrong_key_fails_authentication():
    package = FileCryptoService.encrypt(b"top secret", key_hex=KEY_HEX)
    with pytest.raises(LabAuthenticationError):
        FileCryptoService.decrypt(package, key_hex="22" * 32)


def test_tampered_ciphertext_fails_authentication():
    package = FileCryptoService.encrypt(b"important payload", key_hex=KEY_HEX)
    header, ciphertext = container.parse(package)
    tampered = bytearray(ciphertext)
    tampered[0] ^= 0x01
    broken = container.serialize(header, bytes(tampered))
    with pytest.raises(LabAuthenticationError):
        FileCryptoService.decrypt(broken, key_hex=KEY_HEX)


def test_tampered_tag_fails_authentication():
    package = FileCryptoService.encrypt(b"important payload", key_hex=KEY_HEX)
    header, _ = container.parse(package)
    tag = bytearray(base64.b64decode(header["tag_b64"]))
    tag[0] ^= 0xFF
    header["tag_b64"] = base64.b64encode(bytes(tag)).decode("ascii")
    with pytest.raises(LabAuthenticationError):
        FileCryptoService.decrypt(container.serialize(header, b"x"), key_hex=KEY_HEX)


def test_metadata_preserved_for_named_file():
    package = FileCryptoService.encrypt(
        b"data", key_hex=KEY_HEX, filename="archive.TAR.GZ", mime_type="application/gzip"
    )
    header = container.parse(package)[0]
    assert header["original_filename"] == "archive.TAR.GZ"
    assert header["original_extension"] == ".gz"


def test_nonce_and_container_differ_each_time():
    first = FileCryptoService.encrypt(b"same data", key_hex=KEY_HEX)
    second = FileCryptoService.encrypt(b"same data", key_hex=KEY_HEX)
    assert first != second
    assert container.parse(first)[0]["nonce_b64"] != container.parse(second)[0]["nonce_b64"]


def test_empty_payload_round_trip():
    package = FileCryptoService.encrypt(b"", key_hex=KEY_HEX)
    assert FileCryptoService.decrypt(package, key_hex=KEY_HEX)["data"] == b""


def test_unsupported_algorithm_rejected():
    with pytest.raises(LabValidationError):
        FileCryptoService.encrypt(b"x", key_hex=KEY_HEX, algorithm="des")


def test_missing_secret_rejected():
    with pytest.raises(LabValidationError):
        FileCryptoService.encrypt(b"x")


def test_bad_key_length_rejected():
    with pytest.raises(LabValidationError):
        FileCryptoService.encrypt(b"x", key_hex="00")


def test_text_input_rejected():
    with pytest.raises(LabValidationError):
        FileCryptoService.encrypt("plain text is not bytes", key_hex=KEY_HEX)
