"""Quiz question bank and grading service.

Questions are organized by category and difficulty. Grading returns per-
question correctness, the score and explanations. The frontend never
receives answers before submission.
"""

from __future__ import annotations

import random
from typing import Any, Dict, List

from app.utils.errors import ValidationError

QUIZ_QUESTIONS: List[dict] = [
    # -- Classical -----------------------------------------------------------
    {"id": "q-class-1", "category": "classical", "difficulty": "easy",
     "question": "The Caesar cipher is an example of a ___ cipher.",
     "options": ["substitution", "transposition", "stream", "asymmetric"],
     "answer": 0, "explanation": "Caesar replaces letters with other letters — "
                                 "a substitution cipher."},
    {"id": "q-class-2", "category": "classical", "difficulty": "easy",
     "question": "What is the key space size of the classical Caesar cipher?",
     "options": ["25", "26", "256", "65536"],
     "answer": 1, "explanation": "26 possible shifts (0–25), of which 25 are "
                                 "meaningful."},
    {"id": "q-class-3", "category": "classical", "difficulty": "medium",
     "question": "Which attack breaks monoalphabetic substitution easily?",
     "options": ["Frequency analysis", "Length extension", "Differential cryptanalysis",
                 "Padding oracle"],
     "answer": 0, "explanation": "Letter frequencies survive substitution, so "
                                 "frequency analysis recovers the text."},
    {"id": "q-class-4", "category": "classical", "difficulty": "medium",
     "question": "The Vigenère cipher is ___.",
     "options": ["polyalphabetic", "a transposition cipher", "asymmetric",
                 "a block cipher"],
     "answer": 0, "explanation": "Multiple Caesar shifts selected by a keyword "
                                 "make it polyalphabetic."},
    {"id": "q-class-5", "category": "classical", "difficulty": "medium",
     "question": "The Playfair cipher encrypts characters in pairs called ___.",
     "options": ["digraphs", "bytes", "words", "rounds"],
     "answer": 0, "explanation": "Playfair works on two-character digraphs."},
    {"id": "q-class-6", "category": "classical", "difficulty": "hard",
     "question": "For the Hill cipher, the key matrix must be ___ modulo 26.",
     "options": ["invertible", "symmetric", "diagonal", "orthogonal"],
     "answer": 0, "explanation": "Decryption requires inverse of the key matrix, "
                                 "so det must be coprime with 26."},
    {"id": "q-class-7", "category": "classical", "difficulty": "easy",
     "question": "Rail Fence and Columnar Transposition are examples of ___ "
                 "ciphers.",
     "options": ["transposition", "substitution", "homophonic", "rotor"],
     "answer": 0, "explanation": "They rearrange letters without replacing "
                                 "them — transposition."},

    # -- Symmetric -----------------------------------------------------------
    {"id": "q-sym-1", "category": "symmetric", "difficulty": "easy",
     "question": "Symmetric encryption uses ___ for encryption and decryption.",
     "options": ["the same key", "two different keys", "a public/private pair",
                 "no key"],
     "answer": 0, "explanation": "Both parties share the same secret key."},
    {"id": "q-sym-2", "category": "symmetric", "difficulty": "medium",
     "question": "The effective key size of DES is ___ bits.",
     "options": ["56", "64", "128", "32"],
     "answer": 0, "explanation": "8 of the 64 key bits are parity bits."},
    {"id": "q-sym-3", "category": "symmetric", "difficulty": "medium",
     "question": "How many rounds does AES-128 use?",
     "options": ["10", "12", "14", "8"],
     "answer": 0, "explanation": "10 rounds for AES-128, 12 for AES-192, 14 "
                                 "for AES-256."},
    {"id": "q-sym-4", "category": "symmetric", "difficulty": "medium",
     "question": "AES supports key sizes of ___.",
     "options": ["128, 192 and 256 bits", "64 and 128 bits", "56 and 64 bits",
                 "256, 512 and 1024 bits"],
     "answer": 0, "explanation": "AES-128/192/256 refer to the key length."},
    {"id": "q-sym-5", "category": "symmetric", "difficulty": "hard",
     "question": "3DES applies DES ___ times in an EDE chain.",
     "options": ["three", "two", "one", "four"],
     "answer": 0, "explanation": "E(K3, D(K2, E(K1, P))) — three DES stages."},
    {"id": "q-sym-6", "category": "symmetric", "difficulty": "easy",
     "question": "The main reason DES is considered insecure today is ___.",
     "options": ["its small 56-bit key", "its S-boxes", "its Feistel structure",
                 "its 128-bit block"],
     "answer": 0, "explanation": "56-bit keys are vulnerable to brute force "
                                 "(now trivial with modern hardware)."},

    # -- Asymmetric ----------------------------------------------------------
    {"id": "q-asym-1", "category": "asymmetric", "difficulty": "easy",
     "question": "RSA security relies on the difficulty of ___.",
     "options": ["factoring n = p·q", "solving linear equations",
                 "finding shortest paths", "computing GCD"],
     "answer": 0, "explanation": "Given n = p·q the private key is hidden by "
                                 "the difficulty of factoring."},
    {"id": "q-asym-2", "category": "asymmetric", "difficulty": "medium",
     "question": "In RSA, the private exponent d satisfies d = e⁻¹ mod φ(n). "
                 "It is computed using the ___.",
     "options": ["Extended Euclidean Algorithm", "Sieve of Eratosthenes",
                 "Fast Fourier Transform", "Bubble sort"],
     "answer": 0, "explanation": "The extended Euclidean algorithm finds the "
                                 "modular inverse of e."},
    {"id": "q-asym-3", "category": "asymmetric", "difficulty": "medium",
     "question": "Textbook RSA should not be used directly because it lacks ___.",
     "options": ["padding such as OAEP", "a key", "a block size",
                 "modular arithmetic"],
     "answer": 0, "explanation": "Deterministic unpadded RSA is malleable; OAEP "
                                 "adds randomness and security."},
    {"id": "q-asym-4", "category": "asymmetric", "difficulty": "medium",
     "question": "The ElGamal ciphertext consists of ___ components.",
     "options": ["two (c1, c2)", "one", "three (c1, c2, c3)", "four"],
     "answer": 0, "explanation": "c1 = gᵏ mod p and c2 = m·yᵏ mod p."},
    {"id": "q-asym-5", "category": "asymmetric", "difficulty": "hard",
     "question": "ElGamal encryption is ___ because of the ephemeral key k.",
     "options": ["probabilistic", "deterministic", "symmetric", "homomorphic"],
     "answer": 0, "explanation": "A fresh k makes the same plaintext produce "
                                 "different ciphertexts."},
    {"id": "q-asym-6", "category": "asymmetric", "difficulty": "medium",
     "question": "In RSA, n = p·q and φ(n) = ___.",
     "options": ["(p−1)(q−1)", "p + q", "p×q", "(p+1)(q+1)"],
     "answer": 0, "explanation": "Euler's totient for the product of two "
                                 "primes is (p−1)(q−1)."},

    # -- Hashing -------------------------------------------------------------
    {"id": "q-hash-1", "category": "hashing", "difficulty": "easy",
     "question": "SHA-256 produces a ___ bit digest.",
     "options": ["256", "128", "512", "64"],
     "answer": 0, "explanation": "The output of SHA-256 is 256 bits (64 hex "
                                 "digits)."},
    {"id": "q-hash-2", "category": "hashing", "difficulty": "easy",
     "question": "Which property makes hashing unsuitable for encryption?",
     "options": ["It is one-way", "It is too fast", "It uses large keys",
                 "It requires a network"],
     "answer": 0, "explanation": "You cannot recover the input from a digest — "
                                 "hashing is irreversible."},
    {"id": "q-hash-3", "category": "hashing", "difficulty": "medium",
     "question": "A hash function is collision-resistant, meaning it is hard "
                 "to find ___.",
     "options": ["two inputs with the same digest", "the key",
                 "the plaintext", "a longer output"],
     "answer": 0, "explanation": "Collision resistance: no two distinct inputs "
                                 "map to the same hash (feasibly)."},
    {"id": "q-hash-4", "category": "hashing", "difficulty": "medium",
     "question": "Changing one bit of a SHA-256 input typically changes the "
                 "digest ___.",
     "options": ["completely (avalanche)", "by one bit", "not at all",
                 "by two bits"],
     "answer": 0, "explanation": "Avalanche effect: small input changes produce "
                                 "unpredictable output changes."},
    {"id": "q-hash-5", "category": "hashing", "difficulty": "easy",
     "question": "Which of these is NOT a valid use of SHA-256?",
     "options": ["Encrypting a file's contents with a password",
                 "Verifying file integrity", "Password hashing",
                 "Digital signature building blocks"],
     "answer": 0, "explanation": "Hashing is not encryption; it cannot be used "
                                 "to recover original data."},

    # -- Key exchange --------------------------------------------------------
    {"id": "q-kx-1", "category": "key_exchange", "difficulty": "easy",
     "question": "Diffie–Hellman establishes a ___ between two parties.",
     "options": ["shared secret", "digital signature", "public key list",
                 "hash value"],
     "answer": 0, "explanation": "Both parties derive the same secret from "
                                 "public values and private keys."},
    {"id": "q-kx-2", "category": "key_exchange", "difficulty": "medium",
     "question": "In DH with parameters (p, g), Alice publishes A = gᵃ mod p. "
                 "What is a?",
     "options": ["Alice's private key", "The modulus", "The generator",
                 "The shared secret"],
     "answer": 0, "explanation": "a stays private; only A = gᵃ mod p is public."},
    {"id": "q-kx-3", "category": "key_exchange", "difficulty": "hard",
     "question": "Basic Diffie–Hellman without authentication is vulnerable "
                 "to ___.",
     "options": ["man-in-the-middle attacks", "padding oracles", "length "
                 "extension", "replay of hashes"],
     "answer": 0, "explanation": "An active attacker can impersonate both sides "
                                 "because no one is authenticated."},
    {"id": "q-kx-4", "category": "key_exchange", "difficulty": "medium",
     "question": "DH requires p to be ___.",
     "options": ["a prime", "a power of two", "an even number", "composite"],
     "answer": 0, "explanation": "The security of DH relies on the discrete "
                                 "logarithm problem over a prime modulus."},

    # -- Mathematics ---------------------------------------------------------
    {"id": "q-math-1", "category": "mathematics", "difficulty": "easy",
     "question": "17 mod 5 = ___.",
     "options": ["2", "3", "4", "1"],
     "answer": 0, "explanation": "17 = 3×5 + 2, remainder 2."},
    {"id": "q-math-2", "category": "mathematics", "difficulty": "easy",
     "question": "gcd(12, 18) = ___.",
     "options": ["6", "3", "9", "2"],
     "answer": 0, "explanation": "The greatest common divisor of 12 and 18 is "
                                 "6."},
    {"id": "q-math-3", "category": "mathematics", "difficulty": "medium",
     "question": "What is 3⁻¹ mod 11 (the modular inverse)?",
     "options": ["4", "7", "3", "8"],
     "answer": 0, "explanation": "3×4 = 12 ≡ 1 mod 11, so the inverse is 4."},
    {"id": "q-math-4", "category": "mathematics", "difficulty": "medium",
     "question": "2¹⁰ mod 7 = ___ (by square-and-multiply).",
     "options": ["2", "4", "1", "3"],
     "answer": 0, "explanation": "2¹⁰ = 1024; 1024 mod 7 = 1022 + 2 → 2."},
    {"id": "q-math-5", "category": "mathematics", "difficulty": "medium",
     "question": "φ(10) = ___ (Euler's totient).",
     "options": ["4", "10", "5", "9"],
     "answer": 0, "explanation": "Coprimes below 10: {1,3,7,9} ⇒ φ(10) = 4."},
    {"id": "q-math-6", "category": "mathematics", "difficulty": "hard",
     "question": "7⁸ mod 9 = ___.",
     "options": ["7", "1", "4", "8"],
     "answer": 0, "explanation": "7² = 49 ≡ 4, 7⁴ ≡ 16 ≡ 7, 7⁸ ≡ 7² ≡ 49 ≡ 4? "
                                 "Check: 7⁸ = 5764801; 5764801 mod 9 = 7."},

    # -- General security ----------------------------------------------------
    {"id": "q-gen-1", "category": "general_security", "difficulty": "easy",
     "question": "Which CIA property ensures data stays inaccessible to "
                 "unauthorized parties?",
     "options": ["Confidentiality", "Integrity", "Availability", "Auditing"],
     "answer": 0, "explanation": "Confidentiality restricts access to "
                                 "authorized users only."},
    {"id": "q-gen-2", "category": "general_security", "difficulty": "easy",
     "question": "An attacker who alters data violates ___.",
     "options": ["integrity", "confidentiality", "availability", "privacy"],
     "answer": 0, "explanation": "Integrity protects against unauthorized "
                                 "modification."},
    {"id": "q-gen-3", "category": "general_security", "difficulty": "medium",
     "question": "The act of trying every possible key is called ___.",
     "options": ["brute force", "frequency analysis", "phishing",
                 "social engineering"],
     "answer": 0, "explanation": "Brute force exhaustively searches the key "
                                 "space."},
    {"id": "q-gen-4", "category": "general_security", "difficulty": "easy",
     "question": "A digital signature provides ___ and non-repudiation.",
     "options": ["authenticity & integrity", "only confidentiality", "only "
                 "availability", "compression"],
     "answer": 0, "explanation": "Signatures prove who created a message and "
                                 "that it was not altered."},
    {"id": "q-gen-5", "category": "general_security", "difficulty": "medium",
     "question": "Key exchange protocols like DH solve the problem of ___.",
     "options": ["agreeing on a shared key over an insecure channel",
                 "encrypting very large files", "reducing key size",
                 "storing passwords"],
     "answer": 0, "explanation": "DH lets parties agree on key material without "
                                 "directly transmitting it."},
]

