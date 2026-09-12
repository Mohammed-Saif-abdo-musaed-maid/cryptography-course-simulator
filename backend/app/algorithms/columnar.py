"""Columnar transposition cipher educational simulator.

Plaintext is written in rows under a keyword whose letters dictate column
ordering. Ciphertext is read column by column in alphabetical key order.

Convention: for repeated key letters, ties are broken left-to-right by
column index (stable ordering).
"""

from __future__ import annotations

from typing import List

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "columnar",
    "name": "Columnar Transposition",
    "category": "classical",
    "security_status": "historic",
    "reversible": True,
    "key_kind": "keyword (letters)",
    "block_size": "whole message",
    "description": (
        "A transposition cipher that writes the plaintext into a grid whose "
        "columns are keyed by a keyword, then reads the ciphertext column by "
        "column in key order."
    ),
}


def _normalise_key(key: str) -> str:
    if not key or not key.strip():
        raise ValidationError("Key must not be empty", "invalid_key")
    cleaned = "".join(c for c in key.upper() if c.isalpha())
    if not cleaned:
        raise ValidationError("Key must contain letters", "invalid_key")
    return cleaned


def _column_order(key: str) -> List[int]:
    """Return column indices sorted by key letter (stable for ties)."""
    indexed = [(ch, i) for i, ch in enumerate(key)]
    ordered = sorted(indexed, key=lambda pair: pair[0])
    # Stable sort keeps original column order for duplicate letters.
    return [i for _, i in ordered]


def _fill_grid(text: str, key: str) -> tuple:
    """Return (grid rows, col_count, row_count)."""
    cols = len(key)
    letters = list(text)
    rows_needed = (len(letters) + cols - 1) // cols if letters else 0
    grid: List[List[str]] = []
    for r in range(rows_needed):
        row = letters[r * cols:(r + 1) * cols]
        while len(row) < cols:
            row.append("")
        grid.append(row)
    return grid, cols, rows_needed


def encrypt(plaintext: str, key: str) -> dict:
    if not plaintext:
        raise ValidationError("Plaintext must not be empty", "empty_input")
    keyword = _normalise_key(key)
    order = _column_order(keyword)
    grid, cols, rows = _fill_grid(plaintext, keyword)

    column_texts = []
    for c in range(cols):
        column_texts.append("".join(grid[r][c] for r in range(rows)))

    reading_order = sorted(range(cols), key=lambda c: order.index(c))
    ciphertext = "".join(column_texts[c] for c in order)

    table = []
    for r in range(rows):
        table.append({"row": r + 1,
                      "cells": [grid[r][c] if grid[r][c] else "·" for c in range(cols)]})

    steps = [
        step(1, "Key normalisation",
             "The keyword defines the column ordering. Duplicate letters are "
             "resolved left-to-right (stable order).",
             key, keyword, {"key": keyword, "order": order}),
        step(2, "Write plaintext into grid",
             f"Plaintext is written left-to-right into rows of width "
             f"{cols}; the last row is padded.",
             plaintext, f"{rows} rows × {cols} columns",
             {"table": table}),
        step(3, "Read columns in key order",
             "Columns are read top-to-bottom in the order of the keyword's "
             "alphabetical letters.",
             "grid", " + ".join(column_texts[c] for c in order),
             {"column_read_order": order,
              "columns": [{"column": c, "key_letter": keyword[c],
                           "text": column_texts[c]} for c in order]}),
        step(4, "Concatenate",
             "The column readings produce the final ciphertext.",
             " + ".join(column_texts[c] for c in order), ciphertext, {}),
    ]
    return build_result("columnar", "encrypt", plaintext, {"key": keyword},
                        ciphertext, steps,
                        {"ciphertext": ciphertext, "order": order,
                         "table": table, "columns": column_texts,
                         "key": keyword,
                         "convention": "duplicate key letters ordered left "
                                       "to right (stable)"})


def decrypt(ciphertext: str, key: str) -> dict:
    if not ciphertext:
        raise ValidationError("Ciphertext must not be empty", "empty_input")
    keyword = _normalise_key(key)
    order = _column_order(keyword)
    cols = len(keyword)
    n = len(ciphertext)
    rows = (n + cols - 1) // cols
    full = rows * cols

    # Column lengths: first (full % cols) columns have (rows) chars,
    # remaining columns have (rows - 1) when there is padding.
    col_lengths = [rows] * cols
    padded = full - n
    if padded:
        # The padded cells are at the end of the LAST (in reading order)
        # columns, i.e. the columns that fill in the final row last.
        for idx in order:
            if padded == 0:
                break
            col_lengths[idx] -= 1
            padded -= 1

    col_texts = {}
    pos = 0
    for c in order:
        col_texts[c] = ciphertext[pos:pos + col_lengths[c]]
        pos += col_lengths[c]

    grid: List[List[str]] = []
    for r in range(rows):
        row = [col_texts[c][r] if r < len(col_texts[c]) else "" for c in range(cols)]
        grid.append(row)

    plaintext = "".join("".join(row) for row in grid).rstrip("·")

    def _fill(_grid, _key, _rows, _cols):
        used = ["".join(_grid[r][c] for r in range(_rows)) for c in range(_cols)]
        return used

    used_columns = _fill(grid, keyword, rows, cols)
    table = []
    for r in range(rows):
        table.append({"row": r + 1,
                      "cells": [grid[r][c] if grid[r][c] else "·" for c in range(cols)]})

    steps = [
        step(1, "Key normalisation",
             "The column ordering is derived from the keyword.",
             key, keyword, {"key": keyword, "order": order}),
        step(2, "Split ciphertext into columns",
             "The ciphertext is apportioned to each column respecting the "
             "reading order and padding convention.",
             ciphertext, str({c: col_texts[c] for c in range(cols)}),
             {"column_lengths": col_lengths, "columns": col_texts}),
        step(3, "Rebuild the grid",
             "Columns are placed back under the keyword.",
             "columns", f"{rows} rows × {cols} columns", {"table": table}),
        step(4, "Read rows left-to-right",
             "Reading the grid row by row recovers the plaintext (padding "
             "removed).",
             "grid", plaintext, {}),
    ]
    return build_result("columnar", "decrypt", ciphertext, {"key": keyword},
                        plaintext, steps,
                        {"plaintext": plaintext, "order": order,
                         "table": table, "columns": col_texts,
                         "key": keyword,
                         "convention": "duplicate key letters ordered left "
                                       "to right (stable)"})


def get_metadata() -> dict:
    return METADATA