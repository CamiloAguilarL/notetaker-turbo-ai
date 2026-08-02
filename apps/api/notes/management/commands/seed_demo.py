"""Create an idempotent local account with representative demo notes."""

from getpass import getpass
from uuid import NAMESPACE_URL, uuid5

from django.core.management.base import BaseCommand, CommandError, CommandParser
from django.db import transaction

from accounts.models import User
from notes.models import Category, Note
from notes.services import next_manual_order

DEMO_NOTES = (
    (
        "tiny-ideas",
        "random-thoughts",
        "Tiny ideas worth keeping",
        "The best thoughts rarely arrive with a warning. Capture them before "
        "they wander off.",
    ),
    (
        "weekend-reflections",
        "random-thoughts",
        "Weekend reflections",
        "Slow mornings, good coffee, and a page full of small ideas worth "
        "returning to.",
    ),
    (
        "system-design-plan",
        "school",
        "System design study plan",
        "Review tradeoffs, sketch the data flow, and explain one decision in "
        "plain language.",
    ),
    (
        "interview-questions",
        "school",
        "Questions for the interview",
        "Ask how the team protects quality while moving quickly and where AI "
        "creates the most leverage.",
    ),
    (
        "gentle-reminder",
        "personal",
        "A gentle reminder",
        "Make room for the moments you want to remember, not only the tasks "
        "you need to finish.",
    ),
    (
        "plot-twists",
        "drama",
        "Plot twist inventory",
        "A missed train, an unexpected message, and the suspiciously perfect "
        "ending to chapter three.",
    ),
)


class Command(BaseCommand):
    """Seed a safe, local-only notebook for the recorded walkthrough."""

    help = "Create or refresh an idempotent local demo account and sample notes."

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--email",
            default="demo@example.com",
            help="Email for the local demo account.",
        )
        parser.add_argument(
            "--password",
            help="Optional automation value; omitted values are prompted securely.",
        )

    @transaction.atomic
    def handle(self, *args: object, **options: str | None) -> None:
        email_option = options.get("email") or "demo@example.com"
        email = User.objects.normalize_identity(email_option)
        password = options.get("password") or getpass("Demo password: ")
        if len(password) < 8:
            raise CommandError("The demo password must contain at least 8 characters.")

        categories = {
            category.slug: category
            for category in Category.objects.filter(
                slug__in={item[1] for item in DEMO_NOTES}
            )
        }
        missing = sorted({item[1] for item in DEMO_NOTES} - categories.keys())
        if missing:
            raise CommandError(
                "Required categories are missing. Apply migrations before seeding."
            )

        user, user_created = User.objects.get_or_create(email=email)
        user.set_password(password)
        user.save(update_fields=("password",))

        next_order = next_manual_order(user)
        created_count = 0
        restored_count = 0
        for key, category_slug, title, content in DEMO_NOTES:
            note_id = uuid5(NAMESPACE_URL, f"turbo-notes-demo:{email}:{key}")
            note, note_created = Note.objects.get_or_create(
                id=note_id,
                defaults={
                    "owner": user,
                    "category": categories[category_slug],
                    "title": title,
                    "content": content,
                    "manual_order": next_order,
                },
            )
            if note.owner_id != user.id:
                raise CommandError("A deterministic demo identifier is already in use.")
            if note_created:
                created_count += 1
                next_order += 1
            elif note.deleted_at is not None:
                note.deleted_at = None
                note.manual_order = next_order
                note.save(update_fields=("deleted_at", "manual_order"))
                restored_count += 1
                next_order += 1

        account_action = "created" if user_created else "updated"
        self.stdout.write(
            self.style.SUCCESS(
                f"Demo account {account_action}: {email}. "
                f"Created {created_count} notes and restored {restored_count}."
            )
        )
