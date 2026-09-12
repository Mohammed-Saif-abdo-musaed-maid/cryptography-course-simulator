"""Practice exercises content and grading service.

Each exercise provides the question, answer options/expected value, and an
explanation. Grading returns correctness, the expected answer and an
explanation for `Show Answer`.
"""

from __future__ import annotations

from typing import Dict, List, Optional

from backend.app.algorithms import caesar, columnar, hill, monoalphabetic, playfair, rail_fence, rsa, vigenere
from backend.app.utils.errors import ValidationError

EXERCISES: List[dict] = [
    {
        "id": "caesar-1",
        "algorithm": "caesar",
        "category": "classical",
        "type": "encryption",
        "difficulty": "easy",
        "question": "Using the Caesar cipher with shift 3, encrypt the message "
                    "HELLO.",
        "answer": "KHOOR",
        "options": ["KHOOR", "MJQQT", "EBIIL", "KHOOR "],
        "explanation": "Each letter is shifted forward by 3: H→K, E→H, L→O, "
                       "L→O, O→R.",
    },
    {
        "id": "caesar-2",
        "algorithm": "caesar",
        "category": "classical",
        "type": "decryption",
        "difficulty": "easy",
        "question": "Decrypt the message KHOOR produced with a Caesar shift of 3.",
        "answer": "HELLO",
        "options": ["HELLO", "MJQQT", "IHNNK", "HELLO"],
        "explanation": "Shift each letter back by 3: K→H, H→E, O→L, O→L, "
                       "R→O. Formula: P = (C − k) mod 26.",
    },
    {
        "id": "vigenere-1",
        "algorithm": "vigenere",
        "category": "classical",
        "type": "encryption",
        "difficulty": "medium",
        "question": "Encrypt ATTACKATDAWN with the Vigenère key LEMON.",
        "answer": "LXFOPVEFRNHR",
        "options": ["LXFOPVEFRNHR", "MXTORVTCTZHP", "KXHOPVEFRNHR", "LXFOPVEFRNHR"],
        "explanation": "Key repeats LEMONLEMONLE. A+L=(0+11)=L, T+E=(19+4)=23=X, "
                       "T+L=(19+11)=4=E, ... giving LXFOPVEFRNHR.",
    },
    {
        "id": "mono-1",
        "algorithm": "monoalphabetic",
        "category": "classical",
        "type": "encryption",
        "difficulty": "medium",
        "question": "Using substitution alphabet QAZWSXEDCRFVTGBYHNUJMIKOLP, "
                    "encrypt the letter A.",
        "answer": "Q",
        "options": ["Q", "B", "Z", "A"],
        "explanation": "The alphabet position of A is 0, so it maps to the "
                       "first letter of the substitution alphabet, Q.",
    },
    {
        "id": "playfair-1",
        "algorithm": "playfair",
        "category": "classical",
        "type": "encryption",
        "difficulty": "medium",
        "question": "In Playfair, how is the digraph 'AA' prepared before "
                    "encryption?",
        "answer": "AX",
        "options": ["AX", "AA", "AY", "AXA"],
        "explanation": "Repeated letters in a digraph are separated by a "
                       "filler X: AA becomes AX.",
    },
    {
        "id": "hill-1",
        "algorithm": "hill",
        "category": "classical",
        "type": "numeric",
        "difficulty": "hard",
        "question": "For the Hill cipher key matrix [[3,3],[2,5]], what is its "
                    "determinant (the value that must be coprime with 26)?",
        "answer": "9",
        "options": ["9", "-9", "0", "13"],
        "explanation": "det = 3×5 − 3×2 = 15 − 6 = 9. gcd(9, 26) = 1 so the "
                       "matrix is invertible.",
    },
    {
        "id": "rail-1",
        "algorithm": "rail_fence",
        "category": "classical",
        "type": "true_false",
        "difficulty": "easy",
        "question": "The Rail Fence cipher with 2 rails reads plaintext letters "
                    "alternately onto each rail.",
        "answer": "True",
        "options": ["True", "False"],
        "explanation": "With 2 rails the pattern alternates between rail 1 and "
                       "rail 2 for each character.",
    },
    {
        "id": "columnar-1",
        "algorithm": "columnar",
        "category": "classical",
        "type": "numeric",
        "difficulty": "medium",
        "question": "For a columnar transposition with key length 4 and "
                    "message 'ABCDEFGH', how many columns are used?",
        "answer": "4",
        "options": ["4", "8", "2", "6"],
        "explanation": "The number of columns equals the number of letters in "
                       "the keyword, which is 4.",
    },
    {
        "id": "des-1",
        "algorithm": "des",
        "category": "symmetric",
        "type": "knowledge",
        "difficulty": "medium",
        "question": "What is the effective key size of DES (the usable key "
                    "after parity bits are removed)?",
        "answer": "56",
        "options": ["56", "64", "48", "128"],
        "explanation": "DES uses an 8-byte key but 8 bits are parity bits, so "
                       "the effective key is 56 bits.",
    },
    {
        "id": "aes-1",
        "algorithm": "aes",
        "category": "symmetric",
        "type": "knowledge",
        "difficulty": "medium",
        "question": "How many rounds does AES-128 perform?",
        "answer": "10",
        "options": ["10", "12", "14", "16"],
        "explanation": "AES-128 uses 10 rounds, AES-192 uses 12 and AES-256 "
                       "uses 14.",
    },
    {
        "id": "aes-2",
        "algorithm": "aes",
        "category": "symmetric",
        "type": "true_false",
        "difficulty": "easy",
        "question": "AES block size is 128 bits regardless of key size.",
        "answer": "True",
        "options": ["True", "False"],
        "explanation": "All AES variants operate on 128-bit data blocks.",
    },
    {
        "id": "rsa-1",
        "algorithm": "rsa",
        "category": "asymmetric",
        "type": "numeric",
        "difficulty": "medium",
        "question": "For RSA with p = 11 and q = 13, what is n?",
        "answer": "143",
        "options": ["143", "24", "120", "132"],
        "explanation": "n = p × q = 11 × 13 = 143.",
    },
    {
        "id": "rsa-2",
        "algorithm": "rsa",
        "category": "asymmetric",
        "type": "numeric",
        "difficulty": "medium",
        "question": "For p = 11 and q = 13, what is φ(n)?",
        "answer": "120",
        "options": ["120", "143", "24", "119"],
        "explanation": "φ(n) = (p − 1)(q − 1) = 10 × 12 = 120.",
    },
    {
        "id": "dh-1",
        "algorithm": "diffie_hellman",
        "category": "key_exchange",
        "type": "knowledge",
        "difficulty": "easy",
        "question": "What does basic Diffie–Hellman allow two parties to "
                    "do?",
        "answer": "Derive a shared secret",
        "options": ["Derive a shared secret", "Encrypt a message directly",
                    "Digitally sign a document", "Compress data"],
        "explanation": "DH derives a shared secret over an insecure channel. "
                       "It does not encrypt data by itself and does not "
                       "authenticate participants.",
    },
    {
        "id": "elgamal-1",
        "algorithm": "elgamal",
        "category": "asymmetric",
        "type": "knowledge",
        "difficulty": "hard",
        "question": "Why does ElGamal produce different ciphertexts for the "
                    "same message encrypted twice?",
        "answer": "It uses a random ephemeral key k",
        "options": ["It uses a random ephemeral key k", "It uses a different "
                    "prime each time", "It is a transposition cipher", "It "
                    "uses two different moduli"],
        "explanation": "Each encryption picks a fresh random k, changing c1 "
                       "and c2 even for the same plaintext (probabilistic "
                       "encryption).",
    },
    {
        "id": "sha-1",
        "algorithm": "sha256",
        "category": "hashing",
        "type": "knowledge",
        "difficulty": "easy",
        "question": "SHA-256 is best described as a...",
        "answer": "one-way hash function",
        "options": ["one-way hash function", "symmetric encryption cipher",
                    "asymmetric encryption cipher", "key exchange protocol"],
        "explanation": "SHA-256 is a cryptographic hash. It cannot be "
                       "reversed — there is no decryption operation.",
    },
    {
        "id": "sha-2",
        "algorithm": "sha256",
        "category": "hashing",
        "type": "true_false",
        "difficulty": "easy",
        "question": "SHA-256 can be used to verify file integrity.",
        "answer": "True",
        "options": ["True", "False"],
        "explanation": "Recomputing the digest and comparing it with the "
                       "expected value detects modification of data.",
    },
    {
        "id": "general-1",
        "algorithm": "general",
        "category": "general_security",
        "type": "knowledge",
        "difficulty": "easy",
        "question": "Which property guarantees data has not been altered?",
        "answer": "Integrity",
        "options": ["Integrity", "Confidentiality", "Availability", "Non-repudiation"],
        "explanation": "Integrity in the CIA triad protects against "
                       "unauthorized modification.",
    },
    {
        "id": "general-2",
        "algorithm": "general",
        "category": "general_security",
        "type": "knowledge",
        "difficulty": "medium",
        "question": "The CIA triad consists of...",
        "answer": "Confidentiality, Integrity, Availability",
        "options": ["Confidentiality, Integrity, Availability",
                    "Confidentiality, Identification, Authorization",
                    "Cryptography, Identity, Access",
                    "Clarity, Integrity, Assurance"],
        "explanation": "Confidentiality, Integrity and Availability define the "
                       "core goals of information security.",
    },
]


