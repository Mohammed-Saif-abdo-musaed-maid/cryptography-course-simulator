"""Number-theoretic utilities shared by the cryptographic algorithms.

Every function is implemented directly (no opaque library calls) so that
students can follow each mathematical step.
"""

from __future__ import annotations

from math import isqrt
from typing import List, Tuple


def mod(a: int, m: int) -> int:
    """True modulo (result in [0, m-1]) for possibly-negative a."""
    if m <= 0:
        raise ValueError("modulus must be positive")
    return a % m


def extended_gcd(a: int, b: int) -> Tuple[int, int, int]:
    """Return (g, x, y) with g = gcd(a, b) = a*x + b*y.

    Uses the iterative Extended Euclidean Algorithm with explicit steps
    returned separately by :func:`extended_gcd_steps`.
    """
    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1

    while r != 0:
        q = old_r // r
        old_r, r = r, old_r - q * r
        old_s, s = s, old_s - q * s
        old_t, t = t, old_t - q * t

    # Normalise sign of g to be positive.
    if old_r < 0:
        old_r, old_s, old_t = -old_r, -old_s, -old_t
    return old_r, old_s, old_t


def extended_gcd_steps(a: int, b: int) -> List[dict]:
    """Record every quotient/remainder step of the Extended Euclid Algorithm."""
    steps: List[dict] = []
    if b == 0:
        return steps

    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1
    step_no = 1

    while r != 0:
        q = old_r // r
        steps.append(
            {
                "step": step_no,
                "dividend": old_r,
                "divisor": r,
                "quotient": q,
                "remainder": old_r - q * r,
                "factor_r": old_s,
                "factor_s": s,
                "note": f"{old_r} = {q} × {r} + {old_r - q * r}",
            }
        )
        old_r, r = r, old_r - q * r
        old_s, s = s, old_s - q * s
        old_t, t = t, old_t - q * t
        step_no += 1
    return steps


def gcd(a: int, b: int) -> int:
    """Greatest common divisor (always non-negative)."""
    a, b = abs(a), abs(b)
    while b:
        a, b = b, a % b
    return a


def is_prime(n: int) -> bool:
    """Deterministic trial-division primality test for small integers.

    Suitable for educational key sizes. For large production keys a
    probabilistic test would be required.
    """
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    if n % 3 == 0:
        return n == 3
    limit = isqrt(n)
    k = 5
    while k <= limit:
        if n % k == 0 or n % (k + 2) == 0:
            return False
        k += 6
    return True


def prime_factors(n: int) -> List[int]:
    """Return the distinct prime factors of n sorted ascending."""
    result: List[int] = []
    d = 2
    while d * d <= abs(n):
        if n % d == 0:
            result.append(d)
            while n % d == 0:
                n //= d
        d += 1 if d == 2 else 2
    if n > 1:
        result.append(abs(n))
    return result


def phi(n: int) -> int:
    """Euler's totient function φ(n) = count of coprimes to n below n."""
    if n == 1:
        return 1
    result = n
    for p in prime_factors(n):
        result -= result // p
    return result


def totient_steps(n: int) -> dict:
    """Educational breakdown of φ(n) via prime factorisation."""
    factors = prime_factors(n)
    result = n
    lines = []
    for p in factors:
        before = result
        result -= result // p
        lines.append(f"φ step: subtract n/p -> {before} - {before // p} = {result} (prime {p})")
    return {
        "value": n,
        "factors": factors,
        "result": result,
        "formula": "φ(n) = n ∏_{p|n} (1 - 1/p)",
        "lines": lines,
    }


def mod_inverse(a: int, m: int) -> int:
    """Multiplicative inverse of a modulo m, or raise ValueError."""
    a = mod(a, m)
    g, x, _ = extended_gcd(a, m)
    if g != 1:
        raise ValueError(f"{a} has no modular inverse modulo {m} (gcd = {g})")
    return mod(x, m)


def mod_inverse_steps(a: int, m: int) -> dict:
    """Educational version of :func:`mod_inverse` returning steps."""
    a0 = mod(a, m)
    g, x, y = extended_gcd(a0, m)
    if g != 1:
        raise ValueError(
            f"{a0} has no modular inverse modulo {m} (gcd({a0}, {m}) = {g})"
        )
    inverse = mod(x, m)
    return {
        "value": a,
        "modulus": m,
        "gcd": g,
        "bezout": {"x": x, "y": y},
        "equation": f"{a0}·({x}) + {m}·({y}) = {g}",
        "inverse": inverse,
        "check": f"{a0} × {inverse} ≡ {mod(a0 * inverse, m)} (mod {m})",
    }


def mod_pow(base: int, exponent: int, modulus: int) -> int:
    """Modular exponentiation (base**exponent mod modulus) via square-&-multiply."""
    base = mod(base, modulus)
    result = 1
    e = exponent
    while e > 0:
        if e & 1:
            result = (result * base) % modulus
        base = (base * base) % modulus
        e >>= 1
    return result


def mod_pow_steps(base: int, exponent: int, modulus: int) -> dict:
    """Educational square-and-multiply breakdown of :func:`mod_pow`."""
    b = mod(base, modulus)
    result = 1
    e = exponent
    bits = bin(e)[2:]
    rows = []
    for i, bit in enumerate(bits):
        before = result
        result = (result * result) % modulus
        if bit == "1":
            result = (result * b) % modulus
        rows.append(
            {
                "bit_index": len(bits) - 1 - i,
                "bit": bit,
                "square": f"{before}² mod {modulus} = {before * before % modulus}",
                "multiply": f"× {b}" if bit == "1" else "no multiply",
                "result": result,
            }
        )
    return {
        "base": base,
        "exponent": exponent,
        "modulus": modulus,
        "binary": bits,
        "steps": rows,
        "result": result,
        "check": f"{base}^{exponent} mod {modulus} = {result}",
    }


def bezout_steps(a: int, b: int) -> dict:
    """Full extended-Euclid educational result."""
    steps = extended_gcd_steps(a, b)
    g, x, y = extended_gcd(a, b)
    return {
        "a": a,
        "b": b,
        "steps": steps,
        "gcd": g,
        "x": x,
        "y": y,
        "identity": f"gcd({a}, {b}) = {a}·({x}) + {b}·({y}) = {g}",
    }