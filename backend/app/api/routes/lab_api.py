"""Lab API router (``/api/lab/*``).

Thin transport layer over the tested Phase-2 services in ``backend.app.lab``.
No cryptography is implemented here: every endpoint validates input, delegates
to a service and returns JSON. Secrets are never logged.
"""

from __future__ import annotations

import base64
import time
from typing import Any, Callable, Dict

from fastapi import APIRouter

from backend.app.lab import (
    DigitalSignatureService,
    FileCryptoService,
    FileHashService,
    HMACService,
    HybridEncryptionService,
    MACService,
    PKIService,
    container,
)
from backend.app.lab.errors import LabCryptoError
from backend.app.schemas.lab import (
    LabCaRequest,
    LabCertificateRequest,
    LabCertificateVerifyRequest,
    LabCertSignRequest,
    LabCertVerifyRequest,
    LabChainVerifyRequest,
    LabCsrRequest,
    LabFileDecryptRequest,
    LabFileEncryptRequest,
    LabHashRequest,
    LabHashVerifyRequest,
    LabHmacGenerateRequest,
    LabHmacVerifyRequest,
    LabHybridDecryptRequest,
    LabHybridEncryptRequest,
    LabKeyGenRequest,
    LabMacGenerateRequest,
    LabMacVerifyRequest,
    LabSelfSignedRequest,
    LabSignCertificateRequest,
    LabSignRequest,
    LabVerifyRequest,
)
from backend.app.utils.errors import ValidationError

router = APIRouter()

# Bounded file size: the Phase-2 AEAD services are one-shot (no safe streaming
# AEAD), so uploads are capped rather than inventing a chunked format.
MAX_LAB_BYTES = 8 * 1024 * 1024  # 8 MiB
MAX_KEY_BYTES = 64 * 1024  # 64 KiB for PEM / secret material


def _decode_b64(value: str, field: str, *, limit: int = MAX_LAB_BYTES) -> bytes:
    if not isinstance(value, str) or value == "":
        raise ValidationError(f"{field} is required.", "missing_input")
    try:
        raw = base64.b64decode(value.encode("ascii"), validate=True)
    except (ValueError, UnicodeEncodeError) as exc:
        raise ValidationError(f"{field} is not valid base64.", "invalid_base64") from exc
    if len(raw) > limit:
        raise ValidationError(
            f"{field} exceeds the {limit // (1024 * 1024)} MiB lab limit.",
            "payload_too_large",
        )
    return raw


def _encode_b64(raw: bytes) -> str:
    return base64.b64encode(raw).decode("ascii")


def _call(fn: Callable[..., Any], *args: Any, **kwargs: Any) -> Any:
    """Run a lab service, normalizing its errors to the API error contract."""
    try:
        return fn(*args, **kwargs)
    except LabCryptoError as exc:
        raise ValidationError(exc.message, exc.code) from exc


def _certificate_input(request: LabCertificateRequest) -> Any:
    """Return certificate material as bytes (DER) or PEM text (never logged)."""
    if request.certificate_b64:
        return _decode_b64(request.certificate_b64, "certificate_b64", limit=MAX_KEY_BYTES)
    if not request.certificate:
        raise ValidationError("A certificate is required.", "missing_input")
    return request.certificate


def _metadata(header: Dict[str, Any]) -> Dict[str, Any]:
    """Public, non-secret container metadata (wrapped key value omitted)."""
    safe = dict(header)
    safe["wrapped_key_present"] = safe.pop("wrapped_key_b64", None) is not None
    return safe


def _timed_ms(start: float) -> float:
    return round((time.perf_counter() - start) * 1000, 3)


@router.get("/info", tags=["Lab"], summary="Lab capabilities and allowed options")
def lab_info() -> Dict[str, Any]:
    return {
        "file_algorithms": list(FileCryptoService.algorithms),
        "kdfs": list(FileCryptoService.kdfs),
        "signature_algorithms": list(DigitalSignatureService.algorithms),
        "hash_algorithms": list(FileHashService.algorithms),
        "hmac_algorithms": list(HMACService.algorithms),
        "mac_algorithms": list(MACService.algorithms),
        "hybrid_algorithms": list(HybridEncryptionService.algorithms),
        "certificate_algorithms": list(PKIService.algorithms),
        "certificate_hashes": list(PKIService.hashes),
        "certificate_curves": list(PKIService.curves),
        "extended_key_usages": list(PKIService.extended_key_usages),
        "max_file_bytes": MAX_LAB_BYTES,
    }


