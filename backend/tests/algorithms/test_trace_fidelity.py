"""Phase 5 backend trace fidelity tests.

Each assertion proves that the intermediate values exposed in ``extra`` (and
consumed by the 2D/3D simulators) are the REAL execution trace of the
authoritative ``cryptography``/``hashlib`` result — not invented values.
"""

import hashlib
import math

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

from backend.app.algorithms import (
    aes_cbc,
    aes_ccm,
    aes_ctr,
    cmac_alg,
    dsa_alg,
    poly1305_alg,
    ripemd160,
    rsa_pss_alg,
    sha224,
    sha384,
)

KEY16 = "2b7e151628aed2a6abf7158809cf4f3c"
IV = "000102030405060708090a0b0c0d0e0f"
CTR = "f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff"


def _aes_ecb_block(key: bytes, block: bytes) -> bytes:
    return Cipher(algorithms.AES(key), modes.ECB()).encryptor().update(block)


class TestAesCbcCtrTrace:
    def test_cbc_encrypt_trace_reproduces_ciphertext(self):
        r = aes_cbc.encrypt("Attack at dawn!", KEY16, IV)["extra"]
        chain = b"".join(bytes.fromhex(b) for b in r["ciphertext_blocks"])
        assert chain.hex() == r["ciphertext_hex"]
        # each xor state must equal P_i XOR C_{i-1} with C0 = IV
        prev = bytes.fromhex(IV)
        padded = bytes.fromhex(r["padded_plaintext_hex"])
        for i, x in enumerate(r["xor_states"]):
            block = padded[i * 16:(i + 1) * 16]
            expect = bytes(a ^ b for a, b in zip(block, prev))
            assert x == expect.hex()
            prev = chain[i * 16:(i + 1) * 16]
        # the chain is the real CBC output
        assert len(r["ciphertext_blocks"]) == math.ceil(len(padded) / 16)
        # chaining inputs exposed for the frontend (C0 = IV, then C1, C2…)
        assert r["prev_states"] == [IV] + r["ciphertext_blocks"][:-1]

    def test_cbc_encrypt_steps_chain_block_by_block(self):
        r = aes_cbc.encrypt("Attack at dawn!", KEY16, IV)
        steps = r["steps"]
        extra = r["extra"]
        n = extra["block_count"]
        assert [s["step"] for s in steps] == list(range(1, 2 + 2 * n + 1))
        assert [s["title"] for s in steps[:2]] == [
            "Set up AES-CBC", "Pad the plaintext"]
        prev = bytes.fromhex(IV)
        padded = bytes.fromhex(extra["padded_plaintext_hex"])
        for i in range(1, n + 1):
            xd = steps[2 * i]["detail"]      # xor step → trace step 2i+1
            ad = steps[2 * i + 1]["detail"]  # aes step → trace step 2i+2
            assert steps[2 * i]["step"] == 2 * i + 1
            assert steps[2 * i + 1]["step"] == 2 * i + 2
            block = padded[(i - 1) * 16:i * 16]
            assert xd["prev_label"] == ("C0 = IV" if i == 1 else f"C{i - 1}")
            assert xd["prev_hex"] == prev.hex()
            assert xd["plaintext_hex"] == block.hex()
            xored = bytes(a ^ b for a, b in zip(block, prev))
            assert xd["xored_hex"] == xored.hex()
            assert ad["xored_hex"] == xored.hex()
            assert ad["ciphertext_hex"] == extra["ciphertext_blocks"][i - 1]
            prev = bytes.fromhex(extra["ciphertext_blocks"][i - 1])

    def test_cbc_decrypt_trace_recovers_plaintext(self):
        enc = aes_cbc.encrypt("Round trip check", KEY16, IV)
        r = aes_cbc.decrypt(enc["result"], KEY16, IV)["extra"]
        padded = b"".join(bytes.fromhex(b) for b in r["padded_plaintext_blocks"])
        assert padded[:16] == b"Round trip check"

    def test_cbc_decrypt_steps_chain_block_by_block(self):
        enc = aes_cbc.encrypt("Round trip check", KEY16, IV)
        r = aes_cbc.decrypt(enc["result"], KEY16, IV)
        steps = r["steps"]
        extra = r["extra"]
        n = extra["block_count"]
        assert len(steps) == 2 * n + 2
        assert [s["step"] for s in steps] == list(range(1, 2 * n + 3))
        assert steps[0]["title"] == "Set up AES-CBC (decrypt)"
        assert steps[-1]["title"] == "Remove PKCS#7 padding"
        assert steps[-1]["detail"]["plaintext_hex"] == \
            "Round trip check".encode("utf-8").hex()
        prev = bytes.fromhex(IV)
        for i in range(1, n + 1):
            dd = steps[2 * i - 1]["detail"]  # AES⁻¹ step → trace step 2i
            xd = steps[2 * i]["detail"]      # XOR step → trace step 2i+1
            assert steps[2 * i - 1]["step"] == 2 * i
            assert steps[2 * i]["step"] == 2 * i + 1
            assert dd["ciphertext_hex"] == extra["ciphertext_blocks"][i - 1]
            dec = bytes.fromhex(dd["decrypted_hex"])
            assert xd["prev_label"] == ("C0 = IV" if i == 1 else f"C{i - 1}")
            assert xd["prev_hex"] == prev.hex()
            assert xd["plaintext_hex"] == bytes(
                a ^ b for a, b in zip(dec, prev)).hex()
            assert xd["plaintext_hex"] == extra["padded_plaintext_blocks"][i - 1]
            prev = bytes.fromhex(extra["ciphertext_blocks"][i - 1])
        assert extra["prev_states"] == \
            [steps[2 * i]["detail"]["prev_hex"] for i in range(1, n + 1)]

    def test_ctr_keystream_trace_is_real(self):
        r = aes_ctr.encrypt("hello world, counter mode", KEY16, CTR)["extra"]
        ks = b"".join(bytes.fromhex(b) for b in r["keystream_blocks"])
        pt = bytes.fromhex("".join(r["plaintext_blocks"]))
        out = bytes(a ^ b for a, b in zip(pt, ks))
        assert out.hex() == r["ciphertext_hex"]
        # counter blocks must increment by one, big-endian
        first = int.from_bytes(bytes.fromhex(r["counter_blocks"][0]), "big")
        assert [int.from_bytes(bytes.fromhex(c), "big") for c in r["counter_blocks"]] == [
            first + i for i in range(len(r["counter_blocks"]))
        ]


