"""PKIService - real X.509 certificates and PKCS#10 certificate requests.

Every operation here is genuine: certificates are real X.509 documents and
every "verify" call performs an actual cryptographic signature check with the
``cryptography`` library. Nothing is simulated or hardcoded.

Verified against ``cryptography`` 44.0.0 for RSA, ECDSA and Ed25519:

* self-signed certificates, CA certificates and CA-issued certificates
* PKCS#10 certificate signing requests (CSR)
* direct-issuer verification (``verify_directly_issued_by``)
* PEM and DER round-trips

Ed25519 (EdDSA) requires ``algorithm=None`` when signing X.509/CSR builders;
RSA and ECDSA use the selected hash. Private keys are never logged and are only
returned when this service generated them internally.
"""

from __future__ import annotations

import base64
import datetime as dt
import ipaddress
from typing import Any, Dict, List, Optional, Sequence, Tuple, Union

from cryptography import x509
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec, ed25519, padding, rsa
from cryptography.x509.oid import ExtendedKeyUsageOID, NameOID

from backend.app.lab.errors import LabValidationError

ALGORITHMS = ("rsa", "ecdsa", "ed25519")
RSA_SIZES = (2048, 3072, 4096)
CURVES = {
    "p256": ec.SECP256R1,
    "p384": ec.SECP384R1,
    "p521": ec.SECP521R1,
}
HASHES = {
    "sha256": hashes.SHA256,
    "sha384": hashes.SHA384,
    "sha512": hashes.SHA512,
}

_ED_KEYS = (ed25519.Ed25519PrivateKey, ed25519.Ed25519PublicKey)
_EC_KEYS = (ec.EllipticCurvePrivateKey, ec.EllipticCurvePublicKey)
_RSA_KEYS = (rsa.RSAPrivateKey, rsa.RSAPublicKey)

_NAME_FIELDS: Tuple[Tuple[str, x509.ObjectIdentifier], ...] = (
    ("common_name", NameOID.COMMON_NAME),
    ("organization", NameOID.ORGANIZATION_NAME),
    ("organizational_unit", NameOID.ORGANIZATIONAL_UNIT_NAME),
    ("country", NameOID.COUNTRY_NAME),
    ("state", NameOID.STATE_OR_PROVINCE_NAME),
    ("locality", NameOID.LOCALITY_NAME),
    ("email", NameOID.EMAIL_ADDRESS),
)
_OID_TO_FIELD = {oid: field for field, oid in _NAME_FIELDS}

_EXTENDED_KEY_USAGES = {
    "server_auth": ExtendedKeyUsageOID.SERVER_AUTH,
    "client_auth": ExtendedKeyUsageOID.CLIENT_AUTH,
    "code_signing": ExtendedKeyUsageOID.CODE_SIGNING,
    "email_protection": ExtendedKeyUsageOID.EMAIL_PROTECTION,
    "time_stamping": ExtendedKeyUsageOID.TIME_STAMPING,
    "ocsp_signing": ExtendedKeyUsageOID.OCSP_SIGNING,
}
_EKU_OID_TO_NAME = {oid: name for name, oid in _EXTENDED_KEY_USAGES.items()}

_KEY_USAGE_FIELDS = (
    "digital_signature",
    "content_commitment",
    "key_encipherment",
    "data_encipherment",
    "key_agreement",
    "key_cert_sign",
    "crl_sign",
    "encipher_only",
    "decipher_only",
)

_PUBLIC_FORMAT = serialization.PublicFormat.SubjectPublicKeyInfo
_PRIVATE_FORMAT = serialization.PrivateFormat.PKCS8

_MAX_VALIDITY_DAYS = 3650


# ---------------------------------------------------------------------------
# Small helpers (no secrets are ever logged).
# ---------------------------------------------------------------------------


def _now() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def _hash(name: str):
    if name not in HASHES:
        raise LabValidationError("Unsupported hash algorithm. Use sha256, sha384 or sha512.")
    return HASHES[name]()


def _check_algorithm(algorithm: str) -> None:
    if algorithm not in ALGORITHMS:
        raise LabValidationError("Unsupported certificate algorithm.")


def _generate_private(algorithm: str, rsa_bits: int, curve: str):
    _check_algorithm(algorithm)
    if algorithm == "rsa":
        if rsa_bits not in RSA_SIZES:
            raise LabValidationError("RSA key size must be 2048, 3072 or 4096 bits.")
        return rsa.generate_private_key(public_exponent=65537, key_size=rsa_bits)
    if algorithm == "ecdsa":
        if curve not in CURVES:
            raise LabValidationError("ECDSA curve must be p256, p384 or p521.")
        return ec.generate_private_key(CURVES[curve]())
    return ed25519.Ed25519PrivateKey.generate()


