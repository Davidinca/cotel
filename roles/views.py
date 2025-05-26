from rest_framework import viewsets
from .models import Rol, Permiso
from .serializers import RolSerializer, PermisoSerializer

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()  # Traer todos
    serializer_class = RolSerializer

    # Elimina este método si quieres ver activos e inactivos
    # def get_queryset(self):
    #     return Rol.objects.filter(activo=True)

class PermisoViewSet(viewsets.ModelViewSet):
    queryset = Permiso.objects.all()
    serializer_class = PermisoSerializer

    # Igual acá si aplicas lo mismo a permisos
    # def get_queryset(self):
    #     return Permiso.objects.filter(activo=True)
