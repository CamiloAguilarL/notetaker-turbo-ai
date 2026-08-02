"""Transactional note workflows shared by API entry points."""

from collections.abc import Sequence
from uuid import UUID

from django.db import transaction
from django.db.models import Max

from accounts.models import User
from notes.models import Note


class InvalidNoteOrder(ValueError):
    """Raised when a manual order is not the owner's complete active set."""


def next_manual_order(owner: User) -> int:
    """Return a stable append position without changing edit timestamps."""

    maximum = Note.objects.filter(owner=owner).aggregate(value=Max("manual_order"))[
        "value"
    ]
    return 0 if maximum is None else maximum + 1


@transaction.atomic
def reorder_notes(*, owner: User, note_ids: Sequence[UUID]) -> None:
    """Persist the owner's complete active note order atomically."""

    if len(note_ids) != len(set(note_ids)):
        raise InvalidNoteOrder("Note identifiers must be unique.")

    notes = list(
        Note.objects.select_for_update().filter(
            owner=owner,
            deleted_at__isnull=True,
        )
    )
    note_by_id = {note.id: note for note in notes}
    if len(note_ids) != len(notes) or set(note_ids) != set(note_by_id):
        raise InvalidNoteOrder("Provide every active note exactly once.")

    ordered_notes = []
    for position, note_id in enumerate(note_ids):
        note = note_by_id[note_id]
        note.manual_order = position
        ordered_notes.append(note)

    Note.objects.bulk_update(ordered_notes, ("manual_order",))