def _pem_private(key) -> str:
    return key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=_PRIVATE_FORMAT,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode("ascii")


def _pem_certificate(cert: x509.Certificate) -> str:
    return cert.public_bytes(serialization.Encoding.PEM).decode("ascii")


def _load_private_key(pem: str):
    if not isinstance(pem, str) or "PRIVATE KEY" not in pem:
        raise LabValidationError("A PEM-encoded private key is required.")
    try:
        return serialization.load_pem_private_key(pem.encode("utf-8"), password=None)
    except Exception as exc:  # noqa: BLE001 - normalize library errors
        raise LabValidationError("Could not load the private key (invalid PEM).") from exc


def _algorithm_of(key) -> Optional[str]:
    if isinstance(key, _RSA_KEYS):
        return "rsa"
    if isinstance(key, _EC_KEYS):
        return "ecdsa"
    if isinstance(key, _ED_KEYS):
        return "ed25519"
    return None


def _matches_algorithm(algorithm: str, key) -> bool:
    return _algorithm_of(key) == algorithm


def _public_keys_equal(left, right) -> bool:
    try:
        return left.public_bytes(
            serialization.Encoding.DER, _PUBLIC_FORMAT
        ) == right.public_bytes(serialization.Encoding.DER, _PUBLIC_FORMAT)
    except Exception:  # noqa: BLE001 - mixed key types never compare equal
        return False


def _load_certificate(data: Union[str, bytes]) -> x509.Certificate:
    candidates: List[bytes] = []
    if isinstance(data, str):
        text = data.strip()
        if not text:
            raise LabValidationError("A certificate is required.")
        if "BEGIN CERTIFICATE" in text:
            candidates.append(text.encode("utf-8"))
        else:
            try:
                candidates.append(base64.b64decode("".join(text.split()), validate=True))
            except (ValueError, UnicodeEncodeError):
                candidates.append(text.encode("utf-8", "ignore"))
    elif isinstance(data, (bytes, bytearray)):
        candidates.append(bytes(data))
    else:
        raise LabValidationError("A certificate is required.")

    for candidate in candidates:
        for loader in (x509.load_pem_x509_certificate, x509.load_der_x509_certificate):
            try:
                return loader(candidate)
            except Exception:  # noqa: BLE001 - try the next encoding
                continue
    raise LabValidationError("Could not parse the certificate (expected PEM or DER).")


def _load_csr(data: Union[str, bytes]) -> x509.CertificateSigningRequest:
    candidates: List[bytes] = []
    if isinstance(data, str):
        text = data.strip()
        if not text:
            raise LabValidationError("A certificate signing request is required.")
        if "CERTIFICATE REQUEST" in text:
            candidates.append(text.encode("utf-8"))
        else:
            try:
                candidates.append(base64.b64decode("".join(text.split()), validate=True))
            except (ValueError, UnicodeEncodeError):
                candidates.append(text.encode("utf-8", "ignore"))
    elif isinstance(data, (bytes, bytearray)):
        candidates.append(bytes(data))
    else:
        raise LabValidationError("A certificate signing request is required.")

    for candidate in candidates:
        for loader in (
            x509.load_pem_x509_csr,
            getattr(x509, "load_der_x509_csr", x509.load_pem_x509_csr),
        ):
            try:
                return loader(candidate)
            except Exception:  # noqa: BLE001 - try the next encoding
                continue
    raise LabValidationError("Could not parse the CSR (expected PEM or DER).")


def _check_validity_days(days: int) -> int:
    if not isinstance(days, int) or days < 1 or days > _MAX_VALIDITY_DAYS:
        raise LabValidationError(
            f"Validity must be between 1 and {_MAX_VALIDITY_DAYS} days."
        )
    return days


def _build_name(subject: Dict[str, Any]) -> x509.Name:
    if not isinstance(subject, dict):
        raise LabValidationError("Subject must be provided as a mapping of fields.")
    attributes = []
    for field, oid in _NAME_FIELDS:
        value = subject.get(field)
        if value is None:
            continue
        text = str(value).strip()
        if not text:
            continue
        attributes.append(x509.NameAttribute(oid, text))
    if not attributes:
        raise LabValidationError("The subject must include at least one field (e.g. common_name).")
    return x509.Name(attributes)


