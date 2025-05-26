from rest_framework import permissions

class TienePermiso(permissions.BasePermission):
    """
    Verifica si el usuario autenticado tiene un permiso específico a través de su rol.
    """

    def has_permission(self, request, view):
        permiso_requerido = getattr(view, 'permiso_requerido', None)

        if not permiso_requerido:
            return True  # No se especificó un permiso, permitir por defecto

        if not request.user.is_authenticated:
            return False

        rol = getattr(request.user, 'rol', None)
        if not rol:
            return False

        # Verificar si el rol tiene el permiso requerido
        return rol.permisos.filter(nombre=permiso_requerido, activo=True).exists()