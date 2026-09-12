"""BLAKE3 hash function educational simulator.

Implements the full BLAKE3 spec (blake3.pdf, 2020):

  * binary Merkle tree over 1024-byte chunks
  * chunk blocks of 64 bytes compressed with 7 rounds of the BLAKE2s
    round function (rotations 16, 12, 8, 7)
  * message words are permuted (MSG_PERMUTATION) after every round
  * flags: CHUNK_START=1, CHUNK_END=2, PARENT=4, ROOT=8
  * counter = chunk index (chunk blocks) or 0 (parent / output)
  * tree is left-subtree-complete (each node's left child is the largest
    possible power-of-two-sized subtree)
  * final digest = first `length` bytes of the root output block

IMPORTANT: BLAKE3 is a cryptographic hash function, NOT encryption.
It is one-way — there is no decryption operation.
"""

from __future__ import annotations

from typing import List, Tuple

from backend.app.utils.errors import ValidationError
from backend.app.utils.steps import build_result, step

METADATA = {
    "id": "blake3",
    "name": "BLAKE3",
    "category": "hashing",
    "security_status": "secure",
    "reversible": False,
    "key_kind": "none (unkeyed hash)",
    "block_size": "64-byte blocks / 1024-byte chunks",
    "description": (
        "BLAKE3 is a modern, very fast hash built as a Merkle tree of 1024-"
        "byte chunks over the BLAKE2s compression function (7 rounds). Its "
        "tree structure enables parallelism and XOF output. It is ONE-WAY — "
        "it cannot be decrypted."
    ),
}

IV = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]

MSG_SCHEDULE = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [2, 6, 3, 10, 7, 0, 4, 13, 1, 11, 12, 5, 9, 14, 15, 8],
    [3, 4, 10, 12, 13, 2, 7, 14, 6, 5, 9, 0, 11, 15, 8, 1],
    [10, 7, 12, 9, 14, 3, 13, 15, 4, 0, 11, 2, 5, 8, 1, 6],
    [12, 13, 9, 11, 15, 10, 14, 8, 7, 2, 5, 3, 0, 1, 6, 4],
    [9, 14, 11, 5, 8, 12, 15, 1, 13, 3, 0, 10, 2, 6, 4, 7],
    [11, 15, 5, 0, 1, 9, 8, 6, 14, 10, 2, 12, 3, 4, 7, 13],
]

CHUNK_LEN = 1024
BLOCK_LEN = 64

FLAG_CHUNK_START = 1
FLAG_CHUNK_END = 2
FLAG_PARENT = 4
FLAG_ROOT = 8

MASK = 0xFFFFFFFF
WORD_BYTES = 4


def _rotr(x: int, n: int) -> int:
    return ((x >> n) | (x << (32 - n))) & MASK


def _g(state: List[int], a: int, b: int, c: int, d: int,
       x: int, y: int) -> None:
    state[a] = (state[a] + state[b] + x) & MASK
    state[d] = _rotr(state[d] ^ state[a], 16)
    state[c] = (state[c] + state[d]) & MASK
    state[b] = _rotr(state[b] ^ state[c], 12)
    state[a] = (state[a] + state[b] + y) & MASK
    state[d] = _rotr(state[d] ^ state[a], 8)
    state[c] = (state[c] + state[d]) & MASK
    state[b] = _rotr(state[b] ^ state[c], 7)


def _round(state: List[int], m: List[int], schedule: List[int]) -> None:
    _g(state, 0, 4, 8, 12, m[schedule[0]], m[schedule[1]])
    _g(state, 1, 5, 9, 13, m[schedule[2]], m[schedule[3]])
    _g(state, 2, 6, 10, 14, m[schedule[4]], m[schedule[5]])
    _g(state, 3, 7, 11, 15, m[schedule[6]], m[schedule[7]])
    _g(state, 0, 5, 10, 15, m[schedule[8]], m[schedule[9]])
    _g(state, 1, 6, 11, 12, m[schedule[10]], m[schedule[11]])
    _g(state, 2, 7, 8, 13, m[schedule[12]], m[schedule[13]])
    _g(state, 3, 4, 9, 14, m[schedule[14]], m[schedule[15]])


