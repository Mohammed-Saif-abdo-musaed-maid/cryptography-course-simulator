# Cryptography & Information Security Simulator — Enhancement Report

## 1. Audit Summary

- **Project:** FastAPI backend (`backend/app`) + Vite/React frontend (`frontend/src`).
- **Initial state:** 23 algorithms registered. A full audit concluded that **all 23 original algorithms were already implemented and working** (`EXISTING_ALGORITHMS` status: `IMPLEMENTED_AND_WORKING` for every entry).
- **Gaps found by the audit** (algorithms the spec required but that were genuinely missing or incomplete):

| Gap | Status before | Action |
|---|---|---|
| HMAC | Missing | Added `hmac_alg.py` |
| PBKDF2 | Missing | Added `pbkdf2.py` |
| bcrypt | Missing | Added `bcrypt_alg.py` |
| scrypt | Missing | Added `scrypt_alg.py` |
| Argon2 | Missing | Added `argon2_alg.py` |
| HKDF | Missing | Added `hkdf.py` |
| AES-GCM | Missing | Added `aes_gcm.py` |
| ChaCha20-Poly1305 | Missing | Added `chacha20_poly1305.py` |
| ECDH | Missing | Added `ecdh.py` |
| X25519 | Missing | Added `x25519.py` |
| ECDSA | Missing | Added `ecdsa_alg.py` |
| Ed25519 | Missing | Added `ed25519_alg.py` |
| RSA-OAEP | Missing in `rsa.py` | Added `encrypt_oaep` / `decrypt_oaep` |
| RSA-PSS | Missing in `rsa.py` | Added `sign_pss` / `verify_pss` |

- **No existing algorithm was removed or rebuilt.** No duplicates were introduced (e.g. SHA-3 was already present and was not re-added).

## 2. EXISTING_ALGORITHMS — Current Status

All 23 original algorithms remain **IMPLEMENTED_AND_WORKING** (verified by the full test suite).

| Category | Algorithms |
|---|---|
| classical (7) | Caesar, Monoalphabetic, Vigenère, Playfair, Hill, Rail Fence, Columnar |
| symmetric (6) | DES, Triple DES, AES, Blowfish, Twofish, ChaCha20 |
| asymmetric (2) | RSA, ElGamal |
| key_exchange (1) | Diffie–Hellman |
| hashing (7) | SHA-256, SHA-512, SHA-1, MD5, SHA-3, BLAKE2, BLAKE3 |

## 3. Additions (New Algorithms / Operations)

Phase 4 added 12 new registered algorithms, bringing the catalog at the time to **35 algorithms in 9 categories** (Phase 5 completes the set — see §9):

| Category | Count | Algorithms |
|---|---|---|
| classical | 7 | (unchanged) |
| symmetric | 6 | (unchanged) |
| asymmetric | 2 | (unchanged) |
| key_exchange | 3 | Diffie–Hellman, **ECDH**, **X25519** |
| hashing | 7 | (unchanged) |
| mac | 1 | **HMAC** (SHA-256/SHA-512, hex/base64, RFC 2104) |
| kdf | 5 | **PBKDF2**, **bcrypt**, **scrypt**, **Argon2** (id/i/d), **HKDF** (RFC 5869) |
| aead | 2 | **AES-GCM**, **ChaCha20-Poly1305** (RFC 8439) |
| signature | 2 | **ECDSA** (P-256/P-384/P-521), **Ed25519** (RFC 8032) |

RSA module extended with 2 new operations: **RSA-OAEP** (encrypt/decrypt, MGF1-SHA256) and **RSA-PSS** (sign/verify, MGF1-SHA256, MAX_LENGTH salt).

### Principles applied to every addition
- All cryptographic operations are performed by the well-reviewed `cryptography` / `bcrypt` / `argon2-cffi` libraries — **no "fake" crypto**. Steps shown in the UI are computed from real intermediate values.
- Strict input validation with **user-safe error messages** and distinct error codes (`invalid_key`, `invalid_curve`, `authentication_failed`, `decryption_failed`, …).
- Randomness uses the **operating-system CSPRNG** (`secrets`, `token_bytes`).
- **UTF-8 in, Hex/Base64 out**; Arabic/Unicode inputs tested end-to-end.
- Hashing, encryption, password hashing and key derivation are kept in separate categories and clearly labelled (e.g. `not_encryption_note`).

