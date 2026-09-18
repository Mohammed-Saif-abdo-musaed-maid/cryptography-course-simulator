"""Lab API route tests (``/api/lab/*``) using FastAPI TestClient."""

import base64

import pytest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.lab import DigitalSignatureService

client = TestClient(app)

PNG_1X1 = bytes.fromhex(
    "89504e470d0a1a0a0000000d494844520000000100000001080600000"
    "01f15c4890000000a49444154789c63000100000500010d0a2db4000000"
    "0049454e44ae426082"
)
BINARY = b"\x00\xff\xfe\x80PNG\x00binary\x00payload"


def b64(data: bytes) -> str:
    return base64.b64encode(data).decode("ascii")


def unb64(value: str) -> bytes:
    return base64.b64decode(value)


class TestLabInfo:
    def test_info_lists_algorithms(self):
        body = client.get("/api/lab/info").json()
        assert "aes_gcm" in body["file_algorithms"]
        assert "aes_ccm" in body["file_algorithms"]
        assert "rsa" in body["signature_algorithms"]
        assert "sha256" in body["hash_algorithms"]
        assert "sha224" in body["hash_algorithms"]
        assert "ripemd160" in body["hash_algorithms"]
        assert "cmac_aes128" in body["mac_algorithms"]
        assert "poly1305" in body["mac_algorithms"]
        assert body["max_file_bytes"] == 8 * 1024 * 1024


class TestFileCryptoApi:
    @pytest.mark.parametrize("algorithm", ["aes_gcm", "aes_ccm", "chacha20_poly1305"])
    def test_encrypt_decrypt_round_trip(self, algorithm):
        encrypted = client.post(
            "/api/lab/file/encrypt",
            json={
                "data_b64": b64(PNG_1X1),
                "filename": "image.png",
                "mime_type": "image/png",
                "algorithm": algorithm,
                "password": "correct horse",
            },
        )
        assert encrypted.status_code == 200
        body = encrypted.json()
        assert body["metadata"]["original_filename"] == "image.png"
        assert body["metadata"]["mode"] == "symmetric"

        decrypted = client.post(
            "/api/lab/file/decrypt",
            json={"container_b64": body["container_b64"], "password": "correct horse"},
        )
        assert decrypted.status_code == 200
        assert unb64(decrypted.json()["data_b64"]) == PNG_1X1

    def test_wrong_password_returns_422(self):
        encrypted = client.post(
            "/api/lab/file/encrypt",
            json={"data_b64": b64(b"secret"), "password": "right"},
        ).json()
        response = client.post(
            "/api/lab/file/decrypt",
            json={"container_b64": encrypted["container_b64"], "password": "wrong"},
        )
        assert response.status_code == 422
        assert response.json()["error"] == "authentication_failed"

    def test_invalid_base64_rejected(self):
        response = client.post(
            "/api/lab/file/encrypt",
            json={"data_b64": "!!!not-base64!!!", "password": "x"},
        )
        assert response.status_code == 422
        assert response.json()["error"] == "invalid_base64"


class TestSignatureApi:
    def _keypair(self, algorithm):
        return client.post(
            "/api/lab/signature/keys", json={"algorithm": algorithm}
        ).json()

    @pytest.mark.parametrize("algorithm", ["rsa", "ecdsa", "ed25519"])
    def test_sign_verify_round_trip(self, algorithm):
        keys = self._keypair(algorithm)
        signed = client.post(
            "/api/lab/signature/sign",
            json={
                "data_b64": b64(BINARY),
                "algorithm": algorithm,
                "private_key_pem": keys["private_key_pem"],
            },
        )
        assert signed.status_code == 200
        verified = client.post(
            "/api/lab/signature/verify",
            json={
                "data_b64": b64(BINARY),
                "signature_hex": signed.json()["signature_hex"],
                "algorithm": algorithm,
                "public_key_pem": keys["public_key_pem"],
            },
        )
        assert verified.status_code == 200
        assert verified.json()["valid"] is True

    def test_modified_data_is_invalid(self):
        keys = self._keypair("ed25519")
        signed = client.post(
            "/api/lab/signature/sign",
            json={
                "data_b64": b64(b"original"),
                "algorithm": "ed25519",
                "private_key_pem": keys["private_key_pem"],
            },
        ).json()
        verified = client.post(
            "/api/lab/signature/verify",
            json={
                "data_b64": b64(b"modified"),
                "signature_hex": signed["signature_hex"],
                "algorithm": "ed25519",
                "public_key_pem": keys["public_key_pem"],
            },
        )
        assert verified.json()["valid"] is False


class TestHashApi:
    def test_sha256_known_vector(self):
        body = client.post(
            "/api/lab/hash", json={"data_b64": b64(b"abc"), "algorithm": "sha256"}
        ).json()
        assert (
            body["digest_hex"]
            == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
        )

    @pytest.mark.parametrize("algorithm,expected", [
        ("sha224", "23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7"),
        ("ripemd160", "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc"),
    ])
    def test_phase5_hash_vectors(self, algorithm, expected):
        body = client.post(
            "/api/lab/hash", json={"data_b64": b64(b"abc"), "algorithm": algorithm}
        ).json()
        assert body["digest_hex"] == expected

    def test_blake3_supported(self):
        body = client.post(
            "/api/lab/hash", json={"data_b64": b64(b"abc"), "algorithm": "blake3"}
        ).json()
        assert len(body["digest_hex"]) == 64

    def test_integrity_match_and_mismatch(self):
        digest = client.post(
            "/api/lab/hash", json={"data_b64": b64(PNG_1X1), "algorithm": "sha256"}
        ).json()["digest_hex"]
        match = client.post(
            "/api/lab/hash/verify",
            json={"data_b64": b64(PNG_1X1), "expected_hex": digest, "algorithm": "sha256"},
        ).json()
        assert match["match"] is True
        mismatch = client.post(
            "/api/lab/hash/verify",
            json={"data_b64": b64(PNG_1X1), "expected_hex": "00" * 32, "algorithm": "sha256"},
        ).json()
        assert mismatch["match"] is False


