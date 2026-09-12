"""API routers.

Exposes:
  GET  /api/health
  GET  /api/algorithms
  GET  /api/algorithms/{algorithm_id}
  POST /api/algorithms/execute
  POST /api/math/{tool}
  POST /api/exercises/{id}/check
  GET  /api/exercises
  GET  /api/quizzes/questions
  POST /api/quizzes/check
"""

from __future__ import annotations

from fastapi import APIRouter, Query

from backend.app.core.config import settings
from backend.app.schemas.api import AlgorithmRequest, ErrorResponse, HealthResponse
from backend.app.services import algorithm_service, exercise_service, math_service, quiz_service
from backend.app.utils.errors import ValidationError

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["System"],
            summary="Service health check")
def health() -> dict:
    return {"status": "ok", "app": settings.app_name, "version": settings.app_version}


@router.get("/algorithms", tags=["Algorithms"],
            summary="List all algorithms with metadata")
def list_algorithms() -> dict:
    return algorithm_service.get_catalog()


@router.get("/algorithms/{algorithm_id}", tags=["Algorithms"],
            summary="Metadata for a single algorithm")
def algorithm_detail(algorithm_id: str) -> dict:
    return algorithm_service.get_algorithm_detail(algorithm_id)


@router.post("/algorithms/execute", tags=["Algorithms"],
             summary="Run an algorithm operation with structured step output",
             responses={422: {"model": ErrorResponse}})
def execute(request: AlgorithmRequest) -> dict:
    return algorithm_service.execute(request.algorithm, request.operation, request.inputs)


# ---------------------------------------------------------------------------
# Mathematics laboratory.
# ---------------------------------------------------------------------------

MATH_TOOLS = {
    "modular": math_service.modular_arithmetic,
    "gcd": math_service.gcd_tool,
    "extended-euclid": math_service.extended_euclid,
    "modular-inverse": math_service.modular_inverse,
    "prime-check": math_service.prime_check,
    "totient": math_service.totient,
    "mod-pow": math_service.mod_pow_tool,
}


@router.get("/math/tools", tags=["Mathematics"],
            summary="List available math lab tools")
def math_tools() -> dict:
    return {"tools": [t for t in MATH_TOOLS]}


@router.post("/math/{tool}", tags=["Mathematics"],
             summary="Run a mathematics laboratory tool")
def run_math_tool(tool: str, body: dict) -> dict:
    handler = MATH_TOOLS.get(tool)
    if handler is None:
        raise ValidationError(f"Unknown math tool '{tool}'", "unknown_tool")
    if tool == "modular":
        args = [body.get(k) for k in ("a", "b", "modulus")]
        return handler(args[0], args[1], args[2])
    return _dispatch_math(tool, body, handler)


def _dispatch_math(tool: str, body: dict, handler) -> dict:
    if tool == "gcd" or tool == "extended-euclid":
        return handler(body.get("a"), body.get("b"))
    if tool == "modular-inverse":
        return handler(body.get("a"), body.get("modulus"))
    if tool == "prime-check" or tool == "totient":
        return handler(body.get("n"))
    if tool == "mod-pow":
        return handler(body.get("base"), body.get("exponent"), body.get("modulus"))
    raise ValidationError(f"Unknown math tool '{tool}'", "unknown_tool")


# ---------------------------------------------------------------------------
# Exercises and quizzes.
# ---------------------------------------------------------------------------


@router.get("/exercises", tags=["Practice"],
            summary="List practice exercises")
def list_exercises(category: str = Query(default="all")) -> dict:
    return exercise_service.list_exercises(category)


@router.get("/exercises/{exercise_id}", tags=["Practice"],
            summary="Fetch a single exercise without revealing the answer")
def get_exercise(exercise_id: str) -> dict:
    return exercise_service.get_exercise(exercise_id)


@router.post("/exercises/{exercise_id}/check", tags=["Practice"],
             summary="Check a submitted answer with explanation")
def check_exercise(exercise_id: str, body: dict) -> dict:
    answer = body.get("answer")
    if answer is None:
        raise ValidationError("answer is required", "missing_input")
    return exercise_service.check_exercise(exercise_id, answer)


@router.get("/quizzes/questions", tags=["Practice"],
            summary="Generate quiz questions")
def quiz_questions(category: str = Query(default="mixed"),
                   difficulty: str = Query(default="mixed"),
                   count: int = Query(default=8, ge=1, le=30)) -> dict:
    return quiz_service.generate_questions(category, difficulty, count)


@router.post("/quizzes/check", tags=["Practice"],
             summary="Grade a set of quiz answers")
def quiz_check(body: dict) -> dict:
    answers = body.get("answers", {})
    category = body.get("category", "mixed")
    difficulty = body.get("difficulty", "mixed")
    return quiz_service.grade(answers, category, difficulty)
