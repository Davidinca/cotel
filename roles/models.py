
# Create your models here.
from django.db import models

class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    activo = models.BooleanField(default=True)  # baja lógica

    def __str__(self):
        return self.nombre

class Permiso(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    roles = models.ManyToManyField(Rol, related_name='permisos')
    activo = models.BooleanField(default=True)  # baja lógica

    def __str__(self):
        return self.nombre