# ---------------------------------------------------------------------------
# File encryption / decryption.
# ---------------------------------------------------------------------------


@router.post("/file/encrypt", tags=["Lab"], summary="Encrypt file bytes into a container")
def file_encrypt(request: LabFileEncryptRequest) -> Dict[str, Any]:
    data = _decode_b64(request.data_b64, "data_b64")
    start = time.perf_counter()
    package = _call(
        FileCryptoService.encrypt,
        data,
        algorithm=request.algorithm,
        password=request.password,
        key_hex=request.key_hex,
        kdf=request.kdf,
        filename=request.filename,
        mime_type=request.mime_type,
    )
    header = _call(container.parse, package)[0]
    name = request.filename or "file"
    return {
        "container_b64": _encode_b64(package),
        "filename": name,
        "output_filename": f"{name}.hcs",
        "metadata": _metadata(header),
        "processing_ms": _timed_ms(start),
    }


@router.post("/file/decrypt", tags=["Lab"], summary="Decrypt a container back to bytes")
def file_decrypt(request: LabFileDecryptRequest) -> Dict[str, Any]:
    package = _decode_b64(request.container_b64, "container_b64")
    start = time.perf_counter()
    result = _call(
        FileCryptoService.decrypt,
        package,
        password=request.password,
        key_hex=request.key_hex,
    )
    header = result["header"]
    name = header.get("original_filename") or "decrypted.bin"
    return {
        "data_b64": _encode_b64(result["data"]),
        "filename": name,
        "output_filename": name,
        "metadata": _metadata(header),
        "processing_ms": _timed_ms(start),
    }


# ---------------------------------------------------------------------------
# Digital signatures.
# ---------------------------------------------------------------------------


@router.post("/signature/keys", tags=["Lab"], summary="Generate a signature key pair")
def signature_keys(request: LabKeyGenRequest) -> Dict[str, Any]:
    start = time.perf_counter()
    keys = _call(
        DigitalSignatureService.generate_keys,
        request.algorithm,
        rsa_bits=request.rsa_bits,
        curve=request.curve,
    )
    keys["processing_ms"] = _timed_ms(start)
    return keys


@router.post("/signature/sign", tags=["Lab"], summary="Sign bytes with a private key")
def signature_sign(request: LabSignRequest) -> Dict[str, Any]:
    data = _decode_b64(request.data_b64, "data_b64")
    start = time.perf_counter()
    result = _call(
        DigitalSignatureService.sign,
        data,
        algorithm=request.algorithm,
        private_key_pem=request.private_key_pem,
        hash_algorithm=request.hash_algorithm,
    )
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post("/signature/verify", tags=["Lab"], summary="Verify a signature with a public key")
def signature_verify(request: LabVerifyRequest) -> Dict[str, Any]:
    data = _decode_b64(request.data_b64, "data_b64")
    start = time.perf_counter()
    valid = _call(
        DigitalSignatureService.verify,
        data,
        request.signature_hex,
        algorithm=request.algorithm,
        public_key_pem=request.public_key_pem,
        hash_algorithm=request.hash_algorithm,
    )
    return {
        "valid": valid,
        "algorithm": request.algorithm,
        "processing_ms": _timed_ms(start),
    }


# ---------------------------------------------------------------------------
# File hashing / integrity.
# ---------------------------------------------------------------------------


@router.post("/hash", tags=["Lab"], summary="Hash file bytes")
def file_hash(request: LabHashRequest) -> Dict[str, Any]:
    data = _decode_b64(request.data_b64, "data_b64")
    start = time.perf_counter()
    result = _call(FileHashService.hash_bytes, data, request.algorithm, request.variant)
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post("/hash/verify", tags=["Lab"], summary="Verify a file against an expected digest")
def file_hash_verify(request: LabHashVerifyRequest) -> Dict[str, Any]:
    data = _decode_b64(request.data_b64, "data_b64")
    start = time.perf_counter()
    match = _call(
        FileHashService.verify,
        request.expected_hex,
        data,
        request.algorithm,
        request.variant,
    )
    actual = _call(FileHashService.hash_bytes, data, request.algorithm, request.variant)
    return {
        "match": match,
        "digest_hex": actual["digest_hex"],
        "expected_hex": "".join(request.expected_hex.split()).lower(),
        "algorithm": request.algorithm,
        "processing_ms": _timed_ms(start),
    }


# ---------------------------------------------------------------------------
# HMAC.
# ---------------------------------------------------------------------------


