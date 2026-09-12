"""Tests for DES, 3DES, AES, Blowfish, Twofish and ChaCha20 against
known FIPS/NIST/RFC/official vectors."""

import pytest

from app.algorithms import aes, blowfish, chacha20, des, triple_des, twofish
from app.utils.errors import AlgorithmError

# ---------------------------------------------------------------------------
# DES
# ---------------------------------------------------------------------------


class TestDES:
    KEY = "133457799BBCDFF1"

    def test_fips_vector_encrypt(self):
        result = des.encrypt("0123456789ABCDEF", self.KEY)
        assert result["result"].replace(" ", "").upper() == "85E813540F0AB405"

    def test_fips_vector_round_states(self):
        result = des.encrypt("0123456789ABCDEF", self.KEY)
        L16 = result["extra"]["round_states"][16]["L"]
        R16 = result["extra"]["round_states"][16]["R"]
        # Documented FIPS intermediate values (hex without the padding below).
        assert L16 == "43423234"
        assert R16 == "0a4cd995"

    def test_roundtrip(self):
        block, key = "0123456789ABCDEF", "133457799BBCDFF1"
        enc = des.encrypt(block, key)["result"].replace(" ", "")
        assert des.decrypt(enc, key)["result"].replace(" ", "") == block.lower()

    def test_key_schedule_48_bit_round_keys(self):
        round_keys = des.key_schedule(self.KEY)
        assert len(round_keys) == 16
        assert all(len(k) == 48 for k in round_keys)

    def test_invalid_key_length(self):
        with pytest.raises(AlgorithmError):
            des.encrypt("0123456789ABCDEF", "00FF")

    def test_invalid_block_length(self):
        with pytest.raises(AlgorithmError):
            des.encrypt("0123", self.KEY)

    def test_invalid_hex(self):
        with pytest.raises(AlgorithmError):
            des.encrypt("ZZZZZZZZZZZZZZZZ", self.KEY)

    def test_deprecated_flag(self):
        assert des.get_metadata()["security_status"] == "deprecated"
        result = des.encrypt("0123456789ABCDEF", self.KEY)
        assert result["extra"]["deprecated_warning"] is True


# ---------------------------------------------------------------------------
# 3DES
# ---------------------------------------------------------------------------


class TestTripleDES:
    KEY24 = "133457799BBCDFF1" * 3

    def test_all_keys_equal_reduces_to_des(self):
        result = triple_des.encrypt("0123456789ABCDEF", self.KEY24)
        assert result["result"].replace(" ", "").upper() == "85E813540F0AB405"

    def test_roundtrip(self):
        block = "0123456789ABCDEF"
        enc = triple_des.encrypt(block, self.KEY24)["result"].replace(" ", "")
        assert triple_des.decrypt(enc, self.KEY24)["result"].replace(" ", "") == block.lower()

    def test_stages_reported(self):
        result = triple_des.encrypt("0123456789ABCDEF", self.KEY24)
        assert len(result["extra"]["stages"]) == 3

    def test_formula_ede(self):
        result = triple_des.encrypt("0123456789ABCDEF", self.KEY24)
        assert "E(K3, D(K2, E(K1, P)))" in result["extra"]["formula"]

    def test_key_size_validation(self):
        with pytest.raises(AlgorithmError):
            triple_des.encrypt("0123456789ABCDEF", "133457799BBCDFF1")


# ---------------------------------------------------------------------------
# AES
# ---------------------------------------------------------------------------

KW128 = "000102030405060708090a0b0c0d0e0f"
KW192 = "000102030405060708090a0b0c0d0e0f1011121314151617"
KW256 = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
BLOCK = "00112233445566778899aabbccddeeff"


