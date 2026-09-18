"""AES-CCM educational simulator.

CCM (Counter with CBC-MAC) is an AEAD mode standardized in NIST SP 800-38C
and used in Wi-Fi (WPA2), Bluetooth LE and TLS. It combines CTR-mode
encryption with a CBC-MAC authentication tag. Because it authenticates and
encrypts at once, tampering is detected on decryption.

The real computation uses the ``cryptography`` library's AESCCM (OpenSSL).
CCM is defined only for a 128-bit block cipher.
"""

from __future__ import annotations

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.ciphers.aead import AESCCM

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "aes_ccm",
    "name": "AES-CCM",
    "category": "aead",
    "security_status": "secure",
    "reversible": True,
    "key_kind": "128 / 192 / 256-bit key + 7–13-byte nonce",
    "block_size": "128 bits (CTR + CBC-MAC)",
    "description": (
        "AES-CCM is an Authenticated Encryption with Associated Data (AEAD) "
        "mode: CTR-style encryption combined with a CBC-MAC tag. It detects "
        "tampering and authenticates optional cleartext AAD. Never reuse a "
        "(key, nonce) pair."
    ),
    "formula": "C = CTR-mode AES; τ = CBC-MAC over (AAD, C), truncated",
}

VALID_TAG_LENGTHS = (16, 14, 12, 10, 8, 6, 4)
VALID_NONCE_LENGTHS = tuple(range(7, 14))
BLOCK_BYTES = 16


def _parse_hex(value: str, label: str) -> bytes:
    try:
        return bytes.fromhex("".join(str(value).split()))
    except (ValueError, AttributeError) as exc:
        raise ValidationError(f"{label} must be valid hexadecimal",
                              "invalid_hex") from exc


def _key(key_hex: str) -> bytes:
    key = _parse_hex(key_hex, "Key")
    if len(key) not in (16, 24, 32):
        raise ValidationError(
            "AES key must be 128, 192 or 256 bits (16/24/32 bytes)",
            "invalid_key")
    return key


def _nonce(nonce_hex: str) -> bytes:
    nonce = _parse_hex(nonce_hex, "Nonce")
    if len(nonce) not in VALID_NONCE_LENGTHS:
        raise ValidationError(
            "CCM nonce must be 7–13 bytes (14–26 hex digits)", "invalid_nonce")
    return nonce


def _tag_length(tag_length: int) -> int:
    value = int(tag_length)
    if value not in VALID_TAG_LENGTHS:
        raise ValidationError(
            f"CCM tag length must be one of {VALID_TAG_LENGTHS}", "invalid_tag")
    return value


def _aad(aad: str) -> bytes:
    return b"" if aad in (None, "") else str(aad).encode("utf-8")


def _aes_block(key: bytes, block: bytes) -> bytes:
    return Cipher(algorithms.AES(key), modes.ECB()).encryptor().update(block)


def _pad16(chunk: bytes) -> bytes:
    return chunk if len(chunk) == BLOCK_BYTES else chunk + b"\x00" * (BLOCK_BYTES - len(chunk))


