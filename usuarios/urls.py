from django.urls import path
from usuarios.views import MigrarUsuarioView, LoginJWTView, ChangePasswordView,CrearUsuarioManualView,UsuarioListView,UsuarioDetailView,CambiarEstadoEmpleadoView

urlpatterns = [
    path('migrar/', MigrarUsuarioView.as_view(), name='migrar_usuario'),
    path('login/', LoginJWTView.as_view(), name='login'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('crear/', CrearUsuarioManualView.as_view(), name='crear_usuario_manual'),
    path('listar/', UsuarioListView.as_view(), name='listar_usuarios'),
    path('<int:id>/', UsuarioDetailView.as_view(), name='detalle_usuario'),
    path('<int:id>/estado/', CambiarEstadoEmpleadoView.as_view(), name='cambiar-estado-empleado'),


]
