from django.urls import path
from usuarios.views import MigrarUsuarioView, LoginJWTView, ChangePasswordView

urlpatterns = [
    path('migrar/', MigrarUsuarioView.as_view(), name='migrar_usuario'),
    path('login/', LoginJWTView.as_view(), name='login'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]
