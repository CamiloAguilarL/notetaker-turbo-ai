"""Version-one category and note routes."""

from django.urls import path
from rest_framework.routers import SimpleRouter

from notes.views import CategoryListView, NoteViewSet

router = SimpleRouter()
router.register("notes", NoteViewSet, basename="note")

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    *router.urls,
]
