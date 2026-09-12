"""Tests for RSA, Diffie–Hellman, ElGamal and the hash functions."""

import hashlib

import pytest

from app.algorithms import (
    blake2,
    blake3,
    diffie_hellman,
    elgamal,
    md5,
    rsa,
    sha1,
    sha256,
    sha3,
    sha512,
)
from app.utils.errors import AlgorithmError


# ---------------------------------------------------------------------------
# RSA
# ---------------------------------------------------------------------------


class TestRSA:
    def test_key_generation(self):
        keys = rsa.generate_keys(61, 53)
        assert keys["n"] == 3233
        assert keys["phi"] == 3120
        assert (keys["e"] * keys["d"]) % keys["phi"] == 1
        assert keys["public_key"] == {"e": keys["e"], "n": 3233}
        assert keys["private_key"] == {"d": keys["d"], "n": 3233}

    def test_roundtrip(self):
        p, q = 61, 53
        enc = rsa.encrypt(p, q, "HI")
        assert rsa.decrypt(p, q, enc["result"])["result"] == "HI"

    def test_roundtrip_e_supplied(self):
        p, q = 101, 103
        enc = rsa.encrypt(p, q, "AB", 7)
        assert rsa.decrypt(p, q, enc["result"], 7)["result"] == "AB"

    def test_classic_vector(self):
        # Classic textbook example: p=61, q=53, e auto -> public key must hold.
        result = rsa.encrypt(61, 53, "HI")
        assert result["extra"]["n"] == 3233

    def test_non_prime_rejected(self):
        with pytest.raises(AlgorithmError):
            rsa.encrypt(60, 53, "HI")

    def test_equal_primes_rejected(self):
        with pytest.raises(AlgorithmError):
            rsa.encrypt(61, 61, "HI")

    def test_message_too_large(self):
        with pytest.raises(AlgorithmError):
            rsa.encrypt(61, 53, "VERYLONG MESSAGE")

    def test_textbook_note_present(self):
        result = rsa.encrypt(61, 53, "HI")
        assert "OAEP" in result["extra"]["textbook_note"]

    def test_structured_pow_steps(self):
        result = rsa.encrypt(61, 53, "HI")
        assert "pow_details" in result["extra"]
        assert "steps" in result["extra"]["pow_details"]


# ---------------------------------------------------------------------------
# Diffie–Hellman
# ---------------------------------------------------------------------------


class TestDiffieHellman:
    def test_classic_small_example(self):
        result = diffie_hellman.exchange(23, 5, 6, 15)
        assert result["result"] == 2  # 5^6^15 mod 23 -> 2
        assert result["extra"]["shared_secret_match"] is True
        assert result["extra"]["alice"]["public_value"] == 8
        assert result["extra"]["bob"]["public_value"] == 19

    def test_shared_secret_equality(self):
        result = diffie_hellman.exchange(467, 2, 151, 343)
        alice = result["extra"]["alice"]["public_value"]
        bob = result["extra"]["bob"]["public_value"]
        assert pow(bob, 151, 467) == pow(alice, 343, 467) == result["result"]

    def test_non_prime_rejected(self):
        with pytest.raises(AlgorithmError):
            diffie_hellman.exchange(22, 5, 6, 15)

    def test_not_encryption_note(self):
        result = diffie_hellman.exchange(23, 5, 6, 15)
        assert "does not authenticate" in result["extra"]["security_note"]

    def test_metadata_says_key_exchange(self):
        assert diffie_hellman.get_metadata()["category"] == "key_exchange"
        assert diffie_hellman.get_metadata()["reversible"] is False


# ---------------------------------------------------------------------------
# ElGamal
# ---------------------------------------------------------------------------


class TestElGamal:
    def test_key_generation(self):
        keys = elgamal.generate_keys(467, 2, 127)
        assert keys["y"] == pow(2, 127, 467)
        assert keys["public_key"] == {"p": 467, "g": 2, "y": keys["y"]}

    def test_roundtrip(self):
        result = elgamal.encrypt(467, 2, 127, "HI")
        cipher = result["extra"]["cipher"]
        dec = elgamal.decrypt(467, 2, 127, cipher["c1"], cipher["c2"])
        assert dec["result"] == "HI"

    def test_numeric_message_roundtrip(self):
        result = elgamal.encrypt(467, 2, 127, "123")
        cipher = result["extra"]["cipher"]
        dec = elgamal.decrypt(467, 2, 127, cipher["c1"], cipher["c2"])
        # Decoding a numeric message maps back through same scheme.
        assert result["result"]["c1"] == cipher["c1"]

    def test_same_message_different_ciphertexts(self):
        r1 = elgamal.encrypt(467, 2, 127, "HI", k=11)
        r2 = elgamal.encrypt(467, 2, 127, "HI", k=13)
        assert r1["extra"]["cipher"] != r2["extra"]["cipher"]
        for r in (r1, r2):
            c = r["extra"]["cipher"]
            assert elgamal.decrypt(467, 2, 127, c["c1"], c["c2"])["result"] == "HI"

    def test_invalid_prime(self):
        with pytest.raises(AlgorithmError):
            elgamal.encrypt(468, 2, 127, "HI")

    def test_message_out_of_range(self):
        with pytest.raises(AlgorithmError):
            elgamal.encrypt(467, 2, 127, "AAA")