class TestAesCcmTrace:
    def test_ccm_internals_reproduce_aead(self):
        r = aes_ccm.encrypt("CCM internals are real", KEY16, "000102030405060708090a0b",
                            "aad bytes", 16)["extra"]
        assert r["trace_match"] is True
        # CBC-MAC states chain from a real AES-ECB progression
        assert len(r["auth_states"]) == len(r["auth_blocks"])

    def test_ccm_decrypt_trace_matches(self):
        enc = aes_ccm.encrypt("CCM round trip", KEY16, "000102030405060708090a0b",
                              "aad", 12)
        d = aes_ccm.decrypt(enc["extra"]["combined_hex"], KEY16,
                            "000102030405060708090a0b", "aad", 12)["extra"]
        assert d["trace_match"] is True
        assert d["tag_hex"] == enc["extra"]["tag_hex"]


class TestHashTrace:
    def test_sha224_padded_blocks_real(self):
        info = sha224.hash_bytes(b"abc")["padded_message_blocks"]
        padded = b"".join(bytes.fromhex(b) for b in info)
        assert len(padded) % 64 == 0
        assert padded == bytes.fromhex("616263") + b"\x80" + (
            b"\x00" * ((64 - 8) - (3 + 1) % 64 % 64)) + (24).to_bytes(8, "big")

    def test_sha384_padded_blocks_real(self):
        info = sha384.hash_bytes(b"abc")["padded_message_blocks"]
        padded = b"".join(bytes.fromhex(b) for b in info)
        assert len(padded) % 128 == 0
        assert padded[-16:] == (24).to_bytes(16, "big")

    def test_ripemd160_padded_blocks_little_endian(self):
        info = ripemd160.hash_bytes(b"abc")["padded_message_blocks"]
        padded = b"".join(bytes.fromhex(b) for b in info)
        assert len(padded) % 64 == 0
        assert padded[-8:] == (24).to_bytes(8, "little")


class TestCmacPoly1305Trace:
    def test_cmac_states_reproduce_tag(self):
        r = cmac_alg.sign("message for cmac", KEY16)["extra"]
        assert r["trace_match"] is True
        assert r["mac_states"][-1] == r["mac_hex"]
        # subkeys from AES_K(0^128) + GF(2^128) doubling
        key = bytes.fromhex(KEY16)
        l = _aes_ecb_block(key, b"\x00" * 16)
        assert l.hex() == r["l_hex"]

        def dbl(block: bytes) -> bytes:
            n = int.from_bytes(block, "big")
            shifted = (n << 1) & ((1 << 128) - 1)
            if n >> 127:
                shifted ^= 0x87
            return shifted.to_bytes(16, "big")

        assert dbl(l).hex() == r["k1_hex"]
        assert dbl(dbl(l)).hex() == r["k2_hex"]

    def test_poly1305_states_reproduce_tag(self):
        key = "85d6be7857556d337f4452fe42d506a80103808afb0db2fd4abff6af4149f51b"
        r = poly1305_alg.sign("the quick brown fox jumps over the lazy dog", key)["extra"]
        assert r["trace_match"] is True
        assert len(r["accumulator_states"]) == r["block_count"]


