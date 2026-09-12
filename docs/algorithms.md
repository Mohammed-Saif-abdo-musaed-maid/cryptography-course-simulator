# Algorithms

All algorithms are implemented in `backend/app/algorithms/`. Each module exposes
`get_metadata()` and one or more of `encrypt`, `decrypt`, `hash`, `exchange`,
`generate_keys`, `brute_force`. Every call returns a structured result plus
`steps[]` for education.

## Classical (7)

| Id              | Name                          | Vector verified                                            |
| --------------- | ----------------------------- | --------------------------------------------------------- |
| `caesar`        | Caesar Cipher                 | `HELLO`/3 → `KHOOR`; brute-force lists 26 candidates       |
| `monoalphabetic`| Monoalphabetic Substitution   | roundtrip with random alphabet                             |
| `vigenere`      | Vigenère                      | `ATTACKATDAWN`/`LEMON` → `LXFOPVEFRNHR`                   |
| `playfair`      | Playfair (I/J merged)         | `HELLO`/`MONARCHY` → `CFSUPM`                             |
| `hill`          | Hill (2×2 and 3×3)            | `HELP`/`[[3,3],[2,5]]` → `HIAT`; `ACT`(3×3) → `POH`      |
| `rail_fence`    | Rail Fence                    | 3-rail `WEAREDISCOVEREDFLEEATONCE` → `WECRLTEERDSOEEFEAOCAIVDEN` |
| `columnar`      | Columnar Transposition        | `HELLOWORLD`/`ZEBRA` → `ODLREOLLHW` (ties left-to-right)   |

## Symmetric (6)

| Id          | Notes                                                                 |
| ----------- | --------------------------------------------------------------------- |
| `des`       | Full Feistel, 16 rounds, round-key detail + S-box table. Vector: `0123456789ABCDEF` / `133457799BBCDFF1` → `85E813540F0AB405`. |
| `triple_des`| EDE chain of 3 DES keys. `K1=K2=K3` reduces to DES (asserted in tests). |
| `aes`       | Rijndael AES-128/192/256, per-round state matrices. FIPS-197 vectors match for all three key sizes against block `00112233445566778899AABBCCDDEEFF`. |
| `blowfish`  | Variable-key (32–448-bit) Feistel, π-derived P/S boxes. Official vectors match (`0000000000000000`/zero key → `4EF997456198DD78`); marked deprecated for its 64-bit block. |
| `twofish`   | AES finalist; 128-bit block, 128/192/256-bit keys. Verified against the official `ecb_tbl`/`ecb_ival` chains and paper B.2 ABC vectors (19/19), e.g. zero key/zero block → `9F589F5CF6122C32B6BFEC2F2AE8C35A`, 256-bit zero key → `57FF739D4DC92C1BD7FC01700CC8216F`. |
| `chacha20`  | RFC 8439 stream cipher. Matches §2.3.2 block keystream and §2.4.2 two-block "sunscreen" ciphertext exactly. |

## Asymmetric (2) + key exchange (1) + hashing (7)

| Id               | Notes                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| `rsa`            | Textbook RSA; messages base-27 encoded (A=1…Z=26), must be < n.         |
| `elgamal`        | Randomized; decrypt takes `c1`, `c2`; encryption accepts optional `k`.   |
| `diffie_hellman` | Key agreement only (`exchange`); shared secret verified for several parameter sets. |
| `md5`            | Merkle–Damgård, 128-bit digest, 4×16 rounds. Matches `hashlib`; status **broken** — collisions forgeable in seconds. |
| `sha1`           | 160-bit digest, 80 rounds, byte-order append then length bits. Matches `hashlib`; status **broken / deprecated** (SHAttered 2017 collision). |
| `sha256`         | Full padding + 64-round compression; matching `hashlib` on `abc`, empty input, and multi-block messages. |
| `sha512`         | 1024-bit blocks, 80 rounds, 64-bit words; matches `hashlib`.          |
| `sha3`           | Keccak sponge (rate 144/136/104/72 for 224/256/384/512); matches `hashlib`. |
| `blake2`         | Chained construction over BLAKE2s/b rounds; BLAKE2b-512 and BLAKE2s-256 match `hashlib`. |
| `blake3`         | Merkle tree of 1024-byte chunks, 7-round compression; all 35 official BLAKE3 vectors + 131-byte XOF match. |

## Security status

| Status              | Meaning                                                |
| ------------------- | ------------------------------------------------------ |
| `historic`          | Classical cipher, educational only                     |
| `broken`            | MD5 — practically broken, collisions forgeable         |
| `broken_deprecated` | SHA-1 — collision-broken and formally deprecated       |
| `deprecated`        | Broken in practice (DES 56-bit, 3DES) — study only     |
| `secure`            | AES, SHA-2, SHA-3, BLAKE2, BLAKE3 — sound when implemented correctly |
| `secure_with_padding`| RSA / ElGamal textbook forms require OAEP etc. in practice |
| `secure_with_auth`  | DH provides no authentication — MITM possible          |

## Adding a new algorithm

1. Create `app/algorithms/<name>.py` with `get_metadata()` and operation
   functions returning `build_result(...)`.
2. Register it in `app/algorithms/registry.py` with `fields` describing the UI
   form.
3. Add mapping in `app/services/algorithm_service.py` if input names differ
   from parameters (e.g. operation-sensitive `text` → `plaintext/ciphertext`).
4. Add tests in `backend/tests/algorithms/`.
5. Mirror metadata in `frontend/src/data/catalog.ts` (`ALGORITHMS` entry, theory
   in `SimulatorTabs.tsx`).