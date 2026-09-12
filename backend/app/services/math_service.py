"""Mathematical laboratory service.

Exposes the number-theoretic tools used across the course (modular
arithmetic, GCD, extended Euclid, modular inverse, primality, totient,
modular exponentiation) with step-by-step educational output.
"""

from __future__ import annotations

from typing import Any, Dict

from app.core.config import settings
from app.utils.errors import ValidationError
from app.utils import math_utils
from app.utils.steps import build_result, step


def _int(value: Any, label: str) -> int:
    try:
        result = int(value)
    except (TypeError, ValueError):
        raise ValidationError(f"{label} must be an integer", "invalid_input") from None
    return result


def _bounded(value: int, label: str) -> int:
    if abs(value) > settings.max_math_int:
        raise ValidationError(
            f"{label} is too large (limit {settings.max_math_int})", "invalid_input"
        )
    return value


def modular_arithmetic(a: Any, b: Any, modulus: Any) -> dict:
    ma = _bounded(_int(a, "a"), "a")
    mb = _bounded(_int(b, "b"), "b")
    m = _int(modulus, "modulus")
    if m <= 0:
        raise ValidationError("modulus must be positive", "invalid_input")
    results = {
        "a": ma, "b": mb, "modulus": m,
        "a_mod": ma % m, "b_mod": mb % m,
        "sum": (ma + mb) % m,
        "difference": (ma - mb) % m,
        "product": (ma * mb) % m,
        "congruent": (ma % m) == (mb % m),
    }
    steps = [
        step(1, "Reduce operands",
             "Compute a mod m and b mod m.",
             f"a = {ma}, b = {mb}, m = {m}",
             f"a mod m = {results['a_mod']}, b mod m = {results['b_mod']}",
             {"a_mod": results["a_mod"], "b_mod": results["b_mod"]}),
        step(2, "Arithmetic in Z/mZ",
             "Addition, subtraction and multiplication are reduced modulo m.",
             f"a = {ma}, b = {mb}", str(results),
             {"results": results}),
    ]
    return build_result("mathematics", "modular_arithmetic",
                        f"a={ma}, b={mb}, m={m}", {"a": ma, "b": mb, "m": m},
                        results, steps, {"results": results})


def gcd_tool(a: Any, b: Any) -> dict:
    ga = _bounded(_int(a, "a"), "a")
    gb = _bounded(_int(b, "b"), "b")
    result = math_utils.gcd(ga, gb)
    steps = [
        step(1, "Euclidean algorithm",
             "Repeatedly replace (a, b) with (b, a mod b) until b = 0.",
             f"a = {ga}, b = {gb}", f"gcd = {result}",
             {"steps": math_utils.extended_gcd_steps(ga, gb)}),
    ]
    return build_result("mathematics", "gcd", f"a={ga}, b={gb}",
                        {"a": ga, "b": gb}, result, steps,
                        {"result": result})


def extended_euclid(a: Any, b: Any) -> dict:
    ea = _bounded(_int(a, "a"), "a")
    eb = _bounded(_int(b, "b"), "b")
    info = math_utils.bezout_steps(ea, eb)
    steps = [
        step(1, "Run the extended algorithm",
             "Track coefficients (s, t) so that gcd(a, b) = a·s + b·t.",
             f"a = {ea}, b = {eb}",
             info["identity"],
             {"steps": info["steps"]}),
        step(2, "Bézout identity",
             "The final coefficients produce the result.",
             "", info["identity"], {"gcd": info["gcd"], "x": info["x"],
                                    "y": info["y"]}),
    ]
    return build_result("mathematics", "extended_euclid", f"a={ea}, b={eb}",
                        {"a": ea, "b": eb}, info["identity"], steps,
                        {"result": info})


def modular_inverse(a: Any, modulus: Any) -> dict:
    ia = _bounded(_int(a, "a"), "a")
    m = _bounded(_int(modulus, "modulus"), "modulus")
    if m <= 1:
        raise ValidationError("modulus must be > 1", "invalid_input")
    try:
        info = math_utils.mod_inverse_steps(ia, m)
    except ValueError as exc:
        raise ValidationError(str(exc), "no_inverse") from exc
    steps = [
        step(1, "Extended Euclidean Algorithm",
             "Find x, y with gcd(a, m) = a·x + m·y.",
             f"a = {ia}, m = {m}", info["equation"],
             {"steps": info}),
        step(2, "Inverse",
             "If gcd = 1, x mod m is the multiplicative inverse.",
             "", str(info["inverse"]), {"check": info["check"]}),
    ]
    return build_result("mathematics", "modular_inverse", f"a={ia}, m={m}",
                        {"a": ia, "m": m}, info["inverse"], steps,
                        {"result": info["inverse"], "info": info})


def prime_check(n: Any) -> dict:
    v = _bounded(_int(n, "n"), "n")
    is_prime = math_utils.is_prime(v)
    steps = [
        step(1, "Trial division",
             "Test divisibility by primes up to √n.",
             f"n = {v}", f"√n ≈ {int(v ** 0.5)}",
             {"trial_limit": int(v ** 0.5)}),
        step(2, "Conclusion",
             "", "", "prime" if is_prime else "composite",
             {"is_prime": is_prime, "factors": math_utils.prime_factors(v) if not is_prime and v > 1 else []}),
    ]
    return build_result("mathematics", "prime_check", str(v), {"n": v},
                        is_prime, steps,
                        {"is_prime": is_prime,
                         "factors": math_utils.prime_factors(v) if not is_prime and v > 1 else []})


def totient(n: Any) -> dict:
    v = _bounded(_int(n, "n"), "n")
    if v < 1:
        raise ValidationError("n must be ≥ 1", "invalid_input")
    info = math_utils.totient_steps(v)
    steps = [
        step(1, "Prime factorisation",
             f"n = {v} = {' × '.join(str(f) for f in info['factors'])}",
             str(v), " × ".join(str(f) for f in info["factors"]),
             {"factors": info["factors"]}),
        step(2, "Apply Euler's formula",
             info["formula"], "", str(info["result"]),
             {"lines": info["lines"]}),
    ]
    return build_result("mathematics", "totient", str(v), {"n": v},
                        info["result"], steps,
                        {"result": info["result"], "info": info})


def mod_pow_tool(base: Any, exponent: Any, modulus: Any) -> dict:
    b = _bounded(_int(base, "base"), "base")
    e = _int(exponent, "exponent")
    m = _bounded(_int(modulus, "modulus"), "modulus")
    if e < 0:
        raise ValidationError("exponent must be ≥ 0", "invalid_input")
    if m <= 1:
        raise ValidationError("modulus must be > 1", "invalid_input")
    info = math_utils.mod_pow_steps(b, e, m)
    steps = [
        step(1, "Square-and-multiply",
             "Process the binary representation of the exponent from the "
             "most significant bit.",
             f"base = {b}, exponent = {e}, modulus = {m}",
             f"binary = {info['binary']}",
             {"binary": info["binary"]}),
        step(2, "Iterate bits",
             "Square the running result every step; multiply by the base "
             "when the bit is 1.",
             info["binary"], str(info["result"]),
             {"rows": info["steps"]}),
    ]
    return build_result("mathematics", "mod_pow",
                        f"base={b}, exponent={e}, modulus={m}",
                        {"base": b, "exponent": e, "modulus": m},
                        info["result"], steps,
                        {"result": info["result"], "info": info})