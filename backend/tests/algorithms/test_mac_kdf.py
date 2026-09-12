"""Tests for the new MAC + KDF + password-hashing modules."""

import pytest

from app.algorithms import (
    argon2_alg,
    bcrypt_alg,
    hkdf,
    hmac_alg,
    pbkdf2,
    scrypt_alg,
)
from app.utils.errors import ValidationError


# ---------------------------------------------------------------------------
# HMAC (RFC 2104) — RFC 4231 test vectors
# ---------------------------------------------------------------------------


class TestHMAC:
    def test_rfc4231_sha256_vector(self):
        # RFC 4231 test case 2: key = "Jefe", data = "what do ya want for nothing?"
        res = hmac_alg.sign("what do ya want for nothing?", "Jefe")
        assert res["extra"]["mac"] == (
            "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843"
        )
        assert res["extra"]["digest_length"] == 32

    def test_rfc4231_sha512_vector(self):
        res = hmac_alg.sign("what do ya want for nothing?", "Jefe",
                            algorithm="sha512")
        assert res["extra"]["mac"] == (
            "164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea250"
            "5549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737"
        )
        assert res["extra"]["digest_length"] == 64

    def test_base64_output_and_verify(self):
        res = hmac_alg.sign("message", "secretkey", output_format="base64")
        assert res["result"] != ""
        ok = hmac_alg.verify("message", "secretkey", res["extra"]["mac"],
                             output_format="base64")
        assert ok["extra"]["valid"] is True
        assert ok["extra"]["result"] == "VALID"

    def test_verify_good_and_bad_mac(self):
        mac = hmac_alg.sign("hello", "k")["extra"]["mac"]
        assert hmac_alg.verify("hello", "k", mac)["extra"]["valid"] is True
        assert hmac_alg.verify("hello", "wrong", mac)["extra"]["valid"] is False

    def test_unicode_input(self):
        res = hmac_alg.sign("مرحبا بالعالم", "مفتاح سري")
        assert len(res["extra"]["mac"]) == 64

    def test_missing_mac_rejected(self):
        with pytest.raises(ValidationError):
            hmac_alg.verify("hello", "k", "")

    def test_bad_algorithm_rejected(self):
        with pytest.raises(ValidationError):
            hmac_alg.sign("hello", "k", algorithm="md5")


# ---------------------------------------------------------------------------
# PBKDF2 (RFC 8018)
# ---------------------------------------------------------------------------


class TestPBKDF2:
    def test_rfc7914_sha256_vector(self):
        # PBKDF2-HMAC-SHA256(P="password", S="salt", c=1, dkLen=32) — RFC 7914 A.1
        res = pbkdf2.derive("password", salt="salt", iterations=1,
                            key_length=32)
        assert res["extra"]["key_hex"] == (
            "120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b"
        )

    def test_verify_roundtrip(self):
        res = pbkdf2.derive("mypassword", salt="somesalt", iterations=1000,
                            key_length=32)
        ok = pbkdf2.verify("mypassword", res["extra"]["salt_hex"],
                           res["extra"]["key_hex"], iterations=1000)
        assert ok["extra"]["valid"] is True
        bad = pbkdf2.verify("notmypassword", res["extra"]["salt_hex"],
                            res["extra"]["key_hex"], iterations=1000)
        assert bad["extra"]["valid"] is False

    def test_random_salt_differs(self):
        a = pbkdf2.derive("hunter2", random_salt=True)
        b = pbkdf2.derive("hunter2", random_salt=True)
        assert a["extra"]["salt_hex"] != b["extra"]["salt_hex"]
        assert a["extra"]["salt_random"] is True

    def test_invalid_iterations_rejected(self):
        with pytest.raises(ValidationError):
            pbkdf2.derive("pw", salt="salt", iterations=0)

    def test_invalid_key_length_rejected(self):
        with pytest.raises(ValidationError):
            pbkdf2.derive("pw", salt="salt", key_length=0)

    def test_bad_algorithm_rejected(self):
        with pytest.raises(ValidationError):
            pbkdf2.derive("pw", salt="salt", algorithm="md5")

    def test_bad_salt_hex_rejected(self):
        with pytest.raises(ValidationError):
            pbkdf2.derive("pw", salt_hex="not-hex")


# ---------------------------------------------------------------------------
# scrypt (RFC 7914)
# ---------------------------------------------------------------------------


class TestScrypt:
    def test_rfc7914_vector2(self):
        # scrypt(P="password", S="NaCl", N=1024, r=8, p=16, dkLen=64)
        res = scrypt_alg.derive("password", salt="NaCl", n=1024, r=8, p=16,
                                key_length=64)
        assert res["extra"]["key_hex"] == (
            "fdbabe1c9d3472007856e7190d01e9fe7c6ad7cbc8237830e77376634b373162"
            "2eaf30d92e22a3886ff109279d9830dac727afb94a83ee6d8360cbdfa2cc0640"
        )

    def test_verify_roundtrip(self):
        res = scrypt_alg.derive("password", salt="salt", n=1024)
        ok = scrypt_alg.verify("password", res["extra"]["salt_hex"],
                               res["extra"]["key_hex"], n=1024)
        assert ok["extra"]["valid"] is True
        bad = scrypt_alg.verify("wrong", res["extra"]["salt_hex"],
                                res["extra"]["key_hex"], n=1024)
        assert bad["extra"]["valid"] is False

    def test_n_power_of_two_required(self):
        with pytest.raises(ValidationError):
            scrypt_alg.derive("pw", salt="salt", n=3)

    def test_random_salt_differs(self):
        a = scrypt_alg.derive("hunter2", n=1024, random_salt=True)
        b = scrypt_alg.derive("hunter2", n=1024, random_salt=True)
        assert a["extra"]["salt_hex"] != b["extra"]["salt_hex"]

    def test_memory_kib_reported(self):
        res = scrypt_alg.derive("pw", salt="salt", n=1024, r=8)
        assert res["extra"]["memory_kib"] == (128 * 1024 * 8) // 1024