class TestAES:
    def test_aes128_fips197_vector(self):
        result = aes.encrypt(BLOCK, KW128)
        assert result["result"].replace(" ", "") == "69c4e0d86a7b0430d8cdb78070b4c55a"

    def test_aes192_fips197_vector(self):
        result = aes.encrypt(BLOCK, KW192)
        assert result["result"].replace(" ", "") == "dda97ca4864cdfe06eaf70a0ec0d7191"

    def test_aes256_fips197_vector(self):
        result = aes.encrypt(BLOCK, KW256)
        assert result["result"].replace(" ", "") == "8ea2b7ca516745bfeafc49904b496089"

    def test_roundtrip_all_keys(self):
        for key in (KW128, KW192, KW256):
            enc = aes.encrypt(BLOCK, key)["result"].replace(" ", "")
            dec = aes.decrypt(enc, key)["result"].replace(" ", "")
            assert dec == BLOCK

    def test_round_count(self):
        assert len(aes.encrypt(BLOCK, KW128)["extra"]["round_states"]) == 11  # 0..10
        assert len(aes.encrypt(BLOCK, KW256)["extra"]["round_states"]) == 15  # 0..14

    def test_invalid_key_size(self):
        with pytest.raises(AlgorithmError):
            aes.encrypt(BLOCK, "0011223344556677")  # 8 bytes

    def test_invalid_block_size(self):
        with pytest.raises(AlgorithmError):
            aes.encrypt("00112233", KW128)

    def test_metadata(self):
        assert aes.get_metadata()["security_status"] == "secure"


# ---------------------------------------------------------------------------
# Blowfish (official Schneier vectors)
# ---------------------------------------------------------------------------


class TestBlowfish:
    def test_zero_key_vector(self):
        result = blowfish.encrypt("0000000000000000", "0" * 32)
        assert result["result"].replace(" ", "").lower() == "4ef997456198dd78"

    def test_all_ff_key_vector(self):
        result = blowfish.encrypt("ffffffffffffffff", "f" * 32)
        assert result["result"].replace(" ", "").lower() == "51866fd5b85ecb8a"

    def test_roundtrip(self):
        block = "4E6F772069732074"
        key = "0123456789ABCDEFFEDCBA9876543210"
        enc = blowfish.encrypt(block, key)["result"].replace(" ", "")
        assert blowfish.decrypt(enc, key)["result"].replace(" ", "").lower() == block.lower()

    def test_variable_key_lengths(self):
        # Keys from 4 to 56 bytes must all be accepted.
        for n in (4, 8, 16, 24, 32, 48, 56):
            key = ("ab" * n).upper()[: n * 2]
            result = blowfish.encrypt("0123456789ABCDEF", key)
            assert len(result["result"].replace(" ", "")) == 16

    def test_round_count(self):
        assert len(blowfish.encrypt("0123456789ABCDEF", "0" * 32)["extra"]["round_states"]) == 16

    def test_deprecated_flag(self):
        # Must be entered at least 128 bits (16 bytes).
        assert blowfish.get_metadata()["security_status"] == "deprecated"
        assert blowfish.encrypt("0123456789ABCDEF", "0" * 32)["extra"]["deprecated_warning"] is True

    def test_short_key_rejected(self):
        with pytest.raises(AlgorithmError):
            blowfish.encrypt("0123456789ABCDEF", "00FF")  # 2 bytes < 4

    def test_long_key_rejected(self):
        with pytest.raises(AlgorithmError):
            blowfish.encrypt("0123456789ABCDEF", "ab" * 57)  # 57 bytes > 56

    def test_invalid_block(self):
        with pytest.raises(AlgorithmError):
            blowfish.encrypt("01234567", "0" * 32)

    def test_metadata(self):
        md = blowfish.get_metadata()
        assert md["block_size"] == "64 bits"
        assert md["reversible"] is True


# ---------------------------------------------------------------------------
# Twofish (official ecb_tbl / ecb_ival / paper B.2 vectors)
# ---------------------------------------------------------------------------


