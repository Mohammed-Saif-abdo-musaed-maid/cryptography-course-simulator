"""Phase 5 algorithm modules: known vectors, round-trips and negative cases.

Covers SHA-224/SHA-384/RIPEMD-160, AES-CBC/AES-CTR, AES-CCM, Camellia,
CMAC, Poly1305, X448, DSA and RSA-PSS.
"""

import hashlib

import pytest
from cryptography.hazmat.primitives import padding as sym_padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

from backend.app.algorithms import (
    aes_cbc,
    aes_ccm,
    aes_ctr,
    camellia,
    cmac_alg,
    dsa_alg,
    poly1305_alg,
    ripemd160,
    rsa_pss_alg,
    sha224,
    sha384,
    x448,
)
from backend.app.utils.errors import ValidationError

KEY = "2b7e151628aed2a6abf7158809cf4f3c"
IV = "000102030405060708090a0b0c0d0e0f"
CTR = "f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff"


class TestPhase5Hashes:
    def test_sha224_kat(self):
        assert sha224.hash("abc")["result"] == (
            "23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7"
        )
        assert sha224.hash("")["result"] == (
            "d14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f"
        )

    def test_sha384_kat(self):
        assert sha384.hash("abc")["result"] == (
            "cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed"
            "8086072ba1e7cc2358baeca134c825a7"
        )
        assert len(sha384.hash("abc")["result"]) == 96

    def test_ripemd160_kat(self):
        assert ripemd160.hash("abc")["result"] == (
            "8eb208f7e05d987a9b044a8e98c6b087f15a0bfc"
        )
        assert ripemd160.hash("")["result"] == (
            "9c1185a5c5e9fc54612808977ee8f548b2258d31"
        )

    @pytest.mark.parametrize("module,name", [
        (sha224, "sha224"), (sha384, "sha384"), (ripemd160, "ripemd160")])
    def test_hash_bytes_matches_hashlib(self, module, name):
        data = bytes(range(256))
        assert module.hash_bytes(data)["digest"] == hashlib.new(name, data).hexdigest()

    def test_missing_message_rejected(self):
        with pytest.raises(ValidationError):
            sha224.hash(None)


class TestAESCBC:
    def test_cross_check_with_library(self):
        text = "Hello, CBC mode!"
        data = text.encode("utf-8")
        padder = sym_padding.PKCS7(128).padder()
        padded = padder.update(data) + padder.finalize()
        encryptor = Cipher(algorithms.AES(bytes.fromhex(KEY)),
                           modes.CBC(bytes.fromhex(IV))).encryptor()
        expected = (encryptor.update(padded) + encryptor.finalize()).hex()
        assert aes_cbc.encrypt(text, KEY, IV)["result"] == expected

    def test_roundtrip(self):
        ct = aes_cbc.encrypt("مرحبا CBC", KEY, IV)["result"]
        assert aes_cbc.decrypt(ct, KEY, IV)["result"] == "مرحبا CBC"

    def test_wrong_iv_changes_output(self):
        a = aes_cbc.encrypt("same", KEY, IV)["result"]
        b = aes_cbc.encrypt("same", KEY, "ff" * 16)["result"]
        assert a != b

    def test_invalid_key_rejected(self):
        with pytest.raises(ValidationError):
            aes_cbc.encrypt("hi", "00" * 15, IV)

    def test_invalid_iv_rejected(self):
        with pytest.raises(ValidationError):
            aes_cbc.encrypt("hi", KEY, "00" * 15)

    def test_bad_ciphertext_length_rejected(self):
        with pytest.raises(ValidationError):
            aes_cbc.decrypt("00" * 15, KEY, IV)


class TestAESCTR:
    def test_cross_check_with_library(self):
        text = "Hello, CTR mode!"
        data = text.encode("utf-8")
        encryptor = Cipher(algorithms.AES(bytes.fromhex(KEY)),
                           modes.CTR(bytes.fromhex(CTR))).encryptor()
        expected = (encryptor.update(data) + encryptor.finalize()).hex()
        assert aes_ctr.encrypt(text, KEY, CTR)["result"] == expected

    def test_roundtrip_is_symmetric(self):
        ct = aes_ctr.encrypt("same operation", KEY, CTR)["result"]
        assert aes_ctr.decrypt(ct, KEY, CTR)["result"] == "same operation"

    def test_different_counter_changes_output(self):
        a = aes_ctr.encrypt("same", KEY, CTR)["result"]
        b = aes_ctr.encrypt("same", KEY, "00" * 16)["result"]
        assert a != b

    def test_invalid_counter_rejected(self):
        with pytest.raises(ValidationError):
            aes_ctr.encrypt("hi", KEY, "00" * 15)


class TestCamellia:
    def test_rfc3713_ecb_kat(self):
        res = camellia.encrypt("0123456789abcdeffedcba9876543210",
                               "0123456789abcdeffedcba9876543210")
        assert res["result"] == "67673138549669730857065648eabe43"
        assert res["extra"]["rounds"] == 18

    def test_256_bit_rounds(self):
        res = camellia.encrypt("00112233445566778899aabbccddeeff", "00" * 32)
        assert res["extra"]["rounds"] == 24
        assert len(res["result"]) == 32

    def test_roundtrip(self):
        ct = camellia.encrypt("00112233445566778899aabbccddeeff", KEY)["result"]
        assert camellia.decrypt(ct, KEY)["result"] == \
            "00112233445566778899aabbccddeeff"

    def test_invalid_block_length_rejected(self):
        with pytest.raises(ValidationError):
            camellia.encrypt("00" * 15, KEY)

    def test_invalid_key_length_rejected(self):
        with pytest.raises(ValidationError):
            camellia.encrypt("00" * 16, "00" * 15)


