"""Root URL configuration for the Turbo Notes API."""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("accounts.urls")),
    path("api/v1/", include("notes.urls")),
    path("api/v1/", include("core.urls")),
]
