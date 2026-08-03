"""Tests for the local walkthrough seed command."""

from io import StringIO

import pytest
from django.core.management import call_command
from django.core.management.base import CommandError
from django.utils import timezone

from accounts.models import User
from notes.management.commands.seed_demo import DEMO_NOTES
from notes.models import Note

pytestmark = pytest.mark.django_db


def test_seed_demo_is_idempotent_and_restores_a_deleted_sample() -> None:
    email = "walkthrough@example.com"
    first_output = StringIO()
    call_command(
        "seed_demo",
        email=email,
        password="first-demo-password",
        stdout=first_output,
    )

    user = User.objects.get(email=email)
    notes = Note.objects.filter(owner=user)
    assert user.check_password("first-demo-password")
    assert notes.count() == len(DEMO_NOTES)
    assert notes.filter(deleted_at__isnull=True).count() == len(DEMO_NOTES)
    assert set(notes.values_list("category__slug", flat=True)) == {
        "random-thoughts",
        "school",
        "personal",
        "drama",
    }
    assert "Created 24 notes and restored 0" in first_output.getvalue()

    deleted = notes.order_by("manual_order").first()
    assert deleted is not None
    deleted.deleted_at = timezone.now()
    deleted.save(update_fields=("deleted_at",))

    second_output = StringIO()
    call_command(
        "seed_demo",
        email=email,
        password="updated-demo-password",
        stdout=second_output,
    )

    user.refresh_from_db()
    assert user.check_password("updated-demo-password")
    assert Note.objects.filter(owner=user).count() == len(DEMO_NOTES)
    assert Note.objects.filter(owner=user, deleted_at__isnull=True).count() == len(
        DEMO_NOTES
    )
    assert "Created 0 notes and restored 1" in second_output.getvalue()


def test_seed_demo_rejects_short_passwords() -> None:
    with pytest.raises(CommandError, match="at least 8 characters"):
        call_command(
            "seed_demo",
            email="walkthrough@example.com",
            password="short",
        )
