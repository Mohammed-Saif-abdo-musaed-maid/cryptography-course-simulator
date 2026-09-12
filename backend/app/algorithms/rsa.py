"""Textbook RSA educational simulator.

Key generation: n = p·q, φ(n) = (p−1)(q−1), choose e coprime to φ(n),
d = e⁻¹ mod φ(n). Encryption: C = Mᵉ mod n. Decryption: M = Cᵈ mod n.

Educational only: textbook RSA (raw modular exponentiation) is NOT how
secure RSA is used. Production RSA requires padding such as OAEP and
properly large primes.
"""

from __future__ import annotations

from typing import List, Optional

from backend.app.utils.errors import MathDomainError, ValidationError
from backend.app.utils.math_utils import gcd, is_prime, mod_inverse, mod_inverse_steps, mod_pow, mod_pow_steps
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "rsa",
    "name": "RSA",
    "category": "asymmetric",
    "security_status": "secure_with_padding",
    "reversible": True,
    "key_kind": "two primes p, q and exponent e",
    "block_size": "< n (one block)",
    "description": (
        "The RSA public-key cryptosystem (Rivest–Shamir–Adleman). Security "
        "relies on the practical difficulty of factoring n = p·q. It enables "
        "encryption and digital signatures."
    ),
}

DEFAULT_E = 65537


def _validate_primes(p: int, q: int) -> None:
    if not isinstance(p, int) or not isinstance(q, int):
        raise ValidationError("p and q must be integers", "invalid_prime")
    if p < 2 or q < 2:
        raise ValidationError("p and q must be primes greater than 1", "invalid_prime")
    for name, value in (("p", p), ("q", q)):
        if not is_prime(value):
            raise ValidationError(f"{name} = {value} is not a prime number",
                                  "invalid_prime")
    if p == q:
        raise ValidationError("p and q must be distinct primes", "invalid_prime")


def _choose_exponent(phi_n: int, preferred_e: Optional[int]) -> tuple:
    candidates = (3, 5, 7, 11, 13, 17, 19, 23, 65537)
    e = preferred_e if preferred_e is not None else DEFAULT_E
    if not isinstance(e, int) or e <= 1:
        raise ValidationError("e must be an integer greater than 1", "invalid_exponent")
    if e >= phi_n:
        for candidate in candidates:
            if candidate < phi_n and gcd(candidate, phi_n) == 1:
                return candidate, (
                    f"preferred e = {e} ≥ φ(n) = {phi_n}; "
                    f"auto-selected e = {candidate}"
                )
        raise MathDomainError("Could not find an exponent coprime with φ(n)")
    if gcd(e, phi_n) != 1:
        # Fall back to the smallest suitable exponent, documenting the change.
        for candidate in candidates:
            if candidate < phi_n and gcd(candidate, phi_n) == 1:
                return candidate, (
                    f"gcd({e}, φ(n)) = {gcd(e, phi_n)} ≠ 1 and e not coprime; "
                    f"tried e = {candidate}"
                )
        raise MathDomainError("Could not find an exponent coprime with φ(n)")
    return e, ""


def _keygen_steps(p: int, q: int, e_choice: Optional[int]) -> dict:
    n = p * q
    phi_n = (p - 1) * (q - 1)
    e, e_note = _choose_exponent(phi_n, e_choice)
    inverse_info = mod_inverse_steps(e, phi_n)
    d = inverse_info["inverse"]
    return {
        "n": n, "phi": phi_n, "e": e, "d": d, "e_note": e_note,
        "inverse_info": inverse_info,
    }


def generate_keys(p: int, q: int, e_choice: Optional[int] = None) -> dict:
    _validate_primes(p, q)
    data = _keygen_steps(p, q, e_choice)
    return {
        "p": p, "q": q, "n": data["n"], "phi": data["phi"],
        "e": data["e"], "d": data["d"],
        "public_key": {"e": data["e"], "n": data["n"]},
        "private_key": {"d": data["d"], "n": data["n"]},
    }


def _message_block(message: str, n: int) -> int:
    """Convert text to an integer block. Letters A–Z map to values below n."""
    if not message or not message.strip():
        raise ValidationError("Message must not be empty", "empty_input")
    msg = "".join(c for c in message.upper() if c.isalpha())
    if not msg:
        raise ValidationError("Message must contain letters", "invalid_message")

    # Convert letters to a base-26 integer M.
    m = 0
    bases = []
    for ch in msg:
        v = ord(ch) - ord("A") + 1  # A=1 … Z=26
        bases.append(v)
        m = m * 27 + v
    if m >= n:
        raise ValidationError(
            f"The numeric value of the message must be smaller than n = {n}. "
            "Use a shorter message.",
            "message_too_large",
        )
    return m, msg, bases


