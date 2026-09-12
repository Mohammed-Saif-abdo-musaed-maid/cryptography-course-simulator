"""Pydantic schemas for API requests and responses."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class AlgorithmRequest(BaseModel):
    """Generic operation request against a registered algorithm."""

    algorithm: str = Field(..., description="Algorithm id from the catalog")
    operation: str = Field(..., description="Operation, e.g. encrypt / decrypt / hash")
    inputs: Dict[str, Any] = Field(..., description="Operation inputs per field spec")


class ExerciseRequest(BaseModel):
    """A request to grade a practice exercise."""

    exercise_id: str = Field(..., description="Exercise identifier")
    answer: str = Field(..., description="Student's submitted answer")


class QuizAnswer(BaseModel):
    """One answered quiz question."""

    question_id: str = Field(...)
    category: str = Field(...)
    selected_index: Optional[int] = Field(None)


class QuizSubmitRequest(BaseModel):
    """Submit answers for a quiz round."""

    category: str = Field(..., description="Quiz category")
    difficulty: str = Field(default="mixed", description="easy / medium / hard / mixed")
    answers: Dict[str, int] = Field(default_factory=dict, description="question_id → selected option index")


# ---------------------------------------------------------------------------
# Responses.
# ---------------------------------------------------------------------------


class StepDetail(BaseModel):
    step: int
    title: str
    description: str
    input: str
    output: str
    detail: Optional[Dict[str, Any]] = None


class AlgorithmResult(BaseModel):
    algorithm: str
    operation: str
    input: str
    parameters: Dict[str, Any]
    result: Any
    extra: Optional[Dict[str, Any]] = None
    steps: List[StepDetail] = Field(default_factory=list)


class CatalogItem(BaseModel):
    id: str
    name: str
    category: str
    category_label: str
    operations: List[str]
    fields: List[Dict[str, Any]]
    security_status: str
    reversible: bool
    key_kind: str
    block_size: str
    description: str
    formula: str


class CatalogResponse(BaseModel):
    algorithms: List[CatalogItem]
    categories: Dict[str, int]


class ErrorResponse(BaseModel):
    error: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Human-readable error message")
    status: int
    path: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    app: str
    version: str