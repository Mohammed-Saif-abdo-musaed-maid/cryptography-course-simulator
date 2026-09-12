# Testing

The test suite currently has **190 passing tests**.

## Layout

```
backend/tests/
  conftest.py                      inserts the project backend dir into sys.path
  algorithms/
    test_classical.py              caesar, monoalphabetic, vigenere,
                                   playfair, hill, rail_fence, columnar
    test_symmetric.py              DES, 3DES, AES, Blowfish, Twofish,
                                   ChaCha20 (FIPS/official/RFC vectors)
    test_asymmetric_hashing.py     RSA, ElGamal, Diffie-Hellman, SHA-1/256/512,
                                   MD5, SHA-3, BLAKE2, BLAKE3
  api/
    test_api.py                    endpoints, catalog, math, exercises, quizzes
  integration/
    test_lifecycle.py              full API round-trips (encrypt→decrypt etc.)
```

## Running

```bash
cd backend
python -m pytest -q
```

The `PYTHONPATH` must include the `backend` directory (`conftest.py` also handles
it automatically).

## What is covered

- **Known vectors**: DES `0123456789ABCDEF`/`133457799BBCDFF1` →
  `85E813540F0AB405`; AES-128/192/256 FIPS-197; SHA-256 vs `hashlib` (including
  empty input and multi-block messages); SHA-1/SHA-512/SHA-3/BLAKE2 vs
  `hashlib`; Playfair `HELLO`→`CFSUPM`; Vigenère
  `ATTACKATDAWN`/`LEMON`→`LXFOPVEFRNHR`; Hill 2×2 and 3×3; rail fence and
  columnar fixed examples.
- **Round-trips**: every reversible algorithm encrypts then decrypts back to the
  original (incl. 3DES EDE and identical-key reduction to DES).
- **Properties**: Diffie-Hellman sides always agree; RSA/ElGamal keys are
  consistent; `gcd(…) == 1` ⇒ modular inverse exists.
- **API**: catalog size (23), categories (classical=7, symmetric=6,
  asymmetric=2, key_exchange=1, hashing=7), error payload shapes, hidden answers
  in exercises/quizzes, and text-based quiz grading.
- **Hash implementations**: MD5/SHA-1/SHA-512/SHA-3 (all 224/256/384/512)/
  BLAKE2 (b-512, s-256) vs `hashlib` on `abc`, empty input and multi-block
  messages; invalid-variant and zero-length input errors. BLAKE3 verified
  against all 35 official BLAKE3 test vectors plus the 131-byte extractable
  output, including chunk-boundary messages (1024/1025 bytes) and multi-chunk
  trees.
- **New implementations**: Blowfish official zero/FF-key vectors +
  PyCryptodome agreement; Twofish 19 official `ecb_tbl`/`ecb_ival` + paper B.2
  vectors across 128/192/256; ChaCha20 RFC 8439 §2.3.2 keystream and §2.4.2
  two-block ciphertext.

## Frontend

- `npm run build` runs `tsc -b` (strict type-check) and Vite production build.
- Unit-testing the frontend UI (Vitest) is a documented extension point — the
  component surface (StepViewer, AlgorithmForm, i18n lookup) is designed to be
  testable; add a `src/lib` seam if you want to unit-test the API client without
  a running server.