"""Domain exceptions with user-safe messages."""

from typing import Optional


class AlgorithmError(Exception):
    """Base class for all algorithm-domain errors."""

    status_code = 422

    def __init__(self, message: str, code: Optional[str] = None):
        super().__init__(message)
        self.message = message
        self.code = code or "algorithm_error"


class ValidationError(AlgorithmError):
    """Invalid user input (empty input, unsupported characters...)."""

    def __init__(self, message: str, code: str = "validation_error"):
        super().__init__(message, code)


class KeyValidationError(AlgorithmError):
    """Invalid key / parameters."""

    def __init__(self, message: str, code: str = "invalid_key"):
        super().__init__(message, code)


class MatrixError(AlgorithmError):
    """Hill-cipher style matrix problems."""

    def __init__(self, message: str, code: str = "invalid_matrix"):
        super().__init__(message, code)


class MathDomainError(AlgorithmError):
    """Invalid mathematical parameters (e.g. non-prime modulus)."""

    def __init__(self, message: str, code: str = "invalid_math_parameter"):
        super().__init__(message, code)