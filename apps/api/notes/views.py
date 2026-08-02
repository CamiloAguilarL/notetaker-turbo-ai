"""User-scoped category and note API views."""

from django.db.models import Count, Q, QuerySet
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, mixins, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from notes.models import Category, Note
from notes.serializers import (
    CategorySerializer,
    NoteReorderSerializer,
    NoteSerializer,
)
from notes.services import InvalidNoteOrder, next_manual_order, reorder_notes


class CategoryListView(generics.ListAPIView):
    """List stable categories with counts scoped to the active user."""

    serializer_class = CategorySerializer

    def get_queryset(self) -> QuerySet[Category]:
        return Category.objects.annotate(
            note_count=Count(
                "notes",
                filter=Q(
                    notes__owner=self.request.user,
                    notes__deleted_at__isnull=True,
                ),
            )
        ).order_by("sort_order", "id")


class NoteViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """Read and mutate only notes owned by the authenticated user."""

    serializer_class = NoteSerializer
    http_method_names = ("get", "post", "patch", "delete", "head", "options")
    ordering_fields = {
        "-updated_at": ("-updated_at", "id"),
        "updated_at": ("updated_at", "id"),
        "category": ("category__sort_order", "-updated_at", "id"),
        "manual": ("manual_order", "id"),
    }

    def get_queryset(self) -> QuerySet[Note]:
        queryset = Note.objects.filter(
            owner=self.request.user,
            deleted_at__isnull=True,
        ).select_related("category")
        category = self.request.query_params.get("category")
        if category:
            if not Category.objects.filter(slug=category).exists():
                raise serializers.ValidationError({"category": ["Unknown category."]})
            queryset = queryset.filter(category__slug=category)

        search = self.request.query_params.get("q", "").strip()
        if len(search) > 200:
            raise serializers.ValidationError(
                {"q": ["Search queries cannot exceed 200 characters."]}
            )
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(content__icontains=search)
            )

        ordering = self.request.query_params.get("ordering", "-updated_at")
        if ordering == "manual" and (category or search):
            raise serializers.ValidationError(
                {"ordering": ["Manual order requires all notes without search."]}
            )
        ordering_fields = self.ordering_fields.get(ordering)
        if ordering_fields is None:
            raise serializers.ValidationError(
                {"ordering": ["Choose -updated_at, updated_at, category, or manual."]}
            )
        return queryset.order_by(*ordering_fields)

    def perform_create(self, serializer: NoteSerializer) -> None:
        serializer.save(
            owner=self.request.user,
            manual_order=next_manual_order(self.request.user),
        )

    def perform_destroy(self, instance: Note) -> None:
        instance.deleted_at = timezone.now()
        instance.save(update_fields=("deleted_at", "updated_at"))

    @action(detail=True, methods=("post",))
    def restore(self, request: Request, pk: str | None = None) -> Response:
        note = get_object_or_404(
            Note.objects.select_related("category"),
            id=pk,
            owner=request.user,
            deleted_at__isnull=False,
        )
        note.deleted_at = None
        note.manual_order = next_manual_order(request.user)
        note.updated_at = timezone.now()
        note.save(update_fields=("deleted_at", "manual_order", "updated_at"))
        return Response(self.get_serializer(note).data)

    @action(detail=False, methods=("post",))
    def reorder(self, request: Request) -> Response:
        payload = NoteReorderSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        try:
            reorder_notes(
                owner=request.user,
                note_ids=payload.validated_data["note_ids"],
            )
        except InvalidNoteOrder as exc:
            raise serializers.ValidationError({"note_ids": [str(exc)]}) from exc
        return Response(status=204)
