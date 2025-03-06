# minha_app/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path("auth/notion/start/", views.notion_auth_start, name="notion_auth_start"),
    path(
        "auth/notion/callback/", views.notion_auth_callback, name="notion_auth_callback"
    ),
    path("user/info/", views.user_info, name="user_info"),
]
