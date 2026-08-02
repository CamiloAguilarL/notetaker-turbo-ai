"""Integration tests for session authentication endpoints."""

import pytest
from django.db import IntegrityError
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from accounts.models import User

pytestmark = pytest.mark.django_db

EMAIL = "friend@example.com"
PASSWORD = "A-secure-passphrase-2026"


def csrf_token(client: APIClient) -> str:
    response = client.get(reverse("accounts:csrf"))
    assert response.status_code == status.HTTP_200_OK
    return response.cookies["csrftoken"].value


def test_register_creates_normalized_user_and_session() -> None:
    client = APIClient(enforce_csrf_checks=True)
    missing_csrf = client.post(
        reverse("accounts:register"),
        {"email": "Friend@EXAMPLE.COM", "password": PASSWORD},
    )
    token = csrf_token(client)

    response = client.post(
        reverse("accounts:register"),
        {"email": "Friend@EXAMPLE.COM", "password": PASSWORD},
        HTTP_X_CSRFTOKEN=token,
    )

    assert missing_csrf.status_code == status.HTTP_403_FORBIDDEN
    assert missing_csrf.json()["error"]["code"] == "permission_denied"
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["email"] == EMAIL
    user = User.objects.get(email=EMAIL)
    assert user.check_password(PASSWORD)
    assert client.get(reverse("accounts:me")).json()["id"] == user.id


def test_register_rejects_duplicate_and_weak_password() -> None:
    User.objects.create_user(email=EMAIL, password=PASSWORD)
    client = APIClient(enforce_csrf_checks=True)
    token = csrf_token(client)

    duplicate = client.post(
        reverse("accounts:register"),
        {"email": EMAIL.upper(), "password": PASSWORD},
        HTTP_X_CSRFTOKEN=token,
    )
    weak = client.post(
        reverse("accounts:register"),
        {"email": "other@example.com", "password": "password"},
        HTTP_X_CSRFTOKEN=token,
    )

    assert duplicate.status_code == status.HTTP_400_BAD_REQUEST
    assert duplicate.json()["error"]["code"] == "validation_error"
    assert "email" in duplicate.json()["error"]["fields"]
    assert weak.status_code == status.HTTP_400_BAD_REQUEST
    assert "non_field_errors" in weak.json()["error"]["fields"]


def test_login_accepts_normalized_email_and_rejects_bad_credentials() -> None:
    user = User.objects.create_user(email=EMAIL, password=PASSWORD)
    client = APIClient(enforce_csrf_checks=True)

    missing_csrf = client.post(
        reverse("accounts:login"),
        {"email": EMAIL, "password": PASSWORD},
    )
    token = csrf_token(client)

    invalid = client.post(
        reverse("accounts:login"),
        {"email": EMAIL, "password": "wrong-password"},
        HTTP_X_CSRFTOKEN=token,
    )
    valid = client.post(
        reverse("accounts:login"),
        {"email": EMAIL.upper(), "password": PASSWORD},
        HTTP_X_CSRFTOKEN=token,
    )

    assert missing_csrf.status_code == status.HTTP_403_FORBIDDEN
    assert missing_csrf.json()["error"]["code"] == "permission_denied"
    assert invalid.status_code == status.HTTP_400_BAD_REQUEST
    assert invalid.json()["error"]["fields"]["non_field_errors"] == [
        "Invalid email or password."
    ]
    assert valid.status_code == status.HTTP_200_OK
    assert valid.json() == {"id": user.id, "email": EMAIL}
    assert client.get(reverse("accounts:me")).status_code == status.HTTP_200_OK


def test_logout_requires_authentication_and_csrf() -> None:
    user = User.objects.create_user(email=EMAIL, password=PASSWORD)
    client = APIClient(enforce_csrf_checks=True)

    anonymous = client.post(reverse("accounts:logout"))
    client.force_login(user)
    missing_csrf = client.post(reverse("accounts:logout"))
    token = csrf_token(client)
    success = client.post(reverse("accounts:logout"), HTTP_X_CSRFTOKEN=token)

    assert anonymous.status_code == status.HTTP_403_FORBIDDEN
    assert missing_csrf.status_code == status.HTTP_403_FORBIDDEN
    assert success.status_code == status.HTTP_204_NO_CONTENT
    assert client.get(reverse("accounts:me")).status_code == status.HTTP_403_FORBIDDEN


def test_user_manager_validates_required_superuser_flags() -> None:
    with pytest.raises(ValueError, match="email address is required"):
        User.objects.create_user(email="", password=PASSWORD)

    with pytest.raises(ValueError, match="is_staff=True"):
        User.objects.create_superuser(
            email="admin@example.com", password=PASSWORD, is_staff=False
        )

    with pytest.raises(ValueError, match="is_superuser=True"):
        User.objects.create_superuser(
            email="admin@example.com", password=PASSWORD, is_superuser=False
        )


def test_user_string_and_database_uniqueness() -> None:
    user = User.objects.create_user(email=EMAIL, password=PASSWORD)

    assert str(user) == EMAIL
    with pytest.raises(IntegrityError):
        User.objects.create(email=EMAIL)
