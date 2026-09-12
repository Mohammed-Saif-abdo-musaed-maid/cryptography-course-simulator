# 3D Simulation Scientific Audit — Final Report

**Scope:** every 3D algorithm adapter in `frontend/src/components/simulation3d/adapters/`
proves that its visualized states derive from real algorithm executions, not
decorative placeholders.

**Method (automated, reproducible):**
1. `backend/scripts/export_audit_fixtures.py` runs the real API dispatcher
   (`algorithm_service.execute`) with the exact demo inputs for all 35
   algorithms and writes `frontend/tests/fixtures/audit.json` (backend results,
   `extra` closure data, and backend-side round-trips).
2. `frontend/scripts/audit/run.ts` (bundled with esbuild, run headless in Node)
   builds every 3D adapter with that real backend result bound, then asserts the
   authoritative value appears in the visualized output **across all steps** and
   **in the final step**, and cross-checks the 2D engine's own computed result.
3. Reports to `frontend/tests/fixtures/audit-report.json` and
   `frontend/tests/3d-audit-report.md`.

Re-run:
```
cd backend;  .\.venv\Scripts\python.exe scripts\export_audit_fixtures.py
cd frontend; node node_modules/esbuild/bin/esbuild scripts/audit/run.ts --bundle --platform=node --format=cjs --outfile=tests/.audit/run.cjs --loader:.css=empty --loader:.svg=dataurl --loader:.png=dataurl; node tests/.audit/run.cjs
```

## Result: 34 PASS · 0 FAIL · 1 WARN · 0 ERROR

| No. | Algorithm | 3D Status | Backend result displayed (all steps) | Displayed in final step | 2D-engine cross-check | Meta present | Backend round-trip |
|----:|-----------|-----------|:---:|:---:|:---:|:---:|:---:|
| 1 | caesar | PASS | Y | Y | Y | – | Y |
| 2 | monoalphabetic | PASS | Y | Y | Y | Y | Y |
| 3 | vigenere | PASS | Y | Y | Y | Y | Y |
| 4 | playfair | PASS | Y | Y | Y | Y | Y |
| 5 | hill | PASS | Y | Y | Y | Y | Y |
| 6 | rail_fence | PASS | Y | Y | Y | Y | Y |
| 7 | columnar | PASS | Y | Y | Y | Y | Y |
| 8 | des | PASS | Y | Y | Y | Y | Y |
| 9 | triple_des | PASS | Y | Y | Y | Y | Y |
| 10 | aes | PASS | Y | Y | Y | Y | Y |
| 11 | blowfish | PASS | Y | Y | Y | Y | Y |
| 12 | twofish | PASS | Y | Y | Y | Y | Y |
| 13 | chacha20 | PASS | Y | Y | Y | Y | Y |
| 14 | aes_gcm | PASS | Y¹ | Y¹ | Y | Y | Y |
| 15 | chacha20_poly1305 | PASS | Y¹ | Y¹ | Y | Y | Y |
| 16 | sha256 | PASS | Y | Y | Y | Y | – |
| 17 | sha512 | PASS | Y | Y | Y | Y | – |
| 18 | sha1 | PASS | Y | Y | Y | Y | – |
| 19 | md5 | PASS | Y | Y | Y | Y | – |
| 20 | sha3 | PASS | Y | Y | Y | Y | – |
| 21 | blake2 | PASS | Y | Y | Y | Y | – |
| 22 | blake3 | PASS | Y | Y | Y | Y | – |
| 23 | hmac | PASS | Y | Y | Y | Y | – |
| 24 | pbkdf2 | PASS | Y | Y | –² | Y | – |
| 25 | bcrypt | PASS | Y | Y | Y | Y | – |
| 26 | scrypt | PASS | Y | Y | –² | Y | – |
| 27 | argon2 | PASS | Y¹ | Y¹ | –² | Y | – |
| 28 | hkdf | PASS | Y¹ | Y¹ | –² | Y | – |
| 29 | ecdh | PASS | Y | Y | Y | Y | – |
| 30 | x25519 | PASS | Y | Y | Y | Y | – |
| 31 | ecdsa | PASS | Y | –³ | –² | Y | – |
| 32 | ed25519 | PASS | Y | Y | –² | Y | – |
| 33 | rsa | PASS | Y | –³ | Y | Y | Y |
| 34 | diffie_hellman | PASS | Y | Y | –² | Y | – |
| 35 | elgamal | WARN | –⁴ | –⁴ | –² | Y | N |