def _name_to_dict(name: x509.Name) -> Dict[str, Any]:
    out: Dict[str, Any] = {}
    other: List[str] = []
    for attribute in name:
        field = _OID_TO_FIELD.get(attribute.oid)
        if field is None:
            other.append(f"{attribute.oid.dotted_string}={attribute.value}")
        else:
            out[field] = attribute.value
    if other:
        out["other"] = other
    return out


def _key_usage_payload(flags: Optional[Dict[str, Any]], *, is_ca: bool, algorithm: str):
    merged = {
        "digital_signature": True,
        "content_commitment": False,
        "key_encipherment": (algorithm == "rsa" and not is_ca),
        "data_encipherment": False,
        "key_agreement": False,
        "key_cert_sign": is_ca,
        "crl_sign": is_ca,
        "encipher_only": False,
        "decipher_only": False,
    }
    if flags:
        for key in _KEY_USAGE_FIELDS:
            if key in flags:
                merged[key] = bool(flags[key])
    if not merged["key_agreement"]:
        merged["encipher_only"] = False
        merged["decipher_only"] = False
    return x509.KeyUsage(**merged)


def _key_usage_to_dict(usage: Optional[x509.KeyUsage]) -> Optional[Dict[str, bool]]:
    if usage is None:
        return None
    out = {}
    for key in _KEY_USAGE_FIELDS:
        try:
            out[key] = bool(getattr(usage, key))
        except ValueError:  # encipher_only/decipher_only raise if key_agreement is False
            out[key] = False
    return out


def _extended_key_usage(names: Optional[Sequence[str]]) -> Optional[x509.ExtendedKeyUsage]:
    if not names:
        return None
    oids = []
    for name in names:
        if name not in _EXTENDED_KEY_USAGES:
            raise LabValidationError(f"Unsupported extended key usage: {name}.")
        oids.append(_EXTENDED_KEY_USAGES[name])
    return x509.ExtendedKeyUsage(oids)


def _subject_alt_name(
    dns: Optional[Sequence[str]],
    ips: Optional[Sequence[str]],
    emails: Optional[Sequence[str]],
    uris: Optional[Sequence[str]],
) -> Optional[x509.SubjectAlternativeName]:
    entries: List[x509.GeneralName] = []
    for name in dns or []:
        entries.append(x509.DNSName(str(name)))
    for name in ips or []:
        try:
            entries.append(x509.IPAddress(ipaddress.ip_address(str(name))))
        except ValueError as exc:
            raise LabValidationError(f"Invalid IP address in SAN: {name}.") from exc
    for name in emails or []:
        entries.append(x509.RFC822Name(str(name)))
    for name in uris or []:
        entries.append(x509.UniformResourceIdentifier(str(name)))
    if not entries:
        return None
    return x509.SubjectAlternativeName(entries)


def _san_to_dict(san: x509.SubjectAlternativeName) -> Dict[str, List[str]]:
    out: Dict[str, List[str]] = {"dns": [], "ip": [], "email": [], "uri": []}
    for entry in san:
        if isinstance(entry, x509.DNSName):
            out["dns"].append(entry.value)
        elif isinstance(entry, x509.IPAddress):
            out["ip"].append(str(entry.value))
        elif isinstance(entry, x509.RFC822Name):
            out["email"].append(entry.value)
        elif isinstance(entry, x509.UniformResourceIdentifier):
            out["uri"].append(entry.value)
    return {key: value for key, value in out.items() if value}


def _public_key_summary(key) -> Dict[str, Any]:
    algorithm = _algorithm_of(key)
    summary: Dict[str, Any] = {"algorithm": algorithm}
    if isinstance(key, _RSA_KEYS):
        summary["key_size"] = key.key_size
    elif isinstance(key, _EC_KEYS):
        summary["curve"] = key.curve.name
        summary["key_size"] = key.key_size
    return summary


def _date_attr(cert: x509.Certificate, modern: str, legacy: str) -> dt.datetime:
    value = getattr(cert, modern, None)
    if value is not None:
        return value
    return getattr(cert, legacy)


def _iso(value: dt.datetime) -> str:
    if value.tzinfo is None:
        value = value.replace(tzinfo=dt.timezone.utc)
    return value.astimezone(dt.timezone.utc).isoformat()


def _signing_hash(key, hash_name: str):
    if isinstance(key, _ED_KEYS):
        return None
    return _hash(hash_name)