## 4. Fixes Applied

1. **HMAC verify with base64 output** (`hmac_alg.py`) — verify attempted to match the ASCII representation instead of base64-decoding the MAC; this would have rejected valid base64 MACs. Fixed to `b64decode`. (Exposed by the new test suite.)
2. **ECDH public-key serialization** — EC public keys cannot be serialized with `Encoding.Raw`; switched to `X962/UncompressedPoint`.
3. **ECDSA private-key serialization** — `serialization.PrivateFormat.Raw` is unsupported for EC private keys in `cryptography`; `generate_keys` now exposes `private_hex = hex(scalar)` and no longer attempts private-byte serialization.
4. **bcrypt / Argon2 operation label** — the `build_result` operation was reported as `hash`; corrected to `hash_password` so the frontend operation keys (`hash_password` / `verify`) match the registry.
5. **Registry import typo** — a Cyrillic `с` in `hmс_alg` was breaking the import linkage to the new HMAC module.
6. **Existing API test expectations** — `backend/tests/api/test_api.py` updated from “23 algorithms” to the new catalog (35) with matching category counts.

## 5. Test Results

```
backend: 283 passed in 3.66s   (was 190 before Phase 8)
frontend: npm run build → ✓ built successfully (vite), no TypeScript errors
```

New test files added under `backend/tests/algorithms/`:
- `test_mac_kdf.py` — HMAC (RFC 4231 vectors), PBKDF2 (RFC 7914 A.1), scrypt (RFC 7914 vector), bcrypt, Argon2, HKDF (RFC 5869 A.1); salt randomness, tamper/wrong-password rejection, validation errors.
- `test_aead.py` — AES-GCM & ChaCha20-Poly1305 round-trips, tag-authentication failure on tampered/wrong-key/wrong-AAD, key/nonce length validation, Unicode round-trip.
- `test_key_exchange.py` — ECDH shared-secret match across P-256/384/521, X25519 independent re-derivation of the shared secret, key shapes, teaching-warning presence.
- `test_modern_signatures.py` — ECDSA & Ed25519 sign/verify, tampered-message and wrong-key rejection, deterministic Ed25519, RSA-OAEP round-trip + tamper rejection, RSA-PSS sign/verify + wrong-key/tamper rejection.

## 6. Files Changed

**Backend**
- `backend/app/algorithms/registry.py` — new `__init__` imports, category labels for mac/kdf/aead/signature, 12 new algorithm entries, RSA entry extended to 7 operations, `categories_summary()` updated.
- `backend/app/services/algorithm_service.py` — operation-conditional request→input mapping for RSA (OAEP/PSS) and the new KD/WF/key-exchange ops, plus special `generate_keys` handlers for ECDSA and Ed25519.
- `backend/app/algorithms/` — new: `hmac_alg.py`, `pbkdf2.py`, `bcrypt_alg.py`, `scrypt_alg.py`, `argon2_alg.py`, `hkdf.py`, `aes_gcm.py`, `chacha20_poly1305.py`, `ecdh.py`, `x25519.py`, `ecdsa_alg.py`, `ed25519_alg.py`; extended: `rsa.py` (OAEP + PSS).
- `backend/tests/api/test_api.py` — updated catalog/category assertions.
- `backend/tests/algorithms/` — 4 new test modules (93 tests).
- `requirements.txt` — added `bcrypt==4.2.1`, `argon2-cffi==23.1.0`.

**Frontend**
- `frontend/src/types/index.ts` — `Category` union extended (`mac | kdf | aead | signature`).
- `frontend/src/data/catalog.ts` — 12 new algorithm descriptors, `CATEGORIES_ORDER` (9 categories), `operationFormFields` for all new operations.
- `frontend/src/data/categoryMeta.ts` — **new shared** `CATEGORY_ICONS` map used by the Sidebar and Dashboard.
- `frontend/src/data/grouping.ts` — rewritten to derive groupings from `CATEGORIES_ORDER`.
- `frontend/src/layouts/Sidebar.tsx` — iterates the shared `CATEGORY_ICONS` (no per-version duplicate list).
- `frontend/src/pages/Dashboard.tsx` — uses the shared category icons.
- `frontend/src/components/simulator/SimulatorTabs.tsx` — theory + examples for the 12 new algorithms.
- `frontend/src/components/simulator/AlgorithmPage.tsx` — invention-year badges for the new algorithms.
- `frontend/src/i18n/en.ts`, `frontend/src/i18n/ar.ts` — category labels for mac / kdf / aead / signature (English + Arabic).

