"""Triple DES (3DES) educational simulator.

3DES applies DES three times in an Encrypt-Decrypt-Encrypt (EDE) chain:

    C = E(K3, D(K2, E(K1, P)))
    P = D(K1, E(K2, D(K3, C)))

Uses the genuine DES implementation in this package — no values are
invented. 3DES is DEPRECATED; organisations are migrating to AES.
"""

from __future__ import annotations

from typing import Optional

from backend.app.algorithms import des as des_module
from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "triple_des",
    "name": "3DES (Triple DES)",
    "category": "symmetric",
    "security_status": "deprecated",
    "reversible": True,
    "key_kind": "3× DES keys (each 8 bytes = 24 bytes total)",
    "block_size": "64 bits",
    "description": (
        "Triple DES applies the DES cipher three times per block using the "
        "EDE structure. Even though it improves key length to 168 bits, it "
        "is deprecated due to its 64-bit block size and slow software "
        "performance — AES is preferred."
    ),
}


def _parse_key(hex_key: str, label: str, required_len: Optional[int] = None):
    try:
        raw = bytes.fromhex(hex_key)
    except ValueError as exc:
        raise ValidationError(f"{label} must be valid hexadecimal", "invalid_hex") from exc
    if required_len is not None and len(raw) != required_len:
        raise ValidationError(f"{label} must be exactly {required_len} bytes", "invalid_key")
    return raw


def _split_keys(hex_key: str) -> tuple:
    raw = _parse_key(hex_key, "Key", 24)
    k1 = raw[0:8].hex()
    k2 = raw[8:16].hex()
    k3 = raw[16:24].hex()
    return k1, k2, k3


def _validate_block(hex_block: str) -> None:
    try:
        raw = bytes.fromhex(hex_block)
    except ValueError as exc:
        raise ValidationError("Block must be valid hexadecimal", "invalid_hex") from exc
    if len(raw) != 8:
        raise ValidationError("3DES block must be exactly 8 bytes (16 hex digits)",
                              "invalid_block")


def _des_stage(block_hex: str, key_hex: str, operation: str) -> dict:
    """Run a single DES stage, returning its digest and full simulation."""
    if operation == "encrypt":
        return des_module.encrypt(block_hex, key_hex)
    return des_module.decrypt(block_hex, key_hex)


def _run(hex_block: str, hex_key: str, decrypt_mode: bool) -> dict:
    _validate_block(hex_block)
    k1, k2, k3 = _split_keys(hex_key)

    if not decrypt_mode:
        etap = [("encrypt", k1, "E(K1)"), ("decrypt", k2, "D(K2)"),
                ("encrypt", k3, "E(K3)")]
    else:
        etap = [("decrypt", k3, "D(K3)"), ("encrypt", k2, "E(K2)"),
                ("decrypt", k1, "D(K1)")]

    current = hex_block.replace(" ", "")
    stage_results = []
    for op, key, label in etap:
        result = _des_stage(current, key, op)
        stage_results.append({
            "stage": label,
            "operation": op,
            "key": key,
            "input": current,
            "output": result["result"],
        })
        current = result["result"].replace(" ", "")
    final = current

    steps = [
        step(1, "Split the 24-byte key",
             "The 3DES key is split into three 8-byte DES keys K1, K2, K3.",
             hex_key, f"K1={k1}, K2={k2}, K3={k3}",
             {"k1": k1, "k2": k2, "k3": k3}),
        step(2, "First stage",
             "The first DES operation is applied to the 64-bit block.",
             hex_block.replace(" ", ""), stage_results[0]["output"],
             {"stage": stage_results[0]}),
        step(3, "Second stage",
             "The second DES operation acts on the previous output.",
             stage_results[0]["output"], stage_results[1]["output"],
             {"stage": stage_results[1]}),
        step(4, "Third stage",
             "The third DES operation produces the final result.",
             stage_results[1]["output"], stage_results[2]["output"],
             {"stage": stage_results[2]}),
    ]
    formula = ("C = E(K3, D(K2, E(K1, P)))" if not decrypt_mode
               else "P = D(K1, E(K2, D(K3, C)))")
    return build_result("triple_des",
                        "decrypt" if decrypt_mode else "encrypt",
                        hex_block, {"key": hex_key}, final, steps,
                        {
                            "result": final,
                            "stages": stage_results,
                            "formula": formula,
                            "k1": k1, "k2": k2, "k3": k3,
                            "deprecated_warning": True,
                        })


def encrypt(hex_block: str, hex_key: str) -> dict:
    return _run(hex_block, hex_key, decrypt_mode=False)


def decrypt(hex_block: str, hex_key: str) -> dict:
    return _run(hex_block, hex_key, decrypt_mode=True)


def get_metadata() -> dict:
    return METADATA
