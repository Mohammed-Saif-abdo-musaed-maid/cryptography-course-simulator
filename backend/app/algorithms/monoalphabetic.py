"""Monoalphabetic substitution cipher educational simulator.

Each plaintext letter maps to exactly one ciphertext letter via a
permutation of the alphabet (the substitution alphabet). Includes
frequency-analysis educational information.
"""

from __future__ import annotations

import random
from typing import Dict, List

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

METADATA = {
    "id": "monoalphabetic",
    "name": "Monoalphabetic Substitution",
    "category": "classical",
    "security_status": "historic",
    "reversible": True,
    "key_kind": "substitution alphabet (26 letters)",
    "block_size": "1 character",
    "description": (
        "Replaces each character of the plaintext with a corresponding "
        "character from a substituted alphabet. Vulnerable to frequency "
        "analysis because letter frequencies are preserved."
    ),
}


def _normalise_alphabet(substitution: str) -> str:
    sub = (substitution or "").upper()
    sub = sub.replace(" ", "")
    if len(sub) != 26:
        raise ValidationError(
            "Substitution alphabet must contain exactly 26 letters",
            "invalid_substitution",
        )
    extra = [c for c in sub if not c.isalpha()]
    if extra:
        raise ValidationError(
            f"Substitution alphabet contains invalid characters: {''.join(sorted(set(extra)))}",
            "invalid_substitution",
        )
    if len(set(sub)) != 26:
        raise ValidationError(
            "Substitution alphabet contains duplicate characters. Every letter "
            "may appear exactly once.",
            "duplicate_characters",
        )
    return sub


def generate_random_alphabet(seed: int | None = None) -> str:
    """Generate a random permutation of the English alphabet."""
    letters = list(ALPHABET)
    if seed is not None:
        _rng = random.Random(seed)
        _rng.shuffle(letters)
        return "".join(letters)
    rng = random.SystemRandom()
    rng.shuffle(letters)
    return "".join(letters)


def validate(substitution: str) -> None:
    _normalise_alphabet(substitution)


def _map_entries(text: str, sub: str) -> List[dict]:
    entries = []
    for i, ch in enumerate(text):
        if not ch.isalpha():
            entries.append({"index": i, "char": ch, "kind": "ignored", "output": ch})
            continue
        upper = ch.upper()
        pos = ALPHABET.index(upper)
        mapped = sub[pos]
        out = mapped if ch.isupper() else mapped.lower()
        entries.append({
            "index": i,
            "char": ch,
            "kind": "letter",
            "position": pos,
            "mapped": mapped,
            "output": out,
            "rule": f"{ch.upper()} → {mapped}",
        })
    return entries


def _frequency_profile(text: str) -> List[dict]:
    counts: Dict[str, int] = {}
    total = 0
    for ch in text.upper():
        if ch.isalpha():
            counts[ch] = counts.get(ch, 0) + 1
            total += 1
    profile = sorted(
        ({"letter": c, "count": n, "frequency": round(n / total, 4) if total else 0}
         for c, n in counts.items()),
        key=lambda x: (-x["count"], x["letter"]),
    )
    return profile


def encrypt(plaintext: str, substitution: str) -> dict:
    if not plaintext or not plaintext.strip():
        raise ValidationError("Plaintext must not be empty", "empty_input")
    sub = _normalise_alphabet(substitution)
    entries = _map_entries(plaintext, sub)
    ciphertext = "".join(e["output"] for e in entries)
    steps = [
        step(1, "Substitution alphabet",
             "The provided 26-letter permutation is the key. Plaintext letters "
             "are replaced by their counterpart in the substitution alphabet.",
             ALPHABET, sub, {"alphabet": ALPHABET, "substitution": sub}),
        step(2, "Character-by-character substitution",
             "Each plaintext letter is mapped through its position (0–25).",
             plaintext, ciphertext, {"mapping": entries}),
        step(3, "Assemble ciphertext",
             "Mapped letters are joined; non-alphabetic characters are kept.",
             plaintext, ciphertext, {}),
    ]
    return build_result(
        "monoalphabetic", "encrypt", plaintext, {"substitution": sub},
        ciphertext, steps,
        {"ciphertext": ciphertext, "alphabet": ALPHABET,
         "substitution": sub, "mapping": entries,
         "frequency_analysis": "Ciphertext letter frequencies mirror the "
                               "plaintext language; compare with English "
                               "letter-frequency order ETAOINSHRDLU..."},
    )


def decrypt(ciphertext: str, substitution: str) -> dict:
    if not ciphertext or not ciphertext.strip():
        raise ValidationError("Ciphertext must not be empty", "empty_input")
    sub = _normalise_alphabet(substitution)
    inverse = {subpos: ALPHABET[pos] for pos, subpos in enumerate(sub)}
    inverse_text = "".join(inverse[c] for c in ALPHABET)

    def _inv(ch: str) -> str:
        if not ch.isalpha():
            return ch
        upper = ch.upper()
        original = inverse[upper]
        return original if ch.isupper() else original.lower()

    plaintext = "".join(_inv(ch) for ch in ciphertext)
    entries = []
    for i, ch in enumerate(ciphertext):
        if not ch.isalpha():
            entries.append({"index": i, "char": ch, "kind": "ignored", "output": ch})
        else:
            entries.append({"index": i, "char": ch, "kind": "letter",
                            "rule": f"{ch.upper()} → {inverse[ch.upper()]}",
                            "output": plaintext[i]})
    steps = [
        step(1, "Inverse substitution alphabet",
             "Decryption looks each ciphertext letter up in the substitution "
             "alphabet and returns the original alphabet letter.",
             sub, inverse_text, {"inverse": inverse_text}),
        step(2, "Character-by-character recovery",
             "Each ciphertext letter is inverted.",
             ciphertext, plaintext, {"mapping": entries}),
    ]
    return build_result("monoalphabetic", "decrypt", ciphertext,
                        {"substitution": sub}, plaintext, steps,
                        {"plaintext": plaintext, "alphabet": ALPHABET,
                         "substitution": sub, "inverse": inverse_text,
                         "mapping": entries})


def get_metadata() -> dict:
    return METADATA