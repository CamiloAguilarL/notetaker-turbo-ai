"""User-scoped category and note API views."""

from django.db.models import Count, Q, QuerySet
from rest_framework import generics, mixins, serializers, viewsets

from notes.models import Category, Note
from notes.serializers import CategorySerializer, NoteSerializer


class CategoryListView(generics.ListAPIView):
    """List stable categories with counts scoped to the active user."""

    serializer_class = CategorySerializer

    def get_queryset(self) -> QuerySet[Category]:
        return Category.objects.annotate(
            note_count=Count(
                "notes",
                filter=Q(notes__owner=self.request.user),
            )
        ).order_by("sort_order", "id")


class NoteViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """Read and mutate only notes owned by the authenticated user."""

    serializer_class = NoteSerializer
    http_method_names = ("get", "post", "patch", "head", "options")

    def get_queryset(self) -> QuerySet[Note]:
        queryset = Note.objects.filter(owner=self.request.user).select_related(
            "category"
        )
        category = self.request.query_params.get("category")
        if category:
            if not Category.objects.filter(slug=category).exists():
                raise serializers.ValidationError({"category": ["Unknown category."]})
            queryset = queryset.filter(category__slug=category)
        return queryset

    def perform_create(self, serializer: NoteSerializer) -> None:
        serializer.save(owner=self.request.user)
