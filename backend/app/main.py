"""FastAPI application entry point.

Run with:  uvicorn app.main:app --reload
"""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.api.routes import api
from backend.app.core.config import settings
from backend.app.core.logging import get_logger
from backend.app.utils.errors import AlgorithmError

logger = get_logger("app.main")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=settings.description,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/api")


@app.exception_handler(AlgorithmError)
async def algorithm_error_handler(request: Request, exc: AlgorithmError) -> JSONResponse:
    logger.info("AlgorithmError on %s: %s (%s)", request.url.path, exc.message,
                exc.code)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.code,
            "message": exc.message,
            "status": exc.status_code,
            "path": str(request.url.path),
        },
    )


@app.exception_handler(Exception)
async def unhandled_error_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error on %s: %s", request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_error",
            "message": "An unexpected error occurred. Please contact the course "
                       "administrator.",
            "status": 500,
            "path": str(request.url.path),
        },
    )


@app.on_event("startup")
async def on_startup() -> None:
    logger.info("Starting %s v%s", settings.app_name, settings.app_version)
