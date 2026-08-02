"""Consistent JSON error responses for the public API."""

from typing import Any

from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler


def api_exception_handler(exc: Exception, context: dict[str, Any]) -> Response | None:
    """Wrap DRF exceptions in a predictable error envelope."""
    response = exception_handler(exc, context)
    if response is None:
        return None

    data = response.data
    if isinstance(data, dict) and set(data) == {"detail"}:
        code = "request_error"
        if isinstance(exc, APIException):
            exception_code = exc.get_codes()
            if isinstance(exception_code, str):
                code = exception_code

        response.data = {
            "error": {
                "code": code,
                "message": str(data["detail"]),
            }
        }
        return response

    response.data = {
        "error": {
            "code": "validation_error",
            "message": "Please correct the highlighted fields.",
            "fields": data,
        }
    }
    return response