def buf_to_words(buf: bytes) -> List[int]:
    return [int.from_bytes(buf[i:i + 4], "little")
            for i in range(0, len(buf), 4)]


def words_to_bytes(words: List[int]) -> bytes:
    return b"".join(x.to_bytes(WORD_BYTES, "little") for x in words)


def compress(cv: List[int], block: bytes, counter: int, block_len: int,
             flags: int) -> List[int]:
    """Compress a 64-byte block (mirrors the reference compress_xof).

    Initial state: cv in row 0, IV[0..4] in row 1 positions 8..11, and the
    raw counter / block_len / flags in positions 12..15. Returns the 16
    output words (row0^row1, row1^cv).
    """
    m = buf_to_words(block.ljust(BLOCK_LEN, b"\x00"))
    state = list(cv) + list(IV)  # positions 8..15 = IV[0..8]
    state[12] = counter & MASK
    state[13] = (counter >> 32) & MASK
    state[14] = block_len
    state[15] = flags
    for r in range(7):
        _round(state, m, MSG_SCHEDULE[r])
    out = [0] * 16
    for i in range(8):
        out[i] = state[i] ^ state[i + 8]
        out[i + 8] = state[i + 8] ^ cv[i]
    return out


def chunk_cv(data: bytes, chunk_counter: int) -> Tuple[List[int], bytes, int, int, List[int]]:
    """Compress one chunk (mirrors the reference chunk_state).

    Full 64-byte blocks are compressed only while more than one block worth of
    bytes is left; the final block is the remaining 1..64 bytes (or an empty
    block for an empty chunk) and always carries CHUNK_END.

    Returns (cv_before_last, last_block, last_block_len, last_block_flags,
    chunk_cv).
    """
    cv = list(IV)
    flags = FLAG_CHUNK_START
    i = 0
    while len(data) - i > BLOCK_LEN:
        block = data[i:i + BLOCK_LEN]
        state = compress(cv, block, chunk_counter, BLOCK_LEN, flags)
        cv = state[:8]
        flags = 0
        i += BLOCK_LEN

    rem = data[i:]
    block_len = len(rem)
    last_flags = flags | FLAG_CHUNK_END
    state = compress(cv, rem, chunk_counter, block_len, last_flags)
    return cv, rem, block_len, last_flags, state[:8]


def parent_cv(left: List[int], right: List[int]) -> List[int]:
    block = words_to_bytes(left) + words_to_bytes(right)
    state = compress(IV, block, 0, BLOCK_LEN, FLAG_PARENT)
    return state[:8]


def build_tree(cvs: List[List[int]]) -> Tuple[List[int], int, List[int], List[int]]:
    """Left-subtree-complete tree.

    Returns (root_cv, tree_size, root_left_cv, root_right_cv).
    """
    n = len(cvs)
    if n == 1:
        return cvs[0], 1, [], []
    k = n.bit_length() - 1
    left_size = 1 << k
    if left_size == n:
        left_size //= 2
    left_cv, ls, _, _ = build_tree(cvs[:left_size])
    right_cv, rs, _, _ = build_tree(cvs[left_size:])
    return parent_cv(left_cv, right_cv), ls + rs, left_cv, right_cv


