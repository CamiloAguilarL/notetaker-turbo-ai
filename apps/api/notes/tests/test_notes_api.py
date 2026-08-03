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
    Note.objects.create(
        owner=user,
        category=category("school"),
        title="Deleted",
        deleted_at=timezone.now(),
    )
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
    assert created.json()["manual_order"] == 0
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


def test_paginated_list_is_private_and_exposes_stable_page_metadata(
    client: APIClient, user: User, other_user: User
) -> None:
    active = [
        Note.objects.create(
            owner=user,
            category=category("school"),
            title=f"Page note {index:02d}",
        )
        for index in range(13)
    ]
    Note.objects.create(
        owner=user,
        category=category("school"),
        title="Deleted",
        deleted_at=timezone.now(),
    )
    Note.objects.create(
        owner=other_user,
        category=category("school"),
        title="Private",
    )

    first_page = client.get(reverse("note-page"))
    second_page = client.get(reverse("note-page"), {"page": 2})

    assert first_page.status_code == status.HTTP_200_OK
    assert first_page.json()["count"] == 13
    assert first_page.json()["next_page"] == 2
    assert first_page.json()["previous_page"] is None
    assert len(first_page.json()["results"]) == 12
    assert second_page.status_code == status.HTTP_200_OK
    assert second_page.json()["count"] == 13
    assert second_page.json()["next_page"] is None
    assert second_page.json()["previous_page"] == 1
    assert len(second_page.json()["results"]) == 1
    assert {
        item["id"]
        for response in (first_page, second_page)
        for item in response.json()["results"]
    } == {str(note.id) for note in active}


def test_paginated_list_composes_filters_and_rejects_manual_order(
    client: APIClient, user: User
) -> None:
    match = Note.objects.create(
        owner=user,
        category=category("school"),
        title="Distributed systems",
    )
    Note.objects.create(
        owner=user,
        category=category("personal"),
        title="Distributed tracing",
    )

    filtered = client.get(
        reverse("note-page"),
        {"category": "school", "q": "distributed", "ordering": "updated_at"},
    )
    manual = client.get(reverse("note-page"), {"ordering": "manual"})

    assert filtered.status_code == status.HTTP_200_OK
    assert filtered.json()["count"] == 1
    assert [item["id"] for item in filtered.json()["results"]] == [str(match.id)]
    assert manual.status_code == status.HTTP_400_BAD_REQUEST
    assert "ordering" in manual.json()["error"]["fields"]


def test_search_is_case_insensitive_private_and_composes_with_category(
    client: APIClient, user: User, other_user: User
) -> None:
    title_match = Note.objects.create(
        owner=user,
        category=category("school"),
        title="Distributed Systems",
        content="Lecture notes",
    )
    body_match = Note.objects.create(
        owner=user,
        category=category("personal"),
        title="Reading list",
        content="Review distributed tracing",
    )
    Note.objects.create(
        owner=other_user,
        category=category("school"),
        title="Distributed secret",
    )
    Note.objects.create(
        owner=user,
        category=category("school"),
        title="Distributed deleted",
        deleted_at=timezone.now(),
    )

    matches = client.get(reverse("note-list"), {"q": "DISTRIBUTED"})
    school_matches = client.get(
        reverse("note-list"), {"q": "distributed", "category": "school"}
    )
    too_long = client.get(reverse("note-list"), {"q": "x" * 201})

    assert {item["id"] for item in matches.json()} == {
        str(title_match.id),
        str(body_match.id),
    }
    assert [item["id"] for item in school_matches.json()] == [str(title_match.id)]
    assert too_long.status_code == status.HTTP_400_BAD_REQUEST
    assert "q" in too_long.json()["error"]["fields"]


def test_ordering_is_allowlisted_and_deterministic(
    client: APIClient, user: User
) -> None:
    timestamp = timezone.now() - timedelta(hours=1)
    school = Note.objects.create(
        owner=user,
        category=category("school"),
        title="School",
    )
    personal = Note.objects.create(
        owner=user,
        category=category("personal"),
        title="Personal",
    )
    random = Note.objects.create(
        owner=user,
        category=category("random-thoughts"),
        title="Random",
    )
    Note.objects.filter(id__in=(school.id, personal.id)).update(updated_at=timestamp)
    Note.objects.filter(id=random.id).update(updated_at=timestamp - timedelta(days=1))

    oldest = client.get(reverse("note-list"), {"ordering": "updated_at"})
    by_category = client.get(reverse("note-list"), {"ordering": "category"})
    invalid = client.get(reverse("note-list"), {"ordering": "title"})

    expected_tie = sorted((str(school.id), str(personal.id)))
    assert [item["id"] for item in oldest.json()] == [str(random.id), *expected_tie]
    assert [item["id"] for item in by_category.json()] == [
        str(random.id),
        str(school.id),
        str(personal.id),
    ]
    assert invalid.status_code == status.HTTP_400_BAD_REQUEST
    assert "ordering" in invalid.json()["error"]["fields"]


def test_manual_order_is_stable_and_requires_the_unfiltered_collection(
    client: APIClient, user: User
) -> None:
    first = Note.objects.create(
        owner=user,
        category=category("school"),
        title="First",
        manual_order=2,
    )
    second = Note.objects.create(
        owner=user,
        category=category("personal"),
        title="Second",
        manual_order=0,
    )
    third = Note.objects.create(
        owner=user,
        category=category("drama"),
        title="Third",
        manual_order=1,
    )

    ordered = client.get(reverse("note-list"), {"ordering": "manual"})
    filtered = client.get(
        reverse("note-list"),
        {"ordering": "manual", "category": "school"},
    )
    searched = client.get(
        reverse("note-list"),
        {"ordering": "manual", "q": "first"},
    )

    assert [item["id"] for item in ordered.json()] == [
        str(second.id),
        str(third.id),
        str(first.id),
    ]
    assert filtered.status_code == status.HTTP_400_BAD_REQUEST
    assert searched.status_code == status.HTTP_400_BAD_REQUEST