# ---------------------------------------------------------------------------
# SHA-256
# ---------------------------------------------------------------------------


class TestSHA256:
    VECTORS = {
        "": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "abc": "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
        "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq":
            "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
        "Cryptography": "b584eec728548aced5a66c0267dd520a00871b5e7b735b2d8202f86719f61857",
    }

    def test_known_digests(self):
        for message, expected in self.VECTORS.items():
            result = sha256.hash_text(message)
            assert result["result"] == expected, f"failed for {message!r}"

    def test_256_bit_output(self):
        result = sha256.hash_text("hello")
        assert len(result["result"]) == 64  # 256 bits in hex

    def test_avalanche(self):
        h1 = sha256.hash_text("The quick brown fox jumps over the lazy dog")["result"]
        h2 = sha256.hash_text("The quick brown fox jumps over the lazy doh")["result"]
        assert h1 != h2
        differing = sum(a != b for a, b in zip(h1, h2))
        assert differing > 20

    def test_steps_structure(self):
        result = sha256.hash_text("abc")
        assert len(result["steps"]) >= 4
        # Padding step must exist.
        assert any("preprocess" in str(s["title"]).lower() for s in result["steps"])

    def test_not_reversible_note(self):
        result = sha256.hash_text("abc")
        assert "one_way_note" in result["extra"]
        assert "no decryption" in result["extra"]["one_way_note"].lower() or \
            "one-way" in result["extra"]["one_way_note"].lower()

    def test_metadata_not_reversible(self):
        assert sha256.get_metadata()["reversible"] is False
        assert sha256.get_metadata()["category"] == "hashing"

    def test_multiblock(self):
        result = sha256.hash_text("a" * 128)  # spans 3 blocks after padding
        assert result["extra"]["preprocess"]["block_count"] >= 3


# ---------------------------------------------------------------------------
# SHA-512
# ---------------------------------------------------------------------------


class TestSHA512:
    VECTORS = {
        "": "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce"
            "47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e",
        "abc": "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39"
               "a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
    }

    def test_known_digests(self):
        for message, expected in self.VECTORS.items():
            result = sha512.hash_text(message)
            assert result["result"] == expected, f"failed for {message!r}"

    def test_cross_check_hashlib(self):
        for message in ("hello", "The quick brown fox jumps over the lazy dog",
                        "a" * 200, "جبر"):
            expected = hashlib.sha512(message.encode("utf-8")).hexdigest()
            assert sha512.hash_text(message)["result"] == expected

    def test_512_bit_output(self):
        assert len(sha512.hash_text("hello")["result"]) == 128

    def test_not_reversible_note(self):
        assert "no decryption" in sha512.hash_text("abc")["extra"]["one_way_note"].lower()

    def test_metadata_status(self):
        assert sha512.get_metadata()["security_status"] == "secure"


# ---------------------------------------------------------------------------
# SHA-1
# ---------------------------------------------------------------------------


class TestSHA1:
    VECTORS = {
        "": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
        "abc": "a9993e364706816aba3e25717850c26c9cd0d89d",
    }

    def test_known_digests(self):
        for message, expected in self.VECTORS.items():
            result = sha1.hash_text(message)
            assert result["result"] == expected, f"failed for {message!r}"

    def test_160_bit_output(self):
        assert len(sha1.hash_text("hello")["result"]) == 40

    def test_metadata_deprecated(self):
        assert sha1.get_metadata()["security_status"] == "broken_deprecated"


# ---------------------------------------------------------------------------
# MD5
# ---------------------------------------------------------------------------


class TestMD5:
    VECTORS = {
        "": "d41d8cd98f00b204e9800998ecf8427e",
        "abc": "900150983cd24fb0d6963f7d28e17f72",
    }

    def test_known_digests(self):
        for message, expected in self.VECTORS.items():
            result = md5.hash_text(message)
            assert result["result"] == expected, f"failed for {message!r}"

    def test_128_bit_output(self):
        assert len(md5.hash_text("hello")["result"]) == 32

    def test_metadata_broken(self):
        assert md5.get_metadata()["security_status"] == "broken"


# ---------------------------------------------------------------------------
# SHA-3
# ---------------------------------------------------------------------------


