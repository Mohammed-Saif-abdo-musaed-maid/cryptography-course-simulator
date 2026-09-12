# Deployment Guide — Cryptography Course Simulator

This guide deploys the application **publically** so anyone can use it without
running servers on your computer:

```
Internet User
     │
     ▼
Vercel (frontend React + Vite)
     │  HTTPS API calls to /api
     ▼
Render (FastAPI backend)
     │
     ▼
Cryptography Engine (35 algorithms)
```

> Facts verified against this repository: frontend = React 18 + TypeScript +
> Vite 6 in `frontend/` (build output `dist`); backend = FastAPI in `backend/`
> (entry `app.main:app`, REST API under `/api`, health at `/api/health`);
> dependencies in the **repo-root** `requirements.txt`.

---

## Architecture summary

| Part | Hosting | Root directory | Build command | Start command |
| --- | --- | --- | --- | --- |
| Backend (FastAPI) | Render (free web service) | `.` (repo root) | `pip install -r requirements.txt` | `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Frontend (React/Vite) | Vercel | `frontend` | `npm run build` | *(static — Vercel serves `dist`)* |

Environment variables used:

| Variable | Where it lives | Purpose |
| --- | --- | --- |
| `CORS_ORIGINS` | Render dashboard | Comma-separated browser origins allowed to call the API (e.g. the Vercel URL). Local dev origins are always auto-allowed by the backend. |
| `LOG_LEVEL` | Render dashboard | `info` (production). |
| `BACKEND_HOST` | Render dashboard | `0.0.0.0` (bind all interfaces). |
| `VITE_API_URL` | Vercel dashboard | Full base URL of the deployed backend API → `https://<YOUR-BACKEND>.onrender.com/api` |
| `APP_NAME`, `APP_VERSION` | Optional | Shown in the `/api/health` response. |

---

## Part A — Backend deployment (Render, free tier)

### Render setup (manual)

1. Go to <https://render.com> → **Sign up / Sign in** (GitHub auth).
2. Click **New +** → **Web Service**.
3. **Connect a repository** → select
   `Mohammed-Saif-abdo-musaed-maid/cryptography-course-simulator`
   (you may need to give Render read access to the repo the first time).
4. **Branch:** `main`.
5. **Name:** `cryptography-course-simulator-backend`. It becomes
   `https://cryptography-course-simulator-backend.onrender.com`.
6. **Region:** choose the one closest to you (any works).
7. **Runtime:** `Python 3` (pick `3.11` or `3.12` — the app runs on 3.11+).
8. **Root Directory:** `.` *(the repository root — `requirements.txt` lives here)*.
9. **Build Command:**
   ```
   pip install -r requirements.txt
   ```
10. **Start Command:**
    ```
    cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
    ```
11. **Instance Type / Plan:** Free.
12. Expand **Environment Variables** and add:

    | Key | Value |
    | --- | --- |
    | `CORS_ORIGINS` | `https://mohammed-saif-cryptography-course-simulator.vercel.app` |
    | `LOG_LEVEL` | `info` |
    | `BACKEND_HOST` | `0.0.0.0` |
    | `APP_NAME` | `Cryptography & Information Security Simulator` |

    (Render injects `PORT` automatically — do not set it yourself.)
13. Click **Deploy Web Service** and wait for the build to finish (first build
    installs `bcrypt`, `argon2-cffi`, `cryptography`, … — can take a few
    minutes).
14. When the status shows **Live**, open the **Health Check** URL:
    ```
    https://cryptography-course-simulator-backend.onrender.com/api/health
    ```
    Expected:
    ```json
    {"status":"ok","app":"Cryptography & Information Security Simulator","version":"1.0.0"}
    ```
15. Test a real endpoint (Swagger docs):
    ```
    https://cryptography-course-simulator-backend.onrender.com/docs
    ```
    Or curl the API:
    ```
    curl https://cryptography-course-simulator-backend.onrender.com/api/algorithms
    ```

