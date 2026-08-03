"""Create an idempotent local account with a complete demo notebook."""

from getpass import getpass
from uuid import NAMESPACE_URL, uuid5

from django.core.management.base import BaseCommand, CommandError, CommandParser
from django.db import transaction

from accounts.models import User
from notes.models import Category, Note
from notes.services import next_manual_order

REPRESENTATIVE_NOTES = (
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

COLLECTION_ENTRIES = (
    (
        "random-thoughts",
        (
            (
                "random-coffee-question",
                "A question for the next coffee",
                "What would feel lighter if I gave it ten uninterrupted minutes?",
            ),
            (
                "random-small-win",
                "Small wins count",
                "The useful idea was the one I wrote down before it disappeared.",
            ),
            (
                "random-evening-reset",
                "Evening reset",
                "Close the open loops, leave one kind note for tomorrow, and stop.",
            ),
            (
                "random-keep-looking",
                "Keep looking",
                "The detail that seems out of place may be the beginning of the story.",
            ),
        ),
    ),
    (
        "school",
        (
            (
                "school-api-boundaries",
                "API boundary notes",
                "Write down ownership, validation, and the error contract before "
                "coding.",
            ),
            (
                "school-testing-checklist",
                "Testing checklist",
                "Cover the happy path, invalid input, permissions, and the retry "
                "state.",
            ),
            (
                "school-frontend-review",
                "Frontend review prompts",
                "Check loading, empty, error, keyboard, reduced motion, and narrow "
                "screens.",
            ),
            (
                "school-reading-list",
                "Reading list for later",
                "Keep the references that explain the decision, not only the final "
                "answer.",
            ),
        ),
    ),
    (
        "personal",
        (
            (
                "personal-slow-morning",
                "A slow morning plan",
                "Make breakfast, take the long route, and protect the first quiet "
                "hour.",
            ),
            (
                "personal-people-to-call",
                "People to call",
                "Send the message now instead of waiting for a perfect reason to "
                "reconnect.",
            ),
            (
                "personal-weekly-reset",
                "Weekly reset",
                "Choose three priorities, clear the desk, and leave room for the "
                "unexpected.",
            ),
            (
                "personal-things-to-remember",
                "Things worth remembering",
                "Good work needs energy, sleep, and a life outside the task list.",
            ),
            (
                "personal-next-adventure",
                "The next small adventure",
                "Find a nearby place with a new street, a good bookshop, or a view.",
            ),
        ),
    ),
    (
        "drama",
        (
            (
                "drama-opening-image",
                "Opening image ideas",
                "Start with the empty room, the missed call, and one object nobody "
                "explains.",
            ),
            (
                "drama-character-secret",
                "Character secret",
                "The person who knows the truth should have the most to lose by "
                "saying it.",
            ),
            (
                "drama-second-act",
                "Second act pressure",
                "Force the easy plan to work once, then make its hidden cost "
                "impossible to ignore.",
            ),
            (
                "drama-ending-options",
                "Ending options",
                "Leave one answer clear, one answer tender, and one answer for the "
                "reader.",
            ),
            (
                "drama-scene-fragments",
                "Scene fragments",
                "A train platform, a borrowed coat, and a sentence that arrives too "
                "late.",
            ),
        ),
    ),
)

DEMO_NOTES = REPRESENTATIVE_NOTES + tuple(
    (key, category_slug, title, content)
    for category_slug, entries in COLLECTION_ENTRIES
    for key, title, content in entries
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
