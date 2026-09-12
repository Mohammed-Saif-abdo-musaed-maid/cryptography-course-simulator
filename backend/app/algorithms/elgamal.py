"""ElGamal encryption educational simulator.

Key generation:  y = gˣ mod p       (public key y, private key x)
Encryption:       c1 = gᵏ mod p,  c2 = m·yᵏ mod p
Decryption:       m = c2 · c1⁻ˣ mod p

Uses small educational parameters and explains each calculation.
"""

from __future__ import annotations

from typing import Optional

from app.utils.errors import MathDomainError, ValidationError
from app.utils.math_utils import is_prime, mod_inverse, mod_pow, mod_pow_steps
from app.utils.steps import build_result, step

METADATA = {
    "id": "elgamal",
    "name": "ElGamal",
    "category": "asymmetric",
    "security_status": "secure_with_padding",
    "reversible": True,
    "key_kind": "prime p, generator g, private key x, ephemeral k",
    "block_size": "message integer < p",
    "description": (
        "An asymmetric encryption scheme whose security rests on the "
        "Diffie–Hellman problem. Encryption is randomized through an "
        "ephemeral key k, so the same message gives different ciphertexts "
        "each time."
    ),
}


def _validate(p: int, g: int, x: int) -> None:
    if not isinstance(p, int) or not isinstance(g, int) or not isinstance(x, int):
        raise ValidationError("p, g, x must be integers", "invalid_parameter")
    if p < 2 or not is_prime(p):
        raise MathDomainError(f"p = {p} is not a prime number", "not_prime")
    if not 2 <= g <= p - 1:
        raise ValidationError("g must satisfy 2 ≤ g ≤ p − 1", "invalid_generator")
    if not 1 <= x <= p - 2:
        raise ValidationError("Private key x must satisfy 1 ≤ x ≤ p − 2",
                              "invalid_private_key")


def generate_keys(p: int, g: int, x: int) -> dict:
    """Generate the ElGamal key pair. Used by the UI's 'derive keys' flow."""
    _validate(p, g, x)
    y = mod_pow(g, x, p)
    return {
        "p": p, "g": g, "x": x, "y": y,
        "public_key": {"p": p, "g": g, "y": y},
        "private_key": {"p": p, "x": x},
        "formula": "y = gˣ mod p",
    }


def _message_int(message: str, p: int) -> tuple:
    if not message or not message.strip():
        raise ValidationError("Message must not be empty", "empty_input")
    digits = []
    for ch in message:
        if ch.isdigit():
            digits.append(ch)
    if message.strip().isdigit():
        m = int(message)
        if m <= 0 or m >= p:
            raise ValidationError(f"Message value must satisfy 1 ≤ m ≤ p−1 = {p - 1}",
                                  "message_out_of_range")
        return m, "numeric"
    # Map letters to integers 1..26.
    m = 0
    for ch in message.upper():
        if not ch.isalpha():
            continue
        m = m * 27 + (ord(ch) - ord("A") + 1)
    if m <= 0 or m >= p:
        raise ValidationError(
            f"Encoded message must satisfy 1 ≤ m ≤ p−1 = {p - 1}. Use a "
            "shorter message or larger p.",
            "message_out_of_range",
        )
    return m, "text"


def _message_to_text(m: int) -> str:
    if m == 0:
        return ""
    digits = []
    working = m
    while working:
        working, rem = divmod(working, 27)
        if rem:
            digits.append(rem)
    return "".join(chr(ord("A") + v - 1) if 1 <= v <= 26 else "?"
                   for v in reversed(digits))


