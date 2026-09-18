"""AES-CBC educational simulator.

Cipher Block Chaining (CBC) turns the AES block cipher into a mode that
hides patterns by XORing every plaintext block with the previous ciphertext
block (the first block uses the random Initialization Vector). It is
confidentiality-only: CBC provides NO integrity, so a wrong key or a
modified ciphertext usually yields garbage rather than an error.

The real encryption/decryption is performed by the ``cryptography`` library
with PKCS#7 padding. CBC must never be used without a separate MAC.
"""

from __future__ import annotations

from typing import Optional

from cryptography.hazmat.primitives import padding as sym_padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "aes_cbc",
    "name": "AES-CBC",
    "category": "symmetric",
    "security_status": "secure_with_padding",
    "reversible": True,
    "key_kind": "128 / 192 / 256-bit key (hex) + 128-bit IV (hex)",
    "block_size": "128 bits",
    "description": (
        "AES in Cipher Block Chaining mode: each block is XORed with the "
        "previous ciphertext before encryption. Deterministic given (key, "
        "IV); it provides confidentiality only and MUST be paired with a "
        "MAC because it is malleable."
    ),
    "formula": "Cᵢ = E_K(Pᵢ ⊕ Cᵢ₋₁), C₀ = IV; Pᵢ = D_K(Cᵢ) ⊕ Cᵢ₋₁",
}

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


def _iv(iv_hex: str) -> bytes:
    iv = _parse_hex(iv_hex, "IV")
    if len(iv) != BLOCK_BYTES:
        raise ValidationError(
            "CBC IV must be exactly 128 bits (16 bytes / 32 hex digits)",
            "invalid_iv")
    return iv


def _pad(data: bytes) -> bytes:
    padder = sym_padding.PKCS7(BLOCK_BYTES * 8).padder()
    return padder.update(data) + padder.finalize()


def _xor(a: bytes, b: bytes) -> bytes:
    return bytes(x ^ y for x, y in zip(a, b))


def _block_chain(
    key: bytes, iv: bytes, blocks: bytes, encrypting: bool
) -> dict:
    """Real per-block CBC chain trace.

    Encrypt: Cᵢ = E_K(Pᵢ ⊕ Cᵢ₋₁).  Decrypt: Pᵢ = D_K(Cᵢ) ⊕ Cᵢ₋₁.
    Every block is processed by the genuine AES primitive (ECB); the
    resulting blocks are byte-identical to the mode-level result produced by
    modes.CBC — the backend trace tests verify this.
    """
    prev = iv
    states: list[dict] = []
    for i in range(0, len(blocks), BLOCK_BYTES):
        chunk = blocks[i:i + BLOCK_BYTES]
        cipher = Cipher(algorithms.AES(key), modes.ECB())
        if encrypting:
            xored = _xor(chunk, prev)
            out = cipher.encryptor().update(xored)
            states.append({
                "block": i // BLOCK_BYTES + 1,
                "prev_state": prev.hex(),
                "input_block": chunk.hex(),
                "xored_input": xored.hex(),
                "output": out.hex(),
            })
            prev = out
        else:
            dec = cipher.decryptor().update(chunk)
            out = _xor(dec, prev)
            states.append({
                "block": i // BLOCK_BYTES + 1,
                "prev_state": prev.hex(),
                "input_block": chunk.hex(),
                "xored_output": out.hex(),
                "output": dec.hex(),
            })
            prev = chunk
    return states


def _unpad(data: bytes) -> bytes:
    unpadder = sym_padding.PKCS7(BLOCK_BYTES * 8).unpadder()
    try:
        return unpadder.update(data) + unpadder.finalize()
    except ValueError as exc:
        raise ValidationError(
            "Invalid PKCS#7 padding — wrong key/IV or the ciphertext was "
            "modified.",
            "invalid_padding",
        ) from exc


def _prev_label(i: int) -> str:
    return "C0 = IV" if i == 1 else f"C{i - 1}"


