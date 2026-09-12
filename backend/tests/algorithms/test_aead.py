"""Tests for the new AEAD modes (AES-GCM, ChaCha20-Poly1305)."""

import pytest

from backend.app.algorithms import aes_gcm, chacha20_poly1305
from backend.app.utils.errors import ValidationError

KEY_128 = "00" * 16
KEY_256 = "aa" * 32
NONCE = "cafebabefacedbaddecaf888"  # 12 bytes / 24 hex

CHACHA_KEY = "00" * 32
CHACHA_NONCE = "00" * 12


class TestAESGCM:
    def test_roundtrip(self):
        enc = aes_gcm.encrypt("Hello, GCM!", KEY_256, NONCE, aad="header")
        assert isinstance(enc["result"], dict)
        assert enc["extra"]["ciphertext_hex"]
        assert len(enc["extra"]["tag_hex"]) == 32
        dec = aes_gcm.decrypt(enc["extra"]["combined_hex"], KEY_256, NONCE,
                              aad="header")
        assert dec["extra"]["plaintext"] == "Hello, GCM!"
        assert dec["extra"]["authentication"] == "PASS"

    def test_different_nonce_changes_ciphertext(self):
        a = aes_gcm.encrypt("fixed", KEY_128, NONCE)["extra"]["ciphertext_hex"]
        b = aes_gcm.encrypt("fixed", KEY_128, "0" * 24)["extra"]["ciphertext_hex"]
        assert a != b

    def test_tampered_ciphertext_rejected(self):
        enc = aes_gcm.encrypt("secret", KEY_256, NONCE)
        combined = enc["extra"]["combined_hex"]
        flipped = ("0" if combined[0] != "0" else "1") + combined[1:]
        with pytest.raises(ValidationError) as exc:
            aes_gcm.decrypt(flipped, KEY_256, NONCE)
        assert exc.value.code == "authentication_failed"

    def test_wrong_key_rejected(self):
        enc = aes_gcm.encrypt("secret", KEY_256, NONCE)
        with pytest.raises(ValidationError):
            aes_gcm.decrypt(enc["extra"]["combined_hex"], "bb" * 32, NONCE)

    def test_wrong_aad_rejected(self):
        enc = aes_gcm.encrypt("secret", KEY_256, NONCE, aad="aad1")
        with pytest.raises(ValidationError):
            aes_gcm.decrypt(enc["extra"]["combined_hex"], KEY_256, NONCE,
                            aad="aad2")

    def test_invalid_key_length_rejected(self):
        with pytest.raises(ValidationError):
            aes_gcm.encrypt("hi", "00" * 15, NONCE)

    def test_invalid_nonce_length_rejected(self):
        with pytest.raises(ValidationError):
            aes_gcm.encrypt("hi", KEY_256, NONCE + "00")

    def test_missing_ciphertext_rejected(self):
        with pytest.raises(ValidationError):
            aes_gcm.decrypt("", KEY_256, NONCE)

    def test_unicode_roundtrip(self):
        enc = aes_gcm.encrypt("رسالة سرية", KEY_256, NONCE)
        dec = aes_gcm.decrypt(enc["extra"]["combined_hex"], KEY_256, NONCE)
        assert dec["extra"]["plaintext"] == "رسالة سرية"


class TestChaCha20Poly1305:
    def test_roundtrip(self):
        enc = chacha20_poly1305.encrypt("Hello, ChaCha!", CHACHA_KEY,
                                        CHACHA_NONCE, aad="ctx")
        assert isinstance(enc["result"], dict)
        assert len(enc["extra"]["tag_hex"]) == 32
        dec = chacha20_poly1305.decrypt(enc["extra"]["combined_hex"],
                                        CHACHA_KEY, CHACHA_NONCE, aad="ctx")
        assert dec["extra"]["plaintext"] == "Hello, ChaCha!"

    def test_different_nonce_changes_ciphertext(self):
        a = chacha20_poly1305.encrypt("fixed", CHACHA_KEY, CHACHA_NONCE)["extra"]["ciphertext_hex"]
        b = chacha20_poly1305.encrypt("fixed", CHACHA_KEY, "ff" * 12)["extra"]["ciphertext_hex"]
        assert a != b

    def test_tampered_ciphertext_rejected(self):
        enc = chacha20_poly1305.encrypt("secret", CHACHA_KEY, CHACHA_NONCE)
        combined = enc["extra"]["combined_hex"]
        flipped = ("0" if combined[0] != "0" else "1") + combined[1:]
        with pytest.raises(ValidationError) as exc:
            chacha20_poly1305.decrypt(flipped, CHACHA_KEY, CHACHA_NONCE)
        assert exc.value.code == "authentication_failed"

    def test_wrong_key_rejected(self):
        enc = chacha20_poly1305.encrypt("secret", CHACHA_KEY, CHACHA_NONCE)
        with pytest.raises(ValidationError):
            chacha20_poly1305.decrypt(enc["extra"]["combined_hex"],
                                      "11" * 32, CHACHA_NONCE)

    def test_invalid_key_length_rejected(self):
        with pytest.raises(ValidationError):
            chacha20_poly1305.encrypt("hi", "00" * 31, CHACHA_NONCE)

    def test_invalid_nonce_length_rejected(self):
        with pytest.raises(ValidationError):
            chacha20_poly1305.encrypt("hi", CHACHA_KEY, "00" * 11)
