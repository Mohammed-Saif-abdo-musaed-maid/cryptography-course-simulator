"""Export canonical backend results for the 3D audit harness.

This script is NOT part of the application runtime. It drives the exact same
dispatch the API uses (algorithm_service.execute) with a canonical set of
inputs+operations (mirroring the 2D demo inputs), runs backend-only round-trip
verifications, and writes a single JSON fixture file consumed by
frontend/scripts/audit/run.ts:

    frontend/tests/fixtures/audit.json

Run from the backend directory:

    .venv\\Scripts\\python.exe scripts\\export_audit_fixtures.py
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from backend.app.services.algorithm_service import execute  # noqa: E402

# Canonical requests (operation + inputs mirroring the frontend demo inputs).
CANONICAL: dict[str, dict] = {
    "caesar": {"operation": "encrypt", "inputs": {"text": "HELLO", "shift": 3}},
    "monoalphabetic": {"operation": "encrypt", "inputs": {
        "text": "HELLO", "substitution": "QAZWSXEDCRFVTGBYHNUJMIKOLP"}},
    "vigenere": {"operation": "encrypt", "inputs": {"text": "ATTACKATDAWN", "key": "LEMON"}},
    "playfair": {"operation": "encrypt", "inputs": {"text": "HELLOWORLD", "keyword": "MONARCHY"}},
    "hill": {"operation": "encrypt", "inputs": {"text": "HELP", "matrix": [[3, 3], [2, 5]]}},
    "rail_fence": {"operation": "encrypt", "inputs": {"text": "HELLOWORLD", "rails": 3}},
    "columnar": {"operation": "encrypt", "inputs": {"text": "HELLOWORLD", "key": "ZEBRA"}},
    "des": {"operation": "encrypt", "inputs": {
        "block": "0123456789ABCDEF", "key": "133457799BBCDFF1"}},
    "triple_des": {"operation": "encrypt", "inputs": {
        "block": "0123456789ABCDEF",
        "key": "133457799BBCDFF1133457799BBCDFF1133457799BBCDFF1"}},
    "aes": {"operation": "encrypt", "inputs": {
        "block": "00112233445566778899AABBCCDDEEFF",
        "key": "000102030405060708090A0B0C0D0E0F"}},
    "blowfish": {"operation": "encrypt", "inputs": {
        "block": "0123456789ABCDEF", "key": "0123456789ABCDEFFEDCBA9876543210"}},
    "twofish": {"operation": "encrypt", "inputs": {
        "block": "00000000000000000000000000000000",
        "key": "0123456789ABCDEFFEDCBA9876543210"}},
    "chacha20": {"operation": "encrypt", "inputs": {
        "message": "Hello, cryptography!",
        "key": "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F",
        "nonce": "000000000000004A00000000", "counter": 1}},
    "aes_gcm": {"operation": "encrypt", "inputs": {
        "plaintext": "Hello, cryptography!",
        "key_hex": "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F",
        "nonce_hex": "000000000000000000000000", "aad": ""}},
    "chacha20_poly1305": {"operation": "encrypt", "inputs": {
        "plaintext": "Hello, cryptography!",
        "key_hex": "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F",
        "nonce_hex": "000000000000000000000000", "aad": ""}},
    "sha256": {"operation": "hash", "inputs": {"message": "Hello, cryptography!"}},
    "sha512": {"operation": "hash", "inputs": {"message": "Hello, cryptography!"}},
    "sha1": {"operation": "hash", "inputs": {"message": "Hello, cryptography!"}},
    "md5": {"operation": "hash", "inputs": {"message": "Hello, cryptography!"}},
    "sha3": {"operation": "hash", "inputs": {"message": "Hello, cryptography!", "variant": "256"}},
    "blake2": {"operation": "hash", "inputs": {"message": "Hello, cryptography!", "variant": "512"}},
    "blake3": {"operation": "hash", "inputs": {"message": "Hello, cryptography!", "length": 32}},
    "hmac": {"operation": "sign", "inputs": {
        "message": "Important message", "key": "super-secret-key",
        "algorithm": "sha256", "output_format": "hex"}},
    "pbkdf2": {"operation": "derive", "inputs": {
        "password": "correct horse battery staple", "salt": "salty",
        "iterations": 1000, "key_length": 32, "algorithm": "sha256"}},
    "bcrypt": {"operation": "hash_password", "inputs": {"password": "hunter2", "rounds": 12}},
    "scrypt": {"operation": "derive", "inputs": {
        "password": "correct horse battery staple", "salt": "salty",
        "n": 16384, "r": 8, "p": 1, "key_length": 32, "algorithm": "sha256"}},
    "argon2": {"operation": "hash_password", "inputs": {
        "password": "secret", "time_cost": 3, "memory_cost": 65536,
        "parallelism": 4, "hash_length": 32, "variant": "argon2id"}},
    "hkdf": {"operation": "derive", "inputs": {
        "ikm": "shared secret", "salt": "salt", "info": "context",
        "length": 32, "algorithm": "sha256"}},
    "ecdh": {"operation": "exchange", "inputs": {"curve": "p256"}},
    "x25519": {"operation": "exchange", "inputs": {}},
    "ecdsa": {"operation": "sign", "inputs": {"message": "Message to sign", "curve": "p256"}},
    "ed25519": {"operation": "sign", "inputs": {"message": "Message to sign"}},
    "rsa": {"operation": "encrypt", "inputs": {"message": "H", "p": 61, "q": 53, "e": 65537}},
    "diffie_hellman": {"operation": "exchange", "inputs": {
        "p": 23, "g": 5, "a_private": 6, "b_private": 15}},
    "elgamal": {"operation": "encrypt", "inputs": {"message": "H", "p": 467, "g": 2, "x": 127}},
}

# Algorithms whose encrypt result can be fed back into decrypt/verify.
ROUNDTRIP_DECRYPT = {
    "caesar", "monoalphabetic", "vigenere", "playfair", "hill", "rail_fence",
    "columnar", "des", "triple_des", "aes", "blowfish", "twofish", "chacha20",
    "aes_gcm", "chacha20_poly1305", "rsa", "elgamal",
}


def norm(value: object) -> str:
    text = "" if value is None else str(value)
    return "".join(ch for ch in text.upper() if ch not in " -_")


def as_text(result: object) -> str:
    return "" if result is None else str(result)


def compact_hex(value: object) -> str:
    return "".join(ch for ch in str(value).upper() if ch in "0123456789ABCDEF")


def _rt_block_cipher(alg_id: str, inputs: dict, res: object) -> dict:
    """Ciphertext block round-trips back to the plaintext block."""
    cipher = compact_hex(res)
    out = execute(alg_id, "decrypt", {"block": cipher, "key": inputs["key"]})
    return {
        "checked": True,
        "ok": norm(out.get("result")) == norm(inputs["block"]),
        "note": "decrypt(encrypt(block)) == block",
    }


def _rt_classical(alg_id: str, inputs: dict, res: object) -> dict:
    cipher = as_text(res)
    if "text" not in inputs:
        return {"checked": False, "ok": False, "note": "no plaintext field to round-trip"}
    rev_inputs = {k: v for k, v in inputs.items() if k != "text"}
    rev_inputs["text"] = cipher
    out = execute(alg_id, "decrypt", rev_inputs)
    if alg_id == "playfair":
        # Playfair legitimately inserts filler (I/J merge, X padding); tolerate
        # an exact match after removing padding markers.
        padded = norm(out.get("result"))
        ok = padded == norm(inputs["text"]) or padded.replace("X", "") == norm(inputs["text"])
        note = "decrypt(encrypt(plaintext)) == plaintext (padding tolerated)"
    else:
        ok = norm(out.get("result")) == norm(inputs["text"])
        note = "decrypt(encrypt(plaintext)) == plaintext"
    return {"checked": True, "ok": ok, "note": note}


def _rt_chacha20(inputs: dict, res: object) -> dict:
    cipher = compact_hex(res)
    out = execute("chacha20", "decrypt", {
        "message": cipher, "key": inputs["key"],
        "nonce": inputs["nonce"], "counter": inputs["counter"]})
    return {
        "checked": True,
        "ok": norm(out.get("result")) == norm(inputs["message"]),
        "note": "decrypt(encrypt(message)) == message",
    }


def _rt_aead(alg_id: str, inputs: dict, res: object, extra: dict) -> dict:
    ct = (
        (extra.get("combined_hex") and compact_hex(extra["combined_hex"]))
        or (extra.get("ciphertext_hex") and compact_hex(extra["ciphertext_hex"]))
        or (isinstance(res, dict) and res.get("ciphertext") and compact_hex(res["ciphertext"]))
        or compact_hex(res)
    )
    if not ct:
        return {"checked": False, "ok": False, "note": "no ciphertext to round-trip"}
    out = execute(alg_id, "decrypt", {
        "ciphertext_hex": ct, "key_hex": inputs["key_hex"],
        "nonce_hex": inputs["nonce_hex"], "aad": inputs.get("aad", "")})
    return {
        "checked": True,
        "ok": norm(out.get("result")) == norm(inputs["plaintext"]),
        "note": "decrypt(encrypt(plaintext)+tag) == plaintext",
    }


def _rt_rsa(inputs: dict, res: object) -> dict:
    cipher = as_text(res)
    out = execute("rsa", "decrypt", {
        "message": cipher, "p": inputs["p"], "q": inputs["q"], "e": inputs["e"]})
    return {
        "checked": True,
        "ok": norm(out.get("result")) == norm(inputs["message"]),
        "note": "decrypt(encrypt(message)) == message",
    }


def _rt_elgamal(inputs: dict, extra: dict) -> dict:
    c1 = extra.get("c1")
    c2 = extra.get("c2")
    if c1 is None or c2 is None:
        return {"checked": False, "ok": False, "note": "no c1/c2 in extra"}
    out = execute("elgamal", "decrypt", {
        "c1": c1, "c2": c2, "p": inputs["p"], "g": inputs["g"], "x": inputs["x"]})
    expected = int.from_bytes(inputs["message"].encode("utf-8"), "big")
    return {
        "checked": True,
        "ok": norm(out.get("result")) == str(expected),
        "note": "decrypt(c1, c2) == message",
    }


def roundtrip(alg_id: str, inputs: dict, res: object, extra: dict) -> dict:
    try:
        if alg_id in ("des", "triple_des", "aes", "blowfish", "twofish"):
            return _rt_block_cipher(alg_id, inputs, res)
        if alg_id in ("caesar", "monoalphabetic", "vigenere", "playfair",
                      "hill", "rail_fence", "columnar"):
            return _rt_classical(alg_id, inputs, res)
        if alg_id == "chacha20":
            return _rt_chacha20(inputs, res)
        if alg_id in ("aes_gcm", "chacha20_poly1305"):
            return _rt_aead(alg_id, inputs, res, extra)
        if alg_id == "rsa":
            return _rt_rsa(inputs, res)
        if alg_id == "elgamal":
            return _rt_elgamal(inputs, extra)
    except Exception as exc:  # noqa: BLE001 - record any failure instead of aborting
        return {"checked": True, "ok": False, "note": f"exception {type(exc).__name__}: {exc}"}
    return {"checked": False, "ok": False, "note": "no round-trip defined"}


def main() -> int:
    out: dict = {
        "generated": datetime.now(timezone.utc).isoformat(),
        "operations": {},
        "fixtures": {},
        "errors": {},
    }
    for alg_id, cfg in CANONICAL.items():
        op = cfg["operation"]
        inputs = cfg["inputs"]
        out["operations"][alg_id] = {"operation": op, "inputs": inputs}
        try:
            res = execute(alg_id, op, dict(inputs))
        except Exception as exc:  # noqa: BLE001
            out["errors"][alg_id] = f"{type(exc).__name__}: {exc}"
            continue

        result = res.get("result")
        extra = res.get("extra") or {}
        fixture: dict = {
            "algorithm": res.get("algorithm", alg_id),
            "operation": res.get("operation", op),
            "inputs": inputs,
            "result": result,
            "result_str": norm(result),
            "extra": extra,
        }
        if alg_id in ROUNDTRIP_DECRYPT:
            fixture["roundtrip"] = roundtrip(alg_id, inputs, result, extra)
        out["fixtures"][alg_id] = fixture

    target = BACKEND_DIR.parent / "frontend" / "tests" / "fixtures"
    target.mkdir(parents=True, exist_ok=True)
    path = target / "audit.json"
    path.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")

    ok_count = len(out["fixtures"])
    err_count = len(out["errors"])
    rt_fail = [
        alg_id for alg_id, f in out["fixtures"].items()
        if f.get("roundtrip", {}).get("checked") and not f["roundtrip"]["ok"]
    ]
    print(f"fixtures: {ok_count} ok, {err_count} errors, "
          f"roundtrip failures: {rt_fail or 'none'}")
    for alg_id, msg in out["errors"].items():
        print(f"  ERROR {alg_id}: {msg}")
    print(f"wrote {path}")
    return 0 if err_count == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
