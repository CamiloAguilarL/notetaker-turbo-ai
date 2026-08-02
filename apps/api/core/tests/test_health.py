"""Tests for operational API endpoints."""

import pytest
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_health_check_reports_api_and_database_readiness(api_client: APIClient) -> None:
    response = api_client.get(reverse("core:health"))

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "api",
        "database": "ok",
    }


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()