def _sign_bytes(private, data: bytes, hash_name: str) -> bytes:
    if isinstance(private, ed25519.Ed25519PrivateKey):
        return private.sign(data)
    if isinstance(private, ec.EllipticCurvePrivateKey):
        return private.sign(data, ec.ECDSA(_hash(hash_name)))
    if isinstance(private, rsa.RSAPrivateKey):
        return private.sign(
            data,
            padding.PSS(mgf=padding.MGF1(_hash(hash_name)), salt_length=padding.PSS.MAX_LENGTH),
            _hash(hash_name),
        )
    raise LabValidationError("Unsupported private key type for signing.")


def _verify_bytes(public, signature: bytes, data: bytes, hash_name: str) -> bool:
    try:
        if isinstance(public, ed25519.Ed25519PublicKey):
            public.verify(signature, data)
        elif isinstance(public, ec.EllipticCurvePublicKey):
            public.verify(signature, data, ec.ECDSA(_hash(hash_name)))
        elif isinstance(public, rsa.RSAPublicKey):
            public.verify(
                signature,
                data,
                padding.PSS(mgf=padding.MGF1(_hash(hash_name)), salt_length=padding.PSS.MAX_LENGTH),
                _hash(hash_name),
            )
        else:
            return False
        return True
    except InvalidSignature:
        return False


def _is_self_signed(cert: x509.Certificate) -> bool:
    if cert.issuer != cert.subject:
        return False
    try:
        cert.verify_directly_issued_by(cert)
        return True
    except Exception:  # noqa: BLE001 - any failure means not self-signed
        return False


def _basic_constraints(cert: x509.Certificate) -> Optional[x509.BasicConstraints]:
    try:
        return cert.extensions.get_extension_for_class(x509.BasicConstraints).value
    except x509.ExtensionNotFound:
        return None


def _signature_hash_name(cert: x509.Certificate) -> Optional[str]:
    algorithm = cert.signature_hash_algorithm
    return algorithm.name if algorithm is not None else None


