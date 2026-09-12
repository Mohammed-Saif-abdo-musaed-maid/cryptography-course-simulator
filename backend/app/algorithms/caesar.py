"""Caesar cipher educational simulator.

C = (P + k) mod 26        (encryption)
P = (C - k) mod 26        (decryption)

Supports uppercase/lowercase, preserving spaces and punctuation, and
exposes a brute-force demonstration of all 26 shifts.
"""

from __future__ import annotations

from typing import List

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

METADATA = {
    "id": "caesar",
    "name": "Caesar Cipher",
    "category": "classical",
    "security_status": "historic",
    "reversible": True,
    "key_kind": "shift (integer 1-25)",
    "block_size": "1 character",
    "description": (
        "The Caesar cipher shifts each letter of the alphabet by a fixed "
        "number of positions. It is one of the simplest and oldest known "
        "encryption techniques, named after Julius Caesar."
    ),
}


def _validate(text: str, shift: int) -> None:
    if not text or not text.strip():
        raise ValidationError("Plaintext must not be empty", "empty_input")
    if not isinstance(shift, int):
        raise ValidationError("Shift must be an integer", "invalid_shift")
    if shift < 0:
        raise ValidationError("Shift must not be negative", "invalid_shift")
    if shift > 1000:
        raise ValidationError("Shift is unreasonably large (max 1000)", "invalid_shift")


def _transform_char(ch: str, shift: int) -> tuple:
    if not ch.isalpha():
        return ch, None
    base = ord("A") if ch.isupper() else ord("a")
    pos = ord(ch) - base
    if shift >= 0:
        new_pos = (pos + shift) % 26
    else:
        new_pos = (pos - abs(shift)) % 26
    return chr(base + new_pos), {"char": ch, "value": pos, "shift": shift,
                                 "result_value": new_pos}


def transform(text: str, shift: int) -> List[dict]:
    """Return one mapping entry per input character."""
    entries = []
    for i, ch in enumerate(text):
        out, info = _transform_char(ch, shift)
        if info is None:
            entries.append({"index": i, "char": ch, "kind": "ignored",
                            "output": ch})
        else:
            entries.append({"index": i, "char": ch, "kind": "letter",
                            "value": info["value"], "shift": shift,
                            "formula": f"({info['char']} → {info['value']}" \
                                       f" {'+' if shift >= 0 else '-'} {shift}) mod 26",
                            "output": out})
    return entries


def encrypt(plaintext: str, shift: int, show_brute_force: bool = False) -> dict:
    _validate(plaintext, shift)
    k = shift % 26
    chars = list(plaintext)
    entries = []
    result_chars = []
    for i, ch in enumerate(chars):
        out, info = _transform_char(ch, k)
        result_chars.append(out)
        if info is not None:
            op = "+" if k >= 0 else "-"
            entries.append({"char": ch, "value": info["value"], "op": op,
                            "shift": k, "new_value": info["result_value"],
                            "result": out})
    ciphertext = "".join(result_chars)

    steps = [
        step(
            1, "Key normalisation",
            "The shift is reduced modulo 26 so that it always falls inside the "
            "alphabet size.",
            f"shift = {shift}", f"k = {shift} mod 26 = {k}", {"shift": shift, "k": k},
        ),
        step(
            2, "Character mapping",
            "Each letter is converted to its alphabet position and the formula "
            "C = (P + k) mod 26 is applied.",
            plaintext,
            ciphertext,
            {"mapping": entries},
        ),
        step(
            3, "Assemble ciphertext",
            "The transformed characters are joined together. Non-alphabetic "
            "characters (spaces, punctuation) are preserved unchanged.",
            "".join(chars), ciphertext, {},
        ),
    ]
    extra = {"ciphertext": ciphertext, "mapping": entries}
    if show_brute_force:
        extra["brute_force"] = brute_force(plaintext)
    return build_result("caesar", "encrypt", plaintext, {"shift": shift},
                        ciphertext, steps, extra)


def decrypt(ciphertext: str, shift: int) -> dict:
    _validate(ciphertext, shift)
    k = shift % 26
    inv_shift = (26 - k) % 26
    plaintext = "".join(_transform_char(ch, inv_shift)[0] for ch in ciphertext)
    steps = [
        step(
            1, "Key normalisation",
            "The shift is reduced modulo 26.",
            f"shift = {shift}", f"k = {shift} mod 26 = {k}", {"shift": shift, "k": k},
        ),
        step(
            2, "Inverse mapping",
            "Each letter is un-shifted using P = (C - k) mod 26.",
            ciphertext, plaintext, {"mapping": transform(ciphertext, inv_shift)},
        ),
    ]
    return build_result("caesar", "decrypt", ciphertext, {"shift": shift},
                        plaintext, steps, {"plaintext": plaintext})


def brute_force(text: str) -> List[dict]:
    """Try all 26 possible shifts as an educational cryptanalysis demo."""
    results = []
    for shift in range(26):
        candidate = "".join(_transform_char(ch, shift)[0] for ch in text)
        results.append({"shift": shift, "candidate": candidate})
    return results


def get_metadata() -> dict:
    return METADATA