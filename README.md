# 🔐 Cryptography Course Simulator

An interactive educational platform for the **Cryptography & Information Security**
university course. It lets students run real cryptographic algorithms through a
modern web interface, watch every intermediate step, and verify the results
against well-known test vectors.

Every operation is executed genuinely on the backend — no placeholder output.
The simulator is built for students who want to *understand how an algorithm
works*, not just get an answer: each request returns a structured, human-readable
step-by-step trace (AES round states, DES S-boxes, RSA key generation, Diffie–Hellman
shared-secret derivation, modular-exponentiation tables, and more).

[![GitHub stars](https://img.shields.io/github/stars/Mohammed-Saif-abdo-musaed-maid/cryptography-course-simulator?style=flat-square)](https://github.com/Mohammed-Saif-abdo-musaed-maid/cryptography-course-simulator/stargazers)
![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![Algorithms](https://img.shields.io/badge/algorithms-35-0ea5e9?style=flat-square)
![Tests](https://img.shields.io/badge/tests-283%20passing-22c55e?style=flat-square)
![i18n](https://img.shields.io/badge/i18n-Arabic%20RTL%20%2B%20English-22d3ee?style=flat-square)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Algorithm Catalog](#algorithm-catalog)
- [Educational Workflow](#educational-workflow)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Example Execution](#example-execution)
- [Testing](#testing)
- [Security & Educational Disclaimer](#security-and-educational-disclaimer)
- [Limitations](#limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Project Overview

The **Cryptography Course Simulator** is a full-stack educational laboratory
covering classical ciphers, modern symmetric and asymmetric encryption,
authenticated encryption, key exchange, digital signatures, hash functions,
message authentication codes, and password-hashing / key-derivation functions.

**What it allows users to do:**

- Run **35 real algorithms** with encrypt / decrypt / hash / sign / verify /
  key-generation / key-exchange operations.
- Watch a **step-by-step execution trace** for every operation, with the actual
  intermediate values (S-boxes, round keys, Feistel rounds, square-and-multiply
  rows, sponge states, etc.).
- Verify results against **known test vectors** (FIPS-197 AES, DES official
  vectors, RFC 8439 ChaCha20, RFC 4231 HMAC, RFC 5869 HKDF, official
  BLAKE3/TWOFISH vectors, SHA-2/3 vs `hashlib`, and more).
- Work through **19 practice exercises**, a **quiz arena with a question bank**,
  and a **mathematics laboratory** (GCD, Extended Euclidean, modular inverse,
  primality, totient, modular exponentiation) with worked steps.
- Switch between **English and Arabic** with full RTL support.

**How it helps students:** instead of memorising formulas, students can feed
their own inputs through an algorithm, read the derivation of each step, and
compare the output with published standards. The frontend never computes
ciphertexts itself — the backend runs the real algorithm and returns the trace,
which the frontend renders as an expandable walkthrough.

**Intended use:** a companion tool for the *Cryptography & Information Security*
course — lectures, self-study, laboratory sessions, and exam preparation.

---

## Features

| Feature | Description | Status |
| --- | --- | --- |
| Real algorithm execution | 35 algorithms implemented and executed on the backend; results match published test vectors | Implemented |
| Encryption & decryption | Classical, symmetric, asymmetric and AEAD operations with genuine intermediate states | Implemented |
| Step-by-step visualization | Structured `steps[]` per operation (round states, key schedules, matrices, tables) rendered in the UI | Implemented |
| 2D simulation engine | Visual, animated walkthrough of each algorithm's data flow | Implemented |
| 3D simulation | Interactive 3D visualizations (Three.js) with playback controls and legends | Implemented |
| Algorithm explanations | Theory, examples and security-status tabs for every algorithm, in English and Arabic | Implemented |
| Mathematics laboratory | GCD, Extended Euclidean, modular inverse, primality, totient, modular exponentiation with worked steps | Implemented |
| Practice exercises | 19 graded exercises with instant feedback and explanations | Implemented |
| Quiz arena | Generate shuffled quiz questions (39-question bank), grade answers with per-question explanations | Implemented |
| Algorithm comparison | Side-by-side comparison of algorithms and modes | Implemented |
| API integration | REST API under `/api` consumed by the frontend; interactive Swagger docs | Implemented |
| Language support | English and Arabic (العربية) with automatic RTL layout | Implemented |
| Theming | Dark cybersecurity theme by default, with a light theme variant | Implemented |
| Automated testing | 283 backend tests (known vectors, round-trips, API, lifecycle) — all passing; frontend strict type-check | Implemented |

---

## Algorithm Catalog

**35 algorithms, 9 categories.** The backend keeps a single-source-of-truth
registry (`backend/app/algorithms/registry.py`) that drives both the API and the
frontend forms. Each entry carries a `security_status` that classes the
algorithm honestly:

| Status | Meaning |
| --- | --- |
| `historic` | Classical cipher — educational only, never for real data |
| `broken` | MD5 — collision-resistant security is practically broken |
| `broken_deprecated` | SHA-1 — broken and formally deprecated |
| `deprecated` | DES / 3DES / Blowfish — insecure for modern use; study only |
| `secure` | Sound when implemented correctly with good parameters |
| `secure_with_padding` | Textbook RSA / ElGamal — require OAEP / proper randomness in practice |
| `secure_with_auth` | Key exchange only — provides no authentication (MITM risk) |

### Classical Ciphers *(educational implementations — historic)*

| Algorithm | Purpose | Operations | Status |
| --- | --- | --- | --- |
| Caesar Cipher | Fixed-shift substitution | Encrypt / Decrypt / Brute-force (26 candidates) | Complete |
| Monoalphabetic Substitution | One-to-one letter substitution | Encrypt / Decrypt / Generate alphabet | Complete |
| Vigenère Cipher | Polyalphabetic substitution with a keyword | Encrypt / Decrypt | Complete |
| Playfair Cipher | Digraph substitution on a 5×5 key square | Encrypt / Decrypt | Complete |
| Hill Cipher | Matrix (linear-algebra) block cipher over Z/26Z | Encrypt / Decrypt (2×2, 3×3) | Complete |
| Rail Fence Cipher | Zig-zag transposition over n rails | Encrypt / Decrypt | Complete |
| Columnar Transposition | Row-write / key-ordered column-read | Encrypt / Decrypt | Complete |

### Symmetric Encryption

| Algorithm | Purpose | Operations | Status |
| --- | --- | --- | --- |
| DES | 64-bit Feistel block cipher, 56-bit key, 16 rounds | Encrypt / Decrypt | Complete · deprecated |
| 3DES (Triple DES) | DES applied three times (EDE) | Encrypt / Decrypt | Complete · deprecated |
| AES (Rijndael) | 128-bit block cipher, 128/192/256-bit keys (FIPS-197) | Encrypt / Decrypt | Complete · secure |
| Blowfish | Variable-key (32–448-bit) Feistel cipher | Encrypt / Decrypt | Complete · deprecated |
| Twofish | 128-bit block cipher, AES finalist | Encrypt / Decrypt | Complete · secure |
| ChaCha20 | RFC 8439 stream cipher (TLS 1.3) | Encrypt / Decrypt | Complete · secure |

### Authenticated Encryption (AEAD)

| Algorithm | Purpose | Operations | Status |
| --- | --- | --- | --- |
| AES-GCM | Authenticated encryption: AES-CTR + GHASH tag | Encrypt / Decrypt (tamper detection) | Complete · secure |
| ChaCha20-Poly1305 | RFC 8439 authenticated stream cipher | Encrypt / Decrypt (tamper detection) | Complete · secure |

### Message Authentication (MAC)

| Algorithm | Purpose | Operations | Status |
| --- | --- | --- | --- |
| HMAC | Keyed hash for integrity/authenticity (RFC 2104) | Sign / Verify (SHA-256/SHA-512, hex/base64) | Complete · secure |

### Password Hashing & Key Derivation (KDF)

| Algorithm | Purpose | Operations | Status |
| --- | --- | --- | --- |
| PBKDF2 | Iterated password hashing (RFC 8018) | Derive / Verify | Complete · secure |
| bcrypt | Adaptive Blowfish-based password hash | Hash password / Verify | Complete · secure |
| scrypt | Memory-hard key derivation (RFC 7914) | Derive / Verify | Complete · secure |
| Argon2 | PHC winner, memory-hard (argon2id/i/d) | Hash password / Verify | Complete · secure |
| HKDF | Extract-and-expand key derivation (RFC 5869) | Derive | Complete · secure |

### Asymmetric Encryption

| Algorithm | Purpose | Operations | Status |
| --- | --- | --- | --- |
| RSA (textbook) | Public-key crypto from the factoring problem | Encrypt / Decrypt / Generate keys | Complete · needs OAEP in practice |
| RSA-OAEP | RSA with OAEP padding (MGF1-SHA256) | Encrypt / Decrypt | Complete · secure with padding |
| RSA-PSS | RSA probabilistic signatures (MGF1-SHA256) | Sign / Verify | Complete · secure with padding |
| ElGamal | Randomized encryption on the DH problem | Encrypt / Decrypt / Generate keys | Complete · needs proper randomness |

### Key Exchange

| Algorithm | Purpose | Operations | Status |
| --- | --- | --- | --- |
| Diffie–Hellman | Shared-secret agreement over an insecure channel | Exchange | Complete · no authentication |
| ECDH | Elliptic-curve Diffie–Hellman (P-256/384/521) | Exchange | Complete · no authentication |
| X25519 | Curve25519 Diffie–Hellman (RFC 7748) | Exchange | Complete · no authentication |

> **Key exchange is not encryption.** These protocols establish a *shared
> secret* that can later be used to derive encryption keys — they do not, by
> themselves, keep messages confidential.

### Digital Signatures

| Algorithm | Purpose | Operations | Status |
| --- | --- | --- | --- |
| ECDSA | Elliptic-curve signatures (FIPS 186-4) | Generate keys / Sign / Verify | Complete · secure |
| Ed25519 | RFC 8032 deterministic signatures | Generate keys / Sign / Verify | Complete · secure |

### Hash Functions

| Algorithm | Purpose | Operations | Status |
| --- | --- | --- | --- |
| SHA-256 | One-way 256-bit digest | Hash | Complete · secure |
| SHA-512 | One-way 512-bit digest | Hash | Complete · secure |
| SHA-1 | Legacy 160-bit digest | Hash | Complete · broken / deprecated |
| MD5 | Legacy 128-bit digest | Hash | Complete · broken |
| SHA-3 | Keccak sponge (224/256/384/512) | Hash | Complete · secure |
| BLAKE2 | Fast parameterized hash (b-512 / s-256) | Hash | Complete · secure |
| BLAKE3 | Merkle-tree hash with extendable output | Hash | Complete · secure |

### Implementation notes

- **Classical ciphers and the "textbook" algorithms** (RSA raw, ElGamal,
  Diffie–Hellman, SHA-1/SHA-2/SHA-3/MD5/BLAKE2/BLAKE3, DES/3DES/AES/Blowfish/
  Twofish/ChaCha20) are **custom educational implementations** written from
  scratch for teaching (S-boxes, key schedules, compression functions,
  square-and-multiply, etc.).
- **Modern library-backed primitives** (HMAC, PBKDF2, scrypt, Argon2, HKDF,
  AES-GCM, ChaCha20-Poly1305, ECDH, X25519, ECDSA, Ed25519, RSA-OAEP/PSS,
  bcrypt) are implemented on top of the well-reviewed `cryptography`,
  `bcrypt` and `argon2-cffi` libraries. The UI still surfaces real intermediate
  values for teaching.
- Textbook RSA and ElGamal are **educational demonstrations**, not production
  cryptography.

---

## Educational Workflow

The application guides the student through a clear loop:

```text
Open an algorithm page
        ↓
Choose an operation (encrypt / decrypt / hash / sign / verify / …)
        ↓
Configure the key / parameters (form fields adapt to the algorithm)
        ↓
Execute the operation (REST call to the backend)
        ↓
View the result (verification banner + copyable result card)
        ↓
Explore the steps — each stage with its input, output and intermediate state
        ↓
Read the theory, security notes and worked examples (EN / AR)
```

Every step object has the shape `{ step, title, description, input, output, detail }` —
so the trace reads almost like a worked answer on an exam paper.

---

## Architecture

Two-tier web application. **The frontend never computes ciphertexts itself.**

```mermaid
flowchart TD
    U[User] --> F[React + TypeScript Frontend<br/>Vite · i18n EN/AR RTL]
    F -->|"REST /api"| B[FastAPI Backend]
    B --> S[Services layer<br/>algorithm · math · exercise · quiz]
    S --> R[Algorithm Registry<br/>single source of truth]
    R --> M[35 algorithm modules<br/>custom + library-backed]
    M -->|result + steps[]| S
    S --> B
    B --> F
    F --> V[2D simulation · 3D scene · StepViewer]
```

- **Frontend (React + TypeScript + Vite):** dashboard, theory, per-algorithm
  pages, playground, comparison, mathematics lab, exercises, quizzes, settings
  and docs. All pages are lazy-loaded; the design system lives in
  `src/components/ui/`; `src/services/api.ts` is the typed REST client.
- **Backend (FastAPI):** `app/api/routes/api.py` exposes the REST endpoints.
  `app/algorithms/registry.py` is the single source of truth for algorithm
  ids, operations and UI field specs — the API and frontend forms are generated
  generically from it, so new algorithms can be added without touching HTTP code.
- **Algorithm layer:** one module per algorithm. Each module exposes
  `get_metadata()` plus its operations and returns a structured `build_result(...)`
  with the result and the full `steps[]`.
- **Services layer:** `algorithm_service` (dispatch + type coercion),
  `math_service`, `exercise_service`, `quiz_service`.
- **Utilities:** `app/utils/steps.py` (step engine), `app/utils/math_utils.py`
  (mod arithmetic, gcd, extended Euclidean algorithm, modular inverse,
  square-and-multiply, totient, primality), `app/utils/errors.py`
  (exception hierarchy mapped to structured error payloads).
- **Error handling:** domain errors are caught by a global handler and returned
  as `{ "error", "message", "status", "path" }` with HTTP 422; unhandled
  exceptions return a safe HTTP 500 payload. The frontend surfaces these
  messages directly in the UI.

---

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend framework | React 18 | User interface and components |
| Frontend language | TypeScript 5.7 | Type-safe frontend development |
| Build tool | Vite 6 | Dev server, bundling, preview |
| Routing | react-router-dom 6 | Client-side navigation |
| 3D visualization | Three.js | Interactive 3D algorithm scenes |
| Backend framework | FastAPI 0.115 | REST API services |
| Backend language | Python 3.11+ | Backend and algorithm implementations |
| Data validation | Pydantic 2 + pydantic-settings | Request/response schemas and configuration |
| ASGI server | uvicorn | Runs the FastAPI app |
| Crypto (modern primitives) | cryptography 44, bcrypt, argon2-cffi | Library-backed AEAD / KDF / signatures |
| Testing | pytest 8.3 + httpx | Backend test suite |
| Containerization | Docker + Docker Compose | Backend and frontend images |
| i18n | Custom dictionaries (en / ar) | Bilingual UI with RTL |

> No database is used — the application is stateless (memory-only exercise/quiz
> banks and algorithm logic).

---

## Project Structure

```text
cryptography-course-simulator/
├── backend/                       # FastAPI application
│   ├── app/
│   │   ├── algorithms/            # 35 algorithm modules + registry.py
│   │   ├── api/routes/            # REST endpoints under /api
│   │   ├── core/                  # settings, logging, security (CORS)
│   │   ├── schemas/               # Pydantic request/response models
│   │   ├── services/              # algorithm, math, exercise, quiz services
│   │   └── utils/                 # math_utils, step engine, errors
│   ├── tests/                     # pytest suite (algorithms · api · integration)
│   ├── scripts/                   # helper scripts
│   └── pytest.ini
├── frontend/                      # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/            # ui/ (design system) · simulator/ · simulation/ · simulation3d/
│   │   ├── data/                  # static algorithm catalog & category meta
│   │   ├── i18n/                  # en + ar dictionaries with RTL
│   │   ├── layouts/               # navbar, sidebar, breadcrumbs
│   │   ├── pages/                 # dashboard, theory, playground, compare, …
│   │   ├── services/              # REST client (api.ts)
│   │   ├── styles/                # design tokens + component styles
│   │   └── theme/                 # dark / light theme provider
│   ├── public/                    # static assets
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker/                        # backend & frontend Dockerfiles
├── docs/                          # architecture, algorithms, API, install, testing, user guide
├── .env.example                   # environment variable template
├── docker-compose.yml             # one-command local deployment
├── requirements.txt               # backend dependencies (repo root)
└── README.md
```

---

## Requirements

| Component | Version |
| --- | --- |
| Python | ≥ 3.11 (developed on 3.13) |
| Node.js | ≥ 18 (developed on 22) |
| npm | ≥ 10 |
| Docker + Docker Compose | Optional (for containerized local setup) |

Backend dependencies (`requirements.txt`): `fastapi==0.115.6`,
`uvicorn[standard]==0.34.0`, `pydantic==2.10.4`, `pydantic-settings==2.7.0`,
`cryptography==44.0.0`, `bcrypt==4.2.1`, `argon2-cffi==23.1.0`,
`pytest==8.3.4`, `httpx==0.28.1`.

Frontend dependencies (`frontend/package.json`): `react`, `react-dom`,
`react-router-dom`, `three`; dev: `typescript`, `vite`, `@vitejs/plugin-react`,
`@types/*`.

### Environment variables

A complete template is provided in `.env.example`. Copy it and adjust if needed:

| Variable | Default | Used by |
| --- | --- | --- |
| `BACKEND_HOST` | `127.0.0.1` | Backend bind address |
| `BACKEND_PORT` | `8000` | Backend port |
| `APP_NAME` | `Cryptography & Information Security Simulator` | App title |
| `APP_VERSION` | `1.0.0` | App version |
| `LOG_LEVEL` | `info` | Logging level |
| `CORS_ORIGINS` | `http://127.0.0.1:5173,http://localhost:5173` | Allowed CORS origins |
| `VITE_API_URL` | `http://127.0.0.1:8000/api` | Base URL used by the frontend API client |

---

## Installation

### 1. Clone the repository

```powershell
git clone https://github.com/Mohammed-Saif-abdo-musaed-maid/cryptography-course-simulator.git
cd cryptography-course-simulator
```

### 2. Backend setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1          # Windows PowerShell
# source .venv/bin/activate           # macOS / Linux

pip install -r requirements.txt       # from the repo root
```

### 3. Frontend setup

```powershell
cd frontend
npm install
cd ..
```

### 4. Environment variables *(optional)*

The backend reads `.env` from its working directory and the defaults always
work. If you need custom values:

```powershell
Copy-Item .env.example .env           # Windows
# cp .env.example .env                # macOS / Linux

# For the frontend, point at a different backend if needed:
New-Item frontend/.env -Force
Set-Content frontend/.env "VITE_API_URL=http://127.0.0.1:8000/api"
```

> Never commit real `.env` files or secrets.

---

## Running the Project

You need **two terminals** — one for the backend and one for the frontend.
The backend serves the API on `127.0.0.1:8000`; the frontend dev server runs on
`127.0.0.1:5173` and proxies nothing — it calls the backend directly through
`VITE_API_URL` (default `http://127.0.0.1:8000/api`, and these origins are
enabled in the backend CORS configuration).

### Terminal 1 — Start the backend

```powershell
cd backend
uvicorn app.main:app --reload
```

- API base: <http://127.0.0.1:8000/api>
- Swagger UI: <http://127.0.0.1:8000/docs>
- ReDoc: <http://127.0.0.1:8000/redoc>

To stop it: press `Ctrl + C` in the terminal.

### Terminal 2 — Start the frontend

```powershell
cd frontend
npm run dev
```

- Application: <http://127.0.0.1:5173>

To stop it: press `Ctrl + C` in the terminal.

### Optional: Docker (single-command local setup)

```powershell
docker compose up --build
```

This starts `crypto-backend` (→ `http://127.0.0.1:8000/docs`) and `crypto-frontend`
(→ `http://127.0.0.1:5173`). To stop:

```powershell
docker compose down
```

> Available frontend scripts (from `frontend/package.json`):
> `dev` (Vite dev server), `build` (`tsc -b && vite build`),
> `preview` (serve the production build), `typecheck` (`tsc -b --noEmit`).

---

## Usage Guide

1. **Open the application** at `http://127.0.0.1:5173`. The **Dashboard** shows
   the algorithm counts per category, quick-launch links and a comparison table.
2. **Pick an algorithm** from the sidebar categories (Classical · Symmetric ·
   Asymmetric · Key Exchange · Hash · MAC · KDF · AEAD · Signatures).
3. **Choose an operation** — `encrypt`, `decrypt`, or algorithm-specific
   operations such as `brute_force`, `generate_keys`, `exchange`, `sign`,
   `verify`, `derive`, `hash_password`.
4. **Fill the form.** Fields adapt to the algorithm and sensible defaults are
   pre-filled (shift, keyword, primes, matrix, nonce, cost parameters, etc.).
5. **Press Run.** You'll see:
   - a success banner with the **result**,
   - a **copyable result card**,
   - an expandable **step-by-step execution** list showing every stage, its
     input, output and intermediate state (e.g. AES per-round state matrices,
     DES S-box detail, DH shared-secret derivation),
   - a **2D simulation** tab that animates the algorithm's data flow, and an
     interactive **3D** view where available.
6. **Hash functions** take a message and produce a digest (choose the variant
   where offered, e.g. SHA-3-256 vs SHA-3-512).
7. **Key exchange** produces a shared secret from two sides' private values —
   the steps show exactly why both sides arrive at the same number.
8. **Read errors carefully.** Validation problems return a clear message in the
   UI (e.g. a message too large for RSA, a non-square Hill matrix, an invalid
   key length). See the [troubleshooting notes](docs/user-guide.md#troubleshooting)
   for common issues.
9. Switch the interface to **العربية** in Settings or the navbar toggle — the
   entire document flips to RTL automatically.

More worked examples and vectors are available in the **Examples** tab of each
algorithm page and in the [user guide](docs/user-guide.md).

---

## API Documentation

Interactive OpenAPI/Swagger documentation is available at
`http://127.0.0.1:8000/docs` (also `/redoc` for ReDoc). The API root is
`/api`. A detailed reference also lives in [`docs/api.md`](docs/api.md).

### Endpoint summary

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Service health (`status`, `app`, `version`) |
| GET | `/api/algorithms` | Full algorithm catalog with UI field specs and category counts |
| GET | `/api/algorithms/{id}` | Metadata for one algorithm |
| POST | `/api/algorithms/execute` | Run an operation: `{algorithm, operation, inputs}` → result + steps |
| GET | `/api/math/tools` | List available mathematics tools |
| POST | `/api/math/{tool}` | Run a math tool (modular, gcd, extended-euclid, modular-inverse, prime-check, totient, mod-pow) |
| GET | `/api/exercises?category=all` | List practice exercises (answers hidden) |
| GET | `/api/exercises/{id}` | Fetch one exercise without revealing the answer |
| POST | `/api/exercises/{id}/check` | Grade an answer `{answer}` → `{correct, expected, explanation}` |
| GET | `/api/quizzes/questions?category=&difficulty=&count=` | Generate shuffled quiz questions |
| POST | `/api/quizzes/check` | Grade answers `{category, difficulty, answers}` → score + explanations |

### Example — execute an algorithm

**Request:**

```http
POST /api/algorithms/execute
Content-Type: application/json

{
  "algorithm": "caesar",
  "operation": "encrypt",
  "inputs": { "text": "HELLO", "shift": 3 }
}
```

**Response (abridged):**

```json
{
  "algorithm": "caesar",
  "operation": "encrypt",
  "input": "HELLO",
  "parameters": { "shift": 3 },
  "result": "KHOOR",
  "extra": { "ciphertext": "KHOOR", "mapping": [ ... ] },
  "steps": [
    {
      "step": 1,
      "title": "Key normalisation",
      "description": "The shift is reduced modulo 26 ...",
      "input": "shift = 3",
      "output": "k = 3 mod 26 = 3",
      "detail": { "shift": 3, "k": 3 }
    }
  ]
}
```

### Errors

Validation and domain errors return HTTP `422` (unexpected failures `500`) with
a structured payload:

```json
{
  "error": "missing_input",
  "message": "'Shift (k)' is required",
  "status": 422,
  "path": "/api/algorithms/execute"
}
```

Common error codes include `unknown_algorithm`, `unsupported_operation`,
`missing_input`, `invalid_input`, `invalid_matrix`, `invalid_key`,
`invalid_curve`, `authentication_failed`, `decryption_failed`, and
`message_too_large`.

---

## Example Execution

The results below reproduce the same known vectors used by the test suite.

### Caesar Cipher

```text
Algorithm : Caesar Cipher
Operation : Encrypt   (C = (P + k) mod 26)
Input     : HELLO
Key       : shift = 3
Output    : KHOOR
```

Step trace: the shift is reduced mod 26 → each letter is mapped to its alphabet
position + 3 (e.g. `H(7) + 3 = K(10)`) → the ciphertext is assembled. Running
the `brute_force` operation lists all 26 candidate shifts.

### AES-128 (FIPS-197 vector)

```text
Algorithm : AES (Rijndael)
Operation : Encrypt
Block     : 00112233445566778899AABBCCDDEEFF
Key       : 000102030405060708090A0B0C0D0E0F
Output    : 69 c4 e0 d8 6a 7b 04 30 d8 cd b7 80 70 b4 c5 5a
```

The step trace shows each round: SubBytes → ShiftRows → MixColumns →
AddRoundKey, with the actual state matrix after every round.

### SHA-256

```text
Algorithm : SHA-256
Operation : Hash
Input     : abc
Output    : ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```

Matches the published SHA-256 digest of `abc`.

### Diffie–Hellman (shared-secret derivation)

```text
Algorithm : Diffie–Hellman
Operation : Exchange
Parameters: p = 23, g = 5, a = 6, b = 15
Public A  : g^a mod p = 5^6 mod 23 = 8
Public B  : g^b mod p = 5^15 mod 23 = 19
Secret A  : B^a mod p = 19^6 mod 23 = 2
Secret B  : A^b mod p = 8^15 mod 23 = 2
Shared key: 2   (both sides agree — but no authentication is implied)
```

More verified vectors (Vigenère, Playfair, Hill, DES, 3DES, Blowfish, Twofish,
ChaCha20, SHA-1, MD5, SHA-3, BLAKE2, BLAKE3, HMAC, etc.) are listed in
[`docs/algorithms.md`](docs/algorithms.md) and [`docs/user-guide.md`](docs/user-guide.md).

---

## Testing

- **Framework:** pytest 8.3 (+ httpx for API tests).
- **Location:** `backend/tests/` — `algorithms/` (per-category vector and
  round-trip tests), `api/` (endpoints, catalog, math, exercises, quizzes),
  `integration/` (full API round-trips).
- **Current status:** **283 tests, all passing** (verified). The suite checks
  known test vectors (FIPS-197 AES, DES official vectors, RFC 8439 ChaCha20,
  RFC 4231 HMAC, RFC 5869 HKDF, official BLAKE3 / Twofish vectors, SHA-2/SHA-3
  vs `hashlib`, …), encrypt→decrypt round-trips, tamper detection for AEAD and
  signatures, key properties, and API behavior.

### Run the backend tests

```powershell
cd backend
python -m pytest -q
```

(`backend/tests/conftest.py` inserts the backend directory into `sys.path`
automatically, so no manual `PYTHONPATH` is required when running from
`backend/`.)

### Frontend static checks

```powershell
cd frontend
npm run typecheck          # tsc -b --noEmit (strict)
npm run build              # tsc -b && vite build
```

Coverage of individual algorithms is described in [`docs/testing.md`](docs/testing.md).
Interactive frontend UI unit tests (Vitest) are a documented extension point but
are not yet implemented.

---

## Security and Educational Disclaimer

> ⚠️ **This project is strictly educational.**

- It is intended for demonstrating how cryptographic algorithms work and for
  studying their mathematical structure. **It must not be treated as a
  replacement for security-reviewed cryptographic libraries in production
  systems.**
- **Historic ciphers** (Caesar, Vigenère, Playfair, Hill, Rail Fence, Columnar,
  monoalphabetic substitution) provide no real security today.
- **Broken / deprecated algorithms** (MD5, SHA-1, DES, 3DES, Blowfish) are
  included for study and are clearly *labelled as such in the UI*. They must not
  be used to protect real data.
- **Textbook RSA and ElGamal** here use raw modular arithmetic with small,
  student-friendly parameters. Real-world RSA requires large primes (≥ 2048-bit)
  and padding such as **OAEP**; real-world ElGamal requires large groups and
  proper randomness. The project also implements OAEP and PSS operations that
  demonstrate padding — still not for production.
- **Key exchange** (Diffie–Hellman, ECDH, X25519) establishes shared secrets but
  provides **no authentication**: an active man-in-the-middle can intercept the
  exchange. Authentication must be added separately in real systems.
- When modern primitives are used (AES, ChaCha20, SHA-2/3, HMAC, KDFs…), the
  implementations rely on the `cryptography`/`bcrypt`/`argon2-cffi` libraries,
  but the project as a whole is not a substitute for security review.
- If you are handling real data, use a vetted, maintained library with proper
  modes and constant-time operations, keep keys out of the app, and follow
  current best practice (authenticated encryption, unique nonces, authenticated
  key exchange).
- **Repository hygiene:** never commit `.env` files, API keys, passwords, or
  private certificates. This repository contains no secrets; private keys shown
  by some demonstrations exist only transiently in an API response for teaching.
- Randomness in the project uses the operating-system CSPRNG
  (`secrets` / `token_bytes`) where required.

---

## Limitations

- Some algorithms are intentionally simplified for teaching (small-key
  textbook RSA with primes like 61 and 53, small Diffie–Hellman groups) — they
  demonstrate the math but are not security-relevant.
- Deprecated and broken algorithms (DES, 3DES, Blowfish, MD5, SHA-1) remain
  included for study and carry explicit warnings.
- Individual algorithm implementations are at most single-block operations
  (no production modes of operation such as CBC/GCM key management, no stream
  truncation handling beyond the documented inputs).
- The static parts of the `docs/` folder (`docs/testing.md`, `docs/architecture.md`)
  were written before the catalog was extended from 23 to 35 algorithms and may
  still reference the earlier numbers; the live API catalog and the registry are
  authoritative.
- Frontend UI unit testing (Vitest) is not yet set up.
- The project uses an in-memory, stateless design — there is no persistence of
  exercise results or user data.

---

## Roadmap

### Completed
- 35 algorithms across 9 categories with real, vector-verified implementations.
- Step-by-step educational output for every operation.
- 2D animated simulations and an interactive 3D visualization mode (Three.js).
- Mathematics laboratory, exercises (19), and quiz arena (39-question bank).
- English + Arabic interface with full RTL, dark/light themes.
- 283 passing backend tests; strict frontend type-check.
- Docker Compose local deployment.

### Under development / planned
- More algorithm visualizations and 3D coverage for every operation.
- Extended test coverage (edge cases, fuzz-style known-answer checks, more
  RFC vectors).
- Version-aligned documentation refresh (`docs/*`) for the full 35-algorithm catalog.
- Frontend UI unit tests (Vitest) and a CI pipeline.
- Improved accessibility and keyboard navigation.
- More educational explanations and worked examples per algorithm.
- Additional language support beyond Arabic/English.

*Planned items are future improvements and not yet implemented.*

---

## Contributing

Contributions are welcome. Suggested workflow:

1. **Fork** the repository on GitHub.
2. **Create a feature branch:** `git checkout -b feature/my-feature`.
3. **Make your changes** — follow the existing patterns (registry entry +
   isolated algorithm module + service mapping + frontend descriptor + tests).
4. **Run the tests:**
   ```powershell
   cd backend;   python -m pytest -q
   cd frontend;  npm run typecheck
   ```
5. **Commit** with a clear message describing the change.
6. **Push** your branch and **open a Pull Request** with a short description.

When adding an algorithm, keep the backend registry and `frontend/src/data/catalog.ts`
in sync, and add known-vector tests in `backend/tests/algorithms/`.

**No license has been specified yet**, so contributions are received on general
open-source courtesy terms until a license is chosen.

---

## License

No license has been specified yet. Until a license is added, all rights are
reserved by default — contact the author if you intend to reuse the code.

---

## Author

**Mohammed Saif Abdou Musaed Maid**

- GitHub: [Mohammed-Saif-abdo-musaed-maid](https://github.com/Mohammed-Saif-abdo-musaed-maid)
- Repository: <https://github.com/Mohammed-Saif-abdo-musaed-maid/cryptography-course-simulator>

Built as an educational project for university students of cryptography and
information security.