# ---------------------------------------------------------------------------
# bcrypt
# ---------------------------------------------------------------------------


class TestBcrypt:
    def test_hash_format_and_verify(self):
        res = bcrypt_alg.hash_password("CorrectHorseBatteryStaple", rounds=4)
        h = res["extra"]["hash"]
        assert h.startswith("$2b$")
        assert res["extra"]["rounds"] == 4
        assert bcrypt_alg.verify("CorrectHorseBatteryStaple", h)["extra"]["valid"] is True
        assert bcrypt_alg.verify("wrong", h)["extra"]["valid"] is False
        res2 = bcrypt_alg.hash_password("CorrectHorseBatteryStaple", rounds=4)
        assert res2["extra"]["hash"] != h

    def test_two_hashes_differ(self):
        a = bcrypt_alg.hash_password("pw", rounds=4)["extra"]["hash"]
        b = bcrypt_alg.hash_password("pw", rounds=4)["extra"]["hash"]
        assert a != b

    def test_password_over_72_bytes_rejected(self):
        with pytest.raises(ValidationError):
            bcrypt_alg.hash_password("x" * 73)

    def test_bad_rounds_rejected(self):
        with pytest.raises(ValidationError):
            bcrypt_alg.hash_password("pw", rounds=3)

    def test_bad_hash_string_rejected(self):
        with pytest.raises(ValidationError):
            bcrypt_alg.verify("pw", "not-a-bcrypt-hash")

    def test_unicode_password(self):
        res = bcrypt_alg.hash_password("كلمة مرور", rounds=4)
        assert bcrypt_alg.verify("كلمة مرور", res["extra"]["hash"])["extra"]["valid"] is True


# ---------------------------------------------------------------------------
# Argon2
# ---------------------------------------------------------------------------


class TestArgon2:
    def test_hash_format_and_verify(self):
        res = argon2_alg.hash_password("password", memory_cost=1024,
                                       time_cost=2, parallelism=1)
        h = res["extra"]["hash"]
        assert h.startswith("$argon2id$")
        assert argon2_alg.verify("password", h)["extra"]["valid"] is True
        assert argon2_alg.verify("wrong", h)["extra"]["valid"] is False

    def test_variant_supported(self):
        res = argon2_alg.hash_password("password", variant="argon2i",
                                       memory_cost=1024, time_cost=2,
                                       parallelism=1)
        assert res["extra"]["hash"].startswith("$argon2i$")
        assert argon2_alg.verify("password", res["extra"]["hash"])["extra"]["valid"] is True

    def test_invalid_variant_rejected(self):
        with pytest.raises(ValidationError):
            argon2_alg.hash_password("pw", variant="argon2x", memory_cost=1024,
                                     time_cost=2, parallelism=1)

    def test_tiny_memory_rejected(self):
        with pytest.raises(ValidationError):
            argon2_alg.hash_password("pw", memory_cost=4, time_cost=2,
                                     parallelism=1)

    def test_bad_hash_string_rejected(self):
        with pytest.raises(ValidationError):
            argon2_alg.verify("pw", "garbage-hash")


# ---------------------------------------------------------------------------
# HKDF (RFC 5869)
# ---------------------------------------------------------------------------


class TestHKDF:
    def test_rfc5869_a1_vector(self):
        # IKM = 0x0b*22, salt = 0x00..0x0c, info = 0xf0..0xf9, L=42, SHA-256
        res = hkdf.derive(
            ikm="ignored",
            salt="ignored",
            info="ignored",
            length=42,
            ikm_hex="0b" * 22,
            salt_hex="000102030405060708090a0b0c",
            info_hex="f0f1f2f3f4f5f6f7f8f9",
        )
        assert res["extra"]["key_hex"] == (
            "3cb25f25faacd57a90434f64d0362f2a"
            "2d2d0a90cf1a5a4c5db02d56ecc4c5bf"
            "34007208d5b887185865"
        )

    def test_deterministic_with_fixed_salt(self):
        a = hkdf.derive("shared-secret", salt="f", info="ctx1", length=32,
                        random_salt=False)
        b = hkdf.derive("shared-secret", salt="f", info="ctx1", length=32,
                        random_salt=False)
        assert a["extra"]["key_hex"] == b["extra"]["key_hex"]

    def test_info_changes_output(self):
        a = hkdf.derive("shared-secret", salt="f", info="encryption", length=32,
                        random_salt=False)["extra"]["key_hex"]
        b = hkdf.derive("shared-secret", salt="f", info="mac", length=32,
                        random_salt=False)["extra"]["key_hex"]
        assert a != b

    def test_random_salt_differs(self):
        a = hkdf.derive("shared-secret")["extra"]["salt_hex"]
        b = hkdf.derive("shared-secret")["extra"]["salt_hex"]
        assert a != b

    def test_missing_ikm_rejected(self):
        with pytest.raises(ValidationError):
            hkdf.derive("", random_salt=True)

    def test_bad_ikm_hex_rejected(self):
        with pytest.raises(ValidationError):
            hkdf.derive("ignored", ikm_hex="zz")