@router.post("/hmac/generate", tags=["Lab"], summary="Generate an HMAC tag")
def hmac_generate(request: LabHmacGenerateRequest) -> Dict[str, Any]:
    data = _decode_b64(request.data_b64, "data_b64")
    start = time.perf_counter()
    result = _call(HMACService.generate, data, request.key, request.algorithm)
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post("/hmac/verify", tags=["Lab"], summary="Verify an HMAC tag")
def hmac_verify(request: LabHmacVerifyRequest) -> Dict[str, Any]:
    data = _decode_b64(request.data_b64, "data_b64")
    start = time.perf_counter()
    valid = _call(
        HMACService.verify, data, request.key, request.mac_hex, request.algorithm
    )
    return {
        "valid": valid,
        "algorithm": request.algorithm,
        "processing_ms": _timed_ms(start),
    }


# ---------------------------------------------------------------------------
# General MAC lab (HMAC / AES-CMAC / Poly1305).
# ---------------------------------------------------------------------------


@router.post("/mac/generate", tags=["Lab"], summary="Generate a MAC tag")
def mac_generate(request: LabMacGenerateRequest) -> Dict[str, Any]:
    data = _decode_b64(request.data_b64, "data_b64")
    start = time.perf_counter()
    result = _call(MACService.generate, data, request.key, request.algorithm)
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post("/mac/verify", tags=["Lab"], summary="Verify a MAC tag")
def mac_verify(request: LabMacVerifyRequest) -> Dict[str, Any]:
    data = _decode_b64(request.data_b64, "data_b64")
    start = time.perf_counter()
    valid = _call(MACService.verify, data, request.key, request.mac_hex, request.algorithm)
    return {
        "valid": valid,
        "algorithm": request.algorithm,
        "processing_ms": _timed_ms(start),
    }


# ---------------------------------------------------------------------------
# Hybrid encryption (RSA-OAEP wrapped AEAD key).
# ---------------------------------------------------------------------------


@router.post("/hybrid/encrypt", tags=["Lab"], summary="Hybrid-encrypt file bytes")
def hybrid_encrypt(request: LabHybridEncryptRequest) -> Dict[str, Any]:
    data = _decode_b64(request.data_b64, "data_b64")
    start = time.perf_counter()
    package = _call(
        HybridEncryptionService.encrypt,
        data,
        request.public_key_pem,
        symmetric_algorithm=request.symmetric_algorithm,
        hash_algorithm=request.hash_algorithm,
        filename=request.filename,
        mime_type=request.mime_type,
    )
    header = _call(container.parse, package)[0]
    name = request.filename or "file"
    return {
        "container_b64": _encode_b64(package),
        "filename": name,
        "output_filename": f"{name}.hcs",
        "metadata": _metadata(header),
        "processing_ms": _timed_ms(start),
    }


@router.post("/hybrid/decrypt", tags=["Lab"], summary="Decrypt a hybrid container")
def hybrid_decrypt(request: LabHybridDecryptRequest) -> Dict[str, Any]:
    package = _decode_b64(request.container_b64, "container_b64")
    start = time.perf_counter()
    result = _call(HybridEncryptionService.decrypt, package, request.private_key_pem)
    header = result["header"]
    name = header.get("original_filename") or "decrypted.bin"
    return {
        "data_b64": _encode_b64(result["data"]),
        "filename": name,
        "output_filename": name,
        "metadata": _metadata(header),
        "processing_ms": _timed_ms(start),
    }


# ---------------------------------------------------------------------------
# X.509 certificates / PKI. Private keys are accepted but never echoed back.
# ---------------------------------------------------------------------------


