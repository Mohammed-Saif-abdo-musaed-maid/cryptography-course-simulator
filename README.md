# 🔐 Cryptography Course Simulator

An interactive educational platform for the **Cryptography & Information Security**
university course. Students run real cryptographic algorithms through a modern
web interface, watch every intermediate step, and verify the results against
well-known test vectors — nothing is faked and nothing is placeholder output.

> منصة تعليمية تفاعلية لمادة التشفير وأمن المعلومات: تشغيل حقيقي للخوارزميات
> مع عرض كل خطوة من خطوات التنفيذ، ودعم كامل للواجهة العربية والإنجليزية.

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

- [Overview](#-overview)
- [Features](#-features)
- [Supported Algorithms](#-supported-algorithms)
- [Real Application Screenshots](#-real-application-screenshots)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Running the Project](#-running-the-project)
- [Testing](#-testing)
- [Educational Simulation](#-educational-simulation)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [Security Notice](#-security-notice)
- [License](#-license)
- [Author](#-author)

---

## 🌟 Overview

The **Cryptography Course Simulator** is a full-stack educational laboratory that
covers classical ciphers, modern symmetric and asymmetric encryption, authenticated
encryption (AEAD), key exchange, digital signatures, hash functions, message
authentication codes, and password-hashing / key-derivation functions.

Everything runs genuinely on the backend: each request returns a structured,
human-readable **step-by-step trace** of the actual computation — AES round states,
DES S-box details, RSA key generation, Diffie–Hellman shared-secret derivation,
modular-exponentiation tables, and more. The frontend never computes ciphertexts
itself; it renders the real trace produced by the backend.

**What the platform offers:**

- **35 real algorithms** with encrypt / decrypt / hash / sign / verify /
  key-generation / key-exchange / derive operations.
- **Step-by-step execution traces** for every operation, showing real
  intermediate values (S-boxes, round keys, Feistel rounds, square-and-multiply
  rows, sponge states, …).
- **Verification against known test vectors** (FIPS-197 AES, DES official
  vectors, RFC 8439 ChaCha20, RFC 4231 HMAC, RFC 5869 HKDF, RFC 7914 scrypt,
  official BLAKE3 / Twofish vectors, SHA-2/3 cross-checked against `hashlib`,
  and more).
- **19 practice exercises**, a **quiz arena** with a 39-question bank, and a
  **mathematics laboratory** (GCD, Extended Euclidean algorithm, modular inverse,
  primality check, totient, modular exponentiation) with worked steps.
- **Interactive 2D and 3D simulations** that animate the data flow of each
  algorithm for teaching.
- **English and Arabic** interface with full RTL support, plus **dark and light**
  themes.

**Why it exists:** instead of memorising formulas, students can feed their own
inputs through a real algorithm, read the derivation of every step, and compare
the output with published standards. It is a companion tool for lectures,
self-study, laboratory sessions, and exam preparation.

---

## ✨ Features

| Feature | Description | Status |
| --- | --- | --- |
| Real algorithm execution | 47 algorithms implemented and executed on the backend; results match published test vectors | Implemented |
| Encryption & decryption | Classical, symmetric, asymmetric and AEAD operations with genuine intermediate states | Implemented |
| Step-by-step visualization | Structured `steps[]` per operation (round states, key schedules, matrices, tables) rendered in the UI | Implemented |
| 2D simulation engine | Animated, playable walkthrough of each algorithm's data flow | Implemented |
| 3D simulation | Interactive Three.js scenes with playback controls, timeline, legend and step panel | Implemented |
| Algorithm explanations | Theory, examples and security-status tabs for every algorithm, in English and Arabic | Implemented |
| Mathematics laboratory | GCD, Extended Euclidean, modular inverse, primality, totient, modular exponentiation with worked steps | Implemented |
| Practice exercises | 19 graded exercises with instant feedback and explanations | Implemented |
| Quiz arena | Generate shuffled quiz questions from a 39-question bank; grade answers with per-question explanations | Implemented |
| Algorithm comparison | Side-by-side comparison of algorithms and modes | Implemented |
| Playground | Free-form experimentation per algorithm with adaptive forms | Implemented |
| REST API | Endpoints under `/api` consumed by the frontend; interactive Swagger docs | Implemented |
| Language support | English and Arabic (العربية) with automatic RTL layout | Implemented |
| Theming | Dark cybersecurity theme by default, with a light theme variant | Implemented |
| Automated testing | 669 backend tests (known vectors, round-trips, API, lifecycle) + 27 frontend tests — all passing; frontend strict type-check | Implemented |
| Docker support | One-command local deployment via Docker Compose | Implemented |

---

## 🔐 Supported Algorithms

**47 algorithms · 9 categories.** The backend keeps a single source of truth —
`backend/app/algorithms/registry.py` — which drives both the API and the
frontend forms generically. Every algorithm also ships an **animated 2D
visualization** and an **interactive 3D visualization** built from the real
execution trace.

Each algorithm is labelled with an honest security status:

`historic` · `broken` · `broken_deprecated` · `deprecated` · `secure` ·
`secure_with_padding` · `secure_with_auth`

### Classical Cryptography

| Category | Algorithm | Type | Simulation |
|----------|-----------|------|------------|
| Classical | Caesar Cipher | Substitution (shift cipher) | 2D · 3D |
| Classical | Monoalphabetic Substitution | One-to-one substitution | 2D · 3D |
| Classical | Vigenère Cipher | Polyalphabetic substitution | 2D · 3D |
| Classical | Playfair Cipher | Digraph substitution (5×5 square) | 2D · 3D |
| Classical | Hill Cipher | Matrix block cipher over Z/26Z | 2D · 3D |
| Classical | Rail Fence Cipher | Transposition (zig-zag) | 2D · 3D |
| Classical | Columnar Transposition | Transposition (keyed columns) | 2D · 3D |

### Symmetric Encryption

| Category | Algorithm | Type | Simulation |
|----------|-----------|------|------------|
| Symmetric | DES | 64-bit Feistel block cipher | 2D · 3D |
| Symmetric | 3DES (Triple DES) | DES applied three times (EDE) | 2D · 3D |
| Symmetric | AES (Rijndael) | 128-bit block cipher (128/192/256-bit keys) | 2D · 3D |
| Symmetric | Blowfish | Variable-key (32–448-bit) Feistel cipher | 2D · 3D |
| Symmetric | Twofish | 128-bit block cipher, AES finalist | 2D · 3D |
| Symmetric | ChaCha20 | RFC 8439 stream cipher | 2D · 3D |
| Symmetric | AES-CBC | AES block chaining (CBC, PKCS#7) | 2D · 3D |
| Symmetric | AES-CTR | AES in counter mode (keystream) | 2D · 3D |
| Symmetric | Camellia | 128-bit Feistel cipher (RFC 3713) | 2D · 3D |

### Authenticated Encryption (AEAD)

| Category | Algorithm | Type | Simulation |
|----------|-----------|------|------------|
| AEAD | AES-GCM | AES-CTR + GHASH authentication tag | 2D · 3D |
| AEAD | ChaCha20-Poly1305 | RFC 8439 authenticated stream cipher | 2D · 3D |
| AEAD | AES-CCM | Authenticated encryption (NIST SP 800-38C) | 2D · 3D |

### Hash Functions

| Category | Algorithm | Type | Simulation |
|----------|-----------|------|------------|
| Hash | SHA-256 | One-way 256-bit digest | 2D · 3D |
| Hash | SHA-512 | One-way 512-bit digest | 2D · 3D |
| Hash | SHA-1 | Legacy 160-bit digest (broken / deprecated) | 2D · 3D |
| Hash | MD5 | Legacy 128-bit digest (broken) | 2D · 3D |
| Hash | SHA-3 | Keccak sponge (224/256/384/512) | 2D · 3D |
| Hash | BLAKE2 | Fast parameterized hash (b-512 / s-256) | 2D · 3D |
| Hash | BLAKE3 | Merkle-tree hash with extendable output | 2D · 3D |
| Hash | SHA-224 | Truncated SHA-2 variant (224-bit) | 2D · 3D |
| Hash | SHA-384 | Truncated SHA-2 variant (384-bit) | 2D · 3D |
| Hash | RIPEMD-160 | Legacy 160-bit digest (deprecated) | 2D · 3D |

### Message Authentication (MAC)

| Category | Algorithm | Type | Simulation |
|----------|-----------|------|------------|
| MAC | HMAC | Keyed hash (RFC 2104, SHA-256/SHA-512) | 2D · 3D |
| MAC | CMAC | AES-CBC MAC with K1/K2 subkeys (SP 800-38B) | 2D · 3D |
| MAC | Poly1305 | One-time polynomial authenticator | 2D · 3D |

### Password Hashing & Key Derivation (KDF)

| Category | Algorithm | Type | Simulation |
|----------|-----------|------|------------|
| KDF | PBKDF2 | Iterated password hashing (RFC 8018) | 2D · 3D |
| KDF | bcrypt | Adaptive Blowfish-based password hash | 2D · 3D |
| KDF | scrypt | Memory-hard key derivation (RFC 7914) | 2D · 3D |
| KDF | Argon2 | PHC winner, memory-hard (argon2id/i/d) | 2D · 3D |
| KDF | HKDF | Extract-and-expand key derivation (RFC 5869) | 2D · 3D |

### Asymmetric Encryption

| Category | Algorithm | Type | Simulation |
|----------|-----------|------|------------|
| Asymmetric | RSA (textbook) | Public-key encryption from the factoring problem | 2D · 3D |
| Asymmetric | RSA-OAEP | RSA with OAEP padding (encrypt / decrypt) | 2D · 3D |
| Asymmetric | RSA-PSS | RSA probabilistic signatures (sign / verify) | 2D · 3D |
| Asymmetric | ElGamal | Randomized encryption on the Diffie–Hellman problem | 2D · 3D |

> **Note on counting:** RSA-OAEP and RSA-PSS are operations of the *single*
> `rsa` module (exposed as `encrypt_oaep` / `decrypt_oaep` / `sign_pss` /
> `verify_pss`). Phase 5 additionally registered RSA-PSS as its own standalone
> `rsa_pss` algorithm module. The backend registry therefore registers **47
> algorithm modules** in total.

### Key Exchange

| Category | Algorithm | Type | Simulation |
|----------|-----------|------|------------|
| Key Exchange | Diffie–Hellman | Shared-secret agreement over an insecure channel | 2D · 3D |
| Key Exchange | ECDH | Elliptic-curve Diffie–Hellman (P-256/384/521) | 2D · 3D |
| Key Exchange | X25519 | Curve25519 Diffie–Hellman (RFC 7748) | 2D · 3D |
| Key Exchange | X448 | Curve448 Diffie–Hellman (RFC 7748) | 2D · 3D |

### Digital Signatures

| Category | Algorithm | Type | Simulation |
|----------|-----------|------|------------|
| Signature | ECDSA | Elliptic-curve signatures (FIPS 186-4) | 2D · 3D |
| Signature | Ed25519 | RFC 8032 deterministic signatures | 2D · 3D |
| Signature | DSA | Discrete-log signatures (FIPS 186) | 2D · 3D |
| Signature | RSA-PSS | Probabilistic RSA signatures (PKCS#1 v2) | 2D · 3D |

> **Key exchange is not encryption.** These protocols establish a *shared
> secret* that can later be used to derive encryption keys — they do not, by
> themselves, keep messages confidential.

### Implementation notes

- **Classical ciphers and "textbook" algorithms** (RSA raw, ElGamal,
  Diffie–Hellman, SHA-1/SHA-2/SHA-3/MD5/BLAKE2/BLAKE3, DES/3DES/AES/Blowfish/
  Twofish/ChaCha20) are **custom educational implementations** written from
  scratch for teaching (S-boxes, key schedules, compression functions,
  square-and-multiply, etc.).
- **Modern library-backed primitives** (HMAC, CMAC, Poly1305, PBKDF2, scrypt,
  Argon2, HKDF, AES-GCM, AES-CBC, AES-CTR, AES-CCM, Camellia, ChaCha20-Poly1305,
  ECDH, X25519, X448, ECDSA, Ed25519, DSA, RSA-OAEP, RSA-PSS, `sha224`/`sha384`/
  `ripemd160` via `hashlib`, bcrypt) are built on the well-reviewed
  `cryptography`, `bcrypt` and `argon2-cffi` libraries. The UI still surfaces
  real intermediate values for teaching.

---

## 🖥️ Real Application Screenshots

The following sections are reserved for **real screenshots** of the running
application. Capture them from your local build and place the PNG files inside
`docs/screenshots/`.

<!--
  REQUIRED SCREENSHOTS — place real captures (no mockups, no AI-generated
  images) in docs/screenshots/ with exactly these filenames:

  docs/screenshots/dashboard.png        → Dashboard / home page
  docs/screenshots/algorithms.png       → Algorithm catalog / sidebar
  docs/screenshots/classical.png        → Classical cipher page with 2D simulation
  docs/screenshots/symmetric.png        → Symmetric encryption page (e.g. AES)
  docs/screenshots/public-key.png       → Public-key page (e.g. RSA)
  docs/screenshots/hashing.png          → Hash function page (e.g. SHA-256)
  docs/screenshots/simulation-2d.png    → 2D simulation view
  docs/screenshots/simulation-3d.png    → 3D simulation view (Three.js)

  These eight files are optional: once a file exists it is rendered below.
-->

### Main Dashboard

![Main Dashboard](docs/screenshots/dashboard.png)

### Algorithms

![Algorithms](docs/screenshots/algorithms.png)

### Classical Cryptography

![Classical Cryptography](docs/screenshots/classical.png)

### Symmetric Encryption

![Symmetric Encryption](docs/screenshots/symmetric.png)

### Public Key Cryptography

![Public Key Cryptography](docs/screenshots/public-key.png)

### Hash Functions

![Hash Functions](docs/screenshots/hashing.png)

### 2D Simulation

![2D Simulation](docs/screenshots/simulation-2d.png)

### 3D Simulation

![3D Simulation](docs/screenshots/simulation-3d.png)

---

## 🏗️ System Architecture

Two-tier web application. **The frontend never computes ciphertexts itself** —
all cryptographic work happens in the FastAPI backend, which returns the result
plus a structured `steps[]` trace.

```mermaid
flowchart TD
    U[User] --> F[React + TypeScript Frontend<br/>Vite · i18n EN/AR RTL · Dark/Light]
    F -->|"REST /api"| B[FastAPI Backend]
    B --> S[Services layer<br/>algorithm · math · exercise · quiz]
    S --> R[Algorithm Registry<br/>single source of truth]
    R --> M[47 algorithm modules<br/>custom + library-backed]
    M -->|result + steps[]| S
    S --> B
    B --> F
    F --> V2[2D simulation]
    F --> V3[3D simulation · Three.js]
    F --> SV[StepViewer]
```

- **Frontend (React + TypeScript + Vite):** dashboard, theory, per-algorithm
  pages, playground, comparison, mathematics lab, exercises, quizzes, settings
  and docs pages. The design system lives in `src/components/ui/`, the typed
  REST client in `src/services/api.ts`, and 2D / 3D simulation engines in
  `src/components/simulation/` and `src/components/simulation3d/`.
- **Backend (FastAPI):** `app/api/routes/api.py` exposes the REST endpoints.
  `app/algorithms/registry.py` is the single source of truth for algorithm ids,
  operations and UI field specs — the API and frontend forms are generated
  generically from it, so new algorithms can be added without touching HTTP code.
- **Algorithm layer:** one module per algorithm. Each module exposes
  `get_metadata()` plus its operations and returns a structured `build_result(...)`
  with the result and the full `steps[]`.
- **Services layer:** `algorithm_service` (dispatch + type coercion),
  `math_service`, `exercise_service`, `quiz_service`.
- **Utilities:** `app/utils/steps.py` (step engine), `app/utils/math_utils.py`
  (mod arithmetic, gcd, extended Euclidean algorithm, modular inverse,
  square-and-multiply, totient, primality), `app/utils/errors.py` (exception
  hierarchy mapped to structured error payloads).
- **Error handling:** domain errors return `{ "error", "message", "status",
  "path" }` with HTTP 422; unhandled exceptions return a safe HTTP 500 payload.
  The frontend surfaces these messages directly in the UI.

---

## 🧰 Technology Stack

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
| i18n | Custom dictionaries (en / ar) | Bilingual UI with automatic RTL |

> No database is used — the application is stateless (memory-only exercise and
> quiz banks and algorithm logic).

---

## 📂 Project Structure

```text
cryptography-course-simulator/
├── backend/                       # FastAPI application
│   ├── app/
│   │   ├── algorithms/            # 47 algorithm modules + registry.py (source of truth)
│   │   ├── api/routes/            # REST endpoints under /api (api.py)
│   │   ├── core/                  # settings, logging, security (CORS)
│   │   ├── schemas/               # Pydantic request/response models
│   │   ├── services/              # algorithm · math · exercise · quiz services
│   │   └── utils/                 # math_utils, step engine, error hierarchy
│   ├── tests/                     # pytest suite (algorithms · api · integration)
│   ├── scripts/                   # helper scripts
│   └── pytest.ini
├── frontend/                      # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/            # ui (design system) · simulator (2D) · simulation3d (Three.js)
│   │   ├── data/                  # static algorithm catalog & category meta
│   │   ├── i18n/                  # en + ar dictionaries with RTL
│   │   ├── layouts/               # navbar, sidebar, breadcrumbs, app layout
│   │   ├── pages/                 # dashboard, theory, playground, compare, math, exercises, …
│   │   ├── services/              # REST client (api.ts)
│   │   ├── styles/                # design tokens + component styles
│   │   ├── theme/                 # dark / light theme provider
│   │   └── types/                 # shared TypeScript types
│   ├── public/                    # static assets
│   ├── scripts/                   # 3D audit tooling
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docker/                        # backend & frontend Dockerfiles
├── docs/                          # architecture, API, algorithms, install, testing, user guide
│   └── screenshots/               # real application screenshots (see section above)
├── video/                         # helper tooling (e.g. Windows dev launcher script)
├── .env.example                   # environment variable template
├── docker-compose.yml             # one-command local deployment
├── requirements.txt               # backend dependencies (repo root)
└── README.md
```

---

## 🚀 Installation

### Requirements

| Component | Version |
| --- | --- |
| Python | ≥ 3.11 (Docker image uses 3.13) |
| Node.js | ≥ 18 (Docker image uses 22) |
| npm | ≥ 10 |
| Docker + Docker Compose | Optional (for containerized local setup) |

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
work. A complete template is provided in `.env.example`:

| Variable | Default | Used by |
| --- | --- | --- |
| `BACKEND_HOST` | `127.0.0.1` | Backend bind address |
| `BACKEND_PORT` | `8000` | Backend port |
| `APP_NAME` | Cryptography & Information Security Simulator | App title |
| `APP_VERSION` | `1.0.0` | App version |
| `LOG_LEVEL` | `info` | Logging level |
| `CORS_ORIGINS` | `http://127.0.0.1:5173,http://localhost:5173` | Allowed CORS origins |
| `VITE_API_URL` | `http://127.0.0.1:8000/api` | Base URL used by the frontend API client |

```powershell
Copy-Item .env.example .env           # Windows
# cp .env.example .env                # macOS / Linux

# For the frontend, point at a different backend if needed:
New-Item frontend/.env -Force
Set-Content frontend/.env "VITE_API_URL=http://127.0.0.1:8000/api"
```

> Never commit real `.env` files or secrets.

---

## ▶️ Running the Project

You need **two terminals** — one for the backend and one for the frontend. The
backend serves the API on `http://127.0.0.1:8000`; the frontend dev server runs
on `http://127.0.0.1:5173` and calls the backend directly through
`VITE_API_URL` (the dev origins are enabled in the backend CORS configuration).

### Backend

```powershell
cd backend
uvicorn app.main:app --reload
```

- API base: <http://127.0.0.1:8000/api>
- Swagger UI: <http://127.0.0.1:8000/docs>
- ReDoc: <http://127.0.0.1:8000/redoc>

### Frontend

```powershell
cd frontend
npm run dev
```

- Application: <http://127.0.0.1:5173>

### Windows (one-command launcher)

A PowerShell script can start both servers at once (it handles the `npm.cmd`
shim, the `.env`, and logs to `.runtime/logs/`):

```powershell
powershell -ExecutionPolicy Bypass -File video\.runtime\tools\start-dev.ps1        # start both
powershell -ExecutionPolicy Bypass -File video\.runtime\tools\start-dev.ps1 -BackendOnly
powershell -ExecutionPolicy Bypass -File video\.runtime\tools\start-dev.ps1 -FrontendOnly
```

### Linux / macOS

Same commands after activating the virtual environment:

```bash
# Terminal 1 — backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 — frontend
cd frontend
npm run dev
```

### Docker (single-command local setup)

```powershell
docker compose up --build
```

This starts `crypto-backend` (→ `http://127.0.0.1:8000/docs`) and
`crypto-frontend` (→ `http://127.0.0.1:5173`). To stop:

```powershell
docker compose down
```

> Frontend scripts (from `frontend/package.json`): `dev` (Vite dev server),
> `build` (`tsc -b && vite build`), `preview` (serve the production build),
> `typecheck` / `lint` (`tsc -b --noEmit`).

---

## 🧪 Testing

### Backend — pytest

- **Framework:** pytest 8.3 (+ httpx for API tests).
- **Location:** `backend/tests/` — `algorithms/` (per-category vector and
  round-trip tests), `api/` (endpoints, catalog, math, exercises, quizzes),
  `integration/` (full API round-trips).
- **Status:** **669 passed, 1 skipped** — verified in the latest run. The
  suite checks known test vectors (FIPS-197 AES, DES official vectors, RFC 8439
  ChaCha20 / Poly1305, RFC 4231 HMAC, RFC 5869 HKDF, RFC 7914 scrypt, AES-CMAC
  SP 800-38B vectors, AES-CCM SP 800-38C vectors, RSA-PSS / DSA known-answer
  pairs, official BLAKE3 / Twofish vectors, SHA-224/384/160 vs `hashlib`, …),
  encrypt → decrypt round-trips, tamper detection for AEAD and signatures, key
  properties, and API behavior.

```powershell
cd backend
python -m pytest -q
```

(`backend/tests/conftest.py` inserts the backend directory into `sys.path`
automatically, so no manual `PYTHONPATH` is required when running from
`backend/`.)

### Frontend — static checks + 3D audit

```powershell
cd frontend
npm run typecheck          # tsc -b --noEmit (strict)
npm run build              # tsc -b && vite build
```

A 3D coverage audit tool also verifies that every registered algorithm ships a
working 3D adapter (last run: 34 PASS · 0 FAIL · 1 WARN of 35) — see
`frontend/tests/3d-audit-FINAL.md`.

Interactive frontend UI unit tests (Vitest) are a documented extension point but
are not yet implemented.

---

## 🎓 Educational Simulation

The core teaching loop of the application:

```text
Open an algorithm page
        ↓
Choose an operation (encrypt / decrypt / hash / sign / verify / …)
        ↓
Configure the key / parameters (form fields adapt to the algorithm)
        ↓
Execute the operation (REST call to the backend — real algorithm)
        ↓
View the result (verification banner + copyable result card)
        ↓
Explore the steps (input, output and intermediate state for every stage)
        ↓
Watch the 2D / 3D visualization of the same trace
```

Every step object has the shape
`{ step, title, description, input, output, detail }` — so the trace reads
almost like a worked answer on an exam paper.

### Algorithm Execution

The **real computation**. When you press Run, the FastAPI backend executes the
actual algorithm (custom educational implementation or a library-backed
primitive) and returns the genuine result *plus* a `steps[]` trace of every
intermediate state. This is not simulated output — it is the algorithm running
for real, verifiable against published test vectors.

### 2D Visualization

A **two-dimensional, animated representation of that trace**. The 2D engine
(`src/components/simulation/`) reads the real `steps[]` returned by the backend
and animates the data flow — plaintext transformations, matrix operations, round
states, S-box lookups — with play / pause, speed control and a step timeline.
The animation visualizes the already-executed computation; it does not re-run
the cryptography.

### 3D Visualization

An **interactive three-dimensional teaching view of the same steps**
(`src/components/simulation3d/`, Three.js). Objects, data blocks and state
matrices are arranged in 3D space with playback controls, a legend and a
per-step panel, letting students watch the algorithm unfold spatially.

> **Important:** both the 2D and 3D views are *visualization layers* over the
> backend's execution trace. All cryptographic computation happens on the
> backend; the 3D scene does not implement or re-execute the algorithm itself.

---

## 📚 Documentation

In-depth guides live in the `docs/` folder:

| Document | Contents |
| --- | --- |
| [Architecture](docs/architecture.md) | Layering, the step engine, registry → UI contract |
| [API Reference](docs/api.md) | Every endpoint, input conventions and error format |
| [Algorithms](docs/algorithms.md) | Catalog notes and how to add a new algorithm |
| [Installation](docs/installation.md) | Backend / frontend / Docker setup walkthrough |
| [Testing](docs/testing.md) | Test layout, what is covered, how to run |
| [User Guide](docs/user-guide.md) | Navigating the app, known examples, troubleshooting |

Interactive OpenAPI/Swagger documentation is also available at
`http://127.0.0.1:8000/docs` (ReDoc at `/redoc`). The API root is `/api`.

> ⚠️ Some `docs/*` pages (e.g. `testing.md`, `architecture.md`) were written
> before the catalog was extended and may still reference earlier algorithm
> counts. The live API catalog and `backend/app/algorithms/registry.py` are
> authoritative.

---

## 🤝 Contributing

Contributions are welcome. Suggested workflow:

1. **Fork** the repository on GitHub.
2. **Create a feature branch:** `git checkout -b feature/my-feature`.
3. **Make your changes** — follow the existing patterns (registry entry +
   isolated algorithm module + service mapping + frontend descriptor + tests).
4. **Run the checks:**

   ```powershell
   cd backend;   python -m pytest -q
   cd frontend;  npm run typecheck
   ```

5. **Commit** with a clear message describing the change.
6. **Push** your branch and **open a Pull Request** with a short description.

When adding an algorithm, keep `backend/app/algorithms/registry.py` and
`frontend/src/data/catalog.ts` in sync, add known-vector tests under
`backend/tests/algorithms/`, and register a 2D renderer and 3D adapter so the
simulation tabs appear.

---

## 🛡️ Security Notice

> ⚠️ **This project is strictly educational.**

- It exists to demonstrate how cryptographic algorithms work and to study their
  mathematical structure. **It must not be treated as a replacement for
  security-reviewed cryptographic libraries in production systems.**
- **Historic ciphers** (Caesar, Vigenère, Playfair, Hill, Rail Fence, Columnar,
  monoalphabetic substitution) provide no real security today.
- **Broken / deprecated algorithms** (MD5, SHA-1, DES, 3DES, Blowfish) are
  included for study and are clearly labelled in the UI. They must not be used
  to protect real data.
- **Textbook RSA and ElGamal** here use raw modular arithmetic with small,
  student-friendly parameters. Real-world RSA requires large primes (≥ 2048-bit)
  and padding such as OAEP; real-world ElGamal requires large groups and proper
  randomness. The project also implements OAEP and PSS operations that
  demonstrate padding — still not for production.
- **Key exchange** (Diffie–Hellman, ECDH, X25519) establishes shared secrets but
  provides **no authentication**: an active man-in-the-middle can intercept the
  exchange. Authentication must be added separately in real systems.
- Modern primitives (AES, ChaCha20, SHA-2/3, HMAC, KDFs…) rely on the
  `cryptography` / `bcrypt` / `argon2-cffi` libraries, but the project as a whole
  is not a substitute for security review.
- Randomness uses the operating-system CSPRNG (`secrets` / `token_bytes`);
  private keys shown by some demonstrations exist only transiently in the API
  response for teaching.
- **Repository hygiene:** never commit `.env` files, API keys, passwords, or
  private certificates. This repository contains no secrets.
- If you are handling real data, use a vetted, maintained library with proper
  modes and constant-time operations, keep keys out of the app, and follow
  current best practice (authenticated encryption, unique nonces, authenticated
  key exchange).

---

## License

No license has been specified yet. Until a license is added, all rights are
reserved by default — contact the author if you intend to reuse the code.

---

## 👨‍💻 Author

**Mohammed Saif Abdou Musaed Maid**

- GitHub: [Mohammed-Saif-abdo-musaed-maid](https://github.com/Mohammed-Saif-abdo-musaed-maid)
- Repository: <https://github.com/Mohammed-Saif-abdo-musaed-maid/cryptography-course-simulator>

Built as an educational project for university students of cryptography and
information security.