# meu_projeto/urls.py
from django.urls import path
from microsoftauth import views

urlpatterns = [
    path('auth/microsoft/', views.microsoft_login, name='microsoft_login'),
    path('auth/callback/', views.auth_callback, name='auth_callback'),
    path('arquivos/', views.listar_arquivos, name='listar_arquivos'),
]