class TestHmacApi:
    def test_generate_verify_round_trip(self):
        generated = client.post(
            "/api/lab/hmac/generate",
            json={"data_b64": b64(BINARY), "key": "shared-secret", "algorithm": "sha256"},
        ).json()
        verified = client.post(
            "/api/lab/hmac/verify",
            json={
                "data_b64": b64(BINARY),
                "key": "shared-secret",
                "mac_hex": generated["mac_hex"],
                "algorithm": "sha256",
            },
        ).json()
        assert verified["valid"] is True

    def test_wrong_key_is_invalid(self):
        generated = client.post(
            "/api/lab/hmac/generate",
            json={"data_b64": b64(b"m"), "key": "k1"},
        ).json()
        verified = client.post(
            "/api/lab/hmac/verify",
            json={"data_b64": b64(b"m"), "key": "k2", "mac_hex": generated["mac_hex"]},
        ).json()
        assert verified["valid"] is False


class TestMacApi:
    @pytest.mark.parametrize("algorithm,key", [
        ("hmac_sha256", "shared-secret"),
        ("cmac_aes128", "2b7e151628aed2a6abf7158809cf4f3c"),
        ("poly1305", "85d6be7857556d337f4452fe42d506a80103808afb0db2fd4abff6af4149f51b"),
    ])
    def test_generate_verify_round_trip(self, algorithm, key):
        generated = client.post(
            "/api/lab/mac/generate",
            json={"data_b64": b64(BINARY), "key": key, "algorithm": algorithm},
        ).json()
        verified = client.post(
            "/api/lab/mac/verify",
            json={"data_b64": b64(BINARY), "key": key,
                  "mac_hex": generated["mac_hex"], "algorithm": algorithm},
        ).json()
        assert verified["valid"] is True

    def test_wrong_key_is_invalid(self):
        generated = client.post(
            "/api/lab/mac/generate",
            json={"data_b64": b64(b"m"), "key": "2b7e151628aed2a6abf7158809cf4f3c",
                  "algorithm": "cmac_aes128"},
        ).json()
        verified = client.post(
            "/api/lab/mac/verify",
            json={"data_b64": b64(b"m"), "key": "00" * 16,
                  "mac_hex": generated["mac_hex"], "algorithm": "cmac_aes128"},
        ).json()
        assert verified["valid"] is False

    def test_bad_poly1305_key_returns_422(self):
        response = client.post(
            "/api/lab/mac/generate",
            json={"data_b64": b64(b"m"), "key": "00" * 16, "algorithm": "poly1305"},
        )
        assert response.status_code == 422


class TestHybridApi:
    def test_hybrid_round_trip_and_metadata(self):
        keys = DigitalSignatureService.generate_keys("rsa", rsa_bits=2048)
        pdf = b"%PDF-1.4 minimal\n%%EOF"
        encrypted = client.post(
            "/api/lab/hybrid/encrypt",
            json={
                "data_b64": b64(pdf),
                "public_key_pem": keys["public_key_pem"],
                "filename": "doc.pdf",
                "mime_type": "application/pdf",
            },
        )
        assert encrypted.status_code == 200
        body = encrypted.json()
        assert body["metadata"]["mode"] == "hybrid"
        assert body["metadata"]["wrapped_key_present"] is True
        assert "wrapped_key_b64" not in body["metadata"]

        decrypted = client.post(
            "/api/lab/hybrid/decrypt",
            json={
                "container_b64": body["container_b64"],
                "private_key_pem": keys["private_key_pem"],
            },
        ).json()
        assert unb64(decrypted["data_b64"]) == pdf

    def test_wrong_private_key_rejected(self):
        keys = DigitalSignatureService.generate_keys("rsa", rsa_bits=2048)
        other = DigitalSignatureService.generate_keys("rsa", rsa_bits=2048)
        encrypted = client.post(
            "/api/lab/hybrid/encrypt",
            json={"data_b64": b64(b"data"), "public_key_pem": keys["public_key_pem"]},
        ).json()
        response = client.post(
            "/api/lab/hybrid/decrypt",
            json={
                "container_b64": encrypted["container_b64"],
                "private_key_pem": other["private_key_pem"],
            },
        )
        assert response.status_code == 422


class TestExistingApiNotBroken:
    def test_algorithms_endpoint_still_works(self):
        assert client.get("/api/algorithms").status_code == 200

    def test_execute_endpoint_still_works(self):
        response = client.post(
            "/api/algorithms/execute",
            json={"algorithm": "caesar", "operation": "encrypt",
                  "inputs": {"text": "ABC", "shift": 3}},
        )
        assert response.status_code == 200
