"""Local admin views for notes and categories."""

from django.contrib import admin

from notes.models import Category, Note


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "color_key", "sort_order")
    ordering = ("sort_order",)
    search_fields = ("name", "slug")


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "category", "manual_order", "updated_at")
    list_filter = ("category",)
    search_fields = ("title", "owner__email")
    readonly_fields = ("id", "created_at", "updated_at")