class TestSHA3:
    VECTORS = {
        "224": {"": "6b4e03423667dbb73b6e15454f0eb1abd4597f9a1b078e3f5b5a6bc7",
                "abc": "e642824c3f8cf24ad09234ee7d3c766fc9a3a5168d0c94ad73b46fdf"},
        "256": {"": "a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a",
                "abc": "3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532"},
        "384": {"": "0c63a75b845e4f7d01107d852e4c2485c51a50aaaa94fc61995e71bbee983a2"
                    "ac3713831264adb47fb6bd1e058d5f004",
                "abc": "ec01498288516fc926459f58e2c6ad8df9b473cb0fc08c2596da7cf0e"
                       "49be4b298d88cea927ac7f539f1edf228376d25"},
        "512": {"": "a69f73cca23a9ac5c8b567dc185a756e97c982164fe25859e0d1dcc1475c80"
                    "a615b2123af1f5f94c11e3e9402c3ac558f500199d95b6d3e301758586281dcd26",
                "abc": "b751850b1a57168a5693cd924b6b096e08f621827444f70d884f5d0240"
                       "d2712e10e116e9192af3c91a7ec57647e3934057340b4cf408d5a56592f8274eec53f0"},
    }

    def test_known_digests(self):
        for variant, cases in self.VECTORS.items():
            for message, expected in cases.items():
                result = sha3.hash_text(message, variant)
                assert result["result"] == expected, \
                    f"failed for sha3-{variant} {message!r}"

    def test_cross_check_hashlib(self):
        for variant in ("224", "256", "384", "512"):
            for message in ("", "abc", "The quick brown fox jumps over the lazy dog",
                            "a" * 137):
                expected = hashlib.new("sha3_" + variant, message.encode()).hexdigest()
                assert sha3.hash_text(message, variant)["result"] == expected

    def test_invalid_variant(self):
        with pytest.raises(AlgorithmError):
            sha3.hash_text("abc", "999")

    def test_digest_len_matches_variant(self):
        for variant in ("224", "256", "384", "512"):
            digest = sha3.hash_text("abc", variant)["result"]
            assert len(digest) == int(variant) // 4


# ---------------------------------------------------------------------------
# BLAKE2
# ---------------------------------------------------------------------------


class TestBLAKE2:
    VECTORS = {
        "512": {"": "786a02f742015903c6c6fd852552d272912f4740e15847618a86e217f71f5419"
                    "d25e1031afee585313896444934eb04b903a685b1448b755d56f701afe9be2ce",
                "abc": "ba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbff"
                       "a2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923"},
        "256": {"": "69217a3079908094e11121d042354a7c1f55b6482ca1a51e1b250dfd1ed0eef9",
                "abc": "508c5e8c327c14e2e1a72ba34eeb452f37458b209ed63a294d999b4c86675982"},
    }

    def test_known_digests(self):
        for variant, cases in self.VECTORS.items():
            for message, expected in cases.items():
                result = blake2.hash_text(message, variant)
                assert result["result"] == expected, \
                    f"failed for blake2{variant} {message!r}"

    def test_cross_check_hashlib(self):
        names = {"512": "blake2b", "256": "blake2s"}
        for n in ("512", "256"):
            for message in ("", "abc", "The quick brown fox jumps over the lazy dog",
                            "a" * 129, "a" * 1000):
                expected = hashlib.new(names[n], message.encode()).hexdigest()
                assert blake2.hash_text(message, n)["result"] == expected

    def test_invalid_variant(self):
        with pytest.raises(AlgorithmError):
            blake2.hash_text("abc", "128")


# ---------------------------------------------------------------------------
# BLAKE3
# ---------------------------------------------------------------------------


class TestBLAKE3:
    VECTORS = {
        "": "af1349b9f5f9a1a6a0404dea36dcc9499bcb25c9adc112b7cc9a93cae41f3262",
        "abc": "6437b3ac38465133ffb63b75273a8db548c558465d79db03fd359c6cd5bd9d85",
        "The quick brown fox jumps over the lazy dog":
            "2f1514181aadccd913abd94cfa592701a5686ab23f8df1dff1b74710febc6d4a",
    }

    @staticmethod
    def _paint(n: int) -> bytes:
        return bytes(i % 251 for i in range(n))

    def test_known_digests(self):
        for message, expected in self.VECTORS.items():
            result = blake3.hash_text(message)
            assert result["result"] == expected, f"failed for {message!r}"

    def test_chunk_boundaries(self):
        for n in (63, 64, 65, 1023, 1024, 1025, 2049, 4096):
            result = blake3.hash_bytes(self._paint(n), 32)
            assert len(result["digest"]) == 64
            assert result["digest"] != blake3.hash_bytes(b"", 32)["digest"]

    def test_block_boundaries_match_reference(self):
        # Official reference digests for the 1024/1025 boundary.
        assert blake3.hash_bytes(self._paint(1024), 32)["digest"] == \
            "42214739f095a406f3fc83deb889744ac00df831c10daa55189b5d121c855af7"
        assert blake3.hash_bytes(self._paint(1025), 32)["digest"] == \
            "d00278ae47eb27b34faecf67b4fe263f82d5412916c1ffd97c8cb7fb814b8444"

    def test_xof_length(self):
        for n in (0, 1, 64, 65, 131):
            digest = blake3.hash_bytes(self._paint(n), 131)["digest"]
            assert len(digest) == 262
            assert digest[:64] == blake3.hash_bytes(self._paint(n), 32)["digest"]

    def test_tree_structure(self):
        result = blake3.hash_bytes(self._paint(4096), 32)
        assert result["chunk_count"] == 4
        assert result["tree_size"] == 4

    def test_invalid_length(self):
        with pytest.raises(AlgorithmError):
            blake3.hash_text("abc", 0)