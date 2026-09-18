"""PKIService: real X.509 certificates, CSRs and PKI verification.

Covers the Phase-4 required scenarios for RSA, ECDSA and Ed25519, including
the distinction between certificate validity and signature validity.
"""

import datetime as dt

import pytest
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.x509.oid import NameOID

from backend.app.lab import DigitalSignatureService, PKIService
from backend.app.lab.errors import LabValidationError

ALGORITHMS = ["rsa", "ecdsa", "ed25519"]
BINARY = b"\x00\xff\xfe\x80PNG\x00binary\x00payload\x00"


@pytest.fixture(scope="module")
def keys(request):
    return {
        alg: DigitalSignatureService.generate_keys(alg, rsa_bits=2048, curve="p256")
        for alg in ALGORITHMS
    }


@pytest.fixture(scope="module")
def ca_certificate(keys):
    return {
        alg: PKIService.generate_ca(
            algorithm=alg,
            private_key_pem=keys[alg]["private_key_pem"],
            subject={"common_name": f"Root CA {alg}", "organization": "Lab"},
        )
        for alg in ALGORITHMS
    }


def _self_signed(keys, alg, *, is_ca=False):
    return PKIService.generate_self_signed(
        algorithm=alg,
        private_key_pem=keys[alg]["private_key_pem"],
        subject={"common_name": f"leaf-{alg}.test", "organization": "Lab"},
        is_ca=is_ca,
        san_dns=[f"leaf-{alg}.test"],
    )


def _csr(keypair, alg):
    return PKIService.generate_csr(
        algorithm=alg,
        private_key_pem=keypair["private_key_pem"],
        subject={"common_name": f"csr-{alg}.test", "organization": "Lab"},
        san_dns=[f"csr-{alg}.test"],
    )


