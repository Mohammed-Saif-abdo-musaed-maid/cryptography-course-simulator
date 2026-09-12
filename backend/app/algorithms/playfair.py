"""Playfair cipher educational simulator.

Uses a 5x5 key square built from a keyword (I/J merged). Plaintext is split
into digraphs with filler 'X'. Rules:
  * same row    -> shift right
  * same column -> shift down
  * rectangle   -> swap corners
"""

from __future__ import annotations

from typing import List, Tuple

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

ALPHABET = "ABCDEFGHIKLMNOPQRSTUVWXYZ"  # no J

METADATA = {
    "id": "playfair",
    "name": "Playfair Cipher",
    "category": "classical",
    "security_status": "historic",
    "reversible": True,
    "key_kind": "keyword (letters)",
    "block_size": "2 characters (digraph)",
    "description": (
        "A digraph substitution cipher using a 5x5 key square. Encrypts "
        "pairs of letters (digraphs), which breaks simple single-letter "
        "frequency analysis."
    ),
}


def build_square(keyword: str) -> List[List[str]]:
    if not keyword or not keyword.strip():
        raise ValidationError("Keyword must not be empty", "invalid_key")
    cleaned = ""
    for ch in keyword.upper():
        if not ch.isalpha():
            continue
        if ch == "J":
            ch = "I"
        if ch not in cleaned:
            cleaned += ch
    for ch in ALPHABET:
        if ch not in cleaned:
            cleaned += ch
    return [list(cleaned[i * 5:(i + 1) * 5]) for i in range(5)]


def _positions(square: List[List[str]]) -> dict:
    pos = {}
    for r in range(5):
        for c in range(5):
            pos[square[r][c]] = (r, c)
    return pos


def _normalise(text: str) -> str:
    out = []
    for ch in text.upper():
        if not ch.isalpha():
            continue
        out.append("I" if ch == "J" else ch)
    return "".join(out)


def _prepare(text: str) -> Tuple[List[str], List[dict]]:
    """Split into digraphs, doubling repeated letters with 'X' filler."""
    clean = _normalise(text)
    pairs = []
    notes = []
    i = 0
    while i < len(clean):
        a = clean[i]
        if i + 1 < len(clean) and clean[i + 1] == a:
            pairs.append(a + "X")
            notes.append({"digraph": a + "X", "reason": f"repeated '{a}' split with filler X"})
            i += 1
        elif i + 1 < len(clean):
            pairs.append(clean[i:i + 2])
            notes.append({"digraph": clean[i:i + 2], "reason": "normal pair"})
            i += 2
        else:
            pairs.append(a + "X")
            notes.append({"digraph": a + "X", "reason": f"odd tail '{a}' padded with X"})
            i += 1
    return pairs, notes


def _encipher_pair(a: str, b: str, pos: dict, square: List[List[str]]) -> Tuple[str, dict]:
    ra, ca = pos[a]
    rb, cb = pos[b]
    if ra == rb:
        out = square[ra][(ca + 1) % 5] + square[rb][(cb + 1) % 5]
        rule = "same row → shift each letter right"
    elif ca == cb:
        out = square[(ra + 1) % 5][ca] + square[(rb + 1) % 5][cb]
        rule = "same column → shift each letter down"
    else:
        out = square[ra][cb] + square[rb][ca]
        rule = "rectangle → swap column corners"
    return out, {"a": a, "b": b, "positions": {"a": (ra, ca), "b": (rb, cb)},
                 "rule": rule, "output": out}


def _decipher_pair(a: str, b: str, pos: dict, square: List[List[str]]) -> Tuple[str, dict]:
    ra, ca = pos[a]
    rb, cb = pos[b]
    if ra == rb:
        out = square[ra][(ca - 1) % 5] + square[rb][(cb - 1) % 5]
        rule = "same row → shift each letter left"
    elif ca == cb:
        out = square[(ra - 1) % 5][ca] + square[(rb - 1) % 5][cb]
        rule = "same column → shift each letter up"
    else:
        out = square[ra][cb] + square[rb][ca]
        rule = "rectangle → swap column corners"
    return out, {"a": a, "b": b, "positions": {"a": (ra, ca), "b": (rb, cb)},
                 "rule": rule, "output": out}


def encrypt(plaintext: str, keyword: str) -> dict:
    if not plaintext or not plaintext.strip():
        raise ValidationError("Plaintext must not be empty", "empty_input")
    square = build_square(keyword)
    pos = _positions(square)
    pairs, notes = _prepare(plaintext)
    digraph_steps = []
    results = []
    for k, pair in enumerate(pairs):
        a, b = pair[0], pair[1]
        out, info = _encipher_pair(a, b, pos, square)
        info["digraph"] = pair
        info["note"] = notes[k]["reason"] if k < len(notes) else ""
        digraph_steps.append(info)
        results.append(out)
    ciphertext = "".join(results)

    steps = [
        step(1, "Build 5x5 key square",
             "Write distinct keyword letters, then the rest of the alphabet "
             "(I/J merged).",
             keyword, "".join("".join(r) for r in square),
             {"square": square}),
        step(2, "Split plaintext into digraphs",
             "Plaintext letters are paired. Repeated letters are separated "
             "by 'X'; an odd tail is padded with 'X'.",
             plaintext, " ".join(pairs),
             {"pairs": pairs, "notes": notes}),
        step(3, "Encrypt each digraph",
             "Apply the same-row / same-column / rectangle rules.",
             " ".join(pairs), " ".join(results),
             {"digraphs": digraph_steps}),
        step(4, "Assemble ciphertext",
             "The encrypted digraphs are concatenated.",
             " ".join(results), ciphertext, {}),
    ]
    return build_result("playfair", "encrypt", plaintext, {"keyword": keyword},
                        ciphertext, steps,
                        {"ciphertext": ciphertext, "square": square,
                         "pairs": pairs, "digraphs": digraph_steps})


def decrypt(ciphertext: str, keyword: str) -> dict:
    if not ciphertext or not ciphertext.strip():
        raise ValidationError("Ciphertext must not be empty", "empty_input")
    square = build_square(keyword)
    pos = _positions(square)
    clean = _normalise(ciphertext)
    if len(clean) % 2 != 0:
        raise ValidationError("Ciphertext must contain an even number of letters "
                              "for Playfair digraph processing", "invalid_length")
    pairs = [clean[i:i + 2] for i in range(0, len(clean), 2)]
    digraph_steps = []
    results = []
    for pair in pairs:
        a, b = pair[0], pair[1]
        out, info = _decipher_pair(a, b, pos, square)
        info["digraph"] = pair
        digraph_steps.append(info)
        results.append(out)
    plaintext = "".join(results)
    steps = [
        step(1, "Build 5x5 key square",
             "Rebuild the square from the keyword.",
             keyword, "".join("".join(r) for r in square), {"square": square}),
        step(2, "Split ciphertext into digraphs",
             "The ciphertext is already in digraph form.",
             clean, " ".join(pairs), {"pairs": pairs}),
        step(3, "Decrypt each digraph",
             "Apply the inverse rules (shift left/up, rectangle swap).",
             " ".join(pairs), " ".join(results), {"digraphs": digraph_steps}),
        step(4, "Assemble recovered text",
             "Joins the digraphs; trailing filler 'X' may need manual removal.",
             " ".join(results), plaintext, {}),
    ]
    return build_result("playfair", "decrypt", ciphertext, {"keyword": keyword},
                        plaintext, steps,
                        {"plaintext": plaintext, "square": square,
                         "pairs": pairs, "digraphs": digraph_steps})


def get_metadata() -> dict:
    return METADATA
