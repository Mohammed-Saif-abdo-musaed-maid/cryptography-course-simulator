"""AES-CTR educational simulator.

Counter mode (CTR) turns AES into a stream cipher: an incrementing counter
is encrypted with the key to produce a keystream, which is XORed with the
data. Encryption and decryption are the *same* operation. CTR needs no
padding but is malleable (no integrity), so it too must be authenticated.
"""

from __future__ import annotations

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "aes_ctr",
    "name": "AES-CTR",
    "category": "symmetric",
    "security_status": "secure_with_auth",
    "reversible": True,
    "key_kind": "128 / 192 / 256-bit key (hex) + 128-bit counter block (hex)",
    "block_size": "stream (128-bit counter)",
    "description": (
        "AES in counter mode: AES encrypts an incrementing 128-bit counter "
        "to form a keystream that is XORed with the data. No padding is "
        "needed; the same operation encrypts and decrypts. The counter "
        "block must NEVER repeat under the same key."
    ),
    "formula": "Keystreamᵢ = E_K(IV + i); Cᵢ = Pᵢ ⊕ Keystreamᵢ",
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


def _counter(counter_hex: str) -> bytes:
    counter = _parse_hex(counter_hex, "Counter")
    if len(counter) != BLOCK_BYTES:
        raise ValidationError(
            "CTR counter block must be exactly 128 bits (32 hex digits)",
            "invalid_counter")
    return counter


def _increment_block(counter: bytes) -> bytes:
    """Big-endian 128-bit counter increment (NIST SP 800-38A §6.1)."""
    n = int.from_bytes(counter, "big")
    return ((n + 1) % (1 << (BLOCK_BYTES * 8))).to_bytes(BLOCK_BYTES, "big")


def _ctr_trace(key: bytes, counter: bytes, data: bytes) -> dict:
    """Per-block CTR keystream trace via the real AES primitive.

    Each keystream block is AES-ECB(counter_i), where counter_i is the
    original counter incremented by i. The resulting keystream blocks,
    when XORed with the data blocks, are byte-identical to the mode-level
    ciphertext — the backend trace test verifies this.
    """
    counter_blocks: list[str] = []
    keystream_blocks: list[str] = []
    plaintext_blocks: list[str] = []
    cur = counter
    ecb = Cipher(algorithms.AES(key), modes.ECB()).encryptor()
    for i in range(0, len(data), BLOCK_BYTES):
        chunk = data[i:i + BLOCK_BYTES]
        counter_blocks.append(cur.hex())
        ks = ecb.update(cur)
        keystream_blocks.append(ks.hex())
        plaintext_blocks.append(chunk.hex())
        cur = _increment_block(cur)
    return {
        "counter_blocks": counter_blocks,
        "keystream_blocks": keystream_blocks,
        "plaintext_blocks": plaintext_blocks,
    }


def _run(data: bytes, key: bytes, counter: bytes) -> bytes:
    transform = Cipher(algorithms.AES(key), modes.CTR(counter)).encryptor()
    return transform.update(data) + transform.finalize()


def encrypt(plaintext: str, key_hex: str, counter_hex: str) -> dict:
    if plaintext is None:
        raise ValidationError("Plaintext is required", "missing_input")
    key = _key(key_hex)
    counter = _counter(counter_hex)
    data = plaintext.encode("utf-8")
    ciphertext = _run(data, key, counter)
    trace = _ctr_trace(key, counter, data)
    ciphertext_blocks = []
    for i, pt in enumerate(trace["plaintext_blocks"]):
        ks = bytes.fromhex(trace["keystream_blocks"][i])
        shared = min(len(ks), len(bytes.fromhex(pt)))
        ciphertext_blocks.append(
            bytes(a ^ b for a, b in zip(bytes.fromhex(pt)[:shared], ks[:shared])).hex())

    steps = [
        step(1, "Set up AES-CTR",
             "A %d-bit AES key and a 128-bit counter block configure the "
             "mode. The counter is usually a nonce ‖ block counter." % (len(key) * 8),
             f"key = <{len(key) * 8}-bit hidden>, counter = {counter.hex()}",
             "AES-CTR context",
             {"key_size": len(key) * 8, "counter_hex": counter.hex()}),
        step(2, "Generate the keystream",
             "AES encrypts the counter, then the counter is incremented and "
             "AES encrypts again, until enough keystream bytes exist.",
             counter.hex(), f"{len(ciphertext)} keystream bytes",
             {"length": len(ciphertext),
              "counter_blocks": trace["counter_blocks"],
              "keystream_blocks": trace["keystream_blocks"]}),
        step(3, "XOR with the plaintext",
             "Plaintext XOR keystream yields the ciphertext. Because XOR is "
             "symmetric, decryption uses the identical operation.",
             data.hex(), ciphertext.hex(),
             {"plaintext_hex": data.hex(), "ciphertext_hex": ciphertext.hex()}),
    ]

    return build_result("aes_ctr", "encrypt", plaintext,
                        {"key": f"<{len(key) * 8}-bit hidden>", "counter": counter.hex()},
                        ciphertext.hex(), steps,
                        {
                            "ciphertext_hex": ciphertext.hex(),
                            "counter_hex": counter.hex(),
                            "key_size": len(key) * 8,
                            "counter_blocks": trace["counter_blocks"],
                            "keystream_blocks": trace["keystream_blocks"],
                            "plaintext_blocks": trace["plaintext_blocks"],
                            "ciphertext_blocks": ciphertext_blocks,
                            "security_note": (
                                "CTR is unauthenticated and malleable. Add a "
                                "MAC or use AEAD (AES-GCM/CCM) for integrity."
                            ),
                        })


def decrypt(ciphertext_hex: str, key_hex: str, counter_hex: str) -> dict:
    if not ciphertext_hex:
        raise ValidationError("Ciphertext is required", "missing_input")
    key = _key(key_hex)
    counter = _counter(counter_hex)
    try:
        ciphertext = bytes.fromhex("".join(str(ciphertext_hex).split()))
    except ValueError as exc:
        raise ValidationError("Ciphertext must be valid hexadecimal",
                              "invalid_hex") from exc
    data = _run(ciphertext, key, counter)
    trace = _ctr_trace(key, counter, ciphertext)
    try:
        plaintext = data.decode("utf-8")
    except UnicodeDecodeError:
        plaintext = data.hex()

    return build_result("aes_ctr", "decrypt", ciphertext_hex,
                        {"key": f"<{len(key) * 8}-bit hidden>", "counter": counter.hex()},
                        plaintext, [],
                        {
                            "plaintext": plaintext,
                            "plaintext_hex": data.hex(),
                            "counter_blocks": trace["counter_blocks"],
                            "keystream_blocks": trace["keystream_blocks"],
                            "plaintext_blocks": trace["plaintext_blocks"],
                            "security_note": (
                                "A successful decrypt does NOT prove "
                                "authenticity: CTR has no integrity check."
                            ),
                        })


def get_metadata() -> dict:
    return METADATA
