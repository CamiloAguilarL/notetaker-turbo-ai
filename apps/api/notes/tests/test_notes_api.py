"""Integration tests for categories and user-scoped notes."""

from datetime import timedelta

import pytest
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from accounts.models import User
from notes.models import Category, Note

pytestmark = pytest.mark.django_db


@pytest.fixture
def user() -> User:
    return User.objects.create_user(
        email="writer@example.com", password="A-secure-passphrase-2026"
    )


@pytest.fixture
def other_user() -> User:
    return User.objects.create_user(
        email="other@example.com", password="A-secure-passphrase-2026"
    )


@pytest.fixture
def client(user: User) -> APIClient:
    api_client = APIClient()
    api_client.force_authenticate(user)
    return api_client


def category(slug: str) -> Category:
    return Category.objects.get(slug=slug)


def test_categories_are_seeded_in_stable_order_with_user_counts(
    client: APIClient, user: User, other_user: User
) -> None:
    Note.objects.create(owner=user, category=category("school"), title="One")
    Note.objects.create(owner=other_user, category=category("school"), title="Private")

    response = client.get(reverse("category-list"))

    assert response.status_code == status.HTTP_200_OK
    assert [item["slug"] for item in response.json()] == [
        "random-thoughts",
        "school",
        "personal",
        "drama",
    ]
    assert [item["note_count"] for item in response.json()] == [0, 1, 0, 0]


def test_notes_and_categories_require_authentication() -> None:
    anonymous = APIClient()

    categories = anonymous.get(reverse("category-list"))
    notes = anonymous.get(reverse("note-list"))

    assert categories.status_code == status.HTTP_403_FORBIDDEN
    assert notes.status_code == status.HTTP_403_FORBIDDEN


def test_create_note_defaults_category_and_validates_input(
    client: APIClient, user: User
) -> None:
    created = client.post(
        reverse("note-list"), {"title": "A useful thought", "content": "Body"}
    )
    invalid_category = client.post(reverse("note-list"), {"category": "missing"})
    too_long = client.post(reverse("note-list"), {"content": "x" * 10_001})

    assert created.status_code == status.HTTP_201_CREATED
    assert created.json()["category"] == "random-thoughts"
    assert Note.objects.get(id=created.json()["id"]).owner == user
    assert invalid_category.status_code == status.HTTP_400_BAD_REQUEST
    assert "category" in invalid_category.json()["error"]["fields"]
    assert too_long.status_code == status.HTTP_400_BAD_REQUEST
    assert "content" in too_long.json()["error"]["fields"]


def test_list_is_private_filterable_and_recently_updated_first(
    client: APIClient, user: User, other_user: User
) -> None:
    older = Note.objects.create(owner=user, category=category("school"), title="Older")
    newer = Note.objects.create(
        owner=user, category=category("personal"), title="Newer"
    )
    Note.objects.create(owner=other_user, category=category("school"), title="Secret")
    Note.objects.filter(id=older.id).update(
        updated_at=timezone.now() - timedelta(days=1)
    )

    all_notes = client.get(reverse("note-list"))
    filtered = client.get(reverse("note-list"), {"category": "school"})
    unknown = client.get(reverse("note-list"), {"category": "unknown"})

    assert [item["id"] for item in all_notes.json()] == [
        str(newer.id),
        str(older.id),
    ]
    assert [item["id"] for item in filtered.json()] == [str(older.id)]
    assert unknown.status_code == status.HTTP_400_BAD_REQUEST


def test_retrieve_and_patch_are_owner_scoped(
    client: APIClient, user: User, other_user: User
) -> None:
    note = Note.objects.create(owner=user, category=category("school"), title="Before")
    foreign = Note.objects.create(
        owner=other_user, category=category("personal"), title="Private"
    )

    retrieved = client.get(reverse("note-detail", args=[note.id]))
    patched = client.patch(
        reverse("note-detail", args=[note.id]),
        {"title": "After", "category": "personal"},
    )
    forbidden_read = client.get(reverse("note-detail", args=[foreign.id]))
    forbidden_patch = client.patch(
        reverse("note-detail", args=[foreign.id]), {"title": "Stolen"}
    )

    assert retrieved.status_code == status.HTTP_200_OK
    assert patched.status_code == status.HTTP_200_OK
    note.refresh_from_db()
    assert (note.title, note.category.slug) == ("After", "personal")
    assert forbidden_read.status_code == status.HTTP_404_NOT_FOUND
    assert forbidden_patch.status_code == status.HTTP_404_NOT_FOUND
    foreign.refresh_from_db()
    assert foreign.title == "Private"


def test_delete_is_not_part_of_p0_api(client: APIClient, user: User) -> None:
    note = Note.objects.create(owner=user, category=category("school"), title="Keep")

    response = client.delete(reverse("note-detail", args=[note.id]))

    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
    assert Note.objects.filter(id=note.id).exists()


def test_note_list_avoids_category_n_plus_one(
    client: APIClient, user: User, django_assert_num_queries
) -> None:
    for index in range(5):
        Note.objects.create(
            owner=user,
            category=category("school"),
            title=f"Note {index}",
        )

    with django_assert_num_queries(1):
        response = client.get(reverse("note-list"))

    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 5


def test_model_strings_are_human_readable(user: User) -> None:
    school = category("school")
    titled = Note.objects.create(owner=user, category=school, title="Readable title")
    untitled = Note.objects.create(owner=user, category=school)

    assert str(school) == "School"
    assert str(titled) == "Readable title"
    assert str(untitled) == "Untitled note"
