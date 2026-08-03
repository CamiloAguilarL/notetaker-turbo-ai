"""Pagination contracts for owner-scoped note collections."""

from collections.abc import Sequence
from typing import Any

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

NOTE_PAGE_SIZE = 12


class NotePageNumberPagination(PageNumberPagination):
    """Return stable page numbers instead of environment-dependent URLs."""

    page_size = NOTE_PAGE_SIZE

    def get_paginated_response(self, data: Sequence[Any]) -> Response:
        return Response(
            {
                "count": self.page.paginator.count,
                "next_page": (
                    self.page.next_page_number() if self.page.has_next() else None
                ),
                "previous_page": (
                    self.page.previous_page_number()
                    if self.page.has_previous()
                    else None
                ),
                "results": data,
            }
        )