def encrypt(p: int, q: int, message: str,
            e_choice: Optional[int] = None) -> dict:
    _validate_primes(p, q)
    data = _keygen_steps(p, q, e_choice)
    n, e, d = data["n"], data["e"], data["d"]
    m, msg, bases = _message_block(message, n)

    pow_info = mod_pow_steps(m, e, n)
    c = pow_info["result"]

    steps = [
        step(1, "Compute n and φ(n)",
             "n = p × q and φ(n) = (p−1)(q−1).",
             f"p = {p}, q = {q}",
             f"n = {n}, φ(n) = {data['phi']}",
             {"n": n, "phi": data["phi"]}),
        step(2, "Choose public exponent e",
             "e must be coprime with φ(n), usually 65537.",
             f"φ(n) = {data['phi']}", f"e = {e}",
             {"e": e, "choosing_note": data["e_note"],
              "gcd_check": f"gcd({e}, {data['phi']}) = {gcd(e, data['phi'])}"}),
        step(3, "Message to integer",
             "Each letter is encoded A=1 … Z=26 and concatenated as a "
             f"base-27 integer; the result must be less than n = {n}.",
             message, f"M = {m}",
             {"encoding": [{"char": c, "value": v} for c, v in zip(msg, bases)],
              "M": m}),
        step(4, "Encrypt: C = Mᵉ mod n",
             "Modular exponentiation computes the ciphertext block.",
             f"M = {m}, e = {e}, n = {n}", f"C = {c}",
             {"pow": pow_info}),
    ]
    return build_result("rsa", "encrypt", message,
                        {"p": p, "q": q, "e": e}, str(c), steps,
                        {
                            "cipher": c, "public_key": {"e": e, "n": n},
                            "private_key": {"d": d, "n": n},
                            "M": m, "pow_details": pow_info,
                            "n": n, "phi": data["phi"],
                            "textbook_note": "Textbook RSA lacks padding — "
                                             "OAEP is required in practice.",
                        })


def decrypt(p: int, q: int, cipher: str,
            e_choice: Optional[int] = None) -> dict:
    _validate_primes(p, q)
    data = _keygen_steps(p, q, e_choice)
    n, e, d = data["n"], data["e"], data["d"]
    try:
        c = int(cipher)
    except ValueError as exc:
        raise ValidationError("Cipher must be an integer", "invalid_cipher") from exc
    if c < 0 or c >= n:
        raise ValidationError(f"Cipher must be in [0, n-1] = [0, {n - 1}]",
                              "invalid_cipher")

    pow_info = mod_pow_steps(c, d, n)
    m = pow_info["result"]

    # Convert back to text.
    msg = ""
    working = m
    if working == 0:
        msg = ""
    else:
        digits = []
        while working:
            working, rem = divmod(working, 27)
            if rem:
                digits.append(rem)
        for v in reversed(digits):
            msg += chr(ord("A") + v - 1) if 1 <= v <= 26 else "?"

    steps = [
        step(1, "Rebuild key material",
             "Recover n, φ(n), e, and compute d as the modular inverse of e "
             "modulo φ(n) via the Extended Euclidean Algorithm.",
             f"p = {p}, q = {q}, e = {e}",
             f"n = {n}, d = {d}",
             {"inverse_info": data["inverse_info"]}),
        step(2, "Decrypt: M = Cᵈ mod n",
             "Raise the ciphertext to the private exponent d modulo n.",
             f"C = {c}, d = {d}, n = {n}", f"M = {m}",
             {"pow": pow_info}),
        step(3, "Integer to message",
             "Convert the base-27 integer back into letters (A=1 … Z=26).",
             f"M = {m}", msg, {}),
    ]
    return build_result("rsa", "decrypt", cipher, {"p": p, "q": q, "e": e},
                        msg, steps,
                        {
                            "plaintext": msg, "public_key": {"e": e, "n": n},
                            "private_key": {"d": d, "n": n},
                            "pow_details": pow_info,
                        })


def get_metadata() -> dict:
    return METADATA


