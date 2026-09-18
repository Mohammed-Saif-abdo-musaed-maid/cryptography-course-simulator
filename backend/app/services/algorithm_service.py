"""Dispatch service: converts validated API requests into algorithm calls.

Keeps algorithm logic independent from HTTP. Inputs are coerced to the
correct Python type according to the registry field specs.
"""

from __future__ import annotations

from typing import Any, Dict, List

from backend.app.algorithms import registry
from backend.app.utils.errors import ValidationError


def _coerce_input(raw: Any, field_spec: dict) -> Any:
    """Convert a raw JSON input value to the Python type the algorithm needs."""
    field_type = field_spec.get("type", "text")
    required = field_spec.get("required", False)

    if raw is None or raw == "":
        if required:
            raise ValidationError(
                f"'{field_spec['label']}' is required", "missing_input"
            )
        return None

    if field_type == "number":
        try:
            value = int(raw)
        except (TypeError, ValueError):
            raise ValidationError(
                f"'{field_spec['label']}' must be an integer", "invalid_input"
            ) from None
        minimum = field_spec.get("min")
        if minimum is not None and value < minimum:
            raise ValidationError(
                f"'{field_spec['label']}' must be ≥ {minimum}", "invalid_input"
            )
        maximum = field_spec.get("max")
        if maximum is not None and value > maximum:
            raise ValidationError(
                f"'{field_spec['label']}' must be ≤ {maximum}", "invalid_input"
            )
        return value

    if field_type == "matrix":
        if not isinstance(raw, list) or not raw:
            raise ValidationError(
                f"'{field_spec['label']}' must be a 2D matrix", "invalid_matrix"
            )
        n = len(raw)
        if n not in (2, 3):
            raise ValidationError(
                "Matrix size must be 2x2 or 3x3", "invalid_matrix"
            )
        matrix: List[List[int]] = []
        for row in raw:
            if not isinstance(row, list) or len(row) != n:
                raise ValidationError("Matrix must be square", "invalid_matrix")
            ints = []
            for cell in row:
                try:
                    ints.append(int(cell))
                except (TypeError, ValueError):
                    raise ValidationError(
                        "Matrix entries must be integers", "invalid_matrix"
                    ) from None
            matrix.append(ints)
        return matrix

    # text / textarea / secret / select -> string
    return str(raw)


