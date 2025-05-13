from django.shortcuts import render

from rest_framework import viewsets
from .models import Rol, Permiso
from .serializers import RolSerializer, PermisoSerializer

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

    def get_queryset(self):
        return Rol.objects.filter(activo=True)

    def destroy(self, request, *args, **kwargs):
        rol = self.get_object()
        rol.activo = False
        rol.save()
        return Response({'detail': 'Rol desactivado'}, status=204)

class PermisoViewSet(viewsets.ModelViewSet):
    queryset = Permiso.objects.all()
    serializer_class = PermisoSerializer

    def get_queryset(self):
        return Permiso.objects.filter(activo=True)

    def destroy(self, request, *args, **kwargs):
        permiso = self.get_object()
        permiso.activo = False
        permiso.save()
        return Response({'detail': 'Permiso desactivado'}, status=204)