# ---------------------------------------------------------------------------
# Production RSA: OAEP (encryption) and PSS (signatures)
# These use the ``cryptography`` library for REAL operations (keygen 2048,
# OAEP with SHA-256, PSS with SHA-256). Textbook flow above stays untouched.
# ---------------------------------------------------------------------------

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa

from base64 import b64encode  # noqa: E402

SECRET_WARNING = (
    "تعليمية فقط: تُعرض المفاتيح السرية هنا لأغراض تعليمية فقط. "
    "Real RSA never exposes the private key."
)


def _serialize_private(priv) -> str:
    return priv.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode("ascii")


def _serialize_public(pub) -> str:
    return pub.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode("ascii")


def _new_key_pair(bits: int = 2048) -> tuple:
    priv = rsa.generate_private_key(public_exponent=65537, key_size=bits)
    return priv, priv.public_key()


def _load_public(public_key_pem: Optional[str]) -> rsa.RSAPublicKey:
    if not public_key_pem:
        _, pub = _new_key_pair()
        return pub
    try:
        return serialization.load_pem_public_key(
            public_key_pem.encode("ascii"))
    except (ValueError, TypeError) as exc:
        raise ValidationError(
            "Public key must be a valid PEM-encoded RSA key",
            "invalid_public_key") from exc


def _load_private(private_key_pem: Optional[str]) -> rsa.RSAPrivateKey:
    if not private_key_pem:
        priv, _ = _new_key_pair()
        return priv
    try:
        return serialization.load_pem_private_key(
            private_key_pem.encode("ascii"), password=None)
    except (ValueError, TypeError) as exc:
        raise ValidationError(
            "Private key must be a valid PEM-encoded RSA key",
            "invalid_private_key") from exc


def encrypt_oaep(message: str, public_key_pem: Optional[str] = None) -> dict:
    """Encrypt a message with RSA-OAEP (SHA-256).

    A fresh 2048-bit key pair is generated unless a public key is provided.
    The private key in the output is for teaching only.
    """
    if not message:
        raise ValidationError("Message must not be empty", "empty_input")

    if not public_key_pem:
        priv, pub = _new_key_pair()
        priv_pem = _serialize_private(priv)
    else:
        pub = _load_public(public_key_pem)
        priv = None
        priv_pem = None

    ct = pub.encrypt(
        message.encode("utf-8"),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )

    steps = [
        step(1, "Prepare the RSA public key",
             "The recipient's public key (e, n) is loaded. REAL RSA uses "
             "2048-bit moduli — far beyond teaching sizes.",
             public_key_pem or "auto-generated 2048-bit key",
             f"n bits = {pub.key_size}",
             {"key_size": pub.key_size}),
        step(2, "Apply OAEP padding",
             "Optimal Asymmetric Encryption Padding adds randomized padding "
             "(via MGF1 at SHA-256) so the same message encrypts to different "
             "ciphertexts every time. OAEP also detects tampering on "
             "decryption.",
             f"{len(message)} UTF-8 bytes", "k bytes padded",
             {"hash": "SHA-256", "mgf": "MGF1-SHA256"}),
        step(3, "Encrypt: C = mᵉ mod n",
             "The padded message is raised to the public exponent e modulo n.",
             "", ct.hex(),
             {"ciphertext_hex": ct.hex(),
              "ciphertext_base64": b64encode(ct).decode("ascii")}),
    ]

    return build_result("rsa", "encrypt_oaep", message, {}, ct.hex(), steps, {
        "ciphertext_hex": ct.hex(),
        "ciphertext_base64": b64encode(ct).decode("ascii"),
        "ciphertext_bytes": len(ct),
        "public_key_pem": _serialize_public(pub),
        "private_key_pem": priv_pem,
        "key_size": pub.key_size,
        "padding": "OAEP / MGF1-SHA256 / SHA-256",
        "security_warning": SECRET_WARNING,
        "note": ("If no public key was provided, a fresh pair was generated "
                 "and its private key is shown here for teaching only. In "
                 "practice the sender NEVER sees the private key."),
    })


