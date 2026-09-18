"""Shared binary fixtures for the Phase-2 lab service tests.

Fixtures are generated in-memory (no large files committed). A 256 KiB random
"video-like" blob exercises exactly the same binary-safe pipeline that a real
media file would; it is small enough to stay fast in CI.
"""

import os

import pytest

# Canonical 1x1 transparent PNG (real, decodable image bytes).
PNG_1X1 = bytes.fromhex(
    "89504e470d0a1a0a0000000d494844520000000100000001080600000"
    "01f15c4890000000a49444154789c63000100000500010d0a2db4000000"
    "0049454e44ae426082"
)

# Minimal JPEG: SOI + APP0/JFIF + COM + EOI markers with a scan payload.
JPEG_MIN = (
    bytes.fromhex("ffd8ffe000104a46494600010100000100010000")
    + bytes.fromhex("fffe001b") + b"binary-safe jpeg fixture" + bytes.fromhex("ffd9")
)

PDF_MIN = (
    b"%PDF-1.4\n"
    b"1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
    b"2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\n"
    b"trailer<</Root 1 0 R>>\n"
    b"%%EOF\n"
)


def _random_binary(size: int) -> bytes:
    # Include NUL, 0xFF and invalid-UTF-8 bytes to prove binary safety.
    blob = bytearray(os.urandom(size))
    blob[0:6] = b"\x00\xff\xfe\x80\x00\x01"
    return bytes(blob)


BINARY_SAMPLES = {
    "txt": ("note.txt", "text/plain", b"The quick brown fox jumps over the lazy dog.\n" * 4),
    "png": ("diagram.png", "image/png", PNG_1X1),
    "jpg": ("photo.jpg", "image/jpeg", JPEG_MIN),
    "pdf": ("report.pdf", "application/pdf", PDF_MIN),
    "bin": ("payload.bin", "application/octet-stream", _random_binary(4096)),
    "video": ("clip.mp4", "video/mp4", _random_binary(256 * 1024)),
}

SAMPLE_IDS = list(BINARY_SAMPLES)


@pytest.fixture(params=SAMPLE_IDS)
def binary_sample(request):
    """Parametrized (filename, mime, data) for each binary fixture."""
    return BINARY_SAMPLES[request.param]


@pytest.fixture(scope="session")
def rsa_keypair():
    from backend.app.lab.signatures import DigitalSignatureService

    return DigitalSignatureService.generate_keys("rsa", rsa_bits=2048)


@pytest.fixture(scope="session")
def ecdsa_keypair():
    from backend.app.lab.signatures import DigitalSignatureService

    return DigitalSignatureService.generate_keys("ecdsa", curve="p256")


@pytest.fixture(scope="session")
def ed25519_keypair():
    from backend.app.lab.signatures import DigitalSignatureService

    return DigitalSignatureService.generate_keys("ed25519")