## 7. Security Findings

- **No fake crypto:** every new operation computes through `cryptography` / `bcrypt` / `argon2-cffi`; the UI shows real steps and real values.
- **Fail-closed designs:** AES-GCM, ChaCha20-Poly1305 and RSA-OAEP return *no plaintext* when authentication/decryption fails (tamper detection tested); RSA-PSS/ECDSA/Ed25519 verification returns `INVALID`.
- **Key/salt hygiene:** salts and nonces are CSPRNG-generated; AEAD requires the caller-supplied 96-bit nonce and documents never reusing a `(key, nonce)` pair.
- **Educational disclosure policy:** ECDH, X25519, RSA-OAEP/PSS expose the generated private keys and shared secrets **only for teaching**, with a bilingual Arabic warning: `القيم السرية المعروضة هنا لأغراض تعليمية فقط.`
- **Bound checking:** bcrypt 72-byte password limit, cost factor range `[4,31]`; Argon2 variant/time/memory/parallelism ranges; scrypt `N` power-of-two and simulator caps; KDF length bounds — all validated before execution.
- **No secrets in the repo:** no keys or credentials stored; private-key material exists only transiently in the algorithm response for the educational display.

## 8. Recommendations

1. **Prefer modern primitives in the UI help text:** Argon2id for new password storage, scrypt/Argon2 over PBKDF2 where memory-hardness matters; X25519/ECDH combined with signatures (or a PSK) for authenticated key exchange.
2. **Keep RSA ≥ 2048-bit** and use OAEP/PSS (both are already implemented here) rather than textbook PKCS#1 v1.5 in any real usage.
3. **Nonce discipline for AEAD** should be taught explicitly — generation per encryption, fail-closed on reuse (documented in both modules).
4. Future additions should follow the same pattern: registry entry + isolated module + service mapping + frontend descriptor + theory/examples + tests, with no shared mutable state.
5. Re-run `pytest` (backend) and `npm run build` (frontend) after any catalog or service change.

## 9. Phase 5 — Completion of Missing Algorithms

Phase 5 closed the remaining curriculum gaps. The catalog is now **47 algorithms in 9 categories** (35 → 47), each with a real backend, capability metadata, theory + verified examples, and 2D + 3D simulations derived from the live execution trace.

### New algorithms (12 modules)