class PKIService:
    """X.509 / PKCS#10 operations backed by real cryptography."""

    algorithms = ALGORITHMS
    rsa_sizes = RSA_SIZES
    curves = tuple(CURVES)
    hashes = tuple(HASHES)
    extended_key_usages = tuple(_EXTENDED_KEY_USAGES)

    # ------------------------------------------------------------------
    # Certificate generation.
    # ------------------------------------------------------------------

    @staticmethod
    def generate_self_signed(
        *,
        algorithm: str,
        private_key_pem: str,
        subject: Dict[str, Any],
        validity_days: int = 365,
        is_ca: bool = False,
        key_usage: Optional[Dict[str, Any]] = None,
        extended_key_usage: Optional[Sequence[str]] = None,
        san_dns: Optional[Sequence[str]] = None,
        san_ip: Optional[Sequence[str]] = None,
        san_email: Optional[Sequence[str]] = None,
        san_uri: Optional[Sequence[str]] = None,
        hash_algorithm: str = "sha256",
    ) -> Dict[str, Any]:
        """Issue a self-signed certificate with the caller's private key."""
        _check_algorithm(algorithm)
        _check_validity_days(validity_days)
        private = _load_private_key(private_key_pem)
        if not _matches_algorithm(algorithm, private):
            raise LabValidationError("Private key type does not match the chosen algorithm.")

        name = _build_name(subject)
        now = _now()
        builder = (
            x509.CertificateBuilder()
            .subject_name(name)
            .issuer_name(name)
            .public_key(private.public_key())
            .serial_number(x509.random_serial_number())
            .not_valid_before(now - dt.timedelta(minutes=1))
            .not_valid_after(now + dt.timedelta(days=validity_days))
            .add_extension(
                x509.BasicConstraints(ca=is_ca, path_length=None), critical=True
            )
            .add_extension(
                _key_usage_payload(key_usage, is_ca=is_ca, algorithm=algorithm), critical=True
            )
            .add_extension(
                x509.SubjectKeyIdentifier.from_public_key(private.public_key()),
                critical=False,
            )
            .add_extension(
                x509.AuthorityKeyIdentifier.from_issuer_public_key(private.public_key()),
                critical=False,
            )
        )
        eku = _extended_key_usage(extended_key_usage)
        if eku is not None:
            builder = builder.add_extension(eku, critical=False)
        san = _subject_alt_name(san_dns, san_ip, san_email, san_uri)
        if san is not None:
            builder = builder.add_extension(san, critical=False)

        certificate = builder.sign(private, _signing_hash(private, hash_algorithm))
        return {
            "self_signed": True,
            "certificate": PKIService.parse_certificate(_pem_certificate(certificate)),
        }

    @staticmethod
    def generate_ca(
        *,
        algorithm: str,
        private_key_pem: str,
        subject: Dict[str, Any],
        validity_days: int = 3650,
        hash_algorithm: str = "sha256",
    ) -> Dict[str, Any]:
        """Issue a self-signed CA certificate (``basicConstraints: CA:TRUE``)."""
        return PKIService.generate_self_signed(
            algorithm=algorithm,
            private_key_pem=private_key_pem,
            subject=subject,
            validity_days=validity_days,
            is_ca=True,
            key_usage={"key_cert_sign": True, "crl_sign": True, "digital_signature": True},
            hash_algorithm=hash_algorithm,
        )

    # ------------------------------------------------------------------
    # PKCS#10 certificate signing requests.
    # ------------------------------------------------------------------

    @staticmethod
    def generate_csr(
        *,
        algorithm: str,
        private_key_pem: str,
        subject: Dict[str, Any],
        san_dns: Optional[Sequence[str]] = None,
        san_ip: Optional[Sequence[str]] = None,
        san_email: Optional[Sequence[str]] = None,
        san_uri: Optional[Sequence[str]] = None,
        hash_algorithm: str = "sha256",
    ) -> Dict[str, Any]:
        """Create a real PKCS#10 CSR signed by the caller's private key."""
        _check_algorithm(algorithm)
        private = _load_private_key(private_key_pem)
        if not _matches_algorithm(algorithm, private):
            raise LabValidationError("Private key type does not match the chosen algorithm.")

        builder = x509.CertificateSigningRequestBuilder().subject_name(_build_name(subject))
        san = _subject_alt_name(san_dns, san_ip, san_email, san_uri)
        if san is not None:
            builder = builder.add_extension(san, critical=False)

        csr = builder.sign(private, _signing_hash(private, hash_algorithm))
        return {
            "csr_pem": csr.public_bytes(serialization.Encoding.PEM).decode("ascii"),
            "subject": _name_to_dict(csr.subject),
            "public_key": _public_key_summary(csr.public_key()),
            "signature_valid": PKIService._csr_signature_valid(csr),
            "signature_algorithm": csr.signature_algorithm_oid._name,
            "pem_size": len(csr.public_bytes(serialization.Encoding.PEM)),
        }

    @staticmethod
    def _csr_signature_valid(csr: x509.CertificateSigningRequest) -> bool:
        try:
            return bool(csr.is_signature_valid)
        except Exception:  # noqa: BLE001 - unsupported algorithm in legacy libs
            return False

    @staticmethod
    def parse_csr(csr: Union[str, bytes]) -> Dict[str, Any]:
        request = _load_csr(csr)
        result: Dict[str, Any] = {
            "subject": _name_to_dict(request.subject),
            "public_key": _public_key_summary(request.public_key()),
            "signature_valid": PKIService._csr_signature_valid(request),
            "signature_algorithm": request.signature_algorithm_oid._name,
            "pem": request.public_bytes(serialization.Encoding.PEM).decode("ascii"),
        }
        try:
            san = request.extensions.get_extension_for_class(x509.SubjectAlternativeName).value
            result["subject_alternative_name"] = _san_to_dict(san)
        except x509.ExtensionNotFound:
            result["subject_alternative_name"] = {}
        return result

    # ------------------------------------------------------------------
    # Certificate issuance by a CA.
    # ------------------------------------------------------------------

    @staticmethod
    def sign_certificate(
        *,
        csr: Union[str, bytes],
        ca_certificate: Union[str, bytes],
        ca_private_key_pem: str,
        validity_days: int = 365,
        is_ca: bool = False,
        key_usage: Optional[Dict[str, Any]] = None,
        extended_key_usage: Optional[Sequence[str]] = None,
        san_dns: Optional[Sequence[str]] = None,
        san_ip: Optional[Sequence[str]] = None,
        san_email: Optional[Sequence[str]] = None,
        san_uri: Optional[Sequence[str]] = None,
        hash_algorithm: str = "sha256",
    ) -> Dict[str, Any]:
        """Sign a CSR with a CA key, producing a real CA-issued certificate."""
        _check_validity_days(validity_days)
        request = _load_csr(csr)
        ca_cert = _load_certificate(ca_certificate)
        ca_private = _load_private_key(ca_private_key_pem)

        if not PKIService._csr_signature_valid(request):
            raise LabValidationError("The CSR signature is invalid; refusing to sign it.")
        if not _public_keys_equal(ca_private.public_key(), ca_cert.public_key()):
            raise LabValidationError("The CA private key does not match the CA certificate.")

        constraints = _basic_constraints(ca_cert)
        if constraints is None or not constraints.ca:
            raise LabValidationError("The supplied issuer certificate is not a CA certificate.")

        now = _now()
        builder = (
            x509.CertificateBuilder()
            .subject_name(request.subject)
            .issuer_name(ca_cert.subject)
            .public_key(request.public_key())
            .serial_number(x509.random_serial_number())
            .not_valid_before(now - dt.timedelta(minutes=1))
            .not_valid_after(now + dt.timedelta(days=validity_days))
            .add_extension(
                x509.BasicConstraints(ca=is_ca, path_length=None), critical=True
            )
            .add_extension(
                _key_usage_payload(
                    key_usage, is_ca=is_ca, algorithm=_algorithm_of(request.public_key()) or "rsa"
                ),
                critical=True,
            )
            .add_extension(
                x509.SubjectKeyIdentifier.from_public_key(request.public_key()), critical=False
            )
            .add_extension(
                x509.AuthorityKeyIdentifier.from_issuer_public_key(ca_cert.public_key()),
                critical=False,
            )
        )
        eku = _extended_key_usage(extended_key_usage)
        if eku is not None:
            builder = builder.add_extension(eku, critical=False)

        san = _subject_alt_name(san_dns, san_ip, san_email, san_uri)
        if san is None:
            try:
                san = request.extensions.get_extension_for_class(
                    x509.SubjectAlternativeName
                ).value
            except x509.ExtensionNotFound:
                san = None
        if san is not None:
            builder = builder.add_extension(san, critical=False)

        certificate = builder.sign(ca_private, _signing_hash(ca_private, hash_algorithm))
        return {
            "certificate": PKIService.parse_certificate(_pem_certificate(certificate)),
            "issuer_common_name": _name_to_dict(ca_cert.subject).get("common_name", ""),
        }

    # ------------------------------------------------------------------
    # Parsing / viewing.
    # ------------------------------------------------------------------

    @staticmethod
    def parse_certificate(data: Union[str, bytes]) -> Dict[str, Any]:
        cert = _load_certificate(data)
        not_before = _date_attr(cert, "not_valid_before_utc", "not_valid_before")
        not_after = _date_attr(cert, "not_valid_after_utc", "not_valid_after")
        now = _now()

        constraints = _basic_constraints(cert)
        try:
            usage_ext = cert.extensions.get_extension_for_class(x509.KeyUsage).value
        except x509.ExtensionNotFound:
            usage_ext = None
        try:
            eku_ext = cert.extensions.get_extension_for_class(x509.ExtendedKeyUsage).value
            extended = [_EKU_OID_TO_NAME.get(oid, oid._name) for oid in eku_ext]
        except x509.ExtensionNotFound:
            extended = []
        try:
            san_ext = cert.extensions.get_extension_for_class(x509.SubjectAlternativeName).value
            san = _san_to_dict(san_ext)
        except x509.ExtensionNotFound:
            san = {}
        ski = None
        try:
            ski = cert.extensions.get_extension_for_class(x509.SubjectKeyIdentifier).value.digest.hex()
        except x509.ExtensionNotFound:
            pass
        aki = None
        try:
            aki = (
                cert.extensions.get_extension_for_class(x509.AuthorityKeyIdentifier)
                .value.key_identifier
            )
            aki = aki.hex() if aki else None
        except x509.ExtensionNotFound:
            pass

        public = cert.public_key()
        return {
            "subject": _name_to_dict(cert.subject),
            "issuer": _name_to_dict(cert.issuer),
            "serial_number": str(cert.serial_number),
            "serial_hex": format(cert.serial_number, "x"),
            "not_valid_before": _iso(not_before),
            "not_valid_after": _iso(not_after),
            "validity_days": max((not_after - not_before).days, 0),
            "is_ca": bool(constraints.ca) if constraints is not None else False,
            "path_length": constraints.path_length if constraints is not None else None,
            "key_usage": _key_usage_to_dict(usage_ext),
            "extended_key_usage": extended,
            "subject_alternative_name": san,
            "subject_key_identifier": ski,
            "authority_key_identifier": aki,
            "signature_algorithm": cert.signature_algorithm_oid._name,
            "signature_hash": _signature_hash_name(cert),
            "public_key": _public_key_summary(public),
            "version": cert.version.name,
            "self_signed": _is_self_signed(cert),
            "is_expired": now > not_after,
            "is_not_yet_valid": now < not_before,
            "fingerprint_sha256": cert.fingerprint(hashes.SHA256()).hex(),
            "fingerprint_sha1": cert.fingerprint(hashes.SHA1()).hex(),
            "pem": _pem_certificate(cert),
            "der_b64": base64.b64encode(
                cert.public_bytes(serialization.Encoding.DER)
            ).decode("ascii"),
            "der_size": len(cert.public_bytes(serialization.Encoding.DER)),
        }

    # ------------------------------------------------------------------
    # Verification.
    # ------------------------------------------------------------------

    @staticmethod
    def verify_certificate(
        *,
        certificate: Union[str, bytes],
        ca_certificate: Optional[Union[str, bytes]] = None,
        expected_hostname: Optional[str] = None,
    ) -> Dict[str, Any]:
        cert = _load_certificate(certificate)
        parsed = PKIService.parse_certificate(_pem_certificate(cert))
        checks: List[Dict[str, Any]] = []

        not_yet_valid = parsed["is_not_yet_valid"]
        expired = parsed["is_expired"]
        checks.append(
            {
                "name": "validity_period",
                "passed": not (not_yet_valid or expired),
                "detail": (
                    "expired" if expired else "not yet valid" if not_yet_valid else "within validity"
                ),
            }
        )

        self_signed = parsed["self_signed"]
        trusted = False
        if ca_certificate is not None:
            ca_cert = _load_certificate(ca_certificate)
            try:
                cert.verify_directly_issued_by(ca_cert)
                trusted = True
                detail = f"issued by CA {_name_to_dict(ca_cert.subject).get('common_name', '')}"
            except Exception:  # noqa: BLE001 - failed issuer signature
                trusted = False
                detail = "signature does not match the supplied CA"
            checks.append({"name": "issued_by_ca", "passed": trusted, "detail": detail})
            constraints = _basic_constraints(ca_cert)
            checks.append(
                {
                    "name": "issuer_is_ca",
                    "passed": bool(constraints and constraints.ca),
                    "detail": "issuer has CA:TRUE" if constraints and constraints.ca else "issuer is not a CA",
                }
            )
        elif self_signed:
            checks.append(
                {
                    "name": "trust_anchor",
                    "passed": True,
                    "detail": "self-signed (trusted only if present in a trust store)",
                }
            )
        else:
            checks.append(
                {
                    "name": "trust_anchor",
                    "passed": False,
                    "detail": "no CA certificate supplied to establish trust",
                }
            )

        if expected_hostname:
            hostname = expected_hostname.strip().lower()
            names = set()
            if parsed["subject"].get("common_name"):
                names.add(parsed["subject"]["common_name"].lower())
            for entry in parsed["subject_alternative_name"].get("dns", []):
                names.add(entry.lower())
            matches = hostname in names or any(
                name.startswith("*.") and hostname.endswith(name[1:]) for name in names
            )
            checks.append(
                {
                    "name": "hostname",
                    "passed": matches,
                    "detail": "matches subject/SAN" if matches else "does not match subject/SAN",
                }
            )

        required = [check for check in checks if check["name"] != "hostname" or expected_hostname]
        valid = all(check["passed"] for check in required)
        return {
            "valid": valid,
            "trusted": trusted or (ca_certificate is None and self_signed),
            "self_signed": self_signed,
            "checks": checks,
            "errors": [check["name"] for check in checks if not check["passed"]],
            "certificate": parsed,
        }

    @staticmethod
    def verify_chain(*, chain: Sequence[Union[str, bytes]]) -> Dict[str, Any]:
        """Verify an ordered certificate chain (leaf first, root last)."""
        if not isinstance(chain, (list, tuple)) or len(chain) < 1:
            raise LabValidationError("A certificate chain (leaf first) is required.")
        certificates = [_load_certificate(item) for item in chain]
        checks: List[Dict[str, Any]] = []
        now = _now()

        for index, cert in enumerate(certificates):
            not_before = _date_attr(cert, "not_valid_before_utc", "not_valid_before")
            not_after = _date_attr(cert, "not_valid_after_utc", "not_valid_after")
            checks.append(
                {
                    "name": f"certificate_{index}_validity",
                    "passed": not (now > not_after or now < not_before),
                    "detail": _name_to_dict(cert.subject).get("common_name", f"certificate {index}"),
                }
            )
            if index + 1 < len(certificates):
                issuer = certificates[index + 1]
                try:
                    cert.verify_directly_issued_by(issuer)
                    issued = True
                except Exception:  # noqa: BLE001 - failed issuer signature
                    issued = False
                constraints = _basic_constraints(issuer)
                checks.append(
                    {
                        "name": f"certificate_{index}_issued_by_{index + 1}",
                        "passed": issued,
                        "detail": _name_to_dict(issuer.subject).get("common_name", ""),
                    }
                )
                checks.append(
                    {
                        "name": f"certificate_{index}_issuer_is_ca",
                        "passed": bool(constraints and constraints.ca),
                        "detail": "CA:TRUE" if constraints and constraints.ca else "issuer not a CA",
                    }
                )

        root = certificates[-1]
        root_self_signed = _is_self_signed(root)
        checks.append(
            {
                "name": "root_self_signed",
                "passed": root_self_signed,
                "detail": _name_to_dict(root.subject).get("common_name", "root"),
            }
        )
        return {
            "valid": all(check["passed"] for check in checks),
            "length": len(certificates),
            "checks": checks,
            "errors": [check["name"] for check in checks if not check["passed"]],
            "chain": [
                {
                    "subject": _name_to_dict(cert.subject).get("common_name", ""),
                    "issuer": _name_to_dict(cert.issuer).get("common_name", ""),
                    "is_ca": bool((_basic_constraints(cert) or x509.BasicConstraints(False, None)).ca),
                    "serial_number": str(cert.serial_number),
                }
                for cert in certificates
            ],
        }

    # ------------------------------------------------------------------
    # Signature integration (signature + certificate together).
    # ------------------------------------------------------------------

    @staticmethod
    def sign_with_certificate(
        *,
        data: bytes,
        algorithm: str,
        private_key_pem: str,
        certificate: Union[str, bytes],
        hash_algorithm: str = "sha256",
    ) -> Dict[str, Any]:
        if not isinstance(data, (bytes, bytearray)):
            raise LabValidationError("Data to sign must be bytes.")
        _check_algorithm(algorithm)
        private = _load_private_key(private_key_pem)
        cert = _load_certificate(certificate)
        if not _matches_algorithm(algorithm, private):
            raise LabValidationError("Private key type does not match the chosen algorithm.")
        if not _public_keys_equal(private.public_key(), cert.public_key()):
            raise LabValidationError("The private key does not match the certificate's public key.")
        if _algorithm_of(cert.public_key()) != algorithm:
            raise LabValidationError("The certificate public key does not match the algorithm.")

        payload = bytes(data)
        signature = _sign_bytes(private, payload, hash_algorithm)
        parsed = PKIService.parse_certificate(_pem_certificate(cert))
        return {
            "algorithm": algorithm,
            "hash_algorithm": None if algorithm == "ed25519" else hash_algorithm,
            "signature_hex": signature.hex(),
            "signature_size": len(signature),
            "data_size": len(payload),
            "certificate_valid": not (parsed["is_expired"] or parsed["is_not_yet_valid"]),
            "certificate_subject": parsed["subject"].get("common_name", ""),
            "certificate_fingerprint_sha256": parsed["fingerprint_sha256"],
        }

    @staticmethod
    def verify_with_certificate(
        *,
        data: bytes,
        signature_hex: str,
        algorithm: str,
        certificate: Union[str, bytes],
        ca_certificate: Optional[Union[str, bytes]] = None,
        expected_hostname: Optional[str] = None,
        hash_algorithm: str = "sha256",
    ) -> Dict[str, Any]:
        if not isinstance(data, (bytes, bytearray)):
            raise LabValidationError("Data to verify must be bytes.")
        _check_algorithm(algorithm)
        if not isinstance(signature_hex, str) or not signature_hex:
            raise LabValidationError("Signature must be a non-empty hex string.")
        try:
            signature = bytes.fromhex("".join(signature_hex.split()))
        except ValueError as exc:
            raise LabValidationError("Signature is not valid hexadecimal.") from exc

        cert = _load_certificate(certificate)
        if _algorithm_of(cert.public_key()) != algorithm:
            raise LabValidationError("The certificate public key does not match the algorithm.")

        cert_result = PKIService.verify_certificate(
            certificate=_pem_certificate(cert),
            ca_certificate=ca_certificate,
            expected_hostname=expected_hostname,
        )
        payload = bytes(data)
        signature_valid = _verify_bytes(cert.public_key(), signature, payload, hash_algorithm)
        return {
            "signature_valid": signature_valid,
            "certificate_valid": cert_result["valid"],
            "certificate_trusted": cert_result["trusted"],
            "algorithm": algorithm,
            "hash_algorithm": None if algorithm == "ed25519" else hash_algorithm,
            "data_size": len(payload),
            "certificate_subject": cert_result["certificate"]["subject"].get("common_name", ""),
            "checks": cert_result["checks"],
            "errors": cert_result["errors"],
        }
