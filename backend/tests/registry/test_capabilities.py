"""Guards for the additive Capability Model (Phase 1).

Every registered algorithm must declare a complete, boolean capability map.
Capabilities are metadata for the UI only -- they never drive the existing
execute() dispatch -- so these tests also check that capability flags stay
consistent with each algorithm's actual `operations` and category.
"""

from backend.app.algorithms import registry
from backend.app.algorithms.registry import (
    ALGORITHMS,
    CAPABILITIES,
    CAPABILITY_KEYS,
    get_capabilities,
)

AEAD_FILE_CIPHERS = ("aes_gcm", "aes_ccm", "chacha20_poly1305")
# Algorithms whose modules sign/verify arbitrary bytes (file signatures).
# DSA and RSA-PSS sign text via PEM keys but declare no file-signature flag.
SIGNATURE_ALGORITHMS = ("ecdsa", "ed25519", "rsa")
KEY_EXCHANGE_ALGORITHMS = ("ecdh", "x25519", "x448", "diffie_hellman")
KDF_ALGORITHMS = ("pbkdf2", "bcrypt", "scrypt", "argon2", "hkdf")
HASH_ALGORITHMS = ("md5", "sha1", "sha256", "sha512", "sha3", "blake2",
                   "blake3", "sha224", "sha384", "ripemd160")
CLASSICAL_ALGORITHMS = (
    "caesar", "monoalphabetic", "vigenere", "playfair",
    "hill", "rail_fence", "columnar",
)
TEXT_ONLY_SYMMETRIC = ("des", "triple_des", "aes", "blowfish", "twofish",
                       "chacha20", "camellia", "aes_cbc", "aes_ctr")
TEXT_SIGNATURE_ALGORITHMS = ("dsa", "rsa_pss")


class TestCapabilityCompleteness:
    def test_every_algorithm_has_a_capability_map(self):
        assert set(ALGORITHMS) == set(CAPABILITIES)

    def test_every_map_is_complete_and_boolean(self):
        for alg_id, flags in CAPABILITIES.items():
            assert len(flags) == len(CAPABILITY_KEYS), alg_id
            assert list(flags) == CAPABILITY_KEYS, alg_id
            for key, value in flags.items():
                assert isinstance(value, bool), f"{alg_id}.{key}"

    def test_get_capabilities_matches_map(self):
        for alg_id in ALGORITHMS:
            assert get_capabilities(alg_id) == CAPABILITIES[alg_id]


class TestCatalogExposure:
    def test_registry_catalog_items_include_capabilities(self):
        catalog = registry.get_catalog()
        assert isinstance(catalog, list) and len(catalog) == len(ALGORITHMS)
        for item in catalog:
            assert item["capabilities"] == CAPABILITIES[item["id"]]

    def test_service_catalog_keeps_shapes(self):
        # The API-facing catalog (algorithm_service) wraps the registry list.
        from backend.app.services import algorithm_service
        wrapped = algorithm_service.get_catalog()
        assert {"algorithms", "categories"} == set(wrapped)
        for item in wrapped["algorithms"]:
            assert isinstance(item["operations"], list)
            assert item["capabilities"] == CAPABILITIES[item["id"]]

    def test_operations_still_drive_dispatch(self):
        # Capabilities must never replace operations: every registered
        # operation is either a callable on the module or a service-level
        # special operation (e.g. monoalphabetic generate_alphabet -> the
        # module's generate_random_alphabet helper).
        special_generated = {
            ("monoalphabetic", "generate_alphabet"): "generate_random_alphabet",
        }
        for alg_id, info in ALGORITHMS.items():
            for op in info["operations"]:
                if (alg_id, op) in special_generated:
                    # Assert a real helper backs the special operation.
                    assert callable(
                        getattr(info["module"], special_generated[(alg_id, op)], None)
                    ), f"{alg_id}.{op}"
                else:
                    assert callable(getattr(info["module"], op, None)), f"{alg_id}.{op}"


class TestCapabilityConsistency:
    def test_text_encryption_requires_encrypt_operation(self):
        for alg_id, info in ALGORITHMS.items():
            if CAPABILITIES[alg_id]["textEncryption"]:
                assert "encrypt" in info["operations"], alg_id

    def test_classical_ciphers_are_text_only(self):
        for alg_id in CLASSICAL_ALGORITHMS:
            flags = CAPABILITIES[alg_id]
            assert flags["textEncryption"] and flags["textDecryption"]
            assert not flags["fileEncryption"] and not flags["fileDecryption"]
            assert not flags["digitalSignature"] and not flags["mac"]
            assert not flags["hashing"]

    def test_educational_symmetric_modules_are_text_only(self):
        for alg_id in TEXT_ONLY_SYMMETRIC:
            flags = CAPABILITIES[alg_id]
            assert flags["textEncryption"] and flags["textDecryption"]
            assert not flags["fileEncryption"] and not flags["fileDecryption"]

    def test_only_aead_modules_are_file_encryptable(self):
        for alg_id, flags in CAPABILITIES.items():
            assert bool(flags["fileEncryption"]) == (alg_id in AEAD_FILE_CIPHERS)
            assert bool(flags["fileDecryption"]) == (alg_id in AEAD_FILE_CIPHERS)

    def test_signature_capabilities(self):
        for alg_id in SIGNATURE_ALGORITHMS:
            flags = CAPABILITIES[alg_id]
            assert flags["digitalSignature"] and flags["signatureVerification"]
            assert flags["fileSignature"] and flags["fileSignatureVerification"]
            assert not flags["fileEncryption"]  # signatures never encrypt files

    def test_no_algorithm_claims_file_signature_outside_signature_set(self):
        for alg_id, flags in CAPABILITIES.items():
            assert not flags["fileSignature"] or alg_id in SIGNATURE_ALGORITHMS

    def test_hash_algorithms_are_hash_only(self):
        for alg_id in HASH_ALGORITHMS:
            flags = CAPABILITIES[alg_id]
            assert flags["hashing"] and flags["fileHashing"]
            assert flags["integrityVerification"]
            assert not flags["textEncryption"] and not flags["digitalSignature"]
            assert not flags["mac"]

    def test_key_exchange_and_kdf_flags(self):
        for alg_id in KEY_EXCHANGE_ALGORITHMS:
            assert CAPABILITIES[alg_id]["keyExchange"] is True
        for alg_id in KDF_ALGORITHMS:
            assert CAPABILITIES[alg_id]["keyDerivation"] is True

    def test_hmac_is_mac_not_signature(self):
        flags = CAPABILITIES["hmac"]
        assert flags["mac"] and flags["macVerification"]
        assert not flags["digitalSignature"] and not flags["hashing"]

    def test_cmac_and_poly1305_are_macs(self):
        for alg_id in ("cmac", "poly1305"):
            flags = CAPABILITIES[alg_id]
            assert flags["mac"] and flags["macVerification"], alg_id
            assert not flags["digitalSignature"], alg_id
            assert not flags["hashing"], alg_id
            assert not flags["textEncryption"], alg_id

    def test_text_signature_algorithms_have_no_file_signature(self):
        for alg_id in TEXT_SIGNATURE_ALGORITHMS:
            flags = CAPABILITIES[alg_id]
            assert flags["digitalSignature"] and flags["signatureVerification"]
            assert not flags["fileSignature"]
            assert not flags["fileSignatureVerification"]
            assert not flags["fileEncryption"]

    def test_rsa_hybrid_but_not_direct_file_encryption(self):
        flags = CAPABILITIES["rsa"]
        assert flags["hybridEncryption"] is True
        assert not flags["fileEncryption"]  # RSA never encrypts files directly