def execute(algorithm_id: str, operation: str,
            inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Resolve and run the operation against the registered module.

    Returns the structured AlgorithmResult dictionary produced by the
    algorithm module itself.
    """
    try:
        info = registry.get_algorithm(algorithm_id)
    except KeyError:
        raise ValidationError(
            f"Unknown algorithm '{algorithm_id}'. Call GET /api/algorithms "
            "for the catalog.", "unknown_algorithm"
        ) from None

    if operation not in info["operations"]:
        raise ValidationError(
            f"Operation '{operation}' is not supported by {info['name']}. "
            f"Supported: {', '.join(info['operations'])}.",
            "unsupported_operation",
        )

    module = info["module"]
    field_specs = info["fields"]

    # Map input names to module function parameters (operation-sensitive).
    mapping = {
        "caesar": {"text": "plaintext" if operation == "encrypt" else "ciphertext",
                   "shift": "shift"},
        "monoalphabetic": {"text": "plaintext" if operation == "encrypt" else "ciphertext",
                           "substitution": "substitution"},
        "vigenere": {"text": "plaintext" if operation == "encrypt" else "ciphertext",
                     "key": "key"},
        "playfair": {"text": "plaintext" if operation == "encrypt" else "ciphertext",
                     "keyword": "keyword"},
        "hill": {"text": "plaintext" if operation == "encrypt" else "ciphertext",
                 "matrix": "matrix"},
        "rail_fence": {"text": "plaintext" if operation == "encrypt" else "ciphertext",
                       "rails": "rails"},
        "columnar": {"text": "plaintext" if operation == "encrypt" else "ciphertext",
                     "key": "key"},
        "des": {"block": "hex_block", "key": "hex_key"},
        "triple_des": {"block": "hex_block", "key": "hex_key"},
        "aes": {"block": "hex_block", "key": "hex_key"},
        "blowfish": {"block": "hex_block", "key": "hex_key"},
        "twofish": {"block": "hex_block", "key": "hex_key"},
        "chacha20": {"message": "message" if operation == "encrypt" else "message_hex",
                     "key": "hex_key", "nonce": "hex_nonce", "counter": "counter"},
        "aes_gcm": {"plaintext": "plaintext" if operation == "encrypt" else None,
                    "ciphertext_hex": "ciphertext_hex" if operation == "decrypt" else None,
                    "key_hex": "key_hex", "nonce_hex": "nonce_hex", "aad": "aad"},
        "chacha20_poly1305": {
            "plaintext": "plaintext" if operation == "encrypt" else None,
            "ciphertext_hex": "ciphertext_hex" if operation == "decrypt" else None,
            "key_hex": "key_hex", "nonce_hex": "nonce_hex", "aad": "aad"},
        "hmac": {"message": "message", "key": "key", "algorithm": "algorithm",
                 "output_format": "output_format", "mac": "mac"},
        "pbkdf2": {"password": "password", "salt": "salt", "iterations": "iterations",
                   "key_length": "key_length", "algorithm": "algorithm",
                   "salt_hex": "salt_hex", "expected_key_hex": "expected_key_hex"},
        "bcrypt": {"password": "password", "rounds": "rounds", "hash_str": "hash_str"},
        "scrypt": {"password": "password", "salt": "salt", "n": "n", "r": "r",
                   "p": "p", "key_length": "key_length",
                   "salt_hex": "salt_hex", "expected_key_hex": "expected_key_hex"},
        "argon2": {"password": "password", "time_cost": "time_cost",
                   "memory_cost": "memory_cost", "parallelism": "parallelism",
                   "hash_length": "hash_length", "variant": "variant",
                   "hash_str": "hash_str"},
        "hkdf": {"ikm": "ikm", "salt": "salt", "info": "info",
                 "length": "length", "algorithm": "algorithm"},
        "ecdh": {"curve": "curve"},
        "x25519": {},
        "ecdsa": {"message": "message", "curve": "curve",
                  "signature_hex": "signature_hex", "public_hex": "public_hex",
                  "public_x": "public_x", "public_y": "public_y"},
        "ed25519": {"message": "message", "signature_hex": "signature_hex",
                    "public_hex": "public_hex", "private_hex": "private_hex"},
        "rsa": {"message": "message" if operation in ("encrypt", "encrypt_oaep", "sign_pss", "verify_pss")
                else ("cipher" if operation == "decrypt" else None),
                "ciphertext_hex": "ciphertext" if operation == "decrypt_oaep" else None,
                "p": "p" if operation in ("generate_keys", "encrypt", "decrypt") else None,
                "q": "q" if operation in ("generate_keys", "encrypt", "decrypt") else None,
                "e": "e_choice" if operation in ("generate_keys", "encrypt", "decrypt") else None,
                "public_key_pem": "public_key_pem" if operation in ("encrypt_oaep", "verify_pss") else None,
                "private_key_pem": "private_key_pem" if operation in ("decrypt_oaep", "sign_pss") else None,
                "signature_hex": "signature_hex" if operation == "verify_pss" else None},
        "diffie_hellman": {"p": "p", "g": "g",
                           "a_private": "a_private", "b_private": "b_private"},
        "elgamal": {"message": "message" if operation == "encrypt" else None,
                    "p": "p", "g": "g", "x": "x",
                    "c1": "c1", "c2": "c2"},
        "sha256": {"message": "message"},
        "sha512": {"message": "message"},
        "sha1": {"message": "message"},
        "md5": {"message": "message"},
        "sha3": {"message": "message", "variant": "variant"},
        "blake2": {"message": "message", "variant": "variant"},
        "blake3": {"message": "message", "length": "length"},
        "sha224": {"message": "message"},
        "sha384": {"message": "message"},
        "ripemd160": {"message": "message"},
        "aes_cbc": {"plaintext": "plaintext" if operation == "encrypt" else None,
                    "ciphertext_hex": "ciphertext_hex" if operation == "decrypt" else None,
                    "key_hex": "key_hex", "iv_hex": "iv_hex"},
        "aes_ctr": {"plaintext": "plaintext" if operation == "encrypt" else None,
                    "ciphertext_hex": "ciphertext_hex" if operation == "decrypt" else None,
                    "key_hex": "key_hex", "counter_hex": "counter_hex"},
        "aes_ccm": {"plaintext": "plaintext" if operation == "encrypt" else None,
                    "ciphertext_hex": "ciphertext_hex" if operation == "decrypt" else None,
                    "key_hex": "key_hex", "nonce_hex": "nonce_hex",
                    "aad": "aad", "tag_length": "tag_length"},
        "camellia": {"block": "hex_block", "key": "hex_key"},
        "cmac": {"message": "message", "key_hex": "key_hex",
                 "output_format": "output_format",
                 "mac": "mac" if operation == "verify" else None},
        "poly1305": {"message": "message", "key_hex": "key_hex",
                     "output_format": "output_format",
                     "mac": "mac" if operation == "verify" else None},
        "x448": {},
        "dsa": {"message": "message" if operation in ("sign", "verify") else None,
                "hash_algorithm": "hash_algorithm" if operation in ("sign", "verify") else None,
                "key_size": "key_size" if operation in ("sign", "generate_keys") else None,
                "signature_hex": "signature_hex" if operation == "verify" else None,
                "private_key_pem": "private_key_pem" if operation == "sign" else None,
                "public_key_pem": "public_key_pem" if operation == "verify" else None},
        "rsa_pss": {"message": "message" if operation in ("sign", "verify") else None,
                    "hash_algorithm": "hash_algorithm" if operation in ("sign", "verify") else None,
                    "key_size": "key_size" if operation in ("sign", "generate_keys") else None,
                    "signature_hex": "signature_hex" if operation == "verify" else None,
                    "private_key_pem": "private_key_pem" if operation == "sign" else None,
                    "public_key_pem": "public_key_pem" if operation == "verify" else None},
    }.get(algorithm_id, {})

    # Special operations that have their own signature.
    special = {
        ("monoalphabetic", "generate_alphabet"): lambda: {
            "alphabet": module.generate_random_alphabet(),
        },
        ("rsa", "generate_keys"): lambda: module.generate_keys(
            **_coerce_key_params(algorithm_id, inputs, mapping)
        ),
        ("elgamal", "generate_keys"): lambda: module.generate_keys(
            **_coerce_key_params(algorithm_id, inputs, mapping)
        ),
        ("ecdsa", "generate_keys"): lambda: module.generate_keys(
            **{
                k: v for k, v in
                [("curve", inputs.get("curve") or "p256")]
                if v is not None
            }
        ),
        ("ed25519", "generate_keys"): lambda: module.generate_keys(),
        ("dsa", "generate_keys"): lambda: module.generate_keys(
            **_coerce_key_params(algorithm_id, inputs, mapping)
        ),
        ("rsa_pss", "generate_keys"): lambda: module.generate_keys(
            **_coerce_key_params(algorithm_id, inputs, mapping)
        ),
    }

    if (algorithm_id, operation) in special:
        return special[(algorithm_id, operation)]()

    # Brute-force extension for caesar.
    if algorithm_id == "caesar" and operation == "brute_force":
        text = inputs.get("text")
        if not text:
            raise ValidationError("Text is required for brute force", "missing_input")
        return {"algorithm": "caesar", "operation": "brute_force",
                "input": str(text), "parameters": {"shift": None},
                "result": module.brute_force(str(text)), "steps": [dict(
                    step=1, title="Try all shifts",
                    description="Each of the 26 shifts is applied and the "
                                "candidate plaintexts are listed.",
                    input=str(text), output="26 candidates",
                )], "extra": {"brute_force": module.brute_force(str(text))}}

    kwargs: Dict[str, Any] = {}
    # Collect from the declared field specs first...
    for spec in field_specs:
        param = mapping.get(spec["name"])
        if param is None:
            continue  # field unused by this operation
        raw = inputs.get(spec["name"])
        value = _coerce_input(raw, spec)
        if value is None and spec.get("required") and param is not None:
            raise ValidationError(
                f"'{spec['label']}' is required", "missing_input"
            )
        # Skip optional unused params (None) unless the algorithm tolerates it.
        if value is None and param in ("e_choice",):
            kwargs["e_choice"] = None
            continue
        if value is None:
            continue
        kwargs[param] = value

    # ...then pick up any extra mapped inputs not declared as fields
    # (e.g. ElGamal decrypt's c1/c2).
    declared = {spec["name"] for spec in field_specs}
    for name, param in mapping.items():
        if name in declared or param is None:
            continue
        raw = inputs.get(name)
        if raw is None or raw == "":
            continue
        spec = {"name": name, "type": "number", "label": name, "required": False}
        try:
            value = _coerce_input(raw, spec)
        except ValidationError:
            value = raw
        if value is not None:
            kwargs[param] = value

    # ElGamal decryption must receive both ciphertext components.
    if algorithm_id == "elgamal" and operation == "decrypt":
        for name in ("c1", "c2"):
            if name not in kwargs:
                kwargs[name] = _coerce_input(
                    inputs.get(name),
                    {"name": name, "type": "number", "label": name,
                     "required": True},
                )

    handler = getattr(module, operation, None)
    if handler is None:
        raise ValidationError(
            f"Operation '{operation}' is not implemented", "not_implemented"
        )

    return handler(**kwargs)


def _coerce_key_params(algorithm_id: str, inputs: Dict[str, Any], mapping: dict) -> dict:
    """Coerce inputs for key-generation style operations (subset of fields)."""
    info = registry.get_algorithm(algorithm_id)
    kwargs: Dict[str, Any] = {}
    for spec in info["fields"]:
        param = mapping.get(spec["name"])
        if param is None:
            continue
        if spec["name"] in inputs:
            value = _coerce_input(inputs.get(spec["name"]), spec)
            if value is not None:
                kwargs[param] = value
    return kwargs


def get_catalog() -> dict:
    algorithms = registry.get_catalog()
    categories = registry.categories_summary()
    return {"algorithms": algorithms, "categories": categories}


def get_algorithm_detail(algorithm_id: str) -> dict:
    try:
        info = registry.get_algorithm(algorithm_id)
    except KeyError:
        raise ValidationError(f"Unknown algorithm '{algorithm_id}'",
                              "unknown_algorithm") from None
    return {k: info[k] for k in
            ("name", "category", "operations", "fields", "security_status",
             "reversible", "key_kind", "block_size", "description", "formula")} | {
        "id": algorithm_id,
        "category_label": registry.CATEGORY_LABELS[info["category"]],
        "capabilities": registry.get_capabilities(algorithm_id),
    }