def encrypt(plaintext: str, key_hex: str, iv_hex: str) -> dict:
    if plaintext is None:
        raise ValidationError("Plaintext is required", "missing_input")
    key = _key(key_hex)
    iv = _iv(iv_hex)
    data = plaintext.encode("utf-8")
    padded = _pad(data)
    encryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).encryptor()
    ciphertext = encryptor.update(padded) + encryptor.finalize()

    chain = _block_chain(key, iv, padded, encrypting=True)
    plaintext_blocks = [padded[i:i + BLOCK_BYTES].hex()
                        for i in range(0, len(padded), BLOCK_BYTES)]
    ciphertext_blocks = [ciphertext[i:i + BLOCK_BYTES].hex()
                         for i in range(0, len(ciphertext), BLOCK_BYTES)]
    xor_states = [s["xored_input"] for s in chain]
    prev_states = [s["prev_state"] for s in chain]

    # 1 → setup, 2 → padding, then per block: XOR step, AES step.
    # Block i → trace steps 2i+1 (XOR) and 2i+2 (AES).
    steps = [
        step(1, "Set up AES-CBC",
             "A %d-bit AES key and a 128-bit IV configure the mode." % (len(key) * 8),
             f"key = <{len(key) * 8}-bit hidden>, iv = {iv.hex()}",
             "AES-CBC context",
             {"key_size": len(key) * 8, "iv_hex": iv.hex()}),
        step(2, "Pad the plaintext",
             "PKCS#7 padding appends between 1 and 16 bytes so the length is "
             "a multiple of the 16-byte block size.",
             f"{len(data)} bytes", f"{len(padded)} bytes padded ("
             f"{len(padded) // BLOCK_BYTES} block(s))",
             {"plaintext_hex": data.hex(), "padded_hex": padded.hex()}),
    ]
    for i, s in enumerate(chain, start=1):
        prev_label = _prev_label(i)
        steps.append(step(
            2 * i + 1,
            f"XOR block {i} with {prev_label}",
            "The previous ciphertext block is XORed into the plaintext block "
            "to hide repeating patterns in the data: "
            f"X{i} = P{i} ⊕ {prev_label}.",
            f"P{i} = {s['input_block']}",
            f"X{i} = {s['xored_input']}",
            {"block": i, "prev_label": prev_label, "prev_hex": s["prev_state"],
             "plaintext_hex": s["input_block"], "xored_hex": s["xored_input"]},
        ))
        steps.append(step(
            2 * i + 2,
            f"AES-encrypt block {i}",
            "The XORed block is encrypted with the AES key under the same "
            f"rounds as ECB: C{i} = AES_K(X{i}).",
            f"X{i} = {s['xored_input']}",
            f"C{i} = {s['output']}",
            {"block": i, "xored_hex": s["xored_input"],
             "ciphertext_hex": s["output"]},
        ))

    return build_result("aes_cbc", "encrypt", plaintext,
                        {"key": f"<{len(key) * 8}-bit hidden>", "iv": iv.hex()},
                        ciphertext.hex(), steps,
                        {
                            "ciphertext_hex": ciphertext.hex(),
                            "iv_hex": iv.hex(),
                            "key_size": len(key) * 8,
                            "padding": "PKCS#7",
                            "plaintext_blocks": plaintext_blocks,
                            "padded_plaintext_hex": padded.hex(),
                            "xor_states": xor_states,
                            "prev_states": prev_states,
                            "ciphertext_blocks": ciphertext_blocks,
                            "block_count": len(padded) // BLOCK_BYTES,
                            "security_note": (
                                "CBC is malleable and unauthenticated. Always "
                                "add a MAC (Encrypt-then-MAC) or use an AEAD "
                                "mode such as AES-GCM/CCM."
                            ),
                        })


