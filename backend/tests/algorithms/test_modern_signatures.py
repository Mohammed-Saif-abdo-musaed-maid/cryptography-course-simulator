"""Tests for the new signature modules (ECDSA, Ed25519) and the RSA
OAEP / RSA-PSS additions."""

import pytest

from backend.app.algorithms import (
    ecdsa_alg,
    ed25519_alg,
    rsa,
)
from backend.app.utils.errors import AlgorithmError, ValidationError

UNREADABLE = "This message is only signed, never encrypted"


class TestECDSA:
    def test_generate_keys_shapes(self):
        keys = ecdsa_alg.generate_keys("p256")
        assert keys["private_scalar"] > 0
        assert keys["public_x"] > 0 and keys["public_y"] > 0
        assert len(bytes.fromhex(keys["public_hex"])) == 65

    def test_sign_and_verify(self):
        sig = ecdsa_alg.sign(UNREADABLE)
        assert "signature_hex" in sig["extra"]
        ok = ecdsa_alg.verify(UNREADABLE, sig["extra"]["signature_hex"],
                              public_hex=sig["extra"]["public_hex"])
        assert ok["extra"]["valid"] is True

    def test_tampered_message_invalid(self):
        sig = ecdsa_alg.sign(UNREADABLE)
        bad = ecdsa_alg.verify("Tampered!", sig["extra"]["signature_hex"],
                               public_hex=sig["extra"]["public_hex"])
        assert bad["extra"]["valid"] is False

    def test_wrong_public_key_invalid(self):
        sig = ecdsa_alg.sign(UNREADABLE)
        other = ecdsa_alg.sign(UNREADABLE)
        bad = ecdsa_alg.verify(UNREADABLE, sig["extra"]["signature_hex"],
                               public_hex=other["extra"]["public_hex"])
        assert bad["extra"]["valid"] is False

    def test_sign_with_explicit_scalar(self):
        keys = ecdsa_alg.generate_keys("p256")
        sig = ecdsa_alg.sign(UNREADABLE, private_scalar=keys["private_scalar"])
        ok = ecdsa_alg.verify(UNREADABLE, sig["extra"]["signature_hex"],
                              public_hex=sig["extra"]["public_hex"])
        assert ok["extra"]["valid"] is True

    def test_verify_by_coordinates(self):
        sig = ecdsa_alg.sign(UNREADABLE)
        ok = ecdsa_alg.verify(UNREADABLE, sig["extra"]["signature_hex"],
                              public_x=sig["extra"]["public_x"],
                              public_y=sig["extra"]["public_y"])
        assert ok["extra"]["valid"] is True

    def test_missing_signature_rejected(self):
        with pytest.raises(ValidationError):
            ecdsa_alg.verify("msg", "", public_x=1, public_y=2)

    def test_invalid_curve_rejected(self):
        with pytest.raises(ValidationError):
            ecdsa_alg.sign("msg", curve="p128")

    def test_signature_note_present(self):
        sig = ecdsa_alg.sign("msg")
        assert "does NOT encrypt" in sig["extra"]["signature_note"]

    def test_unicode_roundtrip(self):
        sig = ecdsa_alg.sign("توقيع على رسالة عربية")
        ok = ecdsa_alg.verify("توقيع على رسالة عربية",
                              sig["extra"]["signature_hex"],
                              public_hex=sig["extra"]["public_hex"])
        assert ok["extra"]["valid"] is True


class TestEd25519:
    def test_generate_keys_shapes(self):
        keys = ed25519_alg.generate_keys()
        assert len(bytes.fromhex(keys["private_hex"])) == 32
        assert len(bytes.fromhex(keys["public_hex"])) == 32

    def test_sign_and_verify(self):
        sig = ed25519_alg.sign(UNREADABLE)
        assert len(bytes.fromhex(sig["extra"]["signature_hex"])) == 64
        ok = ed25519_alg.verify(UNREADABLE, sig["extra"]["signature_hex"],
                                public_hex=sig["extra"]["public_hex"])
        assert ok["extra"]["valid"] is True

    def test_deterministic_signature(self):
        keys = ed25519_alg.generate_keys()
        a = ed25519_alg.sign(UNREADABLE, private_hex=keys["private_hex"])
        b = ed25519_alg.sign(UNREADABLE, private_hex=keys["private_hex"])
        assert a["extra"]["signature_hex"] == b["extra"]["signature_hex"]

    def test_tampered_message_invalid(self):
        sig = ed25519_alg.sign(UNREADABLE)
        bad = ed25519_alg.verify("Tampered!", sig["extra"]["signature_hex"],
                                 public_hex=sig["extra"]["public_hex"])
        assert bad["extra"]["valid"] is False

    def test_wrong_public_key_invalid(self):
        sig = ed25519_alg.sign(UNREADABLE)
        other = ed25519_alg.sign(UNREADABLE)
        bad = ed25519_alg.verify(UNREADABLE, sig["extra"]["signature_hex"],
                                 public_hex=other["extra"]["public_hex"])
        assert bad["extra"]["valid"] is False

    def test_invalid_private_key_hex_rejected(self):
        with pytest.raises(ValidationError):
            ed25519_alg.sign("msg", private_hex="zz")

    def test_missing_public_key_rejected(self):
        with pytest.raises(ValidationError):
            ed25519_alg.verify("msg", "00" * 64)

    def test_signature_note_present(self):
        sig = ed25519_alg.sign("msg")
        assert "does NOT encrypt" in sig["extra"]["signature_note"]