def decrypt_oaep(ciphertext: str, private_key_pem: str) -> dict:
    """Decrypt RSA-OAEP ciphertext. Fails cleanly on tampering."""
    if not private_key_pem:
        raise ValidationError("Private key (PEM) is required", "missing_private_key")
    try:
        ct = bytes.fromhex(ciphertext)
    except ValueError as exc:
        raise ValidationError("Ciphertext must be valid hexadecimal",
                              "invalid_hex") from exc
    priv = _load_private(private_key_pem)
    try:
        pt = priv.decrypt(
            ct,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None,
            ),
        )
    except ValueError as exc:
        raise ValidationError(
            "Decryption failed — ciphertext was modified or the key is "
            "wrong (OAEP integrity check).",
            "decryption_failed") from exc

    plaintext = pt.decode("utf-8", errors="replace")
    steps = [
        step(1, "Load the private key",
             "The private exponent d is loaded from the PEM key.",
             "", f"{priv.key_size}-bit RSA key",
             {"key_size": priv.key_size}),
        step(2, "Decrypt: m = Cᵈ mod n",
             "Raise the ciphertext to d modulo n to recover the OAEP block.",
             f"{len(ct)} ciphertext bytes", f"{len(pt)} plaintext bytes",
             {"cipher_ok": True}),
        step(3, "Verify OAEP padding",
             "OAEP's structure check detects any tampering or key mismatch, "
             "failing the operation instead of returning garbage.",
             "", "integrity OK",
             {"padding_valid": True}),
    ]
    return build_result("rsa", "decrypt_oaep", "", {"has_key": True},
                        plaintext, steps, {
                            "plaintext": plaintext,
                            "key_size": priv.key_size,
                            "padding": "OAEP / MGF1-SHA256 / SHA-256",
                        })


def sign_pss(message: str, private_key_pem: Optional[str] = None) -> dict:
    """Sign a message with RSA-PSS (SHA-256)."""
    if not message:
        raise ValidationError("Message must not be empty", "empty_input")
    if not private_key_pem:
        priv, pub = _new_key_pair()
    else:
        priv = _load_private(private_key_pem)
        pub = priv.public_key()

    sig = priv.sign(
        message.encode("utf-8"),
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH,
        ),
        hashes.SHA256(),
    )
    public_hex = pub.public_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).hex()

    steps = [
        step(1, "Prepare the signing key",
             "The private key (d, n) signs; the public key (e, n) verifies.",
             f"{priv.key_size}-bit RSA key", _serialize_public(pub),
             {"key_size": priv.key_size}),
        step(2, "Hash and pad the message with PSS",
             "RSA-PSS (Probabilistic Signature Scheme) hashes the message "
             "with SHA-256 and randomizes the padding with MGF1, making "
             "signatures non-deterministic.",
             message, "PSS / MGF1-SHA256 block",
             {"hash": "SHA-256", "salt_length": "MAX_LENGTH"}),
        step(3, "Produce the signature",
             "Signing computes S = h(m)ᵈ mod n over the encoded message.",
             "", sig.hex(),
             {"signature_hex": sig.hex(),
              "signature_base64": b64encode(sig).decode("ascii")}),
    ]
    return build_result("rsa", "sign_pss", message, {}, sig.hex(), steps, {
        "signature_hex": sig.hex(),
        "signature_base64": b64encode(sig).decode("ascii"),
        "signature_bytes": len(sig),
        "public_key_pem": _serialize_public(pub),
        "public_key_der_hex": public_hex,
        "private_key_pem": _serialize_private(priv),
        "key_size": priv.key_size,
        "hash": "SHA-256",
        "padding": "PSS / MGF1-SHA256 / MAX_LENGTH",
        "security_warning": SECRET_WARNING,
        "signature_note": (
            "RSA-PSS signs (authenticates) — it does NOT encrypt the "
            "message. Verify with the matching public key."
        ),
    })


def verify_pss(message: str, signature_hex: str, public_key_pem: str) -> dict:
    """Verify an RSA-PSS signature and report VALID / INVALID."""
    if not signature_hex:
        raise ValidationError("Signature is required", "missing_signature")
    if not public_key_pem:
        raise ValidationError("Public key (PEM) is required", "missing_public_key")
    try:
        sig = bytes.fromhex(signature_hex)
    except ValueError as exc:
        raise ValidationError("Signature must be valid hexadecimal",
                              "invalid_hex") from exc
    pub = _load_public(public_key_pem)
    try:
        pub.verify(
            sig,
            message.encode("utf-8"),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH,
            ),
            hashes.SHA256(),
        )
        valid = True
    except InvalidSignature:
        valid = False

    return build_result("rsa", "verify_pss", message, {}, valid, [], {
        "valid": valid,
        "result": "VALID" if valid else "INVALID",
        "key_size": pub.key_size,
        "hash": "SHA-256",
        "signature_note": (
            "If the message, signature or public key was altered, verification "
            "fails."
        ),
    })


def get_metadata() -> dict:
    return METADATA