def decrypt(ciphertext_hex: str, key_hex: str, iv_hex: str) -> dict:
    if not ciphertext_hex:
        raise ValidationError("Ciphertext is required", "missing_input")
    key = _key(key_hex)
    iv = _iv(iv_hex)
    try:
        ciphertext = bytes.fromhex("".join(str(ciphertext_hex).split()))
    except ValueError as exc:
        raise ValidationError("Ciphertext must be valid hexadecimal",
                              "invalid_hex") from exc
    if len(ciphertext) == 0 or len(ciphertext) % BLOCK_BYTES != 0:
        raise ValidationError(
            "CBC ciphertext length must be a non-zero multiple of 16 bytes",
            "invalid_ciphertext")
    decryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()
    padded = decryptor.update(ciphertext) + decryptor.finalize()
    data = _unpad(padded)
    try:
        plaintext = data.decode("utf-8")
    except UnicodeDecodeError:
        plaintext = data.hex()

    chain = _block_chain(key, iv, ciphertext, encrypting=False)
    ciphertext_blocks = [ciphertext[i:i + BLOCK_BYTES].hex()
                         for i in range(0, len(ciphertext), BLOCK_BYTES)]
    padded_blocks = [s["xored_output"] for s in chain]
    xor_states = [s["output"] for s in chain]
    prev_states = [s["prev_state"] for s in chain]

    # 1 → setup, then per block: AES⁻¹ step (2i) and XOR step (2i+1),
    # then a final padding-removal step (2N+2).
    steps = [
        step(1, "Set up AES-CBC (decrypt)",
             "A %d-bit AES key and a 128-bit IV configure the reverse mode."
             % (len(key) * 8),
             f"key = <{len(key) * 8}-bit hidden>, iv = {iv.hex()}",
             "AES-CBC context",
             {"key_size": len(key) * 8, "iv_hex": iv.hex()}),
    ]
    for i, s in enumerate(chain, start=1):
        prev_label = _prev_label(i)
        steps.append(step(
            2 * i,
            f"AES-decrypt block {i}",
            "The AES layer is removed from the ciphertext block: "
            f"M{i} = AES⁻¹_K(C{i}).",
            f"C{i} = {s['input_block']}",
            f"M{i} = {s['output']}",
            {"block": i, "ciphertext_hex": s["input_block"],
             "decrypted_hex": s["output"]},
        ))
        steps.append(step(
            2 * i + 1,
            f"XOR to recover block {i}",
            "The decrypted block is XORed with the previous ciphertext block "
            "to invert the chaining: "
            f"P{i} = M{i} ⊕ {prev_label}.",
            f"M{i} = {s['output']}",
            f"P{i} = {s['xored_output']}",
            {"block": i, "prev_label": prev_label, "prev_hex": s["prev_state"],
             "decrypted_hex": s["output"], "plaintext_hex": s["xored_output"]},
        ))
    steps.append(step(
        2 * len(chain) + 2,
        "Remove PKCS#7 padding",
        "The trailing padding bytes added during encryption are stripped, "
        "leaving the original plaintext.",
        f"{len(padded)} bytes padded",
        f"{len(data)} bytes plaintext",
        {"block_count": len(ciphertext) // BLOCK_BYTES,
         "padded_hex": padded.hex(), "plaintext_hex": data.hex()},
    ))

    return build_result("aes_cbc", "decrypt", ciphertext_hex,
                        {"key": f"<{len(key) * 8}-bit hidden>", "iv": iv.hex()},
                        plaintext, steps,
                        {
                            "plaintext": plaintext,
                            "plaintext_hex": data.hex(),
                            "ciphertext_blocks": ciphertext_blocks,
                            "padded_plaintext_blocks": padded_blocks,
                            "xor_states": xor_states,
                            "prev_states": prev_states,
                            "block_count": len(ciphertext) // BLOCK_BYTES,
                            "security_note": (
                                "A successful decrypt does NOT prove the data "
                                "is authentic: CBC has no integrity check."
                            ),
                        })


def get_metadata() -> dict:
    return METADATA