class TestRSAOAEP:
    def test_roundtrip_with_generated_key(self):
        enc = rsa.encrypt_oaep("Secret text")
        assert enc["extra"]["private_key_pem"] is not None
        dec = rsa.decrypt_oaep(enc["extra"]["ciphertext_hex"],
                               enc["extra"]["private_key_pem"])
        assert dec["extra"]["plaintext"] == "Secret text"

    def test_randomized_ciphertext(self):
        a = rsa.encrypt_oaep("same message")["extra"]["ciphertext_hex"]
        b = rsa.encrypt_oaep("same message")["extra"]["ciphertext_hex"]
        assert a != b

    def test_tampered_ciphertext_rejected(self):
        enc = rsa.encrypt_oaep("Secret text")
        ct = enc["extra"]["ciphertext_hex"]
        flipped = ("0" if ct[0] != "0" else "1") + ct[1:]
        with pytest.raises(ValidationError) as exc:
            rsa.decrypt_oaep(flipped, enc["extra"]["private_key_pem"])
        assert exc.value.code == "decryption_failed"

    def test_wrong_key_rejected(self):
        enc = rsa.encrypt_oaep("Secret text")
        other = rsa.encrypt_oaep("other")
        with pytest.raises(ValidationError):
            rsa.decrypt_oaep(enc["extra"]["ciphertext_hex"],
                             other["extra"]["private_key_pem"])

    def test_private_key_required(self):
        with pytest.raises(ValidationError):
            rsa.decrypt_oaep("aa", "")

    def test_external_public_key_encrypts(self):
        enc = rsa.encrypt_oaep("hi")
        enc2 = rsa.encrypt_oaep("hi",
                                public_key_pem=enc["extra"]["public_key_pem"])
        assert enc2["extra"]["private_key_pem"] is None
        dec = rsa.decrypt_oaep(enc2["extra"]["ciphertext_hex"],
                               enc["extra"]["private_key_pem"])
        assert dec["extra"]["plaintext"] == "hi"

    def test_unicode_roundtrip(self):
        enc = rsa.encrypt_oaep("نص عربي سرّي")
        dec = rsa.decrypt_oaep(enc["extra"]["ciphertext_hex"],
                               enc["extra"]["private_key_pem"])
        assert dec["extra"]["plaintext"] == "نص عربي سرّي"


class TestRSAPSS:
    def test_sign_and_verify(self):
        sig = rsa.sign_pss(UNREADABLE)
        ok = rsa.verify_pss(UNREADABLE, sig["extra"]["signature_hex"],
                            sig["extra"]["public_key_pem"])
        assert ok["extra"]["valid"] is True

    def test_tampered_message_invalid(self):
        sig = rsa.sign_pss(UNREADABLE)
        bad = rsa.verify_pss("Tampered!", sig["extra"]["signature_hex"],
                             sig["extra"]["public_key_pem"])
        assert bad["extra"]["valid"] is False

    def test_wrong_key_invalid(self):
        sig = rsa.sign_pss(UNREADABLE)
        other = rsa.sign_pss(UNREADABLE)
        bad = rsa.verify_pss(UNREADABLE, sig["extra"]["signature_hex"],
                             other["extra"]["public_key_pem"])
        assert bad["extra"]["valid"] is False

    def test_sign_with_existing_key(self):
        sig = rsa.sign_pss(UNREADABLE)
        sig2 = rsa.sign_pss(UNREADABLE,
                            private_key_pem=sig["extra"]["private_key_pem"])
        assert sig2["extra"]["signature_hex"] != sig["extra"]["signature_hex"]
        ok = rsa.verify_pss(UNREADABLE, sig2["extra"]["signature_hex"],
                            sig2["extra"]["public_key_pem"])
        assert ok["extra"]["valid"] is True

    def test_public_key_required_for_verify(self):
        with pytest.raises(ValidationError):
            rsa.verify_pss("msg", "aa", "")

    def test_missing_signature_rejected(self):
        sig = rsa.sign_pss("msg")
        with pytest.raises(ValidationError):
            rsa.verify_pss("msg", "", sig["extra"]["public_key_pem"])

    def test_signature_note_present(self):
        sig = rsa.sign_pss("msg")
        assert "does NOT encrypt" in sig["extra"]["signature_note"]

    def test_unicode_roundtrip(self):
        sig = rsa.sign_pss("رسالة عربية موقعة")
        ok = rsa.verify_pss("رسالة عربية موقعة",
                            sig["extra"]["signature_hex"],
                            sig["extra"]["public_key_pem"])
        assert ok["extra"]["valid"] is True
