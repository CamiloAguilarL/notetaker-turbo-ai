"""API validation and representations for notes."""

from rest_framework import serializers

from notes.models import Category, Note


class CategorySerializer(serializers.ModelSerializer):
    """Category metadata plus the current user's note count."""

    note_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "color_key", "note_count")
        read_only_fields = fields


class NoteSerializer(serializers.ModelSerializer):
    """Create, update, and represent one private note."""

    category = serializers.SlugRelatedField(
        slug_field="slug", queryset=Category.objects.all(), required=False
    )
    content = serializers.CharField(allow_blank=True, required=False, max_length=10_000)

    class Meta:
        model = Note
        fields = (
            "id",
            "category",
            "title",
            "content",
            "manual_order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "manual_order", "created_at", "updated_at")
        extra_kwargs = {
            "title": {
                "allow_blank": True,
                "required": False,
                "max_length": 120,
            }
        }

    def create(self, validated_data: dict) -> Note:
        if "category" not in validated_data:
            try:
                validated_data["category"] = Category.objects.get(
                    slug="random-thoughts"
                )
            except Category.DoesNotExist as exc:
                raise serializers.ValidationError(
                    {"category": ["The default category is not configured."]}
                ) from exc
        return super().create(validated_data)


class NoteReorderSerializer(serializers.Serializer):
    """Validate one complete manual-order payload."""

    note_ids = serializers.ListField(
        child=serializers.UUIDField(),
        allow_empty=True,
    )

    def validate_note_ids(self, value: list) -> list:
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Note identifiers must be unique.")
        return value