class TestTwofish:
    def test_zero_key_zero_block(self):
        result = twofish.encrypt("0" * 32, "0" * 32)
        assert result["result"].replace(" ", "").upper() == "9F589F5CF6122C32B6BFEC2F2AE8C35A"

    def test_zero_key_chained_vector(self):
        # ecb_tbl I=2: same zero key, plaintext = previous ciphertext.
        pt = "9F589F5CF6122C32B6BFEC2F2AE8C35A"
        result = twofish.encrypt(pt, "0" * 32)
        assert result["result"].replace(" ", "").upper() == "D491DB16E7B1C39E86CB086B789F5419"

    def test_192_zero_key(self):
        result = twofish.encrypt("0" * 32, "0" * 48)
        assert result["result"].replace(" ", "").upper() == "EFA71F788965BD4453F860178FC19101"

    def test_192_abc_key(self):
        key = "0123456789ABCDEFFEDCBA98765432100011223344556677"
        result = twofish.encrypt("0" * 32, key)
        assert result["result"].replace(" ", "").upper() == "CFD1D2E5A9BE9CDF501F13B892BD2248"

    def test_256_zero_key(self):
        result = twofish.encrypt("0" * 32, "0" * 64)
        assert result["result"].replace(" ", "").upper() == "57FF739D4DC92C1BD7FC01700CC8216F"

    def test_256_abc_key(self):
        key = "0123456789ABCDEFFEDCBA987654321000112233445566778899AABBCCDDEEFF"
        result = twofish.encrypt("0" * 32, key)
        assert result["result"].replace(" ", "").upper() == "37527BE0052334B89F0CFCCAE87CFA20"

    def test_roundtrip_all_keys(self):
        for key in ("0" * 32, "0" * 48, "0" * 64):
            block = "00112233445566778899AABBCCDDEEFF"
            enc = twofish.encrypt(block, key)["result"].replace(" ", "")
            dec = twofish.decrypt(enc, key)["result"].replace(" ", "")
            assert dec == block.lower()

    def test_16_round_states(self):
        assert len(twofish.encrypt("0" * 32, "0" * 32)["extra"]["round_states"]) == 16

    def test_invalid_key_size(self):
        with pytest.raises(AlgorithmError):
            twofish.encrypt("0" * 32, "0" * 40)  # 20 bytes

    def test_invalid_block_size(self):
        with pytest.raises(AlgorithmError):
            twofish.encrypt("00112233", "0" * 32)

    def test_metadata(self):
        md = twofish.get_metadata()
        assert md["security_status"] == "secure"
        assert md["block_size"] == "128 bits"
        assert md["reversible"] is True


# ---------------------------------------------------------------------------
# ChaCha20 (RFC 8439)
# ---------------------------------------------------------------------------

CHACHA_KEY = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"


class TestChaCha20:
    def test_rfc8439_block_keystream(self):
        # RFC 8439 §2.3.2 serialized block.
        nonce = "000000090000004a00000000"
        _, words = chacha20.chacha_block(CHACHA_KEY, nonce, 1)
        keystream = b"".join(w.to_bytes(4, "little") for w in words).hex()
        assert keystream == (
            "10f1e7e4d13b5915500fdd1fa32071c4"
            "c7d1f4c733c068030422aa9ac3d46c4e"
            "d2826446079faa0914c2d705d98b02a2b"
            "5129cd1de164eb9cbd083e8a2503c4e"
        )

    def test_rfc8439_sunscreen_encrypt(self):
        # RFC 8439 §2.4.2 full ciphertext (2 blocks, counter 1).
        nonce = "000000000000004a00000000"
        pt = ("Ladies and Gentlemen of the class of '99: If I could offer "
              "you only one tip for the future, sunscreen would be it.")
        result = chacha20.encrypt(pt, CHACHA_KEY, nonce, 1)
        assert result["result"].replace(" ", "") == (
            "6e2e359a2568f98041ba0728dd0d6981e97e7aec1d4360c20a27afccfd9fae0b"
            "f91b65c5524733ab8f593dabcd62b3571639d624e65152ab8f530c359f0861d8"
            "07ca0dbf500d6a6156a38e088a22b65e52bc514d16ccf806818ce91ab7793736"
            "5af90bbf74a35be6b40b8eedf2785e42874d"
        )

    def test_roundtrip(self):
        nonce = "000000000000004a00000000"
        pt = "Hello, cryptography course!"
        enc = chacha20.encrypt(pt, CHACHA_KEY, nonce, 1)["result"]
        dec = chacha20.decrypt(enc, CHACHA_KEY, nonce, 1)["result"]
        assert dec == pt

    def test_counter_controls_keystream(self):
        nonce = "000000000000004a00000000"
        ks1 = b"".join(w.to_bytes(4, "little")
                       for w in chacha20.chacha_block(CHACHA_KEY, nonce, 1)[1])
        ks2 = b"".join(w.to_bytes(4, "little")
                       for w in chacha20.chacha_block(CHACHA_KEY, nonce, 2)[1])
        assert ks1 != ks2

    def test_invalid_key_length(self):
        with pytest.raises(AlgorithmError):
            chacha20.encrypt("HI", "00" * 16, "0" * 24, 1)

    def test_invalid_nonce_length(self):
        with pytest.raises(AlgorithmError):
            chacha20.encrypt("HI", CHACHA_KEY, "00" * 8, 1)

    def test_metadata(self):
        assert chacha20.get_metadata()["security_status"] == "secure"