¹ Result rendered as a hex strip / chunked cell strip (every 2-char piece of the
authoritative hash/cipher is displayed; full string is decomposed by design).
² Non-deterministic operation (random key/salt/ephemeral) — 2D-engine
cross-check not applicable; the 3D displays the backend-bound value.
³ The grouped ciphertext/result value is shown during the compute steps; the
final step is a design summary (RSA: plaintext for the decrypt illustration).
⁴ elgamal's cipher `{c1,c2}` is displayed as separate `c1`/`c2` plates in the
encrypt step, but the final "formula" step restates the formulas without numeric
values, so the backend result string is not reconstructed in the final step.

## Genuine bugs found and fixed by the audit harness

1. **md5 — client-side digest was incorrect** (`simulationShared.ts:783`).
   The MD5 core loop applied mid-round updates to the wrong registers:
   `tmp = D + rotl(sum)` then `A = tmp`, `B = B + tmp`, which is not the
   standard `B = B + rotl(sum)`, `A = D`. MD5("Hello, cryptography!") rendered
   as `4354db83ce06ea…` instead of the true `5285868a65a35928…`. Fixed to the
   canonical round; verified identical to Node/OpenSSL MD5 and to the backend
   fixture. This affected both the 2D lab and the 3D md5 adapter.

2. **chacha20 — 3D view produced zero steps** (`chacha203D.ts:169`).
   The adapter looked up stage ids `chacha-input`, `chacha-state`, … but the
   engine emits `chacha20-input`, `chacha20-state`, … so `buildSteps` always
   returned `[]` and the 3D canvas was permanently empty for ChaCha20. The
   mismatch was silent (adapter returned an empty list without error). Fixed the
   adapter to the real engine stage ids; the audit then verified every ChaCha20
   3D step against the backend cipher text.

## Prior fixes carried into this verification (all typecheck-clean)
- `interpolate()` now substitutes both `{{key}}` and `{key}` (2D + 3D titles).
- `diffieHellman.tsx`: shared-secret comparison was a tautology
  (`sAlice === sAlice`) — now `sAlice === sBob`.
- `ecdh.tsx`: displayed `dA`/`dB` now reflect the backend's actual generated
  scalars (`private_scalar` from `extra`) instead of the demo constants that
  the backend ignores.
- `caesar3D.ts`: full ciphertext (not 12-letter truncation) in the result step,
  with an explicit note when the strip is display-capped.
- `chacha203D.ts`: `qrAfterM` fallback now applies the real
  `quarter_round(0,4,8,12)`; double-round highlight is the true changed cells.
- `twofish3D.ts`: fake `['k0','k1','k2','k3']` placeholders → honest `—`.
- `blake23D.ts` / `blake33D.ts` / `sha33D.ts` / `hash3d.ts`: truthful captions,
  honest "run the operation to bind the real value" notes for placeholder
  strips; digest strips are never shown empty.
- `ecdsa3D.ts`, `vigenere3D.ts`, `hill3D.ts`: honest truncation notes for
  public-key / rail / block displays.
- `from2d.ts`: every from-2D adapter now gets honest `defaultStageMeta`
  (`level` + `operation` only — no invented values).

## Verification status
- `npm run typecheck` — clean.
- `npm run build` — clean (`tsc -b && vite build`).
- Backend `pytest -q` — 284 tests, all pass.
- Round-trips (`decrypt(encrypt(x)) == x`) for caesar, monoalphabetic,
  vigenere, playfair, hill, rail_fence, columnar, des, triple_des, aes,
  blowfish, twofish, chacha20, aes_gcm, chacha20_poly1305, rsa, hill — all
  confirm the backend itself is internally consistent.