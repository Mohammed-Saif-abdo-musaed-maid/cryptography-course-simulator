"""Tests for the new key-exchange modules (ECDH, X25519)."""

import pytest

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.x25519 import (
    X25519PrivateKey,
    X25519PublicKey,
)

from backend.app.algorithms import ecdh, x25519
from backend.app.utils.errors import ValidationError

POINT_BYTES = {"p256": 65, "p384": 97, "p521": 133}
SECRET_HEX = {"p256": 64, "p384": 96, "p521": 132}


class TestECDH:
    def test_shared_secret_matches(self):
        res = ecdh.exchange("p256")
        assert res["extra"]["shared_secret_match"] is True
        assert len(res["extra"]["shared_secret_hex"]) == SECRET_HEX["p256"]

    def test_curve_sizes(self):
        for curve in ("p256", "p384", "p521"):
            res = ecdh.exchange(curve)
            alice = res["extra"]["alice"]
            assert len(bytes.fromhex(alice["public_hex"])) == POINT_BYTES[curve]
            assert res["extra"]["shared_secret_match"] is True

    def test_both_parties_have_keys(self):
        res = ecdh.exchange("p256")
        assert res["extra"]["alice"]["private_scalar"] > 0
        assert res["extra"]["bob"]["private_scalar"] > 0
        assert res["extra"]["alice"]["public_hex"]
        assert res["extra"]["bob"]["public_hex"]

    def test_invalid_curve_rejected(self):
        with pytest.raises(ValidationError) as exc:
            ecdh.exchange("p999")
        assert exc.value.code == "invalid_curve"

    def test_security_warning_present(self):
        res = ecdh.exchange("p256")
        assert "تعليمية" in res["extra"]["security_warning"]


class TestX25519:
    def test_shared_secret_and_shapes(self):
        res = x25519.exchange()
        extra = res["extra"]
        assert extra["shared_secret_match"] is True
        assert len(extra["shared_secret_hex"]) == 64
        assert len(extra["alice"]["private_hex"]) == 64
        assert len(extra["alice"]["public_hex"]) == 64
        assert len(extra["bob"]["private_hex"]) == 64

    def test_independent_recomputation(self):
        """Recompute the shared secret with the library to verify correctness."""
        res = x25519.exchange()
        alice_priv = X25519PrivateKey.from_private_bytes(
            bytes.fromhex(res["extra"]["alice"]["private_hex"]))
        bob_pub = X25519PublicKey.from_public_bytes(
            bytes.fromhex(res["extra"]["bob"]["public_hex"]))
        recomputed = alice_priv.exchange(bob_pub).hex()
        assert recomputed == res["extra"]["shared_secret_hex"]

    def test_unique_each_run(self):
        a = x25519.exchange()["extra"]["shared_secret_hex"]
        b = x25519.exchange()["extra"]["shared_secret_hex"]
        assert a != b

    def test_security_warning_present(self):
        assert "تعليمية" in x25519.exchange()["extra"]["security_warning"]