def _expired_certificate(keys, alg):
    private = serialization.load_pem_private_key(
        keys[alg]["private_key_pem"].encode("utf-8"), password=None
    )
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "expired.test")])
    algorithm = None if alg == "ed25519" else hashes.SHA256()
    cert = (
        x509.CertificateBuilder()
        .subject_name(name)
        .issuer_name(name)
        .public_key(private.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(dt.datetime(2020, 1, 1, tzinfo=dt.timezone.utc))
        .not_valid_after(dt.datetime(2021, 1, 1, tzinfo=dt.timezone.utc))
        .add_extension(x509.BasicConstraints(ca=False, path_length=None), critical=True)
        .sign(private, algorithm)
    )
    return cert.public_bytes(serialization.Encoding.PEM).decode("ascii")


class TestCertificateGeneration:
    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_self_signed_certificate(self, algorithm, keys):
        result = _self_signed(keys, algorithm)
        parsed = result["certificate"]
        assert result["self_signed"] is True
        assert parsed["subject"]["common_name"] == f"leaf-{algorithm}.test"
        assert parsed["issuer"]["common_name"] == f"leaf-{algorithm}.test"
        assert parsed["self_signed"] is True
        assert parsed["public_key"]["algorithm"] == algorithm
        assert parsed["serial_number"]
        assert parsed["signature_algorithm"]
        assert not parsed["is_expired"]

    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_ca_certificate_has_basic_constraints(self, algorithm, ca_certificate):
        parsed = ca_certificate[algorithm]["certificate"]
        assert parsed["is_ca"] is True
        assert parsed["self_signed"] is True
        assert parsed["key_usage"]["key_cert_sign"] is True

    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_generate_csr(self, algorithm, keys):
        csr = _csr(keys[algorithm], algorithm)
        assert csr["signature_valid"] is True
        assert csr["subject"]["common_name"] == f"csr-{algorithm}.test"
        assert csr["public_key"]["algorithm"] == algorithm
        assert "CERTIFICATE REQUEST" in csr["csr_pem"]

    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_ca_signed_certificate(self, algorithm, keys, ca_certificate):
        csr = _csr(keys[algorithm], algorithm)
        issued = PKIService.sign_certificate(
            csr=csr["csr_pem"],
            ca_certificate=ca_certificate[algorithm]["certificate"]["pem"],
            ca_private_key_pem=keys[algorithm]["private_key_pem"],
            extended_key_usage=["server_auth", "client_auth"],
        )
        parsed = issued["certificate"]
        assert parsed["issuer"]["common_name"] == f"Root CA {algorithm}"
        assert parsed["subject"]["common_name"] == f"csr-{algorithm}.test"
        assert parsed["self_signed"] is False
        assert "server_auth" in parsed["extended_key_usage"]
        assert parsed["authority_key_identifier"]


class TestCertificateVerification:
    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_valid_certificate_verifies_against_ca(self, algorithm, keys, ca_certificate):
        csr = _csr(keys[algorithm], algorithm)
        issued = PKIService.sign_certificate(
            csr=csr["csr_pem"],
            ca_certificate=ca_certificate[algorithm]["certificate"]["pem"],
            ca_private_key_pem=keys[algorithm]["private_key_pem"],
        )
        result = PKIService.verify_certificate(
            certificate=issued["certificate"]["pem"],
            ca_certificate=ca_certificate[algorithm]["certificate"]["pem"],
            expected_hostname=f"csr-{algorithm}.test",
        )
        assert result["valid"] is True
        assert result["trusted"] is True
        assert result["errors"] == []

    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_wrong_issuer_detected(self, algorithm, keys):
        ca_one = PKIService.generate_ca(
            algorithm=algorithm,
            private_key_pem=keys[algorithm]["private_key_pem"],
            subject={"common_name": "CA One"},
        )["certificate"]["pem"]
        other = DigitalSignatureService.generate_keys(algorithm, rsa_bits=2048, curve="p256")
        ca_two = PKIService.generate_ca(
            algorithm=algorithm,
            private_key_pem=other["private_key_pem"],
            subject={"common_name": "CA Two"},
        )["certificate"]["pem"]
        csr = _csr(keys[algorithm], algorithm)
        issued = PKIService.sign_certificate(
            csr=csr["csr_pem"],
            ca_certificate=ca_one,
            ca_private_key_pem=keys[algorithm]["private_key_pem"],
        )
        result = PKIService.verify_certificate(
            certificate=issued["certificate"]["pem"], ca_certificate=ca_two
        )
        assert result["valid"] is False
        assert "issued_by_ca" in result["errors"]

    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_expired_certificate_detected(self, algorithm, keys, ca_certificate):
        pem = _expired_certificate(keys, algorithm)
        parsed = PKIService.parse_certificate(pem)
        assert parsed["is_expired"] is True
        result = PKIService.verify_certificate(
            certificate=pem, ca_certificate=ca_certificate[algorithm]["certificate"]["pem"]
        )
        assert result["valid"] is False
        assert "validity_period" in result["errors"]

    def test_unparseable_certificate_rejected(self):
        with pytest.raises(LabValidationError):
            PKIService.parse_certificate("not a certificate at all")
        with pytest.raises(LabValidationError):
            PKIService.parse_csr("still not a csr")

    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_chain_verification(self, algorithm, keys):
        root_keys = DigitalSignatureService.generate_keys(algorithm, rsa_bits=2048, curve="p256")
        root = PKIService.generate_ca(
            algorithm=algorithm,
            private_key_pem=root_keys["private_key_pem"],
            subject={"common_name": "Root CA"},
        )["certificate"]["pem"]
        intermediate_keys = DigitalSignatureService.generate_keys(
            algorithm, rsa_bits=2048, curve="p256"
        )
        intermediate = PKIService.sign_certificate(
            csr=_csr(intermediate_keys, algorithm)["csr_pem"],
            ca_certificate=root,
            ca_private_key_pem=root_keys["private_key_pem"],
            is_ca=True,
        )["certificate"]["pem"]
        leaf = PKIService.sign_certificate(
            csr=_csr(keys[algorithm], algorithm)["csr_pem"],
            ca_certificate=intermediate,
            ca_private_key_pem=intermediate_keys["private_key_pem"],
        )["certificate"]["pem"]
        result = PKIService.verify_chain(chain=[leaf, intermediate, root])
        assert result["valid"] is True
        assert result["length"] == 3
        assert result["errors"] == []

    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_pem_and_der_parsing_match(self, algorithm, keys):
        cert = _self_signed(keys, algorithm)["certificate"]
        from_der = PKIService.parse_certificate(cert["der_b64"])
        assert from_der["fingerprint_sha256"] == cert["fingerprint_sha256"]
        assert from_der["serial_number"] == cert["serial_number"]


class TestSignatureWithCertificate:
    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_sign_and_verify_binary_file(self, algorithm, keys, ca_certificate):
        csr = _csr(keys[algorithm], algorithm)
        cert = PKIService.sign_certificate(
            csr=csr["csr_pem"],
            ca_certificate=ca_certificate[algorithm]["certificate"]["pem"],
            ca_private_key_pem=keys[algorithm]["private_key_pem"],
        )["certificate"]["pem"]
        signed = PKIService.sign_with_certificate(
            data=BINARY,
            algorithm=algorithm,
            private_key_pem=keys[algorithm]["private_key_pem"],
            certificate=cert,
        )
        assert signed["data_size"] == len(BINARY)
        verified = PKIService.verify_with_certificate(
            data=BINARY,
            signature_hex=signed["signature_hex"],
            algorithm=algorithm,
            certificate=cert,
            ca_certificate=ca_certificate[algorithm]["certificate"]["pem"],
        )
        assert verified["signature_valid"] is True
        assert verified["certificate_valid"] is True
        assert verified["certificate_trusted"] is True

    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_tampered_file_rejected(self, algorithm, keys, ca_certificate):
        csr = _csr(keys[algorithm], algorithm)
        cert = PKIService.sign_certificate(
            csr=csr["csr_pem"],
            ca_certificate=ca_certificate[algorithm]["certificate"]["pem"],
            ca_private_key_pem=keys[algorithm]["private_key_pem"],
        )["certificate"]["pem"]
        signed = PKIService.sign_with_certificate(
            data=BINARY,
            algorithm=algorithm,
            private_key_pem=keys[algorithm]["private_key_pem"],
            certificate=cert,
        )
        verified = PKIService.verify_with_certificate(
            data=BINARY + b"\x00",
            signature_hex=signed["signature_hex"],
            algorithm=algorithm,
            certificate=cert,
            ca_certificate=ca_certificate[algorithm]["certificate"]["pem"],
        )
        assert verified["signature_valid"] is False

    @pytest.mark.parametrize("algorithm", ALGORITHMS)
    def test_valid_signature_with_expired_certificate_keeps_dimensions_separate(
        self, algorithm, keys
    ):
        expired = _expired_certificate(keys, algorithm)
        signed = PKIService.sign_with_certificate(
            data=b"payload",
            algorithm=algorithm,
            private_key_pem=keys[algorithm]["private_key_pem"],
            certificate=expired,
        )
        verified = PKIService.verify_with_certificate(
            data=b"payload",
            signature_hex=signed["signature_hex"],
            algorithm=algorithm,
            certificate=expired,
        )
        assert verified["signature_valid"] is True
        assert verified["certificate_valid"] is False

    def test_private_key_must_match_certificate(self, keys, ca_certificate):
        csr = _csr(keys["rsa"], "rsa")
        cert = PKIService.sign_certificate(
            csr=csr["csr_pem"],
            ca_certificate=ca_certificate["rsa"]["certificate"]["pem"],
            ca_private_key_pem=keys["rsa"]["private_key_pem"],
        )["certificate"]["pem"]
        other = DigitalSignatureService.generate_keys("rsa", rsa_bits=2048)
        with pytest.raises(LabValidationError):
            PKIService.sign_with_certificate(
                data=b"payload",
                algorithm="rsa",
                private_key_pem=other["private_key_pem"],
                certificate=cert,
            )


class TestCertificateInputValidation:
    def test_invalid_algorithm_rejected(self, keys):
        with pytest.raises(LabValidationError):
            PKIService.generate_self_signed(
                algorithm="dsa",
                private_key_pem=keys["rsa"]["private_key_pem"],
                subject={"common_name": "x"},
            )

    def test_empty_subject_rejected(self, keys):
        with pytest.raises(LabValidationError):
            PKIService.generate_self_signed(
                algorithm="rsa",
                private_key_pem=keys["rsa"]["private_key_pem"],
                subject={},
            )

    def test_invalid_validity_rejected(self, keys):
        with pytest.raises(LabValidationError):
            PKIService.generate_self_signed(
                algorithm="rsa",
                private_key_pem=keys["rsa"]["private_key_pem"],
                subject={"common_name": "x"},
                validity_days=0,
            )

    def test_signing_non_ca_certificate_rejected(self, keys):
        not_a_ca = _self_signed(keys, "rsa", is_ca=False)
        with pytest.raises(LabValidationError):
            PKIService.sign_certificate(
                csr=_csr(keys["rsa"], "rsa")["csr_pem"],
                ca_certificate=not_a_ca["certificate"]["pem"],
                ca_private_key_pem=keys["rsa"]["private_key_pem"],
            )
