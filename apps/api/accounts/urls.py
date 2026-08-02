"""Routes for the account and session API."""

from django.urls import path

from accounts import views

app_name = "accounts"

urlpatterns = [
    path("csrf/", views.csrf_cookie, name="csrf"),
    path("register/", views.register, name="register"),
    path("login/", views.log_in, name="login"),
    path("logout/", views.log_out, name="logout"),
    path("me/", views.me, name="me"),
]