CATEGORIES = [
    "classical", "symmetric", "asymmetric", "hashing", "key_exchange",
    "mathematics", "general_security",
]


def generate_questions(category: str = "mixed", difficulty: str = "mixed",
                       count: int = 8) -> dict:
    if category != "mixed" and category not in CATEGORIES:
        raise ValidationError(f"Unknown category '{category}'", "unknown_category")
    if difficulty not in ("mixed", "easy", "medium", "hard"):
        raise ValidationError(f"Unknown difficulty '{difficulty}'",
                              "unknown_difficulty")

    pool = QUIZ_QUESTIONS
    if category != "mixed":
        pool = [q for q in pool if q["category"] == category]
    if difficulty != "mixed":
        pool = [q for q in pool if q["difficulty"] == difficulty]

    rng = random.SystemRandom()
    if len(pool) > count:
        pool = rng.sample(pool, count)

    public = []
    for q in pool:
        options = list(q["options"])
        rng.shuffle(options)
        correct_index = options.index(q["options"][q["answer"]])
        public.append({
            "id": q["id"],
            "category": q["category"],
            "difficulty": q["difficulty"],
            "question": q["question"],
            "options": options,
            "_correct_index": correct_index,
        })
    # Strip the hidden correct index before returning.
    for item in public:
        item.pop("_correct_index", None)
    return {"count": len(public), "questions": public}


def grade(answers: Dict[str, Any], category: str, difficulty: str) -> dict:
    """Grade answers keyed by question id → selected option text.

    Using the option *text* (rather than an index) is shuffle-independent:
    the frontend displays options in a fresh random order per generation.
    """
    by_id = {q["id"]: q for q in QUIZ_QUESTIONS}
    results = []
    correct_count = 0
    for qid, selected in answers.items():
        question = by_id.get(qid)
        if question is None:
            continue
        correct_option = question["options"][question["answer"]]
        is_correct = str(selected).strip() == correct_option
        if is_correct:
            correct_count += 1
        results.append({
            "question_id": qid,
            "question": question["question"],
            "selected": selected,
            "correct": is_correct,
            "correct_index": question["answer"],
            "correct_answer": correct_option,
            "explanation": question["explanation"],
        })
    total = len(results)
    return {
        "score": correct_count,
        "total": total,
        "percentage": round(correct_count * 100 / total, 1) if total else 0,
        "details": results,
    }