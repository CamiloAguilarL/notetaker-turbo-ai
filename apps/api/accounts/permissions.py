"""Security permissions for public session mutations."""

from rest_framework.authentication import CSRFCheck
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class HasValidCsrfToken(BasePermission):
    """Require Django's double-submit token without requiring a user session."""

    message = "CSRF verification failed. Refresh the form and try again."

    def has_permission(self, request: Request, view: APIView) -> bool:
        del view
        check = CSRFCheck(lambda _: None)
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason is not None:
            raise PermissionDenied(self.message)
        return True