@router.post(
    "/certificate/self-signed",
    tags=["Lab"],
    summary="Issue a self-signed X.509 certificate",
)
def certificate_self_signed(request: LabSelfSignedRequest) -> Dict[str, Any]:
    start = time.perf_counter()
    result = _call(
        PKIService.generate_self_signed,
        algorithm=request.algorithm,
        private_key_pem=request.private_key_pem,
        subject=request.subject.model_dump(),
        validity_days=request.validity_days,
        is_ca=request.is_ca,
        key_usage=request.key_usage,
        extended_key_usage=request.extended_key_usage,
        san_dns=request.san_dns,
        san_ip=request.san_ip,
        san_email=request.san_email,
        san_uri=request.san_uri,
        hash_algorithm=request.hash_algorithm,
    )
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post("/certificate/ca", tags=["Lab"], summary="Issue a self-signed CA certificate")
def certificate_ca(request: LabCaRequest) -> Dict[str, Any]:
    start = time.perf_counter()
    result = _call(
        PKIService.generate_ca,
        algorithm=request.algorithm,
        private_key_pem=request.private_key_pem,
        subject=request.subject.model_dump(),
        validity_days=request.validity_days,
        hash_algorithm=request.hash_algorithm,
    )
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post("/certificate/csr", tags=["Lab"], summary="Create a PKCS#10 certificate signing request")
def certificate_csr(request: LabCsrRequest) -> Dict[str, Any]:
    start = time.perf_counter()
    result = _call(
        PKIService.generate_csr,
        algorithm=request.algorithm,
        private_key_pem=request.private_key_pem,
        subject=request.subject.model_dump(),
        san_dns=request.san_dns,
        san_ip=request.san_ip,
        san_email=request.san_email,
        san_uri=request.san_uri,
        hash_algorithm=request.hash_algorithm,
    )
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post("/certificate/csr/parse", tags=["Lab"], summary="Parse a PKCS#10 CSR")
def certificate_csr_parse(request: LabCertificateRequest) -> Dict[str, Any]:
    material = request.certificate_b64 or request.certificate
    if not material:
        raise ValidationError("A certificate signing request is required.", "missing_input")
    if request.certificate_b64:
        material = _decode_b64(request.certificate_b64, "certificate_b64", limit=MAX_KEY_BYTES)
    start = time.perf_counter()
    result = _call(PKIService.parse_csr, material)
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post("/certificate/sign", tags=["Lab"], summary="Sign a CSR with a CA certificate")
def certificate_sign(request: LabSignCertificateRequest) -> Dict[str, Any]:
    start = time.perf_counter()
    result = _call(
        PKIService.sign_certificate,
        csr=request.csr_pem,
        ca_certificate=request.ca_certificate_pem,
        ca_private_key_pem=request.ca_private_key_pem,
        validity_days=request.validity_days,
        is_ca=request.is_ca,
        key_usage=request.key_usage,
        extended_key_usage=request.extended_key_usage,
        san_dns=request.san_dns,
        san_ip=request.san_ip,
        san_email=request.san_email,
        san_uri=request.san_uri,
        hash_algorithm=request.hash_algorithm,
    )
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post("/certificate/parse", tags=["Lab"], summary="Parse/view a PEM or DER certificate")
def certificate_parse(request: LabCertificateRequest) -> Dict[str, Any]:
    material = _certificate_input(request)
    start = time.perf_counter()
    result = _call(PKIService.parse_certificate, material)
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post("/certificate/verify", tags=["Lab"], summary="Verify a certificate (optionally against a CA)")
def certificate_verify(request: LabCertificateVerifyRequest) -> Dict[str, Any]:
    material = _certificate_input(request)
    start = time.perf_counter()
    result = _call(
        PKIService.verify_certificate,
        certificate=material,
        ca_certificate=request.ca_certificate or None,
        expected_hostname=request.expected_hostname or None,
    )
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post("/certificate/chain/verify", tags=["Lab"], summary="Verify an ordered certificate chain")
def certificate_chain_verify(request: LabChainVerifyRequest) -> Dict[str, Any]:
    start = time.perf_counter()
    result = _call(PKIService.verify_chain, chain=request.chain)
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post(
    "/certificate/sign-with-certificate",
    tags=["Lab"],
    summary="Sign bytes with a private key and its certificate",
)
def certificate_sign_data(request: LabCertSignRequest) -> Dict[str, Any]:
    data = _decode_b64(request.data_b64, "data_b64")
    start = time.perf_counter()
    result = _call(
        PKIService.sign_with_certificate,
        data=data,
        algorithm=request.algorithm,
        private_key_pem=request.private_key_pem,
        certificate=request.certificate,
        hash_algorithm=request.hash_algorithm,
    )
    result["processing_ms"] = _timed_ms(start)
    return result


@router.post(
    "/certificate/verify-with-certificate",
    tags=["Lab"],
    summary="Verify a signature and the certificate that produced it",
)
def certificate_verify_data(request: LabCertVerifyRequest) -> Dict[str, Any]:
    data = _decode_b64(request.data_b64, "data_b64")
    start = time.perf_counter()
    result = _call(
        PKIService.verify_with_certificate,
        data=data,
        signature_hex=request.signature_hex,
        algorithm=request.algorithm,
        certificate=request.certificate,
        ca_certificate=request.ca_certificate or None,
        expected_hostname=request.expected_hostname or None,
        hash_algorithm=request.hash_algorithm,
    )
    result["processing_ms"] = _timed_ms(start)
    return result