def encrypt(p: int, g: int, x: int, message: str, k: Optional[int] = None) -> dict:
    _validate(p, g, x)
    y = mod_pow(g, x, p)
    m, m_kind = _message_int(message, p)

    if k is None:
        # Deterministic educational default: hidden but stable for a given x.
        k = (x * 7 + 3) % p
        if k <= 0:
            k = 1
        k_was_auto = True
    else:
        if not isinstance(k, int) or k <= 0 or k >= p:
            raise ValidationError(f"Ephemeral key k must satisfy 1 ≤ k ≤ p−1",
                                  "invalid_k")
        k_was_auto = False

    c1 = mod_pow(g, k, p)
    yk = mod_pow(y, k, p)
    c2 = (m * yk) % p

    steps = [
        step(1, "Derive public key",
             "y = gˣ mod p.",
             f"g = {g}, x = {x}, p = {p}", f"y = {y}",
             {"pow": mod_pow_steps(g, x, p)}),
        step(2, "Encode message",
             "The message becomes an integer m with 1 ≤ m < p.",
             message, f"m = {m}",
             {"encoding": "numeric" if m_kind == "numeric" else "text A=1…Z=26"}),
        step(3, "Pick ephemeral key k",
             "A fresh random value k (1 ≤ k ≤ p−1) randomizes the ciphertext.",
             "k = 'fresh random'", f"k = {k}" + (" (auto-selected)" if k_was_auto else ""),
             {"k": k, "auto": k_was_auto}),
        step(4, "Compute c1 = gᵏ mod p",
             "The first ciphertext component.",
             f"g = {g}, k = {k}, p = {p}", f"c1 = {c1}",
             {"pow": mod_pow_steps(g, k, p)}),
        step(5, "Compute masking factor yᵏ mod p",
             "The recipient's public key is raised to k.",
             f"y = {y}, k = {k}, p = {p}", f"yᵏ = {yk}",
             {"pow": mod_pow_steps(y, k, p)}),
        step(6, "Compute c2 = m·yᵏ mod p",
             "The second ciphertext component.",
             f"m = {m}, yᵏ = {yk}", f"c2 = {c2}", {}),
    ]
    return build_result("elgamal", "encrypt", message,
                        {"p": p, "g": g, "x": x, "k": k},
                        {"c1": c1, "c2": c2}, steps,
                        {
                            "public_key": {"p": p, "g": g, "y": y},
                            "private_key": {"p": p, "x": x},
                            "cipher": {"c1": c1, "c2": c2},
                            "steps_values": {
                                "y": y, "m": m, "k": k, "c1": c1,
                                "y_k": yk, "c2": c2,
                            },
                        })


def decrypt(p: int, g: int, x: int, c1: int, c2: int) -> dict:
    _validate(p, g, x)
    if not isinstance(c1, int) or not isinstance(c2, int):
        raise ValidationError("c1 and c2 must be integers", "invalid_cipher")
    if not (1 <= c1 <= p - 1 and 1 <= c2 <= p - 1):
        raise ValidationError(f"c1, c2 must satisfy 1 ≤ v ≤ p−1 = {p - 1}",
                              "invalid_cipher")

    c1_pow_x = mod_pow(c1, x, p)
    s = mod_inverse(c1_pow_x, p)
    m = (c2 * s) % p
    text = _message_to_text(m)

    steps = [
        step(1, "Shared masking factor",
             "Compute c1ˣ mod p where x is the private key.",
             f"c1 = {c1}, x = {x}, p = {p}", f"c1ˣ = {c1_pow_x}",
             {"pow": mod_pow_steps(c1, x, p)}),
        step(2, "Invert the masking factor",
             "s = (c1ˣ)⁻¹ mod p using the Extended Euclidean Algorithm.",
             f"c1ˣ = {c1_pow_x}", f"s = {s}",
             {"inverse_info": {"inverse": s, "value": c1_pow_x, "modulus": p}}),
        step(3, "Recover the message integer",
             "m = c2 · s mod p.",
             f"c2 = {c2}, s = {s}", f"m = {m}", {}),
        step(4, "Decode",
             "Convert the integer back to text (A=1 … Z=26).",
             f"m = {m}", text, {}),
    ]
    return build_result("elgamal", "decrypt", f"c1={c1}, c2={c2}",
                        {"p": p, "g": g, "x": x}, text, steps,
                        {
                            "plaintext": text,
                            "message_int": m,
                            "public_key": {"p": p, "g": g, "y": mod_pow(g, x, p)},
                            "private_key": {"p": p, "x": x},
                        })


def get_metadata() -> dict:
    return METADATA