class TestCMAC:
    def test_verify_roundtrip(self):
        tag = cmac_alg.sign("message", KEY)["extra"]["mac"]
        assert cmac_alg.verify("message", KEY, tag)["extra"]["valid"] is True
        assert cmac_alg.verify("tampered", KEY, tag)["extra"]["valid"] is False

    def test_base64_output(self):
        res = cmac_alg.sign("message", KEY, output_format="base64")
        assert cmac_alg.verify("message", KEY, res["extra"]["mac"],
                               output_format="base64")["extra"]["valid"] is True

    def test_invalid_key_size_rejected(self):
        with pytest.raises(ValidationError):
            cmac_alg.sign("message", "00" * 15)

    def test_missing_mac_rejected(self):
        with pytest.raises(ValidationError):
            cmac_alg.verify("message", KEY, "")


class TestPoly1305:
    def test_rfc8439_kat(self):
        res = poly1305_alg.sign(
            "Cryptographic Forum Research Group",
            "85d6be7857556d337f4452fe42d506a80103808afb0db2fd4abff6af4149f51b",
        )
        assert res["extra"]["mac"] == "a8061dc1305136c6c22b8baf0c0127a9"

    def test_verify_roundtrip(self):
        key = "85d6be7857556d337f4452fe42d506a80103808afb0db2fd4abff6af4149f51b"
        tag = poly1305_alg.sign("hello", key)["extra"]["mac"]
        assert poly1305_alg.verify("hello", key, tag)["extra"]["valid"] is True
        assert poly1305_alg.verify("hello!", key, tag)["extra"]["valid"] is False

    def test_key_must_be_32_bytes(self):
        with pytest.raises(ValidationError):
            poly1305_alg.sign("hi", "00" * 16)


class TestX448:
    def test_exchange_matches(self):
        res = x448.exchange()
        assert res["extra"]["shared_secret_match"] is True
        assert len(res["extra"]["shared_secret_hex"]) == 112  # 56 bytes
        assert len(res["extra"]["alice"]["public_hex"]) == 112

    def test_two_exchanges_differ(self):
        a = x448.exchange()["extra"]["shared_secret_hex"]
        b = x448.exchange()["extra"]["shared_secret_hex"]
        assert a != b


class TestDSA:
    def test_full_flow(self):
        keys = dsa_alg.generate_keys(2048)
        assert "PRIVATE KEY" in keys["extra"]["private_key_pem"]
        signed = dsa_alg.sign("hello", private_key_pem=keys["extra"]["private_key_pem"])
        verified = dsa_alg.verify(
            "hello", signed["extra"]["signature_hex"],
            public_key_pem=keys["extra"]["public_key_pem"],
        )
        assert verified["extra"]["valid"] is True

    def test_tampered_message_invalid(self):
        keys = dsa_alg.generate_keys(2048)
        signed = dsa_alg.sign("hello", private_key_pem=keys["extra"]["private_key_pem"])
        assert dsa_alg.verify(
            "hello!", signed["extra"]["signature_hex"],
            public_key_pem=keys["extra"]["public_key_pem"],
        )["extra"]["valid"] is False

    def test_verify_requires_key(self):
        with pytest.raises(ValidationError):
            dsa_alg.verify("hello", "00" * 40)

    def test_invalid_key_size_rejected(self):
        with pytest.raises(ValidationError):
            dsa_alg.generate_keys(512)


class TestRSAPSS:
    def test_full_flow(self):
        keys = rsa_pss_alg.generate_keys(2048)
        signed = rsa_pss_alg.sign(
            "message", private_key_pem=keys["extra"]["private_key_pem"])
        assert rsa_pss_alg.verify(
            "message", signed["extra"]["signature_hex"],
            public_key_pem=keys["extra"]["public_key_pem"],
        )["extra"]["valid"] is True

    def test_signature_is_randomized(self):
        keys = rsa_pss_alg.generate_keys(2048)
        a = rsa_pss_alg.sign("same", private_key_pem=keys["extra"]["private_key_pem"])
        b = rsa_pss_alg.sign("same", private_key_pem=keys["extra"]["private_key_pem"])
        assert a["extra"]["signature_hex"] != b["extra"]["signature_hex"]

    def test_wrong_message_invalid(self):
        keys = rsa_pss_alg.generate_keys(2048)
        signed = rsa_pss_alg.sign(
            "message", private_key_pem=keys["extra"]["private_key_pem"])
        assert rsa_pss_alg.verify(
            "different", signed["extra"]["signature_hex"],
            public_key_pem=keys["extra"]["public_key_pem"],
        )["extra"]["valid"] is False

    def test_invalid_key_size_rejected(self):
        with pytest.raises(ValidationError):
            rsa_pss_alg.generate_keys(1024)

    def test_missing_public_key_rejected(self):
        with pytest.raises(ValidationError):
            rsa_pss_alg.verify("msg", "00" * 32)
