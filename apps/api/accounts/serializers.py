"""Validation and representation for the account API."""

from typing import Any

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError, transaction
from rest_framework import serializers

from accounts.models import User


class UserSerializer(serializers.ModelSerializer):
    """Public representation of the authenticated user."""

    class Meta:
        model = User
        fields = ("id", "email")
        read_only_fields = fields


class RegistrationSerializer(serializers.ModelSerializer):
    """Create an account using a validated password."""

    password = serializers.CharField(
        write_only=True, trim_whitespace=False, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = ("email", "password")
        extra_kwargs = {"email": {"validators": []}}

    def validate_email(self, value: str) -> str:
        normalized = User.objects.normalize_identity(value)
        if User.objects.filter(email=normalized).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )
        return normalized

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        candidate = User(email=attrs["email"])
        validate_password(attrs["password"], user=candidate)
        return attrs

    def create(self, validated_data: dict[str, Any]) -> User:
        try:
            with transaction.atomic():
                return User.objects.create_user(**validated_data)
        except IntegrityError as exc:
            raise serializers.ValidationError(
                {"email": ["An account with this email already exists."]}
            ) from exc


class LoginSerializer(serializers.Serializer):
    """Validate email and password without revealing which field failed."""

    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True, trim_whitespace=False, style={"input_type": "password"}
    )

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        request = self.context.get("request")
        email = User.objects.normalize_identity(attrs["email"])
        user = authenticate(request=request, email=email, password=attrs["password"])
        if user is None or not user.is_active:
            raise serializers.ValidationError("Invalid email or password.")

        attrs["user"] = user
        return attrs