def test_reorder_persists_complete_owner_scoped_order_without_editing_notes(
    client: APIClient, user: User
) -> None:
    notes = [
        Note.objects.create(
            owner=user,
            category=category("school"),
            title=f"Note {index}",
            manual_order=index,
        )
        for index in range(3)
    ]
    timestamps = {note.id: note.updated_at for note in notes}
    requested_ids = [note.id for note in reversed(notes)]

    response = client.post(
        reverse("note-reorder"),
        {"note_ids": [str(note_id) for note_id in requested_ids]},
        format="json",
    )
    ordered = client.get(reverse("note-list"), {"ordering": "manual"})

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert [item["id"] for item in ordered.json()] == [
        str(note_id) for note_id in requested_ids
    ]
    for expected_position, note_id in enumerate(requested_ids):
        note = Note.objects.get(id=note_id)
        assert note.manual_order == expected_position
        assert note.updated_at == timestamps[note_id]


def test_reorder_rejects_duplicates_missing_and_foreign_notes_without_changes(
    client: APIClient, user: User, other_user: User
) -> None:
    first = Note.objects.create(
        owner=user,
        category=category("school"),
        title="First",
        manual_order=0,
    )
    second = Note.objects.create(
        owner=user,
        category=category("personal"),
        title="Second",
        manual_order=1,
    )
    foreign = Note.objects.create(
        owner=other_user,
        category=category("drama"),
        title="Private",
        manual_order=0,
    )

    duplicate = client.post(
        reverse("note-reorder"),
        {"note_ids": [str(first.id), str(first.id)]},
        format="json",
    )
    missing = client.post(
        reverse("note-reorder"),
        {"note_ids": [str(first.id)]},
        format="json",
    )
    foreign_replacement = client.post(
        reverse("note-reorder"),
        {"note_ids": [str(first.id), str(foreign.id)]},
        format="json",
    )

    assert duplicate.status_code == status.HTTP_400_BAD_REQUEST
    assert missing.status_code == status.HTTP_400_BAD_REQUEST
    assert foreign_replacement.status_code == status.HTTP_400_BAD_REQUEST
    first.refresh_from_db()
    second.refresh_from_db()
    foreign.refresh_from_db()
    assert (first.manual_order, second.manual_order, foreign.manual_order) == (0, 1, 0)


def test_reorder_rolls_back_when_persistence_fails(
    client: APIClient,
    user: User,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    first = Note.objects.create(
        owner=user,
        category=category("school"),
        title="First",
        manual_order=0,
    )
    second = Note.objects.create(
        owner=user,
        category=category("personal"),
        title="Second",
        manual_order=1,
    )

    def fail_bulk_update(*args, **kwargs):
        raise RuntimeError("database write failed")

    monkeypatch.setattr(Note.objects, "bulk_update", fail_bulk_update)

    with pytest.raises(RuntimeError, match="database write failed"):
        client.post(
            reverse("note-reorder"),
            {"note_ids": [str(second.id), str(first.id)]},
            format="json",
        )

    first.refresh_from_db()
    second.refresh_from_db()
    assert (first.manual_order, second.manual_order) == (0, 1)


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


def test_delete_hides_note_and_restore_preserves_it(
    client: APIClient, user: User
) -> None:
    note = Note.objects.create(
        owner=user,
        category=category("school"),
        title="Keep this thought",
        content="The complete body",
    )

    deleted = client.delete(reverse("note-detail", args=[note.id]))
    hidden_list = client.get(reverse("note-list"))
    hidden_detail = client.get(reverse("note-detail", args=[note.id]))
    counts = client.get(reverse("category-list"))

    assert deleted.status_code == status.HTTP_204_NO_CONTENT
    assert hidden_list.json() == []
    assert hidden_detail.status_code == status.HTTP_404_NOT_FOUND
    assert [item["note_count"] for item in counts.json()] == [0, 0, 0, 0]
    note.refresh_from_db()
    assert note.deleted_at is not None

    restored = client.post(reverse("note-restore", args=[note.id]))

    assert restored.status_code == status.HTTP_200_OK
    assert restored.json()["title"] == "Keep this thought"
    assert restored.json()["content"] == "The complete body"
    assert restored.json()["category"] == "school"
    note.refresh_from_db()
    assert note.deleted_at is None


def test_delete_and_restore_are_owner_scoped(
    client: APIClient, other_user: User
) -> None:
    active_foreign = Note.objects.create(
        owner=other_user,
        category=category("personal"),
        title="Private active note",
    )
    deleted_foreign = Note.objects.create(
        owner=other_user,
        category=category("drama"),
        title="Private deleted note",
        deleted_at=timezone.now(),
    )

    delete_response = client.delete(reverse("note-detail", args=[active_foreign.id]))
    restore_response = client.post(reverse("note-restore", args=[deleted_foreign.id]))
    restore_active = client.post(reverse("note-restore", args=[active_foreign.id]))

    assert delete_response.status_code == status.HTTP_404_NOT_FOUND
    assert restore_response.status_code == status.HTTP_404_NOT_FOUND
    assert restore_active.status_code == status.HTTP_404_NOT_FOUND
    active_foreign.refresh_from_db()
    deleted_foreign.refresh_from_db()
    assert active_foreign.deleted_at is None
    assert deleted_foreign.deleted_at is not None


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
