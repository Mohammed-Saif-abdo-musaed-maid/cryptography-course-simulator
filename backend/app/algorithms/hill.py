"""Hill cipher educational simulator.

Plaintext letters become vectors multiplying a key matrix under modular
arithmetic:

    C = K · P (mod 26)

Decryption uses the modular inverse key matrix over Z/26Z.
Supports 2x2 and 3x3 key matrices.
"""

from __future__ import annotations

from typing import List, Sequence

from app.utils.errors import MatrixError, ValidationError
from app.utils.math_utils import gcd, mod_inverse
from app.utils.steps import build_result, step

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
ALPHABET_SIZE = 26

METADATA = {
    "id": "hill",
    "name": "Hill Cipher",
    "category": "classical",
    "security_status": "historic",
    "reversible": True,
    "key_kind": "invertible integer matrix (mod 26)",
    "block_size": "matrix size n (2 or 3)",
    "description": (
        "A block cipher where each block of n plaintext letters is treated "
        "as a vector and multiplied by an n×n key matrix modulo 26. The "
        "matrix must be invertible modulo 26."
    ),
}


def _det2(m: Sequence[Sequence[int]]) -> int:
    return m[0][0] * m[1][1] - m[0][1] * m[1][0]


def _det3(m: Sequence[Sequence[int]]) -> int:
    return (
        m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
        - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
        + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    )


def determinant(matrix: Sequence[Sequence[int]]) -> int:
    n = len(matrix)
    if n == 2:
        return _det2(matrix)
    if n == 3:
        return _det3(matrix)
    raise MatrixError("Only 2x2 and 3x3 matrices are supported")


def _cofactor_matrix(matrix: Sequence[Sequence[int]]) -> List[List[int]]:
    n = len(matrix)
    cof = [[0] * n for _ in range(n)]
    if n == 2:
        a, b, c, d = matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1]
        return [[d, -c], [-b, a]]
    for r in range(n):
        for c in range(n):
            rows = [i for i in range(n) if i != r]
            cols = [j for j in range(n) if j != c]
            minor = [[matrix[rr][cc] for cc in cols] for rr in rows]
            cof[r][c] = (1 if (r + c) % 2 == 0 else -1) * _det2(minor)
    return cof


def modular_inverse_matrix(matrix: Sequence[Sequence[int]],
                           modulus: int = ALPHABET_SIZE) -> tuple:
    """Return (inverse_matrix, det) where inverse = adjugate · det⁻¹ mod m."""
    n = len(matrix)
    det = determinant(matrix)
    det_mod = det % modulus
    if gcd(det_mod, modulus) != 1:
        raise MatrixError(
            f"Matrix is not invertible modulo {modulus}: "
            f"det = {det}, gcd(det, {modulus}) = {gcd(det_mod, modulus)}",
            "not_invertible",
        )
    inv_det = mod_inverse(det_mod, modulus)

    cof = _cofactor_matrix(matrix)
    adjugate = [[cof[c][r] % modulus for c in range(n)] for r in range(n)]
    inverse = [[(adjugate[r][c] * inv_det) % modulus for c in range(n)]
               for r in range(n)]
    return inverse, det, inv_det, cof, adjugate


def _parse_matrix(values: List[List[int]]) -> List[List[int]]:
    n = len(values)
    if n not in (2, 3):
        raise MatrixError("Matrix size must be 2x2 or 3x3", "invalid_matrix")
    if not all(len(row) == n for row in values):
        raise MatrixError("Matrix must be square", "invalid_matrix")
    m = [[int(v) for v in row] for row in values]
    for row in m:
        for v in row:
            if not -1000 <= v <= 1000:
                raise MatrixError("Matrix entries must be between -1000 and 1000",
                                  "invalid_matrix")
    return m


def _validate(text: str) -> None:
    if not text or not text.strip():
        raise ValidationError("Input must not be empty", "empty_input")
    if not all(c.isalpha() for c in text if not c.isspace()):
        raise ValidationError("Hill cipher input may only contain letters and spaces",
                              "unsupported_character")


def _prepare(text: str, n: int) -> tuple:
    letters = [c.upper() for c in text if c.isalpha()]
    if len(letters) % n != 0:
        pad = n - (len(letters) % n)
        letters.extend(["X"] * pad)
    logger_notes = {"padded": pad if len([c for c in text if c.isalpha()]) % n else 0}
    blocks = [letters[i:i + n] for i in range(0, len(letters), n)]
    return blocks, logger_notes


def _mat_vec_mult(matrix: Sequence[Sequence[int]], vec: Sequence[int],
                  modulus: int) -> List[int]:
    return [sum(matrix[r][c] * vec[c] for c in range(len(vec))) % modulus
            for r in range(len(matrix))]


