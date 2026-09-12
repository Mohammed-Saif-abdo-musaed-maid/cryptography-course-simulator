"""Rail Fence (zig-zag) cipher educational simulator.

Plaintext characters are written in a zig-zag pattern across a number of
rails, then read off row by row. Visualizes the pattern dynamically.
"""

from __future__ import annotations

from typing import List, Optional

from app.utils.errors import ValidationError
from app.utils.steps import build_result, step

METADATA = {
    "id": "rail_fence",
    "name": "Rail Fence Cipher",
    "category": "classical",
    "security_status": "historic",
    "reversible": True,
    "key_kind": "number of rails",
    "block_size": "whole message",
    "description": (
        "A transposition cipher that writes the plaintext diagonally across "
        "rails in a zig-zag and reads it off row by row."
    ),
}


def _validate(text: str, rails: int) -> None:
    if not text or not text.strip():
        raise ValidationError("Input must not be empty", "empty_input")
    if rails is None:
        raise ValidationError("Number of rails is required", "invalid_rails")
    if isinstance(rails, bool) or not isinstance(rails, int):
        raise ValidationError("Rails must be an integer", "invalid_rails")
    if rails < 2:
        raise ValidationError("Number of rails must be at least 2", "invalid_rails")
    if rails > 26:
        raise ValidationError("Number of rails must be at most 26", "invalid_rails")


def _rail_positions(length: int, rails: int) -> List[int]:
    """Return the rail index for each character position (0-based)."""
    cycle = 2 * (rails - 1)
    if cycle == 0:
        return [0] * length
    positions = []
    for i in range(length):
        mod = i % cycle
        positions.append(mod if mod < rails else cycle - mod)
    return positions


def _pattern(text: str, rails: int) -> dict:
    positions = _rail_positions(len(text), rails)
    char_count = len([c for c in text if c != " " and c != "\n"])
    # Build the visual grid using display cells.
    grid: List[List[Optional[str]]] = [[None] * len(text) for _ in range(rails)]
    only_letters = text
    for col, (ch, rail) in enumerate(zip(only_letters, positions)):
        grid[rail][col] = ch
    return {"positions": positions, "grid": grid,
            "letter_count": char_count}


def _cipher(text: str, rails: int) -> tuple:
    """Read the letters off row by row."""
    pattern = _pattern(text, rails)
    positions = pattern["positions"]
    out = [""] * rails
    for ch, rail in zip(text, positions):
        out[rail] += ch
    return "".join(out), positions


def encrypt(plaintext: str, rails: int) -> dict:
    _validate(plaintext, rails)
    ciphertext, positions = _cipher(plaintext, rails)
    pattern = _pattern(plaintext, rails)
    grid = pattern["grid"]

    rows = []
    for r, row in enumerate(grid):
        chars = [c if c is not None else "." for c in row]
        rows.append({"rail": r + 1, "pattern": "".join(chars),
                     "text": "".join(c for c in row if c is not None)})

    steps = [
        step(1, "Configuration",
             f"The plaintext is written diagonally across {rails} rails in a "
             "zig-zag fashion, starting at the top rail.",
             f"rails = {rails}, length = {len(plaintext)}",
             f"cycle = 2·({rails} - 1) = {2 * (rails - 1)}",
             {"rails": rails, "cycle": 2 * (rails - 1)}),
        step(2, "Write zig-zag pattern",
             "Each character is placed greedily: down to the bottom rail, "
             "then up again.",
             plaintext, "zig-zag grid",
             {"rows": rows, "positions": positions}),
        step(3, "Read off row by row",
             "The ciphertext is the concatenation of all rails from top to "
             "bottom.",
             "zig-zag grid", ciphertext,
             {"row_contents": [{"rail": r + 1, "value": "".join(c for c in row if c)}
                               for r, row in enumerate(grid)]}),
    ]
    return build_result("rail_fence", "encrypt", plaintext, {"rails": rails},
                        ciphertext, steps,
                        {"ciphertext": ciphertext, "rows": rows,
                         "pattern": "".join(str(p + 1) for p in positions)})


def decrypt(ciphertext: str, rails: int) -> dict:
    _validate(ciphertext, rails)
    n = len(ciphertext)
    positions = _rail_positions(n, rails)
    # Count characters per rail and slice them back in order.
    counts = [positions.count(r) for r in range(rails)]
    chunks = []
    idx = 0
    for count in counts:
        chunks.append(list(ciphertext[idx:idx + count]))
        idx += count
    placeholders = [chunks[rail].pop(0) for rail in positions]
    plaintext = "".join(placeholders)

    grid: List[List[Optional[str]]] = [[None] * n for _ in range(rails)]
    for col, (ch, rail) in enumerate(zip(placeholders, positions)):
        grid[rail][col] = ch
    rows = []
    for r, row in enumerate(grid):
        rows.append({"rail": r + 1,
                     "pattern": "".join(c if c is not None else "." for c in row),
                     "text": "".join(c for c in row if c is not None)})

    steps = [
        step(1, "Reconstruct rail lengths",
             "The positions sequence reveals how many characters each rail "
             "holds; the ciphertext is split accordingly.",
             ciphertext, str(counts),
             {"counts": counts}),
        step(2, "Rebuild zig-zag grid",
             "Characters are placed into the grid following the same rail "
             "positions algorithm.",
             str(counts), "reconstructed grid",
             {"rows": rows}),
        step(3, "Read off the plaintext",
             "Reading the grid left-to-right, top-to-bottom recovers the "
             "original message.",
             "reconstructed grid", plaintext, {}),
    ]
    return build_result("rail_fence", "decrypt", ciphertext, {"rails": rails},
                        plaintext, steps,
                        {"plaintext": plaintext, "rows": rows,
                         "counts": counts})


def get_metadata() -> dict:
    return METADATA