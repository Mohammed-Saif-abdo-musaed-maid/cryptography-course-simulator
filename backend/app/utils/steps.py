"""Structured execution-result helpers (the step-by-step engine).

Every algorithm returns the same shape:

    {
      "algorithm": str,
      "operation": str,
      "input": str,
      "parameters": dict,
      "result": str | dict,
      "extra": dict | None,
      "steps": [ { "step": int, "title": str, "description": str,
                   "input": str, "output": str, "detail": dict | None } ]
    }

The frontend renders these steps dynamically and never hardcodes fake
explanations.
"""

from typing import Any, List, Optional


def build_result(
    algorithm: str,
    operation: str,
    input_text: str,
    parameters: dict,
    result: Any,
    steps: Optional[List[dict]] = None,
    extra: Optional[dict] = None,
) -> dict:
    """Build a well-formed algorithm execution result."""
    return {
        "algorithm": algorithm,
        "operation": operation,
        "input": input_text,
        "parameters": parameters,
        "result": result,
        "extra": extra,
        "steps": steps or [],
    }


def step(number: int, title: str, description: str, input_: str, output: str,
         detail: Optional[dict] = None) -> dict:
    """Factory for a single step entry."""
    return {
        "step": number,
        "title": title,
        "description": description,
        "input": input_,
        "output": output,
        "detail": detail,
    }