def list_exercises(category: str = "all") -> dict:
    if category == "all":
        items = EXERCISES
    else:
        items = [e for e in EXERCISES if e["category"] == category or
                 e["algorithm"] == category]
    public = [{k: v for k, v in e.items() if k != "answer"} for e in items]
    return {"total": len(items), "exercises": public}


def get_exercise(exercise_id: str) -> dict:
    for e in EXERCISES:
        if e["id"] == exercise_id:
            public = {k: v for k, v in e.items() if k != "answer"}
            public["_has_answer"] = True
            return public
    raise ValidationError(f"Unknown exercise '{exercise_id}'", "unknown_exercise")


def check_exercise(exercise_id: str, answer: str) -> dict:
    for e in EXERCISES:
        if e["id"] == exercise_id:
            expected = e["answer"]
            normalized = str(answer).strip().lower()
            correct = normalized == expected.strip().lower()
            return {
                "exercise_id": exercise_id,
                "correct": correct,
                "expected": expected,
                "submitted": answer,
                "explanation": e["explanation"],
            }
    raise ValidationError(f"Unknown exercise '{exercise_id}'", "unknown_exercise")


def random_exercises(category: str = "all", count: int = 6) -> List[dict]:
    """Select a spread of exercises (used by the UI display)."""
    import random
    pool = EXERCISES if category == "all" else [
        e for e in EXERCISES
        if e["category"] == category or e["algorithm"] == category
    ]
    if not pool:
        pool = list(EXERCISES)
    selected = random.sample(pool, min(count, len(pool)))
    return [{k: v for k, v in e.items() if k != "answer"} for e in selected]
