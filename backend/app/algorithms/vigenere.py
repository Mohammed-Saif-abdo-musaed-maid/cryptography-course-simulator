"""Vigenère cipher educational simulator.

Ci = (Pi + Ki) mod 26        (encryption)
Pi = (Ci - Ki) mod 26        (decryption)

The key is repeated over the length of the plaintext.
"""

from __future__ import annotations

from typing import List

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

METADATA = {
    "id": "vigenere",
    "name": "Vigenère Cipher",
    "category": "classical",
    "security_status": "historic",
    "reversible": True,
    "key_kind": "keyword (letters)",
    "block_size": "1 character",
    "description": (
        "A polyalphabetic substitution cipher using a keyword. Each key "
        "letter selects a different Caesar shift, making frequency analysis "
        "much harder than for simple substitution."
    ),
}


def _validate(text: str, key: str) -> None:
    if not text or not text.strip():
        raise ValidationError("Input must not be empty", "empty_input")
    if not key:
        raise ValidationError("Key must not be empty", "invalid_key")
    if not all(c.isalpha() for c in key):
        raise ValidationError(
            "The key may only contain letters", "invalid_key"
        )


def _repeat_key(key: str, length: int) -> str:
    base = key.upper()
    if length <= len(base):
        return base[:length]
    return (base * (length // len(base) + 1))[:length]


def _entries(text: str, key: str, sign: int) -> dict:
    """Compute per-character mapping. sign=+1 encrypt, sign=-1 decrypt."""
    letters_only = [c for c in text if c.isalpha()]
    repeated = _repeat_key(key, len(letters_only))
    entries = []
    letter_idx = 0
    out_chars = []
    for ch in text:
        if not ch.isalpha():
            entries.append({"index": len(out_chars), "char": ch,
                            "kind": "ignored", "output": ch})
            out_chars.append(ch)
            continue
        base = ord("A") if ch.isupper() else ord("a")
        p_val = ord(ch.upper()) - ord("A")
        k_val = ord(repeated[letter_idx]) - ord("A")
        if sign == 1:
            c_val = (p_val + k_val) % 26
            formula = f"({p_val} + {k_val}) mod 26"
        else:
            c_val = (p_val - k_val) % 26
            formula = f"({p_val} - {k_val}) mod 26"
        out = chr(base + c_val)
        entries.append({
            "index": letter_idx,
            "char": ch,
            "kind": "letter",
            "key_char": repeated[letter_idx],
            "key_value": k_val,
            "value": p_val,
            "formula": formula,
            "output": out,
        })
        out_chars.append(out)
        letter_idx += 1
    return {"entries": entries, "repeated_key": repeated[:len(letters_only)],
            "result": "".join(out_chars)}


def encrypt(plaintext: str, key: str) -> dict:
    _validate(plaintext, key)
    data = _entries(plaintext, key, +1)
    entries = data["entries"]
    ciphertext = data["result"]
    letter_rows = [e for e in entries if e["kind"] == "letter"]
    steps = [
        step(1, "Key repetition",
             "The keyword is repeated until it matches the number of letters "
             "in the plaintext (non-letters are skipped).",
             key, data["repeated_key"],
             {"key": key.upper(), "repeated": data["repeated_key"]}),
        step(2, "Numerical conversion",
             "Each plaintext letter Pᵢ and key letter Kᵢ are converted to "
             "alphabet positions (A=0 … Z=25).",
             plaintext, "Pᵢ, Kᵢ ∈ {0,…,25}",
             {"alphabet": ALPHABET}),
        step(3, "Modular addition",
             "Cᵢ = (Pᵢ + Kᵢ) mod 26 is computed per letter.",
             ", ".join(f"P={e['value']},K={e['key_value']}" for e in letter_rows),
             ciphertext, {"mapping": entries}),
        step(4, "Assemble ciphertext",
             "The results are joined, preserving original casing and "
             "non-alphabetic characters.",
             plaintext, ciphertext, {}),
    ]
    return build_result("vigenere", "encrypt", plaintext, {"key": key},
                        ciphertext, steps,
                        {"ciphertext": ciphertext, "repeated_key": data["repeated_key"],
                         "mapping": entries,
                         "formula": "Cᵢ = (Pᵢ + Kᵢ) mod 26"})


def decrypt(ciphertext: str, key: str) -> dict:
    _validate(ciphertext, key)
    data = _entries(ciphertext, key, -1)
    entries = data["entries"]
    plaintext = data["result"]
    steps = [
        step(1, "Key repetition",
             "The keyword is repeated over the letter count of the ciphertext.",
             key, data["repeated_key"], {"repeated": data["repeated_key"]}),
        step(2, "Modular subtraction",
             "Pᵢ = (Cᵢ - Kᵢ) mod 26 for each letter.",
             ciphertext, plaintext, {"mapping": entries}),
    ]
    return build_result("vigenere", "decrypt", ciphertext, {"key": key},
                        plaintext, steps,
                        {"plaintext": plaintext,
                         "repeated_key": data["repeated_key"],
                         "mapping": entries,
                         "formula": "Pᵢ = (Cᵢ - Kᵢ) mod 26"})


def get_metadata() -> dict:
    return METADATA