def _ccm_trace(key: bytes, nonce: bytes, tag_len: int, aad: bytes, data: bytes) -> dict:
    """Real CCM internals (NIST SP 800-38C) replayed with the AES primitive.

    The replay must reproduce the AEAD ciphertext and tag byte-for-byte — the
    trace fidelity tests assert exactly that, so these intermediates are the
    genuine CCM authentication and encryption progression.
    """
    l = BLOCK_BYTES - len(nonce) - 1
    auth_flag = (1 << 6) if aad else 0
    flags = auth_flag | (((tag_len - 2) >> 1) << 3) | (l - 1)

    auth_blocks = [bytes([flags]) + nonce + len(data).to_bytes(l, "big")]
    if aad:
        aad_formatted = len(aad).to_bytes(2, "big") + aad
        for i in range(0, len(aad_formatted), BLOCK_BYTES):
            auth_blocks.append(_pad16(aad_formatted[i:i + BLOCK_BYTES]))
    for i in range(0, len(data), BLOCK_BYTES):
        auth_blocks.append(_pad16(data[i:i + BLOCK_BYTES]))

    state = b"\x00" * BLOCK_BYTES
    auth_states: list[str] = []
    for block in auth_blocks:
        state = _aes_block(key, bytes(a ^ b for a, b in zip(state, block)))
        auth_states.append(state.hex())
    tag_full = state
    tag = tag_full[:tag_len]

    def counter_block(value: int) -> bytes:
        return bytes([l - 1]) + nonce + value.to_bytes(l, "big")

    s0 = _aes_block(key, counter_block(0))
    block_count = (len(data) + BLOCK_BYTES - 1) // BLOCK_BYTES if data else 0
    enc_counter_blocks = [counter_block(i).hex() for i in range(1, block_count + 1)]
    keystream = [_aes_block(key, counter_block(i)) for i in range(1, block_count + 1)]

    enc = b"".join(
        bytes(a ^ b for a, b in zip(data[i:i + BLOCK_BYTES], keystream[i // BLOCK_BYTES]))
        for i in range(0, len(data), BLOCK_BYTES)
    )
    enc_tag = bytes(a ^ b for a, b in zip(tag, s0[:tag_len]))

    return {
        "auth_blocks": [b.hex() for b in auth_blocks],
        "auth_states": auth_states,
        "tag_full_hex": tag_full.hex(),
        "s0_hex": s0.hex(),
        "ctr_flags": l - 1,
        "enc_counter_blocks": enc_counter_blocks,
        "keystream_blocks": [k.hex() for k in keystream],
        "enc_ciphertext": enc.hex(),
        "enc_tag": enc_tag.hex(),
    }


def encrypt(plaintext: str, key_hex: str, nonce_hex: str, aad: str = "",
            tag_length: int = 16) -> dict:
    if plaintext is None:
        raise ValidationError("Plaintext is required", "missing_input")
    key = _key(key_hex)
    nonce = _nonce(nonce_hex)
    tag_len = _tag_length(tag_length)
    aad_bytes = _aad(aad)
    data = plaintext.encode("utf-8")
    blob = AESCCM(key, tag_length=tag_len).encrypt(nonce, data, aad_bytes)
    ciphertext, tag = blob[:-tag_len], blob[-tag_len:]
    trace = _ccm_trace(key, nonce, tag_len, aad_bytes, data)
    trace["trace_match"] = (
        trace["enc_ciphertext"] == ciphertext.hex()
        and trace["enc_tag"] == tag.hex()
    )

    steps = [
        step(1, "Set up AES-CCM",
             "A %d-bit key, a %d-byte nonce and a %d-byte tag configure CCM."
             % (len(key) * 8, len(nonce), tag_len),
             f"nonce = {nonce.hex()}", "AES-CCM context",
             {"key_size": len(key) * 8, "nonce_hex": nonce.hex(),
              "tag_length": tag_len}),
        step(2, "Authenticate (CBC-MAC)",
             "The AAD and plaintext are processed by the CBC-MAC to build the "
             "authentication tag. AAD is authenticated but not encrypted.",
             f"aad = {aad_bytes.hex()!r}" if aad_bytes else "no AAD",
             f"tag = {tag.hex()}",
             {"tag_hex": tag.hex(), "aad_hex": aad_bytes.hex(),
              "auth_block_count": len(trace["auth_blocks"]),
              "auth_states": trace["auth_states"],
              "trace_match": trace["trace_match"]}),
        step(3, "Encrypt (CTR mode)",
             "The plaintext is encrypted in counter mode; the tag is appended "
             "to the ciphertext.",
             f"{len(data)} bytes", blob.hex(),
             {"ciphertext_hex": ciphertext.hex(), "combined_hex": blob.hex(),
              "enc_counter_blocks": trace["enc_counter_blocks"],
              "keystream_blocks": trace["keystream_blocks"]}),
    ]

    return build_result(
        "aes_ccm", "encrypt", plaintext,
        {"key": f"<{len(key) * 8}-bit hidden>", "nonce": nonce.hex(),
         "tag_length": tag_len},
        {"ciphertext": blob.hex()}, steps,
        {
            "ciphertext_hex": ciphertext.hex(),
            "tag_hex": tag.hex(),
            "combined_hex": blob.hex(),
            "nonce_hex": nonce.hex(),
            "aad_hex": aad_bytes.hex(),
            "tag_length": tag_len,
            "key_size": len(key) * 8,
            "auth_blocks": trace["auth_blocks"],
            "auth_states": trace["auth_states"],
            "tag_full_hex": trace["tag_full_hex"],
            "s0_hex": trace["s0_hex"],
            "ctr_flags": trace["ctr_flags"],
            "enc_counter_blocks": trace["enc_counter_blocks"],
            "keystream_blocks": trace["keystream_blocks"],
            "trace_match": trace["trace_match"],
            "aead_note": (
                "AES-CCM is AEAD. On decryption a modified ciphertext, tag, "
                "AAD or wrong key causes authentication to FAIL and no "
                "plaintext is returned."
            ),
        })


def decrypt(ciphertext_hex: str, key_hex: str, nonce_hex: str, aad: str = "",
            tag_length: int = 16) -> dict:
    if not ciphertext_hex:
        raise ValidationError("Ciphertext is required", "missing_input")
    key = _key(key_hex)
    nonce = _nonce(nonce_hex)
    tag_len = _tag_length(tag_length)
    aad_bytes = _aad(aad)
    try:
        blob = bytes.fromhex("".join(str(ciphertext_hex).split()))
    except ValueError as exc:
        raise ValidationError("Ciphertext must be valid hexadecimal",
                              "invalid_hex") from exc
    if len(blob) < tag_len:
        raise ValidationError(
            f"Ciphertext must include the {tag_len}-byte tag", "invalid_ciphertext")
    try:
        data = AESCCM(key, tag_length=tag_len).decrypt(nonce, blob, aad_bytes)
    except InvalidTag:
        raise ValidationError(
            "AUTHENTICATION FAILED: the ciphertext, tag, AAD or key was "
            "modified. No plaintext is returned.",
            "authentication_failed",
        ) from None
    try:
        plaintext = data.decode("utf-8")
    except UnicodeDecodeError:
        plaintext = data.hex()

    trace = _ccm_trace(key, nonce, tag_len, aad_bytes, data)
    trace["trace_match"] = (trace["enc_tag"] == blob[-tag_len:].hex())

    return build_result(
        "aes_ccm", "decrypt", ciphertext_hex,
        {"key": f"<{len(key) * 8}-bit hidden>", "nonce": nonce.hex(),
         "tag_length": tag_len},
        plaintext, [],
        {
            "plaintext": plaintext,
            "plaintext_hex": data.hex(),
            "authentication": "PASS",
            "auth_blocks": trace["auth_blocks"],
            "auth_states": trace["auth_states"],
            "tag_full_hex": trace["tag_full_hex"],
            "s0_hex": trace["s0_hex"],
            "ctr_flags": trace["ctr_flags"],
            "enc_counter_blocks": trace["enc_counter_blocks"],
            "keystream_blocks": trace["keystream_blocks"],
            "tag_hex": blob[-tag_len:].hex(),
            "trace_match": trace["trace_match"],
        })


def get_metadata() -> dict:
    return METADATA