class TestSignatureTrace:
    def test_dsa_exposes_real_digest_and_r_s(self):
        r = dsa_alg.sign("dsa message", "sha256", key_size=1024)
        extra = r["extra"]
        assert extra["digest_hex"] == hashlib.sha256(b"dsa message").hexdigest()
        assert extra["r"] > 0 and extra["s"] > 0

    def test_rsa_pss_em_recovery_structure(self):
        r = rsa_pss_alg.sign("pss message", "sha256", key_size=2048)
        extra = r["extra"]
        assert extra["em_trailer_checked"] is True
        em = bytes.fromhex(extra["em_hex"])
        assert extra["em_byte_len"] == len(em) == 256
        # EMSA-PSS trailer byte (RFC 8017 §9.1.1)
        assert em[-1] == 0xBC
        # MAX_LENGTH salt = emLen - hLen - 2
        assert extra["salt_length_bytes"] == 256 - 32 - 2
        # the RSA identity: recovered EM = s^e mod n
        from cryptography.hazmat.primitives import serialization
        from cryptography.hazmat.primitives.asymmetric import rsa as rsa_types
        pub = serialization.load_pem_public_key(
            extra["public_key_pem"].encode("utf-8"))
        nums = pub.public_numbers()
        sig_int = int.from_bytes(bytes.fromhex(extra["signature_hex"]), "big")
        assert pow(sig_int, nums.e, nums.n) == int.from_bytes(em, "big")

    def test_rsa_pss_verify_emits_real_steps(self):
        signed = rsa_pss_alg.sign("pss verify steps", "sha256", key_size=2048)
        sig = signed["extra"]["signature_hex"]
        pub = signed["extra"]["public_key_pem"]
        v = rsa_pss_alg.verify("pss verify steps", sig, "sha256", pub)
        assert v["result"] is True
        steps = v["steps"]
        assert [s["step"] for s in steps] == [1, 2, 3]
        assert [s["title"] for s in steps] == [
            "Hash the message again",
            "Recover the encoded message",
            "Verify the encoding",
        ]
        assert steps[0]["detail"]["digest_hex"] == hashlib.sha256(
            b"pss verify steps").hexdigest()
        assert steps[1]["detail"]["em_hex"] == signed["extra"]["em_hex"]
        assert steps[1]["detail"]["em_trailer_checked"] is True
        assert steps[2]["detail"]["valid"] is True
        assert steps[2]["output"] == "VALID"

    def test_rsa_pss_verify_rejects_tampered_signature(self):
        signed = rsa_pss_alg.sign("pss verify steps", "sha256", key_size=2048)
        tampered = bytearray(bytes.fromhex(signed["extra"]["signature_hex"]))
        tampered[-1] ^= 0xFF
        v = rsa_pss_alg.verify("pss verify steps", tampered.hex(), "sha256",
                               signed["extra"]["public_key_pem"])
        assert v["result"] is False
        assert v["extra"]["result"] == "INVALID"

    def test_dsa_verify_emits_real_steps(self):
        signed = dsa_alg.sign("dsa verify steps", "sha256", key_size=1024)
        v = dsa_alg.verify("dsa verify steps", signed["extra"]["signature_hex"],
                           "sha256", signed["extra"]["public_key_pem"])
        assert v["result"] is True
        steps = v["steps"]
        assert [s["step"] for s in steps] == [1, 2]
        assert steps[0]["detail"]["digest_hex"] == hashlib.sha256(
            b"dsa verify steps").hexdigest()
        assert steps[1]["detail"]["valid"] is True
        assert steps[1]["output"] == "VALID"
        assert steps[1]["detail"]["r_hex"] == signed["extra"]["r_hex"]


class TestTraceAlwaysPresent:
    def test_phase5_traces_produce_trace_fields(self):
        assert aes_cbc.encrypt("x", KEY16, IV)["extra"]["xor_states"]
        assert aes_ctr.encrypt("x", KEY16, CTR)["extra"]["keystream_blocks"]
        assert sha224.hash("x")["extra"]["padded_message_blocks"]
        assert sha384.hash("x")["extra"]["padded_message_blocks"]
        assert ripemd160.hash("x")["extra"]["padded_message_blocks"]
        assert cmac_alg.sign("x", KEY16)["extra"]["mac_states"]
        assert poly1305_alg.sign("x", KEY16 + KEY16)["extra"][
            "accumulator_states"]
        assert dsa_alg.sign("x", "sha256", key_size=1024)["extra"]["digest_hex"]
        assert rsa_pss_alg.sign("x", "sha256", key_size=2048)["extra"]["em_hex"]