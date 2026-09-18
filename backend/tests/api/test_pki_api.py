"""PKI API route tests (``/api/lab/certificate/*``) using FastAPI TestClient."""

import base64

import pytest
from fastapi.testclient import TestClient

from backend.app.lab import DigitalSignatureService
from backend.app.main import app

client = TestClient(app)

ALGORITHMS = ["rsa", "ecdsa", "ed25519"]
BINARY = b"\x00\xff\xfe\x80certificate file\x00"


def b64(data: bytes) -> str:
    return base64.b64encode(data).decode("ascii")


def keypair(algorithm):
    return DigitalSignatureService.generate_keys(algorithm, rsa_bits=2048, curve="p256")


def self_signed(algorithm, private_key_pem, common_name="leaf.test", is_ca=False):
    response = client.post(
        "/api/lab/certificate/self-signed",
        json={
            "algorithm": algorithm,
            "private_key_pem": private_key_pem,
            "subject": {"common_name": common_name, "organization": "Lab"},
            "validity_days": 30,
            "is_ca": is_ca,
            "san_dns": [common_name],
        },
    )
    assert response.status_code == 200, response.text
    return response.json()


def ca_certificate(algorithm, private_key_pem, common_name="Root CA"):
    response = client.post(
        "/api/lab/certificate/ca",
        json={
            "algorithm": algorithm,
            "private_key_pem": private_key_pem,
            "subject": {"common_name": common_name},
            "validity_days": 3650,
        },
    )
    assert response.status_code == 200, response.text
    return response.json()


def csr(algorithm, private_key_pem, common_name="csr.test"):
    response = client.post(
        "/api/lab/certificate/csr",
        json={
            "algorithm": algorithm,
            "private_key_pem": private_key_pem,
            "subject": {"common_name": common_name},
            "san_dns": [common_name],
        },
    )
    assert response.status_code == 200, response.text
    return response.json()


class TestInfo:
    def test_info_lists_certificate_algorithms(self):
        body = client.get("/api/lab/info").json()
        assert body["certificate_algorithms"] == ["rsa", "ecdsa", "ed25519"]
        assert "sha256" in body["certificate_hashes"]
        assert "server_auth" in body["extended_key_usages"]


class TestCertificateEndpoints:
    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_self_signed_certificate(self, algorithm):
        keys = keypair(algorithm)
        body = self_signed(algorithm, keys["private_key_pem"])
        assert body["self_signed"] is True
        assert body["certificate"]["public_key"]["algorithm"] == algorithm
        assert "private_key_pem" not in body
        assert "PRIVATE KEY" not in str(body)

    def test_ca_endpoint_sets_basic_constraints(self):
        keys = keypair("rsa")
        body = ca_certificate("rsa", keys["private_key_pem"])
        assert body["certificate"]["is_ca"] is True

    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_csr_endpoint(self, algorithm):
        keys = keypair(algorithm)
        body = csr(algorithm, keys["private_key_pem"])
        assert body["signature_valid"] is True
        assert "CERTIFICATE REQUEST" in body["csr_pem"]

    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_ca_signed_certificate_and_verify(self, algorithm):
        keys = keypair(algorithm)
        root = ca_certificate(algorithm, keys["private_key_pem"])
        request = csr(algorithm, keys["private_key_pem"])
        signed = client.post(
            "/api/lab/certificate/sign",
            json={
                "csr_pem": request["csr_pem"],
                "ca_certificate_pem": root["certificate"]["pem"],
                "ca_private_key_pem": keys["private_key_pem"],
                "validity_days": 30,
                "extended_key_usage": ["server_auth"],
            },
        )
        assert signed.status_code == 200, signed.text
        issued = signed.json()["certificate"]
        assert issued["issuer"]["common_name"] == "Root CA"

        verified = client.post(
            "/api/lab/certificate/verify",
            json={
                "certificate": issued["pem"],
                "ca_certificate": root["certificate"]["pem"],
                "expected_hostname": "csr.test",
            },
        )
        assert verified.status_code == 200, verified.text
        assert verified.json()["valid"] is True
        assert verified.json()["errors"] == []

    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_certificate_pem_and_der_parse_match(self, algorithm):
        keys = keypair(algorithm)
        cert = self_signed(algorithm, keys["private_key_pem"])["certificate"]
        from_pem = client.post("/api/lab/certificate/parse", json={"certificate": cert["pem"]})
        from_der = client.post(
            "/api/lab/certificate/parse", json={"certificate_b64": cert["der_b64"]}
        )
        assert from_pem.status_code == 200
        assert from_der.status_code == 200
        assert (
            from_pem.json()["fingerprint_sha256"] == from_der.json()["fingerprint_sha256"]
        )

    def test_wrong_issuer_detected(self):
        keys = keypair("rsa")
        other = keypair("rsa")
        root = ca_certificate("rsa", keys["private_key_pem"], "CA One")
        wrong = ca_certificate("rsa", other["private_key_pem"], "CA Two")
        issued = client.post(
            "/api/lab/certificate/sign",
            json={
                "csr_pem": csr("rsa", keys["private_key_pem"])["csr_pem"],
                "ca_certificate_pem": root["certificate"]["pem"],
                "ca_private_key_pem": keys["private_key_pem"],
            },
        ).json()["certificate"]["pem"]
        verified = client.post(
            "/api/lab/certificate/verify",
            json={"certificate": issued, "ca_certificate": wrong["certificate"]["pem"]},
        ).json()
        assert verified["valid"] is False
        assert "issued_by_ca" in verified["errors"]

    def test_chain_verify_endpoint(self):
        root_keys = keypair("ecdsa")
        intermediate_keys = keypair("ecdsa")
        leaf_keys = keypair("ecdsa")
        root = ca_certificate("ecdsa", root_keys["private_key_pem"], "Root")["certificate"]["pem"]
        intermediate = client.post(
            "/api/lab/certificate/sign",
            json={
                "csr_pem": csr("ecdsa", intermediate_keys["private_key_pem"])["csr_pem"],
                "ca_certificate_pem": root,
                "ca_private_key_pem": root_keys["private_key_pem"],
                "is_ca": True,
                "validity_days": 365,
            },
        ).json()["certificate"]["pem"]
        leaf = client.post(
            "/api/lab/certificate/sign",
            json={
                "csr_pem": csr("ecdsa", leaf_keys["private_key_pem"])["csr_pem"],
                "ca_certificate_pem": intermediate,
                "ca_private_key_pem": intermediate_keys["private_key_pem"],
            },
        ).json()["certificate"]["pem"]
        response = client.post(
            "/api/lab/certificate/chain/verify", json={"chain": [leaf, intermediate, root]}
        )
        assert response.status_code == 200, response.text
        body = response.json()
        assert body["valid"] is True
        assert body["length"] == 3

    def test_signing_with_a_non_ca_certificate_is_rejected(self):
        keys = keypair("rsa")
        not_a_ca = self_signed("rsa", keys["private_key_pem"], is_ca=False)
        response = client.post(
            "/api/lab/certificate/sign",
            json={
                "csr_pem": csr("rsa", keys["private_key_pem"])["csr_pem"],
                "ca_certificate_pem": not_a_ca["certificate"]["pem"],
                "ca_private_key_pem": keys["private_key_pem"],
            },
        )
        assert response.status_code == 422

    def test_invalid_certificate_rejected(self):
        response = client.post(
            "/api/lab/certificate/parse", json={"certificate": "not a certificate"}
        )
        assert response.status_code == 422
        assert response.json()["error"] == "validation_error"

    def test_missing_certificate_rejected(self):
        response = client.post("/api/lab/certificate/parse", json={"certificate": ""})
        assert response.status_code == 422


