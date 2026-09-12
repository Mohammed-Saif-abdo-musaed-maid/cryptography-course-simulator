# Architecture

## Overview

The project follows a clear two-tier separation:

```
┌──────────────────────────┐        ┌────────────────────────────┐
│  Frontend (React + Vite) │  REST  │  Backend (FastAPI)         │
│  src/pages · components  │ ─────► │  app/algorithms · services │
│  i18n (ar/en, RTL)       │  /api  │  app/api/routes/api.py     │
└──────────────────────────┘        └────────────────────────────┘
```

The frontend never computes ciphertexts itself. Every operation is POSTed to
`/api/algorithms/execute`; the backend runs the real algorithm and returns the
result plus structured `steps[]`, which the frontend renders as an expandable
step-by-step walkthrough.

## Why "real" matters

All 23 algorithms in `backend/app/algorithms/` implement the genuine algorithm
(S-boxes, round keys, compression function, square-and-multiply, key square,
etc.). Educational output is an *extra surface* on top of real computation,
so every result is reproduced from actual cryptographic math and matches
known test vectors (e.g. FIPS-197 — AES, DES standard vectors, SHA-256 digest of
`abc`).

## Backend layout

| Path                 | Responsibility                                             |
| -------------------- | ---------------------------------------------------------- |
| `app/main.py`        | App construction, CORS, global error handlers              |
| `app/api/routes/api.py`| All REST endpoints under `/api`                           |
| `app/algorithms/`    | One module per algorithm: `encrypt/decrypt/hash/exchange/generate_keys` + `get_metadata` + `build_result` |
| `app/algorithms/registry.py` | Single source of truth: operations, UI field specs, categories |
| `app/services/algorithm_service.py` | Operation-aware dispatch and type coercion (registry → module) |
| `app/services/math_service.py`     | Number-theoretic laboratory tools with worked steps        |
| `app/services/exercise_service.py` | Exercise bank + graded answers with explanations          |
| `app/services/quiz_service.py`     | Quiz bank, shuffled questions, text-based grading         |
| `app/utils/`         | `math_utils` (mod, gcd, EEA, mod_pow, totient, primes), `steps.py` (step engine), `errors.py` (exception hierarchy → error payloads) |
| `app/core/`          | Settings via pydantic-settings, logging, security (CORS)   |

## The step engine

`app/utils/steps.py` provides `step(n, title, description, input, output, detail)`
and `build_result(...)`. Every algorithm returns:

```json
{
  "algorithm": "caesar",
  "operation": "encrypt",
  "input": "HELLO",
  "parameters": {"shift": 3},
  "result": "KHOOR",
  "extra": { "...": "..." },
  "steps": [ { "step": 1, "title": "...", "description": "...",
               "input": "...", "output": "...", "detail": {...} } ]
}
```

`detail` is free-form and may contain matrices, tables, round states or nested
step lists. `main.py` serializes big integers/bytes safely into JSON-friendly
forms.

## Registry → UI contract

`registry.get_catalog()` returns, for each algorithm, a `fields` array with
`{name, type, label, required, default, min, max, placeholder}`. The frontend
`AlgorithmForm` renders these generically, and `src/data/catalog.ts` mirrors the
same metadata as a static fallback for navigation and theory. Keep the two in
sync when adding algorithms.

## Frontend design

- **Design tokens** in `src/styles/theme.css` (dark palette, CSS variables,
  light theme via `[data-theme='light']`).
- **Component library** in `src/components/ui/` (Button, Card, Tabs, Alert,
  StepViewer, MatrixViewer, ResultPanel …).
- **i18n**: `src/i18n/` holds `en`/`ar` dictionaries; `useI18n().t('a.b.c')`
  looks up dotted paths; `dir=rtl` is set automatically for Arabic. Layout CSS
  is RTL-aware (`inset-inline-*`, logical properties).
- **Lazy loading**: every page is `React.lazy` so only the visited route is
  fetched.
- **Error surface**: `ApiClientError` surfaces backend validation messages
  (422) directly in the UI.