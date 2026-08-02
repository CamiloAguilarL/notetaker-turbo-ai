from django.db import migrations


CATEGORIES = (
    {
        "name": "Random Thoughts",
        "slug": "random-thoughts",
        "color_key": "random",
        "sort_order": 1,
    },
    {
        "name": "School",
        "slug": "school",
        "color_key": "school",
        "sort_order": 2,
    },
    {
        "name": "Personal",
        "slug": "personal",
        "color_key": "personal",
        "sort_order": 3,
    },
    {
        "name": "Drama",
        "slug": "drama",
        "color_key": "drama",
        "sort_order": 4,
    },
)


def seed_categories(apps, schema_editor):
    del schema_editor
    Category = apps.get_model("notes", "Category")
    for category in CATEGORIES:
        Category.objects.update_or_create(
            slug=category["slug"], defaults=category
        )


def remove_categories(apps, schema_editor):
    del schema_editor
    Category = apps.get_model("notes", "Category")
    Category.objects.filter(
        slug__in=[category["slug"] for category in CATEGORIES]
    ).delete()


class Migration(migrations.Migration):
    dependencies = [("notes", "0001_initial")]

    operations = [
        migrations.RunPython(seed_categories, remove_categories),
    ]