class TestSignatureCertificateIntegration:
    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_sign_and_verify_binary_file_with_certificate(self, algorithm):
        keys = keypair(algorithm)
        root = ca_certificate(algorithm, keys["private_key_pem"])
        issued = client.post(
            "/api/lab/certificate/sign",
            json={
                "csr_pem": csr(algorithm, keys["private_key_pem"])["csr_pem"],
                "ca_certificate_pem": root["certificate"]["pem"],
                "ca_private_key_pem": keys["private_key_pem"],
                "validity_days": 30,
            },
        ).json()["certificate"]["pem"]

        signed = client.post(
            "/api/lab/certificate/sign-with-certificate",
            json={
                "data_b64": b64(BINARY),
                "algorithm": algorithm,
                "private_key_pem": keys["private_key_pem"],
                "certificate": issued,
            },
        )
        assert signed.status_code == 200, signed.text
        body = signed.json()
        assert body["signature_hex"]
        assert "private_key_pem" not in body

        verified = client.post(
            "/api/lab/certificate/verify-with-certificate",
            json={
                "data_b64": b64(BINARY),
                "signature_hex": body["signature_hex"],
                "algorithm": algorithm,
                "certificate": issued,
                "ca_certificate": root["certificate"]["pem"],
            },
        )
        assert verified.status_code == 200, verified.text
        answer = verified.json()
        assert answer["signature_valid"] is True
        assert answer["certificate_valid"] is True
        assert answer["certificate_trusted"] is True

    def test_tampered_file_rejected(self):
        keys = keypair("rsa")
        root = ca_certificate("rsa", keys["private_key_pem"])
        issued = client.post(
            "/api/lab/certificate/sign",
            json={
                "csr_pem": csr("rsa", keys["private_key_pem"])["csr_pem"],
                "ca_certificate_pem": root["certificate"]["pem"],
                "ca_private_key_pem": keys["private_key_pem"],
            },
        ).json()["certificate"]["pem"]
        signed = client.post(
            "/api/lab/certificate/sign-with-certificate",
            json={
                "data_b64": b64(BINARY),
                "algorithm": "rsa",
                "private_key_pem": keys["private_key_pem"],
                "certificate": issued,
            },
        ).json()
        verified = client.post(
            "/api/lab/certificate/verify-with-certificate",
            json={
                "data_b64": b64(BINARY + b"\x00"),
                "signature_hex": signed["signature_hex"],
                "algorithm": "rsa",
                "certificate": issued,
                "ca_certificate": root["certificate"]["pem"],
            },
        ).json()
        assert verified["signature_valid"] is False
