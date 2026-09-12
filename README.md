# Cryptography & Information Security Course Simulator

An interactive university laboratory for the **Cryptography & Information Security**
course. Every algorithm is implemented genuinely on the backend — no placeholder
simulations — with structured, step-by-step educational output and verification
against known test vectors (FIPS-197, DES standard vectors, SHA-256, Playfair,
Vigenère…).

![stack](https://img.shields.io/badge/backend-FastAPI-0ea5e9)
![stack](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-38bdf8)
![stack](https://img.shields.io/badge/i18n-Arabic%20RTL%20%2B%20English-22d3ee)

---

## Highlights

- **23 real algorithms**, executed server-side with full intermediate states:
  classical (`caesar`, `monoalphabetic`, `vigenere`, `playfair`, `hill`,
  `rail_fence`, `columnar`), symmetric (`des`, `triple_des`, `aes`,
  `blowfish`, `twofish`, `chacha20`), asymmetric (`rsa`, `elgamal`),
  key exchange (`diffie_hellman`) and hashing (`md5`, `sha1`, `sha256`,
  `sha512`, `sha3`, `blake2`, `blake3`).
- **Step-by-step traces** for every operation (round states, S-boxes, key
  schedules, square-and-multiply rows…).
- **Mathematical laboratory** — GCD, Extended Euclidean (Bézout), modular
  inverse, primality, Euler’s totient, modular exponentiation — all with
  worked steps.
- **Practice**: 19 exercises + a graded quiz bank across all categories.
- **Bidirectional Arabic / English interface** with full RTL support, dark
  cybersecurity theme, responsive layout, lazy-loaded routes.
- **190 backend tests** (known vectors, roundtrips, API, lifecycle) all green.

## Repository layout

```
backend/        FastAPI application
  app/
    algorithms/ 23 educational implementations (each with get_metadata…)
    services/   dispatch, exercises, quizzes, mathematics
    api/routes/ REST endpoints under /api
    core/       settings, logging, security
    utils/      math_utils, step engine, errors
  tests/        pytest suite (algorithms · api · integration)
frontend/       React 18 + TypeScript + Vite
  src/
    pages/      dashboard, algorithm, theory, compare, playground,
                exercises, quizzes, mathematics, documentation, settings
    components/ ui/ (design system) and simulator/
    data/       static algorithm catalog (mirrors backend registry)
    i18n/       en + ar dictionaries with RTL
    services/   REST client (src/services/api.ts)
    styles/     design tokens + component styles
docker/         backend & frontend Dockerfiles
docs/           architecture, API, algorithms, testing, user guide
```

## Quick start (development)

### Backend

```bash
python -m venv .venv
.venv\Scripts\activate               # Windows
source .venv/bin/activate            # macOS / Linux

pip install -r requirements.txt        # from the repo root
cd backend
uvicorn app.main:app --reload        # http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev                          # http://127.0.0.1:5173
```

Set `VITE_API_URL` in `frontend/.env` (default: `http://127.0.0.1:8000/api`).

### Tests

```bash
cd backend
set PYTHONPATH=D:\path\to\project\backend   # Windows PowerShell
$env:PYTHONPATH = "$PWD"                    # or simply run from backend/
python -m pytest -q
```

All 190 tests must pass.

## Docker

```bash
docker compose up --build
# backend  → http://127.0.0.1:8000/docs
# frontend → http://127.0.0.1:5173
```

## API (summary)

| Method | Endpoint                     | Purpose                                 |
| ------ | ---------------------------- | ---------------------------------------- |
| GET    | `/api/health`                | Service health                           |
| GET    | `/api/algorithms`            | Algorithm catalog with UI field specs    |
| GET    | `/api/algorithms/{id}`       | Single algorithm metadata                |
| POST   | `/api/algorithms/execute`    | `{algorithm, operation, inputs}` → result + steps |
| POST   | `/api/math/{tool}`           | Mathematics lab tools                    |
| GET    | `/api/exercises`             | Practice exercises                       |
| POST   | `/api/exercises/{id}/check`  | Grade an answer                          |
| GET    | `/api/quizzes/questions`     | Generate quiz questions                  |
| POST   | `/api/quizzes/check`         | Grade answers (`{qid: optionText}`)      |

Swagger/OpenAPI documentation: `http://127.0.0.1:8000/docs`.

## Documentation

See [`docs/`](docs/): [architecture](docs/architecture.md),
[installation](docs/installation.md), [algorithms](docs/algorithms.md),
[api](docs/api.md), [testing](docs/testing.md), [user guide](docs/user-guide.md).

## Security notes

All cryptographic material here is for **education**. Deprecated algorithms
(DES, 3DES) are marked as such; MD5 and SHA-1 are marked **broken** and must not
be used to protect real data; RSA and ElGamal are textbook implementations and
MUST NOT be used to protect real data without proper padding (OAEP etc.).
# cryptography-course-simulator