def hash_bytes(data: bytes, length: int = 32) -> dict:
    """Full BLAKE3 with educational detail."""
    chunks = [data[i:i + CHUNK_LEN] for i in range(0, len(data), CHUNK_LEN)] or [b""]
    n_chunks = len(chunks)

    chunk_details = []
    cvs = []
    cv_states = []
    for chunk_index, chunk_data in enumerate(chunks):
        cv_before_last, last_block, last_block_len, last_block_flags, cv = (
            chunk_cv(chunk_data, chunk_index)
        )
        cvs.append(cv)
        cv_states.append((cv_before_last, last_block, last_block_len,
                          last_block_flags))
        chunk_details.append({
            "chunk_index": chunk_index,
            "bytes": len(chunk_data),
            "cv": [f"{x:08x}" for x in cv],
        })

    if n_chunks == 1:
        # Root is a single chunk: the ROOT output compresses the chunk's final
        # block once, with the chaining value preceding it as input cv.
        cv_before_last, last_block, last_block_len, last_block_flags = cv_states[0]
        root_cv_block = last_block
        root_block_len = last_block_len
        root_flags = last_block_flags | FLAG_ROOT
        cv_in = cv_before_last
        tree_size = 1
        root_cv = cvs[0]
    else:
        # Multi-chunk root: a PARENT node over the root's two children, with
        # IV as the input key.
        root_cv, tree_size, left_cv, right_cv = build_tree(cvs)
        root_cv_block = words_to_bytes(left_cv) + words_to_bytes(right_cv)
        root_block_len = BLOCK_LEN
        root_flags = FLAG_PARENT | FLAG_ROOT
        cv_in = list(IV)

    state = compress(cv_in, root_cv_block, 0, root_block_len, root_flags)
    output_bytes = words_to_bytes(state)

    if length > 64:
        while len(output_bytes) < length:
            counter = len(output_bytes) // 64
            state = compress(cv_in, root_cv_block, counter, root_block_len,
                             root_flags)
            output_bytes += words_to_bytes(state)

    digest = output_bytes[:length].hex()

    return {
        "chunks": chunk_details,
        "chunk_count": n_chunks,
        "root_cv": [f"{x:08x}" for x in root_cv],
        "tree_size": tree_size,
        "digest": digest,
    }


def hash_text(message: str, length: int = 32) -> dict:
    if message is None or not isinstance(message, str):
        raise ValidationError("Message must not be empty", "empty_input")
    length = int(length)
    if not (1 <= length <= 1024):
        raise ValidationError("Output length must be between 1 and 1024 bytes",
                              "invalid_length")
    data = message.encode("utf-8")
    result = hash_bytes(data, length)

    steps = [
        step(1, "Encode message",
             "The message is UTF-8 encoded as bytes.",
             message, data.hex(),
             {"bytes": data.hex(), "length_bits": len(data) * 8}),
        step(2, "Split into 1024-byte chunks",
             "The message is divided into chunks — the leaves of a Merkle "
             "tree. Each chunk is compressed independently.",
             f"{len(data)} bytes",
             f"{result['chunk_count']} chunk(s)",
             {"chunk_count": result["chunk_count"],
              "chunks": result["chunks"]}),
        step(3, "Compress chunk blocks (7 rounds × 8 G-functions)",
             "Each chunk's 64-byte blocks are compressed; the message words "
             "are permuted after every round and the feed-forward adds the "
             "chaining value and block words to the state.",
             f"{result['chunk_count']} chunk(s)", "chunk chaining values",
             {"chunks": result["chunks"]}),
        step(4, "Build the Merkle tree (PARENT nodes)",
             "Equal power-of-two subtrees are paired into PARENT nodes up to "
             "one root chaining value (left-subtree-complete tree).",
             "chunk chaining values", "root chaining value",
             {"root_cv": result["root_cv"], "tree_size": result["tree_size"]}),
        step(5, "Root output block",
             "The root is compressed once more with the ROOT flag, producing "
             "a 64-byte output block.",
             "root chaining value", "output block",
             {"root_cv": result["root_cv"]}),
        step(6, "Produce the digest",
             f"The first {length} bytes of the output block form the BLAKE3 "
             f"digest (extendable to 2^64 bytes as XOF).",
             f"first {length} bytes", result["digest"],
             {"digest": result["digest"], "length": length}),
    ]

    return build_result(
        "blake3", "hash", message, {"length": length}, result["digest"],
        steps,
        {
            "digest": result["digest"],
            "length": length,
            "chunks": result["chunks"],
            "root_cv": result["root_cv"],
            "tree_size": result["tree_size"],
            "digest_bits": length * 8,
            "extendable_note": (
                "BLAKE3 digest length is a truncation of a 64-byte output "
                "block and can be extended (XOF)."
            ),
            "one_way_note": (
                "BLAKE3 is one-way: given only the digest, the original "
                "message cannot be recovered. There is no decryption "
                "operation."
            ),
        })


def get_metadata() -> dict:
    return METADATA


def hash(message: str, length: int = 32) -> dict:
    """Dispatch-compatible alias for the registry (operation 'hash')."""
    return hash_text(message, length)