def encrypt(plaintext: str, matrix: List[List[int]]) -> dict:
    key_matrix = _parse_matrix(matrix)
    _validate(plaintext)
    n = len(key_matrix)

    # Invertibility check required even for encryption (key validity).
    try:
        inv, det, inv_det, cof, adj = modular_inverse_matrix(key_matrix)
    except MatrixError as exc:
        raise MatrixError(str(exc.message), exc.code) from exc

    blocks, notes = _prepare(plaintext, n)
    block_steps = []
    result_blocks = []
    for idx, block in enumerate(blocks):
        vec = [ord(c) - ord("A") for c in block]
        out_vec = _mat_vec_mult(key_matrix, vec, ALPHABET_SIZE)
        out_block = "".join(chr(ord("A") + v) for v in out_vec)
        block_steps.append({
            "block": idx + 1,
            "plaintext_block": "".join(block),
            "vector": vec,
            "matrix_multiplication":
                f"K·P = {key_matrix} · {vec} (mod 26)",
            "mid_product": [
                sum(key_matrix[r][c] * vec[c] for c in range(n))
                for r in range(n)
            ],
            "modulo": out_vec,
            "ciphertext_block": out_block,
        })
        result_blocks.append(out_block)
    ciphertext = "".join(result_blocks)

    steps = [
        step(1, "Validate key matrix",
             "The n×n key matrix must be invertible modulo 26, i.e. "
             "gcd(det K, 26) = 1.",
             str(key_matrix),
             f"det = {det}, gcd({det % 26}, 26) = 1 → valid",
             {"matrix": key_matrix, "determinant": det}),
        step(2, "Prepare plaintext blocks",
             f"The letters are grouped into blocks of size {n}, padded with "
             "X if necessary.",
             plaintext, " ".join("".join(b) for b in blocks),
             {"blocks": ["".join(b) for b in blocks],
              "note": notes if notes["padded"] else "no padding needed"}),
        step(3, "Multiply blocks by the key matrix",
             "Each block vector P is multiplied: C = K·P mod 26.",
             "vectors", "ciphertext blocks",
             {"blocks": block_steps}),
        step(4, "Assemble ciphertext",
             "The encrypted blocks are concatenated.",
             " ".join(result_blocks), ciphertext, {}),
    ]
    return build_result("hill", "encrypt", plaintext, {"matrix": key_matrix},
                        ciphertext, steps,
                        {"ciphertext": ciphertext, "matrix": key_matrix,
                         "determinant": det, "blocks": block_steps,
                         "formula": "C = K·P (mod 26)"})


def decrypt(ciphertext: str, matrix: List[List[int]]) -> dict:
    key_matrix = _parse_matrix(matrix)
    _validate(ciphertext)
    n = len(key_matrix)

    try:
        inv, det, inv_det, cof, adj = modular_inverse_matrix(key_matrix)
    except MatrixError as exc:
        raise MatrixError(str(exc.message), exc.code) from exc

    inverse_plain = [[(v % 26) for v in row] for row in inv]
    blocks, notes = _prepare(ciphertext, n)
    block_steps = []
    result_blocks = []
    for idx, block in enumerate(blocks):
        vec = [ord(c) - ord("A") for c in block]
        out_vec = _mat_vec_mult(inverse_plain, vec, ALPHABET_SIZE)
        out_block = "".join(chr(ord("A") + v) for v in out_vec)
        block_steps.append({
            "block": idx + 1,
            "ciphertext_block": "".join(block),
            "vector": vec,
            "modulo": out_vec,
            "plaintext_block": out_block,
        })
        result_blocks.append(out_block)
    plaintext = "".join(result_blocks)

    steps = [
        step(1, "Compute modular inverse key matrix",
             "The inverse matrix K⁻¹ is built from the adjugate and the "
             "modular inverse of the determinant.",
             str(key_matrix),
             f"K⁻¹ (mod 26) = {inverse_plain}",
             {"determinant": det, "inverse_determinant": inv_det,
              "adjugate": adj, "inverse": inverse_plain}),
        step(2, "Prepare ciphertext blocks",
             f"Letters grouped in blocks of size {n}.",
             ciphertext, " ".join("".join(b) for b in blocks),
             {"blocks": ["".join(b) for b in blocks]}),
        step(3, "Multiply by inverse matrix",
             "P = K⁻¹·C mod 26 recovers each plaintext block.",
             "vectors", "plaintext blocks", {"blocks": block_steps}),
        step(4, "Assemble plaintext (remove padding)",
             "Blocks are joined; trailing X padding may be removed manually.",
             " ".join(result_blocks), plaintext, {}),
    ]
    return build_result("hill", "decrypt", ciphertext, {"matrix": key_matrix},
                        plaintext, steps,
                        {"plaintext": plaintext, "matrix": key_matrix,
                         "determinant": det, "inverse_matrix": inverse_plain,
                         "blocks": block_steps,
                         "formula": "P = K⁻¹·C (mod 26)"})


def get_metadata() -> dict:
    return METADATA