> **Note on the free plan:** Render free web services **sleep after ~15 minutes
> of inactivity**. The first request after sleeping takes ~30-60 s to wake up.
> The frontend shows a clear network message during that time; just refresh.

### Alternative: `render.yaml` blueprint

This repository ships a `render.yaml` blueprint with the exact same settings.
If you prefer, on Render click **New +** → **Blueprint**, connect the repo, and
review the generated service. The fields above are still the ones you must
verify.

---

## Part B — Frontend deployment (Vercel)

### Vercel setup (manual)

1. Go to <https://vercel.com> → **Sign up / Sign in** (GitHub auth).
2. Click **Add New…** → **Project**.
3. **Import Git Repository** → select
   `Mohammed-Saif-abdo-musaed-maid/cryptography-course-simulator`.
4. Vercel auto-detects Vite. Set **Root Directory:** `frontend`.
   (Only the `frontend/` folder is used for this deployment.)
5. Confirm the settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build` *(runs `tsc -b && vite build`)*
   - **Output Directory:** `dist`
6. Expand **Environment Variables** and add:

   | Key | Value |
   | --- | --- |
   | `VITE_API_URL` | `https://cryptography-course-simulator-backend.onrender.com/api` |

   Replace the host with **your actual Render URL** from Part A. Include the
   trailing `/api`.
7. Click **Deploy** and wait for the build to finish.
8. Open the generated URL, e.g.
   `https://mohammed-saif-cryptography-course-simulator.vercel.app`.
9. **SPA routing:** this repo includes `frontend/vercel.json`, so refreshing a
   deep link such as `/algorithms/aes` (or `/compare`, `/exercises`, …) serves
   `index.html` instead of a 404.

---

## Part C — Connect frontend ↔ backend (verify end to end)

The connection is done through **`VITE_API_URL`** (frontend) and
**`CORS_ORIGINS`** (backend). After both services are live:

1. Confirm the backend health endpoint returns `{"status":"ok",…}` (Part A.14).
2. Confirm Vercel has `VITE_API_URL` set to your Render URL + `/api`.
   If you changed the backend name after the first deploy, update the variable
   and click **Redeploy** so the value is baked into the production build.
3. Open the public frontend URL and exercise the loop:

   ```
   Frontend URL  →  open an algorithm  →  configure inputs  →  Run
   →  fetch/VITE_API_URL  →  Render backend  →  result + steps[]  →  UI
   →  2D simulation / 3D simulation (render the real trace)
   ```

4. If you see a network/connection error:
   - Open the browser DevTools → **Network** → reload → check the API request
     URL starts with your Render URL (not `localhost`/`127.0.0.1`).
   - Check the request's `Origin` header is the Vercel URL **and** that URL is
     in the backend's `CORS_ORIGINS` (Render → service → Environment).
   - If the Render service is awake but slow, wait for the first cold start.
   - Look at Render **Logs** tab for any backend errors.

---

## Environment / security checklist

- No secrets are required by this app (it is fully stateless and has no API
  keys). Keep it that way — never add credentials to `.env` files, code, or the
  README.
- `.env` files are **not** committed (see `.gitignore`). Only `.env.example`
  templates are in the repo.
- The backend `/api/health` returns only `status`, `app`, `version` — no
  internal paths, env values, or secrets.
- CORS uses an allow-list (configured `CORS_ORIGINS` + local dev origins);
  `allow_origins=["*"]` is not used.

---

## Local development after this setup

Nothing changes locally:

```bash
# Backend
cd backend
uvicorn app.main:app --reload            # http://127.0.0.1:8000

# Frontend (another terminal)
cd frontend
npm run dev                              # http://127.0.0.1:5173
```

Local dev origins are always allowed by the backend, so `npm run dev` +
`uvicorn app.main:app --reload` work with no extra configuration.