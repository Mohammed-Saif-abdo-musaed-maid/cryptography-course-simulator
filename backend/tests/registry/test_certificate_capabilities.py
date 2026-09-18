"""Guards for the additive Phase-4 certificate / PKI capabilities."""

from backend.app.algorithms.registry import CAPABILITIES, CAPABILITY_KEYS, get_capabilities

CERTIFICATE_ALGORITHMS = ("rsa", "ecdsa", "ed25519")


class TestCertificateCapabilities:
    def test_keys_are_added_to_the_capability_model(self):
        assert "digitalCertificate" in CAPABILITY_KEYS
        assert "certificateAuthority" in CAPABILITY_KEYS

    def test_signature_and_certificate_are_separate_capabilities(self):
        # Related but distinct: neither key is an alias of the other.
        assert "digitalSignature" in CAPABILITY_KEYS
        assert "digitalCertificate" in CAPABILITY_KEYS
        assert CAPABILITY_KEYS.index("digitalSignature") != CAPABILITY_KEYS.index(
            "digitalCertificate"
        )

    def test_signature_algorithms_support_certificates(self):
        for alg_id in CERTIFICATE_ALGORITHMS:
            flags = CAPABILITIES[alg_id]
            assert flags["digitalCertificate"] is True
            assert flags["certificateAuthority"] is True
            assert flags["digitalSignature"] is True

    def test_only_signature_algorithms_claim_certificates(self):
        for alg_id, flags in CAPABILITIES.items():
            if flags["digitalCertificate"] or flags["certificateAuthority"]:
                assert alg_id in CERTIFICATE_ALGORITHMS, alg_id

    def test_non_signature_algorithms_never_claim_certificates(self):
        for alg_id in ("hmac", "sha256", "aes_gcm", "pbkdf2", "ecdh", "caesar"):
            flags = get_capabilities(alg_id)
            assert flags["digitalCertificate"] is False
            assert flags["certificateAuthority"] is False
