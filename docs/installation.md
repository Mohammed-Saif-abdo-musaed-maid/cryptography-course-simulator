# Installation

## Requirements

- Python ≥ 3.11 (developed on 3.13)
- Node.js ≥ 18 (developed on 22) and npm ≥ 10
- Optional: Docker + Docker Compose

## Backend

```bash
# 1. Create and activate a virtual environment
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt        # from the repo root

# 3. Run the server (from the repository root or backend/)
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Verify: open <http://127.0.0.1:8000/docs> (Swagger UI) or:

```bash
curl http://127.0.0.1:8000/api/health
# {"status":"ok","app":"...","version":"1.0.0"}
```

## Frontend

```bash
cd frontend
npm install
npm run dev          # http://127.0.0.1:5173
```

To point the frontend at a different backend, create `frontend/.env`:

```ini
VITE_API_URL=http://127.0.0.1:8000/api
```

Production build + preview:

```bash
npm run build
npm run preview
```

## Testing

```bash
cd backend
# ensure this path is importable
$env:PYTHONPATH = "D:\<repo>\backend"     # Windows PowerShell
export PYTHONPATH="$PWD/.."                # or run pytest from backend/ dir
python -m pytest -q                        # 190 tests
```

Frontend static checks:

```bash
cd frontend
npm run build          # runs tsc -b && vite build (type-check + production bundle)
```

## Docker (single command)

```bash
docker compose up --build
```

Starts:
- `crypto-backend` → <http://127.0.0.1:8000/docs>
- `crypto-frontend` → <http://127.0.0.1:5173>

## Configuration

Environment variables (see `.env.example`):

| Variable          | Default                                    | Used by  |
| ----------------- | ------------------------------------------ | -------- |
| `BACKEND_HOST`    | `127.0.0.1`                                | backend  |
| `BACKEND_PORT`    | `8000`                                     | backend  |
| `APP_NAME`        | `Cryptography & Information Security Simulator` | backend |
| `APP_VERSION`     | `1.0.0`                                    | backend  |
| `LOG_LEVEL`       | `info`                                     | backend  |
| `CORS_ORIGINS`    | `http://127.0.0.1:5173` + `http://localhost:5173` | backend |
| `VITE_API_URL`    | `http://127.0.0.1:8000/api`                | frontend |