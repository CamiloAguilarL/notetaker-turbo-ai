"""Persistent category and note models."""

import uuid

from django.conf import settings
from django.db import models


class Category(models.Model):
    """Stable visual classification shared by every account."""

    class ColorKey(models.TextChoices):
        RANDOM = "random", "Random"
        SCHOOL = "school", "School"
        PERSONAL = "personal", "Personal"
        DRAMA = "drama", "Drama"

    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=50, unique=True)
    color_key = models.CharField(max_length=20, choices=ColorKey)
    sort_order = models.PositiveSmallIntegerField(unique=True)

    class Meta:
        ordering = ("sort_order", "id")
        verbose_name_plural = "categories"

    def __str__(self) -> str:
        return self.name


class Note(models.Model):
    """Private, editable note owned by exactly one user."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notes",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="notes",
    )
    title = models.CharField(max_length=120, blank=True)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-updated_at", "id")
        indexes = [
            models.Index(
                fields=("owner", "-updated_at"),
                name="note_owner_updated_idx",
            ),
            models.Index(
                fields=("owner", "category", "-updated_at"),
                name="note_owner_cat_updated_idx",
            ),
        ]

    def __str__(self) -> str:
        return self.title or "Untitled note"
