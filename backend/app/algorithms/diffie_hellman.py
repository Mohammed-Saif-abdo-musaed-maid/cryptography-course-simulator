"""Diffie–Hellman key exchange educational simulator.

    A = gᵃ mod p     (Alice's public value)
    B = gᵇ mod p     (Bob's public value)
    s = Bᵃ mod p = Aᵇ mod p    (shared secret)

Both parties derive the SAME shared secret even though only public values
cross the network. Basic DH does not authenticate participants and is thus
vulnerable to man-in-the-middle attacks without an authenticated channel.
"""

from __future__ import annotations

from typing import Optional

from backend.app.utils.errors import MathDomainError, ValidationError
from backend.app.utils.math_utils import is_prime, mod_pow, mod_pow_steps
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "diffie_hellman",
    "name": "Diffie–Hellman",
    "category": "key_exchange",
    "security_status": "secure_with_auth",
    "reversible": False,
    "key_kind": "prime p, generator g, two private keys",
    "block_size": "—",
    "description": (
        "A key-exchange protocol that lets two parties agree on a shared "
        "secret over an insecure channel. It does NOT encrypt data by "
        "itself; the resulting shared secret typically seeds symmetric key "
        "material. Requires authentication to prevent man-in-the-middle "
        "attacks."
    ),
}


def _validate(p: int, g: int, a: int, b: int) -> None:
    for name, value, lo in (("p", p, 2), ("g", g, 2), ("a", a, 1), ("b", b, 1)):
        if not isinstance(value, int):
            raise ValidationError(f"{name} must be an integer", "invalid_parameter")
        if value < lo:
            raise ValidationError(f"{name} must be ≥ {lo}", "invalid_parameter")
    if not is_prime(p):
        raise MathDomainError(f"p = {p} is not a prime number", "not_prime")
    if not 2 <= g <= p - 1:
        raise ValidationError("g must satisfy 2 ≤ g ≤ p − 1", "invalid_generator")
    if a >= p - 1 or b >= p - 1:
        raise ValidationError("Private keys must satisfy 1 ≤ value ≤ p − 2",
                              "invalid_private_key")


def exchange(p: int, g: int, a_private: int, b_private: int) -> dict:
    _validate(p, g, a_private, b_private)

    A = mod_pow(g, a_private, p)
    B = mod_pow(g, b_private, p)
    s_alice = mod_pow(B, a_private, p)
    s_bob = mod_pow(A, b_private, p)

    steps = [
        step(1, "Public parameters",
             "Both parties agree on a large prime p and a generator g.",
             f"p = {p}, g = {g}", f"(p, g) = ({p}, {g})",
             {"p": p, "g": g, "prime_check": is_prime(p)}),
        step(2, "Alice computes her public value",
             "A = gᵃ mod p using her private key a.",
             f"a = {a_private}", f"A = {A}",
             {"pow": mod_pow_steps(g, a_private, p)}),
        step(3, "Bob computes his public value",
             "B = gᵇ mod p using his private key b.",
             f"b = {b_private}", f"B = {B}",
             {"pow": mod_pow_steps(g, b_private, p)}),
        step(4, "Public exchange",
             "Alice sends A to Bob; Bob sends B to Alice. Eavesdroppers see "
             "only A and B.",
             f"A = {A}, B = {B}", "network",
             {"A": A, "B": B}),
        step(5, "Alice derives the shared secret",
             "s = Bᵃ mod p.",
             f"B = {B}, a = {a_private}", f"s = {s_alice}",
             {"pow": mod_pow_steps(B, a_private, p)}),
        step(6, "Bob derives the shared secret",
             "s = Aᵇ mod p.",
             f"A = {A}, b = {b_private}", f"s = {s_bob}",
             {"pow": mod_pow_steps(A, b_private, p)}),
    ]
    assert s_alice == s_bob
    return build_result(
        "diffie_hellman", "exchange", f"a={a_private}, b={b_private}",
        {"p": p, "g": g, "a": a_private, "b": b_private}, s_alice, steps,
        {
            "shared_secret": s_alice,
            "shared_secret_match": True,
            "alice": {"private_key": a_private, "public_value": A},
            "bob": {"private_key": b_private, "public_value": B},
            "p": p, "g": g,
            "security_note": (
                "Basic Diffie–Hellman does not authenticate participants and "
                "is vulnerable to man-in-the-middle attacks. Authentication "
                "(e.g. signatures) must be layered on top."
            ),
        },
    )


def get_metadata() -> dict:
    return METADATA