| Category | Count | Algorithm | Security status |
|---|---|---|---|
| hashing | 10 (+3) | **SHA-224**, **SHA-384**, **RIPEMD-160** | secure / secure / deprecated |
| symmetric | 9 (+3) | **AES-CBC** (PKCS#7), **AES-CTR**, **Camellia** (RFC 3713) | secure_with_padding / secure_with_auth / secure |
| aead | 3 (+1) | **AES-CCM** (SP 800-38C, CTR + CBC-MAC tag) | secure |
| mac | 3 (+2) | **CMAC** (SP 800-38B), **Poly1305** (RFC 8439 vector) | secure / secure_with_auth |
| key_exchange | 4 (+1) | **X448** (RFC 7748) | secure_with_auth |
| signature | 4 (+2) | **DSA** (FIPS 186, 2048/3072/4096), **RSA-PSS** (PKCS#1 v2) | secure / secure |

Totals: classical 7 · symmetric 9 · asymmetric 2 · key_exchange 4 · hashing 10 · mac 3 · kdf 5 · aead 3 · signature 4 = **47 modules, 9 categories**.

### What was delivered for every algorithm
- **Real backend module** (`cryptography` / `hashlib`; RIPEMD-160 honours IE), registry + dispatch-special handlers, operation-specific field mapping.
- **Capability registration** — hashing/cipher/aead/mac/key-exchange/digital-signature flags and the unified **MAC lab** (`generate`/`verify` with hex+base64) and signature labs.
- **File lab** where binary-safe (AES-CCM hashes files server-side; hashes verify integrity).
- **2D engine + 3D scene** built from the real trace via `createAdapterFromEngine`; i18n `simulation.*` blocks in English **and** Arabic.
- **Theory** paragraphs and **backend-verified examples** (`examples.ts`, executed through `algorithm_service.execute` and round-trip checked).
- **Tests** — KAT vectors where standards exist (SHA-224/384, RIPEMD-160('abc'), RFC 8439 Poly1305, AES-CBC/CTR/CCM round-trips, Camellia RFC 3713-style blocks, CMAC, X448 shared-secret derivation, DSA/RSA-PSS sign→verify) plus frontend smoke tests binding the real `extra` values.

### NOT IMPLEMENTED (deliberately)
- **Serpent** — replaced in every standard by AES modes; omitted to keep the catalog narrowly curriculum-relevant.
- **ChaCha20-Poly1305 is present**, but the standalone **XChaCha20** AEAD (24-byte nonce) is **not implemented** — ChaCha20 core + the standard 12-byte RFC 8439 construction already cover the teaching goal.

### Fixes applied in Phase 5
- AES-CTR engine mislabelled plaintext/ciphertext in the decrypt view — pt/ct bindings corrected so the keystream (P ⊕ C) is real.
- AES-CCM engine now expects the combined ciphertext+tag in `ciphertext_hex` (SP 800-38C format) and reads `tag_length`.
- DataBlock `tone` extended with `'error'`/`'muted'` (CSS classes already existed); stray imports/exports removed under strict type-check.
- Camellia engine aligned with the catalog field names (`block` / `key`).

### Phase 5 test results
```
backend:  682 passed, 1 skipped  (python -m pytest -q)
frontend: npm run typecheck �?? no errors (tsc -b --noEmit)
          npm test            �?? 34 passed (4 files: labTabs, labTabsRendering,
                                phase5Engines.smoke, traceFidelity)  �?? 7 new trace tests
          npm run build       �?? vite build succeeds
```

### Phase 5 �?? P1 + P2 deep trace fidelity (12 deltas)
All 12 Phase-5 engines now drive their 2D step timeline **and** 3D scene from the real backend execution trace, not client-side re-computation, through the single pipeline `backend result.steps/extra` → `SimulationContext.trace` → trace-aware stage metadata (`defaultStageMeta` in `from2d.ts`) → shared step timeline + 3D scene.

- **Real values bound to steps** (each verified present in `extra` and step `detail` by `contract_check.py`): AES-CBC blocks/xor-states (CBC chain), AES-CTR counters + keystream, AES-CCM auth states + enc counters + keystream, SHA-224/384 & RIPEMD-160 padded message blocks, CMAC subkeys K1/K2 + MAC states + final block, Poly1305 accumulator states + clamped R, DSA digest/r/s, RSA-PSS digest/EM/trailer 0xBC/salt length, X448 clamped private keys. Backend bugs fixed while binding real values (documented above in the Phase 5 fixes for AES-CCM/CBC/CTR + Poly1305 final block).
- **Trace-driven controls:** Step Forward / Step Back advance the current step's inputs/outputs/why against the live trace (previously stepping was decorative); counter shows `N / M` real steps. `traceIndex` is left undefined on decrypt operations where the backend legitimately emits no steps (CBC/CTR/CCM decrypt), and engines fall back to client-side pre-run values in those cases so existing smoke tests are untouched.
- **New tests** (`frontend/src/test/traceFidelity.test.tsx`, 7 tests): (1) displayed final == backend output, (2) trace has meaningful stages, (3) `SimulationContext` receives the backend trace, (4) 2D consumes trace values, (5) 3D consumes the same trace, (6) Step Forward advances one trace state, (7) Step Back restores the previous state. Backend parity covered by `backend/tests/algorithms/test_trace_fidelity.py`.
- **Honest limitations (documented, not faked):** RSA-PSS EM is fully masked by MGF1, so the recovered EM carries **no leading 0x00** and the digest is **not** visible in cleartext �?? the PSS test asserts the real invariants (`em[-1]==0xBC`, 256-byte EM, salt 222) and the RSA identity `s^e mod n == EM`. Camellia exposes no per-round keys via `cryptography`, so its scene shows real inputs/outputs with the subkey step as a documented lab limitation.

### Catalog-wide Phase 5 status
- All 47 algorithms are **IMPLEMENTED_AND_WORKING**; verifiable against published vectors.
- Security statuses are honest per algorithm — deprecated (`ripemd160`), authenticated-use-only (`aes_cbc`, `aes_ctr`, `x448`, `poly1305`), and `secure` for the rest.

## 10. Phase 5 — Educational-Fidelity Pass (3D scenes over the real trace)

Goal of this pass (per the follow-up directive): every 3D simulation explains the actual algorithm; the scene is never decoration; steps come from the real backend trace, never fabricated; unavailable values are labelled honestly as "Educational representation"; private keys are never shown, logged or exposed in the 3D scenes.

### 10.1 Why RSA-PSS showed "1 / 1"
`AlgorithmPage.tsx` opens each algorithm with `useSimulator(supportedOps[0])`, and the RSA-PSS catalog lists `['generate_keys', 'sign', 'verify']` — so the default page was the **generate_keys** operation. The old 2D `rsaPssEngine.build` emitted **one** keygen stage with no `traceIndex`, although the backend `generate_keys` run emits **4** real trace steps (primes → e → d → export). One stage + one step ⇒ the 3D timeline showed a single `1 / 1` "Key generation" step and Step Forward was a no-op. The same single-keygen-stage defect existed for DSA.

### 10.2 Real trace states now exposed (backend = source of truth)
| Algorithm / op | Before | After |
|---|---|---|
| RSA-PSS generate_keys | 1 stage (no traceIndex) | **4 stages**, traceIndex 1–4 = 4 real steps |
| RSA-PSS sign | 3 stages, no trace binding | 3 stages, traceIndex 1–3 bound to hash / PSS-encode / s=EMᵈ |
| RSA-PSS verify | backend emitted 0 steps | **backend now emits 3 real steps** (hash again → EM′=sᵉ mod n + trailer → encoding verdict); 3 stages bound 1:1 |
| DSA generate_keys | 1 stage | **3 stages** = p,q,g / private x / public y |
| DSA sign | 3 stages | 3 stages bound 1:1 (hash / nonce k / (r,s)) |
| DSA verify | backend emitted 0 steps | **backend now emits 2 real steps** (hash again → v≡r verdict); 2 stages bound 1:1 |

RSA-PSS now exposes **10** real trace states and DSA **8** (all driven by `traceIndex` → `defaultStageMeta` → Step Inspector inputs/outputs/changedValues). Step Forward / Step Back / Play now walk these real states on both the 2D timeline and the 3D scene.

### 10.3 RSA-PSS 3D scene: real values vs educational representations
Real values rendered from the execution trace when a matching run exists:
- `H(m)` digest (`digest_hex`), the encoded message `EM` / `EM′` (`em_hex`, equals sᵉ mod n — asserted in tests), trailer byte `0xBC` probe (`em_trailer_checked`), salt length 222 (`salt_length_bytes` = emLen − HLen − 2), the signature (`signature_hex`), the public key PEM, and the final `VALID` / `INVALID` verdict.

Honest "Educational representation" / hidden (never faked, never exposed):
- **p, q** are never shown; **private d** is labelled `d = e⁻¹ mod λ(n) — never displayed`; the salt bytes and the `H‖psSplit` layout **inside** EM cannot be read back byte-wise (MGF1 fully masks them — a documented PSS limitation, not a fabrication); before the first Run the digest/EM/signature slots read "Educational representation — real after Run"; the public PEM is shown truncated (label says "truncated"). The 2D lab and 3D scene never log or render private key material.

### 10.4 Phase-5 simulations improved
- **RSA-PSS 3D** (`rsaPss3D.ts`) rebuilt with `verticalPipeline` / `activeValuePlate` (`pipeline.ts`): sign pipeline MESSAGE → HASH → PSS ENCODING → EM → RSA PRIVATE → SIGNATURE revealing one concept per real trace step, keygen 4-slot pipeline, verify 6-slot pipeline ending in a tone-coloured VERDICT plate.
- **DSA 3D** (`dsa3D.ts`) rebuilt the same way: sign (MESSAGE → HASH → NONCE k → (r,s) → SIGNATURE), verify (SIGNATURE → HASH → PUBLIC CHECK → VERDICT), keygen 3-slot.
- **Camellia 3D**: the round-subkey stage now reads "round subkeys not exposed byte-wise by the library (educational representation)" instead of implying exposed subkey bytes.
- Visuals preserved: stable pipeline camera framing (steps reveal along Y with the camera unchanged), existing tone legend / dark-light / RTL / Arabic / zoom / speed handling untouched; no particles, spinning decorations, glow or arbitrary arrows were added.

### 10.5 Tests added / strengthened
- `backend/tests/algorithms/test_trace_fidelity.py` +3 backend truth tests: RSA-PSS verify emits 3 real steps (digest re-match, recovered EM equals the signed EM, `0xBC` trailer, VALID output); RSA-PSS verify rejects a tampered signature (INVALID); DSA verify emits 2 real steps with real r.
- `frontend/src/test/rsaPssDsaDepth.test.tsx` (+7): fresh RSA-PSS sign page = 3 stages (not 1/1); generate_keys exposes 4 real states; sign stages bound 1:1 to trace with real signature value plates; verify exposes 3 real states + VALID verdict plate; unbound slots say "Educational representation" and private d is never displayed; DSA sign = 3 / verify = 2 with real verdict; fresh DSA page = 3 stages.
- `frontend/src/test/phase5Engines.smoke.test.ts` — DSA generate_keys expectation updated from `['dsa-keygen']` to `['dsa-keygen1','dsa-keygen2','dsa-keygen3']` (nothing weakened).

### 10.6 Current status
```
backend:  685 passed, 1 skipped   (python -m pytest backend/tests)
frontend: npm test        → 41 passed (5 files: labTabs, labTabsRendering,
                             phase5Engines.smoke, traceFidelity, rsaPssDsaDepth)
          npm run typecheck → no errors (tsc -b --noEmit)
          npm run build    → vite build succeeds
```
Existing tests were preserved (traceFidelity's 7 backend-trace→2D→3D assertions all still pass; smoke tests for `rsa_pss-verify` / `dsa-verify` verdict ids kept).
## 11. Phase 5  AES-CBC Block-Level 3D Educational Simulation

The directive ("AES-CBC 3D educational simulation") called for a per-block,
backend-truthful walk of Cipher Block Chaining:

  P1 + IV -> XOR -> AES -> C1  ->  C1 + P2 -> XOR -> AES -> C2  (visible chaining)

Implemented and validated without touching any other algorithm (no Phase 6):

### 11.1 Backend: real per-block trace (authoritative)
- `backend/app/algorithms/aes_cbc.py`
  - Encrypt now emits 2 + 2N steps (1 setup, 2 padding, then per block i:
    step 2i+1 "XOR block i with prev" with detail {block, prev_label,
    prev_hex, plaintext_hex, xored_hex}, step 2i+2 "AES-encrypt block i"
    with detail {block, xored_hex, ciphertext_hex}).
  - Decrypt now emits 2N + 2 steps (1 setup, per block i: step 2i AES-decrypt
    {block, ciphertext_hex, decrypted_hex} and step 2i+1 XOR-to-recover
    {block, prev_label, prev_hex, decrypted_hex, plaintext_hex}, final step
    2N+2 Remove PKCS#7 padding {padded_hex, plaintext_hex}).
  - Both `extra` payloads now include `prev_states` (IV then each previous
    ciphertext block); `_prev_label(i)` = "C0 = IV" or "C{i-1}".
  - Per-block states come ONLY from the real trace - there is no client-side
    AES/XOR computation and no "bump 4/4 to 8/8" shortcut.

### 11.2 Frontend 2D: one stage per real block state
- `frontend/src/components/simulation/renderers/aesModes.tsx`
  - `aesCbcEngine.build` rewritten: per-block stage ids
    aes_cbc-xor-{i} / aes_cbc-aes-{i} (encrypt, traceIndex 2i+1 / 2i+2) and
    aes_cbc-dec-{i} / aes_cbc-xorD-{i} (decrypt, traceIndex 2i / 2i+1), plus
    aes_cbc-input / aes_cbc-padding / aes_cbc-unpad / aes_cbc-result.
    The old coarse `aes_cbc-chain` stage is gone.
  - Every stage view carries per-block real values (prev from `prev_states`,
    XOR in/out, AES in/C) plus a `hist` array and prevLabel "C0 = IV"/C{i-1};
    the block-count N is sourced from the backend arrays
    (plaintext_blocks / ciphertext_blocks / padded_plaintext_hex) and only
    falls back to a LAYOUT-only count from input length before a run.
  - When a block value is not yet bound, the 2D view shows the honest note
    "Educational representation - run the simulator to bind the real block
    values." Padding is only displayed once the backend returns its real
    padded hex (`hasPadding = hasResult && padded_plaintext_hex`).
  - `titleArgs`/`descArgs` fix tokens `{i}`/`{prev}`/`{n}` so titles render
    correctly (e.g. "XOR block 1 with C0 = IV").

### 11.3 3D: pipeline columns with visible chaining (visualization only)
- `frontend/src/components/simulation3d/adapters/aesCbc3D.ts` (rewritten; no
  client crypto - it maps the 2D engine stages to scene objects)
  - Per-block columns: encrypt P -> XOR -> AES_K -> C; decrypt
    C -> AES-1_K -> M -> XOR -> P. A chaining arrow runs from the previous
    column's C plate into the next column's XOR gate; block 1 draws the IV
    feed (key tone); an inactive windowed column shows a muted "prev C0 = IV"
    stub. A "Block i / N" tag sits above the current column; up to 4 columns
    are visible centred on the current block with a "... N more" indicator.
  - Every step carries its own camera (`camToObjects`), so the framing follows
    the active block. Values on plates are SHORT previews (16 hex chars + ...);
    the full real value lives in the Step Inspector (backend provenance).
  - `cbcMeta` builds semantic inspector data: event BLOCK_ENCRYPTED /
    BLOCK_DECRYPTED / XOR_EXECUTED / PADDING_APPLIED / PADDING_REMOVED, the
    formula, named inputs/outputs, changedValues and `source`:
    'backend' (real trace) vs 'educational' (honest placeholder). AES keys are
    never placed into the scene or the inspector and are never logged.

### 11.4 Shared Step Inspector additions
- `Simulation3DStepPanel.tsx` + `src/styles/simulation3d.css`
  - New `source` provenance badge ("Real backend value" / "Educational
    representation"), so an observer can tell real values from placeholders.
  - Long hex values truncate with ellipsis, click to expand/collapse, with a
    copy button (clipboard failures are silent). i18n keys added to en.ts and
    ar.ts; CSS ellipsis added to the before/after change table cells.

### 11.5 Tests
- Backend `backend/tests/algorithms/test_trace_fidelity.py`:
  + `test_cbc_encrypt_steps_chain_block_by_block`,
    `test_cbc_decrypt_steps_chain_block_by_block`; existing CBC tests now
    also assert `prev_states == [IV] + ciphertext_blocks[:-1]`.
- Frontend `frontend/src/test/aesCbcDepth.test.tsx` (11 tests) covering the
  19 directive items: trace reaches SimulationContext; P1 / P2 / IV map to the
  per-block XOR inputs; XOR input/output and AES input are the real trace
  values; C1/C2 bind via 3D step meta; chaining relationship (prev = C1 feeds
  block 2) with a visible chain arrow; "Block i / N" tag; 2D stages and 3D
  steps are 1:1; Step Forward / Step Back / Restart via the playback hook
  (mock canvas); 3D reads every value from the SimulationContext extra (two
  different extras prove nothing is hardcoded) and identical contexts produce
  identical scenes (no random values); decrypt mode binds the C -> M -> P
  chain (2N+2 states); unbound runs are honest (source 'educational',
  placeholders, no invented ciphertext); the Step Inspector renders the
  provenance badge and expand/copy behaviour.
- `frontend/src/test/phase5Engines.smoke.test.ts` AES-CBC expectations
  updated to the per-block id list (7 stages for the 2-block fixture).
- `frontend/src/test/traceFidelity.test.tsx` tests 4, 6, 7 updated to the
  per-block traceIndex mapping and the 7-stage counter ("Hello,
  cryptography!" -> 2 padded blocks) - nothing weakened.

### 11.6 Current status
```
backend:  687 passed, 1 skipped   (python -m pytest -q -o addopts=)
frontend: npm test        -> 52 passed (6 files, incl. aesCbcDepth +11)
          npm run typecheck -> no errors (tsc -b --noEmit)
          npm run build    -> vite build succeeds
```
Verified same-SimulationContext consumption: the 3D adapter calls
`aesCbcEngine.build(ctx)` and merely renders those stages; it never computes
AES/XOR/ciphertext/padding. Provenance is explicit in the UI via the new
badge. Known limits: in-scene glyphs stay short Latin math labels (P/C/X/M
plates with truncated hex) for readability; full values are always in the
portable (dir=ltr) inspector; traditional Arabic shaping/RTL live entirely in
the DOM panel, so they remain correct.
